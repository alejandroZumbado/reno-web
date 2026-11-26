"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "Copiar link" de una prenda, para que la dueña la comparta en Instagram o WhatsApp.
 * El aviso vive FUERA del botón en un role="status": dentro de un botón los lectores de pantalla no lo anuncian.
 * El botón no se desactiva durante el aviso (copiar se puede repetir y así no se pierde el foco).
 * Si el navegador niega el portapapeles, se muestra el link para copiarlo a mano (no falla en silencio).
 */
export function CopyLinkButton({ url }: { url: string }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("ok");
      timer.current = setTimeout(() => setStatus("idle"), 2500);
    } catch {
      // Sin temporizador: el link queda a la vista hasta que lo copie a mano.
      setStatus("error");
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} className="inline-flex min-h-11 items-center text-sm text-gold underline-offset-4 hover:underline">
        {status === "ok" ? "Link copiado ✓" : "Copiar link"}
      </button>
      <span role="status" className="text-sm text-muted">
        {status === "error" && (
          <>No se pudo copiar. Mantén presionado el link para copiarlo: <span className="select-all break-all text-fg">{url}</span></>
        )}
      </span>
    </span>
  );
}
