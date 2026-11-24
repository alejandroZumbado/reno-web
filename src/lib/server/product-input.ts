import "server-only";
import {
  artForCategory,
  audiences,
  categories,
  collections,
  colorOptions,
  type AudienceId,
  type CategoryId,
  type CollectionId,
  type StoredProduct,
} from "@/data/catalog";
import { MAX_PHOTOS_PER_PRODUCT, PHOTO_PATH_RE, PRODUCT_ID_RE } from "./photos";

/**
 * Valida en el SERVIDOR lo que manda el formulario del admin. El navegador también valida, pero eso
 * se puede saltar: aquí está la regla real. Cada error va con el nombre del campo para mostrarlo junto a él.
 */

export type ProductFields = Omit<StoredProduct, "id" | "slug" | "createdAt" | "updatedAt" | "soldAt">;
export type FieldErrors = Partial<Record<"name" | "price" | "compareAt" | "audience" | "category" | "size" | "color" | "images" | "description" | "form", string>>;

const LIMITS = { name: 80, description: 500, material: 100, care: 150, brand: 40, size: 12 };
// "ofertas" no se elige: se calcula del precio anterior (search.isOnSale).
const EDITABLE_COLLECTIONS = collections.map((c) => c.id).filter((id) => id !== "ofertas");

function text(form: FormData, key: string, max: number) {
  return String(form.get(key) ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function money(raw: string) {
  const n = Number(raw.replace(/[$,\s]/g, ""));
  return Number.isInteger(n) ? n : NaN;
}

export function parseProductForm(form: FormData, productId: string): { fields?: ProductFields; errors: FieldErrors } {
  const errors: FieldErrors = {};

  const name = text(form, "name", LIMITS.name);
  if (name.length < 3) errors.name = "Escribe el nombre de la prenda (mínimo 3 letras).";

  const price = money(String(form.get("price") ?? ""));
  if (!(price >= 1 && price <= 100_000)) errors.price = "Escribe el precio en pesos, sin centavos (ej. 450).";

  const compareRaw = String(form.get("compareAt") ?? "").trim();
  const compareAt = compareRaw ? money(compareRaw) : undefined;
  if (compareAt !== undefined && !(compareAt > price && compareAt <= 100_000)) {
    errors.compareAt = "El precio anterior debe ser mayor que el precio actual (o déjalo vacío).";
  }

  const audience = String(form.get("audience") ?? "") as AudienceId;
  if (!audiences.some((a) => a.id === audience)) errors.audience = "Elige Mujer u Hombre.";

  const category = String(form.get("category") ?? "") as CategoryId;
  const cat = categories.find((c) => c.id === category);
  if (!cat) errors.category = "Elige el tipo de prenda.";
  else if (!(cat.audiences as readonly string[]).includes(audience)) errors.category = "Ese tipo no existe en esa sección.";

  const size = text(form, "size", LIMITS.size);
  if (!size) errors.size = "Elige o escribe la talla.";

  const colorName = String(form.get("color") ?? "");
  const color = colorOptions.find((c) => c.name === colorName);
  if (!color) errors.color = "Elige el color.";

  const images = parseImages(String(form.get("images") ?? "[]"), productId);
  if (!images) errors.images = "Hubo un problema con las fotos. Vuelve a subirlas.";

  const description = text(form, "description", LIMITS.description);
  const picked = form.getAll("collections").map(String);
  const chosenCollections = EDITABLE_COLLECTIONS.filter((id) => picked.includes(id)) as CollectionId[];

  if (Object.keys(errors).length || !cat || !color || !images) return { errors };

  return {
    errors,
    fields: {
      name,
      price,
      ...(compareAt !== undefined ? { compareAt } : {}),
      audience,
      category,
      collections: chosenCollections,
      size,
      color: { name: color.name, hex: color.hex },
      description,
      ...optional("material", text(form, "material", LIMITS.material)),
      ...optional("care", text(form, "care", LIMITS.care)),
      ...optional("brand", text(form, "brand", LIMITS.brand)),
      images,
      art: artForCategory[category],
    },
  };
}

function optional<K extends string>(key: K, value: string) {
  return (value ? { [key]: value } : {}) as Partial<Record<K, string>>;
}

/** Solo URLs de fotos de ESTA prenda (no se puede "robar" la foto de otra ni apuntar a otra carpeta). */
function parseImages(raw: string, productId: string): string[] | null {
  if (!PRODUCT_ID_RE.test(productId)) return null;
  let list: unknown;
  try {
    list = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(list) || list.length > MAX_PHOTOS_PER_PRODUCT) return null;
  const urls = list.map(String);
  const ok = urls.every((u) => u.startsWith(`/fotos/${productId}/`) && PHOTO_PATH_RE.test(u.slice(1)));
  return ok ? [...new Set(urls)] : null;
}

/** Slug legible y único a partir del nombre ("Blusa satinada" → "blusa-satinada", "-2" si ya existe). */
export function uniqueSlug(name: string, taken: Set<string>) {
  const base =
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "prenda";
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}
