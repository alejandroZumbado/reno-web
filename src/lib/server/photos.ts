import "server-only";

/** Forma de toda foto guardada: fotos/<id de prenda>/<uuid>.jpg. Usado para validar en subida, guardado y lectura. */
export const PHOTO_PATH_RE = /^fotos\/[a-z0-9-]{4,40}\/[a-f0-9-]{36}\.(jpg|webp|png)$/;

/** Id interno de prenda: letras minúsculas, números y guiones (también nombra su carpeta de fotos). */
export const PRODUCT_ID_RE = /^[a-z0-9-]{4,40}$/;

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // Vercel corta cuerpos > 4.5 MB.
export const MAX_PHOTOS_PER_PRODUCT = 8;

const SIGNATURES: { type: string; ext: string; test: (b: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  {
    type: "image/webp",
    ext: "webp",
    test: (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
  },
];

/** Tipo real por los primeros bytes (no por el nombre ni el Content-Type que manda el navegador, que se pueden falsear). */
export function sniffImage(bytes: Uint8Array) {
  return SIGNATURES.find((s) => s.test(bytes));
}
