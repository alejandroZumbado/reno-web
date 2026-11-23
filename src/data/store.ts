/**
 * Datos del negocio. Única fuente para header, footer, WhatsApp, JSON-LD y SEO.
 * TODO(dueña): todo lo marcado como ejemplo se reemplaza con las respuestas de
 * docs/01-preguntas-duena.md. No inventar datos reales (teléfono, dirección).
 */
export const store = {
  name: "Reno",
  tagline: "Ropa para toda la familia",
  description:
    "Reno es una tienda de ropa en México para dama, caballero y niños: básicos, temporada, ofertas y novedades cada semana a buen precio.",
  // Mientras sea true se muestra el aviso de "datos de ejemplo" en todo el sitio,
  // para que nadie confunda precios/productos demo con reales al compartir el link.
  isDemo: true,
  // Formato internacional sin "+" ni espacios (ej. 5215512345678). null = aún no lo tenemos:
  // el link de WhatsApp abre la app y deja elegir el contacto (no rompe, pero no es ideal).
  whatsapp: null as string | null,
  phone: null as string | null,
  email: null as string | null,
  address: {
    street: "Dirección por confirmar",
    city: "Ciudad por confirmar",
    region: "México",
    country: "MX",
  },
  // Link de Google Maps de la tienda. null = no se muestra el botón "Cómo llegar".
  mapsUrl: null as string | null,
  hours: [
    { days: "Lunes a sábado", open: "10:00", close: "20:00", schema: "Mo-Sa 10:00-20:00" },
    { days: "Domingo", open: "11:00", close: "17:00", schema: "Su 11:00-17:00" },
  ],
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
  },
  // Cambiar al dominio final cuando exista; se usa en sitemap, canonical y Open Graph.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reno-ropa.vercel.app",
} as const;
