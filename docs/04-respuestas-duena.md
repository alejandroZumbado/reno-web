# Reno — Respuestas de la dueña (2026-11-22)

> Fuente: Alejandro, tras hablar con la dueña. Estas decisiones mandan sobre las propuestas de `02-funcionalidades.md`.

| Tema | Decisión | Dónde se aplica |
|---|---|---|
| Tallas | Cada prenda trae sus propias tallas y ella debe poder editarlas: no llega igual en hombre y en mujer | `sizes` por producto en `src/data/products.ts`; filtro de talla depende de la sección |
| Precios | Editables por ella | `price` / `compareAt` por producto |
| Secciones | **Mujer** y **Hombre**; dentro de cada una: deportiva, vestir, pantalones, abrigos, chamarras, sacos, blusas, etc. | `audiences` + `categories[].audiences` en `src/data/catalog.ts` |
| WhatsApp | "Pedir por WhatsApp" o "Preguntar por WhatsApp" está bien; se pueden agregar funciones | Botones pedir / preguntar / apartar + "Mi lista" (varias prendas en un solo mensaje) |
| Apartados | 15 días, dejando la mitad del precio | `store.layaway` (`days: 15`, `depositRatio: 0.5`) |
| Formas de pago | Tarjeta y efectivo | `store.paymentMethods` |
| Logo | Ya tiene logo: venado dorado + gancho, "Reno · Ropa premium" (`public/brand/reno-logo-original.jpeg`) | Header, favicon, Open Graph |
| Colores | Dorado brillante y negro | Tokens en `src/app/globals.css`, logos en `public/logos/` |

## Pendiente de preguntar
- ¿Cómo prefiere editar tallas/precios ella misma? (panel con contraseña vs. hoja de Google vs. nos manda cambios por WhatsApp).
- ¿Vende también niños/bebé? (por ahora solo Mujer y Hombre).
- Datos reales: WhatsApp, dirección, horario, redes.
- ¿Envíos? ¿Cambios/devoluciones?
