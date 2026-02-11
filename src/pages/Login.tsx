import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DOMAIN_SUFFIX } from '../constants';

/**
 * Login.tsx
 * ------------------------------------------------------------------
 * Página de Inicio de Sesión.
 * 
 * Conceptos clave:
 * 1. Controlled Inputs: Los inputs están vinculados al estado local (email, pass).
 * 2. Uso del Contexto de Auth: Consume la función `login` global.
 * 3. UX: Feedback visual y redirección post-login.
 */

const Login: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  // Hook personalizado para acceder a la lógica de autenticación global.
  const { login } = useAuth();
  
  // Estado local para los campos del formulario.
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  /**
   * Manejador del envío del formulario.
   * @param e Evento del formulario.
   */
  const handleSubmit = (e: React.FormEvent) => {
    // IMPORTANTE: e.preventDefault() evita que el navegador recargue la página,
    // comportamiento por defecto de los formularios HTML. Es vital en Single Page Applications (SPA).
    e.preventDefault();
    
    // Validación básica
    if (email && pass) {
      // Concatenamos el dominio si el usuario no lo escribió, mejorando la UX.
      login(email + (email.includes('@') ? '' : DOMAIN_SUFFIX));
      
      // Redireccionamos al usuario al Home tras un login exitoso.
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 md:p-12 w-full max-w-md animate-fade-in-up transition-colors duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ug-navy dark:text-white mb-2">ACCESO</h2>
          <p className="text-slate-400 text-sm">Utiliza tus credenciales institucionales</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Correo Institucional</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`usuario${DOMAIN_SUFFIX}`}
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-ug-navy focus:ring-1 focus:ring-ug-navy outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-ug-navy focus:ring-1 focus:ring-ug-navy outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-ug-navy dark:bg-ug-accent text-white rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-blue-600 transform active:scale-95 transition-all shadow-lg shadow-ug-navy/20 dark:shadow-ug-accent/20"
          >
            INGRESAR
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-50 dark:border-slate-700">
          <button 
            type="button"
            onClick={() => onNavigate('register')} 
            className="text-ug-accent font-medium hover:underline text-sm bg-transparent border-none cursor-pointer"
          >
            ¿Nuevo estudiante? Regístrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;