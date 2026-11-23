import type { Product } from "./catalog";

/**
 * PRODUCTOS DE EJEMPLO (precios y prendas inventados para el demo).
 * TODO(dueña): reemplazar con la plantilla de docs/01-preguntas-duena.md.
 * Para agregar uno: copiar un objeto, cambiar `slug` (único, sin acentos ni espacios)
 * y subir fotos a public/products/<slug>-1.jpg.
 */

const c = {
  blanco: { name: "Blanco", hex: "#F5F2EC" },
  negro: { name: "Negro", hex: "#1C1917" },
  arena: { name: "Arena", hex: "#D8C3A5" },
  terracota: { name: "Terracota", hex: "#B4472B" },
  agave: { name: "Verde agave", hex: "#2F5D50" },
  marino: { name: "Azul marino", hex: "#1E2A44" },
  mezclilla: { name: "Mezclilla", hex: "#3E5C7E" },
  rosa: { name: "Rosa", hex: "#E7A1A8" },
  mostaza: { name: "Mostaza", hex: "#D4A017" },
  gris: { name: "Gris jaspe", hex: "#9CA3AF" },
  vino: { name: "Vino", hex: "#6D1F2F" },
  cielo: { name: "Azul cielo", hex: "#9CC3E4" },
};

const adult = ["CH", "M", "G", "XG"];
const kids = ["4", "6", "8", "10", "12"];

