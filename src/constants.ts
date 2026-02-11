import { ObjectCategory, ObjectStatus } from './types';
import { getPlaceholderImage } from './utils/imagePlaceholder';

export const APP_NAME = "UG OBJETOS";
export const DOMAIN_SUFFIX = "@ug.edu.ec";

export const CATEGORIES = Object.values(ObjectCategory);
export const STATUSES = Object.values(ObjectStatus);

export const MOCK_LOCATIONS = [
  "Cafetería Central",
  "Biblioteca General",
  "Edificio A - Aulas",
  "Edificio B - Laboratorios",
  "Gimnasio",
  "Estacionamiento Norte",
  "Jardines Principales"
];

// Seed Data
// Usamos getPlaceholderImage para asegurar que los datos iniciales tengan coherencia visual.
export const INITIAL_OBJECTS = [
  {
    id: '1',
    type: 'LOST',
    title: 'iPhone 13 Funda Azul',
    description: 'Olvidé mi celular en la mesa de la cafetería cerca de la ventana.',
    category: ObjectCategory.ELECTRONICS,
    date: '2023-10-25',
    location: 'Cafetería Central',
    status: ObjectStatus.LOST,
    userId: 'u2',
    imageUrl: getPlaceholderImage('iPhone 13 Funda Azul', 'Olvidé mi celular', ObjectCategory.ELECTRONICS),
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'FOUND',
    title: 'Calculadora Casio',
    description: 'Encontrada en el pasillo del segundo piso bloque A.',
    category: ObjectCategory.ELECTRONICS,
    date: '2023-10-26',
    location: 'Edificio A - Aulas',
    status: ObjectStatus.CUSTODY,
    userId: 'u3',
    imageUrl: getPlaceholderImage('Calculadora Casio', 'Encontrada pasillo', ObjectCategory.ELECTRONICS),
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'FOUND',
    title: 'Mochila Negra Nike',
    description: 'Contiene cuadernos y un termo de agua.',
    category: ObjectCategory.ACCESSORIES,
    date: '2023-10-27',
    location: 'Gimnasio',
    status: ObjectStatus.VALIDATION,
    userId: 'u4',
    imageUrl: getPlaceholderImage('Mochila Negra Nike', 'Contiene cuadernos', ObjectCategory.ACCESSORIES),
    createdAt: new Date().toISOString()
  }
];