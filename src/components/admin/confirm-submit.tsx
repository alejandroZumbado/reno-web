"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

/**
 * Botón de envío que pide confirmación antes (acciones que no se deshacen fácil).
 * Usa el confirm nativo: accesible con lector de pantalla y teclado sin código extra.
 */
export function ConfirmSubmit({ message, className, children, pendingLabel }: { message?: string; className: string; children: ReactNode; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (message && !window.confirm(message)) e.preventDefault();
      }}
      className={`${className} disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
