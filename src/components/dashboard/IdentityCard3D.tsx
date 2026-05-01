import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Rotate3d } from 'lucide-react';

interface IdentityCard3DProps {
  recto: string;
  verso?: string | null;
  type?: string;
}

/**
 * Composant de carte interactive avec effet de Tilt 3D et Flip Recto/Verso.
 */
const IdentityCard3D: React.FC<IdentityCard3DProps> = ({ recto, verso, type = "CNI" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Valeurs de mouvement pour la rotation (Tilt)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Amortissement (smooth spring)
  // On combine le Tilt de la souris avec la rotation de 180° si c'est retourné
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 25 });
  const rotateYBase = useTransform(x, [-0.5, 0.5], [-15, 15]);
  const rotateY = useSpring(useTransform(rotateYBase, (v) => v + (isFlipped ? 180 : 0)), { stiffness: 150, damping: 25 });

  // Effet de brillance dynamique
  const glintX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glintY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (event.clientX - rect.left) / rect.width - 0.5;
    const yPct = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[550px] mx-auto py-8">
      <div 
        className="perspective-1000 w-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => verso && setIsFlipped(!isFlipped)}
      >
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative aspect-[1.58/1] w-full bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-visible border border-white/20"
        >
            {/* FACE RECTO */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[inherit] overflow-hidden"
            style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <img 
              src={recto} 
              alt="Recto"
              className="w-full h-full object-cover select-none"
            />
            {!isFlipped && (
                <motion.div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${glintX} ${glintY}, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
                        opacity: isHovered ? 1 : 0
                    }}
                />
            )}
          </div>

          {/* FACE VERSO */}
          <div 
            className="absolute inset-0 w-full h-full rounded-[inherit] overflow-hidden"
            style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
            }}
          >
            {verso ? (
                <img 
                    src={verso} 
                    alt="Verso"
                    className="w-full h-full object-cover select-none"
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                    VERSO NON DISPONIBLE
                </div>
            )}
            
            {isFlipped && (
                <motion.div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${glintX} ${glintY}, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%)`,
                        opacity: isHovered ? 1 : 0
                    }}
                />
            )}
          </div>
        </motion.div>
      </div>

      {/* Contrôles et indications */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="text-sm text-text-muted font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
            Aperçu numérique certifié
        </p>
        
        {verso && (
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-dashboard-border rounded-full text-xs font-bold text-dark hover:bg-gray-50 transition-all shadow-sm active:scale-95"
          >
            <Rotate3d size={16} className="text-green" />
            Retourner la carte (Voir le {isFlipped ? 'Recto' : 'Verso'})
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(IdentityCard3D);
