import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getDemandes } from '@/api/documents';
import type { IStats, IDemande, IPaginatedResponse } from '@/types';


export const useDashboardData = (page = 1, pageSize = 10) => {
  const { data: stats, isLoading: loadingStats, error: errorStats } = useQuery<IStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const { data: response, isLoading: loadingDemandes, error: errorDemandes } = useQuery<IPaginatedResponse<IDemande>>({
    queryKey: ['dashboardDemandes', page, pageSize],
    queryFn: () => getDemandes(page, pageSize),
  });

  const loading = loadingStats || loadingDemandes;
  const error = errorStats || errorDemandes ? "Impossible de charger les données du tableau de bord." : null;

  return {
    loading,
    stats: stats || { SOUMIS: 0, EN_TRAITEMENT: 0, REJETE: 0, ACCEPTE: 0 },
    demandes: response?.results || [],
    totalCount: response?.count || 0,
    error
  };
};
