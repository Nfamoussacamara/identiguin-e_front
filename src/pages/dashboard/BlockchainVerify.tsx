import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  Fingerprint, 
  CheckCircle2, 
  Loader2, 
  History,
  ArrowRight,
  ExternalLink,
  Info,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import client from '@/api/client';
import { DashboardCard } from '@/components/dashboard/DashboardCards';

const BlockchainVerify: React.FC = () => {
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock data for recent verifications - could be replaced by a real API call
  const recentVerifications = [
    { id: 1, type: 'Certificat de Naissance', ref: 'CN-2026-X89', date: 'Il y a 2 min', status: 'Authentique' },
    { id: 2, type: 'Carte d\'Identité', ref: 'CI-2025-A12', date: 'Il y a 15 min', status: 'Authentique' },
    { id: 3, type: 'Passeport Biométrique', ref: 'PB-2024-B45', date: 'Il y a 1 heure', status: 'Authentique' },
  ];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash) return;
    
    setIsVerifying(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await client.get(`/verification/rechercher/?q=${hash}`);
      setResult(response.data);
      toast.success("Document authentifié avec succès sur la blockchain !");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Erreur lors de la vérification.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow max-w-4xl mx-auto w-full space-y-12 py-12 px-4">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-green/5 rounded-3xl flex items-center justify-center text-green mx-auto shadow-sm border border-green/10"
          >
            <Fingerprint size={40} />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-black text-dark uppercase tracking-tight">
              Authentificateur Blockchain
            </h1>
            <p className="text-text-muted font-body max-w-lg mx-auto text-sm md:text-base">
              Saisissez la référence ou le hash d'un document pour vérifier son intégrité sur le réseau <strong className="text-green">NaissanceChain</strong>.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="space-y-6">
          <form onSubmit={handleVerify} className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-green/20 to-transparent rounded-[26px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex gap-2 p-2 bg-white border border-dashboard-border rounded-admin shadow-xl">
               <div className="flex-grow relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input 
                    type="text" 
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                    placeholder="Ex : 0x71C7656EC7ab88b098defB751B7401B5f6d8976F ..." 
                    className="w-full pl-12 pr-4 py-4 rounded-xl outline-none font-mono text-xs md:text-sm bg-transparent"
                  />
               </div>
               <button 
                 type="submit"
                 disabled={isVerifying}
                 className="bg-dashboard-sidebar hover:bg-green-700 text-white px-6 md:px-10 rounded-xl font-display font-black transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-green/20"
               >
                  {isVerifying ? <Loader2 className="animate-spin" size={20} /> : 'VÉRIFIER'}
               </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
             <button className="flex items-center justify-center gap-3 p-5 bg-white border border-dashboard-border rounded-admin hover:border-dashboard-sidebar transition-all group shadow-sm">
                <QrCode size={20} className="text-gray-400 group-hover:text-dashboard-sidebar transition-colors" />
                <span className="font-display font-bold text-dark text-sm">Scanner un code QR</span>
             </button>
             <button className="flex items-center justify-center gap-3 p-5 bg-white border border-dashboard-border rounded-admin hover:border-dashboard-sidebar transition-all group shadow-sm">
                <ShieldCheck size={20} className="text-gray-400 group-hover:text-dashboard-sidebar transition-colors" />
                <span className="font-display font-bold text-dark text-sm">Téléverser un PDF</span>
             </button>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {(result || error) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto w-full pt-4"
            >
              {result ? (
                <DashboardCard title="Résultat de l'Authentification">
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center text-green">
                      <CheckCircle2 size={40} className="animate-pulse" />
                    </div>
                    <div className="space-y-4 w-full">
                      <div className="text-center">
                        <h3 className="text-xl font-display font-black uppercase italic text-green">Document Authentique</h3>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Ancrage Blockchain Validé</p>
                      </div>

                      <div className="bg-dashboard-bg p-5 rounded-2xl space-y-3 text-left border border-dashboard-border">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Type de document</span>
                            <span className="text-sm font-bold text-dark">{result.type_document.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Référence</span>
                            <span className="text-sm font-mono font-bold text-dark">{result.reference}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Délivré le</span>
                            <span className="text-sm font-bold text-dark">{new Date(result.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => window.open(`https://naissancchain.gn/verify/${result.blockchain_tx_hash}`, '_blank')}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-dashboard-border rounded-xl text-xs font-bold text-dark hover:bg-gray-50 transition-all"
                      >
                        <ExternalLink size={14} className="text-green" />
                        Explorer sur le Registre Public
                      </button>
                    </div>
                  </div>
                </DashboardCard>
              ) : (
                <div className="bg-red-50 border border-red-100 p-6 rounded-admin text-center space-y-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
                    <Info size={24} />
                  </div>
                  <h3 className="text-lg font-display font-black text-red-700 uppercase">Vérification Échouée</h3>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Verifications Card */}
        <div className="pt-8">
          <DashboardCard 
            title="Vérifications Récentes" 
          >
            <div className="divide-y divide-gray-50">
              {recentVerifications.map((verif) => (
                <div key={verif.id} className="py-4 flex items-center justify-between group cursor-pointer hover:px-2 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green/10 group-hover:text-green transition-colors">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dark">{verif.type}</p>
                      <p className="text-[10px] font-mono text-text-muted">{verif.ref}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-green uppercase bg-green-50 px-2 py-0.5 rounded-full">{verif.status}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{verif.date}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-green group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-[11px] font-black uppercase text-text-muted hover:text-green transition-colors tracking-widest border-t border-gray-50 pt-4">
              Voir tout l'historique
            </button>
          </DashboardCard>
        </div>
      </div>

      {/* Footer Area Section */}
      <footer className="w-full py-8 text-center space-y-4 bg-gray-50/50 border-t border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          © 2026 IdentiGuinée - Portail de l'Innovation
        </p>
        <div className="flex items-center justify-center gap-6">
          <button className="text-[10px] font-black text-gray-400 hover:text-green uppercase transition-colors tracking-widest">Confidentialité</button>
          <button className="text-[10px] font-black text-gray-400 hover:text-green uppercase transition-colors tracking-widest">Aide</button>
        </div>
      </footer>
    </div>
  );
};

export default BlockchainVerify;
