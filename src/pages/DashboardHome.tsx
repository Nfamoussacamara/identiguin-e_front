import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import { StatusChart } from '../components/dashboard/StatusChart';
import { RecentDocumentsList } from '../components/dashboard/RecentDocumentsList';
import { Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import Skeleton from '../components/ui/Skeleton';

const DashboardHome = () => {
  const { loading, stats, demandes, error } = useDashboardData();
  const { handleOpenModal } = useOutletContext<{ handleOpenModal: () => void }>();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
           <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
           </div>
           <Skeleton className="h-12 w-44 rounded-2xl" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-dashboard-border rounded-admin p-6 flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts & List Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-white border border-dashboard-border rounded-admin p-6 h-[350px]">
              <Skeleton className="h-6 w-1/3 mb-6" />
              <Skeleton className="h-[250px] w-full" />
           </div>
           <div className="bg-white border border-dashboard-border rounded-admin p-6 h-[350px]">
              <Skeleton className="h-6 w-1/3 mb-6" />
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-xl">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Vue d'ensemble</h1>
          <p className="text-text-muted text-sm">Suivez l'état de vos demandes de documents nationaux.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green text-white font-display font-black rounded-2xl shadow-lg shadow-green-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          <span>Nouvelle Demande</span>
        </button>
      </div>

      {/* Statistiques Cards */}
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique */}
        <StatusChart stats={stats} />

        {/* Liste des Demandes Réelles */}
        <RecentDocumentsList demandes={demandes} />
      </div>
    </div>
  );
};

export default DashboardHome;
