import React, { createContext, useContext, useState, useEffect } from 'react';
import { ObjectReport, Claim, ObjectStatus } from '../types';
import { INITIAL_OBJECTS } from '../constants';

/**
 * DataContext.tsx
 * ------------------------------------------------------------------
 * Actúa como una "Base de Datos en Cliente" (Client-side Store).
 * Centraliza la lógica de negocio para Objetos y Reclamos.
 * 
 * Responsabilidades:
 * 1. Almacenar el inventario de objetos y la lista de reclamos.
 * 2. Persistir datos en localStorage para simular backend.
 * 3. Ejecutar reglas de negocio (ej: cambiar estado de objeto al crear reclamo).
 */

interface DataContextType {
  objects: ObjectReport[];
  claims: Claim[];
  addObject: (obj: Omit<ObjectReport, 'id' | 'createdAt' | 'status'>) => void;
  addClaim: (claim: Omit<Claim, 'id' | 'createdAt' | 'status' | 'claimCode'>) => string;
  resolveClaim: (claimId: string, approved: boolean) => void; // Nueva función para admin
  updateObjectStatus: (id: string, status: ObjectStatus) => void;
  getClaimsByStatus: (status: Claim['status']) => Claim[];
  getClaimByCode: (code: string) => Claim | undefined;
  getObjectById: (id: string) => ObjectReport | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado inicial cargado desde constantes (Seed Data)
  const [objects, setObjects] = useState<ObjectReport[]>(INITIAL_OBJECTS as any);
  const [claims, setClaims] = useState<Claim[]>([]);

  // Efecto de Carga (Hydration):
  // Recupera datos previos guardados en el navegador.
  useEffect(() => {
    const storedObjs = localStorage.getItem('ug_objects');
    const storedClaims = localStorage.getItem('ug_claims');
    if (storedObjs) setObjects(JSON.parse(storedObjs));
    if (storedClaims) setClaims(JSON.parse(storedClaims));
  }, []);

  // Efecto de Persistencia:
  // Guarda automáticamente en localStorage cada vez que `objects` o `claims` cambian.
  useEffect(() => {
    localStorage.setItem('ug_objects', JSON.stringify(objects));
    localStorage.setItem('ug_claims', JSON.stringify(claims));
  }, [objects, claims]);

  // Lógica de negocio: Agregar un nuevo reporte
  const addObject = (obj: Omit<ObjectReport, 'id' | 'createdAt' | 'status'>) => {
    const newObj: ObjectReport = {
      ...obj,
      id: Math.random().toString(36).substr(2, 9), // ID aleatorio simple
      createdAt: new Date().toISOString(),
      // Regla de negocio: Si se reporta perdido, estado es LOST. Si se encuentra, entra a VALIDATION.
      status: obj.type === 'LOST' ? ObjectStatus.LOST : ObjectStatus.VALIDATION,
    };
    setObjects(prev => [newObj, ...prev]); // Agrega al principio de la lista
  };

  /**
   * Generar un Reclamo + Sincronización de Estado
   * REGLA IMPORTANTE: Cuando se crea un reclamo, el objeto asociado debe dejar de estar "disponible".
   * Por eso, cambiamos su estado a 'EN VALIDACIÓN'.
   */
  const addClaim = (claimData: Omit<Claim, 'id' | 'createdAt' | 'status' | 'claimCode'>) => {
    const code = 'UG-' + Math.floor(100000 + Math.random() * 900000); // Generador de código único
    const newClaim: Claim = {
      ...claimData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      claimCode: code
    };
    
    setClaims(prev => [...prev, newClaim]);

    // SINCRONIZACIÓN: El objeto asociado cambia a estado VALIDACIÓN
    // Esto asegura que en el inventario aparezca visualmente distinto.
    setObjects(prev => prev.map(obj => 
      obj.id === claimData.reportId 
        ? { ...obj, status: ObjectStatus.VALIDATION }
        : obj
    ));

    return code;
  };

  /**
   * Resolver Reclamo (Admin)
   * Maneja la lógica de aprobación/rechazo y actualiza el objeto en cascada.
   */
  const resolveClaim = (claimId: string, approved: boolean) => {
    // 1. Actualizar el estado del reclamo (APPROVED / REJECTED)
    const targetClaim = claims.find(c => c.id === claimId);
    if (!targetClaim) return;

    setClaims(prev => prev.map(c => 
      c.id === claimId 
        ? { ...c, status: approved ? 'APPROVED' : 'REJECTED' }
        : c
    ));

    // 2. Actualizar el objeto según la decisión
    setObjects(prev => prev.map(obj => {
      if (obj.id === targetClaim.reportId) {
        if (approved) {
          // Si se aprueba, el objeto se considera ENTREGADO al dueño
          return { ...obj, status: ObjectStatus.DELIVERED };
        } else {
          // Si se rechaza, el objeto vuelve a estar disponible (ENCONTRADO)
          return { ...obj, status: ObjectStatus.FOUND };
        }
      }
      return obj;
    }));
  };

  const updateObjectStatus = (id: string, status: ObjectStatus) => {
    setObjects(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const getClaimsByStatus = (status: Claim['status']) => claims.filter(c => c.status === status);

  // Helpers de búsqueda
  const getClaimByCode = (code: string) => claims.find(c => c.claimCode === code);
  const getObjectById = (id: string) => objects.find(o => o.id === id);

  return (
    <DataContext.Provider value={{ 
      objects, 
      claims, 
      addObject, 
      addClaim, 
      resolveClaim,
      updateObjectStatus, 
      getClaimsByStatus,
      getClaimByCode,
      getObjectById
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};