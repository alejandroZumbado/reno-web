import Link from "next/link";
import { audiences, collections } from "@/data/catalog";
import { store } from "@/data/store";
import { addressLine, directionsUrl } from "@/lib/maps";
import { LogoImage } from "./brand";

export function SiteFooter() {
  const socials = Object.entries(store.social).filter(([, url]) => url) as [string, string][];
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <Link href="/" aria-label="Reno, ir al inicio" className="inline-block">
            <LogoImage className="h-auto w-32" sizes="128px" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted">{store.description}</p>
        </div>
        <FooterList title="Catálogo" items={audiences.map((a) => ({ href: `/catalogo?para=${a.id}`, label: a.label }))} />
        <FooterList
          title="Colecciones"
          items={[...collections.map((c) => ({ href: `/catalogo?coleccion=${c.id}`, label: c.label })), { href: "/mi-lista", label: "Mi lista" }]}
        />
        <div>
          <h2 className="font-display text-lg text-gold">Visítanos</h2>
          <p className="mt-3 text-sm text-muted">{addressLine}</p>
          <a href={directionsUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-sm text-gold underline underline-offset-4">
            Cómo llegar
          </a>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {store.hours.map((h) => (
              <li key={h.days}>{h.days}: {h.open} a {h.close}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">Pago con {store.paymentMethods.join(" o ").toLowerCase()}.</p>
          {socials.length > 0 && (
            <ul className="mt-4 flex gap-3 text-sm">
              {socials.map(([name, url]) => (
                <li key={name}><a href={url} className="capitalize underline hover:text-gold" rel="noopener">{name}</a></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">
        {/* Sin año dinámico: new Date() rompe el prerender con cacheComponents y el año no aporta. */}
        © {store.name}. Hecho en México.
      </p>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-lg text-gold">{title}</h2>
      <ul className="mt-3 text-sm sm:space-y-1">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="inline-flex min-h-11 items-center text-muted hover:text-fg sm:min-h-8">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
