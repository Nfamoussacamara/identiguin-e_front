import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, MapPin, ShieldCheck, Download, Edit2, Fingerprint, Users, Landmark } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { DashboardCard } from '@/components/dashboard/DashboardCards';
import ProfileEditModal from '@/components/dashboard/ProfileEditModal';
import Skeleton from '../../components/ui/Skeleton';

const Profile: React.FC = () => {
  const { profile, initiales, isLoading } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-44 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-72 rounded-admin" />
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-admin" />
            <Skeleton className="h-36 rounded-admin" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-admin" />
          <Skeleton className="h-64 rounded-admin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section Standardisé */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Profil Citoyen</h1>
          <p className="text-text-muted text-sm font-body">Identité biométrique et informations officielles certifiées.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-dashboard-border rounded-xl font-display font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
        >
          <Edit2 size={14} className="text-green" /> Modifier mes infos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Digital ID Card - Premium Re-imagined */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-dashboard-sidebar rounded-admin p-8 text-white relative overflow-hidden shadow-2xl shadow-dashboard-sidebar/20 group"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Landmark size={200} />
          </div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-8 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                     <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">République de Guinée</p>
                    <p className="text-sm font-display font-black uppercase tracking-tight">Carte d'Identité Numérique</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                  <ShieldCheck size={12} className="text-green" /> Ancré Blockchain
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center py-4">
               <div className="w-32 h-32 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/20 p-1 flex items-center justify-center text-4xl font-black overflow-hidden shadow-2xl">
                  {profile?.photo ? (
                    <img src={profile.photo} alt={profile.nom_complet} className="w-full h-full object-cover rounded-[2.3rem]" />
                  ) : (
                    <span className="opacity-40">{initiales}</span>
                  )}
               </div>
               <div className="space-y-5 text-center md:text-left flex-grow">
                  <div>
                    <p className="text-[10px] uppercase font-black text-white/50 tracking-widest mb-1">Titulaire</p>
                    <p className="text-3xl font-display font-black uppercase tracking-tight leading-none">{profile?.nom_complet}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-8">
                    <div>
                      <p className="text-[10px] uppercase font-black text-white/50 tracking-widest mb-1">NIN (Identification)</p>
                      <p className="font-mono font-bold text-sm tracking-[0.1em]">{profile?.nin || '--- --- --- ---'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-white/50 tracking-widest mb-1">Statut Fiscal</p>
                      <p className="font-display font-black text-sm uppercase text-green">À Jour</p>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
               <div className="font-mono text-[9px] text-white/40 uppercase tracking-tight flex items-center gap-3">
                  <span>ID: {String(profile?.id).substring(0, 8)}...</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span>V2-SECURE</span>
               </div>
               <button className="bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white hover:text-dashboard-sidebar transition-all shadow-xl border border-white/10">
                  <Download size={20} />
               </button>
            </div>
          </div>
        </motion.div>

        {/* Biometric Recap */}
        <div className="space-y-6">
           <DashboardCard title="Biométrie & Profession">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-dashboard-bg rounded-2xl border border-dashboard-border group hover:bg-white hover:shadow-md transition-all">
                   <div className="flex items-center gap-2 mb-2 text-gray-400 group-hover:text-green transition-colors">
                      <Fingerprint size={14} />
                      <span className="text-[9px] uppercase font-black tracking-widest">Taille</span>
                   </div>
                   <p className="text-base font-black text-dark">{profile?.taille ? `${profile.taille} m` : '---'}</p>
                </div>
                <div className="p-4 bg-dashboard-bg rounded-2xl border border-dashboard-border group hover:bg-white hover:shadow-md transition-all">
                   <div className="flex items-center gap-2 mb-2 text-gray-400 group-hover:text-green transition-colors">
                      <User size={14} />
                      <span className="text-[9px] uppercase font-black tracking-widest">Genre</span>
                   </div>
                   <p className="text-base font-black text-dark">{profile?.genre === 'M' ? 'Masculin' : profile?.genre === 'F' ? 'Féminin' : '---'}</p>
                </div>
                <div className="p-4 bg-dashboard-bg rounded-2xl border border-dashboard-border col-span-2 group hover:bg-white hover:shadow-md transition-all">
                   <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1">Secteur d'Activité</p>
                   <p className="text-base font-black text-dark uppercase">{profile?.profession || 'Non spécifié'}</p>
                </div>
              </div>
           </DashboardCard>

           <DashboardCard title="Filiation Directe">
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <Users size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Père</p>
                      <p className="text-sm font-bold text-dark uppercase">{profile?.pere_nom_complet || '---'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
                      <Users size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest">Mère</p>
                      <p className="text-sm font-bold text-dark uppercase">{profile?.mere_nom_complet || '---'}</p>
                   </div>
                </div>
              </div>
           </DashboardCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DashboardCard title="Résidence & Coordonnées">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Région</p>
                  <p className="text-sm font-bold text-dark uppercase">{profile?.region || '---'}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Préfecture</p>
                  <p className="text-sm font-bold text-dark uppercase">{profile?.prefecture || '---'}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Commune</p>
                  <p className="text-sm font-bold text-dark uppercase">{profile?.commune || '---'}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Quartier</p>
                  <p className="text-sm font-bold text-dark uppercase">{profile?.quartier || '---'}</p>
               </div>
               <div className="col-span-2 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-1 flex items-center gap-2">
                    <MapPin size={10} /> Adresse de Résidence
                  </p>
                  <p className="text-sm font-bold text-dark">{profile?.adresse || 'Non renseignée'}</p>
               </div>
            </div>
         </DashboardCard>

         <DashboardCard title="État Civil & Enregistrement">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                     <Calendar size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Date de naissance</p>
                     <p className="text-sm font-bold text-dark uppercase">{profile?.date_naissance || '---'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                     <MapPin size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Lieu de naissance</p>
                     <p className="text-sm font-bold text-dark uppercase">{profile?.lieu_naissance || '---'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                     <Landmark size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Registre d'État Civil</p>
                     <p className="text-sm font-mono font-bold text-dashboard-sidebar">{profile?.numero_registre_naissance || 'NON DISPONIBLE'}</p>
                  </div>
               </div>
            </div>
         </DashboardCard>
      </div>

      <AnimatePresence>
        {isModalOpen && profile && (
          <ProfileEditModal 
            profile={profile} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
