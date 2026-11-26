"use client";

import { createContext, use, useMemo, type ReactNode } from "react";

/** slug → precio vigente de cada prenda a la venta. */
export type ForSalePrices = ReadonlyMap<string, number>;

const ForSaleContext = createContext<ForSalePrices | null>(null);

/**
 * Entrega al cliente qué prendas siguen a la venta y su precio de HOY (el catálogo vive en el servidor).
 * El precio va aquí porque Mi lista guarda el precio del día en que se agregó: si la dueña lo cambia
 * o pone oferta, la lista y el mensaje de WhatsApp deben usar el nuevo.
 */
export function ForSaleProvider({ prices, children }: { prices: Record<string, number>; children: ReactNode }) {
  const map = useMemo(() => new Map(Object.entries(prices)), [prices]);
  return <ForSaleContext value={map}>{children}</ForSaleContext>;
}

/** Prendas a la venta con su precio. Lanza si se usa fuera del sitio público: sería un error de armado, no de datos. */
export function useForSale() {
  const map = use(ForSaleContext);
  if (!map) throw new Error("useForSale debe usarse dentro de ForSaleProvider");
  return map;
}
