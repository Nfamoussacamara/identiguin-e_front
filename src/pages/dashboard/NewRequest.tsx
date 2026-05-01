import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCards';
import { useOutletContext } from 'react-router-dom';

const documentTypes = [
  { id: 'EXTRAIT_NAIS', name: 'Extrait de Naissance', icon: <FileText className="text-blue-500" />, desc: 'Copie intégrale ou extrait d\'acte de naissance informatisé.' },
  { id: 'CNI', name: 'Carte d\'Identité (CNI)', icon: <CreditCard className="text-green" />, desc: 'Nouvelle carte d\'identité biométrique sécurisée.' },
  { id: 'PASSEPORT', name: 'Passeport Ordinaire', icon: <BookOpen className="text-red-500" />, desc: 'Document de voyage électronique valide 5 ou 10 ans.' },
];

const NewRequest: React.FC = () => {
  const { handleOpenModal } = useOutletContext<{ handleOpenModal: (type?: string) => void }>();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-black text-dark">Nouvelle demande</h1>
        <p className="text-text-muted font-body">Sélectionnez le type de document que vous souhaitez obtenir.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {documentTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ y: -5 }}
            onClick={() => handleOpenModal(type.id)}
            className="h-full cursor-pointer group"
          >
            <DashboardCard 
              className="h-full transition-all duration-300 hover:border-green/30"
            >
              <div className="flex flex-col items-start h-full">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-green/5 transition-colors">
                  {React.cloneElement(type.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                
                <h3 className="font-display font-bold text-dark text-xl mb-3">{type.name}</h3>
                <p className="text-text-muted text-sm leading-relaxed mb-10 flex-1">{type.desc}</p>
                
                <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-colors text-gray-400 group-hover:text-green">
                  SÉLECTIONNER <ArrowRight size={16} />
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        ))}
      </div>

      {/* Message de réassurance */}
      <DashboardCard className="bg-gray-50/30 border-dashed border-2 text-center py-10">
         <div className="max-w-md mx-auto space-y-4">
            <h4 className="font-display font-bold text-dark text-xl">Sécurité NaissanceChain</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Toutes vos demandes sont traitées de manière asynchrone et sécurisées par la technologie Blockchain pour garantir l'authenticité de vos titres d'identité.
            </p>
         </div>
      </DashboardCard>
    </div>
  );
};

export default NewRequest;
