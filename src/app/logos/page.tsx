import type { Metadata } from "next";
import { LogoImage } from "@/components/brand";

export const metadata: Metadata = {
  title: "Logo",
  // Página interna de referencia; no debe salir en Google.
  robots: { index: false, follow: false },
};

/**
 * Antes mostraba 5 propuestas (public/logos/*.svg). La dueña ya tenía logo propio (2026-11-22),
 * así que ahora solo muestra el oficial. Los SVG viejos se quedan en public/logos como histórico.
 */
const downloads = [
  { href: "/brand/reno-logo.png", label: "Logo sin fondo (PNG)", note: "Para redes, etiquetas y fondos de color" },
  { href: "/brand/reno-mark.png", label: "Venado sin fondo (PNG)", note: "Para foto de perfil o sellos" },
  { href: "/brand/reno-logo-original.jpeg", label: "Logo original (JPG)", note: "Con fondo negro, tal como llegó" },
  { href: "/icon.png", label: "Ícono 512 px (PNG)", note: "Favicon y acceso directo" },
];

export default function LogosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 text-center sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Logo oficial de Reno</h1>
      <div className="mx-auto mt-8 max-w-md">
        <LogoImage className="h-auto w-full" sizes="448px" />
      </div>
      {/* Archivos generados por scripts/make_brand_assets.py desde el JPG oficial. */}
      <ul className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        {downloads.map((d) => (
          <li key={d.href}>
            <a href={d.href} download className="flex min-h-14 flex-col justify-center rounded-lg border border-line px-4 py-2 hover:border-gold">
              <span>{d.label}</span>
              <span className="text-sm text-muted">{d.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
