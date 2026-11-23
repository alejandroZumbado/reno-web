import Image from "next/image";
import Link from "next/link";
import { audiences, labelOf, type Product } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { isOnSale } from "@/lib/search";
import { ProductArt } from "./product-art";

/** Foto real si existe; si no, ilustración. Mantiene proporción 4:5 (estándar de moda en Instagram). */
export function ProductImage({ product, sizes, priority = false }: { product: Product; sizes: string; priority?: boolean }) {
  const [first] = product.images;
  if (first) {
    return <Image src={first} alt={product.name} fill sizes={sizes} priority={priority} className="object-cover" />;
  }
  return <ProductArt kind={product.art} color={product.colors[0]?.hex ?? "#D8C3A5"} label={product.name} />;
}

export function PriceTag({ product, large = false }: { product: Product; large?: boolean }) {
  const sale = isOnSale(product);
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${large ? "text-2xl" : "text-base"}`}>
      <span className={`font-semibold ${sale ? "text-terracota" : ""}`}>{formatPrice(product.price)}</span>
      {sale && (
        <>
          <span className="sr-only">antes</span>
          <s className="text-sm text-muted">{formatPrice(product.compareAt!)}</s>
        </>
      )}
    </p>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const sale = isOnSale(product);
  const discount = sale ? Math.round((1 - product.price / product.compareAt!) * 100) : 0;
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-arena">
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]">
          <ProductImage product={product} sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {sale && <span className="rounded-full bg-terracota px-2.5 py-1 text-xs font-semibold text-white">-{discount}%</span>}
          {product.collections.includes("nuevo") && <span className="rounded-full bg-agave px-2.5 py-1 text-xs font-semibold text-white">Nuevo</span>}
        </div>
        {!product.available && (
          <span className="absolute inset-x-2 bottom-2 rounded-lg bg-ink/85 py-1.5 text-center text-xs font-semibold text-crema">Agotado por ahora</span>
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs uppercase tracking-wider text-muted">{labelOf(audiences, product.audience)}</p>
        <h3 className="text-sm font-medium leading-snug sm:text-base">
          {/* El ::after extiende el link a toda la tarjeta: un solo elemento enfocable por producto. */}
          <Link href={`/producto/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <PriceTag product={product} />
        <ul className="mt-1 flex gap-1.5" aria-label="Colores disponibles">
          {product.colors.map((c) => (
            <li key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-ink/20" style={{ background: c.hex }}>
              <span className="sr-only">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
