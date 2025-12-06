import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'cyan' | 'violet' | 'pink' | 'emerald' | 'amber';
  subValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, trendUp, color = 'cyan', subValue }) => {
  
  const colorStyles = {
    blue: { text: 'text-blue-400', glow: 'shadow-blue-500/20', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
    cyan: { text: 'text-cyan-400', glow: 'shadow-cyan-500/20', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
    violet: { text: 'text-violet-400', glow: 'shadow-violet-500/20', border: 'border-violet-500/20', bg: 'bg-violet-500/10' },
    pink: { text: 'text-pink-400', glow: 'shadow-pink-500/20', border: 'border-pink-500/20', bg: 'bg-pink-500/10' },
    emerald: { text: 'text-emerald-400', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
    amber: { text: 'text-amber-400', glow: 'shadow-amber-500/20', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
  };

  const theme = colorStyles[color];

  return (
    <div className={`relative group overflow-hidden rounded-xl border ${theme.border} bg-[#0a0f1e]/80 backdrop-blur-md transition-all duration-300 hover:border-opacity-50 hover:bg-[#0f1629]/90`}>
      
      {/* Ambient Glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${theme.bg.replace('/10', '/30')}`} />
      
      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-lg ${theme.bg} ${theme.text} ring-1 ring-inset ${theme.border}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-black/40 border border-white/5 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{trendUp ? '↑' : '↓'}</span>
              {trend}
            </div>
          )}
        </div>

        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>{value}</h3>
            {subValue && <span className="text-xs text-slate-500 font-mono">{subValue}</span>}
          </div>
        </div>
      </div>
      
      {/* Progress Bar Line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-800">
        <div className={`h-full ${theme.bg.replace('/10', '')} ${theme.glow.replace('/20', '')} shadow-[0_0_10px_currentColor] w-[70%]`} />
      </div>
    </div>
  );
};

export default MetricCard;