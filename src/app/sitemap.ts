import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/products";
import { store } from "@/data/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublicProducts();
  const base = store.siteUrl;
  return [
    { url: base, priority: 1 },
    { url: `${base}/catalogo`, priority: 0.9 },
    ...products.map((p) => ({ url: `${base}/producto/${p.slug}`, priority: 0.7 })),
  ];
}
