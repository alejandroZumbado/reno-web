import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/reno-logo.png";
import mark from "../../public/brand/reno-mark.png";

/**
 * Logos generados del JPG oficial de la dueña con `scripts/make_brand_assets.py` (fondo transparente).
 * No editar los PNG a mano: si cambia el logo, reemplazar el JPG y volver a correr el script.
 */

/** Logo completo (venado-gancho + "Reno" + "Ropa premium"). Para hero, 404 y footer. */
export function LogoImage({ className, priority = false, sizes }: { className?: string; priority?: boolean; sizes: string }) {
  return <Image src={logo} alt="Reno, ropa premium" className={className} priority={priority} sizes={sizes} />;
}

/**
 * Logo del header: solo el venado + "Reno" en Bodoni.
 * Por qué no el logo completo: a 48px "ROPA PREMIUM" no se lee; el venado sí se reconoce.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center gap-1.5 ${className}`} aria-label="Reno, ir al inicio">
      <Image src={mark} alt="" className="h-11 w-auto sm:h-12" sizes="48px" priority />
      <span aria-hidden="true" className="foil-text font-display text-2xl max-[389px]:hidden leading-none sm:text-[1.7rem]">Reno</span>
    </Link>
  );
}
