import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CreditCard, BookOpen, ArrowRight, ShieldCheck, 
  Upload, Info, Loader2, CheckCircle, X, Download, Server, Cpu, Fingerprint, Grid,
  Copy, Check
} from 'lucide-react';
import { createDemande, getDemandeStatus } from '@/api/documents';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardCard } from './DashboardCards';
import type { IDemande } from '@/types';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onStatusChange?: (status: string) => void;
  initialType?: string | null;
}

const documentTypes = [
  { id: 'EXTRAIT_NAIS', name: 'Extrait de Naissance', icon: <FileText className="text-blue-500" />, desc: 'Copie intégrale ou extrait d\'acte de naissance informatisé.' },
  { id: 'CNI', name: 'Carte d\'Identité (CNI)', icon: <CreditCard className="text-green" />, desc: 'Nouvelle carte d\'identité biométrique sécurisée.' },
  { id: 'PASSEPORT', name: 'Passeport Ordinaire', icon: <BookOpen className="text-red-500" />, desc: 'Document de voyage électronique valide 5 ou 10 ans.' },
];

const steps_generation = [
  { id: 'RECUE', label: 'Enregistrement de la demande', icon: <Server size={18} /> },
  { id: 'VERIFICATION', label: 'Validation NaissanceChain', icon: <Fingerprint size={18} /> },
  { id: 'SIGNATURE', label: 'Signature cryptographique', icon: <Cpu size={18} /> },
  { id: 'PRET', label: 'Document disponible', icon: <Download size={18} /> },
];

