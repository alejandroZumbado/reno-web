import Link from "next/link";
import { audiences, collections } from "@/data/catalog";
import { store } from "@/data/store";
import { Logo } from "./brand";

export function SiteFooter() {
  const socials = Object.entries(store.social).filter(([, url]) => url) as [string, string][];
  return (
    <footer className="mt-20 bg-ink text-crema">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-3 max-w-xs text-sm text-crema/75">{store.description}</p>
        </div>
        <FooterList title="Catálogo" items={audiences.map((a) => ({ href: `/catalogo?para=${a.id}`, label: a.label }))} />
        <FooterList title="Colecciones" items={collections.map((c) => ({ href: `/catalogo?coleccion=${c.id}`, label: c.label }))} />
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider">Horario</h2>
          <ul className="mt-3 space-y-1 text-sm text-crema/75">
            {store.hours.map((h) => (
              <li key={h.days}>{h.days}: {h.open} – {h.close}</li>
            ))}
          </ul>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-3 text-sm">
              {socials.map(([name, url]) => (
                <li key={name}><a href={url} className="capitalize underline" rel="noopener">{name}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="border-t border-crema/15 py-5 text-center text-xs text-crema/60">
        {/* Sin año dinámico: new Date() rompe el prerender con cacheComponents y el año no aporta. */}
        © {store.name} · Hecho en México
      </p>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="inline-flex min-h-8 items-center text-crema/75 hover:text-crema">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
