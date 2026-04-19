import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    FiChevronLeft, FiGlobe, FiRadio, FiAlertCircle, 
    FiTrendingUp, FiCrosshair, FiCpu, FiActivity 
} from 'react-icons/fi';

export default function HealthNexus() {
    const navigate = useNavigate();
    const [newsTicker, setNewsTicker] = useState(0);

    const ALERTS = [
        "PROTOCOL X-7: Neural-Link optimization completed in Neo-Tokyo Medical Node.",
        "ADVISORY: Seasonal Influenza sub-variant detected in Sector 4 (South Asia). Bio-Shield Update #22 mandatory.",
        "BREAKTHROUGH: Aurora AI identifies molecular solution for Stage-4 Lung Fibrosis. Clinical Trials pending.",
        "SYSTEM: Global Health Pulse established at 99.8% Sync Strength."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setNewsTicker(prev => (prev + 1) % ALERTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [ALERTS.length]);

    return (
        <div className="flex h-screen bg-[#01040a] text-slate-200 font-sans overflow-hidden py-10 px-10 relative">
            
            {/* 🌌 CINEMATIC DEEP SPACE BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-500/5 rounded-full blur-[200px]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
            </div>

            <main className="max-w-7xl w-full mx-auto flex flex-col h-full bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] relative z-10 overflow-hidden shadow-2xl">
                
                {/* Tactical Header */}
                <header className="h-24 flex items-center justify-between px-12 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate("/dashboard")} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all shadow-inner">
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Global Nexus</h1>
                            <p className="text-[10px] text-emerald-500 font-mono tracking-[0.4em] uppercase opacity-70">Aura Health Surveillance Network</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-[10px]">
                        <div className="flex flex-col items-end">
                            <span className="text-slate-500 uppercase">System Uptime</span>
                            <span className="text-emerald-400 font-black">99.9997%</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10" />
                        <div className="flex flex-col items-end">
                            <span className="text-slate-500 uppercase">Nexus Nodes</span>
                            <span className="text-emerald-400 font-black">1.2B Active</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Left: Global Feed & Localized Stats */}
                    <div className="w-96 border-r border-white/5 p-10 flex flex-col gap-8 bg-black/10">
                        <div>
                           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                               <FiRadio className="text-emerald-400 animate-pulse" /> Live Telemetry Feed
                           </h3>
                           <div className="space-y-4">
                               <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-3xl relative overflow-hidden group">
                                   <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                                   <p className="text-[11px] text-emerald-100 font-medium leading-relaxed opacity-80">
                                       Searching for anomalies in biological data streams... <span className="text-emerald-400">0 Alerts Found</span>
                                   </p>
                               </div>
                               <div className="bg-white/5 border border-white/5 p-5 rounded-3xl opacity-40">
                                   <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500">Decrypting Node_42... [DONE]</p>
                               </div>
                           </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Regional Vitality Score</h3>
                            <div className="space-y-6">
                                {[
                                    { label: "North America", val: 94, color: "emerald" },
                                    { label: "European Union", val: 91, color: "emerald" },
                                    { label: "Asia-Pacific", val: 88, color: "orange" },
                                    { label: "Global South", val: 76, color: "rose" }
                                ].map(reg => (
                                    <div key={reg.label} className="space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase font-black tracking-wider">
                                            <span className="text-slate-400">{reg.label}</span>
                                            <span className={`text-${reg.color}-400`}>{reg.val}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${reg.val}%` }} className={`h-full bg-${reg.color}-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle: THE HOLOGRAPHIC GLOBE */}
                    <div className="flex-1 relative flex flex-col items-center justify-center bg-black/5">
                        <div className="relative group cursor-crosshair">
                            {/* SVG Rotating Globe Illusion */}
                            <svg width="600" height="600" viewBox="0 0 100 100" className="drop-shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                                <defs>
                                    <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="#064e3b" stopOpacity="0.4" />
                                    </radialGradient>
                                </defs>
                                <circle cx="50" cy="50" r="48" fill="url(#globeGrad)" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2 1" />
                                
                                {/* Grid Lines Animation */}
                                <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }}>
                                    {[...Array(12)].map((_, i) => (
                                        <ellipse key={i} cx="50" cy="50" rx={48 * Math.cos((i * Math.PI) / 6)} ry="48" fill="none" stroke="#10b981" strokeWidth="0.1" strokeOpacity="0.2" />
                                    ))}
                                    {[...Array(8)].map((_, i) => (
                                        <circle key={i} cx="50" cy="50" r={48 * (i / 8)} fill="none" stroke="#10b981" strokeWidth="0.1" strokeOpacity="0.2" />
                                    ))}
                                </motion.g>

                                {/* Mock Data Points */}
                                <motion.g>
                                    {[
                                        { x: 30, y: 40, label: "LND-4" },
                                        { x: 70, y: 55, label: "NYC-1" },
                                        { x: 55, y: 25, label: "MOS-9" },
                                        { x: 40, y: 70, label: "SYD-2" }
                                    ].map((pt, i) => (
                                        <g key={i}>
                                            <motion.circle 
                                                cx={pt.x} cy={pt.y} r="0.8" fill="#10b981"
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                                            />
                                            <text x={pt.x + 2} y={pt.y} fill="#10b981" fontSize="2" fontWeight="900" className="opacity-40">{pt.label}</text>
                                        </g>
                                    ))}
                                </motion.g>
                            </svg>

                            {/* Center Overlay Dashboard */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                 <h2 className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.5em] mb-2">Nexus Core</h2>
                                 <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                                 <p className="mt-4 font-mono text-[8px] text-slate-500 uppercase tracking-widest">Sector: Global_Surveillance_A</p>
                            </div>
                        </div>

                        {/* Bottom News Ticker */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-black/60 border border-white/5 rounded-2xl p-6 backdrop-blur-2xl flex items-center gap-6 shadow-2xl">
                             <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                 <FiRadio className="text-emerald-400 group-hover:animate-ping" />
                             </div>
                             <div className="flex-1 overflow-hidden relative h-6">
                                <AnimatePresence mode="wait">
                                    <motion.p 
                                        key={newsTicker}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis"
                                    >
                                        {ALERTS[newsTicker]}
                                    </motion.p>
                                </AnimatePresence>
                             </div>
                        </div>
                    </div>

                    {/* Right: Tactical Map & Node Status */}
                    <div className="w-80 border-l border-white/5 p-10 flex flex-col gap-10 bg-black/10">
                         <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                <FiCrosshair className="text-emerald-400" /> Active Nodes
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                                        className={`h-1.5 rounded-full ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                         </div>

                         <div className="bg-gradient-to-br from-indigo-900/20 to-transparent p-6 rounded-[32px] border border-white/5 shadow-inner">
                            <FiCpu className="text-2xl text-indigo-400 mb-4" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Processing Load</h4>
                            <p className="text-[11px] text-slate-500 mt-2 font-medium">Global AI capacity at 32% - Ready for mass-scale diagnostic injection.</p>
                         </div>

                         <div className="mt-auto">
                            <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95">
                                Re-Sync Network
                            </button>
                         </div>
                    </div>

                </div>

            </main>

        </div>
    );
}
