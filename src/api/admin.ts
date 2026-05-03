/**
 * api/admin.ts
 * Services dédiés aux fonctionnalités administratives.
 */
import client from './client';
import type { IDemande, IPaginatedResponse } from '@/types';

export interface IAdminStats {
  total_demandes: number;
  total_verifications: number;
  stats_statut: Record<string, number>;
  stats_type: Record<string, number>;
  taux_automatisation: number;
  interventions_manuelles: number;
}

export interface ISystemStatus {
  blockchain_status: 'CONNECTED' | 'DISCONNECTED';
  current_block: number;
  latency_ms: number;
  active_nodes: number;
  system_availability: string;
}

/**
 * Récupère les statistiques globales du système
 */
export const getAdminStats = async (): Promise<IAdminStats> => {
  const response = await client.get<IAdminStats>('/dashboard/stats/');
  return response.data;
};

/**
 * Récupère l'état de santé du système et de la blockchain
 */
export const getSystemStatus = async (): Promise<ISystemStatus> => {
  const response = await client.get<ISystemStatus>('/dashboard/status/');
  return response.data;
};

/**
 * Récupère la liste complète des demandes citoyennes
 */
export const getAdminDemandes = async (page = 1, pageSize = 10): Promise<IPaginatedResponse<IDemande>> => {
  const response = await client.get<IPaginatedResponse<IDemande>>('/demandes/admin/all/', {
    params: { page, page_size: pageSize }
  });
  return response.data;
};
