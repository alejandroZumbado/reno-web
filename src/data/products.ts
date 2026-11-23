import type { Product } from "./catalog";

/**
 * PRODUCTOS DE EJEMPLO (prendas y precios inventados para el demo).
 * Cómo editar (dueña / quien mantenga el sitio):
 * - Precio: cambiar `price`. Para oferta, poner el precio anterior en `compareAt`.
 * - Tallas: lista libre por prenda, ej. ["CH","M","G"] o ["26","28","30"]. Quitar una talla = ya no hay.
 * - Agotado: `available: false` (se sigue mostrando, al final y con aviso).
 * - Nuevo producto: copiar un bloque, cambiar `slug` (único, sin acentos ni espacios) y subir
 *   fotos a public/products/<slug>-1.jpg → `images: ["/products/<slug>-1.jpg"]`.
 */

const c = {
  negro: { name: "Negro", hex: "#111111" },
  blanco: { name: "Blanco", hex: "#F2EFE8" },
  hueso: { name: "Hueso", hex: "#E3D9C6" },
  camel: { name: "Camel", hex: "#B5804A" },
  dorado: { name: "Dorado", hex: "#D4A62A" },
  vino: { name: "Vino", hex: "#6D1F2F" },
  marino: { name: "Azul marino", hex: "#1E2A44" },
  mezclilla: { name: "Mezclilla", hex: "#3E5C7E" },
  gris: { name: "Gris", hex: "#8B8D91" },
  olivo: { name: "Verde olivo", hex: "#5A6340" },
  rosa: { name: "Rosa palo", hex: "#D9A6A6" },
  cielo: { name: "Azul cielo", hex: "#9CC3E4" },
};

const mujerLetra = ["CH", "M", "G", "XG"];
const hombreLetra = ["CH", "M", "G", "XG", "XXG"];

