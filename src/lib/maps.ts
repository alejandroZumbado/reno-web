import { store } from "@/data/store";

const { lat, lng } = store.geo;
const coords = `${lat},${lng}`;

/**
 * Mapa embebible de Google sin API key (formato `output=embed`).
 * Por qué sin key: no hay que crear cuenta de Google Cloud ni pagar; basta para un pin fijo.
 * Si Google retira este formato, cambiar a Maps Embed API (requiere key restringida por dominio).
 */
export const mapEmbedUrl = `https://maps.google.com/maps?q=${coords}&z=16&hl=es&output=embed`;

/** Abre Google Maps (app en celular) con la ruta hacia la tienda desde donde esté la clienta. */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;

/** Dirección en una línea, para textos y para el título accesible del mapa. */
export const addressLine = `${store.address.street}, ${store.address.city}, ${store.address.region}`;
