import { get } from "@vercel/blob";
import { isAdmin } from "@/lib/server/admin-auth";
import { getPublicPhotoUrls } from "@/lib/products";
import { PHOTO_PATH_RE } from "@/lib/server/photos";

/**
 * Sirve fotos del almacén PRIVADO. Fotos de prendas a la venta: cualquiera, con caché CORTA en el CDN
 * (5 min): al marcar vendida, la foto debe dejar de ser pública pronto. Con 30 días (versión anterior)
 * el CDN la seguía sirviendo a cualquiera. El navegador de cada clienta la guarda 1 h (no afecta a otros).
 * Fotos de vendidas o recién subidas sin guardar: solo con sesión de admin y sin caché.
 */
export async function GET(_req: Request, ctx: RouteContext<"/fotos/[...ruta]">) {
  const { ruta } = await ctx.params;
  const pathname = `fotos/${ruta.join("/")}`;
  // Lista blanca de forma: evita leer otras carpetas del almacén (catálogo, seguridad) con "../" o rutas raras.
  if (!PHOTO_PATH_RE.test(pathname)) return new Response("No encontrada", { status: 404 });

  const isPublic = (await getPublicPhotoUrls()).has(`/${pathname}`);
  if (!isPublic && !(await isAdmin())) return new Response("No encontrada", { status: 404 });

  const res = await get(pathname, { access: "private" });
  if (!res || res.statusCode !== 200) return new Response("No encontrada", { status: 404 });

  return new Response(res.stream, {
    headers: {
      "Content-Type": res.blob.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": isPublic ? "public, max-age=3600, s-maxage=300" : "private, no-store",
    },
  });
}
