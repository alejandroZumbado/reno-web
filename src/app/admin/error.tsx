"use client";

import Link from "next/link";

/** Error en una acción o lectura del panel: se explica y se ofrece reintentar, sin perder la sesión. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl">Algo no salió bien</h1>
      <p className="mt-3 text-muted">{error.message || "Hubo un problema al hablar con el servidor."}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={reset} className="min-h-12 rounded-full foil-bg px-6 font-medium">Intentar de nuevo</button>
        <Link href="/admin" className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6">Volver al panel</Link>
      </div>
    </div>
  );
}
