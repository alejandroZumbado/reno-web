import { NextResponse, type NextRequest } from "next/server";

/**
 * Filtro rápido del admin: sin cookie de sesión → a /admin/entrar. Es solo comodidad (no valida la firma):
 * la protección real es requireAdmin() en cada página y acción. No mover lógica de seguridad aquí.
 * Además marca todo /admin como no indexable y sin caché (datos privados de la dueña).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/entrar";
  if (!isLogin && !request.cookies.has("reno_admin")) {
    return NextResponse.redirect(new URL("/admin/entrar", request.url));
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
