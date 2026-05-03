import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook modulaire pour gérer la connexion WebSocket admin.
 * Responsable de la réception des notifications en temps réel.
 */
export const useAdminWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const wsUrl = `ws://${window.location.hostname}:8000/ws/admin/notifications/?token=${token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('📡 Connecté au flux temps réel NaissanceChain');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'notification') {
        // 1. Afficher un toast élégant via Sonner
        toast.success(data.message, {
          description: `Réf: ${data.data.reference}`,
          duration: 5000,
          position: 'top-right',
        });

        // 2. Invalider les requêtes pour mettre à jour le dashboard instantanément
        queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        queryClient.invalidateQueries({ queryKey: ['admin-demandes'] });
        queryClient.invalidateQueries({ queryKey: ['admin-demandes-feed'] });
      }
    };

    socket.onclose = () => {
      console.log('🔌 Déconnecté du flux temps réel');
      // Optionnel : Logique de reconnexion automatique
    };

    return () => {
      socket.close();
    };
  }, [queryClient]);
};
