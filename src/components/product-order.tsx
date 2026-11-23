"use client";

import { useState } from "react";
import type { Product } from "@/data/catalog";
import { productMessage, whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./whatsapp";

/**
 * Selección de talla/color + botón de pedido. El mensaje lleva prenda, talla, color y link,
 * para que la dueña no tenga que preguntar "¿cuál?" (la pregunta #1 que recibe por WhatsApp).
 */
export function ProductOrder({ product, url }: { product: Product; url: string }) {
  const singleSize = product.sizes.length === 1 ? product.sizes[0] : undefined;
  const [size, setSize] = useState<string | undefined>(singleSize);
  const [color, setColor] = useState(product.colors[0]?.name);

  const message = productMessage(product.name, { size, color, url });
  const cta = product.available ? "Pedir por WhatsApp" : "Avísame cuando llegue";

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          Color: <span className="font-normal text-muted">{color}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-pressed={color === c.name}
              aria-label={c.name}
              onClick={() => setColor(c.name)}
              className={`h-11 w-11 rounded-full border-2 p-1 ${color === c.name ? "border-ink" : "border-transparent"}`}
            >
              <span className="block h-full w-full rounded-full border border-ink/20" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">
          Talla{!size && <span className="font-normal text-muted"> · elige una</span>}
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-medium ${size === s ? "border-ink bg-ink text-crema" : "border-line bg-white hover:border-ink"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Se permite pedir sin talla: la clienta puede querer asesoría. No bloquear la venta por un dato. */}
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener"
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-agave px-6 text-lg font-semibold text-white hover:bg-agave/90"
      >
        <WhatsAppIcon className="h-6 w-6" /> {cta}
      </a>
      <p className="text-center text-sm text-muted">Te respondemos con disponibilidad, envío y formas de pago.</p>
    </div>
  );
}
