import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, PlusCircle, ShieldCheck, 
  User, Moon, Grid, ChevronDown, LogOut, Loader2, CheckCircle
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import NewRequestModal from '@/components/dashboard/NewRequestModal';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/ui/Skeleton';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [globalStatus, setGlobalStatus] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const location = useLocation();
  const { profile, initiales, isLoading } = useProfile();

  // Gérer le redimensionnement pour adapter l'UI en temps réel
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer la sidebar auto sur mobile après un clic sur un lien
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const menuItems = [
    { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Mes Documents', icon: <FileText size={20} />, path: '/dashboard/documents' },
    { name: 'Nouvelle Demande', icon: <PlusCircle size={20} />, path: '/dashboard/demandes/nouvelle' },
    { name: 'Vérification', icon: <ShieldCheck size={20} />, path: '/dashboard/verification' },
    { name: 'Mon Profil', icon: <User size={20} />, path: '/dashboard/profil' },
  ];

  const handleOpenModal = (type: string | null = null) => {
    setActiveType(type);
    setIsModalOpen(true);
    setIsMinimized(false);
  };

  return (
    <div className="dashboard-theme flex flex-col h-screen overflow-hidden font-sans bg-[#F8F7F7]">
      {/* Overlay pour Mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[25]"
          />
        )}
      </AnimatePresence>

      {/* Header Full Width */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-30 shrink-0 shadow-sm">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-gray-50 rounded-lg text-[#23965F] transition-all"
          >
            <Grid size={24} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="IdentiGuinée Logo" className="h-8 md:h-10 w-auto" />
            <span className="hidden sm:inline font-display font-black text-dark text-lg tracking-tight">IdentiGuinée</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6 text-gray-500">
          <div className="hidden md:flex items-center space-x-4 border-r pr-6 border-gray-100">
              <button className="hover:text-[#23965F] transition-colors"><Moon size={22} /></button>
          </div>
          
          <button className="flex items-center space-x-2 md:space-x-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 md:px-4 py-2 rounded-full shadow-sm transition-all">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Skeleton variant="circle" className="w-8 h-8" />
                  <Skeleton className="h-3 w-20 hidden md:block" />
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-[#23965F] text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                    {initiales}
                  </div>
                  <span className="text-xs md:text-sm font-bold truncate max-w-[80px] md:max-w-none">
                    {profile?.nom_complet ?? 'Citoyen'}
                  </span>
                  <ChevronDown size={16} className="shrink-0" />
                </>
              )}
          </button>
        </div>
      </header>

      <div className="flex flex-grow overflow-hidden relative">
        {/* Sidebar - Mode Tiroir sur Mobile */}
        <aside 
          className={`
            fixed lg:relative inset-y-0 left-0 z-[40] lg:z-10
            bg-[#23965F] flex flex-col shadow-xl 
            transition-all duration-300 ease-in-out overflow-hidden
            ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-0'}
          `}
        >
          <nav className="flex-grow mt-6 px-3 space-y-1 min-w-[256px]">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path 
                    ? 'bg-[#ffce00] text-gray-900 font-bold shadow-md' 
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}

            {/* Item Dynamique : Suivi en direct */}
            <AnimatePresence mode="popLayout">
              {globalStatus && (
                <motion.button
                  key="sidebar-live-tracking"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  onClick={() => { setIsMinimized(false); setIsModalOpen(true); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 mt-4 group hover:bg-white/20 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Loader2 size={20} className={globalStatus !== 'PRET' ? 'animate-spin text-green-300' : 'text-green-400'} />
                      {globalStatus !== 'PRET' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                      )}
                    </div>
                    <span className="text-sm font-bold tracking-tight">Suivi en direct</span>
                  </div>
                  <div className="bg-green-500/20 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30">
                    LIVE
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-grow overflow-y-auto p-4 md:p-8 flex flex-col">
          <div className="flex-grow max-w-7xl mx-auto w-full">
            <Outlet context={{ handleOpenModal }} />
          </div>
          
          <footer className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:row gap-4 justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-widest text-center">
             <p>© 2026 IdentiGuinée - Portail de l'Innovation</p>
             <div className="flex space-x-6">
                <a href="#" className="hover:text-[#23965F] transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-[#23965F] transition-colors">Aide</a>
             </div>
          </footer>
        </main>

        {/* Mini Tracker Flottant (Pill) - Adapté Mobile */}
        <AnimatePresence mode="wait">
          {isMinimized && globalStatus && (
            <motion.button
              key="floating-pill-tracker"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={() => { setIsMinimized(false); setIsModalOpen(true); }}
              className="fixed bottom-6 right-4 left-4 md:left-auto md:right-24 bg-white border border-green/20 shadow-2xl rounded-2xl md:rounded-full pl-2 pr-6 py-2 flex items-center gap-3 z-[60] hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-green/10 text-green flex items-center justify-center shrink-0">
                {globalStatus === 'PRET' ? <CheckCircle size={20} /> : <Loader2 size={20} className="animate-spin" />}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Génération en cours</p>
                <p className="text-[11px] font-bold text-dark truncate">
                  {globalStatus === 'RECUE' && 'Initialisation...'}
                  {globalStatus === 'VERIFICATION' && 'Validation Blockchain...'}
                  {globalStatus === 'SIGNATURE' && 'Signature PDF...'}
                  {globalStatus === 'PRET' && 'Document prêt !'}
                </p>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <NewRequestModal 
        isOpen={isModalOpen && !isMinimized} 
        onClose={() => { setIsModalOpen(false); setGlobalStatus(null); }} 
        onMinimize={() => setIsMinimized(true)}
        onStatusChange={(status) => setGlobalStatus(status)}
        initialType={activeType}
      />
    </div>
  );
};

export default DashboardLayout;
