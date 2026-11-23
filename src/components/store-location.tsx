import { store } from "@/data/store";
import { whatsappLink } from "@/lib/format";
import { addressLine, directionsUrl, mapEmbedUrl } from "@/lib/maps";
import { Section } from "./section";
import { WhatsAppIcon } from "./whatsapp";

/**
 * "Dónde ubicarnos" (pedido de Alejandro, 2026-11-23): mapa de Google con el pin de la tienda,
 * dirección, horario y botón "Cómo llegar" que abre la ruta en Google Maps.
 * Reemplaza a la antigua sección "Visítanos" (mismo contenido + mapa).
 */
export function StoreLocation() {
  return (
    <Section id="ubicacion" title="Dónde ubicarnos" intro={store.isDemo ? "Ubicación de ejemplo mientras confirmamos la dirección de la tienda." : undefined}>
      {/* Ancla vieja: links compartidos con /#visitanos siguen cayendo aquí. */}
      <span id="visitanos" className="block scroll-mt-24" aria-hidden="true" />
      <div className="grid overflow-hidden rounded-lg border border-line bg-surface lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-8 p-6 sm:p-10">
          <div>
            <h3 className="font-display text-xl text-gold">Dirección</h3>
            <address className="mt-2 text-lg not-italic">
              {store.address.street}
              <br />
              {store.address.city}, {store.address.region}, C.P. {store.address.postalCode}
            </address>
          </div>

          <div>
            <h3 className="font-display text-xl text-gold">Horario</h3>
            <dl className="mt-2 space-y-1 text-lg">
              {store.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-line py-1.5">
                  <dt>{h.days}</dt>
                  <dd className="text-muted">{h.open} a {h.close}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a href={directionsUrl} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full foil-bg px-6 font-medium hover:brightness-110">
              <PinIcon /> Cómo llegar
            </a>
            <a href={whatsappLink("Hola Reno, ¿me pasan su ubicación?")} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold px-6 text-gold hover:bg-gold/10">
              <WhatsAppIcon /> Pedir ubicación
            </a>
          </div>
        </div>

        {/*
          Mapa interactivo (zoom, arrastrar, abrir en Maps). loading="lazy": no se descarga hasta que la
          clienta baja hasta aquí, así no frena la portada. El filtro lo vuelve oscuro para que no
          deslumbre junto al negro del sitio; hue-rotate devuelve los colores (el pin sigue rojo).
        */}
        <div className="relative min-h-80 border-t border-line lg:min-h-[28rem] lg:border-l lg:border-t-0">
          <iframe
            src={mapEmbedUrl}
            title={`Mapa de Reno: ${addressLine}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="map-dark absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </Section>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
