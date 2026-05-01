import React, { useState, useLayoutEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import type { IStats } from '@/types';
import { DashboardCard } from './DashboardCards';

interface StatusChartProps {
  stats: IStats;
}

export const StatusChart = ({ stats }: StatusChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Utilisation de ResizeObserver pour une détection ultra-fiable
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      // On ne met à jour que si les dimensions sont valides et ont changé
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const chartData = [
    { name: 'Soumis', value: stats.SOUMIS || 0, color: '#3b82f6' },
    { name: 'En cours', value: stats.EN_TRAITEMENT || 0, color: '#fbbf24' },
    { name: 'Rejeté', value: stats.REJETE || 0, color: '#ef4444' },
    { name: 'Accepté', value: stats.ACCEPTE || 0, color: '#10b981' },
  ];

  return (
    <DashboardCard title="Statistiques de traitement">
      <div ref={containerRef} className="h-[300px] w-full mt-4 min-w-0 overflow-hidden relative bg-white">
        {dimensions.width > 0 && dimensions.height > 0 ? (
          <BarChart 
            width={dimensions.width} 
            height={dimensions.height} 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6c757d', fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6c757d' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8f9fa' }} 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={Math.min(40, dimensions.width / 8)}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#23965F] rounded-full animate-spin" />
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
