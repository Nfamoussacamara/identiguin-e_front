import React, { useState, useEffect } from 'react';
import { DashboardCard } from '../../components/dashboard/DashboardCards';
import { BanniereStatut, FeedNaissanceChain } from '../../components/admin/AdminComponents';
import { ArrowRight, Activity, Globe } from 'lucide-react';
import Skeleton from '../../components/ui/Skeleton';

// ── Données simulées ──────────────────────────────────────────────────────────
const MOCK_DEMANDES = [
  { id: 'REQ-2026-E77A12', type: 'Extrait',    statut: 'TRAITÉ',   hash: '0x3f9a...d42c', duree: '1 min 47s', heure: '14:32:07' },
  { id: 'REQ-2026-B82C45', type: 'CNI',        statut: 'TRAITÉ',   hash: '0xa2b4...e8f1', duree: '2 min 12s', heure: '14:31:15' },
  { id: 'REQ-2026-F91D22', type: 'Passeport',  statut: 'EN COURS', hash: '0x7c1d...b3a9', duree: '---',       heure: '14:33:45' },
  { id: 'REQ-2026-K12L90', type: 'Extrait',    statut: 'TRAITÉ',   hash: '0x9e5f...c2d0', duree: '1 min 55s', heure: '14:28:30' },
  { id: 'REQ-2026-Z44P11', type: 'Certificat', statut: 'REJETÉ',   hash: '0x1b2e...a4f6', duree: '0 min 42s', heure: '14:25:12' },
];

const STATUT_STYLE: Record<string, string> = {
  'TRAITÉ':   'bg-[#009A44]/10 text-[#009A44]',
  'EN COURS': 'bg-[#FCD116]/10 text-[#FCD116]',
  'REJETÉ':   'bg-[#CE1126]/10 text-[#CE1126]',
};

// ── Composant principal ───────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [demandesCount, setDemandesCount] = useState(247);

  // Simule le chargement initial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Simule l'incrémentation du compteur de demandes toutes les 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setDemandesCount(prev => prev + Math.floor(Math.random() * 3 + 1));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── ZONE 1 : Bannière statut ─────────────────────────────── */}
      {isLoading
        ? <Skeleton className="h-14 w-full rounded-admin" />
        : <BanniereStatut />
      }

      {/* ── ZONE 2 : 4 KPI Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Interventions manuelles"
          value="0"
          valueColor="#CE1126"
          sublabel="= Zéro corruption possible"
          sublabelColor="#009A44"
          loading={isLoading}
        />
        <DashboardCard
          title="Demandes aujourd'hui"
          value={demandesCount}
          valueColor="#009A44"
          sublabel="↑ +12% vs hier"
          loading={isLoading}
        />
        <DashboardCard
          title="Délai moyen"
          value="2 min 14s"
          valueColor="#FCD116"
          sublabel="Objectif < 3 min ✅"
          loading={isLoading}
        />
        <DashboardCard
          title="Taux automatisation"
          value="100%"
          valueColor="#009A44"
          sublabel="Aucune action humaine"
          loading={isLoading}
        />
      </div>

      {/* ── ZONE 3 : Table (65%) + Feed NaissanceChain (35%) ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table demandes */}
        <div className="lg:col-span-2">
          <DashboardCard className="h-[450px] flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-black text-dark uppercase tracking-tight">Demandes récentes</h3>
              <button className="text-[10px] font-black text-[#009A44] uppercase tracking-widest flex items-center gap-1 hover:underline">
                Voir tout <ArrowRight size={12} />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 flex-1 overflow-y-auto pr-2">
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
                      {['Référence', 'Type', 'Statut', 'Hash Blockchain', 'Durée', 'Heure'].map(h => (
                        <th key={h} className="px-3 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap bg-white">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashboard-border/50">
                    {MOCK_DEMANDES.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/70 transition-colors group">
                        <td className="px-3 py-3.5 text-[11px] font-mono font-bold text-dark whitespace-nowrap">{req.id}</td>
                        <td className="px-3 py-3.5">
                          <span className="text-[9px] font-black px-2 py-1 bg-gray-100 rounded-md uppercase tracking-tight">{req.type}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 ${STATUT_STYLE[req.statut]}`}>
                            {req.statut === 'EN COURS' && (
                              <span className="w-1.5 h-1.5 bg-[#FCD116] rounded-full animate-pulse" />
                            )}
                            {req.statut}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-[10px] font-mono text-gray-400">{req.hash}</td>
                        <td className="px-3 py-3.5 text-[11px] font-bold text-dark">{req.duree}</td>
                        <td className="px-3 py-3.5 text-[10px] font-mono text-gray-400">{req.heure}</td>
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
          <DashboardCard className="h-[450px] flex flex-col">
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
          <DashboardCard title="Activité de Traitement (24h) — Zéro Intervention Humaine">
            <div className="h-52 flex items-end gap-0.5 px-2">
              {[...Array(48)].map((_, i) => {
                const height = Math.random() * 70 + 20;
                const isNow = i === 28;
                return (
                  <div
                    key={i}
                    className={`relative flex-1 rounded-t-sm transition-all group cursor-pointer ${
                      isNow ? 'bg-[#009A44]' : 'bg-[#009A44]/15 hover:bg-[#009A44]/50'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {isNow && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                        <span className="w-2 h-2 bg-[#009A44] rounded-full block animate-pulse" />
                      </div>
                    )}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {Math.round(height / 5)} req.
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              {['00h', '06h', '12h', '18h', '23h'].map(t => <span key={t}>{t}</span>)}
            </div>
          </DashboardCard>
        )
      }

      {/* ── ZONE 6 : Stats complémentaires ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Répartition documents */}
        <DashboardCard title="Répartition des documents" loading={isLoading}>
          <div className="space-y-5">
            {[
              { label: 'CNI Biométrique',     pct: 45, color: '#009A44' },
              { label: 'Extrait de Naissance', pct: 35, color: '#FCD116' },
              { label: 'Passeport',            pct: 15, color: '#CE1126' },
              { label: 'Certificat Résidence', pct: 5,  color: '#5A7A62' },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-dark">{label}</span>
                  <span className="text-[10px] font-black" style={{ color }}>{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Vérifications tiers */}
        <DashboardCard title="Vérifications tiers" loading={isLoading}>
          <div className="flex flex-col items-center justify-center py-2">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center mb-4 relative"
              style={{ background: `conic-gradient(#009A44 0% 98%, #CE1126 98% 100%)` }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-black text-dark leading-none">98%</p>
                  <p className="text-[8px] text-gray-400 uppercase font-black">Auth.</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-black text-[#009A44] uppercase tracking-widest">Authenticité garantie</p>
            <p className="text-[10px] font-bold text-[#CE1126] uppercase tracking-tight mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#CE1126] rounded-full" /> Fraude détectée : 0
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
                <p className="text-[10px] font-black text-dark uppercase tracking-tight">ODD 16 — Justice & Paix</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                  <span className="font-black text-[#CE1126]">0</span> pot-de-vin possible — système 100% automatisé.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-50 text-[#009A44] rounded-xl flex items-center justify-center shrink-0">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-dark uppercase tracking-tight">ODD 10 — Réduction Inégalités</p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                  <span className="font-black text-[#009A44]">{demandesCount}</span> citoyens ont accédé à leurs droits aujourd'hui.
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
