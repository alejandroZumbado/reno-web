import type { MetadataRoute } from "next";
import { store } from "@/data/store";

export default function robots(): MetadataRoute.Robots {
  // En modo demo bloqueamos todo: no queremos precios inventados en Google. Quitar isDemo al lanzar.
  if (store.isDemo) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/logos", "/admin"] }, sitemap: `${store.siteUrl}/sitemap.xml` };
}
