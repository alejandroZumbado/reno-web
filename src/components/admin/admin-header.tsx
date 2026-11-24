import Image from "next/image";
import Link from "next/link";
import mark from "../../../public/brand/reno-mark.png";
import { logoutAction } from "@/app/admin/actions";

/** Barra del panel: marca, link al sitio público (para revisar cómo quedó) y Salir. */
export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-night/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center gap-3 px-4">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Panel, inicio">
          <Image src={mark} alt="" className="h-9 w-auto" sizes="36px" />
          <span className="font-display text-xl">Panel</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm" aria-label="Panel">
          <Link href="/" target="_blank" className="inline-flex min-h-11 items-center rounded-full px-3 text-muted hover:text-gold">
            Ver sitio
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="inline-flex min-h-11 items-center rounded-full px-3 text-muted hover:text-gold">Salir</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
