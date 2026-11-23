import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFab } from "@/components/whatsapp";
import { store } from "@/data/store";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: { default: `${store.name} · ${store.tagline}`, template: `%s · ${store.name}` },
  description: store.description,
  openGraph: { type: "website", locale: "es_MX", siteName: store.name },
  // Mientras el sitio sea demo no queremos que Google indexe precios inventados.
  robots: store.isDemo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#faf7f2" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${inter.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-crema">
          Saltar al contenido
        </a>
        {store.isDemo && (
          <p className="bg-agave px-4 py-2 text-center text-xs text-white sm:text-sm">
            Vista previa: productos y precios de ejemplo. Muy pronto el catálogo real de Reno.
          </p>
        )}
        <SiteHeader />
        <main id="contenido" className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
