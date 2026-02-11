import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

/**
 * AuthContext.tsx
 * ------------------------------------------------------------------
 * Este contexto gestiona el estado global de autenticación del usuario.
 * Utiliza el patrón Provider/Consumer de React para evitar "prop drilling"
 * (pasar props manualmente por muchos niveles de componentes).
 * 
 * Conceptos clave:
 * 1. Context API: Permite compartir datos globales (usuario logueado).
 * 2. Persistencia: Uso de localStorage para mantener la sesión tras recargar F5.
 */

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Creamos el contexto con valor inicial indefinido.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * Componente envoltorio (HOC - Higher Order Component pattern conceptual) 
 * que provee el estado de autenticación a toda la app.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Efecto para persistencia de sesión:
  // Al cargar la app, verifica si existe un usuario guardado en localStorage
  // para mantener la sesión activa entre recargas del navegador.
  useEffect(() => {
    const stored = localStorage.getItem('ug_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  /**
   * Función Login (Simulada)
   * En un entorno real, aquí se haría una petición POST al backend (API REST).
   * Para este prototipo, simulamos la creación de sesión y asignación de roles.
   */
  const login = (email: string) => {
    // Lógica simple de roles basada en el string del correo
    let role = UserRole.USER;
    if (email.includes('admin')) role = UserRole.ADMIN;
    
    const newUser: User = {
      id: 'u_' + Date.now(), // Generación de ID temporal basado en timestamp
      email,
      name: email.split('@')[0], // Extrae el nombre del correo
      role
    };
    
    setUser(newUser);
    // Guardamos en localStorage para persistencia
    localStorage.setItem('ug_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ug_user'); // Limpiamos la persistencia al salir
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto.
// Lanza un error si se intenta usar fuera del Provider, una buena práctica 
// para detectar errores de desarrollo temprano.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};