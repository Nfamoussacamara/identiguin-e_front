import client from './client';

export interface IVerificationLog {
  id: number;
  document_reference: string;
  resultat: boolean;
  methode_display: string;
  verified_at: string;
  document_details?: {
    reference: string;
    type_document: string;
    statut: string;
    blockchain_tx_hash: string;
    created_at: string;
  };
}

/**
 * Récupère l'historique des vérifications de l'utilisateur connecté.
 */
export const getMyVerificationHistory = async (): Promise<IVerificationLog[]> => {
  const response = await client.get('/verification/my-history/');
  return response.data;
};

/**
 * Lance une vérification de document.
 */
export const verifyDocument = async (query: string, method: 'QR_CODE' | 'MANUEL' = 'MANUEL') => {
  const response = await client.get(`/verification/rechercher/?q=${query}&method=${method}`);
  return response.data;
};
