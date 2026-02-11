import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Report from './pages/Report';
import Claim from './pages/Claim';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

/**
 * App.tsx
 * ------------------------------------------------------------------
 * Componente Raíz de la Aplicación.
 * 
 * Responsabilidades:
 * 1. Estructura general (Navbar + Contenido).
 * 2. Enrutamiento manual (Client-side Routing): Renderiza componentes basados en el estado `currentPage`.
 * 3. Gestión del Tema (Modo Oscuro/Claro).
 * 4. Inyección de Dependencias: Envuelve la app en los Providers (Auth y Data) para acceso global al estado.
 */

const AppContent: React.FC = () => {
  // Estado para el enrutamiento manual. Determina qué "página" se muestra.
  const [currentPage, setCurrentPage] = useState('home');
  // Estado para pasar parámetros entre páginas (ej: ID de un objeto al ir a Reclamar).
  const [pageParams, setPageParams] = useState<any>({});
  
  // Estado del Tema Visual
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Efecto: Inicialización del Tema
  // Se ejecuta una sola vez al montar el componente. Verifica preferencias del usuario o del sistema.
  useEffect(() => {
    const savedTheme = localStorage.getItem('ug_theme');
    // Si hay preferencia guardada o si el sistema operativo prefiere oscuro
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Función para alternar tema y persistir la elección en localStorage.
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('ug_theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      localStorage.setItem('ug_theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  /**
   * Función de Navegación Global.
   * Se pasa como prop a los componentes hijos para que puedan cambiar la página visible.
   */
  const navigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params || {});
    window.scrollTo(0, 0); // Reset del scroll al cambiar de vista
  };

  /**
   * Renderizado Condicional (Router).
   * Decide qué componente montar según el string `currentPage`.
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'login': return <Login onNavigate={navigate} />;
      case 'register': return <Register onNavigate={navigate} />;
      case 'inventory': return <Inventory onNavigate={navigate} initialSearch={pageParams.search} />;
      case 'report': return <Report onNavigate={navigate} />;
      case 'claim': return <Claim onNavigate={navigate} objectId={pageParams.objectId} />;
      case 'admin': return <div className="p-10 text-center text-slate-500 dark:text-slate-400">Panel Administrativo (Requiere Auth de Admin)</div>;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar 
        onNavigate={navigate} 
        currentPage={currentPage} 
        toggleTheme={toggleTheme} 
        currentTheme={theme} 
      />
      
      <main className="fade-in">
        {renderPage()}
      </main>
    </div>
  );
};

// Componente Wrapper Principal
// Aquí se configuran los Context Providers para que *toda* la aplicación
// tenga acceso a la sesión del usuario (AuthProvider) y a los datos (DataProvider).
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;