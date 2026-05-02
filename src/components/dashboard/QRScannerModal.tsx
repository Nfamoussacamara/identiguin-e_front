import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { DashboardCard } from './DashboardCards';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "qr-reader-container";

  const startScanner = async () => {
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        setHasPermission(true);
        setError(null);
        
        // Utiliser la caméra arrière par défaut
        const cameraId = cameras.length > 1 ? cameras[1].id : cameras[0].id;
        
        qrCodeScannerRef.current = new Html5Qrcode(regionId);
        await qrCodeScannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            stopScanner();
            onClose();
          },
          () => {} // Ignorer les erreurs de scan
        );
      } else {
        setError("Aucune caméra détectée.");
      }
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      setError("Permission caméra refusée ou erreur d'accès.");
    }
  };

  const stopScanner = async () => {
    if (qrCodeScannerRef.current && qrCodeScannerRef.current.isScanning) {
      try {
        await qrCodeScannerRef.current.stop();
        qrCodeScannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startScanner();
      }, 500);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm z-10"
          >
            <DashboardCard className="!p-0 border-none shadow-2xl overflow-hidden">
              {/* Header Compact Centré */}
              <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center relative bg-gray-50/30">
                <button 
                  onClick={onClose}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>

                <div className="w-12 h-12 bg-green/10 rounded-xl flex items-center justify-center text-green mb-3">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="font-display font-black text-dark text-base uppercase leading-none">Vérification QR</h3>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-1.5">Blockchain Ancrage</p>
                </div>
              </div>

              {/* Zone Caméra Compacte */}
              <div className="p-6">
                <div className="relative aspect-square w-full max-w-[260px] mx-auto rounded-admin overflow-hidden border border-dashboard-border shadow-inner">
                  <style>{`
                    #${regionId} {
                      background: transparent !important;
                    }
                    #${regionId} video {
                      width: 100% !important;
                      height: 100% !important;
                      object-fit: cover !important;
                    }
                  `}</style>
                  {/* Container pour Html5Qrcode */}
                  <div id={regionId} className="w-full h-full"></div>

                  {/* Overlay UI Zen */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Cadre de scan (Viseur) */}
                    <div className="w-44 h-44 border-2 border-white/10 rounded-none relative overflow-hidden">
                      {/* Barre de balayage (Laser) */}
                      <div className="absolute left-0 right-0 h-0.5 bg-green shadow-[0_0_15px_rgba(0,154,68,0.8)] z-10 animate-scan"></div>
                      
                      {/* Coins du cadre (Viseurs angulaires) */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green rounded-none"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green rounded-none"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green rounded-none"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green rounded-none"></div>
                    </div>
                  </div>

                  {/* États d'erreur / permission */}
                  <AnimatePresence>
                    {hasPermission === false && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 text-center"
                      >
                        <AlertCircle size={32} className="text-red-500 mb-2" />
                        <h4 className="font-bold text-dark text-xs mb-1">Erreur Caméra</h4>
                        <p className="text-[10px] text-text-muted mb-4">Veuillez autoriser l'accès.</p>
                        <button onClick={startScanner} className="px-4 py-2 bg-dashboard-sidebar text-white rounded-lg text-[10px] font-bold">
                          Réessayer
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-4 text-center space-y-1">
                  <p className="text-[10px] text-text-muted leading-relaxed px-4">
                    Placez le QR Code dans le cadre pour une validation instantanée.
                  </p>
                </div>
              </div>

              {/* Footer Ultra-Compact */}
              <div className="p-5 bg-gray-50 flex justify-center border-t border-gray-100">
                <div className="flex items-center gap-2 text-[10px] font-black text-green uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
                  Actif de Numérisation
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRScannerModal;
