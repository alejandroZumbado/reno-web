import Link from "next/link";
import type { ReactNode } from "react";

/** Contenedor de sección con título y link "ver todo" opcional, para mantener el ritmo vertical igual en todo el sitio. */
export function Section({ id, title, intro, action, children }: { id?: string; title: string; intro?: string; action?: { href: string; label: string }; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 id={id ? `${id}-title` : undefined} className="font-display text-3xl sm:text-4xl">{title}</h2>
          {intro && <p className="mt-2 max-w-xl text-muted">{intro}</p>}
        </div>
        {action && (
          <Link href={action.href} className="inline-flex min-h-11 shrink-0 items-center text-sm text-gold underline-offset-4 hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
