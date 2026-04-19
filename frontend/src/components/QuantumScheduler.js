import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiChevronLeft, FiPlus, FiClock, FiActivity, FiZap,
    FiBell, FiCalendar, FiArrowRight, FiCpu, FiCoffee, FiMoon, FiSun
} from "react-icons/fi";

const QuantumScheduler = () => {
    const navigate = useNavigate();
    const [activeHour, setActiveHour] = useState(new Date().getHours());

    // Mock Data for Scheduler Nodes
    const [events, setEvents] = useState([
        { id: 1, hour: 8, title: "Lipitor Admin", type: "med", color: "cyan" },
        { id: 2, hour: 10, title: "Holographic Consult", type: "app", color: "purple" },
        { id: 3, hour: 13, title: "Nutrient Ingestion", type: "meal", color: "teal" },
        { id: 4, hour: 17, title: "Mental Zen Protocol", type: "zen", color: "rose" },
        { id: 5, hour: 22, title: "Deep Sleep Phase", type: "sleep", color: "indigo" },
    ]);

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="flex h-screen bg-[#02050d] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">

            {/* ATMOSPHERIC BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[200px]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px]" />
            </div>

            {/* 🧭 SIDEBAR LINK */}
            <aside className="w-20 lg:w-64 flex flex-col bg-black/40 backdrop-blur-3xl border-r border-white/5 z-20">
                <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b border-white/5">
                    <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50">
                            <FiChevronLeft className="text-xl" />
                        </div>
                        <span className="hidden lg:block font-bold uppercase tracking-[0.2em] text-[10px]">Exit Station</span>
                    </button>
                </div>

                <nav className="p-6 space-y-4">
                    <div className="bg-white/5 p-6 rounded-[28px] border border-white/5 shadow-2xl">
                        <FiCpu className="text-2xl text-cyan-400 mb-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Optimal Sync</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">"Bio-rhythms aligned at 98.4%. No immediate temporal shifts required."</p>
                    </div>
                </nav>
            </aside>

            {/* 📟 MAIN MODULE */}
            <main className="flex-1 flex flex-col relative z-10">

                <header className="h-24 flex-shrink-0 flex items-center px-12 justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                            <FiClock className="text-cyan-500" />
                            Temporal Chronos
                        </h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase mt-1">Status: Master Timeline // Synced</p>
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-95">
                        <FiPlus /> Inject Event
                    </button>
                </header>

                <div className="flex-1 flex items-center justify-center relative p-10 mt-10">

                    {/* 🌌 THE QUANTUM CLOCK RING (3D-ish CSS) */}
                    <div className="relative w-[600px] h-[600px] flex items-center justify-center">

                        {/* Ring Structure */}
                        <div className="absolute inset-0 rounded-full border border-white/5 shadow-[inset_0_0_50px_rgba(99,102,241,0.05)]" />
                        <div className="absolute inset-10 rounded-full border border-white/5" />
                        <div className="absolute inset-20 rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] bg-black/20 backdrop-blur-sm" />

                        {/* Hour Markers */}
                        {hours.map((h) => {
                            const deg = (h * 15) - 90; // 360 / 24 = 15 deg per hour
                            const rad = (deg * Math.PI) / 180;
                            const x = 260 * Math.cos(rad);
                            const y = 260 * Math.sin(rad);
                            const isActive = h === activeHour;
                            const hasEvent = events.find(e => e.hour === h);

                            return (
                                <div
                                    key={h}
                                    style={{ transform: `translate(${x}px, ${y}px)` }}
                                    className="absolute flex flex-col items-center justify-center"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.5 }}
                                        className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-cyan-400 scale-150 shadow-[0_0_15px_#06b6d4]' : 'bg-white/20'}`}
                                    />
                                    {hasEvent && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`absolute h-4 w-4 rounded-full border-2 border-white mix-blend-screen animate-ping opacity-50 ${hasEvent.color === 'cyan' ? 'border-cyan-500' : hasEvent.color === 'rose' ? 'border-rose-500' : 'border-purple-500'}`}
                                        />
                                    )}
                                    <span className={`absolute mt-10 font-mono text-[9px] font-black ${isActive ? 'text-white' : 'text-slate-600'}`}>
                                        {h.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            );
                        })}

                        {/* Central Hologram Core */}
                        <div className="relative z-20 text-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeHour}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="text-6xl font-black text-white tracking-widest mb-4">
                                        {activeHour < 12 ? <FiSun className="inline-block mr-4 text-orange-400" /> : <FiMoon className="inline-block mr-4 text-indigo-400" />}
                                        {activeHour.toString().padStart(2, '0')}<span className="text-cyan-500/50">:</span>00
                                    </div>
                                    <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-6" />

                                    {events.find(e => e.hour === activeHour) ? (
                                        <motion.div
                                            initial={{ y: 20 }} animate={{ y: 0 }}
                                            className="bg-cyan-500/10 border border-cyan-500/30 p-6 rounded-[32px] backdrop-blur-2xl shadow-2xl max-w-xs"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <FiZap className="text-cyan-400" />
                                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Scheduled Event</span>
                                            </div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">
                                                {events.find(e => e.hour === activeHour).title}
                                            </h3>
                                        </motion.div>
                                    ) : (
                                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] font-black">Temporal Void</p>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Rotating Scanner Line */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-r border-cyan-500/20 opacity-30 pointer-events-none"
                        />
                    </div>

                    {/* Event Sidebar List */}
                    <div className="absolute top-0 right-10 bottom-0 w-80 flex flex-col justify-center gap-4 py-20 pointer-events-none">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 pointer-events-auto">Temporal Queue</h3>
                        {events.map(event => (
                            <motion.div
                                key={event.id}
                                whileHover={{ x: -10 }}
                                onMouseEnter={() => setActiveHour(event.hour)}
                                className="bg-white/5 border border-white/5 p-5 rounded-[24px] pointer-events-auto cursor-pointer group hover:bg-white/10 transition-all shadow-xl"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-mono text-cyan-500 font-black">{event.hour.toString().padStart(2, '0')}:00 HRS</span>
                                    <div className={`w-2 h-2 rounded-full ${event.color === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : event.color === 'rose' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-purple-500 shadow-[0_0_10px_#a855f7]'}`} />
                                </div>
                                <h4 className="text-xs font-black text-white uppercase tracking-wider line-clamp-1 group-hover:text-cyan-400">{event.title}</h4>
                            </motion.div>
                        ))}

                        <div className="mt-8 bg-gradient-to-br from-indigo-900/40 to-black p-6 rounded-[32px] border border-white/5 pointer-events-auto relative overflow-hidden">
                            <div className="absolute -right-8 -bottom-8 opacity-10"><FiActivity className="text-[100px]" /></div>
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">AI Prediction</h4>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                Hydration levels dropping. Suggest temporal injection of <span className="text-white">Fluid Intake</span> at 19:00 HRS.
                            </p>
                        </div>
                    </div>

                </div>

            </main>

        </div>
    );
};

export default QuantumScheduler;
