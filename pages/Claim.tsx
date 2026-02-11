import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ClaimProps {
  onNavigate: (p: string, params?: any) => void;
  objectId?: string;
}

const Claim: React.FC<ClaimProps> = ({ onNavigate, objectId }) => {
  const { user } = useAuth();
  const { addClaim, getClaimByCode, getObjectById } = useData();
  
  const [code, setCode] = useState('');
  const [validationMsg, setValidationMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [proof, setProof] = useState('');
  const [step, setStep] = useState(1);
  const [generatedCode, setGeneratedCode] = useState('');

  const selectedObject = objectId ? getObjectById(objectId) : undefined;

  const handleValidate = () => {
    setValidationMsg(null);
    const normalizedCode = code.trim().toUpperCase().replace(/\s/g, '');
    
    if (!normalizedCode.startsWith('UG-') && !normalizedCode.startsWith('UG')) {
       setValidationMsg({ type: 'error', text: 'Formato inválido. Debe ser UG-XXXXXX.' });
       return;
    }
    const cleanCode = normalizedCode.includes('-') ? normalizedCode : `UG-${normalizedCode.replace('UG', '')}`;
    const claim = getClaimByCode(cleanCode);

    if (claim) {
      let statusText = '';
      if (claim.status === 'PENDING') statusText = 'EN REVISIÓN - El objeto está marcado como "En Validación" en inventario.';
      if (claim.status === 'APPROVED') statusText = 'APROBADO - El objeto ha sido marcado como "Entregado".';
      if (claim.status === 'REJECTED') statusText = 'RECHAZADO - El objeto ha vuelto al estado disponible.';
      
      setValidationMsg({ type: 'success', text: `Estado: ${statusText}` });
    } else {
      setValidationMsg({ type: 'error', text: 'No se encontró ningún reclamo con ese código.' });
    }
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Inicia sesión primero");
      onNavigate('login');
      return;
    }
    if (!selectedObject) {
      alert("Error: No se ha seleccionado un objeto para reclamar.");
      return;
    }
    const newCode = addClaim({
      reportId: selectedObject.id,
      claimantId: user.id,
      proofDescription: proof,
    });
    setGeneratedCode(newCode);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up my-auto transition-colors duration-300">
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ug-navy dark:text-white">GESTIÓN DE RECLAMOS</h2>
            <p className="text-slate-400 text-sm mt-1">Valida estado o inicia solicitud</p>
          </div>

          {step === 1 ? (
             <div className="space-y-8">
                {/* Check Status */}
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Consultar Estado</label>
                   <div className="flex gap-2">
                     <input
                       type="text"
                       placeholder="UG-123456"
                       value={code}
                       onChange={(e) => setCode(e.target.value)}
                       className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center font-mono uppercase text-sm focus:border-ug-navy dark:focus:border-ug-accent focus:ring-1 focus:ring-ug-navy outline-none"
                     />
                     <button 
                       onClick={handleValidate}
                       className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-ug-navy dark:text-white font-bold text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm"
                     >
                       VERIFICAR
                     </button>
                   </div>
                   {validationMsg && (
                     <div className={`mt-3 text-xs font-medium p-2 rounded-md ${validationMsg.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                       {validationMsg.text}
                     </div>
                   )}
                </div>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-xs font-semibold">O NUEVO RECLAMO</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                </div>

                {/* Create Claim */}
                {selectedObject ? (
                  <form onSubmit={handleCreateClaim}>
                    <div className="mb-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Solicitando objeto:</p>
                      <div className="font-bold text-ug-navy dark:text-white bg-blue-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-blue-100 dark:border-slate-700 truncate">
                        {selectedObject.title}
                      </div>
                    </div>

                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Evidencia de Propiedad</label>
                    <textarea
                      required
                      value={proof}
                      onChange={(e) => setProof(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white mb-4 h-24 text-sm focus:border-ug-navy dark:focus:border-ug-accent focus:ring-1 focus:ring-ug-navy outline-none"
                      placeholder="Describe marcas únicas, contenido específico, contraseña de desbloqueo, etc."
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-ug-navy dark:bg-ug-accent text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-600 transition shadow-lg shadow-ug-navy/20 dark:shadow-ug-accent/20"
                    >
                      GENERAR RECLAMO
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 mb-4">Para iniciar un reclamo, primero debes localizar el objeto en el inventario.</p>
                    <button 
                      onClick={() => onNavigate('inventory')}
                      className="w-full py-3 border-2 border-dashed border-ug-accent text-ug-accent rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-slate-900 transition"
                    >
                      BUSCAR OBJETO PERDIDO
                    </button>
                  </div>
                )}
             </div>
          ) : (
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-ug-navy dark:text-white">¡Reclamo Registrado!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Guarda este código para seguimiento:</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
                <span className="text-3xl font-mono font-bold text-ug-navy dark:text-white tracking-widest selection:bg-ug-accent selection:text-white">{generatedCode}</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Preséntalo en la oficina de bienestar estudiantil.</p>
              <button onClick={() => onNavigate('inventory')} className="text-ug-accent font-bold text-sm hover:underline block w-full pt-2">
                Volver al Inventario
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700/50 px-8 py-4 text-center border-t border-slate-100 dark:border-slate-700">
           <button onClick={() => onNavigate('home')} className="text-slate-400 dark:text-slate-400 text-sm hover:text-slate-600 dark:hover:text-slate-200 font-medium">Cerrar</button>
        </div>

      </div>
    </div>
  );
};

export default Claim;