import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { ProductForm } from "@/components/admin/product-form";
import { productUrl } from "@/lib/format";
import { requireAdmin } from "@/lib/server/admin-auth";
import { readCatalog } from "@/lib/server/catalog-repo";
import { PRODUCT_ID_RE } from "@/lib/server/photos";

export const metadata: Metadata = { title: "Editar prenda" };

export default async function EditProductPage({ params }: PageProps<"/admin/prenda/[id]">) {
  await requireAdmin();
  const { id } = await params;
  if (!PRODUCT_ID_RE.test(id)) notFound();
  const product = (await readCatalog()).find((p) => p.id === id);
  if (!product) notFound();
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-3xl sm:text-4xl">Editar prenda</h1>
          <div className="flex flex-wrap items-center gap-x-5">
            {/* Ver/copiar solo si está a la venta: la ficha de una vendida da 404 en el sitio. */}
            {!product.soldAt && (
              <>
                <Link href={`/producto/${product.slug}`} target="_blank" className="inline-flex min-h-11 items-center text-sm text-gold underline-offset-4 hover:underline">
                  Ver en el sitio
                </Link>
                <CopyLinkButton url={productUrl(product.slug)} />
              </>
            )}
            <Link href={`/admin/prenda/nueva?desde=${product.id}`} className="inline-flex min-h-11 items-center text-sm text-gold underline-offset-4 hover:underline">
              Crear una parecida
            </Link>
          </div>
        </div>
        {product.soldAt && <p className="mb-6 rounded-lg border border-line bg-surface px-4 py-3 text-muted">Esta prenda está en Vendidas: los cambios se guardan, pero no se ve en el sitio hasta que la restaures.</p>}
        <ProductForm productId={product.id} product={product} />
      </main>
    </>
  );
}
