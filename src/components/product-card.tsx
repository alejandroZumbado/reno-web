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
  return <ProductArt kind={product.art} color={product.color.hex} label={product.name} />;
}

export function PriceTag({ product, large = false }: { product: Product; large?: boolean }) {
  const sale = isOnSale(product);
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${large ? "text-3xl" : "text-base"}`}>
      <span className={sale ? "text-gold" : "text-fg"}>{formatPrice(product.price)}</span>
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
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-surface transition-colors group-hover:border-gold-deep">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
          <ProductImage product={product} sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" />
        </div>
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {sale && <span className="rounded-full foil-bg px-2.5 py-1 text-xs font-medium">-{discount}%</span>}
          {product.collections.includes("nuevo") && <span className="rounded-full border border-gold/60 bg-black/70 px-2.5 py-1 text-xs text-gold">Nuevo</span>}
        </div>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-xs text-muted">{labelOf(audiences, product.audience)}</p>
        <h3 className="text-sm leading-snug sm:text-base">
          {/* El ::after extiende el link a toda la tarjeta: un solo elemento enfocable por producto. */}
          <Link href={`/producto/${product.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <PriceTag product={product} />
        {/* Talla a la vista (pedido de la dueña): pieza única, la clienta descarta rápido lo que no le queda. */}
        <p className="text-xs text-muted">Talla {product.size}</p>
      </div>
    </article>
  );
}
