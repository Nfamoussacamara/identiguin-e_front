import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardCard } from '../../components/dashboard/DashboardCards';
import { BanniereStatut, FeedNaissanceChain } from '../../components/admin/AdminComponents';
import { ArrowRight, Activity, Globe, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../../components/ui/Skeleton';
import { getAdminStats, getAdminDemandes } from '../../api/admin';
import { useAdminWebSocket } from '../../hooks/useAdminWebSocket';

const STATUT_STYLE: Record<string, string> = {
  'PRET':   'bg-[#009A44]/10 text-[#009A44]',
  'TRAITE':   'bg-[#009A44]/10 text-[#009A44]',
  'VERIFICATION': 'bg-[#FCD116]/10 text-[#FCD116]',
  'SIGNATURE': 'bg-[#FCD116]/10 text-[#FCD116]',
  'RECUE': 'bg-[#FCD116]/10 text-[#FCD116]',
  'REJETE':   'bg-[#CE1126]/10 text-[#CE1126]',
};

const STATUT_LABEL: Record<string, string> = {
  'PRET': 'TRAITÉ',
  'TRAITE': 'TRAITÉ',
  'VERIFICATION': 'EN COURS',
  'SIGNATURE': 'EN COURS',
  'RECUE': 'EN COURS',
  'REJETE': 'REJETÉ',
};

// ── Composant principal ───────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');

  // Activation du temps réel (Zéro Intervention Humaine — Surveillance Live)
  useAdminWebSocket();

  // Récupération des stats globales
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
    refetchInterval: 60000,
  });

  // Récupération des demandes avec filtres dynamiques
  const { data: demandesData, isLoading: isDemandesLoading } = useQuery({
    queryKey: ['admin-demandes', searchTerm, selectedType],
    queryFn: () => getAdminDemandes(1, 6, searchTerm, selectedType),
    refetchInterval: 60000,
  });

  const isLoading = isStatsLoading || isDemandesLoading;
  const demandesCount = stats?.total_demandes || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── ZONE 1 : Bannière statut ─────────────────────────────── */}
      {isLoading
        ? <Skeleton className="h-14 w-full rounded-admin" />
        : <BanniereStatut />
      }

      {/* ── ZONE 2 : 4 KPI Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-in fade-in zoom-in duration-500 delay-75 fill-mode-both">
          <DashboardCard
            title="Interventions manuelles"
            value={stats?.interventions_manuelles ?? 0}
            valueColor="#CE1126"
            sublabel="= Zéro corruption possible"
            sublabelColor="#009A44"
            loading={isLoading}
          />
        </div>
        <div className="animate-in fade-in zoom-in duration-500 delay-150 fill-mode-both">
          <DashboardCard
            title="Demandes aujourd'hui"
            value={demandesCount}
            valueColor="#009A44"
            sublabel={stats ? "Données réelles" : "Chargement..."}
            loading={isLoading}
          />
        </div>
        <div className="animate-in fade-in zoom-in duration-500 delay-200 fill-mode-both">
          <DashboardCard
            title="Délai moyen"
            value="---"
            valueColor="#FCD116"
            sublabel="Calcul en cours"
            loading={isLoading}
          />
        </div>
        <div className="animate-in fade-in zoom-in duration-500 delay-300 fill-mode-both">
          <DashboardCard
            title="Taux automatisation"
            value={`${stats?.taux_automatisation ?? 100}%`}
            valueColor="#009A44"
            sublabel="Aucune action humaine"
            loading={isLoading}
          />
        </div>
      </div>

      {/* ── ZONE 3 : Table (65%) + Feed NaissanceChain (35%) ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table demandes */}
        <div className="lg:col-span-2">
          <DashboardCard className="h-[480px] flex flex-col p-6">
            <div className="flex flex-col gap-4 mb-6 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Demandes & Audits</h3>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#009A44] transition-colors" size={14} />
                    <input 
                      type="text"
                      placeholder="Rechercher (Réf, Nom...)"
                      className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#009A44] focus:bg-white transition-all w-48 md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="text-[10px] font-black text-[#009A44] uppercase tracking-widest flex items-center gap-2 hover:underline transition-all">
                    Voir tout <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Badges de filtrage */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Filter size={12} className="text-gray-400 mr-1" />
                {[
                  { id: '', label: 'Toutes' },
                  { id: 'CNI', label: 'CNI' },
                  { id: 'EXTRAIT', label: 'Extraits' },
                  { id: 'PASSEPORT', label: 'Passeports' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedType(f.id)}
                    className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                      selectedType === f.id 
                        ? 'bg-[#009A44] text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4 flex-1 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-auto flex-1 pr-2 relative">
                <table className="w-full text-left relative">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-dashboard-border">
                      {['Référence', 'Type', 'Statut', 'Hash Blockchain', 'Date'].map(h => (
                        <th key={h} className="px-3 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap bg-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashboard-border/50">
                    {demandesData?.results.map((req) => (
                      <tr key={req.reference} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="px-3 py-3.5 text-[11px] font-mono font-bold text-[#1A2E1F] whitespace-nowrap">{req.reference.substring(0, 12)}...</td>
                        <td className="px-3 py-3.5">
                          <span className="text-[9px] font-black px-2 py-1 bg-gray-100 rounded-md uppercase tracking-tight">{req.type_document}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 ${STATUT_STYLE[req.statut]}`}>
                            {['VERIFICATION', 'SIGNATURE', 'RECUE'].includes(req.statut) && (
                              <span className="w-1.5 h-1.5 bg-[#FCD116] rounded-full animate-pulse" />
                            )}
                            {STATUT_LABEL[req.statut] || req.statut}
                          </span>
                        </td>
                        <td className={`px-3 py-3.5 text-[10px] font-mono ${req.blockchain_tx_hash ? 'text-[#009A44] font-bold' : 'text-gray-400'}`}>
                          {req.blockchain_tx_hash ? `${req.blockchain_tx_hash.substring(0, 10)}...` : '---'}
                        </td>
                        <td className="px-3 py-3.5 text-[10px] font-mono text-gray-400">
                          {new Intl.DateTimeFormat('fr-GN', { hour: '2-digit', minute: '2-digit' }).format(new Date(req.created_at))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Feed NaissanceChain */}
        <div className="lg:col-span-1">
          <DashboardCard className="h-[480px] flex flex-col p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-40" />
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton variant="circle" className="w-6 h-6 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2.5 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <FeedNaissanceChain />
            )}
          </DashboardCard>
        </div>
      </div>



      {/* ── ZONE 5 : Graphique 24h ───────────────────────────────── */}
      {isLoading
        ? <Skeleton className="h-64 w-full rounded-admin" />
        : (
          <DashboardCard title="Activité de Traitement — Données Réelles">
            <div className="h-52 flex items-end gap-1 px-4">
              {/* On affiche une barre par type de document pour montrer l'activité réelle */}
              {stats && Object.entries(stats.stats_type).map(([label, count], i) => {
                const height = (count / (stats.total_demandes || 1)) * 100;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="relative w-full bg-[#009A44]/20 rounded-t-lg transition-all hover:bg-[#009A44]/40" style={{ height: `${height}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A2E1F] text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {count} demandes
                      </div>
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
                  </div>
                );
              })}
              {(!stats || Object.keys(stats.stats_type).length === 0) && (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Aucune donnée d'activité</p>
                </div>
              )}
            </div>
          </DashboardCard>
        )
      }

      {/* ── ZONE 6 : Stats complémentaires ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Répartition documents */}
        <DashboardCard title="Répartition des documents" loading={isLoading}>
          <div className="space-y-5">
            {stats && Object.entries(stats.stats_type).length > 0 ? Object.entries(stats.stats_type).map(([label, count]) => {
              const pct = Math.round((count / (stats.total_demandes || 1)) * 100);
              const colors: Record<string, string> = {
                'CNI': '#009A44',
                'EXTRAIT': '#FCD116',
                'PASSEPORT': '#CE1126',
                'CERTIFICAT': '#5A7A62'
              };
              const color = colors[label] || '#009A44';
              return (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#1A2E1F]">{label}</span>
                    <span className="text-[10px] font-black" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            }) : (
              <p className="text-[10px] text-gray-400 italic py-4 text-center">Aucun document émis</p>
            )}
          </div>
        </DashboardCard>

        {/* Vérifications tiers */}
        <DashboardCard title="Vérifications tiers" loading={isLoading}>
          <div className="flex flex-col items-center justify-center py-2">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mb-4 relative"
              style={{ background: `conic-gradient(#009A44 0% ${stats?.total_verifications ? '100%' : '0%'}, #f3f4f6 ${stats?.total_verifications ? '100%' : '0%'} 100%)` }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-black text-[#1A2E1F] leading-none">{stats?.total_verifications || 0}</p>
                  <p className="text-[8px] text-gray-400 uppercase font-black">Total</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-black text-[#009A44] uppercase tracking-widest">
              {stats?.total_verifications ? 'Système Audité' : 'En attente de scan'}
            </p>
            <p className="text-[10px] font-bold text-[#CE1126] uppercase tracking-tight mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#CE1126] rounded-full" /> Fraude détectée : {stats?.interventions_manuelles || 0}
            </p>
          </div>
        </DashboardCard>

        {/* Impact ODD */}
        <DashboardCard title="Impact ODD" loading={isLoading}>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#1A2E1F] uppercase tracking-tight">ODD 16 — Justice & Paix</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                  <span className="font-black text-[#CE1126]">{stats?.interventions_manuelles || 0}</span> intervention manuelle — système inviolable.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 text-[#009A44] rounded-xl flex items-center justify-center shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#1A2E1F] uppercase tracking-tight">ODD 10 — Réduction Inégalités</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                  <span className="font-black text-[#009A44]">{demandesCount}</span> citoyens ont accédé à leurs droits.
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
