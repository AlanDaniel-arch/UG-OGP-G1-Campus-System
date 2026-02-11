import { ObjectCategory } from '../types';
import { MOCK_LOCATIONS } from '../constants';

/**
 * Interface para los datos extraídos
 */
export interface ExtractedData {
  title?: string;
  category?: string;
  location?: string;
  date?: string;
}

/**
 * Mapeo de meses en español a formato numérico de dos dígitos.
 */
const MONTH_MAP: Record<string, string> = {
  'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 
  'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08', 
  'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
};

/**
 * Diccionarios de Palabras Clave (Keywords)
 */
const CATEGORY_KEYWORDS: Record<string, ObjectCategory> = {
  // Electrónica
  'celular': ObjectCategory.ELECTRONICS,
  'iphone': ObjectCategory.ELECTRONICS,
  'smartphone': ObjectCategory.ELECTRONICS,
  'samsung': ObjectCategory.ELECTRONICS,
  'telefono': ObjectCategory.ELECTRONICS,
  'teléfono': ObjectCategory.ELECTRONICS,
  'laptop': ObjectCategory.ELECTRONICS,
  'macbook': ObjectCategory.ELECTRONICS,
  'computadora': ObjectCategory.ELECTRONICS,
  'pc': ObjectCategory.ELECTRONICS,
  'tablet': ObjectCategory.ELECTRONICS,
  'ipad': ObjectCategory.ELECTRONICS,
  'audifonos': ObjectCategory.ELECTRONICS,
  'audífonos': ObjectCategory.ELECTRONICS,
  'airpods': ObjectCategory.ELECTRONICS,
  'auriculares': ObjectCategory.ELECTRONICS,
  'cargador': ObjectCategory.ELECTRONICS,
  'calculadora': ObjectCategory.ELECTRONICS,
  'casio': ObjectCategory.ELECTRONICS,
  
  // Accesorios / Ropa / Varios
  'mochila': ObjectCategory.ACCESSORIES,
  'bolso': ObjectCategory.ACCESSORIES,
  'maleta': ObjectCategory.ACCESSORIES,
  'cartera': ObjectCategory.ACCESSORIES,
  'billetera': ObjectCategory.ACCESSORIES,
  'monedero': ObjectCategory.ACCESSORIES,
  'lentes': ObjectCategory.ACCESSORIES,
  'gafas': ObjectCategory.ACCESSORIES,
  'anteojos': ObjectCategory.ACCESSORIES,
  'llaves': ObjectCategory.ACCESSORIES,
  'llavero': ObjectCategory.ACCESSORIES,
  'termo': ObjectCategory.ACCESSORIES,
  'botella': ObjectCategory.ACCESSORIES,
  'paraguas': ObjectCategory.ACCESSORIES,
  'sueter': ObjectCategory.CLOTHING,
  'abrigo': ObjectCategory.CLOTHING,
  'chompa': ObjectCategory.CLOTHING,
  'camisa': ObjectCategory.CLOTHING,
  'gorra': ObjectCategory.CLOTHING,
  
  // Documentos
  'cedula': ObjectCategory.DOCUMENTS,
  'cédula': ObjectCategory.DOCUMENTS,
  'credencial': ObjectCategory.DOCUMENTS,
  'tarjeta': ObjectCategory.DOCUMENTS,
  'pasaporte': ObjectCategory.DOCUMENTS,
  'licencia': ObjectCategory.DOCUMENTS,
  'carnet': ObjectCategory.DOCUMENTS,

  // Libros
  'libro': ObjectCategory.BOOKS,
  'cuaderno': ObjectCategory.BOOKS,
  'carpeta': ObjectCategory.BOOKS,
  'agenda': ObjectCategory.BOOKS,
};

