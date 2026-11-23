"use client";

import { useState } from "react";
import type { Product } from "@/data/catalog";
import { store } from "@/data/store";
import { formatPrice, layawayDeposit, productMessage, whatsappLink, type ProductIntent } from "@/lib/format";
import { AddToMyListButton } from "./my-list-ui";
import { WhatsAppIcon } from "./whatsapp";

/**
 * Selección de talla/color + acciones por WhatsApp (pedido de la dueña): Pedir, Apartar y Preguntar.
 * Cada botón manda prenda, precio, talla, color y link para que ella no tenga que preguntar "¿cuál?".
 */
export function ProductOrder({ product, url }: { product: Product; url: string }) {
  const singleSize = product.sizes.length === 1 ? product.sizes[0] : undefined;
  const [size, setSize] = useState<string | undefined>(singleSize);
  const [color, setColor] = useState(product.colors[0]?.name);

  const link = (intent: ProductIntent) =>
    whatsappLink(productMessage({ name: product.name, price: product.price, size, color, url }, intent));

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm">
          Color: <span className="text-muted">{color}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={color === c.name}
              aria-label={c.name}
              onClick={() => setColor(c.name)}
              className={`h-11 w-11 rounded-full border-2 p-1 ${color === c.name ? "border-gold" : "border-transparent"}`}
            >
              <span className="block h-full w-full rounded-full border border-white/20" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm">
          Talla{!size && <span className="text-muted">, elige una</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-3 text-sm ${size === s ? "border-gold bg-gold text-black" : "border-line bg-surface hover:border-gold"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Se permite pedir sin talla: la clienta puede querer asesoría. No bloquear la venta por un dato. */}
      {product.available ? (
        <div className="space-y-3">
          <a href={link("pedir")} target="_blank" rel="noopener" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full foil-bg px-6 text-lg font-medium hover:brightness-110">
            <WhatsAppIcon className="h-6 w-6" /> Pedir por WhatsApp
          </a>
          <a href={link("apartar")} target="_blank" rel="noopener" className="flex min-h-14 w-full flex-col items-center justify-center rounded-full border border-gold px-6 text-gold hover:bg-gold/10">
            <span className="text-lg">Apartar con {formatPrice(layawayDeposit(product.price))}</span>
            <span className="text-xs text-muted">Dejas la mitad y tienes {store.layaway.days} días para liquidar</span>
          </a>
          {/* key: al cambiar talla/color se reinicia el aviso "Agregada" (si no, describiría otra combinación). */}
          <AddToMyListButton
            key={`${size}|${color}`}
            item={{ slug: product.slug, name: product.name, price: product.price, size, color }}
          />
        </div>
      ) : (
        <a href={link("preguntar")} target="_blank" rel="noopener" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full foil-bg px-6 text-lg font-medium hover:brightness-110">
          <WhatsAppIcon className="h-6 w-6" /> Avísame cuando llegue
        </a>
      )}
      {product.available && (
        <a href={link("preguntar")} target="_blank" rel="noopener" className="flex min-h-11 items-center justify-center gap-2 text-sm text-muted underline-offset-4 hover:text-gold hover:underline">
          <WhatsAppIcon className="h-4 w-4" /> Preguntar por WhatsApp
        </a>
      )}
      <p className="text-center text-sm text-muted">Pago con {store.paymentMethods.join(" o ").toLowerCase()}.</p>
    </div>
  );
}
