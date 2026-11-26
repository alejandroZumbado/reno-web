import "server-only";
import { BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";
import { SOLD_RETENTION_DAYS, type StoredProduct } from "@/data/catalog";
import { demoProducts } from "@/data/products";

/**
 * Catálogo guardado como UN archivo JSON en el almacén Blob PRIVADO (reno-catalogo).
 * Por qué así y no una base de datos: Neon/Supabase piden aceptar términos en el navegador y
 * Alejandro no podía (2026-11-23). Para una sola dueña y cientos de prendas un archivo basta.
 *
 * Garantías:
 * - Privado: sin el token del proyecto nadie lo lee (una URL directa da 403).
 * - Sin pisar cambios: cada escritura usa `ifMatch` (ETag); si alguien guardó en medio, se relee y reintenta.
 * - Respaldo: antes de cada escritura se copia la versión anterior a catalogo/respaldos/ (se guardan 30).
 * - Si el archivo existe pero está dañado se LANZA error (no se cae a la semilla: eso borraría su trabajo).
 *
 * No cambiar CATALOG_PATH: es el único lugar donde viven las prendas reales.
 */

const CATALOG_PATH = "catalogo/prendas.json";
const BACKUP_PREFIX = "catalogo/respaldos/";
const MAX_BACKUPS = 30;
const MAX_WRITE_ATTEMPTS = 3;
const DAY_MS = 86_400_000;

type CatalogFile = { version: 1; updatedAt: string; products: StoredProduct[] };

export class CatalogError extends Error {}

/**
 * Opciones para leer SIEMPRE la versión actual. useCache:false salta la caché de Blob, pero Next además
 * memoriza fetch GET idénticos (y en desarrollo los guarda entre recargas): sin la cabecera única y la
 * señal, un reintento tras un conflicto leería la misma versión vieja y fallaría otra vez (ETag mismatch).
 */
export function freshRead() {
  return {
    access: "private" as const,
    useCache: false,
    abortSignal: AbortSignal.timeout(15_000),
    headers: { "x-reno-read": crypto.randomUUID() },
  };
}

async function readFile(): Promise<{ file: CatalogFile; etag: string } | null> {
  const res = await get(CATALOG_PATH, freshRead());
  if (!res) return null;
  if (res.statusCode !== 200) throw new CatalogError(`Lectura del catálogo respondió ${res.statusCode}`);
  const text = await new Response(res.stream).text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new CatalogError("El archivo del catálogo está dañado (JSON inválido). Restaurar desde catalogo/respaldos/.");
  }
  const file = parsed as CatalogFile;
  if (file?.version !== 1 || !Array.isArray(file.products)) {
    throw new CatalogError("El archivo del catálogo tiene un formato desconocido.");
  }
  // get() devuelve ETag débil (W/"...") porque la respuesta viaja comprimida; ifMatch exige el fuerte
  // y rechaza el débil siempre ("ETag mismatch"). Es el mismo hash: se quita el prefijo.
  return { file, etag: res.blob.etag.replace(/^W\//, "") };
}

/** Todas las prendas guardadas (a la venta y vendidas). Si aún no hay archivo, la semilla de ejemplo. */
export async function readCatalog(): Promise<StoredProduct[]> {
  const current = await readFile();
  return current ? current.file.products : demoProducts();
}

/**
 * Aplica un cambio al catálogo de forma segura (lee → cambia → escribe solo si nadie escribió en medio).
 * `change` recibe una copia y devuelve la lista nueva; puede lanzar para cancelar (no se escribe nada).
 */
export async function mutateCatalog(change: (products: StoredProduct[]) => StoredProduct[]): Promise<StoredProduct[]> {
  for (let attempt = 1; attempt <= MAX_WRITE_ATTEMPTS; attempt++) {
    const current = await readFile();
    const next = change(structuredClone(current ? current.file.products : demoProducts()));
    const body: CatalogFile = { version: 1, updatedAt: new Date().toISOString(), products: next };
    try {
      if (current) await backup(current.file);
      await put(CATALOG_PATH, JSON.stringify(body), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        // Primera vez: no debe existir (si otro lo creó en medio, falla y se reintenta sobre ese).
        ...(current ? { allowOverwrite: true, ifMatch: current.etag } : { allowOverwrite: false }),
      });
      return next;
    } catch (err) {
      const conflict = err instanceof BlobPreconditionFailedError || (!current && isAlreadyExists(err));
      if (conflict && attempt < MAX_WRITE_ATTEMPTS) continue;
      throw err;
    }
  }
  throw new CatalogError("No se pudo guardar: el catálogo cambió varias veces seguidas. Intenta de nuevo.");
}

function isAlreadyExists(err: unknown) {
  return err instanceof Error && /already exists/i.test(err.message);
}

/** Copia la versión anterior y deja solo las 30 más recientes. */
async function backup(file: CatalogFile) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await put(`${BACKUP_PREFIX}${stamp}.json`, JSON.stringify(file), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  const { blobs } = await list({ prefix: BACKUP_PREFIX, limit: 1000 });
  const old = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname)).slice(MAX_BACKUPS);
  if (old.length) await del(old.map((b) => b.pathname));
}

