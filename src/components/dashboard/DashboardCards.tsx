import React from 'react';
import Skeleton from '../ui/Skeleton';

interface DashboardCardProps {
  title?: string;
  value?: string | number;
  valueColor?: string;
  sublabel?: string;
  sublabelColor?: string;
  borderColor?: string;
  loading?: boolean;
  content?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Composant DashboardCard Premium - Utilisé pour les KPI et les sections du dashboard.
 * Conforme au Cahier des Charges IdentiGuinée 2026.
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  valueColor,
  sublabel,
  sublabelColor,
  borderColor,
  loading = false,
  content,
  children,
  className = ''
}) => {
  if (loading) {
    return (
      <div
        className={`bg-white border border-dashboard-border rounded-admin p-6 shadow-sm ${className}`}
        style={borderColor ? { borderTop: `4px solid ${borderColor}` } : {}}
      >
        <div className="space-y-3">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-dashboard-border rounded-admin p-6 shadow-sm overflow-hidden transition-all duration-300 ${className}`}
      style={borderColor ? { borderTop: `4px solid ${borderColor}` } : {}}
    >
      {title && value === undefined && (
        <h3 className="text-sm font-black text-dark uppercase tracking-tight mb-4 flex items-center justify-between">
          {title}
        </h3>
      )}

      {value !== undefined ? (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
          <h2
            className="text-4xl font-display font-black tracking-tighter leading-none"
            style={{ color: valueColor || '#1A2E1F' }}
          >
            {value}
          </h2>
          {sublabel && (
            <p
              className="text-[10px] font-bold uppercase tracking-tight"
              style={{ color: sublabelColor || '#5A7A62' }}
            >
              {sublabel}
            </p>
          )}
        </div>
      ) : (
        <>
          {content || children}
        </>
      )}
    </div>
  );
};

interface StatsCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  variant: 'blue' | 'orange' | 'red' | 'green';
}

/**
 * Composant de statistique avec icône sur fond coloré (style référence).
 */
export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, variant }) => {
  const variantStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
  };

  const style = variantStyles[variant];

  return (
    <div className="bg-white border border-dashboard-border rounded-admin p-6 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center ${style.text}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-display font-black text-dark leading-none">{value}</div>
        <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${style.text}`}>{label}</div>
      </div>
    </div>
  );
};