export const products: Product[] = [
  // ── Mujer ──
  { slug: "blusa-satinada-cuello-v", name: "Blusa satinada cuello V", audience: "mujer", category: "blusas", collections: ["nuevo"], price: 389, sizes: mujerLetra, colors: [c.hueso, c.negro, c.vino], material: "100% poliéster satinado", care: "Lavar a mano en agua fría.", description: "Caída suave y brillo discreto. Para la oficina o para salir.", images: [], art: "blouse", available: true },
  { slug: "blusa-lino-manga-corta", name: "Blusa de lino manga corta", audience: "mujer", category: "blusas", collections: [], price: 349, sizes: mujerLetra, colors: [c.blanco, c.camel], material: "55% lino, 45% algodón", care: "Lavar a mano. No usar secadora.", description: "Fresca y ligera. Corte recto que combina con todo.", images: [], art: "blouse", available: true },
  { slug: "vestido-midi-noche", name: "Vestido midi de noche", audience: "mujer", category: "vestidos", collections: ["nuevo"], price: 749, sizes: ["CH", "M", "G"], colors: [c.negro, c.dorado], material: "Crepé con forro", care: "Tintorería o lavado delicado.", description: "Escote cuadrado y abertura lateral. Para eventos y fiestas.", images: [], art: "dress", available: true },
  { slug: "falda-plisada-dorada", name: "Falda plisada", audience: "mujer", category: "faldas", collections: ["ofertas"], price: 399, compareAt: 529, sizes: mujerLetra, colors: [c.dorado, c.negro], material: "Poliéster satinado", care: "Lavar a mano. Planchar tibio.", description: "Plisado con movimiento. Con playera básica o blusa de vestir.", images: [], art: "skirt", available: true },
  { slug: "pantalon-vestir-recto-mujer", name: "Pantalón de vestir recto", audience: "mujer", category: "vestir", collections: [], price: 529, sizes: ["3", "5", "7", "9", "11", "13"], colors: [c.negro, c.camel, c.gris], material: "Gabardina con elastano", care: "Lavar a máquina en ciclo delicado.", description: "Tiro alto y pierna recta. Se ve formal y es cómodo todo el día.", images: [], art: "pants", available: true },
  { slug: "jeans-mom-fit", name: "Jeans mom fit", audience: "mujer", category: "pantalones", collections: ["ofertas"], price: 549, compareAt: 699, sizes: ["24", "26", "28", "30", "32", "34"], colors: [c.mezclilla, c.negro], material: "98% algodón, 2% elastano", care: "Lavar al revés en agua fría.", description: "Tiro alto, pierna recta y un toque de elasticidad.", images: [], art: "pants", available: true },
  { slug: "conjunto-deportivo-mujer", name: "Conjunto deportivo leggings y top", audience: "mujer", category: "deportiva", collections: ["nuevo"], price: 599, sizes: ["CH", "M", "G"], colors: [c.negro, c.olivo, c.rosa], material: "Licra de secado rápido", care: "Lavar en frío. No usar suavizante.", description: "Sujeta sin apretar. Para gym, yoga o correr.", images: [], art: "tee", available: true },
  { slug: "chamarra-piel-sintetica-mujer", name: "Chamarra de piel sintética", audience: "mujer", category: "chamarras", collections: ["temporada"], price: 899, sizes: mujerLetra, colors: [c.negro, c.camel], material: "Piel sintética, forro poliéster", care: "Limpiar con paño húmedo.", description: "Corte biker con cierres metálicos dorados.", images: [], art: "jacket", available: true },
  { slug: "abrigo-largo-pano-mujer", name: "Abrigo largo de paño", audience: "mujer", category: "abrigos", collections: ["temporada", "nuevo"], price: 1290, sizes: ["CH", "M", "G"], colors: [c.camel, c.negro], material: "Paño 60% lana", care: "Tintorería.", description: "Largo a la rodilla, solapa amplia y cinturón. Abriga de verdad.", images: [], art: "coat", available: true },
  { slug: "saco-sastre-mujer", name: "Saco sastre", audience: "mujer", category: "sacos", collections: [], price: 849, sizes: ["CH", "M", "G", "XG"], colors: [c.negro, c.hueso], material: "Poliéster con viscosa", care: "Tintorería o lavado delicado.", description: "Un botón y hombro estructurado. Sube de nivel cualquier jeans.", images: [], art: "blazer", available: true },
  { slug: "blusa-tallas-extra-crepe", name: "Blusa crepé tallas extra", audience: "mujer", category: "blusas", collections: ["tallas-extra"], price: 399, sizes: ["XG", "XXG", "3XG"], colors: [c.vino, c.marino, c.negro], material: "Crepé que no se arruga", care: "Lavar a máquina en agua fría.", description: "Corte amplio con caída que estiliza.", images: [], art: "blouse", available: true },
  { slug: "tenis-plataforma-mujer", name: "Tenis de plataforma", audience: "mujer", category: "calzado", collections: [], price: 749, sizes: ["22", "23", "24", "25", "26"], colors: [c.blanco, c.negro], material: "Sintético, suela de goma", care: "Limpiar con paño húmedo.", description: "Ligeros, con plantilla acolchonada.", images: [], art: "shoe", available: true },
  { slug: "bolsa-cadena-dorada", name: "Bolsa con cadena dorada", audience: "mujer", category: "accesorios", collections: ["nuevo"], price: 459, sizes: ["Unitalla"], colors: [c.negro, c.hueso], material: "Piel sintética", care: "Limpiar con paño seco.", description: "Cruzada o de hombro. Cabe celular, cartera y llaves.", images: [], art: "bag", available: true },

  // ── Hombre ──
  { slug: "camisa-oxford-hombre", name: "Camisa Oxford", audience: "hombre", category: "camisas", collections: [], price: 499, sizes: hombreLetra, colors: [c.cielo, c.blanco], material: "100% algodón Oxford", care: "Lavar a máquina. Planchar tibio.", description: "Para oficina o fin de semana. Corte regular.", images: [], art: "shirt", available: true },
  { slug: "playera-basica-hombre", name: "Playera básica de algodón", audience: "hombre", category: "playeras", collections: [], price: 199, sizes: hombreLetra, colors: [c.negro, c.blanco, c.gris], material: "100% algodón peinado", care: "Lavar a máquina. No usar cloro.", description: "Algodón grueso y cuello que no se deforma.", images: [], art: "tee", available: true },
  { slug: "pantalon-vestir-slim-hombre", name: "Pantalón de vestir slim", audience: "hombre", category: "vestir", collections: ["nuevo"], price: 599, sizes: ["28", "30", "32", "34", "36", "38"], colors: [c.negro, c.marino, c.gris], material: "Poliéster con viscosa", care: "Lavar a máquina en ciclo delicado.", description: "Pinzas discretas y caída limpia. Para trabajo o eventos.", images: [], art: "pants", available: true },
  { slug: "jeans-recto-hombre", name: "Jeans corte recto", audience: "hombre", category: "pantalones", collections: [], price: 579, sizes: ["28", "30", "32", "34", "36", "38", "40"], colors: [c.mezclilla, c.negro], material: "100% algodón mezclilla", care: "Lavar al revés en agua fría.", description: "El clásico de cinco bolsas que dura años.", images: [], art: "pants", available: true },
  { slug: "conjunto-deportivo-hombre", name: "Conjunto deportivo", audience: "hombre", category: "deportiva", collections: ["ofertas"], price: 699, compareAt: 899, sizes: hombreLetra, colors: [c.negro, c.marino], material: "Poliéster dry-fit", care: "Lavar a máquina. No planchar.", description: "Playera y short de secado rápido.", images: [], art: "tee", available: true },
  { slug: "sudadera-capucha-hombre", name: "Sudadera con capucha", audience: "hombre", category: "sudaderas", collections: ["temporada"], price: 599, sizes: hombreLetra, colors: [c.gris, c.negro, c.olivo], material: "Algodón afelpado", care: "Lavar al revés.", description: "Afelpada por dentro, bolsa canguro.", images: [], art: "hoodie", available: true },
  { slug: "chamarra-bomber-hombre", name: "Chamarra bomber", audience: "hombre", category: "chamarras", collections: ["nuevo"], price: 899, sizes: ["CH", "M", "G", "XG"], colors: [c.olivo, c.negro], material: "Nylon con forro acolchado", care: "Lavar a máquina en ciclo delicado.", description: "Puños y cintura de resorte. Ligera y abrigadora.", images: [], art: "jacket", available: true },
  { slug: "abrigo-pano-hombre", name: "Abrigo de paño", audience: "hombre", category: "abrigos", collections: ["temporada"], price: 1390, sizes: ["M", "G", "XG"], colors: [c.negro, c.gris], material: "Paño 60% lana", care: "Tintorería.", description: "Largo a medio muslo, cruzado. Elegante para el frío.", images: [], art: "coat", available: true },
  { slug: "saco-casual-hombre", name: "Saco casual", audience: "hombre", category: "sacos", collections: ["ofertas"], price: 899, compareAt: 1190, sizes: ["36", "38", "40", "42"], colors: [c.marino, c.camel], material: "Algodón con elastano", care: "Tintorería o lavado delicado.", description: "Sin forro, ligero. Con jeans o pantalón de vestir.", images: [], art: "blazer", available: true },
  { slug: "tenis-piel-hombre", name: "Tenis de piel", audience: "hombre", category: "calzado", collections: [], price: 899, sizes: ["25", "26", "27", "28", "29"], colors: [c.blanco, c.negro], material: "Piel", care: "Limpiar con paño húmedo.", description: "Minimalistas, combinan con todo.", images: [], art: "shoe", available: false },
];
