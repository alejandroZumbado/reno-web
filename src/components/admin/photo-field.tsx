// Sin "use client": solo se usa dentro de ProductForm (ya es de cliente) y recibe una función como prop.
import { useId, useRef, useState } from "react";
import { resizeImage } from "@/lib/client/resize-image";

const MAX_PHOTOS = 8; // Igual que MAX_PHOTOS_PER_PRODUCT del servidor.

/**
 * Fotos de la prenda: tomar con la cámara o elegir de la galería, elegir la principal y quitar.
 * Cada foto se reduce en el celular y se sube al momento (así al guardar no hay espera larga).
 * La lista final viaja en un campo oculto "images" (JSON) que el servidor vuelve a validar.
 * `onBusyChange` avisa al formulario para no dejar guardar mientras sube.
 */
export function PhotoField({ productId, initial, error, onBusyChange }: { productId: string; initial: string[]; error?: string; onBusyChange: (busy: boolean) => void }) {
  const [images, setImages] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [problem, setProblem] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setProblem(undefined);
    const room = MAX_PHOTOS - images.length;
    const picked = [...files].slice(0, room);
    if (files.length > room) setProblem(`Máximo ${MAX_PHOTOS} fotos por prenda; se subirán solo ${room}.`);
    setUploading(picked.length);
    onBusyChange(true);
    // Una por una: en datos móviles subir varias a la vez suele fallar todas.
    for (const file of picked) {
      try {
        const url = await upload(file);
        setImages((prev) => [...prev, url]);
      } catch (err) {
        setProblem(err instanceof Error ? err.message : "No se pudo subir una foto.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    onBusyChange(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function upload(file: File) {
    const body = new FormData();
    body.set("productId", productId);
    body.set("foto", await resizeImage(file), "foto.jpg");
    const res = await fetch("/admin/subir-foto", { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error ?? "No se pudo subir la foto. Revisa tu conexión.");
    return data.url;
  }

  const makeMain = (url: string) => setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  const remove = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  return (
    <fieldset aria-describedby={hintId}>
      <legend className="text-lg">Fotos</legend>
      <p id={hintId} className="mt-1 text-sm text-muted">
        La primera es la que se ve en el catálogo. Sin fotos se muestra un dibujo de la prenda.
      </p>
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((url, i) => (
          <li key={url} className="relative">
            <div className={`aspect-[4/5] overflow-hidden rounded-md border ${i === 0 ? "border-gold" : "border-line"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- foto privada: requiere la cookie de admin */}
              <img src={url} alt={i === 0 ? "Foto principal" : `Foto ${i + 1}`} className="h-full w-full object-cover" />
            </div>
            {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-black/80 px-2 py-0.5 text-xs text-gold">Principal</span>}
            <div className="mt-1 flex gap-1">
              {i > 0 && (
                <button type="button" onClick={() => makeMain(url)} className="min-h-11 flex-1 rounded-md text-xs text-muted hover:text-gold" aria-label={`Hacer principal la foto ${i + 1}`}>
                  Principal
                </button>
              )}
              <button type="button" onClick={() => remove(url)} className="min-h-11 flex-1 rounded-md text-xs text-muted hover:text-alert" aria-label={`Quitar la foto ${i + 1}`}>
                Quitar
              </button>
            </div>
          </li>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <li key={`subiendo-${i}`} className="flex aspect-[4/5] items-center justify-center rounded-md border border-dashed border-line text-xs text-muted">
            Subiendo…
          </li>
        ))}
        {images.length + uploading < MAX_PHOTOS && (
          <li>
            <label className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gold/60 text-center text-sm text-gold hover:bg-gold/5 focus-within:outline focus-within:outline-3 focus-within:outline-gold">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              Agregar foto
              <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
            </label>
          </li>
        )}
      </ul>
      {(problem || error) && <p role="alert" className="mt-2 text-sm text-alert">{problem ?? error}</p>}
    </fieldset>
  );
}
