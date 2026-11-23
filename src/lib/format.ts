import { store } from "@/data/store";

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

/** Precio en pesos sin centavos ("$349"): en ropa de tienda los precios son cerrados. */
export function formatPrice(value: number) {
  return mxn.format(value);
}

/**
 * Link de WhatsApp con mensaje prellenado.
 * Si aún no hay número (store.whatsapp = null) usa wa.me sin número: WhatsApp abre y deja elegir contacto.
 */
export function whatsappLink(message: string) {
  const base = store.whatsapp ? `https://wa.me/${store.whatsapp}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function productMessage(name: string, opts: { size?: string; color?: string; url?: string } = {}) {
  const parts = [`Hola Reno, me interesa: ${name}`];
  if (opts.size) parts.push(`Talla: ${opts.size}`);
  if (opts.color) parts.push(`Color: ${opts.color}`);
  if (opts.url) parts.push(opts.url);
  parts.push("¿Está disponible?");
  return parts.join("\n");
}
