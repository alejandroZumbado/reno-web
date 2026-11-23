import { sizeOrder, type Product } from "@/data/catalog";

/** Filtros del catálogo; todos opcionales. Se leen/escriben en la URL. */
export type CatalogFilters = {
  q?: string;
  para?: string;
  tipo?: string;
  coleccion?: string;
  talla?: string;
  max?: number;
  orden?: SortKey;
};

export type SortKey = "relevancia" | "precio-asc" | "precio-desc" | "nombre";

/** Quita acentos y mayúsculas: "Pantalón" y "pantalon" deben coincidir (la gente escribe sin acentos en el celular). */
export function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function isOnSale(p: Product) {
  return p.compareAt !== undefined && p.compareAt > p.price;
}

function haystack(p: Product) {
  return normalize(
    [p.name, p.brand ?? "", p.description, p.category, p.audience, p.material ?? "", p.color.name].join(" "),
  );
}

/** Todas las palabras de la búsqueda deben aparecer (AND), en cualquier orden. */
function matchesQuery(p: Product, q: string) {
  const words = normalize(q).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack(p);
  return words.every((w) => text.includes(w));
}

export function filterProducts(list: Product[], f: CatalogFilters): Product[] {
  const result = list.filter((p) => {
    if (f.q && !matchesQuery(p, f.q)) return false;
    if (f.para && p.audience !== f.para) return false;
    if (f.tipo && p.category !== f.tipo) return false;
    // "ofertas" se calcula del precio para no depender de que alguien marque la etiqueta a mano.
    if (f.coleccion === "ofertas" && !isOnSale(p)) return false;
    if (f.coleccion && f.coleccion !== "ofertas" && !p.collections.includes(f.coleccion as never)) return false;
    if (f.talla && p.size !== f.talla) return false;
    if (f.max !== undefined && p.price > f.max) return false;
    return true;
  });
  return sortProducts(result, f.orden ?? "relevancia");
}

function sortProducts(list: Product[], key: SortKey) {
  const copy = [...list];
  // Vendidas al final siempre: se dejan a la vista para que la clienta pida algo parecido, pero no deben ser lo primero que se ve.
  const byStock = (a: Product, b: Product) => Number(b.available) - Number(a.available);
  switch (key) {
    case "precio-asc":
      return copy.sort((a, b) => byStock(a, b) || a.price - b.price);
    case "precio-desc":
      return copy.sort((a, b) => byStock(a, b) || b.price - a.price);
    case "nombre":
      return copy.sort((a, b) => byStock(a, b) || a.name.localeCompare(b.name, "es"));
    default:
      return copy.sort(byStock);
  }
}

/** Tallas presentes en la lista, en orden lógico (CH antes que M), no alfabético. */
export function availableSizes(list: Product[]) {
  const set = new Set(list.map((p) => p.size));
  const ordered = sizeOrder.filter((s) => set.has(s)) as string[];
  const rest = [...set].filter((s) => !ordered.includes(s)).sort();
  return [...ordered, ...rest];
}

/** Lee filtros desde URLSearchParams, ignorando valores vacíos o inválidos. */
export function parseFilters(params: URLSearchParams): CatalogFilters {
  const get = (k: string) => params.get(k)?.trim() || undefined;
  const max = Number(get("max"));
  const orden = get("orden") as SortKey | undefined;
  return {
    q: get("q"),
    para: get("para"),
    tipo: get("tipo"),
    coleccion: get("coleccion"),
    talla: get("talla"),
    max: Number.isFinite(max) && max > 0 ? max : undefined,
    orden: orden && ["relevancia", "precio-asc", "precio-desc", "nombre"].includes(orden) ? orden : undefined,
  };
}
