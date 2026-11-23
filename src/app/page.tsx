import Link from "next/link";
import { AntlerMark } from "@/components/brand";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { WhatsAppIcon } from "@/components/whatsapp";
import { audiences, collections, type ArtKind } from "@/data/catalog";
import { products } from "@/data/products";
import { store } from "@/data/store";
import { whatsappLink } from "@/lib/format";
import { isOnSale } from "@/lib/search";

// Arte representativo por catálogo; se reemplaza por foto real de cada sección cuando exista.
const audienceArt: Record<string, { kind: ArtKind; color: string }> = {
  dama: { kind: "dress", color: "#B4472B" },
  caballero: { kind: "shirt", color: "#9CC3E4" },
  ninos: { kind: "tee", color: "#D4A017" },
  bebe: { kind: "onesie", color: "#E7A1A8" },
};

// TODO(dueña): confirmar políticas reales; estas respuestas son el estándar del giro y están marcadas como ejemplo.
const faqs = [
  { q: "¿Cómo hago un pedido?", a: "Elige tu prenda, toca “Pedir por WhatsApp” y te confirmamos talla, color y disponibilidad." },
  { q: "¿Hacen envíos?", a: "Sí, enviamos a todo México por paquetería. El costo depende de tu código postal." },
  { q: "¿Puedo apartar?", a: "Sí, apartas con un anticipo y tienes unos días para liquidar. Pregúntanos las condiciones." },
  { q: "¿Tienen cambios?", a: "Puedes cambiar tu prenda por talla o modelo si está sin usar y con etiqueta." },
  { q: "¿Qué formas de pago aceptan?", a: "Efectivo, transferencia y tarjeta en tienda." },
];

export default function HomePage() {
  const nuevos = products.filter((p) => p.collections.includes("nuevo") && p.available).slice(0, 4);
  const ofertas = products.filter((p) => isOnSale(p) && p.available).slice(0, 4);

  return (
    <>
      <StoreJsonLd />
      <Hero />

      <Section id="catalogos" eyebrow="Compra por catálogo" title="¿Para quién buscas?">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {audiences.map((a) => (
            <li key={a.id}>
              <Link href={`/catalogo?para=${a.id}`} className="group block overflow-hidden rounded-2xl bg-arena">
                <div className="aspect-square transition-transform duration-300 group-hover:scale-[1.03]">
                  <ProductArt kind={audienceArt[a.id].kind} color={audienceArt[a.id].color} label="" />
                </div>
                <p className="flex min-h-12 items-center justify-between px-4 font-display text-lg font-bold">
                  {a.label} <span aria-hidden="true">→</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Colecciones">
          {collections.map((c) => (
            <li key={c.id}>
              <Link href={`/catalogo?coleccion=${c.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="novedades" eyebrow="Recién llegado" title="Novedades" action={{ href: "/catalogo?coleccion=nuevo", label: "Ver todo" }}>
        <ProductGrid list={nuevos} />
      </Section>

      <Section id="ofertas" eyebrow="Precios especiales" title="Ofertas" action={{ href: "/catalogo?coleccion=ofertas", label: "Ver todas" }}>
        <ProductGrid list={ofertas} />
      </Section>

      <WhyReno />
      <Visit />

      <Section id="preguntas" title="Preguntas frecuentes">
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}
                <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-5 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
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

function Hero() {
  return (
    <section className="relative overflow-hidden bg-arena">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-crema px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-agave">
            <AntlerMark className="h-4 w-4 text-terracota" /> Tienda de ropa en México
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Ropa para toda la familia, <span className="text-terracota">a tu estilo</span>.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Dama, caballero y niños. Básicos, temporada y ofertas con novedades cada semana. Encuéntralo aquí y apártalo por WhatsApp.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/catalogo" className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracota px-7 font-semibold text-white hover:bg-terracota-dark">
              Ver catálogo
            </Link>
            <a href={whatsappLink("Hola Reno, quiero información sobre su ropa.")} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink px-7 font-semibold hover:bg-ink hover:text-crema">
              <WhatsAppIcon /> Escríbenos
            </a>
          </div>
        </div>
        {/* Collage decorativo: aria-hidden porque no aporta info, solo ambiente. */}
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3" aria-hidden="true">
          <div className="row-span-2 overflow-hidden rounded-3xl shadow-xl"><ProductArt kind="dress" color="#B4472B" label="" /></div>
          <div className="aspect-square overflow-hidden rounded-3xl shadow-xl"><ProductArt kind="jacket" color="#2F5D50" label="" /></div>
          <div className="aspect-square overflow-hidden rounded-3xl shadow-xl"><ProductArt kind="tee" color="#D4A017" label="" /></div>
        </div>
      </div>
    </section>
  );
}

function WhyReno() {
  const items = [
    { t: "Para toda la familia", d: "De bebé a adulto, en un solo lugar." },
    { t: "Precios justos", d: "Básicos de calidad y ofertas cada temporada." },
    { t: "Te atendemos por WhatsApp", d: "Pregunta tallas, colores y aparta sin salir de casa." },
  ];
  return (
    <Section id="por-que" eyebrow="Por qué Reno" title="Ropa bonita, precio justo">
      <ul className="grid gap-4 sm:grid-cols-3">
        {items.map((i) => (
          <li key={i.t} className="rounded-2xl border border-line bg-white p-6">
            <AntlerMark className="h-7 w-7 text-terracota" />
            <h3 className="mt-3 font-display text-lg font-bold">{i.t}</h3>
            <p className="mt-1 text-muted">{i.d}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Visit() {
  const { address } = store;
  return (
    <Section id="visitanos" eyebrow="Tienda física" title="Visítanos">
      <div className="grid gap-6 rounded-3xl bg-ink p-6 text-crema sm:p-10 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-crema/70">Dirección</h3>
          <p className="mt-2 text-lg">{address.street}<br />{address.city}, {address.region}</p>
          {store.mapsUrl && (
            <a href={store.mapsUrl} target="_blank" rel="noopener" className="mt-4 inline-flex min-h-12 items-center rounded-full bg-crema px-6 font-semibold text-ink">
              Cómo llegar
            </a>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-crema/70">Horario</h3>
          <dl className="mt-2 space-y-1 text-lg">
            {store.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 border-b border-crema/15 py-1">
                <dt>{h.days}</dt>
                <dd>{h.open} – {h.close}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
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
    address: { "@type": "PostalAddress", streetAddress: store.address.street, addressLocality: store.address.city, addressRegion: store.address.region, addressCountry: store.address.country },
    openingHours: store.hours.map((h) => h.schema),
    ...(store.phone ? { telephone: store.phone } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
