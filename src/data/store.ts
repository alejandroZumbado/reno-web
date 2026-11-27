/**
 * Datos del negocio. Única fuente para header, footer, WhatsApp, apartados, JSON-LD y SEO.
 * Confirmado por la dueña (2026-11-22): apartado 15 días con la mitad; pago tarjeta y efectivo.
 * TODO(dueña): WhatsApp, dirección, horario y redes siguen sin confirmar. No inventarlos.
 */
export const store = {
  name: "Reno",
  // Lema del logo oficial (2026-11-22).
  tagline: "Ropa premium",
  description:
    "Reno es una tienda de ropa en México con prendas para mujer y hombre elegidas pieza por pieza: de vestir, deportiva, pantalones, chamarras, abrigos y sacos. Aparta con la mitad de su precio y liquida en 15 días.",
  // true = aviso de "datos de ejemplo" + noindex. Poner false al cargar productos reales.
  isDemo: true,
  // Formato internacional sin "+" ni espacios (ej. 5215512345678). null = aún no lo tenemos:
  // el link abre WhatsApp y deja elegir el contacto (funciona, pero no es lo ideal).
  whatsapp: null as string | null,
  phone: null as string | null,
  /**
   * TODO(dueña): UBICACIÓN DE EJEMPLO pedida por Alejandro (2026-11-23) para mostrar el mapa.
   * Apunta al Reloj Monumental de Pachuca (lugar público) a propósito: no usar una calle y número
   * inventados, podrían ser de un negocio real. Reemplazar por la dirección real antes de isDemo: false.
   */
  address: {
    street: "Centro, junto al Reloj Monumental",
    city: "Pachuca de Soto",
    region: "Hidalgo",
    postalCode: "42000",
    country: "MX",
  },
  /** Coordenadas del pin del mapa y del botón "Cómo llegar". */
  geo: { lat: 20.12725, lng: -98.73287 },
  // Horario de ejemplo; pendiente de confirmar.
  hours: [
    { days: "Lunes a sábado", open: "10:00", close: "20:00", schema: "Mo-Sa 10:00-20:00" },
    { days: "Domingo", open: "11:00", close: "17:00", schema: "Su 11:00-17:00" },
  ],
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
  },
  /** Regla de apartado de la dueña: deja la mitad y tiene 15 días para liquidar. */
  layaway: { days: 15, depositRatio: 0.5 },
  paymentMethods: ["Tarjeta", "Efectivo"],
  /**
   * Marcas que la dueña compra y revende; se muestran al inicio de la portada (pedido de Alejandro, 2026-11-22).
   * Lista REAL de la dueña (2026-11-27). Anunciar una marca que no se vende es publicidad engañosa (Profeco):
   * quitar la que deje de manejar. Escritas con su ortografía oficial (p. ej. "Reebok", "J.Crew") porque la
   * búsqueda del catálogo y el campo Marca del admin deben coincidir con este texto.
   * Solo texto, nunca logos de las marcas (son registradas y Reno no es distribuidor autorizado). Vacío = la sección no se muestra.
   */
  brands: [
    "Nike", "Levi's", "Calvin Klein", "Ralph Lauren", "The North Face", "Columbia", "Under Armour",
    "Puma", "Reebok", "Champion", "DKNY", "Hollister", "Nautica", "Chaps",
    "Banana Republic", "J.Crew", "Gap", "Old Navy", "H&M", "Zara",
  ] as string[],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://reno-ropa.vercel.app",
} as const;
