"use client";

import { useMemo } from "react";
import { useForSale } from "@/components/for-sale-provider";
import { useMyList } from "./my-list";

/**
 * Mi lista sin las prendas que ya se vendieron (pieza única: lo guardado puede haberse vendido)
 * y con el precio VIGENTE de cada una (el guardado puede ser de antes de una oferta o cambio de precio).
 * Lo usan el contador del encabezado y /mi-lista para que no cuenten ni se pidan piezas que ya no existen.
 * No borra ni reescribe nada del celular: si la dueña restaura una pieza, vuelve a aparecer.
 */
export function useMyListForSale() {
  const saved = useMyList();
  const forSale = useForSale();
  return useMemo(() => {
    const items = saved.flatMap((i) => {
      const price = forSale.get(i.slug);
      return price === undefined ? [] : [{ ...i, price }];
    });
    return { items, soldCount: saved.length - items.length };
  }, [saved, forSale]);
}
