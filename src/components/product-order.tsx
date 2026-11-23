import type { Product } from "@/data/catalog";
import { store } from "@/data/store";
import { formatPrice, layawayDeposit, productMessage, whatsappLink, type ProductIntent } from "@/lib/format";
import { AddToMyListButton } from "./my-list-ui";
import { WhatsAppIcon } from "./whatsapp";

/**
 * Talla/color de la pieza + acciones por WhatsApp (pedido de la dueña): Pedir, Apartar y Preguntar.
 * Pieza única (regla de la dueña, 2026-11-23): hay UNA prenda de una talla y un color, así que no hay
 * selector; se muestra lo que existe y el mensaje ya lleva talla, color y link.
 */
export function ProductOrder({ product, url }: { product: Product; url: string }) {
  const item = { name: product.name, price: product.price, size: product.size, color: product.color.name, url };
  const link = (intent: ProductIntent) => whatsappLink(productMessage(item, intent));

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line bg-surface px-4 py-3">
          <dt className="text-sm text-muted">Talla</dt>
          <dd className="mt-0.5 text-lg">{product.size}</dd>
        </div>
        <div className="rounded-md border border-line bg-surface px-4 py-3">
          <dt className="text-sm text-muted">Color</dt>
          <dd className="mt-0.5 flex items-center gap-2 text-lg">
            <span className="h-4 w-4 shrink-0 rounded-full border border-white/20" style={{ background: product.color.hex }} aria-hidden="true" />
            {product.color.name}
          </dd>
        </div>
      </dl>
      <p className="text-sm text-muted">Pieza única: solo hay una, en esta talla y color.</p>

      {/* Solo llegan aquí prendas a la venta: las vendidas ya no tienen ficha (404). */}
      <div className="space-y-3">
        <a href={link("pedir")} target="_blank" rel="noopener" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full foil-bg px-6 text-lg font-medium hover:brightness-110">
          <WhatsAppIcon className="h-6 w-6" /> Pedir por WhatsApp
        </a>
        <a href={link("apartar")} target="_blank" rel="noopener" className="flex min-h-14 w-full flex-col items-center justify-center rounded-full border border-gold px-6 text-gold hover:bg-gold/10">
          <span className="text-lg">Apartar con {formatPrice(layawayDeposit(product.price))}</span>
          <span className="text-xs text-muted">Dejas la mitad y tienes {store.layaway.days} días para liquidar</span>
        </a>
        <AddToMyListButton item={{ slug: product.slug, name: product.name, price: product.price, size: product.size, color: product.color.name }} />
        <a href={link("preguntar")} target="_blank" rel="noopener" className="flex min-h-11 items-center justify-center gap-2 text-sm text-muted underline-offset-4 hover:text-gold hover:underline">
          <WhatsAppIcon className="h-4 w-4" /> Preguntar por WhatsApp
        </a>
      </div>
      <p className="text-center text-sm text-muted">Pago con {store.paymentMethods.join(" o ").toLowerCase()}.</p>
    </div>
  );
}
