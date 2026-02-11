import React, { useState } from 'react';
import { DOMAIN_SUFFIX } from '../constants';

/**
 * Register.tsx
 * ------------------------------------------------------------------
 * Página de Registro de Usuario.
 * 
 * Conceptos clave:
 * 1. Validación de cliente: Verifica que las contraseñas coincidan antes de procesar.
 * 2. Feedback al usuario: Uso de `alert` para informar éxito o error (simple para prototipos).
 * 3. Navegación programática: Redirige a Login tras registro exitoso.
 */

const Register: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga
    
    // Validación lógica simple
    if (pass !== confirmPass) {
      alert("Las contraseñas no coinciden");
      return; // Detiene la ejecución si falla la validación
    }
    
    if (email && pass && name) {
      // Aquí se llamaría a un servicio de registro en el backend.
      // Para este MVP, solo notificamos y redirigimos.
      alert("Cuenta creada con éxito. Por favor inicia sesión.");
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 md:p-12 w-full max-w-md animate-fade-in-up transition-colors duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ug-navy dark:text-white mb-2">REGISTRO</h2>
          <p className="text-slate-400 text-sm">Crea tu cuenta institucional</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-ug-navy focus:ring-1 focus:ring-ug-navy outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Correo Institucional</label>
            <input
              type="text"
              required
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
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-ug-navy focus:ring-1 focus:ring-ug-navy outline-none transition-all"
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-ug-navy focus:ring-1 focus:ring-ug-navy outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-ug-navy dark:bg-ug-accent text-white rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-blue-600 transform active:scale-95 transition-all shadow-lg shadow-ug-navy/20 dark:shadow-ug-accent/20"
          >
            REGISTRARSE
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-50 dark:border-slate-700">
          <button 
            type="button"
            onClick={() => onNavigate('login')} 
            className="text-ug-accent font-medium hover:underline text-sm bg-transparent border-none cursor-pointer"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;