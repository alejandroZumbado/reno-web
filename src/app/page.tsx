import Link from "next/link";
import { LogoImage } from "@/components/brand";
import { HangerIcon } from "@/components/my-list-ui";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { StoreLocation } from "@/components/store-location";
import { WhatsAppIcon } from "@/components/whatsapp";
import { audiences, categoriesFor } from "@/data/catalog";
import { products } from "@/data/products";
import { store } from "@/data/store";
import { whatsappLink } from "@/lib/format";
import { addressLine } from "@/lib/maps";
import { isOnSale } from "@/lib/search";

const deposit = `${Math.round(store.layaway.depositRatio * 100)}%`;
const payments = store.paymentMethods.join(" o ").toLowerCase();

/**
 * Preguntas frecuentes. Solo políticas confirmadas por la dueña (docs/04-respuestas-duena.md)
 * y funciones del sitio (Mi lista, ubicación).
 * TODO(dueña): envíos y cambios/devoluciones siguen sin respuesta; no agregarlos hasta tenerla.
 */
const faqs = [
  { q: "¿Cómo hago un pedido?", a: "Elige tu prenda, toca Pedir por WhatsApp y te confirmamos talla, color y disponibilidad." },
  { q: "¿Puedo pedir varias prendas a la vez?", a: "Sí. En cada prenda toca Agregar a mi lista y luego manda toda tu lista en un solo WhatsApp, con el total ya sumado." },
  { q: "¿Puedo apartar?", a: `Sí. Dejas la mitad del precio y tienes ${store.layaway.days} días para liquidar.` },
  { q: "¿Qué formas de pago aceptan?", a: `Aceptamos ${payments}.` },
  { q: "¿Dónde están?", a: `En ${addressLine}. Abajo de esta página tienes el mapa y el botón Cómo llegar.` },
  { q: "¿Y si no veo mi talla?", a: "Escríbenos: llega mercancía nueva seguido y no todo está en la página todavía." },
];

export default function HomePage() {
  const nuevos = products.filter((p) => p.collections.includes("nuevo") && p.available).slice(0, 4);
  const ofertas = products.filter((p) => isOnSale(p) && p.available).slice(0, 4);

  return (
    <>
      <StoreJsonLd />
      <Hero />
      <Brands />

      <Section id="secciones" title="¿Qué buscas hoy?">
        <div className="grid gap-4 md:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.id} className="hanger-panel relative rounded-lg border border-line bg-surface p-6 pt-10 sm:p-10 sm:pt-12">
              <Link href={`/catalogo?para=${a.id}`} className="group inline-flex min-h-12 items-baseline gap-3">
                <span className="font-display text-5xl text-fg transition-colors group-hover:text-gold sm:text-6xl">{a.label}</span>
                <span className="text-sm text-muted underline-offset-4 group-hover:text-gold group-hover:underline">Ver todo</span>
              </Link>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Tipos de prenda de ${a.label}`}>
                {categoriesFor(a.id).map((c) => (
                  <li key={c.id}>
                    <Link href={`/catalogo?para=${a.id}&tipo=${c.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:border-gold hover:text-gold">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="novedades" title="Novedades" intro="Lo último que llegó a la tienda." action={{ href: "/catalogo?coleccion=nuevo", label: "Ver todas" }}>
        <ProductGrid list={nuevos} />
      </Section>

      <Layaway />

      <Section id="ofertas" title="Ofertas" intro="Mismas prendas, mejor precio, mientras haya tallas." action={{ href: "/catalogo?coleccion=ofertas", label: "Ver todas" }}>
        <ProductGrid list={ofertas} />
      </Section>

      <MyListBand />

      <StoreLocation />

      <Section id="preguntas" title="Preguntas frecuentes">
        <div className="divide-y divide-line rounded-lg border border-line bg-surface">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5 sm:px-7">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-lg [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-prose pb-5 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-muted">
          ¿Otra duda?{" "}
          <a href={whatsappLink("Hola Reno, tengo una pregunta.")} target="_blank" rel="noopener" className="text-gold underline underline-offset-4">
            Pregúntanos por WhatsApp
          </a>
        </p>
      </Section>
    </>
  );
}

function ProductGrid({ list }: { list: typeof products }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
      {list.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}

/**
 * Hero: el logo oficial es la imagen principal (la dueña quiere que la marca se reconozca)
 * y lleva el único movimiento automático del sitio: un destello dorado que lo cruza una vez
 * al cargar (.logo-glint en globals.css; se apaga con prefers-reduced-motion).
 */
function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Halo cálido detrás del logo: da profundidad al negro sin agregar otro color. */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-[-20%] h-[38rem] w-[38rem] rounded-full bg-gold/[0.07] blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-4 pt-8 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-14">
        <div className="order-2 md:order-1">
          <h1 id="hero-title" className="font-display text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-7xl">
            Prendas seleccionadas para mujer y hombre
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            {/* Tono boutique (opción A elegida por Alejandro, 2026-11-23): selección y servicio, no lista de datos. */}
            Ropa de vestir, deportiva y de temporada, elegida pieza por pieza. Aparta la tuya con la mitad de su precio y liquídala con calma en {store.layaway.days} días.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/catalogo" className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full foil-bg px-8 font-medium hover:brightness-110">
              Explorar la colección
            </Link>
            <a href={whatsappLink("Hola Reno, quiero información sobre su ropa.")} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-gold px-7 text-gold hover:bg-gold/10">
              <WhatsAppIcon /> Atención por WhatsApp
            </a>
          </div>
          {/* Lo que más pregunta la clienta, a la vista antes de bajar. */}
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
            <HeroFact term="Apartado" value={`${deposit} de anticipo`} />
            <HeroFact term="Plazo para liquidar" value={`${store.layaway.days} días`} />
            <HeroFact term="Formas de pago" value={store.paymentMethods.join(" y ").toLowerCase()} />
          </dl>
        </div>
        <div className="logo-glint order-1 mx-auto w-full max-w-[16rem] sm:max-w-xs md:order-2 md:max-w-md">
          <LogoImage className="h-auto w-full" priority sizes="(min-width:768px) 448px, 256px" />
        </div>
      </div>
    </section>
  );
}

