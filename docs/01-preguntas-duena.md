# Reno — Guía de entrevista con la dueña

> Hecha con skill `design:user-research` (estructura: warm-up → contexto → deep dive → reacción → cierre).
> Duración sugerida: 45–50 min. Llevar el prototipo en el celular para la parte de "Reacción".
> Objetivo: decidir contenido, catálogo, tono y datos de contacto del sitio antes de cargar productos reales.

## 1. Warm-up (5 min)
- ¿Cómo nació Reno? ¿Por qué ese nombre? (sirve para la sección "Nosotros")
- ¿Desde cuándo está la tienda y dónde (ciudad, colonia, dirección exacta)?
- ¿Qué te gustaría que la gente sienta al entrar a la página?

## 2. Contexto del negocio (10 min)
- ¿Quién es tu cliente típico? (edad, mujer/hombre/niños, zona, nivel de precio)
- ¿Hoy cómo te encuentra la gente? (Instagram, Facebook, TikTok, Marketplace, de boca en boca, pasando por la calle)
- ¿Cómo venden hoy? ¿Por WhatsApp, en tienda, apartados, envíos?
- ¿Quién contesta los mensajes y cuánto tardan?
- ¿Qué preguntas te hacen más seguido los clientes? (tallas, precio, envío, si hay en otro color…)
- ¿Quién es tu competencia directa y qué te gusta/no te gusta de su página o redes?

## 3. Deep dive: catálogo y contenido (20 min)
### Catálogos / categorías
- ¿Qué tipos de ropa vendes? Marca todo lo que aplique:
  dama · caballero · niña/niño · bebé · juvenil · tallas extra · deportiva · pijamas · ropa interior · uniformes · fiesta/gala · temporada (invierno, verano) · calzado · accesorios (bolsas, cinturones, gorras, joyería)
- ¿Cómo lo acomodarías tú en la tienda? (eso define el menú)
- ¿Manejas colecciones o temporadas (Regreso a clases, Buen Fin, Día de las Madres, Navidad, 14 de febrero)?
- ¿Tienes marcas propias o revendes marcas? ¿Cuáles?

### Información de cada prenda (qué subir)
- Por producto, ¿qué datos tienes a la mano? nombre · precio · precio antes (oferta) · tallas · colores · material/tela · cuidados de lavado · marca · código/SKU · fotos (cuántas)
- ¿Las tallas son MX, US, CH/M/G, numéricas? ¿Tienes tabla de medidas?
- ¿Quieres mostrar precio siempre, o "pregunta por precio"? ¿Precio con IVA?
- ¿Mayoreo o medio mayoreo? ¿Desde cuántas piezas y a qué precio?
- ¿Cada cuánto llega mercancía nueva? ¿Cuántos productos nuevos por semana?
- ¿Quién va a subir/actualizar productos? ¿Desde celular o computadora? ¿Qué tan cómoda se siente con la tecnología?
- ¿Marcamos "agotado" o lo quitamos de la página?

### Fotos
- ¿Tienes fotos propias de los productos? ¿Con modelo, maniquí o sobre fondo?
- ¿Tienes foto de la fachada / interior de la tienda / equipo?
- ¿Tienes logo actual, colores o tipografía que ya uses? (si no, revisar `/logos`)

### Venta y logística
- ¿La página solo muestra (catálogo) o quieres vender en línea con pago (tarjeta, OXXO, transferencia, Mercado Pago)?
- ¿Haces envíos? ¿A dónde, con qué paquetería, costo, tiempo? ¿Envío gratis desde cierto monto?
- ¿Apartados? ¿Con cuánto anticipo y cuántos días?
- ¿Cambios y devoluciones? ¿Plazo y condiciones?
- Formas de pago en tienda (efectivo, tarjeta, transferencia, meses sin intereses).

### Contacto y confianza
- Número de WhatsApp para pedidos (¿Business?), teléfono, correo.
- Horario de atención por día (incluye domingo / días festivos).
- Redes sociales oficiales (links exactos).
- ¿Tienes reseñas de Google o testimonios que podamos usar (con permiso)?
- ¿Ubicación en Google Maps ya registrada?

## 4. Reacción al prototipo (10 min)
Mostrar el sitio en el celular y pedir que piense en voz alta.
- "Busca un pantalón de mezclilla de dama talla 28." (¿lo encuentra? ¿dónde duda?)
- "Pide esa prenda por WhatsApp." (¿el mensaje le sirve tal cual?)
- ¿Qué cambiarías de colores, logo, textos?
- ¿Qué falta para que una clienta confíe y te escriba?
- Elegir 1–2 opciones de logo de `/logos` (o descartar todas).

## 5. Cierre (5 min)
- ¿Algo importante que no preguntamos?
- ¿Fecha ideal para lanzar? ¿Algún evento (Buen Fin, temporada) a aprovechar?
- ¿Presupuesto mensual para dominio (`reno.mx` / `renoropa.com`, ~$300–600 MXN/año) y fotos?
- Acordar cómo nos manda la info: hoja de cálculo plantilla (ver abajo) + carpeta de fotos.

## Plantilla de datos por producto (para que la dueña llene)
| Campo | Ejemplo | Obligatorio |
|---|---|---|
| Nombre | Blusa de lino manga corta | Sí |
| Categoría | Dama > Blusas | Sí |
| Precio (MXN) | 349 | Sí |
| Precio antes | 449 | No (solo ofertas) |
| Tallas | CH, M, G, XG | Sí |
| Colores | Blanco, Arena | Sí |
| Material | 100% lino | No |
| Cuidados | Lavar a mano, agua fría | No |
| Etiquetas | Nuevo, Oferta, Temporada | No |
| Fotos | blusa-lino-1.jpg, -2.jpg | Sí (mín. 1) |
| Disponible | Sí / Agotado | Sí |

## Después de la entrevista (síntesis)
- Pasar respuestas a `docs/02-funcionalidades.md` (mover features de "propuestas" a "confirmadas/descartadas").
- Actualizar `src/data/store.ts` (contacto, horario, dirección, redes) y `src/data/products.ts`.
