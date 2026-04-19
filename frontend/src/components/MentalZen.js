import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiWind, FiHeart, FiHeadphones } from 'react-icons/fi';

const MentalZen = () => {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [breathState, setBreathState] = useState("Inhale..."); // Inhale..., Hold..., Exhale...

  useEffect(() => {
    let interval;
    if (sessionActive) {
      setBreathState("Inhale...");
      let cycle = 0;
      interval = setInterval(() => {
        cycle = (cycle + 1) % 3;
        if (cycle === 0) setBreathState("Inhale...");
        else if (cycle === 1) setBreathState("Hold...");
        else setBreathState("Exhale...");
      }, 4000); // 4 seconds per phase
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  // Framer Motion constraints based on breath state
  const getOrbSize = () => {
    if (breathState === "Inhale...") return { scale: 1.8, opacity: 1 };
    if (breathState === "Hold...") return { scale: 1.8, opacity: 0.8 };
    return { scale: 1, opacity: 0.5 }; // Exhale
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden relative selection:bg-teal-500/30">
      
      {/* 🧭 SIDEBAR / BACK BUTTON */}
      <div className="absolute top-8 left-8 z-50">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-500 hover:text-white transition-all bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
           <FiChevronLeft className="text-xl" />
           <span className="font-bold uppercase tracking-widest text-xs">Exit Sanctuary</span>
        </button>
      </div>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen relative items-center justify-center">
        
        {/* Dynamic Background Noise */}
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none mix-blend-overlay" />
        
        {/* Ambient Glows */}
        <motion.div 
            animate={{ 
                scale: sessionActive ? [1, 1.2, 1] : 1, 
                opacity: sessionActive ? [0.3, 0.6, 0.3] : 0.3 
            }} 
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/40 rounded-full blur-[120px] pointer-events-none" 
        />
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-teal-950/20 to-transparent pointer-events-none" />

        <div className="z-10 flex flex-col items-center justify-center max-w-2xl w-full text-center px-8 relative h-full">
            
            <AnimatePresence mode="wait">
                {!sessionActive ? (
                    <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-teal-500/10 border border-teal-500/30 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(20,184,166,0.15)]">
                            <FiWind className="text-3xl text-teal-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light text-white tracking-widest uppercase mb-4">Biofeedback Sanctuary</h1>
                        <p className="text-teal-500/70 text-sm md:text-base mb-12 max-w-md font-mono">Neural wave stabilization initiated. Connect your audio interface to begin the AI-regulated breathing cycle.</p>
                        
                        <div className="flex gap-4">
                            <button onClick={() => setSessionActive(true)} className="px-8 py-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/50 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(20,184,166,0.1)] flex items-center gap-3">
                                <FiHeadphones className="text-lg" /> Enter Zen State
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center relative w-full h-full justify-center">
                        
                        {/* The Breathing Orb */}
                        <div className="relative w-64 h-64 flex items-center justify-center mb-20">
                            {/* Inner Core */}
                            <motion.div 
                                className="w-32 h-32 bg-gradient-to-br from-teal-300 to-cyan-500 rounded-full shadow-[0_0_60px_#2dd4bf] absolute z-20"
                                animate={getOrbSize()}
                                transition={{ duration: 4, ease: "easeInOut" }}
                            />
                            {/* Outer Rings */}
                            <motion.div 
                                className="w-48 h-48 border border-teal-500/30 rounded-full absolute z-10"
                                animate={{ scale: getOrbSize().scale * 1.5, opacity: getOrbSize().opacity * 0.5 }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                            />
                            <motion.div 
                                className="w-64 h-64 border border-teal-500/10 dotted rounded-full absolute z-0"
                                animate={{ scale: getOrbSize().scale * 2, opacity: getOrbSize().opacity * 0.2 }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                            />

                            <h2 className="absolute z-30 font-bold text-white tracking-[0.3em] uppercase text-xl mix-blend-overlay drop-shadow-md">
                                {breathState}
                            </h2>
                        </div>

                        {/* Real-time Bio Status */}
                        <div className="absolute bottom-12 w-full max-w-sm px-6 py-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl flex justify-between items-center text-xs tracking-widest font-mono text-slate-400">
                            <div className="flex flex-col items-center">
                                <span className="text-teal-500 mb-1 flex items-center gap-1"><FiHeart /> BPM</span>
                                <span className="text-white text-lg font-bold">62</span>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-indigo-400 mb-1">State</span>
                                <span className="text-white text-lg font-bold">Delta</span>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10" />
                            <div className="flex flex-col items-center">
                                <span className="text-purple-400 mb-1">Stress (AI)</span>
                                <span className="text-white text-lg font-bold">Low</span>
                            </div>
                        </div>

                        <button onClick={() => setSessionActive(false)} className="absolute top-12 right-0 text-slate-500 hover:text-white uppercase text-xs font-bold tracking-widest bg-white/5 px-4 py-2 rounded-full">End Session</button>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
      `}} />
    </div>
  );
};

export default MentalZen;
