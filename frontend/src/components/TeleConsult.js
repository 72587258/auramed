import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPhoneOff, FiMic, FiMicOff, FiVideo, FiVideoOff, FiActivity, FiCpu, FiAlertTriangle } from 'react-icons/fi';

const TeleConsult = () => {
  const navigate = useNavigate();
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Fake AI Diagnostic Text Stream
  const rawDataLogs = [
    "Initializing Neural Handshake...",
    "Vitals Sync: HR 72 BPM | O2 98%",
    "Audio Intake: Nominal",
    "Running Sentiment Matrix...",
    "Querying Global Disease Database...",
    "Probability Match: 92% Fatigue",
    "Suggesting Cortisol Test..."
  ];
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    let timer, logTimer;
    if (callActive) {
      timer = setInterval(() => setCallDuration(p => p + 1), 1000);
      logTimer = setInterval(() => {
        setLogIndex(p => (p + 1 < rawDataLogs.length ? p + 1 : p));
      }, 3000);
    }
    return () => { clearInterval(timer); clearInterval(logTimer); };
  }, [callActive]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      {/* 🖥️ SPLIT SCREEN LAYOUT */}
      <main className="flex-1 w-full h-full flex flex-col md:flex-row p-4 gap-4">
        
        {/* LEFT PANEL: PATIENT (USER) CAMERA SIMULATION */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
            
            {/* Camera Box */}
            <div className="bg-[#0b101e] rounded-[32px] border border-white/5 flex-1 relative overflow-hidden flex items-center justify-center shadow-xl">
                {videoOn ? (
                    <>
                       <div className="absolute inset-0 bg-blue-900/10" />
                       <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest animate-pulse flex items-center gap-2">
                           <div className="w-2 h-2 bg-white rounded-full" /> REC
                       </div>
                       
                       {/* Face Tracking Simulation */}
                       <motion.div 
                          animate={{ x: [-10, 10, -5, 0], y: [-5, 5, -2, 0] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                          className="w-48 h-64 border border-cyan-400/50 border-dashed rounded-xl absolute pointer-events-none" 
                       />
                       <div className="text-cyan-400/30 text-xs font-mono absolute bottom-4 left-4 uppercase tracking-[0.2em]">Live Video Feed<br/>Biometric Overlay Active</div>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <FiVideoOff className="text-2xl text-slate-400" />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Camera Disabled</p>
                    </div>
                )}
            </div>

            {/* Vitals Box */}
            <div className="bg-[#0b101e] rounded-[32px] border border-white/5 h-48 p-6 shadow-xl relative overflow-hidden">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Your Synced Vitals</h3>
                 <div className="flex items-end gap-6 h-full pb-4">
                    <div className="flex flex-col gap-1 w-full">
                       <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold">Heart Rate</p>
                       <p className="text-2xl font-light text-white font-mono flex items-center gap-2">74 <span className="text-[10px] text-slate-500">BPM</span></p>
                       {/* SVG Sparkline */}
                       <svg className="w-full h-8 mt-2" viewBox="0 0 100 20" preserveAspectRatio="none">
                          <polyline points="0,15 20,15 30,5 40,25 50,15 100,15" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinejoin="round" />
                       </svg>
                    </div>
                 </div>
            </div>
        </div>

        {/* RIGHT PANEL: AURA AI NEURAL AVATAR */}
        <div className="w-full md:w-2/3 bg-[#0a101f] rounded-[32px] border border-cyan-500/20 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.05)] flex flex-col pb-24">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
            
            {/* Top Bar */}
            <div className="p-6 flex justify-between items-center relative z-10 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <FiCpu className="text-2xl text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-widest uppercase">Aura Net<span className="text-cyan-400">.</span></h1>
                        <p className="text-xs text-cyan-500 font-mono flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" /> 
                           Quantum Medical Core
                        </p>
                    </div>
                </div>
                <div className="font-mono text-xl text-slate-300 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                    {callActive ? formatTime(callDuration) : "00:00"}
                </div>
            </div>

            {/* AI Waveform Visualization */}
            <div className="flex-1 flex flex-col justify-center items-center relative">
                
                {callActive ? (
                   <>
                     {/* Circular Glow */}
                     <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-96 h-96 bg-cyan-600/20 rounded-full blur-[80px] absolute pointer-events-none"
                     />
                     
                     {/* Vertical Waveform Bars */}
                     <div className="flex items-center gap-2 relative z-10">
                        {[...Array(15)].map((_, i) => (
                           <motion.div 
                               key={i}
                               className="w-2 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full shadow-[0_0_10px_#22d3ee]"
                               animate={{ 
                                   height: [`${Math.random() * 40 + 20}px`, `${Math.random() * 120 + 40}px`, `${Math.random() * 40 + 20}px`] 
                               }}
                               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                           />
                        ))}
                     </div>

                     <p className="text-cyan-400/80 font-mono text-sm mt-12 tracking-widest uppercase mb-2">Analyzing Voice Pattern</p>
                     
                     {/* Stream Output */}
                     <div className="h-24 w-full flex flex-col justify-end items-center px-10 relative overflow-hidden">
                        <AnimatePresence mode="popLayout">
                           <motion.p 
                              key={logIndex}
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              className="text-white text-lg font-light text-center"
                           >
                              {rawDataLogs[logIndex]}
                           </motion.p>
                        </AnimatePresence>
                     </div>
                   </>
                ) : (
                    <div className="text-center">
                        <FiActivity className="text-6xl text-slate-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-light text-slate-400 mb-2">Awaiting Connection</h2>
                        <p className="text-slate-600 text-sm">Tap the green button to initiate neural handshake.</p>
                    </div>
                )}
            </div>
            
            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/5">
                <button onClick={() => setMicOn(!micOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/20 text-rose-500 border border-rose-500/50'}`}>
                    {micOn ? <FiMic className="text-xl" /> : <FiMicOff className="text-xl" />}
                </button>
                <button onClick={() => setVideoOn(!videoOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500/20 text-rose-500 border border-rose-500/50'}`}>
                    {videoOn ? <FiVideo className="text-xl" /> : <FiVideoOff className="text-xl" />}
                </button>
                
                <div className="w-[1px] h-8 bg-white/20 mx-2" />
                
                {callActive ? (
                    <button onClick={() => { setCallActive(false); setTimeout(() => navigate("/dashboard"), 1000); }} className="w-16 h-16 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all">
                        <FiPhoneOff className="text-2xl text-white" />
                    </button>
                ) : (
                    <button onClick={() => setCallActive(true)} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(5,150,105,0.5)] transition-all">
                        Connect AI
                    </button>
                )}
            </div>

        </div>

      </main>
    </div>
  );
};

export default TeleConsult;
