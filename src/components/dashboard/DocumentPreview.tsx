import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, MapPin, Calendar, Fingerprint, RefreshCcw } from 'lucide-react';
import type { IDemande, IProfile } from '@/types';

interface DocumentPreviewProps {
  demande: IDemande;
  profile: IProfile;
}

/**
 * Composant de prévisualisation immersive pour les documents d'identité.
 * Inclut un effet 3D Flip pour la CNI.
 */
const DocumentPreview: React.FC<DocumentPreviewProps> = ({ demande, profile }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Simulation des initiales si pas de photo
  const initiales = profile.nom_complet
    ? profile.nom_complet.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : '??';

  const isCNI = demande.type_document === 'CNI';

  if (!isCNI) {
    return (
      <div className="bg-white border border-dashboard-border rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green/10 rounded-2xl flex items-center justify-center text-green">
             <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-dark text-xl">{demande.type_document.replace('_', ' ')}</h3>
            <p className="text-xs text-text-muted uppercase tracking-widest font-black">Document Officiel Certifié</p>
          </div>
        </div>
        
        <div className="space-y-6">
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Détenteur</p>
                <p className="font-display font-black text-dark">{profile.nom_complet}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Référence</p>
                <p className="font-mono text-sm font-bold text-green">{demande.reference}</p>
              </div>
           </div>
           <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center italic text-gray-400">
              Aperçu complet du document disponible après téléchargement PDF.
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto aspect-[1.58/1]">
      <motion.div
        className="relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FACE AVANT (RECTO) */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-dashboard-sidebar rounded-admin p-6 text-white relative overflow-hidden shadow-2xl">
            {/* Design Elements */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
                <Fingerprint size={300} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                  </div>
                  <div className="leading-tight">
                    <p className="text-[7px] font-black uppercase tracking-tighter opacity-80">République de Guinée</p>
                    <p className="text-[9px] font-display font-black uppercase">Carte d'Identité</p>
                  </div>
                </div>
                <div className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-bold">RECTO</div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 bg-white/10 rounded-2xl border-2 border-white/20 flex items-center justify-center text-3xl font-black overflow-hidden shrink-0">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Photo" className="w-full h-full object-cover" />
                  ) : initiales}
                </div>
                <div className="space-y-2 min-w-0">
                  <div>
                    <p className="text-[8px] uppercase font-bold opacity-60">Nom Complet</p>
                    <p className="text-sm font-display font-black uppercase truncate">{profile.nom_complet}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[8px] uppercase font-bold opacity-60">NIN</p>
                      <p className="text-[10px] font-mono font-bold tracking-wider">{profile.nin || '--- --- ---'}</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase font-bold opacity-60">Genre</p>
                      <p className="text-[10px] font-bold">{profile.genre === 'M' ? 'MASC.' : 'FÉM.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2 border-t border-white/10 text-[8px]">
                 <div>
                    <p className="opacity-60 font-bold">DATE DE NAISSANCE</p>
                    <p className="font-bold">{profile.date_naissance || '---'}</p>
                 </div>
                 <div className="text-right">
                    <p className="opacity-60 font-bold">LIEU DE NAISSANCE</p>
                    <p className="font-bold uppercase truncate max-w-[100px]">{profile.lieu_naissance || '---'}</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-400 text-xs font-medium animate-bounce">
             <RefreshCcw size={14} /> Cliquer pour voir le verso
          </div>
        </div>

        {/* FACE ARRIÈRE (VERSO) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-dashboard-sidebar brightness-90 rounded-admin p-6 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-2 pointer-events-none">
                {[...Array(20)].map((_, i) => <ShieldCheck key={i} size={40} />)}
             </div>

             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                   <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Fingerprint size={24} />
                   </div>
                   <div className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-bold">VERSO</div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                   <div>
                      <p className="text-[8px] uppercase font-bold opacity-60">Père</p>
                      <p className="text-[10px] font-bold truncate">{profile.pere_nom_complet || '---'}</p>
                   </div>
                   <div>
                      <p className="text-[8px] uppercase font-bold opacity-60">Mère</p>
                      <p className="text-[10px] font-bold truncate">{profile.mere_nom_complet || '---'}</p>
                   </div>
                   <div className="col-span-2">
                      <p className="text-[8px] uppercase font-bold opacity-60">Adresse</p>
                      <p className="text-[10px] font-bold line-clamp-1 italic opacity-90">{profile.adresse || 'Conakry, Guinée'}</p>
                   </div>
                </div>

                <div className="mt-4 flex gap-2">
                   {/* Simuler une zone MRZ (Machine Readable Zone) */}
                   <div className="bg-black/20 p-2 rounded-lg flex-grow font-mono text-[7px] leading-tight tracking-widest opacity-80 overflow-hidden">
                      IDGINNOM{profile.nom_complet.split(' ')[0].toUpperCase()}{"<<<<<<<<<<<<<<<<<<<"}
                      <br />
                      {demande.reference.replace(/-/g, '')}{"<<<<<<"}{profile.date_naissance?.replace(/-/g, '') || '000000'}{"<<<<<<<<<<<<<<<"}
                   </div>
                </div>

                <div className="text-[6px] text-center opacity-40 font-mono mt-2">
                   CERTIFIÉ PAR NAISSANCECHAIN | TX: {demande.blockchain_tx_hash || 'NON_ANCRÉ'}
                </div>
             </div>
          </div>
          
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-400 text-xs font-medium">
             <RefreshCcw size={14} /> Cliquer pour revenir au recto
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentPreview;
