import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CATEGORIES, MOCK_LOCATIONS } from '../constants';
import { ObjectStatus } from '../types';
import Card from '../components/Card';
import { getPlaceholderImage } from '../utils/imagePlaceholder';

interface InventoryProps {
  initialSearch?: string;
  onNavigate: (page: string, params?: any) => void;
}

const Inventory: React.FC<InventoryProps> = ({ initialSearch = '', onNavigate }) => {
  const { objects } = useData();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [catFilter, setCatFilter] = useState('');
  const [locFilter, setLocFilter] = useState('');

  const filtered = objects.filter(obj => {
    const matchesSearch = obj.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          obj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = catFilter ? obj.category === catFilter : true;
    const matchesLoc = locFilter ? obj.location === locFilter : true;
    return matchesSearch && matchesCat && matchesLoc;
  });

  const getStatusColor = (status: ObjectStatus) => {
    // Adaptado para Dark Mode: colores más suaves/transparentes sobre fondo oscuro
    switch (status) {
      case ObjectStatus.LOST: return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case ObjectStatus.FOUND: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case ObjectStatus.CUSTODY: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
      case ObjectStatus.VALIDATION: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      case ObjectStatus.DELIVERED: return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold text-ug-navy dark:text-white">INVENTARIO</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
             <input
               type="text"
               placeholder="Buscar..."
               className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-ug-accent focus:ring-1 focus:ring-ug-accent outline-none text-sm transition-colors"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <select 
              value={catFilter} 
              onChange={(e) => setCatFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:border-ug-accent focus:ring-1 focus:ring-ug-accent outline-none transition-colors"
            >
             <option value="">Todas las Categorías</option>
             {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
           <select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:border-ug-accent focus:ring-1 focus:ring-ug-accent outline-none transition-colors"
            >
             <option value="">Todas las Ubicaciones</option>
             {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length > 0 ? filtered.map(item => {
          const displayImage = item.imageUrl || getPlaceholderImage(item.title, item.description, item.category as string);
          
          return (
            <Card key={item.id} className="flex flex-col h-full group">
              <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                <img 
                  src={displayImage} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                  }}
                />
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 shadow-sm`}>
                  {item.type === 'LOST' ? 'PERDIDO' : 'HALLADO'}
                </span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-ug-navy dark:text-white line-clamp-1">{item.title}</h3>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {item.location}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
                  {item.description}
                </p>
                
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{item.date}</span>
                  {item.status !== ObjectStatus.DELIVERED ? (
                    <button 
                      onClick={() => onNavigate('claim', { objectId: item.id })}
                      className="text-sm font-semibold text-ug-accent hover:text-ug-navy dark:hover:text-white transition-colors"
                    >
                      RECLAMAR &rarr;
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">ENTREGADO</span>
                  )}
                </div>
              </div>
            </Card>
          );
        }) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
               <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">No se encontraron objetos.</p>
            <p className="text-slate-400 dark:text-slate-500">Intenta con otros filtros o términos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;