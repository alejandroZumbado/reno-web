import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Product, StoredProduct } from "@/data/catalog";
import { readCatalog } from "./server/catalog-repo";

/**
 * Lectura del catálogo para el sitio PÚBLICO, en caché (rápido y sin leer Blob en cada visita).
 * Al guardar en el admin se llama updateTag(PRODUCTS_TAG) y el sitio muestra el cambio en la siguiente carga.
 * Si se agrega otra forma de cambiar prendas, debe invalidar este tag o el sitio quedará desactualizado.
 */
export const PRODUCTS_TAG = "products";

/** Prendas a la venta (sin vendidas), las más nuevas primero. */
export async function getPublicProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  // Larga: el admin invalida al guardar, así que no hace falta refrescar por tiempo.
  cacheLife("days");
  const all = await readCatalog();
  return all
    .filter((p) => !p.soldAt)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toPublic);
}

/** Quita los campos internos (id, fechas): el sitio público no los necesita y van al navegador. */
function toPublic(p: StoredProduct): Product {
  return {
    slug: p.slug, name: p.name, brand: p.brand, audience: p.audience, category: p.category,
    collections: p.collections, price: p.price, compareAt: p.compareAt, size: p.size, color: p.color,
    material: p.material, care: p.care, description: p.description, images: p.images, art: p.art,
  };
}

export async function getPublicProduct(slug: string): Promise<Product | undefined> {
  return (await getPublicProducts()).find((p) => p.slug === slug);
}

/** Fotos que cualquiera puede ver (las de prendas a la venta). Las de vendidas solo con sesión de admin. */
export async function getPublicPhotoUrls(): Promise<Set<string>> {
  return new Set((await getPublicProducts()).flatMap((p) => p.images));
}
