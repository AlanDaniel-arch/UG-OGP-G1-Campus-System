/**
 * imagePlaceholder.ts
 * ------------------------------------------------------------------
 * Utilidad para asignar una imagen "placeholder" coherente basada en
 * el análisis de texto del título, descripción y categoría del objeto.
 * 
 * Objetivo: Evitar imágenes aleatorias que no coinciden con el objeto (ej. mostrar una casa para un celular).
 * Estrategia: Búsqueda de palabras clave en español/inglés y mapeo a URLs estables de Unsplash.
 */

// Diccionario de imágenes estables (Unsplash Source con IDs específicos para consistencia)
const ASSETS: Record<string, string> = {
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', // Smartphone en mano/mesa
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80', // Laptop cerrada/abierta
  calculator: 'https://images.unsplash.com/photo-1574607383476-f517b260d35b?auto=format&fit=crop&w=400&q=80', // Calculadora
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80', // Mochila
  keys: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80', // Llaves
  wallet: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?auto=format&fit=crop&w=400&q=80', // Billetera de cuero
  bottle: 'https://images.unsplash.com/photo-1602143407151-011141920038?auto=format&fit=crop&w=400&q=80', // Botella de agua
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', // Audífonos
  umbrella: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80', // Paraguas
  glasses: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80', // Lentes
  clothing: 'https://images.unsplash.com/photo-1542272617-08f083157f0d?auto=format&fit=crop&w=400&q=80', // Ropa (Jeans)
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', // Libros
  document: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=400&q=80', // Documentos/Papel
  watch: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80', // Reloj
  default: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=400&q=80' // Caja/Objeto genérico (Lost & Found vibes)
};

/**
 * Función principal para obtener el placeholder.
 * Prioridad: 
 * 1. Coincidencia exacta en título/descripción.
 * 2. Coincidencia por categoría.
 * 3. Imagen por defecto.
 */
export const getPlaceholderImage = (title: string, description: string, category: string = ''): string => {
  // Normalizar texto para búsqueda insensible a mayúsculas
  const text = `${title} ${description} ${category}`.toLowerCase();

  // 1. Detección por palabras clave específicas (Español e Inglés común)
  if (text.includes('iphone') || text.includes('samsung') || text.includes('celular') || text.includes('móvil') || text.includes('telefono') || text.includes('smartphone')) return ASSETS.phone;
  if (text.includes('laptop') || text.includes('macbook') || text.includes('portátil') || text.includes('computadora') || text.includes('pc')) return ASSETS.laptop;
  if (text.includes('calculadora') || text.includes('casio')) return ASSETS.calculator;
  if (text.includes('mochila') || text.includes('bolso') || text.includes('maleta') || text.includes('morral')) return ASSETS.backpack;
  if (text.includes('llave') || text.includes('llavero') || text.includes('keys')) return ASSETS.keys;
  if (text.includes('billetera') || text.includes('cartera') || text.includes('monedero') || text.includes('tarjeta') || text.includes('cedula') || text.includes('credencial')) return ASSETS.wallet;
  if (text.includes('termo') || text.includes('botella') || text.includes('agua') || text.includes('vaso') || text.includes('tomatodo')) return ASSETS.bottle;
  if (text.includes('audífonos') || text.includes('auriculares') || text.includes('airpods') || text.includes('headset')) return ASSETS.headphones;
  if (text.includes('paraguas') || text.includes('sombrilla')) return ASSETS.umbrella;
  if (text.includes('lentes') || text.includes('gafas') || text.includes('anteojos')) return ASSETS.glasses;
  if (text.includes('libro') || text.includes('cuaderno') || text.includes('agenda') || text.includes('libreta')) return ASSETS.book;
  if (text.includes('reloj') || text.includes('watch') || text.includes('smartwatch')) return ASSETS.watch;
  if (text.includes('abrigo') || text.includes('chompa') || text.includes('sueter') || text.includes('camisa') || text.includes('pantalon') || text.includes('gorra')) return ASSETS.clothing;

  // 2. Fallback por Categoría (si no se detectó palabra clave)
  const catLower = category.toLowerCase();
  if (catLower.includes('electrónica')) return ASSETS.phone; // Default electrónica
  if (catLower.includes('ropa')) return ASSETS.clothing;
  if (catLower.includes('accesorios')) return ASSETS.glasses; // Default accesorios
  if (catLower.includes('libros')) return ASSETS.book;
  if (catLower.includes('documentos')) return ASSETS.document;

  // 3. Imagen genérica si nada coincide
  return ASSETS.default;
};