const NewRequestModal: React.FC<NewRequestModalProps> = ({ 
  isOpen, onClose, onMinimize, onStatusChange, initialType = null 
}) => {
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingDemande, setTrackingDemande] = useState<IDemande | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const pollingRef = useRef<any>(null);

  // Synchroniser si le type change depuis l'extérieur
  useEffect(() => {
    // On ne change le step que si on n'est pas déjà en train de suivre une demande
    if (initialType && step < 3) {
      setSelectedType(initialType);
      setStep(2);
    }
  }, [initialType]);

  // Nettoyage du polling à la fermeture
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast.success("Hash copié dans le presse-papier");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startPolling = (reference: string) => {
    pollingRef.current = setInterval(async () => {
      try {
        const data = await getDemandeStatus(reference);
        setTrackingDemande(data);
        if (onStatusChange) onStatusChange(data.statut);
        
        if (data.statut === 'PRET' || data.statut === 'REJETE') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          queryClient.invalidateQueries({ queryKey: ['demandes'] });
        }
      } catch (err) {
        console.error("Erreur polling:", err);
      }
    }, 2500);
  };

  const handleSubmit = async () => {
    if (!selectedType) return;
    setIsSubmitting(true);

    try {
      const data = await createDemande(selectedType, files);
      
      if (!data.reference) {
        throw new Error("Le serveur n'a pas renvoyé de référence de suivi.");
      }

      setTrackingDemande(data);
      if (onStatusChange) onStatusChange(data.statut);
      setStep(3); // Passer à l'écran de suivi
      setIsSubmitting(false);
      startPolling(data.reference);
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || "Erreur lors de la soumission.";
      toast.error(message);
      setIsSubmitting(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const idx = steps_generation.findIndex(s => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 3 ? onClose : undefined}
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
          />
          
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white border border-dashboard-border w-full max-w-2xl rounded-admin shadow-sm overflow-hidden max-h-[90vh] flex flex-col"
          >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="font-display font-black text-dark text-xl">
              {step === 3 ? "Génération en cours" : "Nouvelle Demande"}
            </h2>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">
              {step === 3 ? trackingDemande?.reference : "Traitement Zéro Intervention"}
            </p>
          </div>
          <button 
            onClick={step === 3 && trackingDemande?.statut !== 'PRET' ? onMinimize : onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                  {documentTypes.map((type) => (
                    <div key={type.id} onClick={() => setSelectedType(type.id)} className="cursor-pointer group">
                      <DashboardCard 
                        className={`h-full transition-all duration-300 ${
                          selectedType === type.id 
                            ? 'ring-2 ring-green border-green shadow-lg shadow-green/5' 
                            : 'hover:border-green/20'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-green/5 transition-colors">
                          {type.icon}
                        </div>
                        <h4 className={`font-display font-bold text-sm mb-1 transition-colors ${selectedType === type.id ? 'text-green' : 'text-dark'}`}>{type.name}</h4>
                        <p className="text-[9px] text-text-muted leading-relaxed">{type.desc}</p>
                      </DashboardCard>
                    </div>
                  ))}
              </motion.div>
            ) : step === 2 ? (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button onClick={() => setStep(1)} className="text-green font-bold text-xs flex items-center gap-2 hover:underline">
                  <ArrowRight size={14} className="rotate-180" /> Retour au choix
                </button>

                {/* Recap Identité */}
                <DashboardCard className="bg-gray-100/50 p-4 border border-gray-200">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Citoyen</p>
                          <p className="text-sm font-black text-dark">{profile?.nom_complet}</p>
                      </div>
                      <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">NIN</p>
                          <p className="text-sm font-mono font-bold text-green">{profile?.nin || '---'}</p>
                      </div>
                   </div>
                </DashboardCard>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-800 text-[11px] leading-relaxed">
                    <Info size={18} className="shrink-0" />
                    <p>Vos données sont extraites directement de la blockchain <strong>NaissanceChain</strong>. Aucune saisie manuelle n'est requise.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pièces justificatives (Optionnel)</label>
                    <label className="border-2 border-dashed border-gray-200 rounded-admin p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green/50 transition-colors group bg-gray-100/30">
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                      <Upload className="text-gray-300 group-hover:text-green mb-2" size={24} />
                      <span className="text-xs font-bold text-gray-500">Ajouter des fichiers</span>
                    </label>

                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {files.map((file, i) => (
                          <div key={i} className="bg-gray-100 pl-3 pr-1 py-1 rounded-lg flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-600 truncate max-w-[100px]">{file.name}</span>
                            <button onClick={() => removeFile(i)} className="p-1 hover:bg-gray-200 rounded-md"><X size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 py-4"
              >
                {/* Visual Pipeline */}
                <div className="space-y-6">
                  {steps_generation.map((s, idx) => {
                    const statusIndex = getStatusIndex(trackingDemande?.statut || 'RECUE');
                    const isCompleted = idx < statusIndex || trackingDemande?.statut === 'PRET';
                    const isCurrent = idx === statusIndex && trackingDemande?.statut !== 'PRET';
                    const isPending = idx > statusIndex;

                    return (
                      <div key={s.id} className="flex items-center gap-6 relative">
                        {idx < steps_generation.length - 1 && (
                          <div className={`absolute left-5 top-10 w-0.5 h-6 ${isCompleted ? 'bg-green' : 'bg-gray-100'}`} />
                        )}
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isCompleted ? 'bg-green text-white' : 
                          isCurrent ? 'bg-green/10 text-green ring-4 ring-green/5' : 
                          'bg-gray-50 text-gray-300'
                        }`}>
                          {isCompleted ? <CheckCircle size={20} /> : isCurrent ? <Loader2 size={20} className="animate-spin" /> : s.icon}
                        </div>
                        
                        <div className="flex-grow">
                          <p className={`text-sm font-medium ${isPending ? 'text-gray-300' : 'text-gray-700'}`}>{s.label}</p>
                          {isCurrent && (
                            <motion.p 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              className="text-[10px] text-green font-medium"
                            >
                              Action système en cours...
                            </motion.p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {trackingDemande?.statut === 'PRET' && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="pt-6"
                  >
                    <div className="bg-green/5 border border-green/10 rounded-2xl p-6 text-center space-y-4">
                      <div className="w-16 h-16 bg-green text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green/20">
                        <CheckCircle size={32} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-black text-dark text-lg">Document Certifié !</h4>
                        <p className="text-xs text-text-muted">Votre document a été ancré sur NaissanceChain.</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between text-left group/hash">
                        <div className="overflow-hidden">
                           <p className="text-[9px] font-black text-gray-400 uppercase">Hash Transaction</p>
                           <p className="text-[10px] font-mono text-green truncate">{trackingDemande.blockchain_tx_hash}</p>
                        </div>
                        <button 
                          onClick={() => handleCopyHash(trackingDemande.blockchain_tx_hash || '')}
                          className={`p-2 rounded-lg transition-all ${
                            copiedHash ? 'bg-green/10 text-green' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-dark'
                          }`}
                        >
                          {copiedHash ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>

                      <a 
                        href={trackingDemande.document_genere?.startsWith('http') 
                          ? trackingDemande.document_genere 
                          : `${import.meta.env.VITE_API_URL || ''}${trackingDemande.document_genere}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green text-white font-display font-black py-4 rounded-xl shadow-lg shadow-green/10 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                      >
                        <Download size={20} /> TÉLÉCHARGER LE PDF
                      </a>
                      
                      <button 
                        onClick={() => {
                          onClose();
                          setStep(1);
                          setTrackingDemande(null);
                          if (onStatusChange) onStatusChange('');
                        }} 
                        className="text-xs font-bold text-gray-400 hover:text-dark transition-colors"
                      >
                        Fermer la fenêtre
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && trackingDemande?.statut !== 'PRET' && (
                  <div className="pt-4 text-center">
                    <button 
                      onClick={onMinimize}
                      className="text-[10px] font-black text-green uppercase tracking-widest hover:underline flex items-center gap-2 mx-auto"
                    >
                      <Grid size={14} /> Continuer en arrière-plan
                    </button>
                  </div>
                )}

                {trackingDemande?.statut === 'REJETE' && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-4">
                    <X className="text-red-500 mx-auto" size={48} />
                    <h4 className="font-display font-bold text-dark">Demande Rejetée</h4>
                    <p className="text-xs text-red-600">{trackingDemande.motif_rejet || "Une erreur est survenue lors du traitement."}</p>
                    <button onClick={() => { setStep(1); onClose(); }} className="text-xs font-bold text-gray-500 underline">Fermer</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions (Stable & Responsive) */}
        {step !== 3 && (
          <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 1 ? 'bg-green' : 'bg-gray-200'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-green' : 'bg-gray-200'}`} />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button 
                key="footer-cancel-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-dark transition-colors order-2 sm:order-1"
              >
                Annuler
              </button>
              
              <button 
                key={`footer-submit-btn-step-${step}`}
                disabled={step === 1 ? !selectedType : (isSubmitting || !profile?.profil_complet)}
                onClick={step === 1 ? () => setStep(2) : handleSubmit}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-black shadow-xl transition-all flex items-center justify-center gap-2 order-1 sm:order-2 ${
                  step === 1 
                    ? 'bg-dark text-white shadow-dark/10' 
                    : 'bg-green text-white shadow-green/20'
                } disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]`}
              >
                {step === 1 ? (
                  <>CONTINUER <ArrowRight size={14} /></>
                ) : isSubmitting ? (
                  <><Loader2 className="animate-spin" size={16} /> TRAITEMENT...</>
                ) : (
                  "CONFIRMER LA DEMANDE"
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
    )}
  </AnimatePresence>
  );
};

export default NewRequestModal;
