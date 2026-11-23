import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PriceTag, ProductCard, ProductImage } from "@/components/product-card";
import { ProductOrder } from "@/components/product-order";
import { audiences, categories, labelOf } from "@/data/catalog";
import { products } from "@/data/products";
import { store } from "@/data/store";
import { formatPrice } from "@/lib/format";
import { isOnSale } from "@/lib/search";

/** Todas las fichas se generan en el build (catálogo estático = rápido y gratis en Vercel). */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

function findProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return { title: "Producto no encontrado" };
  return {
    title: p.name,
    description: `${p.name} · ${formatPrice(p.price)}. ${p.description}`,
    openGraph: { title: `${p.name} · ${formatPrice(p.price)}`, description: p.description, images: p.images[0] ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  // Relacionados: misma audiencia y tipo primero; si no alcanza, misma audiencia.
  const related = products
    .filter((p) => p.slug !== product.slug && p.audience === product.audience)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  const url = `${store.siteUrl}/producto/${product.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav aria-label="Ruta" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/catalogo" className="underline-offset-4 hover:underline">Catálogo</Link> /</li>
          <li><Link href={`/catalogo?para=${product.audience}`} className="underline-offset-4 hover:underline">{labelOf(audiences, product.audience)}</Link> /</li>
          <li><Link href={`/catalogo?para=${product.audience}&tipo=${product.category}`} className="underline-offset-4 hover:underline">{labelOf(categories, product.category)}</Link></li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-arena md:sticky md:top-24 md:self-start">
          <ProductImage product={product} sizes="(min-width:768px) 50vw, 100vw" priority />
        </div>

        <div>
          {isOnSale(product) && <p className="mb-2 inline-block rounded-full bg-terracota px-3 py-1 text-xs font-semibold text-white">Oferta</p>}
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3"><PriceTag product={product} large /></div>
          {!product.available && <p className="mt-2 font-semibold text-terracota">Agotado por ahora</p>}
          <p className="mt-5 text-lg text-muted">{product.description}</p>

          <div className="mt-8"><ProductOrder product={product} url={url} /></div>

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            {product.material && <Detail term="Material" value={product.material} />}
            {product.care && <Detail term="Cuidados" value={product.care} />}
            <Detail term="Tallas" value={product.sizes.join(", ")} />
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16">
          <h2 id="relacionados" className="mb-6 font-display text-2xl font-bold">También te puede gustar</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4 py-3">
      <dt className="font-semibold">{term}</dt>
      <dd className="text-muted">{value}</dd>
    </div>
  );
}
