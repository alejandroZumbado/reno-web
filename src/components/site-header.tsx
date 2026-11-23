"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { audiences } from "@/data/catalog";
import { Logo } from "./brand";
import { MyListLink } from "./my-list-ui";

const nav = [
  ...audiences.map((a) => ({ href: `/catalogo?para=${a.id}`, label: a.label })),
  { href: "/catalogo?coleccion=ofertas", label: "Ofertas" },
  { href: "/#apartado", label: "Apartado" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/#preguntas", label: "Preguntas" },
];

/** Header fijo con búsqueda. En móvil el menú es un panel que se cierra con Escape (WCAG 2.1.2 sin trampa de foco). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <Logo />

        <nav aria-label="Principal" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <HeaderSearch />
          <MyListLink />
        </div>
      </div>

      {open && (
        <nav id={menuId} aria-label="Menú móvil" className="border-t border-line bg-night lg:hidden">
          <ul className="mx-auto max-w-7xl px-4 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-line/60 text-base last:border-0 hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function HeaderSearch() {
  const router = useRouter();
  const inputId = useId();
  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
        router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
      }}
    >
      <label htmlFor={inputId} className="sr-only">Buscar ropa</label>
      <input
        id={inputId}
        name="q"
        type="search"
        placeholder="Buscar"
        className="h-11 w-32 rounded-full border border-line bg-surface pl-4 pr-10 text-sm placeholder:text-muted focus:border-gold sm:w-64"
      />
      <button type="submit" className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-gold" aria-label="Buscar">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}
