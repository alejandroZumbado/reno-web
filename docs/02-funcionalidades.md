# Reno — Funcionalidades del sitio

> Definido con skills: `design:user-research` (necesidades), `design:ux-copy` (textos/CTAs),
> `design:accessibility-review` (WCAG 2.1 AA), `vercel:nextjs` (implementación).
> Estado: ✅ hecho en v1 · 🟡 depende de respuestas de la dueña · ⏳ fase 2.

## Objetivo
Sitio para **darse a conocer** y **mostrar catálogo con precios**; la venta se cierra por WhatsApp o en tienda (fase 1, sin pagos en línea).

## Tipos de catálogo (cómo se busca)
| Eje | Valores | Por qué |
|---|---|---|
| Para quién | Dama, Caballero, Niños, Bebé | Es lo primero que decide el cliente al entrar a una tienda de ropa |
| Tipo de prenda | Blusas, Playeras, Camisas, Pantalones, Vestidos, Faldas, Chamarras, Sudaderas, Deportiva, Pijamas, Calzado, Accesorios | Menú tipo "pasillo" de tienda |
| Colección | Nuevo, Ofertas, Temporada, Tallas extra, Básicos | Campañas (Buen Fin, Regreso a clases…) sin rehacer el menú |
| Talla | CH, M, G, XG, XXG, numéricas | Filtro que más evita mensajes inútiles |
| Precio | Rango MXN + orden por precio | Cliente sensible a precio |

## v1 (hecho)
- ✅ Inicio: hero, catálogos destacados, novedades, ofertas, por qué Reno, visítanos (horario, mapa), preguntas frecuentes.
- ✅ Catálogo `/catalogo`: búsqueda por texto (sin acentos, ej. "pantalon" = "pantalón"), filtros por para quién / tipo / colección / talla / precio, orden, URL compartible (`?para=dama&tipo=blusas`), estado vacío útil.
- ✅ Ficha `/producto/[slug]`: fotos, precio y oferta, tallas, colores, material, cuidados, **"Pedir por WhatsApp"** con mensaje prellenado (prenda + talla + color), productos relacionados.
- ✅ Botón flotante de WhatsApp en móvil.
- ✅ Página `/logos` con opciones de logo para que la dueña elija (no indexada).
- ✅ SEO local: metadata, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD `ClothingStore` (dirección, horario).
- ✅ Responsive móvil primero (320px → escritorio), menú móvil accesible.
- ✅ Accesibilidad: contraste AA, foco visible, objetivos táctiles ≥ 44px, `alt` en imágenes, labels en filtros, landmarks.
- ✅ Banner "datos de ejemplo" mientras no haya info real.

## Depende de la dueña 🟡
- Datos reales: WhatsApp, dirección, horario, redes (`src/data/store.ts`).
- Productos y fotos reales (`src/data/products.ts`, `public/products/`).
- Logo final y paleta.
- Tabla de tallas, políticas de cambios/envíos/apartados (FAQ).
- Mayoreo (precio por volumen).

## Fase 2 ⏳ (proponer después de la entrevista)
- Panel para que la dueña suba productos sin código (CMS headless, p. ej. Sanity/Contentful vía Vercel Marketplace, o Google Sheets como fuente).
- Lista de deseos / "carrito de pedido" que manda todo en un solo WhatsApp.
- Pagos en línea (Mercado Pago / Stripe con OXXO) si deciden vender en línea.
- Dominio propio (`reno.mx`), Google Business Profile, Analytics (Vercel Analytics).
- Instagram feed embebido, reseñas de Google.
