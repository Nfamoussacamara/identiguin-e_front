import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer l'initialisation globale de l'application.
 * Gère l'affichage unique du preloader par session pour optimiser l'UX.
 */
export const useAppInit = () => {
  const [isInitializing, setIsInitializing] = useState(() => {
    // Vérifie si l'application a déjà été initialisée dans cette session
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('identiguinee_initialized');
    }
    return true;
  });

  useEffect(() => {
    if (isInitializing) {
      // Timer pour le branding (effet WOW au premier chargement)
      const timer = setTimeout(() => {
        setIsInitializing(false);
        sessionStorage.setItem('identiguinee_initialized', 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isInitializing]);

  return { isInitializing };
};
