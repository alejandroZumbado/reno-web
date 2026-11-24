import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/server/admin-auth";
import { MAX_PHOTO_BYTES, PRODUCT_ID_RE, sniffImage } from "@/lib/server/photos";

/**
 * Sube UNA foto (ya reducida en el celular a ~1600 px) al almacén privado y devuelve su URL /fotos/...
 * La foto queda "huérfana" hasta que se guarda la prenda; si nunca se guarda, el cron la borra al día.
 * Errores: 401 sin sesión, 400 datos inválidos, 413 muy pesada, 500 si falla el almacén (el cliente lo muestra).
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Tu sesión terminó. Vuelve a entrar." }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "No se recibió la foto." }, { status: 400 });
  }
  const productId = String(form.get("productId") ?? "");
  const file = form.get("foto");
  if (!PRODUCT_ID_RE.test(productId) || !(file instanceof File)) {
    return Response.json({ error: "Datos de la foto inválidos." }, { status: 400 });
  }
  if (file.size > MAX_PHOTO_BYTES) return Response.json({ error: "La foto pesa demasiado (máx. 4 MB)." }, { status: 413 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniffImage(bytes);
  if (!kind) return Response.json({ error: "El archivo no es una foto JPG, PNG o WEBP." }, { status: 400 });

  const pathname = `fotos/${productId}/${randomUUID()}.${kind.ext}`;
  try {
    await put(pathname, Buffer.from(bytes), { access: "private", contentType: kind.type, addRandomSuffix: false });
  } catch (err) {
    console.error("[subir-foto] fallo al guardar en Blob", err);
    return Response.json({ error: "No se pudo guardar la foto. Intenta de nuevo." }, { status: 500 });
  }
  return Response.json({ url: `/${pathname}` });
}
