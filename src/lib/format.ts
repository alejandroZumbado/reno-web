import { store } from "@/data/store";

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

/** Precio en pesos sin centavos ("$349"): en ropa de tienda los precios son cerrados. */
export function formatPrice(value: number) {
  return mxn.format(value);
}

/**
 * Anticipo para apartar (regla de la dueña: la mitad).
 * Redondea hacia arriba al peso: nunca pedir menos de la mitad por un centavo.
 */
export function layawayDeposit(price: number) {
  return Math.ceil(price * store.layaway.depositRatio);
}

/**
 * Link de WhatsApp con mensaje prellenado.
 * Si aún no hay número (store.whatsapp = null) usa wa.me sin número: WhatsApp abre y deja elegir contacto.
 */
export function whatsappLink(message: string) {
  const base = store.whatsapp ? `https://wa.me/${store.whatsapp}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Qué quiere hacer la clienta con la prenda; cambia el cierre del mensaje. */
export type ProductIntent = "pedir" | "apartar" | "preguntar";

type MessageItem = { name: string; price: number; size?: string; color?: string; url?: string };

/**
 * Mensaje de WhatsApp de una prenda. Lleva prenda, talla, color y link
 * para que la dueña no tenga que preguntar "¿cuál?" (la pregunta #1 que recibe).
 */
export function productMessage(item: MessageItem, intent: ProductIntent = "pedir") {
  const opening = {
    pedir: "Hola Reno, quiero pedir",
    apartar: "Hola Reno, quiero apartar",
    preguntar: "Hola Reno, tengo una pregunta sobre",
  }[intent];
  const parts = [`${opening}: ${item.name} (${formatPrice(item.price)})`];
  if (item.size) parts.push(`Talla: ${item.size}`);
  if (item.color) parts.push(`Color: ${item.color}`);
  if (item.url) parts.push(item.url);
  if (intent === "apartar") {
    parts.push(`Dejo la mitad (${formatPrice(layawayDeposit(item.price))}) y liquido en ${store.layaway.days} días. ¿Está disponible?`);
  } else if (intent === "pedir") {
    parts.push("¿Está disponible?");
  }
  return parts.join("\n");
}

/**
 * Mensaje de "Mi lista": varias prendas en un solo WhatsApp, con total y, si aparta, el anticipo.
 * El anticipo se calcula por prenda y se suma (igual que si las apartara una por una) para que
 * nunca difiera de lo que dice cada ficha por el redondeo.
 */
export function listMessage(items: MessageItem[], intent: Exclude<ProductIntent, "preguntar">) {
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const lines = items.map((i, n) => {
    const detail = [i.size && `talla ${i.size}`, i.color && `color ${i.color}`].filter(Boolean).join(", ");
    return `${n + 1}. ${i.name}${detail ? ` (${detail})` : ""}: ${formatPrice(i.price)}`;
  });
  const opening = intent === "apartar" ? "Hola Reno, quiero apartar estas prendas:" : "Hola Reno, quiero pedir estas prendas:";
  const closing =
    intent === "apartar"
      ? `Total: ${formatPrice(total)}. Dejo la mitad (${formatPrice(listDeposit(items))}) y liquido en ${store.layaway.days} días. ¿Están disponibles?`
      : `Total: ${formatPrice(total)}. ¿Están disponibles?`;
  return [opening, ...lines, closing].join("\n");
}

/** Suma de anticipos por prenda (ver listMessage). */
export function listDeposit(items: { price: number }[]) {
  return items.reduce((sum, i) => sum + layawayDeposit(i.price), 0);
}
