import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, BookOpen, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCards';
import { useOutletContext } from 'react-router-dom';

const documentTypes = [
  { 
    id: 'EXTRAIT_NAIS', 
    name: 'Extrait de Naissance', 
    icon: <FileText className="text-blue-500" />, 
    desc: 'Copie intégrale ou extrait d\'acte de naissance informatisé et certifié.',
    color: 'bg-blue-50'
  },
  { 
    id: 'CNI', 
    name: 'Carte d\'Identité (CNI)', 
    icon: <CreditCard className="text-green" />, 
    desc: 'Nouvelle carte d\'identité biométrique sécurisée conforme aux normes CEDEAO.',
    color: 'bg-green-light'
  },
  { 
    id: 'PASSEPORT', 
    name: 'Passeport Ordinaire', 
    icon: <BookOpen className="text-red-500" />, 
    desc: 'Document de voyage électronique biométrique valide pour vos déplacements internationaux.',
    color: 'bg-red-50'
  },
];

const NewRequest: React.FC = () => {
  const { handleOpenModal } = useOutletContext<{ handleOpenModal: (type?: string) => void }>();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section Standardisé */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Nouvelle Demande</h1>
          <p className="text-text-muted text-sm">Sélectionnez le document officiel que vous souhaitez commander.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-dashboard-bg rounded-full border border-dashboard-border">
          <Sparkles size={14} className="text-green" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Processus Digital</span>
        </div>
      </div>

      {/* Grid de Sélection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documentTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleOpenModal(type.id)}
            className="h-full cursor-pointer group"
          >
            <DashboardCard 
              className="h-full transition-all duration-300 hover:border-green/30 hover:shadow-xl hover:shadow-green/5 overflow-hidden relative"
            >
              <div className="flex flex-col items-start h-full relative z-10">
                <div className={`w-14 h-14 rounded-2xl ${type.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {React.cloneElement(type.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                
                <h3 className="font-display font-black text-dark text-lg mb-2">{type.name}</h3>
                <p className="text-text-muted text-xs leading-relaxed mb-8 flex-1">{type.desc}</p>
                
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all text-gray-400 group-hover:text-green group-hover:gap-4">
                  DÉMARRER LA DEMANDE <ArrowRight size={14} />
                </div>
              </div>

              {/* Effet visuel discret en fond */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                {React.cloneElement(type.icon as React.ReactElement<any>, { size: 120 })}
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </div>

      {/* Message de réassurance Premium */}
      <div className="relative overflow-hidden bg-dashboard-sidebar rounded-admin p-8 text-white group shadow-2xl shadow-dashboard-sidebar/20">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
             <ShieldCheck size={160} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={32} className="text-green" />
             </div>
             <div className="space-y-1">
                <h4 className="font-display font-black text-xl uppercase tracking-tight">Certification NaissanceChain</h4>
                <p className="text-sm text-white/70 font-body max-w-2xl">
                  Votre identité est protégée. Chaque demande génère une preuve cryptographique sur le registre 
                  guinéen pour garantir l'intégrité et la traçabilité de vos documents.
                </p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default NewRequest;
