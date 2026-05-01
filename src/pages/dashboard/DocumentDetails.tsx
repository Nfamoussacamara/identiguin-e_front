import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  Fingerprint, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getDemandeStatus } from '@/api/documents';
import type { IDemande } from '@/types';
import Skeleton from '../../components/ui/Skeleton';
import IdentityCard3D from '../../components/dashboard/IdentityCard3D';

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
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-48 h-8 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-[1.58/1] rounded-[2.5rem]" />
           </div>
           <div className="space-y-6">
              <Skeleton className="w-full h-64 rounded-3xl" />
              <Skeleton className="w-full h-20 rounded-2xl" />
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
          className="px-8 py-4 bg-green text-white rounded-2xl font-bold shadow-lg shadow-green/20 hover:scale-105 transition-transform"
        >
          Retourner à mes documents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header avec bouton retour */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/documents')}
            className="w-12 h-12 rounded-2xl bg-white border border-dashboard-border flex items-center justify-center text-dark hover:bg-gray-50 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-dark tracking-tight">Détails du document</h1>
            <p className="text-text-muted flex items-center gap-2">
              <span className="font-mono text-green font-bold">{demande.reference}</span>
              <span>•</span>
              <span className="capitalize">{demande.type_document.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        {demande.est_pret && demande.document_genere && (
          <a 
            href={demande.document_genere}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-8 py-4 bg-green text-white rounded-[1.5rem] font-bold shadow-xl shadow-green/20 hover:scale-105 transition-all active:scale-95"
          >
            <Download size={20} />
            Télécharger le PDF Officiel
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Zone de prévisualisation 3D */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-dashboard-border rounded-[3rem] p-4 md:p-12 shadow-sm flex flex-col items-center justify-center min-h-[500px]">
             {demande.image_preview ? (
               <IdentityCard3D 
                 recto={demande.image_preview} 
                 verso={demande.image_preview_verso} 
                 type={demande.type_document} 
               />
             ) : (
               <div className="text-center space-y-6 max-w-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                     <Fingerprint size={40} />
                  </div>
                  <p className="text-text-muted italic">
                    L'aperçu 3D est en cours de génération pour ce document. Le PDF reste disponible pour téléchargement.
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* Panneau d'informations & Certification */}
        <div className="space-y-6">
          {/* Bloc Blockchain */}
          <div className="bg-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-green/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-green/20 rounded-xl flex items-center justify-center text-green">
                      <ShieldCheck size={20} />
                   </div>
                   <h3 className="font-display font-bold text-lg">Certification Blockchain</h3>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Status du registre</p>
                      <div className="flex items-center gap-2 text-green text-sm font-bold">
                         <CheckCircle2 size={16} />
                         Ancrage NaissanceChain Validé
                      </div>
                   </div>

                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 overflow-hidden">
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Transaction Hash</p>
                      <p className="text-xs font-mono text-white/60 break-all leading-relaxed">
                        {demande.blockchain_tx_hash || 'En attente...'}
                      </p>
                   </div>
                </div>

                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-white/10">
                   Vérifier sur l'explorateur
                   <ExternalLink size={14} />
                </button>
             </div>
          </div>

          {/* Bloc Dates & Infos */}
          <div className="bg-white border border-dashboard-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-green" size={20} />
                <h3 className="font-display font-bold text-dark">Informations Clés</h3>
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                   <span className="text-sm text-text-muted">Date d'émission</span>
                   <span className="text-sm font-bold text-dark">{new Date(demande.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-50">
                   <span className="text-sm text-text-muted">Type de document</span>
                   <span className="text-sm font-bold text-dark uppercase">{demande.type_document}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                   <span className="text-sm text-text-muted">Réseau</span>
                   <span className="text-sm font-bold text-green">Amoy (Polygon)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
