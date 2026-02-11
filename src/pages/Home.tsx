import React, { useState } from 'react';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('inventory', { search: searchTerm });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="text-center max-w-4xl w-full space-y-8 animate-fade-in-up">
        
        <h1 className="text-4xl md:text-6xl font-bold text-ug-navy dark:text-white tracking-tight leading-tight">
          OBJETOS PERDIDOS
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
          Sistema centralizado de gestión para recuperar tus pertenencias en el campus universitario.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mt-12 relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-slate-400 group-focus-within:text-ug-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-16 pr-6 py-5 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:border-ug-accent focus:ring-4 focus:ring-ug-accent/10 transition-all shadow-sm"
            placeholder="¿Qué perdiste hoy? (ej. iPhone, llaves, termo)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-ug-navy dark:bg-ug-accent text-white px-8 rounded-full font-medium hover:bg-slate-800 dark:hover:bg-blue-600 transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <button onClick={() => onNavigate('report')} className="group flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-ug-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="font-semibold text-ug-navy dark:text-white">Reportar</span>
            <span className="text-sm text-slate-400 mt-1">Perdí o encontré algo</span>
          </button>

          <button onClick={() => onNavigate('inventory')} className="group flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-ug-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
             <div className="h-12 w-12 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <span className="font-semibold text-ug-navy dark:text-white">Localizar</span>
            <span className="text-sm text-slate-400 mt-1">Ver mapa e inventario</span>
          </button>

          <button onClick={() => onNavigate('claim')} className="group flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-ug-accent/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
             <div className="h-12 w-12 rounded-full bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400 flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="font-semibold text-ug-navy dark:text-white">Recuperar</span>
            <span className="text-sm text-slate-400 mt-1">Validar mi reclamo</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;