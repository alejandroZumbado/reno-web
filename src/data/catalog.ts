/**
 * Ejes del catálogo, según la dueña (docs/04-respuestas-duena.md):
 * secciones Mujer y Hombre, y dentro de cada una sus tipos de prenda.
 * Los `id` van en la URL (?para=mujer&tipo=sacos): no cambiarlos una vez publicados
 * o se rompen links compartidos por WhatsApp.
 */

export const audiences = [
  { id: "mujer", label: "Mujer" },
  { id: "hombre", label: "Hombre" },
] as const;

/**
 * Tipos de prenda. `audiences` dice en qué sección aparece cada uno:
 * no todo existe en ambas (blusas solo mujer, camisas solo hombre).
 * Para agregar un tipo nuevo basta con añadirlo aquí.
 */
export const categories = [
  { id: "blusas", label: "Blusas", audiences: ["mujer"] },
  { id: "camisas", label: "Camisas", audiences: ["hombre"] },
  { id: "playeras", label: "Playeras", audiences: ["mujer", "hombre"] },
  { id: "vestir", label: "Ropa de vestir", audiences: ["mujer", "hombre"] },
  { id: "vestidos", label: "Vestidos", audiences: ["mujer"] },
  { id: "faldas", label: "Faldas", audiences: ["mujer"] },
  { id: "pantalones", label: "Pantalones", audiences: ["mujer", "hombre"] },
  { id: "deportiva", label: "Deportiva", audiences: ["mujer", "hombre"] },
  { id: "sudaderas", label: "Sudaderas", audiences: ["mujer", "hombre"] },
  { id: "chamarras", label: "Chamarras", audiences: ["mujer", "hombre"] },
  { id: "abrigos", label: "Abrigos", audiences: ["mujer", "hombre"] },
  { id: "sacos", label: "Sacos", audiences: ["mujer", "hombre"] },
  { id: "calzado", label: "Calzado", audiences: ["mujer", "hombre"] },
  { id: "accesorios", label: "Accesorios", audiences: ["mujer", "hombre"] },
] as const satisfies readonly { id: string; label: string; audiences: readonly AudienceId[] }[];

export const collections = [
  { id: "nuevo", label: "Nuevo" },
  { id: "ofertas", label: "Ofertas" },
  { id: "temporada", label: "Temporada" },
  { id: "tallas-extra", label: "Tallas extra" },
] as const;

/**
 * Solo define el ORDEN en que se muestran las tallas (CH antes que M), no cuáles existen.
 * Cuáles existen las decide la dueña en cada prenda: no llega igual en hombre y en mujer.
 * Una talla que no esté aquí igual funciona; se muestra al final.
 */
export const sizeOrder = [
  "XCH", "CH", "M", "G", "XG", "XXG", "3XG",
  "3", "5", "7", "9", "11", "13", "15",
  "24", "26", "28", "30", "32", "34", "36", "38", "40", "42",
  "22", "22.5", "23", "23.5", "24.5", "25", "25.5", "26.5", "27", "27.5", "28.5", "29",
  "Unitalla",
] as const;

export type AudienceId = (typeof audiences)[number]["id"];
export type CategoryId = (typeof categories)[number]["id"];
export type CollectionId = (typeof collections)[number]["id"];

/** Arte vectorial de respaldo mientras no hay fotos reales (ver ProductArt). */
export type ArtKind =
  | "tee" | "blouse" | "shirt" | "pants" | "dress" | "skirt"
  | "jacket" | "coat" | "blazer" | "hoodie" | "shoe" | "bag";

export type Product = {
  slug: string;
  name: string;
  /** Marca de la prenda; debe escribirse igual que en store.brands para que la portada la enlace. */
  brand?: string;
  audience: AudienceId;
  category: CategoryId;
  collections: CollectionId[];
  /** Precio en MXN; editable por la dueña. */
  price: number;
  /** Precio anterior; si es mayor que `price` la prenda cuenta como oferta. */
  compareAt?: number;
  /** Talla de la pieza. Pieza única (regla de la dueña): una prenda = una talla, no hay selector. */
  size: string;
  color: { name: string; hex: string };
  material?: string;
  care?: string;
  description: string;
  /** Rutas en /public/products. Vacío = se usa `art`. */
  images: string[];
  art: ArtKind;
  /** false = ya se vendió (pieza única, no se repone). */
  available: boolean;
};

export function labelOf(list: readonly { id: string; label: string }[], id: string) {
  return list.find((item) => item.id === id)?.label ?? id;
}

/** Tipos de prenda de una sección (o todos si no hay sección elegida). */
export function categoriesFor(audience?: string) {
  if (!audience) return categories;
  return categories.filter((c) => (c.audiences as readonly string[]).includes(audience));
}
