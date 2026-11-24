import { randomBytes } from "node:crypto";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/server/admin-auth";

export const metadata: Metadata = { title: "Agregar prenda" };

export default async function NewProductPage() {
  await requireAdmin();
  await connection(); // id nuevo en cada visita, nunca uno guardado en caché.
  // Id desde ahora (antes de guardar) para que las fotos se suban a su carpeta mientras llena el formulario.
  const productId = `p-${randomBytes(6).toString("hex")}`;
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6">
        <h1 className="mb-8 font-display text-3xl sm:text-4xl">Agregar prenda</h1>
        <ProductForm productId={productId} />
      </main>
    </>
  );
}
