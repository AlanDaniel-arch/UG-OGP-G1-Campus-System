import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { APP_NAME } from '../constants';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, toggleTheme, currentTheme }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'INICIO' },
    { id: 'inventory', label: 'BUSCAR OBJETOS' },
    { id: 'report', label: 'REPORTAR' },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ id: 'admin', label: 'PANEL ADMIN' });
  }

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-ug-navy dark:bg-ug-accent rounded-full flex items-center justify-center text-white font-bold text-sm">UG</div>
              <span className="font-bold text-xl tracking-tight text-ug-navy dark:text-white">{APP_NAME}</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id ? 'text-ug-accent' : 'text-slate-500 dark:text-slate-400 hover:text-ug-navy dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title={currentTheme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
              {currentTheme === 'light' ? (
                // Moon Icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                // Sun Icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <div className="flex items-center space-x-4 border-l pl-4 border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ROL: {user ? user.role : 'INVITADO'}
              </span>
              {user ? (
                 <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-400">
                   SALIR
                 </button>
              ) : (
                <button onClick={() => handleNav('login')} className="bg-ug-navy dark:bg-ug-accent text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-blue-600 transition">
                  ACCEDER
                </button>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Theme Toggle Mobile */}
             <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {currentTheme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-ug-navy dark:text-slate-400 dark:hover:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${
                  currentPage === item.id ? 'bg-slate-50 dark:bg-slate-800 text-ug-accent' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
             <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 px-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">
                {user ? `HOLA, ${user.name.toUpperCase()}` : 'MODO INVITADO'}
              </span>
              {user ? (
                 <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-400">SALIR</button>
              ) : (
                <button onClick={() => handleNav('login')} className="text-sm font-bold text-ug-navy dark:text-white">ACCEDER</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;