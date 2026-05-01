import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

/**
 * Composant Skeleton avec animation de balayage (shimmer).
 * Utilisé pour indiquer le chargement des données tout en gardant la structure.
 */
const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClass = "skeleton animate-pulse";
  
  const variantClasses = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <div 
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear'
      }}
    />
  );
};

export default Skeleton;
