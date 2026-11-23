import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { store } from "@/data/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = store.siteUrl;
  return [
    { url: base, priority: 1 },
    { url: `${base}/catalogo`, priority: 0.9 },
    ...products.map((p) => ({ url: `${base}/producto/${p.slug}`, priority: 0.7 })),
  ];
}