export const products: Product[] = [
  { slug: "blusa-lino-manga-corta", name: "Blusa de lino manga corta", audience: "dama", category: "blusas", collections: ["nuevo", "basicos"], price: 349, sizes: adult, colors: [c.blanco, c.arena, c.terracota], material: "55% lino, 45% algodón", care: "Lavar a mano en agua fría. No usar secadora.", description: "Fresca y ligera, ideal para el calor. Corte recto que favorece y combina con todo.", images: [], art: "blouse", available: true },
  { slug: "vestido-midi-floral", name: "Vestido midi floral", audience: "dama", category: "vestidos", collections: ["nuevo"], price: 599, sizes: adult, colors: [c.terracota, c.agave], material: "100% viscosa", care: "Lavar a máquina en ciclo delicado.", description: "Vestido con caída suave y cintura ajustable. Para el día o una reunión.", images: [], art: "dress", available: true },
  { slug: "jeans-mom-fit-dama", name: "Jeans mom fit", audience: "dama", category: "pantalones", collections: ["basicos"], price: 549, compareAt: 699, sizes: ["24", "26", "28", "30", "32", "34"], colors: [c.mezclilla, c.negro], material: "98% algodón, 2% elastano", care: "Lavar al revés en agua fría.", description: "Tiro alto y pierna recta. Mezclilla con un toque de elasticidad para estar cómoda todo el día.", images: [], art: "pants", available: true },
  { slug: "falda-plisada-satinada", name: "Falda plisada satinada", audience: "dama", category: "faldas", collections: ["ofertas"], price: 399, compareAt: 529, sizes: adult, colors: [c.mostaza, c.negro, c.vino], material: "100% poliéster satinado", care: "Lavar a mano. Planchar a baja temperatura.", description: "Plisado que se mueve contigo. Combínala con playera básica o blusa.", images: [], art: "skirt", available: true },
  { slug: "chamarra-borrega-dama", name: "Chamarra de borrega", audience: "dama", category: "chamarras", collections: ["temporada", "nuevo"], price: 899, sizes: adult, colors: [c.arena, c.negro], material: "Exterior poliéster, forro borrega", care: "Lavar a máquina en ciclo delicado.", description: "Calientita y ligera para las mañanas frías. Bolsas laterales y cierre completo.", images: [], art: "jacket", available: true },
  { slug: "blusa-tallas-extra-crepe", name: "Blusa crepé tallas extra", audience: "dama", category: "blusas", collections: ["tallas-extra"], price: 389, sizes: ["XG", "XXG", "3XG"], colors: [c.vino, c.marino, c.blanco], material: "100% poliéster crepé", care: "Lavar a máquina en agua fría.", description: "Corte amplio con caída que estiliza. Tela que no se arruga.", images: [], art: "blouse", available: true },
  { slug: "pijama-franela-dama", name: "Pijama de franela", audience: "dama", category: "pijamas", collections: ["temporada"], price: 459, sizes: adult, colors: [c.rosa, c.gris], material: "100% algodón franela", care: "Lavar a máquina. Secar a la sombra.", description: "Suave y calientita. Pantalón con resorte y camisa con botones.", images: [], art: "pajama", available: true },
  { slug: "tenis-urbanos-dama", name: "Tenis urbanos", audience: "dama", category: "calzado", collections: ["nuevo"], price: 749, sizes: ["22", "23", "24", "25", "26"], colors: [c.blanco, c.negro], material: "Sintético con suela de goma", care: "Limpiar con paño húmedo.", description: "Ligeros y cómodos para todo el día. Plantilla acolchonada.", images: [], art: "shoe", available: true },
  { slug: "bolsa-tote-lona", name: "Bolsa tote de lona", audience: "dama", category: "accesorios", collections: ["basicos"], price: 299, sizes: ["Unitalla"], colors: [c.arena, c.negro, c.terracota], material: "Lona de algodón", care: "Lavar a mano.", description: "Espaciosa y resistente, con bolsillo interior. Para el diario.", images: [], art: "bag", available: true },

  { slug: "playera-basica-algodon", name: "Playera básica de algodón", audience: "caballero", category: "playeras", collections: ["basicos"], price: 199, sizes: [...adult, "XXG"], colors: [c.blanco, c.negro, c.gris, c.marino], material: "100% algodón peinado", care: "Lavar a máquina. No usar cloro.", description: "La básica que no falla: algodón grueso, cuello que no se deforma.", images: [], art: "tee", available: true },
  { slug: "camisa-oxford-caballero", name: "Camisa Oxford", audience: "caballero", category: "camisas", collections: ["basicos", "nuevo"], price: 499, sizes: adult, colors: [c.cielo, c.blanco], material: "100% algodón Oxford", care: "Lavar a máquina. Planchar tibio.", description: "Para la oficina o fin de semana. Botones en el cuello y corte regular.", images: [], art: "shirt", available: true },
  { slug: "pantalon-chino-caballero", name: "Pantalón chino", audience: "caballero", category: "pantalones", collections: ["ofertas"], price: 449, compareAt: 599, sizes: ["28", "30", "32", "34", "36", "38"], colors: [c.arena, c.marino, c.agave], material: "97% algodón, 3% elastano", care: "Lavar a máquina en agua fría.", description: "Corte slim cómodo. Se ve formal y se siente casual.", images: [], art: "pants", available: true },
  { slug: "sudadera-capucha-caballero", name: "Sudadera con capucha", audience: "caballero", category: "sudaderas", collections: ["temporada"], price: 599, sizes: [...adult, "XXG"], colors: [c.gris, c.negro, c.agave], material: "80% algodón, 20% poliéster, interior afelpado", care: "Lavar al revés.", description: "Afelpada por dentro, bolsa canguro y capucha con cordón.", images: [], art: "hoodie", available: true },
  { slug: "chamarra-mezclilla-caballero", name: "Chamarra de mezclilla", audience: "caballero", category: "chamarras", collections: ["nuevo"], price: 849, sizes: adult, colors: [c.mezclilla], material: "100% algodón mezclilla", care: "Lavar al revés en agua fría.", description: "Clásica que dura años. Cuatro bolsas y botones metálicos.", images: [], art: "jacket", available: true },
  { slug: "conjunto-deportivo-caballero", name: "Conjunto deportivo", audience: "caballero", category: "deportiva", collections: ["ofertas"], price: 699, compareAt: 899, sizes: adult, colors: [c.negro, c.marino], material: "Poliéster dry-fit", care: "Lavar a máquina. No planchar.", description: "Playera y short de secado rápido para entrenar o correr.", images: [], art: "tee", available: true },
  { slug: "gorra-bordada", name: "Gorra bordada", audience: "caballero", category: "accesorios", collections: ["basicos"], price: 249, sizes: ["Unitalla"], colors: [c.negro, c.arena, c.agave], material: "Gabardina de algodón", care: "Lavar a mano.", description: "Ajustable con broche. Bordado discreto al frente.", images: [], art: "cap", available: true },
  { slug: "tenis-casuales-caballero", name: "Tenis casuales", audience: "caballero", category: "calzado", collections: ["basicos"], price: 799, sizes: ["25", "26", "27", "28", "29"], colors: [c.blanco, c.marino], material: "Piel sintética", care: "Limpiar con paño húmedo.", description: "Combinan con jeans o chinos. Suela antiderrapante.", images: [], art: "shoe", available: false },

  { slug: "playera-estampada-nino", name: "Playera estampada", audience: "ninos", category: "playeras", collections: ["nuevo"], price: 169, sizes: kids, colors: [c.mostaza, c.cielo, c.blanco], material: "100% algodón", care: "Lavar a máquina.", description: "Estampado divertido que aguanta lavadas. Algodón suave para la piel.", images: [], art: "tee", available: true },
  { slug: "pants-escolar-nino", name: "Pants escolar", audience: "ninos", category: "deportiva", collections: ["basicos"], price: 289, sizes: kids, colors: [c.marino, c.vino], material: "Poliéster perchado", care: "Lavar a máquina.", description: "Resistente para el recreo. Rodillas reforzadas.", images: [], art: "pants", available: true },
  { slug: "vestido-nina-holanes", name: "Vestido con holanes", audience: "ninos", category: "vestidos", collections: ["ofertas"], price: 329, compareAt: 429, sizes: ["2", "4", "6", "8"], colors: [c.rosa, c.blanco], material: "100% algodón", care: "Lavar a mano.", description: "Para fiestas y fotos. Holanes en mangas y moño en la espalda.", images: [], art: "dress", available: true },
  { slug: "chamarra-acolchada-nino", name: "Chamarra acolchada", audience: "ninos", category: "chamarras", collections: ["temporada"], price: 599, sizes: kids, colors: [c.terracota, c.marino], material: "Exterior nylon, relleno sintético", care: "Lavar a máquina en ciclo delicado.", description: "Abriga sin pesar. Capucha desmontable.", images: [], art: "jacket", available: true },
  { slug: "pijama-infantil-algodon", name: "Pijama infantil", audience: "ninos", category: "pijamas", collections: ["basicos"], price: 259, sizes: kids, colors: [c.cielo, c.rosa], material: "100% algodón", care: "Lavar a máquina.", description: "Suavecita para dormir bien. Estampado de estrellas.", images: [], art: "pajama", available: true },

  { slug: "panalero-algodon-bebe", name: "Pañalero de algodón (paquete 3)", audience: "bebe", category: "pijamas", collections: ["basicos", "nuevo"], price: 279, sizes: ["0-3m", "3-6m", "6-12m"], colors: [c.blanco, c.cielo, c.rosa], material: "100% algodón", care: "Lavar a máquina con jabón neutro.", description: "Broches en la entrepierna para cambiar rápido. Algodón hipoalergénico.", images: [], art: "onesie", available: true },
  { slug: "mameluco-afelpado-bebe", name: "Mameluco afelpado", audience: "bebe", category: "pijamas", collections: ["temporada"], price: 319, sizes: ["0-3m", "3-6m", "6-12m"], colors: [c.arena, c.gris], material: "Algodón afelpado", care: "Lavar a máquina con jabón neutro.", description: "Con pies cubiertos para las noches frías. Cierre de cuello a pie.", images: [], art: "onesie", available: true },
];
