import type { Metadata } from "next";
import { Suspense } from "react";

/**
 * Panel privado: cada página depende de la sesión (cookie + hora), así que se renderiza al pedirla.
 * instant=false le dice a Next que es a propósito (si no, avisa que la navegación no es instantánea).
 */
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel Reno" },
  robots: { index: false, follow: false },
};

/**
 * Marco del panel de la dueña (sin menú público). Suspense: las páginas leen la cookie de sesión,
 * y con cacheComponents eso debe ir dentro de un límite de carga.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col bg-night">
      <Suspense fallback={<p className="p-6 text-muted">Cargando panel…</p>}>{children}</Suspense>
    </div>
  );
}