const LOCATION_KEYWORDS: Record<string, string> = {
  'cafetería': 'Cafetería Central',
  'cafeteria': 'Cafetería Central',
  'comedor': 'Cafetería Central',
  'almuerzo': 'Cafetería Central',
  'biblioteca': 'Biblioteca General',
  'lectura': 'Biblioteca General',
  'estudio': 'Biblioteca General',
  'aula': 'Edificio A - Aulas',
  'clase': 'Edificio A - Aulas',
  'salon': 'Edificio A - Aulas',
  'salón': 'Edificio A - Aulas',
  'bloque a': 'Edificio A - Aulas',
  'laboratorio': 'Edificio B - Laboratorios',
  'computo': 'Edificio B - Laboratorios',
  'cómputo': 'Edificio B - Laboratorios',
  'bloque b': 'Edificio B - Laboratorios',
  'gimnasio': 'Gimnasio',
  'gym': 'Gimnasio',
  'deporte': 'Gimnasio',
  'cancha': 'Gimnasio',
  'entrenamiento': 'Gimnasio',
  'estacionamiento': 'Estacionamiento Norte',
  'parqueadero': 'Estacionamiento Norte',
  'parking': 'Estacionamiento Norte',
  'carro': 'Estacionamiento Norte',
  'auto': 'Estacionamiento Norte',
  'jardin': 'Jardines Principales',
  'jardín': 'Jardines Principales',
  'patio': 'Jardines Principales',
  'banca': 'Jardines Principales',
  'arbol': 'Jardines Principales',
};

/**
 * Función Auxiliar: Parseo de Fechas en Español
 * Convierte lenguaje natural a formato ISO YYYY-MM-DD.
 */
function parseSpanishDate(text: string): string | undefined {
  const lower = text.toLowerCase();
  const today = new Date();

  // 1. Detección relativa: "hoy"
  if (/\b(hoy)\b/.test(lower)) {
    return today.toISOString().split('T')[0];
  }

  // 2. Detección relativa: "ayer"
  if (/\b(ayer)\b/.test(lower)) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // 3. Formato numérico estricto: DD/MM/YYYY o DD-MM-YYYY
  const numericMatch = text.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/);
  if (numericMatch) {
    const [_, d, m, y] = numericMatch;
    // Padding manual para asegurar formato ISO
    const day = d.length === 1 ? `0${d}` : d;
    const month = m.length === 1 ? `0${m}` : m;
    return `${y}-${month}-${day}`;
  }

  // 4. Lenguaje Natural: "10 de febrero del 2025" o "10 de febrero de 2025"
  // Regex desglose:
  // \b(\d{1,2})   -> Día (1 o 2 dígitos), boundary al inicio.
  // \s+de\s+      -> Espacio + "de" + espacio.
  // ([a-z]+)      -> Nombre del mes.
  // \s+(?:de|del)\s+ -> Espacio + ("de" O "del") + espacio.
  // (\d{4})\b     -> Año (4 dígitos), boundary al final.
  const naturalMatch = lower.match(/\b(\d{1,2})\s+de\s+([a-z]+)\s+(?:de|del)\s+(\d{4})\b/);

  if (naturalMatch) {
    const [_, day, monthName, year] = naturalMatch;
    
    // Validar que el mes exista en nuestro mapa
    const monthNum = MONTH_MAP[monthName];
    if (monthNum) {
      const paddedDay = day.length === 1 ? `0${day}` : day;
      return `${year}-${monthNum}-${paddedDay}`;
    }
  }

  // Si no coincide con ningún patrón seguro (ej: "el martes pasado" o sin año), retornamos undefined.
  return undefined;
}

/**
 * Función Principal de Extracción
 * Analiza el texto y retorna las entidades encontradas.
 */
export const extractReportInfo = (text: string): ExtractedData => {
  const result: ExtractedData = {};
  const lowerText = text.toLowerCase();

  // --- 1. DETECCIÓN DE FECHA (Usando el nuevo parser) ---
  const detectedDate = parseSpanishDate(text);
  if (detectedDate) {
    result.date = detectedDate;
  }

  // --- 2. DETECCIÓN DE UBICACIÓN ---
  for (const [key, value] of Object.entries(LOCATION_KEYWORDS)) {
    if (new RegExp(`\\b${key}`).test(lowerText)) {
      result.location = value;
      break;
    }
  }

  // --- 3. DETECCIÓN DE CATEGORÍA Y TÍTULO ---
  for (const [key, category] of Object.entries(CATEGORY_KEYWORDS)) {
    const regex = new RegExp(`\\b(${key})\\b`, 'i');
    const match = text.match(regex);

    if (match) {
      result.category = category;
      
      if (match.index !== undefined) {
        // Tomar las primeras 4 palabras desde la coincidencia para el título
        const substring = text.slice(match.index);
        const words = substring.split(/\s+/).slice(0, 4);
        let generatedTitle = words.join(' ').replace(/[.,;!?]+$/, '');
        generatedTitle = generatedTitle.charAt(0).toUpperCase() + generatedTitle.slice(1);
        
        result.title = generatedTitle;
      }
      break;
    }
  }

  return result;
};