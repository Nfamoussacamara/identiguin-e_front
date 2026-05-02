import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Database, Cpu, Terminal as TerminalIcon, CheckCircle, Clock } from 'lucide-react';
import { DashboardCard } from '../dashboard/DashboardCards';

/**
 * Zone 1 — Bannière statut système
 */
export const BanniereStatut: React.FC = () => {
  const [blockNumber, setBlockNumber] = useState(48291);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#F0FAF5] border-l-4 border-[#009A44] p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#009A44]/10 text-[#009A44] rounded-full flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-sm font-black text-[#1A2E1F] uppercase tracking-tight">Système 100% automatisé</p>
          <p className="text-[10px] text-[#5A7A62] font-bold uppercase tracking-widest">Aucune intervention humaine requise — Disponibilité 99.9%</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] text-[#5A7A62] font-black uppercase tracking-widest">NaissanceChain</p>
          <p className="text-sm font-mono font-black text-[#009A44]">Bloc #{blockNumber}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#009A44]/10 rounded-full">
          <span className="w-2 h-2 bg-[#009A44] rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-[#009A44] uppercase tracking-widest text-center">Live</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Zone 3 (Droite) — Feed NaissanceChain en direct
 */
export const FeedNaissanceChain: React.FC = () => {
  const [events, setEvents] = useState([
    { id: 1, type: 'Vérification identité', hash: '0x3f9a...d42c', time: 'À l\'instant', color: '#009A44' },
    { id: 2, type: 'Génération document CNI', hash: '0xa2b4...e8f1', time: 'Il y a 12s', color: '#1A2E1F' },
    { id: 3, type: 'Certification acte naissance', hash: '0x7c1d...b3a9', time: 'Il y a 45s', color: '#009A44' },
    { id: 4, type: 'Enregistrement NPI', hash: '0x9e5f...c2d0', time: 'Il y a 1 min', color: '#009A44' },
  ]);

  useEffect(() => {
    const types = [
      { name: 'Vérification identité', color: '#009A44' },
      { name: 'Génération document CNI', color: '#1A2E1F' },
      { name: 'Certification acte naissance', color: '#009A44' },
      { name: 'Vérification QR code', color: '#FCD116' },
      { name: 'Enregistrement NPI', color: '#009A44' }
    ];

    const interval = setInterval(() => {
      const newType = types[Math.floor(Math.random() * types.length)];
      const newHash = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;
      
      setEvents(prev => [
        { id: Date.now(), type: newType.name, hash: newHash, time: 'À l\'instant', color: newType.color },
        ...prev.slice(0, 7)
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-sm font-black text-dark uppercase tracking-tight">NaissanceChain en direct</h3>
        <span className="w-2 h-2 bg-[#009A44] rounded-full animate-ping" />
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 relative">
        {events.map((event) => (
          <div 
            key={event.id}
            className="bg-gray-50/50 border border-dashboard-border rounded-xl p-3 shadow-sm flex items-center gap-3 transition-all animate-in slide-in-from-top duration-500"
          >
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[11px] font-black text-dark uppercase tracking-tight">{event.type}</p>
                <span className="text-[9px] text-gray-400 font-bold">{event.time}</span>
              </div>
              <p className="text-[10px] font-mono text-[#5A7A62]">{event.hash}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Zone 4 — Blockchain Activity (Métriques + Visualisation + Terminal)
 */
export const BlockchainActivity: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Métriques Réseau */}
      <DashboardCard title="Métriques réseau">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-green" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</span>
            </div>
            <span className="text-[10px] font-black text-green uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" /> Connecté
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-green" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latence</span>
            </div>
            <span className="text-xs font-bold text-dark tracking-tight">{"<"} 1 seconde</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-green" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nœuds actifs</span>
            </div>
            <span className="text-xs font-bold text-dark tracking-tight">12 nœuds</span>
          </div>
        </div>
      </DashboardCard>

      {/* Visualisation Chaîne */}
      <DashboardCard title="Chaîne de blocs">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[48289, 48290, 48291].map((n) => (
            <React.Fragment key={n}>
              <div className="flex-shrink-0 w-24 bg-white border border-[#009A44] rounded-xl p-3 text-center shadow-sm relative">
                <div className="absolute -top-2 -right-2 bg-[#009A44] text-white rounded-full p-0.5 shadow-md">
                  <CheckCircle size={10} />
                </div>
                <p className="text-[10px] font-black text-dark mb-1">#{n}</p>
                <p className="text-[8px] font-mono text-gray-400 truncate">0x{n}a...f{n}</p>
              </div>
              <div className="w-4 h-0.5 bg-[#009A44]/20 flex-shrink-0" />
            </React.Fragment>
          ))}
          <div className="flex-shrink-0 w-24 bg-[#FCD116]/5 border border-[#FCD116] border-dashed rounded-xl p-3 text-center">
            <p className="text-[10px] font-black text-[#FCD116] mb-1 animate-pulse">#48292</p>
            <div className="flex justify-center">
              <Clock size={12} className="text-[#FCD116] animate-spin" />
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Terminal Blockchain */}
      <DashboardCard className="bg-[#0D1B12] !border-none">
        <div className="flex items-center gap-2 mb-3 text-[#009A44]/50">
          <TerminalIcon size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Terminal NaissanceChain</span>
        </div>
        <div className="font-mono text-[10px] space-y-2 text-[#009A44] leading-relaxed">
          <p className="opacity-80 tracking-tighter animate-in fade-in slide-in-from-left duration-500">
            {"> "} Bloc #48291 confirmé ✓
          </p>
          <p className="opacity-60 text-[8px] tracking-tighter">
            {"> "} Hash: 0x3f9a8c2b1e4d...
          </p>
          <p className="opacity-80 tracking-tighter delay-150 animate-in fade-in slide-in-from-left duration-500">
            {"> "} Bloc #48292 en cours...
          </p>
          <div className="flex items-center gap-2">
            <span className="animate-pulse">⟳</span>
            <span className="opacity-60 italic">En attente de confirmation</span>
          </div>
          <div className="w-1.5 h-3 bg-[#009A44] animate-pulse inline-block align-middle ml-1" />
        </div>
      </DashboardCard>
    </div>
  );
};
