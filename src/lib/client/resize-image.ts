/**
 * Reduce una foto del celular (a veces 5–12 MB) a JPEG de máx. 1600 px antes de subirla.
 * Por qué: Vercel corta subidas > 4.5 MB y fotos enormes hacen lento el sitio.
 * imageOrientation "from-image" respeta la rotación EXIF (si no, fotos verticales salen acostadas).
 * Lanza Error con mensaje para la dueña si el archivo no se puede leer como imagen.
 */
const MAX_SIDE = 1600;
const QUALITY = 0.85;

export async function resizeImage(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`"${file.name}" no se pudo abrir como foto. Prueba con JPG o PNG.`);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no pudo procesar la foto.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  if (!blob) throw new Error("No se pudo preparar la foto.");
  return blob;
}
