import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  CheckCircle2,
  AlertCircle,
  Share2,
  HelpCircle,
  QrCode,
  Lock,
  Fingerprint
} from 'lucide-react';
import { getDemandeStatus } from '@/api/documents';
import type { IDemande } from '@/types';
import Skeleton from '../../components/ui/Skeleton';
import IdentityCard3D from '../../components/dashboard/IdentityCard3D';
import { DashboardCard } from '../../components/dashboard/DashboardCards';

const DocumentDetails: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [demande, setDemande] = useState<IDemande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!reference) return;
      try {
        setLoading(true);
        const data = await getDemandeStatus(reference);
        setDemande(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les détails de ce document.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [reference]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="w-full h-32 rounded-admin" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-[1.58/1] rounded-admin" />
              <Skeleton className="w-full h-40 rounded-admin" />
           </div>
           <div className="space-y-6">
              <Skeleton className="w-full h-64 rounded-admin" />
              <Skeleton className="w-full h-48 rounded-admin" />
           </div>
        </div>
      </div>
    );
  }

  if (error || !demande) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-display font-bold text-dark mb-2">Oups !</h2>
        <p className="text-text-muted mb-8">{error || "Document introuvable."}</p>
        <button 
          onClick={() => navigate('/dashboard/documents')}
          className="px-8 py-4 bg-green text-white rounded-xl font-bold shadow-lg shadow-green/20"
        >
          Retourner à mes documents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header / Retour */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/dashboard/documents')}
          className="w-10 h-10 rounded-xl bg-white border border-dashboard-border flex items-center justify-center text-dark hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-display font-bold text-dark">Détails du document certifié</h1>
      </div>

      {/* Bannière de Succès (Style Dashboard) */}
      <DashboardCard className="!bg-dashboard-sidebar border-none text-white overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
             <CheckCircle2 size={28} />
          </div>
          <div>
            <h2 className="text-xl font-display font-black">Votre document est prêt!</h2>
            <p className="text-white/80 text-sm font-medium">
              Généré automatiquement le {new Date(demande.updated_at || '').toLocaleDateString('fr-FR')} via NaissanceChain.
            </p>
          </div>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne GAUCHE - Aperçu & Certification */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Aperçu 3D aligné à gauche (Sans conteneur) */}
          <div className="flex items-center justify-start py-4">
             {demande.image_preview ? (
               <div className="w-full max-w-[550px]">
                 <p className="flex items-center gap-2 text-xs font-bold text-dark mb-3">
                   <span className="w-2 h-2 rounded-full bg-green inline-block"></span>
                   Aperçu numérique certifié
                 </p>
                 <IdentityCard3D 
                   recto={demande.image_preview} 
                   verso={demande.image_preview_verso} 
                   type={demande.type_document} 
                 />
               </div>
             ) : (
               <div className="text-center py-20 bg-white/50 rounded-admin border border-dashed border-gray-300 w-full">
                  <Fingerprint size={48} className="mx-auto text-gray-200" />
                  <p className="text-text-muted italic text-sm mt-4">Génération de l'aperçu en cours...</p>
               </div>
             )}
          </div>

          {/* Informations de Certification */}
          <DashboardCard title="Informations de Certification">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Autorité Émettrice</p>
                   <p className="text-sm font-bold text-dark">Gouvernement de la République de Guinée</p>
                </div>
                
                <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Date d'émission</p>
                   <p className="text-sm font-bold text-dark">{new Date(demande.updated_at || '').toLocaleDateString('fr-FR')}</p>
                </div>

                <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Statut Blockchain</p>
                   <div className="text-green text-sm font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Ancrage Validé & Immuable
                   </div>
                </div>

                <div className="space-y-1">
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Référence Unique</p>
                   <p className="text-sm font-mono font-bold text-dashboard-sidebar">{demande.reference}</p>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-dashboard-border flex justify-between items-center">
                <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                   Hash: {demande.blockchain_tx_hash?.substring(0, 32)}...
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-green uppercase tracking-widest bg-green/5 px-3 py-1 rounded-full border border-green/10">
                   <ShieldCheck size={12} />
                   Sécurisé par Blockchain
                </div>
             </div>
          </DashboardCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Bloc Sécurité */}
             <div className="p-6 bg-green-50/50 border border-green/10 rounded-admin flex gap-4 shadow-sm items-center">
                <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center text-green shrink-0">
                   <Lock size={20} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-dark uppercase tracking-widest mb-1">Sécurisé</h4>
                   <p className="text-xs leading-relaxed text-gray-500 font-medium">
                      Ce titre est protégé par cryptographie asymétrique sur NaissanceChain.
                   </p>
                </div>
             </div>

             {/* Carte Jaune - Vérification */}
             <button 
               onClick={() => navigate('/dashboard/verification')}
               className="w-full bg-[#FCD116] rounded-admin p-6 text-dark text-left relative overflow-hidden shadow-sm hover:brightness-95 transition-all group flex items-center gap-4"
             >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                   <QrCode size={24} />
                </div>
                
                <div>
                   <h3 className="text-base font-display font-black leading-tight">Tester la vérification</h3>
                   <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Vérifier maintenant →</p>
                </div>
             </button>
          </div>
        </div>

        {/* Colonne DROITE - Actions & Support (Sticky) */}
        <div className="lg:col-span-1 mt-8 h-full">
           <div className="space-y-6 sticky top-8 z-20">
              {/* Bloc Actions */}
              <DashboardCard title="Actions disponibles">
             <div className="space-y-3">
                {demande.document_genere && (
                   <a 
                     href={demande.document_genere}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full h-12 bg-green text-white rounded-xl font-bold flex items-center justify-between px-5 hover:opacity-90 transition-all shadow-sm"
                   >
                     <span>Télécharger PDF</span>
                     <Download size={18} />
                   </a>
                )}

                <button className="w-full h-12 bg-white border border-dashboard-border text-dark rounded-xl font-bold flex items-center justify-between px-5 hover:bg-gray-50 transition-all">
                   <span>Partager</span>
                   <Share2 size={18} className="text-gray-400" />
                </button>
             </div>

             <div className="mt-8 pt-6 border-t border-dashboard-border space-y-4">
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Aide & Support</p>
                
                <button className="flex items-center gap-3 text-sm font-semibold text-gray-500 hover:text-green transition-colors w-full text-left">
                   <HelpCircle size={16} />
                   Comment vérifier ce document ?
                </button>

                <button className="flex items-center gap-3 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors w-full text-left">
                   <AlertCircle size={16} />
                   Signaler une erreur
                </button>
             </div>
          </DashboardCard>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
