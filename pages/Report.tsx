import React, { useState, useRef, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, MOCK_LOCATIONS } from '../constants';
import { ObjectCategory } from '../types';
import { getPlaceholderImage } from '../utils/imagePlaceholder';
import { extractReportInfo } from '../utils/aiHelper'; // Usa el parser mejorado

/**
 * Report.tsx
 * ------------------------------------------------------------------
 * Formulario para crear nuevos reportes (Objetos Perdidos o Encontrados).
 * 
 * Características Avanzadas Documentadas:
 * 1. "Asistente IA": Simulación de procesamiento de Lenguaje Natural (NLP) para autocompletado.
 * 2. Hooks: `useMemo` para datos calculados y `useRef` para manejo del DOM (input file).
 * 3. File API: Lectura de imágenes en cliente (Drag & Drop + FileReader).
 */

const Report: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { addObject } = useData();
  const { user } = useAuth();
  
  // Estado del formulario (Controlled Components)
  const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState<string>(ObjectCategory.OTHER);
  const [loc, setLoc] = useState('');
  const [date, setDate] = useState(''); // Inicialmente vacío
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Estados para manejo de imagen local
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Placeholder Dinámico (useMemo)
   * Se recalcula solo si cambia el estado `type`. Mejora rendimiento y UX
   * mostrando un ejemplo contextual (perdí vs encontré).
   */
  const aiPlaceholder = useMemo(() => {
    return type === 'LOST' 
      ? "Ej: Perdí mi billetera de cuero café en la biblioteca ayer por la tarde. Tenía mi credencial..."
      : "Ej: Encontré un iPhone 12 con funda roja en una banca de los jardines principales el 10 de febrero de 2025...";
  }, [type]);

  /**
   * Lógica del Asistente IA (Extractora)
   * Simula un proceso asíncrono (como llamar a una API real).
   * Analiza el texto de descripción y extrae entidades automáticamente.
   */
  const handleAI = () => {
    if (!desc.trim()) return;

    setIsAIProcessing(true); // Activa UI de carga
    setAiFeedback(null);

    // setTimeout simula latencia de red (1.5 segundos) para dar feedback de "procesamiento".
    setTimeout(() => {
      // 1. Extraer información usando reglas deterministas (RegEx)
      const extracted = extractReportInfo(desc);
      let changesCount = 0;

      // 2. Llenar campos SOLO si están vacíos (no sobrescribe datos del usuario)
      
      // Título
      if (!title && extracted.title) {
        setTitle(extracted.title);
        changesCount++;
      }

      // Categoría
      if ((!cat || cat === ObjectCategory.OTHER) && extracted.category) {
        setCat(extracted.category);
        changesCount++;
      }

      // Ubicación
      if (!loc && extracted.location) {
        setLoc(extracted.location);
        changesCount++;
      }

      // Fecha
      // Nota: extracted.date ya viene parseada en formato ISO (YYYY-MM-DD)
      if (!date && extracted.date) {
        setDate(extracted.date);
        changesCount++;
      }

      // Feedback textual al usuario sobre qué hizo la IA
      if (changesCount > 0) {
        setAiFeedback(`Se completaron ${changesCount} datos detectados en tu descripción.`);
      } else {
        setAiFeedback("No se detectó información nueva o los campos ya estaban llenos.");
      }

      setIsAIProcessing(false); // Desactiva UI de carga
    }, 1500);
  };

  /**
   * Manejo de Archivos (Imágenes)
   * Usa FileReader para convertir la imagen a Base64 y mostrar previsualización.
   */
  const processFile = (file: File) => {
    // Validaciones de tipo y tamaño
    if (!file.type.startsWith('image/')) {
      alert("Solo se permiten archivos de imagen (JPG, PNG).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert("La imagen es demasiado grande. Máximo 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFile(file);
      setImagePreview(reader.result as string); // string Base64 para <img> src
    };
    reader.readAsDataURL(file);
  };

  // Event Handlers para Drag & Drop nativo
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  // Envío final del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión");
      onNavigate('login');
      return;
    }

    // Fallbacks para datos obligatorios
    const finalDate = date || new Date().toISOString().split('T')[0];
    const finalImage = imagePreview || getPlaceholderImage(title, desc, cat);
    
    // Guardado en Contexto (Base de datos local)
    addObject({
      type,
      title: title || 'Objeto sin nombre',
      description: desc,
      category: cat,
      location: loc || 'Ubicación desconocida',
      date: finalDate,
      userId: user.id,
      imageUrl: finalImage
    });
    alert("Reporte guardado con éxito.");
    onNavigate('inventory');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-ug-navy dark:text-white mb-8 text-center">NUEVO REPORTE</h2>

      {/* Selector de Tipo (Toggle) */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-full inline-flex">
          <button
            onClick={() => setType('LOST')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${type === 'LOST' ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            PERDÍ ALGO
          </button>
          <button
            onClick={() => setType('FOUND')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${type === 'FOUND' ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            ENCONTRÉ ALGO
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
        
        {/* Bloque Asistente IA */}
        <div className="bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-2xl p-6 relative overflow-hidden">
          {/* Overlay de Carga durante procesamiento IA */}
          {isAIProcessing && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                <svg className="animate-spin h-5 w-5 text-ug-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs font-bold text-ug-navy dark:text-white">Procesando descripción...</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-ug-accent">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               <span className="font-bold text-sm uppercase tracking-wide">Asistente IA</span>
            </div>
            <button
              type="button"
              onClick={handleAI}
              disabled={isAIProcessing || !desc}
              className="text-xs font-bold text-white bg-ug-accent px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Analiza el texto para llenar los campos automáticamente"
            >
              {isAIProcessing ? 'AUTO-COMPLETAR' : 'AUTO-COMPLETAR'}
            </button>
          </div>
          <textarea
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
              if (aiFeedback) setAiFeedback(null);
            }}
            className="w-full p-4 rounded-xl border border-blue-200 dark:border-slate-600 dark:bg-slate-900 focus:border-ug-accent focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none text-slate-700 dark:text-slate-200 h-28 resize-none transition-colors"
            placeholder={aiPlaceholder}
          />
          <div className="flex justify-between items-start mt-2">
            <div className="text-xs min-h-[1.5em]">
              {aiFeedback && (
                <span className={`font-medium ${aiFeedback.includes('No se detectó') ? 'text-orange-500' : 'text-green-600 dark:text-green-400'}`}>
                  {aiFeedback}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-right ml-4">
              Describe el objeto, lugar y fecha (ej. 10 de febrero de 2025).
            </p>
          </div>
        </div>

        {/* Campos del Formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre del Objeto</label>
              <input 
                type="text" 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:border-ug-navy dark:focus:border-ug-accent focus:ring-1 focus:ring-ug-navy outline-none transition-colors"
                placeholder={type === 'LOST' ? "Ej. Billetera negra" : "Ej. Llaves de auto"}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Categoría</label>
              <select 
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:border-ug-navy dark:focus:border-ug-accent focus:ring-1 focus:ring-ug-navy outline-none transition-colors"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ubicación (Aprox)</label>
              <select
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white focus:border-ug-navy dark:focus:border-ug-accent focus:ring-1 focus:ring-ug-navy outline-none transition-colors"
              >
                <option value="">Seleccionar ubicación...</option>
                {MOCK_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fecha del suceso</label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:border-ug-navy dark:focus:border-ug-accent focus:ring-1 focus:ring-ug-navy outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Carga de Imagen */}
        <div>
           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fotografía (Opcional)</label>
           <div 
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
             className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 relative overflow-hidden
               ${isDragging ? 'border-ug-accent bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}
               ${imagePreview ? 'border-solid border-ug-navy dark:border-white' : ''}
             `}
           >
             {imagePreview ? (
               <div className="relative h-48 flex items-center justify-center">
                 <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-lg" />
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setImagePreview(null);
                     setImageFile(null);
                   }}
                   className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                   type="button"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
               </div>
             ) : (
               <div className="text-slate-400 dark:text-slate-500">
                  <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Sube un archivo o arrastra y suelta</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG hasta 2MB</p>
               </div>
             )}
             <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleFileSelect} />
           </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 bg-ug-navy dark:bg-ug-accent text-white rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-blue-600 transition-all shadow-lg shadow-ug-navy/20 dark:shadow-ug-accent/20"
          >
            GUARDAR REPORTE
          </button>
        </div>

      </form>
    </div>
  );
};

export default Report;