import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ForSaleProvider } from "@/components/for-sale-provider";
import { WhatsAppFab } from "@/components/whatsapp";
import { store } from "@/data/store";
import { getPublicProducts } from "@/lib/products";

/** Marco del sitio público: aviso de demo, encabezado, pie y botón flotante de WhatsApp. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  // Slugs a la venta para "Mi lista" (cliente): así el contador no cuenta piezas ya vendidas.
  // Viene de una lectura en caché, no frena la página.
  const forSale = (await getPublicProducts()).map((p) => p.slug);
  return (
    <ForSaleProvider slugs={forSale}>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-black">
        Saltar al contenido
      </a>
      {store.isDemo && (
        <p className="border-b border-line bg-surface px-4 py-2 text-center text-xs text-muted sm:text-sm">
          Vista previa: productos y precios de ejemplo. Muy pronto el catálogo real de Reno.
        </p>
      )}
      <SiteHeader />
      <main id="contenido" className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFab />
    </ForSaleProvider>
  );
}
