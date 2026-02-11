export enum UserRole {
  GUEST = 'INVITADO',
  USER = 'USUARIO',
  ADMIN = 'ADMIN'
}

export enum ObjectStatus {
  LOST = 'PERDIDO',
  FOUND = 'ENCONTRADO',
  VALIDATION = 'EN VALIDACIÓN',
  CUSTODY = 'EN CUSTODIA',
  DELIVERED = 'ENTREGADO'
}

export enum ObjectCategory {
  ELECTRONICS = 'Electrónica',
  CLOTHING = 'Ropa',
  DOCUMENTS = 'Documentos',
  ACCESSORIES = 'Accesorios',
  BOOKS = 'Libros/Material',
  OTHER = 'Otros'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ObjectReport {
  id: string;
  type: 'LOST' | 'FOUND';
  title: string;
  description: string;
  category: ObjectCategory | string;
  date: string;
  location: string;
  status: ObjectStatus;
  imageUrl?: string;
  userId: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  reportId: string;
  claimantId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  proofDescription: string;
  claimCode: string;
  createdAt: string;
}

export interface DeliveryLog {
  id: string;
  reportId: string;
  adminId: string;
  receiverId: string;
  deliveredAt: string;
}