"use client";

import Link from "next/link";
import { useState } from "react";
import { addToMyList, MY_LIST_MAX, useMyList, type MyListItem } from "@/lib/my-list";

/** Ícono de gancho (mismo motivo del logo) para "Mi lista": una lista de prendas colgadas. */
export function HangerIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 8.5V7.6a2.1 2.1 0 1 0-2.1-2.1" />
      <path d="M12 8.5 2.8 15.4a1.2 1.2 0 0 0 .7 2.1h17a1.2 1.2 0 0 0 .7-2.1Z" />
    </svg>
  );
}

/** Link del header con contador. El número solo aparece tras hidratar (en el servidor la lista es vacía). */
export function MyListLink({ className = "" }: { className?: string }) {
  const count = useMyList().length;
  return (
    <Link href="/mi-lista" className={`relative inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2 hover:text-gold ${className}`}>
      <HangerIcon className="h-6 w-6" />
      <span className="hidden text-sm xl:inline">Mi lista</span>
      <span className="sr-only xl:hidden">Mi lista</span>
      {count > 0 && (
        <span className="absolute -right-0.5 top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full foil-bg px-1 text-xs font-semibold">
          {count}
          <span className="sr-only"> {count === 1 ? "prenda" : "prendas"}</span>
        </span>
      )}
    </Link>
  );
}

const feedback = {
  added: "Agregada a tu lista",
  duplicate: "Ya está en tu lista",
  full: `Tu lista llegó a ${MY_LIST_MAX} prendas. Envíala o quita alguna.`,
} as const;

/**
 * Botón "Agregar a mi lista" de la ficha. El resultado se anuncia en una región aria-live
 * para que lectores de pantalla sepan que funcionó (el botón no navega a ningún lado).
 */
export function AddToMyListButton({ item }: { item: MyListItem }) {
  const [status, setStatus] = useState<keyof typeof feedback | null>(null);
  return (
    <div>
      <button
        type="button"
        onClick={() => setStatus(addToMyList(item))}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line px-6 hover:border-gold hover:text-gold"
      >
        <HangerIcon /> Agregar a mi lista
      </button>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-center text-sm text-muted">
        {status && (
          <>
            {feedback[status]}
            {status !== "full" && (
              <>
                {". "}
                <Link href="/mi-lista" className="text-gold underline underline-offset-4">Ver mi lista</Link>
              </>
            )}
          </>
        )}
      </p>
    </div>
  );
}
