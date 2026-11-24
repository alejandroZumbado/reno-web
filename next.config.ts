import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad para todo el sitio (y más estrictas en /admin).
 * - frame-ancestors/X-Frame-Options: nadie puede meter el sitio en un iframe (evita clickjacking del panel).
 * - nosniff: el navegador no "adivina" tipos (importante porque servimos fotos subidas).
 * - Permissions-Policy: sin cámara/micrófono/ubicación por API; subir fotos usa <input type=file>, no la API.
 * No se pone una CSP completa de scripts: Next inyecta scripts en línea y romperlo dejaría el sitio en blanco.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
