import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    FiChevronLeft, FiAward, FiZap, FiTarget, 
    FiShield, FiTrendingUp, FiCpu, FiStar, FiHexagon 
} from 'react-icons/fi';

export default function BioAchievements() {
    const navigate = useNavigate();
    
    // Mock Achievement Data
    const achievements = [
        { id: 1, title: "Neural Sync Master", desc: "Maintain 95%+ Bio-Sync for 7 days.", progress: 85, icon: <FiCpu />, rank: "S", status: "In-Progress" },
        { id: 2, title: "Molecular Guard", desc: "Logged 50 clean dietary scans.", progress: 100, icon: <FiShield />, rank: "A", status: "Unlocked" },
        { id: 3, title: "Temporal Drifter", desc: "Perfect adherence to Scheduler nodes.", progress: 40, icon: <FiTrendingUp />, rank: "B", status: "In-Progress" },
        { id: 4, title: "Heart-Rate Hero", desc: "Kept RHR in optimal range during stress.", progress: 100, icon: <FiActivity />, rank: "S", status: "Unlocked" },
    ];

    return (
        <div className="flex h-screen bg-[#02050d] text-slate-200 font-sans overflow-hidden py-10 px-10 relative selection:bg-yellow-500/30">
            
            {/* 🌌 GOLDEN NEURAL ATMOSPHERE */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-yellow-500/5 rounded-full blur-[200px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
            </div>

            <main className="max-w-7xl w-full mx-auto flex flex-col h-full bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] relative z-20 overflow-hidden shadow-2xl">
                
                {/* Tactical Header */}
                <header className="h-28 flex items-center justify-between px-12 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate("/dashboard")} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:text-yellow-400 transition-all shadow-inner">
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Bio-Achievements</h1>
                            <p className="text-[10px] text-yellow-500 font-mono tracking-[0.4em] uppercase opacity-70">Aura Health Gamification Core</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Rank</span>
                             <h2 className="text-2xl font-black text-yellow-500">#1,402</h2>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-3xl text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                            <FiAward />
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Left Panel: Power Level Visualization */}
                    <div className="w-[450px] border-r border-white/5 p-12 flex flex-col gap-12 bg-black/10 relative overflow-hidden">
                        <div className="relative flex flex-col items-center">
                            {/* HEXAGONAL POWER GRADE */}
                            <div className="relative w-64 h-64 flex items-center justify-center group">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0 text-yellow-500/20">
                                    <FiHexagon className="w-full h-full stroke-[0.5]" />
                                </motion.div>
                                <div className="absolute inset-10 rounded-full border border-yellow-500/10 animate-pulse" />
                                <div className="text-center relative z-10 transition-transform group-hover:scale-110 duration-500">
                                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-2 block">Current Grade</span>
                                    <h2 className="text-9xl font-black text-white italic drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">S</h2>
                                    <span className="text-xs font-mono text-slate-500 tracking-widest mt-2 block">PROTOTYPE_ELITE</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                <FiZap className="text-yellow-400" /> Bio-Stat Matrix
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Vitality", val: 92 },
                                    { label: "Neural Clarity", val: 78 },
                                    { label: "Cellular Recovery", val: 85 }
                                ].map(s => (
                                    <div key={s.label} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                            <span>{s.label}</span>
                                            <span>{s.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Achievement Grid */}
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Temporal Milestones</h3>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20">Unlocked: 12</span>
                                <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">Locked: 24</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {achievements.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    className={`p-6 rounded-[32px] border transition-all relative overflow-hidden group ${item.status === 'Unlocked' ? 'bg-yellow-500/5 border-yellow-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex gap-6 relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-2xl border transition-all ${item.status === 'Unlocked' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`font-black text-sm uppercase tracking-widest ${item.status === 'Unlocked' ? 'text-white' : 'text-slate-500'}`}>{item.title}</h4>
                                                <span className={`text-[10px] font-black italic ${item.status === 'Unlocked' ? 'text-yellow-400' : 'text-slate-700'}`}>{item.rank} RANK</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">{item.desc}</p>
                                            
                                            <div className="mt-4 flex items-center gap-3">
                                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} className={`h-full ${item.status === 'Unlocked' ? 'bg-yellow-500' : 'bg-slate-700'}`} />
                                                </div>
                                                <span className="text-[9px] font-mono font-black text-slate-600">{item.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {item.status === 'Unlocked' && (
                                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <FiStar className="text-yellow-500 fill-yellow-500 animate-spin-slow" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-gradient-to-r from-indigo-900/10 to-transparent border-l-4 border-indigo-500 rounded-r-3xl">
                            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <FiCpu /> AI Synchronization Hint
                            </h3>
                            <p className="text-[11px] text-indigo-200/60 leading-relaxed font-medium">
                                "Unlock the **'Quantum Healer'** badge by completing 3 consecutive days of error-free Bio-Sync data logging. This will boost your Neural Clarity stat by +15%."
                            </p>
                        </div>
                    </div>
                </div>

            </main>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
                .animate-spin-slow { animation: spin 8s linear infinite; }
            `}} />
        </div>
    );
}

// Small missing component check
function FiActivity(props) {
    return <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
}
