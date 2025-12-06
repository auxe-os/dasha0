import React from 'react';

interface HourlyHeatmapProps {
  data: number[];
}

const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data }) => {
  const maxVal = Math.max(...data, 1);

  return (
    <div className="glass-panel rounded-xl p-6 h-full border border-white/5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            Temporal Density
          </h3>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-mono mt-1">24H Message Frequency</p>
        </div>
      </div>
      
      <div className="relative h-48 flex items-end justify-between gap-1">
        {data.map((count, hour) => {
          const heightPct = Math.max((count / maxVal) * 100, 5); // Min 5% height
          
          return (
            <div key={hour} className="group relative flex-1 flex flex-col justify-end h-full">
               <div 
                 className="w-full bg-cyan-500/20 border-t border-cyan-400/50 hover:bg-cyan-400/80 transition-all duration-300 rounded-sm relative overflow-hidden"
                 style={{ height: `${heightPct}%` }}
               >
                 <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
               </div>
               
               {/* Hover Tooltip */}
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-black border border-cyan-500/30 text-cyan-400 text-xs font-mono py-1 px-2 rounded shadow-xl whitespace-nowrap">
                    {hour}:00 — <span className="text-white">{count} ops</span>
                  </div>
               </div>
            </div>
          );
        })}
        
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between opacity-20">
            <div className="w-full h-px bg-cyan-500 dashed"></div>
            <div className="w-full h-px bg-cyan-500 dashed"></div>
            <div className="w-full h-px bg-cyan-500 dashed"></div>
            <div className="w-full h-px bg-cyan-500 dashed"></div>
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500 uppercase">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
};

export default HourlyHeatmap;