import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PriceTag, ProductCard, ProductImage } from "@/components/product-card";
import { ProductOrder } from "@/components/product-order";
import { audiences, categories, labelOf } from "@/data/catalog";
import { getPublicProduct, getPublicProducts } from "@/lib/products";
import { formatPrice, productUrl } from "@/lib/format";
import { isOnSale } from "@/lib/search";

/** Prendas nuevas (subidas después del build) se generan en la primera visita y quedan en caché. */
export async function generateStaticParams() {
  return (await getPublicProducts()).map((p) => ({ slug: p.slug }));
}

const findProduct = getPublicProduct;

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await findProduct(slug);
  if (!p) return { title: "Producto no encontrado" };
  return {
    title: p.name,
    description: `${p.name}, ${formatPrice(p.price)}. ${p.description}`,
    openGraph: { title: `${p.name}, ${formatPrice(p.price)}`, description: p.description, images: p.images[0] ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();

  // Relacionados: misma audiencia y tipo primero; si no alcanza, misma audiencia.
  const related = (await getPublicProducts())
    .filter((p) => p.slug !== product.slug && p.audience === product.audience)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  const url = productUrl(product.slug);

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
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface md:sticky md:top-24 md:self-start">
          <ProductImage product={product} sizes="(min-width:768px) 50vw, 100vw" priority />
        </div>

        <div>
          {isOnSale(product) && <p className="mb-3 inline-block rounded-full foil-bg px-3 py-1 text-xs font-medium">Oferta</p>}
          <h1 className="font-display text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3"><PriceTag product={product} large /></div>
          <p className="mt-5 text-lg text-muted">{product.description}</p>

          <div className="mt-8"><ProductOrder product={product} url={url} /></div>

          <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
            {product.material && <Detail term="Material" value={product.material} />}
            {product.care && <Detail term="Cuidados" value={product.care} />}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16">
          <h2 id="relacionados" className="mb-6 font-display text-3xl">También te puede gustar</h2>
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
      <dt className="text-fg">{term}</dt>
      <dd className="text-muted">{value}</dd>
    </div>
  );
}