/** Pathnames en Blob de las fotos de una prenda (sus URLs son `/fotos/...` = mismo pathname con "/"). */
export function photoPathnames(product: Pick<StoredProduct, "images">) {
  return product.images.filter((u) => u.startsWith("/fotos/")).map((u) => u.slice(1));
}

export async function deletePhotos(pathnames: string[]) {
  if (pathnames.length) await del(pathnames);
}

/**
 * true si es prenda de ejemplo (id "demo-NN" de la semilla) que el botón "Quitar las de ejemplo" puede borrar.
 * Si la dueña le subió fotos suyas, la reaprovechó como prenda real: NO se borra.
 */
export function isRemovableDemo(p: StoredProduct) {
  return p.id.startsWith("demo-") && photoPathnames(p).length === 0;
}

/** true si la vendida ya cumplió los 30 días y debe borrarse. */
export function isExpired(p: StoredProduct, now = Date.now()) {
  return !!p.soldAt && now - Date.parse(p.soldAt) >= SOLD_RETENTION_DAYS * DAY_MS;
}

/** Días que le quedan a una vendida antes de borrarse (mínimo 0). */
export function daysLeft(p: StoredProduct, now = Date.now()) {
  if (!p.soldAt) return SOLD_RETENTION_DAYS;
  const left = SOLD_RETENTION_DAYS - (now - Date.parse(p.soldAt)) / DAY_MS;
  return Math.max(0, Math.ceil(left));
}

/**
 * Borra las vendidas con 30 días o más, junto con sus fotos, y las fotos huérfanas
 * (subidas en un formulario que nunca se guardó) de más de 1 día. Devuelve cuántas prendas borró.
 * La usan el cron diario (todo) y la entrada al admin (solo prendas, `orphans:false`: listar fotos en cada
 * visita gastaría operaciones de Blob; es el respaldo por si un día falla el cron).
 */
export async function purgeExpired({ now = Date.now(), orphans = true } = {}): Promise<{ products: number; orphanPhotos: number }> {
  let kept = await readCatalog();
  let removed: StoredProduct[] = [];
  // Se lee sin escribir primero: casi siempre no hay nada que borrar y así no se gasta una escritura.
  if (kept.some((p) => isExpired(p, now))) {
    kept = await mutateCatalog((list) => {
      // Se recalcula sobre la versión fresca: si la restauraron en medio, ya no está vencida y no se borra.
      removed = list.filter((p) => isExpired(p, now));
      return list.filter((p) => !isExpired(p, now));
    });
    await deletePhotos(removed.flatMap(photoPathnames));
  }
  const orphanPhotos = orphans ? await purgeOrphanPhotos(kept, now) : 0;
  return { products: removed.length, orphanPhotos };
}

async function purgeOrphanPhotos(products: StoredProduct[], now: number) {
  const used = new Set(products.flatMap(photoPathnames));
  const orphans: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "fotos/", limit: 1000, cursor });
    for (const b of page.blobs) {
      // 1 día de gracia: la dueña puede estar llenando el formulario con fotos ya subidas.
      if (!used.has(b.pathname) && now - new Date(b.uploadedAt).getTime() > DAY_MS) orphans.push(b.pathname);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  await deletePhotos(orphans);
  return orphans.length;
}
