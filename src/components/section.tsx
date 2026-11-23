import Link from "next/link";
import type { ReactNode } from "react";

/** Contenedor de sección con título y link "ver todo" opcional, para mantener el ritmo vertical igual en todo el sitio. */
export function Section({ id, title, eyebrow, action, children }: { id?: string; title: string; eyebrow?: string; action?: { href: string; label: string }; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-16 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracota">{eyebrow}</p>}
          <h2 id={id ? `${id}-title` : undefined} className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        </div>
        {action && (
          <Link href={action.href} className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-terracota underline-offset-4 hover:underline">
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
