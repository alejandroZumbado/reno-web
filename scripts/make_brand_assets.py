"""
Genera los recursos de marca a partir del logo oficial (JPG con fondo negro) de la dueña.

Por qué así: la dueña solo tiene el JPG. Como el logo es dorado sobre negro puro, el negro
se puede convertir en transparencia sin recortar a mano ("unscreen"): alpha = canal más
brillante, y el color se des-premultiplica para que el dorado no quede apagado.
Si algún día llega el archivo vectorial original, reemplazar estas salidas por exportaciones de él.

Uso:  python scripts/make_brand_assets.py
Salidas:
  public/brand/reno-logo.png   logo completo transparente (recortado al contenido)
  public/brand/reno-mark.png   solo el venado-gancho transparente (header, favicon)
  src/app/icon.png             favicon moderno 512px (fondo negro: en pestañas claras el dorado se pierde)
  src/app/apple-icon.png       180px para iPhone (iOS no respeta transparencia)
  src/app/favicon.ico          16/32/48 para navegadores viejos
  src/app/opengraph-image.png  1200x630 para la vista previa al compartir por WhatsApp/Facebook
"""

from pathlib import Path
import sys

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "brand" / "reno-logo-original.jpeg"
BLACK = (0, 0, 0, 255)

# Caja del venado (cabeza, astas y hombros del gancho) en el JPG de 1254px.
# Medida a ojo sobre el original; si cambia el archivo fuente hay que volver a medirla.
MARK_BOX = (330, 20, 900, 560)

# Debajo de este alpha el píxel es ruido de compresión JPG en el fondo negro.
NOISE_FLOOR = 18


def unscreen(img: Image.Image) -> Image.Image:
    """Convierte negro → transparente conservando el brillo del dorado."""
    rgb = img.convert("RGB")
    r, g, b = rgb.split()
    alpha = ImageChops.lighter(ImageChops.lighter(r, g), b)
    alpha = alpha.point(lambda v: 0 if v < NOISE_FLOOR else v)

    # Des-premultiplicar: color = color / alpha. Sin esto el borde suave se ve sucio/oscuro.
    px_rgb = rgb.load()
    px_a = alpha.load()
    out = Image.new("RGBA", rgb.size)
    px_out = out.load()
    w, h = rgb.size
    for y in range(h):
        for x in range(w):
            a = px_a[x, y]
            if a == 0:
                px_out[x, y] = (0, 0, 0, 0)
                continue
            cr, cg, cb = px_rgb[x, y]
            k = 255 / a
            px_out[x, y] = (min(255, round(cr * k)), min(255, round(cg * k)), min(255, round(cb * k)), a)
    return out


def trim(img: Image.Image, pad: int = 8) -> Image.Image:
    """Recorta al contenido visible con un margen pequeño."""
    box = img.getchannel("A").getbbox()
    if box is None:
        raise ValueError("La imagen quedó vacía: revisar NOISE_FLOOR o el archivo fuente.")
    l, t, r, b = box
    return img.crop((max(0, l - pad), max(0, t - pad), min(img.width, r + pad), min(img.height, b + pad)))


def on_black_square(img: Image.Image, size: int, fill: float) -> Image.Image:
    """Centra `img` en un cuadrado negro ocupando `fill` del lado."""
    canvas = Image.new("RGBA", (size, size), BLACK)
    scale = fill * size / max(img.size)
    fitted = img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)
    canvas.alpha_composite(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2))
    return canvas


def main() -> None:
    if not SRC.exists():
        sys.exit(f"No existe el logo fuente: {SRC}")

    original = Image.open(SRC)
    logo = trim(unscreen(original))
    mark = trim(unscreen(original.crop(MARK_BOX)))

    brand = ROOT / "public" / "brand"
    app = ROOT / "src" / "app"
    logo.save(brand / "reno-logo.png", optimize=True)
    mark.save(brand / "reno-mark.png", optimize=True)

    icon = on_black_square(mark, 512, 0.86)
    icon.convert("RGB").save(app / "icon.png", optimize=True)
    on_black_square(mark, 180, 0.82).convert("RGB").save(app / "apple-icon.png", optimize=True)
    # Turbopack exige ICO en RGBA ("The PNG is not in RGBA format"): no convertir a RGB aquí.
    icon.save(app / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    og = Image.new("RGBA", (1200, 630), BLACK)
    scale = 560 / logo.height
    og_logo = logo.resize((round(logo.width * scale), 560), Image.Resampling.LANCZOS)
    og.alpha_composite(og_logo, ((1200 - og_logo.width) // 2, 35))
    og.convert("RGB").save(app / "opengraph-image.png", optimize=True)

    print("OK", logo.size, mark.size)


if __name__ == "__main__":
    main()
