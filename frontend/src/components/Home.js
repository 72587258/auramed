import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiActivity, FiCpu, FiGlobe, FiShield, FiLock, FiStar, 
  FiArrowRight, FiCheckCircle, FiHeart, FiHexagon 
} from 'react-icons/fi';

export default function Home() {
  const navigate = useNavigate();
  const [orbSize, setOrbSize] = useState(1);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple breathing orb effect
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbSize(prev => prev === 1 ? 1.05 : 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getOrbTransform = () => {
    const translateY = scrollY * 0.5; // Parallax
    return `translateY(${translateY}px) scale(${orbSize})`;
  };

  const navItems = [
    { name: 'Symptom AI', path: '/symptom-checker' },
    { name: 'TeleConsult', path: '/teleconsult' },
    { name: 'Genome', path: '/dna-scan' },
    { name: 'Zen Vault', path: '/mental-zen' },
  ];

  return (
    <div className="bg-[#020617] text-slate-200 font-sans min-h-screen overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* 🧭 GLASS NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/70 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <FiActivity className="text-white text-xl" />
              <div className="absolute inset-0 border border-white/20 rounded-xl animate-pulse" />
            </div>
            <span className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase">
              AuraMed
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 border border-white/5 bg-white/5 px-6 py-2 rounded-full backdrop-blur-md">
            {navItems.map((item, idx) => (
              <span key={idx} onClick={() => navigate(item.path)} className="text-xs font-bold text-slate-300 hover:text-cyan-400 uppercase tracking-widest cursor-pointer transition-colors">
                {item.name}
              </span>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="hidden sm:block text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white px-4 py-2 border border-transparent hover:border-white/10 rounded-full transition-all">
              Initialize
            </button>
            <button onClick={() => navigate('/signup')} className="relative group overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <span className="relative z-10">Access System</span>
              <FiLock className="relative z-10" />
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        
        {/* Background Grid & Noise */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        
        {/* Massive Quantum Orb Core (Responsive & Parallax) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen" style={{ transform: getOrbTransform(), transition: 'transform 4s ease-out' }}>
           <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-cyan-600/30 to-indigo-900/30 blur-[60px] md:blur-[120px] animate-[spin_20s_linear_infinite]" />
           <div className="absolute inset-0 rounded-full border border-cyan-500/20 blur-[2px] animate-[spin_10s_linear_infinite_reverse]" />
           <div className="absolute inset-10 rounded-full border border-indigo-500/10 border-dashed animate-[spin_15s_linear_infinite]" />
           {/* Center Glowing Node */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400 rounded-full blur-[80px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
            
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
               <span className="text-xs uppercase tracking-widest font-bold text-cyan-300">Neural Network V2 Online</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }} className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-white drop-shadow-2xl">
               The Future Of <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                  Medical AI
               </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10">
               AuraMed syncs with your biological data to provide real-time genomic analysis, IoT pill-tracking, and quantum-level telehealth diagnostics. Welcome to the ultimate healthcare ecosystem.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-6">
               <button onClick={() => navigate('/signup')} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Launch Platform <FiArrowRight className="text-lg" />
               </button>
               <button onClick={() => navigate('/symptom-checker')} className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 hover:bg-white/10 font-bold uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-3 transition-all backdrop-blur-sm">
                  Run Diagnostics <FiCpu className="text-lg text-cyan-400" />
               </button>
            </motion.div>

            {/* Trusted By Matrix */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 flex items-center justify-center gap-8 md:gap-16 opacity-50 grayscale border-t border-white/10 pt-8 w-full max-w-3xl flex-wrap">
               <span className="font-black text-xl italic tracking-widest uppercase">BioTech</span>
               <span className="font-black text-xl tracking-widest uppercase flex items-center gap-1"><FiGlobe /> Nexus</span>
               <span className="font-black text-xl tracking-tighter uppercase uppercase">GenoSys</span>
               <span className="font-black text-xl tracking-widest uppercase">NeuralTech</span>
            </motion.div>
        </div>
        
        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
      </section>

      {/* 🔮 FEATURES GRID (GLASSMORPHISM) */}
      <section className="py-32 relative">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20 md:mb-32">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest mb-4">Ecosystem Modules</h2>
               <p className="text-cyan-500 font-mono text-sm uppercase tracking-widest">Select a core function to preview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               {/* Card 1 */}
               <motion.div whileHover={{ y: -10, scale: 1.02 }} className="group relative bg-white/5 border border-white/10 p-8 rounded-[32px] overflow-hidden backdrop-blur-lg hover:border-cyan-500/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 group-hover:h-full group-hover:opacity-10 transition-all duration-500" />
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/30 mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                     <FiCpu className="text-3xl text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-3">Genome Scanner</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">Upload your raw DNA files for real-time risk assessment and AI-powered lifestyle adjustments based on your precise genetic code.</p>
                  <button onClick={() => navigate('/dna-scan')} className="text-cyan-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:text-white transition-colors">
                     Initialize <FiArrowRight />
                  </button>
               </motion.div>

               {/* Card 2 */}
               <motion.div whileHover={{ y: -10, scale: 1.02 }} className="group relative bg-white/5 border border-white/10 p-8 rounded-[32px] overflow-hidden backdrop-blur-lg hover:border-indigo-500/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:h-full group-hover:opacity-10 transition-all duration-500" />
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/30 mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                     <FiStar className="text-3xl text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-3">TeleConsult</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">Engage in immediate, holographic video calls with AuraNet. Our AI dynamically analyzes voice frequencies and sentiment patterns.</p>
                  <button onClick={() => navigate('/teleconsult')} className="text-indigo-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:text-white transition-colors">
                     Initialize <FiArrowRight />
                  </button>
               </motion.div>

               {/* Card 3 */}
               <motion.div whileHover={{ y: -10, scale: 1.02 }} className="group relative bg-white/5 border border-white/10 p-8 rounded-[32px] overflow-hidden backdrop-blur-lg hover:border-emerald-500/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] lg:col-span-1 md:col-span-2">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 group-hover:h-full group-hover:opacity-10 transition-all duration-500" />
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/30 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                     <FiHexagon className="text-3xl text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-widest mb-3">Smart Pillbox Grid</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">Sync your pharmaceutical hardware. Our IoT visual matrix allows digital confirmation of pill compartment depletion globally.</p>
                  <button onClick={() => navigate('/medications')} className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:text-white transition-colors">
                     Initialize <FiArrowRight />
                  </button>
               </motion.div>

            </div>
         </div>
      </section>

      {/* 🌐 GLOBAL LIVE MAP (HOLOGRAPHIC DOCTOR FINDER) */}
      <section className="py-24 border-t border-white/5 bg-[#010308] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text */}
            <div>
               <div className="flex items-center gap-3 mb-6">
                  <FiGlobe className="text-3xl text-indigo-400" />
                  <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">Global Network</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black uppercase tracking-widest leading-tight mb-6 text-white">
                  Live Global <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Matchmaking.</span>
               </h2>
               <p className="text-slate-400 text-lg font-light leading-relaxed mb-8">
                  AuraMed instantly pings the nearest verified medical specialists worldwide based on your AI diagnostic results. Physical distance is irrelevant in the quantum age.
               </p>
               
               <div className="space-y-4 mb-10">
                  {['Sub-100ms routing', 'Verified Credentials via Blockchain', 'Instant Telehealth Links'].map((feat, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-300">
                       <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                       <span className="font-bold uppercase tracking-widest text-xs">{feat}</span>
                    </div>
                  ))}
               </div>

               <button onClick={() => navigate('/doctors')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-sm rounded-full flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                  Locate Specialists <FiGlobe className="text-lg" />
               </button>
            </div>

            {/* Right: Holographic Radar Map Simulation */}
            <div className="relative h-[500px] w-full bg-[#0a101f]/50 border border-cyan-500/20 backdrop-blur-md rounded-[40px] shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden flex items-center justify-center">
               
               {/* Radar Sweeper */}
               <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-[40px]" />
               <div className="w-[80%] h-[80%] rounded-full border border-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                  <div className="w-[60%] h-[60%] rounded-full border border-cyan-500/20 flex items-center justify-center relative">
                     <div className="w-[30%] h-[30%] rounded-full border border-cyan-500/30 bg-cyan-500/5 relative">
                        {/* Radar Spinner Line */}
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 origin-center">
                           <div className="w-[200%] h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 left-1/2 -translate-y-1/2 opacity-20" />
                        </motion.div>
                     </div>
                  </div>
               </div>

               {/* Random Pinging Nodes */}
               {[
                 { top: '20%', left: '30%' }, { top: '60%', left: '70%' }, 
                 { top: '70%', left: '25%' }, { top: '35%', left: '80%' }, { top: '45%', left: '50%' }
               ].map((pos, idx) => (
                 <div key={idx} className="absolute" style={pos}>
                    <div className="relative flex items-center justify-center">
                       <span className="w-3 h-3 bg-emerald-400 rounded-full z-10" />
                       <span className="w-8 h-8 bg-emerald-500/30 rounded-full absolute animate-ping" />
                    </div>
                 </div>
               ))}

               {/* Overlaid Data */}
               <div className="absolute top-6 left-6 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Active Nodes</p>
                  <p className="text-2xl text-cyan-400 font-mono font-bold flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> 1,424
                  </p>
               </div>
            </div>

         </div>
      </section>

      {/* 🛡️ MILITARY-GRADE SECURITY BANNER */}
      <section className="py-20 border-t border-b border-white/5 bg-[#020617]">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <FiShield className="text-5xl text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Uncompromised Privacy Core</h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto mb-8 font-light">
               Your biometric data, genomic inputs, and AI chat logs are encrypted at rest and in transit using military-grade protocols. AuraMed is entirely zero-knowledge architecture.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <span className="px-4 py-2 bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest">E2E Encyrption</span>
               <span className="px-4 py-2 bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest">HIPAA Compliant</span>
               <span className="px-4 py-2 bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest">Blockchain Validated</span>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-black text-center border-t border-white/5">
         <div className="flex items-center justify-center gap-2 mb-4">
            <FiActivity className="text-cyan-400 text-xl" />
            <span className="font-black text-xl tracking-widest uppercase text-white">AuraMed</span>
         </div>
         <p className="text-slate-600 text-xs font-bold uppercase tracking-widest max-w-sm mx-auto leading-loose">
            &copy; {new Date().getFullYear()} AuraMed Inc. <br/> The Ultimate Medical AI Engine
         </p>
      </footer>

    </div>
  );
}
