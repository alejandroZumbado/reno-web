"use client";

import Link from "next/link";
import { store } from "@/data/store";
import { formatPrice, listDeposit, listMessage, whatsappLink } from "@/lib/format";
import { clearMyList, myListKey, removeFromMyList, useHydrated, useMyList } from "@/lib/my-list";
import { HangerIcon } from "./my-list-ui";
import { WhatsAppIcon } from "./whatsapp";

/**
 * Contenido de /mi-lista: prendas guardadas, total, anticipo y envío por WhatsApp.
 * Los precios son los guardados al agregar; la dueña confirma el precio vigente en el chat.
 */
export function MyListView() {
  const items = useMyList();
  const hydrated = useHydrated();

  if (!hydrated) return <p className="mt-10 text-muted">Cargando tu lista…</p>;

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-lg border border-dashed border-line px-6 py-14 text-center">
        <HangerIcon className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-4 text-lg">Tu lista está vacía</p>
        <p className="mt-1 text-muted">En cada prenda toca Agregar a mi lista y aquí las juntas para pedirlas juntas.</p>
        <Link href="/catalogo" className="mt-6 inline-flex min-h-12 items-center rounded-full foil-bg px-7 font-medium hover:brightness-110">
          Ver catálogo
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const deposit = listDeposit(items);

  return (
    <div className="mt-8">
      <ul className="divide-y divide-line border-y border-line" aria-label="Prendas en tu lista">
        {items.map((item) => (
          <li key={myListKey(item)} className="flex items-center gap-4 py-4">
            <div className="min-w-0 flex-1">
              <Link href={`/producto/${item.slug}`} className="underline-offset-4 hover:text-gold hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-muted">
                {[item.size && `Talla ${item.size}`, item.color].filter(Boolean).join(", ")}
              </p>
            </div>
            <p className="shrink-0">{formatPrice(item.price)}</p>
            <button
              type="button"
              onClick={() => removeFromMyList(item)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-gold"
              aria-label={`Quitar ${item.name} de tu lista`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 text-lg">
        <div className="flex justify-between gap-4">
          <dt>Total ({items.length} {items.length === 1 ? "prenda" : "prendas"})</dt>
          <dd className="font-display text-2xl">{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-muted">
          <dt>Para apartar dejas</dt>
          <dd>{formatPrice(deposit)}</dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a href={whatsappLink(listMessage(items, "pedir"))} target="_blank" rel="noopener" className="flex min-h-14 items-center justify-center gap-2 rounded-full foil-bg px-6 text-lg font-medium hover:brightness-110">
          <WhatsAppIcon className="h-6 w-6" /> Pedir todo por WhatsApp
        </a>
        <a href={whatsappLink(listMessage(items, "apartar"))} target="_blank" rel="noopener" className="flex min-h-14 flex-col items-center justify-center rounded-full border border-gold px-6 text-gold hover:bg-gold/10">
          <span className="text-lg">Apartar todo con {formatPrice(deposit)}</span>
          <span className="text-xs text-muted">{store.layaway.days} días para liquidar</span>
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/catalogo" className="inline-flex min-h-11 items-center text-gold underline-offset-4 hover:underline">Seguir viendo ropa</Link>
        <button
          type="button"
          onClick={() => {
            // Borra todo de un toque: se confirma para no perder la lista por un dedo.
            if (window.confirm("¿Vaciar tu lista? Se quitarán todas las prendas.")) clearMyList();
          }}
          className="inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Vaciar lista
        </button>
      </div>
    </div>
  );
}
