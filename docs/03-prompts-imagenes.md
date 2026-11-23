# Reno — Prompts para generar imágenes

> Hechos con skill `image-generation` (prosa, 6 elementos: sujeto, acción, lugar, composición, luz, estilo; exclusiones al final).
> Uso: pegar en el generador que prefieran (ChatGPT/GPT Image, Gemini, Midjourney, Ideogram para texto).
> Primero `n=4` en calidad media; elegir; luego versión final en alta resolución.
> Paleta fija en todos: terracota #B4472B, verde agave #2F5D50, arena #EFE7DA, crema #FAF7F2.
> **Importante:** imágenes generadas sirven para ambientar (hero, banners, redes). Los **productos** deben ser fotos reales de la ropa que se vende (si no, el cliente recibe algo distinto a lo que vio).

## Dónde va cada imagen en el sitio
| Imagen | Archivo destino | Proporción |
|---|---|---|
| Hero inicio | `public/images/hero.jpg` | 4:5 móvil + 16:9 escritorio |
| Catálogo Dama / Caballero / Niños / Bebé | `public/images/cat-<id>.jpg` | 1:1 |
| Producto | `public/products/<slug>-1.jpg` | 4:5 |
| Open Graph (link compartido) | `src/app/opengraph-image.jpg` | 1200×630 |

## 1. Hero (inicio)
```
A photorealistic lifestyle photograph of a warm, family-run clothing boutique in Mexico.
A woman in her thirties holds up a terracotta linen blouse next to a wooden clothing rack
filled with neatly hung garments in sand, cream, deep green and denim tones.
Composition: subject on the right third, soft blurred rack on the left with negative space for a headline.
Lit by late-afternoon window light from camera-left, warm golden tones, gentle shadows, inviting mood.
Shot on an 85mm lens at f/2, shallow depth of field, subtle film grain, Kodak Portra 400 color.
No text, no logos, no watermark. Aspect ratio 16:9.
```

## 2. Catálogos (cuadradas, mismas reglas para las 4)
**Dama**
```
A photorealistic editorial flat lay of a women's outfit on a warm sand-colored linen backdrop:
a terracotta midi dress, a woven straw bag, gold hoop earrings and white sneakers, neatly arranged.
Top-down bird's-eye view, centered with even spacing, generous margins.
Soft overcast diffused light, no harsh shadows, calm and fresh mood.
No text, no logos, no watermark. Aspect ratio 1:1.
```
**Caballero**: igual cambiando la ropa por: `a light blue Oxford shirt, sand chino trousers, a brown leather belt and white canvas sneakers`.
**Niños**: `a mustard yellow printed t-shirt, navy track pants, a small denim jacket and colorful kids sneakers`.
**Bebé**: `three folded cotton onesies in cream, sky blue and soft pink, a knitted beanie and tiny socks`.

## 3. Foto de producto (guía para la dueña con celular, no IA)
- Fondo: pared o sábana color crema/arena lisa, luz de ventana de día (sin flash).
- Prenda planchada, sobre gancho o extendida en el piso (vista desde arriba).
- Celular vertical, 4:5, misma distancia para todas. 2–3 fotos: frente, espalda, detalle de tela.
- Nombre: `<slug>-1.jpg`, `<slug>-2.jpg`.

Si quieren **fondo uniforme con IA** sobre su propia foto (edición, no generación):
```
Change: replace the background with a seamless warm cream (#FAF7F2) studio backdrop with a soft natural shadow under the garment.
Keep unchanged: the garment's exact color, fabric texture, shape, folds, buttons, prints, size and position.
Do not alter saturation or proportions. No text, no watermark.
```

## 4. Fachada / letrero (mockup para decidir logo)
```
A photorealistic street-level photograph of a small clothing shop facade in a sunny Mexican town,
whitewashed wall with a terracotta-painted lower band and a dark green wooden door.
Above the door, a simple sign with the word "RENO" (EXACT, verbatim, no extra characters)
in bold elegant serif letters, cream on deep green, with small deer antlers drawn above the letters.
Eye-level, centered, midday soft light, inviting atmosphere. Ensure the text appears once and is perfectly legible.
No other text, no watermark. Aspect ratio 4:5.
```

## 5. Logo (para explorar más opciones con IA, además de /logos)
```
Create an original, non-infringing logo for "RENO" (EXACT, verbatim), a family clothing store from Mexico,
warm, honest and affordable. Combine a minimal pair of reindeer antlers with the wordmark.
Clean vector-like shapes, strong silhouette, balanced negative space, readable at 32px and on a storefront.
Terracota #B4472B and ink black on a plain cream background. Flat colors, no gradients.
Single centered mark, generous padding. No watermark, no trademarks. Generate 4 variants. Aspect ratio 1:1.
```

## 6. Instagram (post de novedades)
```
A photorealistic flat lay for a social media post: five folded garments in terracotta, sand, cream,
deep agave green and denim, stacked in a soft gradient on a light wooden table, with a small
dried flower sprig. Top-down view, items on the lower two-thirds, empty cream space at the top for text added later.
Soft morning window light, cozy and fresh mood. No text, no logos, no watermark. Aspect ratio 4:5.
```
