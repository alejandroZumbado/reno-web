"use client";

import { useMemo } from "react";
import { products } from "@/data/products";
import { useMyList } from "./my-list";

const forSale = new Set(products.map((p) => p.slug));

/**
 * Mi lista sin las prendas que ya se vendieron (pieza única: lo guardado puede haberse vendido).
 * Lo usan el contador del encabezado y /mi-lista para que no cuenten ni se pidan piezas que ya no existen.
 * No borra nada del celular: si la dueña reactiva una pieza (available: true), vuelve a aparecer.
 */
export function useMyListForSale() {
  const saved = useMyList();
  return useMemo(() => {
    const items = saved.filter((i) => forSale.has(i.slug));
    return { items, soldCount: saved.length - items.length };
  }, [saved]);
}
