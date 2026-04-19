import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    FiChevronLeft, FiActivity, FiZap, FiCpu, FiPlus, 
    FiTrash2, FiSearch, FiMonitor, FiShield 
} from 'react-icons/fi';

const ZONES = {
    head: { name: "Cranial Logic Core", symptoms: ["Headache", "Dizziness", "Neural Lag"], color: "cyan" },
    chest: { name: "Cardiac Reactor", symptoms: ["Chest pain", "Tachycardia", "Oxygen Drop"], color: "rose" },
    stomach: { name: "Biomedical Processor", symptoms: ["Abdominal pain", "Nausea", "Acid Reflux"], color: "orange" },
    limbs: { name: "Kinetic Actuators", symptoms: ["Joint pain", "Muscle ache", "Motor Lag"], color: "emerald" }
};

export default function SymptomChecker() {
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeZone, setActiveZone] = useState("");
    const [layer, setLayer] = useState("nervous"); // nervous, skeletal, muscular

    const addSymptom = (sym) => {
        if (!symptoms.includes(sym)) setSymptoms([...symptoms, sym]);
    };

    const removeSymptom = (sym) => {
        setSymptoms(symptoms.filter(s => s !== sym));
    };

    const runAnalysis = async () => {
        if (symptoms.length === 0) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/ai/analyze-symptoms", {
                method: "POST",
                headers: { "Content-Type": "application/json", "auth-token": token },
                body: JSON.stringify({ symptoms })
            });
            const data = await res.json();
            navigate('/diagnosis-result', { state: { report: data } });
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    return (
        <div className="flex h-screen bg-[#02050d] text-slate-200 font-sans overflow-hidden py-8 px-8 selection:bg-cyan-500/30">
            
            {/* 🧬 NEURAL BACKGROUND ATMOSPHERE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#06b6d4]/5 font-mono text-[10px] uppercase tracking-tighter leading-none opacity-20">
                {Array.from({length: 100}).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">SCANNING_DATA_NODE_{i}_STATUS_ACTIVE_CHECKING_BIOMETRICS_PROTOCOL_...</div>
                ))}
            </div>

            <main className="max-w-7xl w-full mx-auto flex flex-col h-full bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                
                {/* Header Terminal */}
                <header className="h-24 flex items-center justify-between px-12 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate("/dashboard")} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all shadow-inner">
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Cyber Body Scanner</h1>
                            <p className="text-[10px] text-cyan-500 font-mono tracking-[0.4em] uppercase opacity-70">Model: //Human_Anatomy_v4.2.1</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/5 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                         <div className="relative w-3 h-3">
                             <span className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50" />
                             <span className="absolute inset-0 bg-cyan-500 rounded-full" />
                         </div>
                         <span className="text-[10px] font-black text-cyan-200 tracking-widest uppercase">Live Link Active</span>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden relative">
                    
                    {/* Left Panel: Anatomy Controls & Vitals */}
                    <div className="w-80 border-r border-white/5 p-10 flex flex-col gap-10 bg-black/10">
                         <div>
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Visualization Layer</h3>
                            <div className="space-y-3">
                                {['skeletal', 'muscular', 'nervous'].map(l => (
                                    <button 
                                        key={l}
                                        onClick={() => setLayer(l)}
                                        className={`w-full py-4 rounded-2xl border transition-all uppercase tracking-widest text-[10px] font-black ${layer === l ? 'bg-cyan-600/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-transparent text-slate-500 hover:text-white'}`}
                                    >
                                        {l} Structure
                                    </button>
                                ))}
                            </div>
                         </div>

                         <div className="flex-1">
                             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Live Neuro-Telemetry</h3>
                             <div className="space-y-6">
                                 <div className="space-y-2">
                                     <div className="flex justify-between text-[9px] font-black text-cyan-500 uppercase">
                                         <span>Brain Load</span>
                                         <span>42%</span>
                                     </div>
                                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                         <motion.div animate={{ width: "42%" }} className="h-full bg-cyan-500" />
                                     </div>
                                 </div>
                                 <div className="space-y-2">
                                     <div className="flex justify-between text-[9px] font-black text-rose-500 uppercase">
                                         <span>Cardiac Stress</span>
                                         <span>Low</span>
                                     </div>
                                     <div className="h-8 flex items-end gap-1">
                                         {[...Array(15)].map((_, i) => (
                                             <motion.div 
                                                key={i}
                                                animate={{ height: ["20%", "60%", "20%"] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05 }}
                                                className="w-1 bg-rose-500/40 rounded-full"
                                             />
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* Middle: THE HOLOGRAPHIC SCANNER */}
                    <div className="flex-1 relative bg-black/20 flex items-center justify-center overflow-hidden">
                        
                        {/* THE SCANNING BEAM */}
                        <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.8)] z-20 pointer-events-none flex items-center justify-center"
                        >
                            <span className="px-4 py-1 bg-cyan-500 text-black text-[8px] font-black rounded-full uppercase tracking-widest shadow-2xl">Scanning Protocol Delta-9</span>
                        </motion.div>

                        <div className="relative w-full h-full flex items-center justify-center group">
                            {/* Layer Backgrounds (Simulated with rotating rings and glowing masks) */}
                            <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/10 animate-[spin_20s_linear_infinite]" />
                            <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-cyan-500/5 animate-[spin_30s_linear_infinite_reverse]" />

                            {/* THE BODY INTERACTIVE HUB */}
                            <svg viewBox="0 0 200 500" className="w-[350px] h-[80%] relative z-10 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                {Object.entries(ZONES).map(([key, zone]) => {
                                    let path = "";
                                    if(key === 'head') path = "M 100 20 A 30 30 0 1 1 99.9 20";
                                    if(key === 'chest') path = "M 70 100 Q 100 80 130 100 L 140 180 Q 100 200 60 180 Z";
                                    if(key === 'stomach') path = "M 70 190 Q 100 210 130 190 L 125 280 Q 100 300 75 280 Z";
                                    if(key === 'limbs') path = "M 50 110 Q 20 180 30 250 L 40 250 Q 50 180 60 120 Z M 150 110 Q 180 180 170 250 L 160 250 Q 150 180 140 120 Z";

                                    return (
                                        <motion.path 
                                            key={key}
                                            d={path}
                                            whileHover={{ scale: 1.02 }}
                                            onMouseEnter={() => setActiveZone(key)}
                                            onMouseLeave={() => setActiveZone("")}
                                            className={`cursor-pointer transition-all duration-500 ${activeZone === key ? 'fill-cyan-500/40 stroke-cyan-400' : 'fill-cyan-500/5 stroke-cyan-500/30'}`}
                                            strokeWidth="1"
                                            strokeDasharray="4 2"
                                        />
                                    );
                                })}
                            </svg>

                            {/* Floating Metadata on Hover */}
                            <AnimatePresence>
                                {activeZone && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="absolute left-[65%] top-1/4 bg-black/80 backdrop-blur-2xl border border-cyan-500/30 p-8 rounded-[40px] shadow-2xl w-64 z-30"
                                    >
                                        <h4 className="text-[9px] font-black text-cyan-500 uppercase tracking-widest mb-2">Target Node</h4>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4">{ZONES[activeZone].name}</h2>
                                        <div className="space-y-2 mb-6">
                                            {ZONES[activeZone].symptoms.map(s => (
                                                <button 
                                                    key={s} onClick={() => addSymptom(s)}
                                                    className="w-full text-left px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 text-[10px] font-bold text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-between group"
                                                >
                                                    {s} <FiPlus className="opacity-0 group-hover:opacity-100" />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-500 opacity-60">
                                            <span>STATUS: READY</span>
                                            <span>PROTO: SCAN_A1</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Panel: Diagnosis Log & Action */}
                    <div className="w-96 border-l border-white/5 p-10 flex flex-col bg-black/10">
                         <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Diagnostic Log</h3>
                            <span className="text-[10px] font-mono text-cyan-400">{symptoms.length} Nodes</span>
                         </div>

                         <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar-hidden">
                             <AnimatePresence mode="popLayout">
                                 {symptoms.map(s => (
                                     <motion.div 
                                        key={s}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between group"
                                     >
                                         <span className="text-xs font-bold text-white tracking-wide">{s}</span>
                                         <button 
                                            onClick={() => removeSymptom(s)}
                                            className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center shadow-lg"
                                         >
                                             <FiTrash2 className="text-xs" />
                                         </button>
                                     </motion.div>
                                 ))}
                             </AnimatePresence>

                             {symptoms.length === 0 && (
                                 <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                                     <FiShield className="text-6xl mb-4" />
                                     <p className="text-[10px] uppercase font-black tracking-widest">No Biometrics Mapped</p>
                                 </div>
                             )}
                         </div>

                         <button 
                            disabled={symptoms.length === 0 || loading}
                            onClick={runAnalysis}
                            className={`mt-10 py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-[11px] transition-all relative overflow-hidden group shadow-2xl ${symptoms.length === 0 ? 'bg-white/5 text-slate-600 grayscale' : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]'}`}
                         >
                             {loading ? (
                                 <div className="flex items-center justify-center gap-3">
                                     <FiZap className="animate-spin" /> Analyzing Biological Core...
                                 </div>
                             ) : (
                                 <div className="flex items-center justify-center gap-3">
                                     <FiMonitor /> Initiate AI Diagnosis
                                 </div>
                             )}
                             <motion.div animate={{ left: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity }} className="absolute h-full w-10 bg-white/20 skew-x-12 top-0 pointer-events-none" />
                         </button>
                    </div>

                </div>

            </main>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
}
