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
  FileText,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { useVerificationHistory } from '@/hooks/useVerificationHistory';
import { verifyDocument } from '@/api/verification';
import { useQueryClient } from '@tanstack/react-query';
import { DashboardCard } from '@/components/dashboard/DashboardCards';
import Skeleton from '@/components/ui/Skeleton';
import QRScannerModal from '@/components/dashboard/QRScannerModal';

const BlockchainVerify: React.FC = () => {
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: history, isLoading: historyLoading } = useVerificationHistory();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash) return;
    
    setIsVerifying(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await verifyDocument(hash);
      setResult(data);
      toast.success("Document authentifié avec succès sur la blockchain !");
      // Rafraîchir l'historique après une vérification réussie
      queryClient.invalidateQueries({ queryKey: ['verification-history'] });
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Erreur lors de la vérification.";
      setError(msg);
      toast.error(msg);
      // Même en cas d'erreur, on rafraîchit car le log est créé côté backend
      queryClient.invalidateQueries({ queryKey: ['verification-history'] });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section Standardisé */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Authentification Blockchain</h1>
          <p className="text-text-muted text-sm">Vérifiez l'intégrité de vos documents sur le registre décentralisé NaissanceChain.</p>
        </div>
      </div>

      {/* Barre de Recherche et Actions */}
      <div className="space-y-6">
        <form onSubmit={handleVerify} className="relative group w-full">
          <div className="relative flex gap-2 p-2 bg-white border border-dashboard-border rounded-admin shadow-sm hover:shadow-md transition-shadow">
             <div className="flex-grow relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  placeholder="Saisissez la référence ou le hash du document..." 
                  className="w-full pl-12 pr-4 py-4 rounded-xl outline-none font-mono text-sm bg-transparent font-bold"
                />
             </div>
             <button 
               type="submit"
               disabled={isVerifying}
               className="bg-dashboard-sidebar hover:bg-dark text-white px-8 rounded-xl font-display font-black transition-all flex items-center gap-2 disabled:opacity-50"
             >
                {isVerifying ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <ShieldCheck size={20} />
                    <span>VÉRIFIER</span>
                  </>
                )}
             </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
           <button 
            onClick={() => setIsScannerOpen(true)}
            className="flex items-center justify-center gap-3 p-5 bg-white border border-dashboard-border rounded-admin hover:border-dashboard-sidebar transition-all group shadow-sm"
           >
             <div className="p-3 bg-green-light text-green rounded-xl group-hover:scale-110 transition-transform">
                <QrCode size={24} />
             </div>
             <div className="text-left">
                <p className="text-sm font-black text-dark uppercase tracking-tight">Scanner QR Code</p>
                <p className="text-[10px] text-text-muted font-bold">Vérification instantanée par caméra</p>
             </div>
           </button>

           <label className="flex items-center justify-center gap-3 p-5 bg-white border border-dashboard-border rounded-admin hover:border-dashboard-sidebar transition-all group shadow-sm cursor-pointer">
             <input type="file" className="hidden" accept=".pdf" />
             <div className="p-3 bg-dashboard-bg text-dashboard-sidebar rounded-xl group-hover:scale-110 transition-transform">
                <Upload size={24} />
             </div>
             <div className="text-left">
                <p className="text-sm font-black text-dark uppercase tracking-tight">Téléverser un PDF</p>
                <p className="text-[10px] text-text-muted font-bold">Analyse de l'empreinte numérique</p>
             </div>
           </label>
        </div>
      </div>

        {/* Modal de Scan */}
        <QRScannerModal 
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={(decodedText) => {
            setHash(decodedText);
            // On déclenche manuellement la vérification
            setTimeout(() => {
              const form = document.querySelector('form');
              form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }, 100);
          }}
        />

        {/* Results Section */}
        <AnimatePresence>
          {(result || error) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full mx-auto pt-4"
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
        <div>
          <DashboardCard className="!p-0 overflow-hidden">
            {/* Header Aligné sur MyDocuments */}
            <div className="px-8 py-5 border-b border-dashboard-border flex items-center justify-between">
              <h2 className="text-lg font-display font-black text-dark uppercase tracking-tight">
                Liste des vérifications récentes
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temps Réel</span>
              </div>
            </div>

            {/* Table Header - Aligned with MyDocuments */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-dashboard-border">
              <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Référence</div>
              <div className="col-span-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type de Document</div>
              <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</div>
              <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Statut</div>
              <div className="col-span-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Blockchain</div>
              <div className="col-span-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actes</div>
            </div>

            <div className="divide-y divide-gray-50">
              {historyLoading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2"><Skeleton className="h-4 w-20" /></div>
                      <div className="col-span-3 flex items-center gap-3">
                        <Skeleton variant="circle" className="w-8 h-8" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="col-span-2"><Skeleton className="h-4 w-24" /></div>
                      <div className="col-span-2"><Skeleton className="h-6 w-20 rounded-full" /></div>
                      <div className="col-span-2"><Skeleton className="h-4 w-28" /></div>
                      <div className="col-span-1 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></div>
                    </div>
                  ))}
                </div>
              ) : history && history.length > 0 ? (
                history.map((verif) => (
                  <div key={verif.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 items-center group cursor-pointer hover:bg-dashboard-bg transition-all">
                    {/* Référence */}
                    <div className="col-span-12 lg:col-span-2 overflow-hidden">
                      <span className="text-[11px] font-mono font-medium text-green-700 bg-green-50 px-2 py-1 rounded block truncate max-w-[140px]" title={verif.document_reference}>
                        {verif.document_reference}
                      </span>
                    </div>

                    {/* Type de Document */}
                    <div className="col-span-12 lg:col-span-3 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${verif.resultat ? 'bg-green/5 text-green' : 'bg-red-50 text-red-400'}`}>
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-dark truncate">
                        {verif.document_details?.type_document.replace('_', ' ') || 'Inconnu'}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-6 lg:col-span-2 text-sm text-text-muted font-body">
                      {new Date(verif.verified_at).toLocaleDateString('fr-FR')}
                    </div>
                    
                    {/* Statut */}
                    <div className="col-span-6 lg:col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        verif.resultat 
                          ? 'bg-green-light text-green border-green/20' 
                          : 'bg-red-light text-red border-red/20'
                      }`}>
                        {verif.resultat ? 'Authentique' : 'Inconnu'}
                      </span>
                    </div>

                    {/* Blockchain */}
                    <div className="col-span-6 lg:col-span-2">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                        <span className="truncate w-20">Audit ID: {verif.id}</span>
                        <div className={`w-2 h-2 rounded-full ${verif.resultat ? 'bg-green animate-pulse' : 'bg-red-400'}`}></div>
                      </div>
                    </div>

                    {/* Actes */}
                    <div className="col-span-6 lg:col-span-1 flex justify-end">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-green">
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                      <History size={32} />
                   </div>
                   <p className="text-text-muted italic text-sm">Aucune vérification enregistrée.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-50 flex justify-center">
              <button className="text-[10px] font-black text-green hover:underline uppercase tracking-widest">
                Voir tout l'historique
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* Footer Area Section */}
        <footer className="w-full py-8 text-center space-y-4 bg-gray-50/50 border-t border-gray-100 mt-12 rounded-admin">
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
