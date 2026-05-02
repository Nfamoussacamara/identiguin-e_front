import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Search, 
  Filter, 
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronDown
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardCard } from '@/components/dashboard/DashboardCards';
import Skeleton from '../../components/ui/Skeleton';

const MyDocuments: React.FC = () => {
  const navigate = useNavigate();
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data with server-side pagination
  const { demandes, loading, totalCount } = useDashboardData(currentPage, pageSize);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'validé':
      case 'termine':
        return 'bg-green-light text-green border-green/20';
      case 'en_attente':
      case 'en attente':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'rejeté':
      case 'rejete':
        return 'bg-red-light text-red border-red/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'validé':
      case 'termine':
        return <CheckCircle2 size={14} />;
      case 'en_attente':
      case 'en attente':
        return <Clock size={14} />;
      case 'rejeté':
      case 'rejete':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  // Logic for totals
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Mes Documents</h1>
          <p className="text-text-muted font-body">Gérez et téléchargez vos documents d'identité certifiés.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              className="pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-green/20 focus:border-green outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-dark hover:bg-gray-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <DashboardCard title="Liste de vos documents">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dashboard-border">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type de Document</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Blockchain</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-dashboard-border">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton variant="circle" className="w-8 h-8" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : demandes.length > 0 ? (
                demandes.map((doc: any, idx: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={doc.reference} 
                    className="hover:bg-dashboard-bg transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-dashboard-sidebar bg-green-50 px-2 py-1 rounded">
                        {doc.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-dashboard-sidebar">
                          <FileText size={16} />
                        </div>
                        <span className="font-body font-semibold text-dark text-sm">{doc.type_document.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-text-muted">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(doc.statut)}`}>
                        {getStatusIcon(doc.statut)}
                        {doc.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.blockchain_tx_hash ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                          <span className="truncate w-24">{doc.blockchain_tx_hash}</span>
                          <div className="w-2 h-2 rounded-full bg-dashboard-sidebar animate-pulse"></div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">Non ancré</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/dashboard/documents/${doc.reference}`)}
                          className="p-2 text-gray-400 hover:text-green transition-colors"
                          title="Voir les détails"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <FileText size={24} />
                      </div>
                      <p className="text-gray-400 font-body text-sm">Aucun document trouvé.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (Matching Exactly your Capture) */}
        {!loading && totalCount > 0 && (
          <div className="mt-8 flex items-center justify-center gap-6 py-4 border-t border-dashboard-border">
            <div className="flex items-center gap-4 text-gray-400">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="hover:text-green transition-colors disabled:opacity-30"
              >
                <ChevronsLeft size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="hover:text-green transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="w-10 h-10 rounded-full bg-green text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-green/20">
              {currentPage}
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="hover:text-green transition-colors disabled:opacity-30"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hover:text-green transition-colors disabled:opacity-30"
              >
                <ChevronsRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="relative ml-4">
              <select 
                value={currentPage}
                onChange={(e) => {
                   setCurrentPage(Number(e.target.value));
                }}
                className="appearance-none pl-4 pr-10 py-2 border border-dashboard-border rounded-lg text-dark text-sm font-bold focus:outline-none focus:border-green transition-colors cursor-pointer min-w-[60px] text-center"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
};

export default MyDocuments;