function HeroFact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{term}</dt>
      <dd className="mt-0.5 font-display text-lg text-fg first-letter:uppercase sm:text-xl">{value}</dd>
    </div>
  );
}

/**
 * Marcas que maneja la tienda, justo debajo del hero (pedido de Alejandro).
 * Texto en serif, no logos: los logos de cada marca son registrados.
 * Solo es link si hay prendas de esa marca; si no, mandaría a un catálogo vacío.
 */
function Brands() {
  if (store.brands.length === 0) return null;
  const stocked = new Set(products.map((p) => p.brand).filter(Boolean));
  return (
    <section aria-labelledby="marcas-title" className="mt-10 border-y border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 id="marcas-title" className="text-center text-sm text-muted">
          Marcas que encuentras en Reno
          {store.isDemo && <span className="block text-xs">(marcas de ejemplo mientras cargamos el catálogo real)</span>}
        </h2>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {store.brands.map((b) => (
            <li key={b} className="font-display text-xl text-fg/85 sm:text-2xl">
              {stocked.has(b) ? (
                <Link href={`/catalogo?q=${encodeURIComponent(b)}`} className="inline-flex min-h-11 items-center hover:text-gold">{b}</Link>
              ) : (
                <span className="inline-flex min-h-11 items-center">{b}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Banda de apartado + pagos: es el argumento de venta que más pesa para la clienta de la dueña. */
function Layaway() {
  return (
    <section id="apartado" aria-labelledby="apartado-title" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6">
      <div className="grid gap-8 rounded-lg border border-gold-deep/60 bg-surface p-6 sm:p-10 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 id="apartado-title" className="foil-text font-display text-5xl">Apártala</h2>
          <p className="mt-2 text-muted">Asegura tu prenda antes de que se acabe.</p>
        </div>
        {/* Numerado porque sí es una secuencia: primero dejas, luego tienes el plazo, al final pagas. */}
        <ol className="grid gap-6 sm:grid-cols-3 md:col-span-2">
          <Step n="1" title={`Deja el ${deposit}`} text="Elige tu prenda y aparta con la mitad del precio." />
          <Step n="2" title={`${store.layaway.days} días`} text="Tienes ese plazo para liquidar lo que falta." />
          <Step n="3" title="Paga como quieras" text={`Aceptamos ${payments}.`} />
        </ol>
      </div>
    </section>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="border-l border-gold-deep/50 pl-4">
      <span aria-hidden="true" className="font-display text-3xl text-gold-deep">{n}</span>
      <h3 className="mt-1 font-display text-xl text-fg">{title}</h3>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </li>
  );
}

/** Presenta "Mi lista": sin esto casi nadie descubre que puede pedir varias prendas en un mensaje. */
function MyListBand() {
  return (
    <section aria-labelledby="mi-lista-title" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <div className="flex flex-col items-start gap-5 rounded-lg border border-line p-6 sm:flex-row sm:items-center sm:p-8">
        <HangerIcon className="h-12 w-12 shrink-0 text-gold" />
        <div className="flex-1">
          <h2 id="mi-lista-title" className="font-display text-2xl sm:text-3xl">¿Te gustó más de una?</h2>
          <p className="mt-1 text-muted">Agrégalas a tu lista y mándalas juntas en un solo WhatsApp, con el total y el anticipo ya calculados.</p>
        </div>
        <Link href="/mi-lista" className="inline-flex min-h-12 shrink-0 items-center rounded-full border border-gold px-6 text-gold hover:bg-gold/10">
          Ver mi lista
        </Link>
      </div>
    </section>
  );
}

/** Datos estructurados para Google (negocio local). Ayuda a salir en Maps y búsquedas "tienda de ropa cerca de mí". */
function StoreJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: store.name,
    description: store.description,
    url: store.siteUrl,
    image: `${store.siteUrl}/opengraph-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address.street,
      addressLocality: store.address.city,
      addressRegion: store.address.region,
      postalCode: store.address.postalCode,
      addressCountry: store.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: store.geo.lat, longitude: store.geo.lng },
    openingHours: store.hours.map((h) => h.schema),
    paymentAccepted: store.paymentMethods.join(", "),
    ...(store.phone ? { telephone: store.phone } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
