import React, { useState, useEffect, useCallback } from 'react';
import { Settings, LayoutDashboard, Key, Link2, Box, Command, Layers, ShieldCheck, Database } from 'lucide-react';
import Dashboard from './components/Dashboard';
import { ApiConfig, DashboardMetrics } from './types';
import { fetchAnalytics } from './services/agentZeroService';
import { MOCK_METRICS, DEFAULT_API_URL, DEFAULT_CONTEXT_ID } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [config, setConfig] = useState<ApiConfig>({
    url: localStorage.getItem('az_url') || DEFAULT_API_URL,
    apiKey: localStorage.getItem('az_key') || '',
    contextId: localStorage.getItem('az_ctx') || DEFAULT_CONTEXT_ID
  });

  const [metrics, setMetrics] = useState<DashboardMetrics>(MOCK_METRICS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchAnalytics(config);
    setMetrics(data);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [config]);

  // Initial load and Auto-refresh every 30s
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleSaveConfig = () => {
    localStorage.setItem('az_url', config.url);
    localStorage.setItem('az_key', config.apiKey);
    localStorage.setItem('az_ctx', config.contextId);
    
    setIsLoading(true);
    fetchAnalytics(config).then((data) => {
       setMetrics(data);
       setIsLoading(false);
       setActiveTab('dashboard');
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden flex">
      
      {/* Sidebar / Navigation Rail */}
      <nav className="w-20 border-r border-white/5 bg-[#050914] flex flex-col items-center py-8 z-50">
         <div className="mb-12">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
               <Box className="text-white" size={24} strokeWidth={2.5} />
            </div>
         </div>
         
         <div className="space-y-6 w-full px-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 group relative ${activeTab === 'dashboard' ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
            >
               <LayoutDashboard size={22} />
               <div className={`absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10`}>Dashboard</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 group relative ${activeTab === 'settings' ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
            >
               <Settings size={22} />
               <div className={`absolute left-full ml-4 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10`}>Settings</div>
            </button>
         </div>

         <div className="mt-auto flex flex-col gap-6 text-slate-600">
            <Layers size={20} className="hover:text-slate-400 transition-colors cursor-pointer" />
            <Database size={20} className="hover:text-slate-400 transition-colors cursor-pointer" />
         </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
         {/* Top Bar */}
         <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-40">
            <div className="flex items-center gap-4">
               <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                 AGENT ZERO <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">V.2.0</span>
               </h1>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  SECURE_CONNECTION
               </div>
               <div className="w-px h-4 bg-white/10"></div>
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 flex items-center justify-center">
                     <span className="font-bold text-xs">A0</span>
                  </div>
               </div>
            </div>
         </header>

         {/* Scrollable Area */}
         <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            {activeTab === 'dashboard' ? (
              <Dashboard 
                data={metrics} 
                isLoading={isLoading} 
                onRefresh={refreshData} 
              />
            ) : (
              <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                       <Command className="text-cyan-400" /> API Configuration
                    </h2>
                    <p className="text-slate-400 mb-8">Establish a secure link to your Agent Zero instance.</p>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-slate-400 uppercase">Endpoint URL</label>
                          <div className="relative group">
                             <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                             <input 
                               type="text" 
                               value={config.url}
                               onChange={(e) => setConfig({...config, url: e.target.value})}
                               className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 font-mono"
                               placeholder="http://localhost:5000"
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-slate-400 uppercase">API Key</label>
                          <div className="relative group">
                             <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                             <input 
                               type="password" 
                               value={config.apiKey}
                               onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                               className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 font-mono"
                               placeholder="sk-..."
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-xs font-mono font-bold text-slate-400 uppercase">Context ID</label>
                          <div className="relative group">
                             <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                             <input 
                               type="text" 
                               value={config.contextId}
                               onChange={(e) => setConfig({...config, contextId: e.target.value})}
                               className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700 font-mono"
                               placeholder="ctx_default"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                       <button 
                         onClick={() => setConfig({url: DEFAULT_API_URL, apiKey: '', contextId: DEFAULT_CONTEXT_ID})}
                         className="text-sm text-slate-500 hover:text-white transition-colors"
                       >
                         Reset
                       </button>
                       <button 
                         onClick={handleSaveConfig}
                         disabled={isLoading}
                         className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all disabled:opacity-50 disabled:shadow-none"
                       >
                         {isLoading ? 'Verifying...' : 'Save Configuration'}
                       </button>
                    </div>
                 </div>
              </div>
            )}
         </div>
      </main>
    </div>
  );
};

export default App;