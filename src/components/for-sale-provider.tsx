"use client";

import { createContext, use, useMemo, type ReactNode } from "react";

const ForSaleContext = createContext<ReadonlySet<string> | null>(null);

/** Entrega al cliente qué slugs siguen a la venta (el catálogo vive en el servidor). */
export function ForSaleProvider({ slugs, children }: { slugs: string[]; children: ReactNode }) {
  const set = useMemo(() => new Set(slugs), [slugs]);
  return <ForSaleContext value={set}>{children}</ForSaleContext>;
}

/** Slugs a la venta. Lanza si se usa fuera del sitio público: sería un error de armado, no de datos. */
export function useForSaleSlugs() {
  const set = use(ForSaleContext);
  if (!set) throw new Error("useForSaleSlugs debe usarse dentro de ForSaleProvider");
  return set;
}
