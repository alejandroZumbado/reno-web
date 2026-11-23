/**
 * Ejes del catálogo. Ver docs/02-funcionalidades.md ("Tipos de catálogo").
 * Los `id` se usan en la URL (?para=dama&tipo=blusas): no cambiarlos una vez
 * publicados o se rompen links compartidos por WhatsApp/redes.
 */

export const audiences = [
  { id: "dama", label: "Dama" },
  { id: "caballero", label: "Caballero" },
  { id: "ninos", label: "Niños" },
  { id: "bebe", label: "Bebé" },
] as const;

export const categories = [
  { id: "blusas", label: "Blusas" },
  { id: "playeras", label: "Playeras" },
  { id: "camisas", label: "Camisas" },
  { id: "pantalones", label: "Pantalones" },
  { id: "vestidos", label: "Vestidos" },
  { id: "faldas", label: "Faldas" },
  { id: "chamarras", label: "Chamarras" },
  { id: "sudaderas", label: "Sudaderas" },
  { id: "deportiva", label: "Deportiva" },
  { id: "pijamas", label: "Pijamas" },
  { id: "calzado", label: "Calzado" },
  { id: "accesorios", label: "Accesorios" },
] as const;

export const collections = [
  { id: "nuevo", label: "Nuevo" },
  { id: "ofertas", label: "Ofertas" },
  { id: "temporada", label: "Temporada invierno" },
  { id: "tallas-extra", label: "Tallas extra" },
  { id: "basicos", label: "Básicos" },
] as const;

// Orden fijo para mostrar tallas de forma lógica (no alfabética).
export const sizeOrder = [
  "0-3m", "3-6m", "6-12m", "2", "4", "6", "8", "10", "12", "14",
  "CH", "M", "G", "XG", "XXG", "3XG",
  "24", "26", "28", "30", "32", "34", "36", "38",
  "22", "23", "24.5", "25", "25.5", "26.5", "27", "Unitalla",
] as const;

export type AudienceId = (typeof audiences)[number]["id"];
export type CategoryId = (typeof categories)[number]["id"];
export type CollectionId = (typeof collections)[number]["id"];

/** Arte vectorial de respaldo mientras no hay fotos reales (ver ProductArt). */
export type ArtKind =
  | "tee" | "blouse" | "shirt" | "pants" | "dress" | "skirt"
  | "jacket" | "hoodie" | "shoe" | "bag" | "cap" | "pajama" | "onesie";

export type Product = {
  slug: string;
  name: string;
  audience: AudienceId;
  category: CategoryId;
  collections: CollectionId[];
  price: number;
  /** Precio anterior; si existe y es mayor que `price`, se muestra como oferta. */
  compareAt?: number;
  sizes: string[];
  colors: { name: string; hex: string }[];
  material?: string;
  care?: string;
  description: string;
  /** Rutas en /public/products. Vacío = se usa `art` como imagen. */
  images: string[];
  art: ArtKind;
  available: boolean;
};

export function labelOf<T extends { id: string; label: string }>(list: readonly T[], id: string) {
  return list.find((item) => item.id === id)?.label ?? id;
}
