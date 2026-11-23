import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog-view";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Busca ropa de dama, caballero, niños y bebé por tipo de prenda, talla, colección y precio.",
};

/**
 * El shell se prerenderiza; los filtros viven en la URL (useSearchParams) y se resuelven en el cliente,
 * por eso CatalogView va dentro de Suspense (requisito de Next con cacheComponents).
 * Con ~cientos de productos esto sobra; si crecen a miles, mover el filtrado al servidor.
 */
export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Catálogo</h1>
      <Suspense fallback={<p className="mt-8 text-muted">Cargando catálogo…</p>}>
        <CatalogView products={products} />
      </Suspense>
    </div>
  );
}
