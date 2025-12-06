import React from 'react';
import { 
  MessageSquare, Users, Zap, Terminal, Activity, Cpu, HardDrive, Wifi, ArrowUpRight, Lock 
} from 'lucide-react';
import { DashboardMetrics } from '../types';
import MetricCard from './MetricCard';
import HourlyHeatmap from './HourlyHeatmap';

interface DashboardProps {
  data: DashboardMetrics;
  isLoading: boolean;
  onRefresh: () => void;
  error?: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ data, isLoading, onRefresh, error }) => {
  
  // -- Pie Chart (Donut) --
  const totalSentiment = data.sentiment.reduce((acc, curr) => acc + curr.value, 0);
  let currentAngle = 0;
  const pieGradient = data.sentiment.map((item) => {
    const percentage = (item.value / totalSentiment) * 100;
    const start = currentAngle;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  const maxVolume = Math.max(...data.messageVolume.map(d => d.count), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0a0f1e]/50 border border-white/5 rounded-xl px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`}></div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">System Online</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-xs font-mono text-slate-500">Latency: <span className="text-slate-300">{data.systemHealth.latencyMs}ms</span></span>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-xs font-mono text-slate-500">Uptime: <span className="text-slate-300">{data.systemHealth.uptimePct}%</span></span>
        </div>
        
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <span className="text-[10px] text-slate-600 font-mono uppercase">Last Sync: {new Date().toLocaleTimeString()}</span>
          <button 
            onClick={onRefresh} 
            disabled={isLoading}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors"
          >
            <Activity size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/30 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <Activity size={20} className="shrink-0 animate-pulse" />
          <p className="text-sm font-mono">{error}</p>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Conversations" 
          value={data.totalConversations.toLocaleString()} 
          icon={MessageSquare} 
          trend="12%" 
          trendUp={true}
          color="cyan"
        />
        <MetricCard 
          title="Active Users" 
          value={data.activeUsers.toLocaleString()} 
          icon={Users} 
          trend="5.2%" 
          trendUp={true}
          color="violet"
        />
        <MetricCard 
          title="Token Usage" 
          value={(data.tokenUsage.total / 1000).toFixed(1) + 'k'} 
          subValue={`$${data.tokenUsage.estimatedCost.toFixed(2)} est`}
          icon={Cpu} 
          trend="+8%" 
          trendUp={true}
          color="emerald"
        />
        <MetricCard 
          title="Data Throughput" 
          value={data.throughput.currentKbps} 
          subValue="KB/s"
          icon={Zap} 
          trend="Peak 45KB/s" 
          trendUp={true}
          color="pink"
        />
      </div>

      {/* Main Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
        
        {/* Terminal / Live Logs */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-0 flex flex-col h-full overflow-hidden border border-white/5 relative">
          <div className="px-4 py-3 border-b border-white/5 bg-[#0a0f1e]/80 flex justify-between items-center">
             <div className="flex items-center gap-2">
               <Terminal size={16} className="text-slate-400" />
               <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Live_Console_Output</span>
             </div>
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3 bg-[#050914] scrollbar-hide">
             {data.messages.length === 0 ? (
               <div className="text-slate-600 italic">No signals detected...</div>
             ) : (
               data.messages.map((msg, i) => (
                 <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                   <div className="flex gap-3 opacity-90 hover:opacity-100 transition-opacity">
                      <span className="text-slate-600 shrink-0">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                      <span className={`font-bold shrink-0 ${
                        msg.type === 'user' ? 'text-pink-400' : 'text-cyan-400'
                      }`}>
                        {msg.type === 'user' ? 'USR' : 'SYS'}::{msg.user}
                      </span>
                      <span className="text-slate-500 shrink-0">>></span>
                      <span className="text-slate-300 break-all">{msg.content.substring(0, 140)}{msg.content.length > 140 ? '...' : ''}</span>
                   </div>
                 </div>
               ))
             )}
             <div className="animate-pulse text-cyan-500 font-bold mt-2">_</div>
          </div>
        </div>

        {/* System Load Radial & Status */}
        <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 border border-white/5">
          
          {/* CPU Load */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-2">
                 <Cpu size={14} /> Core Load
               </h4>
               <span className="text-cyan-400 font-bold text-sm">{data.systemHealth.cpuLoad}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out" 
                 style={{ width: `${data.systemHealth.cpuLoad}%` }}
               ></div>
            </div>
          </div>

          {/* Memory/Tokens */}
          <div>
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-2">
                 <HardDrive size={14} /> Buffer Usage
               </h4>
               <span className="text-violet-400 font-bold text-sm">{(data.tokenUsage.total / 1000000 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-600 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out" 
                 style={{ width: `${(data.tokenUsage.total / 1000000 * 100)}%` }}
               ></div>
            </div>
          </div>
          
          {/* Sentiment Donut */}
          <div className="flex-1 flex flex-col items-center justify-center relative mt-2">
            <div 
              className="relative w-40 h-40 rounded-full transition-all duration-1000 hover:scale-105" 
              style={{ background: `conic-gradient(${pieGradient})`, boxShadow: '0 0 30px rgba(0,0,0,0.5)' }}
            >
              <div className="absolute inset-2 bg-[#0a0f1e] rounded-full flex flex-col items-center justify-center z-10">
                 <span className="text-2xl font-bold text-white">{totalSentiment}</span>
                 <span className="text-[9px] text-slate-500 uppercase tracking-widest">Analysed</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6 text-xs font-mono">
               {data.sentiment.map(s => (
                 <div key={s.label} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }}></span>
                    <span className="text-slate-400 uppercase">{s.label}</span>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Grid: Heatmap & Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
        <HourlyHeatmap data={data.hourlyActivity} />

        <div className="glass-panel rounded-xl p-6 border border-white/5 flex flex-col relative overflow-hidden">
           <div className="flex justify-between items-start mb-6 relative z-10">
             <div>
               <h3 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                 Traffic Volume
               </h3>
               <p className="text-slate-400 text-xs uppercase tracking-widest font-mono mt-1">7-Day Ingress Analysis</p>
             </div>
             <div className="bg-violet-500/10 p-2 rounded-lg border border-violet-500/20">
               <Wifi size={16} className="text-violet-400" />
             </div>
           </div>

           <div className="flex-1 flex items-end justify-between gap-2 relative z-10">
              {data.messageVolume.map((vol, i) => {
                const h = (vol.count / maxVolume) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div 
                      className="w-full bg-violet-500/20 border-t border-violet-400/50 hover:bg-violet-400/80 transition-all duration-500 relative rounded-sm"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute top-0 w-full h-px bg-violet-300 shadow-[0_0_15px_white]"></div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-2 uppercase">{vol.day}</span>
                  </div>
                )
              })}
           </div>
           
           {/* Background Decoration */}
           <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent pointer-events-none"></div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;