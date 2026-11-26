import { randomBytes } from "node:crypto";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/admin/product-form";
import { copyTemplate } from "@/lib/product-template";
import { requireAdmin } from "@/lib/server/admin-auth";
import { readCatalog } from "@/lib/server/catalog-repo";
import { PRODUCT_ID_RE } from "@/lib/server/photos";

export const metadata: Metadata = { title: "Agregar prenda" };

/** Alta. Con `?desde=<id>` llega prellenada con los datos de esa prenda ("Crear una parecida"). */
export default async function NewProductPage({ searchParams }: PageProps<"/admin/prenda/nueva">) {
  await requireAdmin();
  await connection(); // id nuevo en cada visita, nunca uno guardado en caché.
  // Id desde ahora (antes de guardar) para que las fotos se suban a su carpeta mientras llena el formulario.
  const productId = `p-${randomBytes(6).toString("hex")}`;
  const { desde } = await searchParams;
  // Si el id de origen no existe (se borró), se abre el alta vacía en vez de un error: no hay nada que perder.
  const source = typeof desde === "string" && PRODUCT_ID_RE.test(desde) ? (await readCatalog()).find((p) => p.id === desde) : undefined;
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6">
        <h1 className="font-display text-3xl sm:text-4xl">{source ? "Prenda parecida" : "Agregar prenda"}</h1>
        {source && (
          <p className="mt-3 text-muted">
            Copiamos los datos de &ldquo;{source.name}&rdquo;. Sube las fotos de esta prenda, elige su talla y revisa lo demás.
          </p>
        )}
        <div className="mt-8">
          <ProductForm productId={productId} template={source && copyTemplate(source)} />
        </div>
      </main>
    </>
  );
}
