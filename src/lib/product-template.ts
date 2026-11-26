import type { StoredProduct } from "@/data/catalog";

/**
 * Datos que se copian a una prenda nueva desde otra parecida ("Crear una parecida" en el admin).
 * Sin fotos ni talla: es pieza única, la nueva siempre es otra prenda física (otra foto, casi siempre otra talla).
 * Vive fuera de product-form.tsx porque la llama una página de servidor y ese archivo es "use client".
 */
export type ProductTemplate = Omit<StoredProduct, "id" | "slug" | "images" | "size" | "soldAt" | "createdAt" | "updatedAt">;

export function copyTemplate(p: StoredProduct): ProductTemplate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, slug, images, size, soldAt, createdAt, updatedAt, ...rest } = p;
  return rest;
}
