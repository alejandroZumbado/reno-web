import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { ProductArt } from "@/components/product-art";
import { categories, labelOf, SOLD_RETENTION_DAYS, type StoredProduct } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { requireAdmin } from "@/lib/server/admin-auth";
import { daysLeft, isRemovableDemo, purgeExpired, readCatalog } from "@/lib/server/catalog-repo";
import { deleteNowAction, markSoldAction, removeDemosAction, restoreAction } from "./actions";

export const metadata: Metadata = { title: "Prendas" };

const NOTICES: Record<string, string> = {
  guardada: "Prenda guardada. Ya se ve así en el sitio.",
  vendida: "Marcada como vendida: ya no se ve en el sitio.",
  restaurada: "Restaurada: vuelve a verse en el sitio.",
  borrada: "Prenda borrada para siempre.",
  ejemplos: "Listo: se quitaron las prendas de ejemplo.",
};

/**
 * Inicio del panel: pestañas "A la venta" y "Vendidas" (las vendidas no estorban: viven aparte,
 * con cuenta regresiva de 30 días y botón Restaurar). Filtros y avisos van en la URL para que
 * "atrás" y recargar funcionen.
 */
export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const view = sp.vista === "vendidas" ? "vendidas" : "venta";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const notice = typeof sp.aviso === "string" ? NOTICES[sp.aviso] : undefined;
  const undoId = sp.aviso === "vendida" && typeof sp.id === "string" ? sp.id : undefined;

  // Respaldo del cron: si un día no corrió, al entrar se borran las vencidas. Un fallo aquí no debe
  // impedir trabajar: se registra y el cron lo intentará de nuevo.
  await purgeExpired({ orphans: false }).catch((err) => console.error("[admin] purga al entrar falló", err));
  const all = await readCatalog();

  const forSale = all.filter((p) => !p.soldAt);
  const sold = all.filter((p) => p.soldAt).sort((a, b) => (a.soldAt! < b.soldAt! ? 1 : -1));
  const shown = filterByQuery(view === "venta" ? forSale : sold, q);
  const demoCount = all.filter(isRemovableDemo).length;

  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6">
        {notice && (
          <div role="status" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/40 bg-surface px-4 py-3">
            <p>{notice}</p>
            {undoId && (
              <form action={restoreAction}>
                <input type="hidden" name="id" value={undoId} />
                <ConfirmSubmit className="min-h-11 rounded-full px-4 text-gold underline-offset-4 hover:underline" pendingLabel="Deshaciendo…">
                  Deshacer
                </ConfirmSubmit>
              </form>
            )}
          </div>
        )}

        {demoCount > 0 && <DemoBanner count={demoCount} />}

        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-4xl">Tus prendas</h1>
          <Link href="/admin/prenda/nueva" className="hidden min-h-12 items-center rounded-full foil-bg px-6 font-medium hover:brightness-110 sm:inline-flex">
            Agregar prenda
          </Link>
        </div>

        <nav aria-label="Ver prendas" className="mt-6 grid grid-cols-2 rounded-full border border-line p-1">
          <Tab href={withParams({ q })} active={view === "venta"} label="A la venta" count={forSale.length} />
          <Tab href={withParams({ vista: "vendidas", q })} active={view === "vendidas"} label="Vendidas" count={sold.length} />
        </nav>

        <form role="search" className="mt-4" action="/admin">
          {view === "vendidas" && <input type="hidden" name="vista" value="vendidas" />}
          <label htmlFor="q" className="sr-only">Buscar prenda</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Buscar por nombre, talla o tipo" className="admin-input" />
        </form>

        {view === "vendidas" && (
          <p className="mt-4 text-sm text-muted">
            Las vendidas no se ven en el sitio. Puedes restaurarlas durante {SOLD_RETENTION_DAYS} días; después se borran solas con sus fotos.
          </p>
        )}

        {shown.length === 0 ? (
          <EmptyState view={view} hasQuery={!!q} />
        ) : (
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {shown.map((p) => (
              <li key={p.id}>{view === "venta" ? <ForSaleRow product={p} /> : <SoldRow product={p} />}</li>
            ))}
          </ul>
        )}
      </main>

      {/* En celular el botón principal queda fijo abajo, al alcance del pulgar. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-night/95 p-3 backdrop-blur sm:hidden">
        <Link href="/admin/prenda/nueva" className="flex min-h-14 items-center justify-center rounded-full foil-bg text-lg font-medium">
          Agregar prenda
        </Link>
      </div>
    </>
  );
}

function withParams(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
  const s = sp.toString();
  return s ? `/admin?${s}` : "/admin";
}

function filterByQuery(list: StoredProduct[], q: string) {
  if (!q) return list;
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const words = norm(q).split(/\s+/);
  return list.filter((p) => {
    const hay = norm(`${p.name} ${p.size} ${labelOf(categories, p.category)} ${p.color.name}`);
    return words.every((w) => hay.includes(w));
  });
}

function Tab({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center justify-center gap-2 rounded-full text-sm ${active ? "bg-gold text-black" : "text-muted hover:text-fg"}`}
    >
      {label} <span className={active ? "text-black/70" : "text-muted"}>({count})</span>
    </Link>
  );
}

function Thumb({ product }: { product: StoredProduct }) {
  return (
    <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
      {product.images[0] ? (
        // <img> simple: las fotos de vendidas requieren la cookie de admin y el optimizador no la envía.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <ProductArt kind={product.art} color={product.color.hex} label="" />
      )}
    </div>
  );
}

function Summary({ product }: { product: StoredProduct }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="truncate">{product.name}</p>
      <p className="text-sm text-muted">
        {formatPrice(product.price)}, talla {product.size}, {product.color.name.toLowerCase()}
      </p>
    </div>
  );
}

function ForSaleRow({ product }: { product: StoredProduct }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap">
      <Thumb product={product} />
      <Summary product={product} />
      <div className="flex w-full gap-2 sm:w-auto">
        <Link href={`/admin/prenda/${product.id}`} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-line px-4 text-sm hover:border-gold sm:flex-none">
          Editar
        </Link>
        <form action={markSoldAction} className="flex-1 sm:flex-none">
          <input type="hidden" name="id" value={product.id} />
          <ConfirmSubmit
            message={`¿Marcar "${product.name}" como vendida? Se quita del sitio y podrás restaurarla durante ${SOLD_RETENTION_DAYS} días.`}
            className="min-h-11 w-full rounded-full border border-gold px-4 text-sm text-gold hover:bg-gold/10"
            pendingLabel="Marcando…"
          >
            Marcar vendida
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}

function SoldRow({ product }: { product: StoredProduct }) {
  const left = daysLeft(product);
  return (
    <div className="flex flex-wrap items-center gap-3 py-3 sm:flex-nowrap">
      <Thumb product={product} />
      <div className="min-w-0 flex-1">
        <Summary product={product} />
        {/* Línea que se vacía con los días: de un vistazo se ve cuáles están por borrarse. */}
        <div className="mt-2 h-1 w-full max-w-48 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full bg-gold" style={{ width: `${(left / SOLD_RETENTION_DAYS) * 100}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted">{left === 0 ? "Se borra hoy" : `Se borra en ${left} ${left === 1 ? "día" : "días"}`}</p>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <form action={restoreAction} className="flex-1 sm:flex-none">
          <input type="hidden" name="id" value={product.id} />
          <ConfirmSubmit className="min-h-11 w-full rounded-full border border-gold px-4 text-sm text-gold hover:bg-gold/10" pendingLabel="Restaurando…">
            Restaurar
          </ConfirmSubmit>
        </form>
        <form action={deleteNowAction} className="flex-1 sm:flex-none">
          <input type="hidden" name="id" value={product.id} />
          <ConfirmSubmit
            message={`¿Borrar "${product.name}" para siempre? Se eliminan también sus fotos y no se puede deshacer.`}
            className="min-h-11 w-full rounded-full px-4 text-sm text-muted hover:text-alert"
            pendingLabel="Borrando…"
          >
            Borrar ya
          </ConfirmSubmit>
        </form>
      </div>
    </div>
  );
}

/** Aviso con botón para quitar las de ejemplo. Desaparece solo cuando ya no queda ninguna. */
function DemoBanner({ count }: { count: number }) {
  const noun = count === 1 ? "prenda de ejemplo" : "prendas de ejemplo";
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3">
      <p className="text-sm">
        Tienes {count} {noun} que venían con el sitio. Quítalas cuando subas las tuyas.
      </p>
      <form action={removeDemosAction}>
        <ConfirmSubmit
          message={`¿Quitar las ${count} ${noun}? Se borran del sitio y del panel, y no se puede deshacer. Las que ya editaste con tus fotos se quedan.`}
          className="min-h-11 rounded-full border border-gold px-4 text-sm text-gold hover:bg-gold/10"
          pendingLabel="Quitando…"
        >
          Quitar las de ejemplo
        </ConfirmSubmit>
      </form>
    </div>
  );
}

function EmptyState({ view, hasQuery }: { view: "venta" | "vendidas"; hasQuery: boolean }) {
  const text = hasQuery
    ? "Ninguna prenda coincide con tu búsqueda."
    : view === "venta"
      ? "No tienes prendas a la venta. Toca Agregar prenda para subir la primera."
      : "No hay vendidas. Cuando marques una prenda como vendida aparecerá aquí.";
  return <p className="mt-10 rounded-lg border border-dashed border-line px-6 py-12 text-center text-muted">{text}</p>;
}
