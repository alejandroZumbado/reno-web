/**
 * Esqueleto de ficha. Necesario desde que las prendas vienen del admin: una prenda nueva no estaba en el
 * build, así que su ficha se genera al primer clic y Next pide mostrar algo mientras (navegación instantánea).
 */
export default function LoadingProduct() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6" aria-busy="true">
      <p className="sr-only">Cargando prenda…</p>
      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="aspect-[4/5] animate-pulse rounded-lg border border-line bg-surface" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-surface" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-surface" />
          <div className="h-24 w-full animate-pulse rounded bg-surface" />
        </div>
      </div>
    </div>
  );
}
