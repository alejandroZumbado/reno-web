# Reno — sitio de la tienda de ropa

Sitio catálogo para **Reno**, tienda de ropa en México: darse a conocer, mostrar prendas con precios y búsqueda por catálogos. Los pedidos se cierran por WhatsApp.

## Stack
- Next.js 16 (App Router, Cache Components) + Tailwind CSS 4 + TypeScript.
- Sin base de datos: catálogo en `src/data/*.ts` (fase 1). Deploy en Vercel.

## Comandos
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # verificar antes de subir
npm run lint
```

## Estructura
| Ruta | Qué es |
|---|---|
| `src/data/store.ts` | Datos del negocio (WhatsApp, dirección, horario, redes, `isDemo`) |
| `src/data/catalog.ts` | Ejes del catálogo (para quién, tipo, colección, tallas) y tipo `Product` |
| `src/data/products.ts` | Productos (hoy de ejemplo) |
| `src/lib/search.ts` | Búsqueda y filtros (sin acentos, AND de palabras) |
| `src/app/` | Páginas: `/`, `/catalogo`, `/producto/[slug]`, `/logos` |
| `public/logos/` | 5 opciones de logo SVG |
| `docs/` | Preguntas para la dueña, funcionalidades, prompts de imágenes |

## Cómo agregar un producto
1. Subir fotos a `public/products/<slug>-1.jpg` (vertical 4:5).
2. Copiar un objeto en `src/data/products.ts`, cambiar `slug`, datos y `images: ["/products/<slug>-1.jpg"]`.
3. `npm run build` y subir a GitHub: Vercel publica solo.

## Antes de lanzar
- Llenar `src/data/store.ts` con datos reales y poner `isDemo: false` (activa indexación en Google y quita el aviso).
- Dominio propio → `NEXT_PUBLIC_SITE_URL` en Vercel.
