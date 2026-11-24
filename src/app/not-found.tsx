import Link from "next/link";
import { LogoImage } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <LogoImage className="h-auto w-36" sizes="144px" />
      <h1 className="mt-4 font-display text-4xl">No encontramos esta página</h1>
      <p className="mt-3 text-muted">Puede que la prenda ya no esté disponible o el link haya cambiado.</p>
      <Link href="/catalogo" className="mt-6 inline-flex min-h-12 items-center rounded-full foil-bg px-6 font-medium">
        Explorar la colección
      </Link>
    </div>
  );
}
