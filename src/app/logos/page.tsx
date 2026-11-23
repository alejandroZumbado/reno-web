import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Opciones de logo",
  // Página interna para que la dueña elija; no debe salir en Google.
  robots: { index: false, follow: false },
};

const options = [
  { file: "reno-a-astas.svg", name: "A · Astas", note: "Reno = reno: astas sobre el nombre. Elegante, se reconoce en pequeño. (Es el que usa el sitio por ahora.)" },
  { file: "reno-b-monograma.svg", name: "B · Monograma", note: "Círculo verde agave con R. Ideal para foto de perfil de Instagram/WhatsApp." },
  { file: "reno-c-etiqueta.svg", name: "C · Etiqueta", note: "Forma de etiqueta de ropa. Cálido y directo: se entiende que es una tienda de ropa." },
  { file: "reno-d-gancho.svg", name: "D · Gancho", note: "Gancho de ropa con el nombre. Simple y memorable para letrero y bolsas." },
  { file: "reno-e-sello.svg", name: "E · Sello", note: "Sello circular “Hecho en México”. Para stickers, etiquetas y empaques." },
];

export default function LogosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Opciones de logo para Reno</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Propuestas iniciales. Elige 1 o 2 favoritas y las afinamos (colores, letra, versión horizontal y vertical).
        Toca un logo para descargarlo en SVG.
      </p>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((o) => (
          <li key={o.file} className="overflow-hidden rounded-2xl border border-line bg-white">
            <a href={`/logos/${o.file}`} download className="block">
              <div className="grid grid-cols-2">
                <div className="flex aspect-square items-center justify-center bg-crema p-6">
                  <Image src={`/logos/${o.file}`} alt={`Logo opción ${o.name} sobre fondo claro`} width={200} height={140} className="h-auto w-full" unoptimized />
                </div>
                <div className="flex aspect-square items-center justify-center bg-arena p-6">
                  <Image src={`/logos/${o.file}`} alt={`Logo opción ${o.name} sobre fondo arena`} width={200} height={140} className="h-auto w-full" unoptimized />
                </div>
              </div>
            </a>
            <div className="p-5">
              <h2 className="font-display text-lg font-bold">{o.name}</h2>
              <p className="mt-1 text-sm text-muted">{o.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <section className="mt-12 rounded-2xl bg-ink p-6 text-crema sm:p-10">
        <h2 className="font-display text-2xl font-bold">Paleta propuesta</h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            ["Terracota", "#B4472B"], ["Verde agave", "#2F5D50"], ["Tinta", "#1C1917"], ["Arena", "#EFE7DA"], ["Crema", "#FAF7F2"],
          ].map(([n, hex]) => (
            <li key={hex}>
              <div className="h-16 rounded-xl border border-crema/20" style={{ background: hex }} />
              <p className="mt-2 text-sm font-semibold">{n}</p>
              <p className="text-xs text-crema/70">{hex}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
