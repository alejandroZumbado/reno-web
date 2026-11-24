import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { store } from "@/data/store";
import "./globals.css";

// Bodoni Moda: serif de alto contraste, misma familia visual que el "Reno" del logo oficial.
// Jost: geométrica limpia para leer precios y tallas en celular.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"] });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: { default: `${store.name} | ${store.tagline}`, template: `%s | ${store.name}` },
  description: store.description,
  openGraph: { type: "website", locale: "es_MX", siteName: store.name },
  // Mientras el sitio sea demo no queremos que Google indexe precios inventados.
  robots: store.isDemo ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#000000" };

/**
 * Raíz mínima: solo html, fuentes y estilos. El encabezado/pie del sitio viven en (sitio)/layout
 * y el admin tiene el suyo, para que el panel de la dueña no cargue el menú público.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${bodoni.variable} ${jost.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
