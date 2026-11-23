import Link from "next/link";
import { AntlerMark } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <AntlerMark className="h-12 w-12 text-terracota" />
      <h1 className="mt-4 font-display text-3xl font-bold">No encontramos esta página</h1>
      <p className="mt-3 text-muted">Puede que la prenda ya no esté disponible o el link haya cambiado.</p>
      <Link href="/catalogo" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-terracota px-6 font-semibold text-white">
        Ver el catálogo
      </Link>
    </div>
  );
}
