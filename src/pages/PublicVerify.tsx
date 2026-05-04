import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Search, Fingerprint, Clock, MapPin, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { DashboardCard } from '@/components/dashboard/DashboardCards';

/**
 * Composant PublicVerify : Interface dédiée aux tiers (Police, Banques, Écoles)
 * Permet de vérifier l'authenticité d'un document via NaissanceChain sans connexion.
 */
const PublicVerify = () => {
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulation d'appel à l'API de vérification publique
      const response = await axios.get(`/api/v1/verification/public/${reference}/`);
      setResult(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Référence introuvable. Ce document n'existe pas dans le registre national.");
      } else {
        setError("Une erreur est survenue lors de la vérification blockchain.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <DashboardCard className="shadow-2xl border-border bg-white backdrop-blur-2xl p-6 sm:p-8">
          {/* Bouton Retour Accueil Interne */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-400 hover:text-green mb-6 transition-colors group w-fit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Accueil</span>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-green/10 rounded-xl mb-4">
              <Fingerprint className="w-8 h-8 text-green" />
            </div>
            <h1 className="text-2xl font-bold text-dark mb-2">Vérification Blockchain</h1>
            <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
              Vérifiez l'authenticité d'un document en interrogeant le registre immuable de <span className="text-green font-bold">NaissanceChain</span>.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 mb-8">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Ex: CNI-2026-XXXX"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-5 pl-12 text-dark font-semibold focus:outline-none focus:border-green/50 focus:bg-white transition-all placeholder:text-gray-400 text-base"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green transition-colors" />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-green text-white font-bold py-3.5 px-6 rounded-xl hover:bg-green-dark transition-all disabled:opacity-50 shadow-md shadow-green/10 text-sm tracking-wider uppercase"
            >
              {loading ? "VÉRIFICATION..." : "VÉRIFIER LE DOCUMENT"}
            </button>
          </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4"
            >
              <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
              <p className="text-red-200 font-medium">{error}</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Badge Succès */}
              <div className="bg-green/10 border border-green/20 p-6 rounded-2xl flex items-center gap-4">
                <ShieldCheck className="w-12 h-12 text-green shrink-0" />
                <div>
                  <h3 className="text-green font-bold text-xl uppercase tracking-tight">Document Authentique</h3>
                  <p className="text-green/70 text-sm">Certifié immuable sur NaissanceChain</p>
                </div>
              </div>

              {/* Détails du document */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-xs block mb-1 uppercase tracking-wider font-bold">Titulaire</span>
                  <p className="text-dark font-bold text-lg">
                    {result.citoyen ? `${result.citoyen.first_name} ${result.citoyen.last_name}` : "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-gray-400 text-xs block mb-1 uppercase tracking-wider font-bold">Type de document</span>
                  <p className="text-dark font-bold text-lg">{result.type_document || "Document Officiel"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-green/10 rounded-lg">
                    <Clock className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block font-bold uppercase">Date d'émission</span>
                    <p className="text-dark text-sm font-bold">{new Date(result.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-green/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-green" />
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs block font-bold uppercase">Lieu de délivrance</span>
                    <p className="text-dark text-sm font-bold">Conakry, Guinée</p>
                  </div>
                </div>
              </div>

              {/* Hash Blockchain */}
              <div className="bg-dark p-5 rounded-2xl border border-white/5 shadow-inner">
                <span className="text-white/40 text-[10px] block mb-2 uppercase font-bold tracking-widest">Preuve Blockchain (Transaction Hash)</span>
                <p className="text-green font-mono text-xs break-all leading-relaxed">{result.blockchain_tx_hash}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
          Ministère de la Sécurité & de la Protection Civile
        </div>
        </DashboardCard>
      </motion.div>
    </div>
  );
};

export default PublicVerify;
