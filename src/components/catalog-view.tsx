"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo, useState, type ReactNode } from "react";
import { audiences, categories, collections, labelOf, type Product } from "@/data/catalog";
import { availableSizes, filterProducts, parseFilters, type CatalogFilters } from "@/lib/search";
import { formatPrice } from "@/lib/format";
import { ProductCard } from "./product-card";

const priceSteps = [200, 300, 500, 800, 1000];

const sortOptions = [
  { id: "relevancia", label: "Destacados" },
  { id: "precio-asc", label: "Precio: menor a mayor" },
  { id: "precio-desc", label: "Precio: mayor a menor" },
  { id: "nombre", label: "Nombre (A–Z)" },
];

/** Catálogo con filtros en la URL: así un link filtrado se puede mandar por WhatsApp y abre igual. */
export function CatalogView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(false);

  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);
  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const sizes = useMemo(() => availableSizes(products), [products]);

  // replace (no push) para que "atrás" no recorra cada clic de filtro; scroll:false para no saltar arriba.
  function update(patch: Partial<Record<keyof CatalogFilters, string | undefined>>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const active = activeChips(filters);

  return (
    <div className="mt-6">
      <SearchInput key={filters.q ?? ""} initial={filters.q ?? ""} onSearch={(q) => update({ q })} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="filtros"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink px-4 text-sm font-semibold lg:hidden"
        >
          Filtros{active.length > 0 && ` (${active.length})`}
        </button>
        {active.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => update({ [chip.key]: undefined })}
            className="inline-flex min-h-11 items-center gap-1 rounded-full bg-arena px-4 text-sm"
            aria-label={`Quitar filtro ${chip.label}`}
          >
            {chip.label} <span aria-hidden="true">×</span>
          </button>
        ))}
        {active.length > 0 && (
          <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-terracota underline">
            Limpiar todo
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside id="filtros" aria-label="Filtros" className={`${showFilters ? "block" : "hidden"} space-y-6 rounded-2xl border border-line bg-white p-5 lg:block lg:self-start lg:sticky lg:top-24`}>
          <FilterGroup title="Para quién" options={audiences} value={filters.para} onChange={(v) => update({ para: v })} />
          <FilterGroup title="Tipo de prenda" options={categories} value={filters.tipo} onChange={(v) => update({ tipo: v })} />
          <FilterGroup title="Colección" options={collections} value={filters.coleccion} onChange={(v) => update({ coleccion: v })} />
          <FilterGroup title="Talla" options={sizes.map((s) => ({ id: s, label: s }))} value={filters.talla} onChange={(v) => update({ talla: v })} compact />
          <FilterGroup
            title="Precio máximo"
            options={priceSteps.map((p) => ({ id: String(p), label: `Hasta ${formatPrice(p)}` }))}
            value={filters.max ? String(filters.max) : undefined}
            onChange={(v) => update({ max: v })}
          />
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-sm text-muted">
              {results.length === 1 ? "1 prenda" : `${results.length} prendas`}
            </p>
            <SortSelect value={filters.orden ?? "relevancia"} onChange={(v) => update({ orden: v === "relevancia" ? undefined : v })} />
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5">
              {results.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          ) : (
            <EmptyState onReset={() => router.replace(pathname, { scroll: false })} />
          )}
        </div>
      </div>
    </div>
  );
}

function activeChips(f: CatalogFilters) {
  const chips: { key: keyof CatalogFilters; label: string }[] = [];
  if (f.q) chips.push({ key: "q", label: `“${f.q}”` });
  if (f.para) chips.push({ key: "para", label: labelOf(audiences, f.para) });
  if (f.tipo) chips.push({ key: "tipo", label: labelOf(categories, f.tipo) });
  if (f.coleccion) chips.push({ key: "coleccion", label: labelOf(collections, f.coleccion) });
  if (f.talla) chips.push({ key: "talla", label: `Talla ${f.talla}` });
  if (f.max) chips.push({ key: "max", label: `Hasta ${formatPrice(f.max)}` });
  return chips;
}

/** Busca al enviar (Enter/botón), no en cada tecla: evita reescribir la URL por letra. */
function SearchInput({ initial, onSearch }: { initial: string; onSearch: (q: string | undefined) => void }) {
  const id = useId();
  const [value, setValue] = useState(initial);
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); onSearch(value.trim() || undefined); }} className="flex gap-2">
      <label htmlFor={id} className="sr-only">Buscar en el catálogo</label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="¿Qué buscas? Ej. pantalón mezclilla, sudadera gris"
        className="h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 placeholder:text-muted"
      />
      <button type="submit" className="h-12 shrink-0 rounded-full bg-ink px-6 font-semibold text-crema">Buscar</button>
    </form>
  );
}

function FilterGroup({ title, options, value, onChange, compact = false }: { title: string; options: readonly { id: string; label: string }[]; value?: string; onChange: (v: string | undefined) => void; compact?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{title}</legend>
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "lg:flex-col lg:items-start"}`}>
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <Pill key={o.id} selected={selected} onClick={() => onChange(selected ? undefined : o.id)}>
              {o.label}
            </Pill>
          );
        })}
      </div>
    </fieldset>
  );
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full border px-3.5 text-sm transition-colors lg:min-h-9 ${selected ? "border-ink bg-ink text-crema" : "border-line bg-crema hover:border-ink"}`}
    >
      {children}
    </button>
  );
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-muted">Ordenar</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-full border border-line bg-white px-4 text-sm">
        {sortOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
      <p className="font-display text-xl font-bold">No encontramos prendas con esos filtros</p>
      <p className="mt-2 text-muted">Prueba con menos filtros o escríbenos: muchas prendas llegan cada semana y aún no están en la página.</p>
      <button type="button" onClick={onReset} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-terracota px-6 font-semibold text-white">
        Ver todo el catálogo
      </button>
    </div>
  );
}
