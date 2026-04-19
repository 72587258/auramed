import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiUploadCloud, FiCpu, FiActivity, FiShield } from 'react-icons/fi';

const DNAScanner = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Upload, 1: Scanning, 2: Results
  const [scanProgress, setScanProgress] = useState(0);

  const traits = [
    { name: "Caffeine Metabolism",  value: "Fast (CYP1A2)", color: "text-amber-400", bg: "bg-amber-400/10" },
    { name: "Muscle Composition",   value: "Power-Oriented (ACTN3)", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Sleep Circadian",      value: "Morning Lark Gene", color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Lactose Digestion",    value: "Tolerant (LCT)", color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ];

  useEffect(() => {
    if (step === 1) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          clearInterval(interval);
          setScanProgress(100);
          setTimeout(() => setStep(2), 800); // Wait briefly before showing results
        } else {
          setScanProgress(progress);
        }
      }, 300);
    }
  }, [step]);

  const handleUploadClick = () => {
    // Fake file upload dialog delay
    setTimeout(() => {
      setStep(1);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden">
      
      {/* 🧭 SIDEBAR */}
      <aside className="w-20 lg:w-64 flex flex-col border-r border-cyan-500/10 bg-[#0a101f] z-20">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
             <FiChevronLeft className="text-2xl group-hover:-translate-x-1 transition-all" />
             <span className="hidden lg:block font-bold">Back to Hub</span>
          </button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen relative items-center justify-center">
        
        {/* Background Grid & Blur */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* STEP 0: UPLOAD UI */}
          {step === 0 && (
            <motion.div key="upload" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="z-10 text-center relative max-w-lg w-full p-8 border border-cyan-500/20 bg-[#0a101f]/80 backdrop-blur-xl rounded-[40px] shadow-[0_0_50px_rgba(6,182,212,0.1)]">
               <div className="w-24 h-24 mx-auto bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <FiCpu className="text-4xl text-cyan-400" />
               </div>
               <h2 className="text-3xl font-black tracking-widest text-white uppercase mb-2">Genomic Sequencer</h2>
               <p className="text-slate-400 mb-10 text-sm">Upload your raw DNA data file (.txt, .csv) from 23andMe or Ancestry to unlock your biological blueprint via AI.</p>
               
               <button onClick={handleUploadClick} className="w-full relative overflow-hidden group bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                 <FiUploadCloud className="text-xl relative z-10" />
                 <span className="relative z-10 uppercase tracking-widest text-sm">Upload Genome Data</span>
               </button>
            </motion.div>
          )}

          {/* STEP 1: SCANNING ANIMATION */}
          {step === 1 && (
            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 flex flex-col items-center">
              
              {/* Fake DNA Helix CSS Render */}
              <div className="relative w-32 h-64 flex flex-col justify-between items-center perspective-[1000px] mb-12">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-full flex justify-between items-center relative animate-[spin_4s_linear_infinite]" style={{ animationDelay: `-${i * 0.5}s`, transformStyle: 'preserve-3d' }}>
                       <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
                       <div className="h-[2px] bg-gradient-to-r from-cyan-400/50 to-purple-400/50 flex-1 mx-2" />
                       <div className="w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_15px_#c084fc]" />
                    </div>
                 ))}
              </div>

              <h2 className="text-2xl font-light tracking-[0.2em] text-cyan-400 uppercase mb-4 animate-pulse">Running Neural Sequencing</h2>
              
              {/* Progress Bar */}
              <div className="w-80 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${scanProgress}%` }} 
                    className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shadow-[0_0_10px_#22d3ee]"
                 />
              </div>
              <p className="text-slate-500 font-mono mt-4 text-xs">{scanProgress}% / 100% Extracting Nucleotides...</p>

            </motion.div>
          )}

          {/* STEP 2: RESULTS PANEL */}
          {step === 2 && (
             <motion.div key="results" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-5xl px-8 flex flex-col lg:flex-row gap-8 items-center justify-center">
                
                {/* Left Panel: Glowing Helix Static/Slow Rotate */}
                <div className="lg:w-1/3 flex flex-col items-center">
                  <div className="relative w-24 h-96 flex flex-col justify-between items-center perspective-[800px] opacity-80">
                     {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-full flex justify-between items-center relative animate-[spin_8s_linear_infinite]" style={{ animationDelay: `-${i * 0.6}s`, transformStyle: 'preserve-3d' }}>
                           <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                           <div className="h-[1px] bg-white/20 flex-1 mx-2" />
                           <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
                        </div>
                     ))}
                  </div>
                </div>

                {/* Right Panel: Data Matrix */}
                <div className="lg:w-2/3 bg-[#0a101f]/90 border border-cyan-500/20 backdrop-blur-md p-8 rounded-[40px] shadow-[0_0_40px_rgba(6,182,212,0.05)] w-full relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500" />
                   
                   <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                           Bio-Profile Match <FiShield className="text-emerald-400" />
                        </h2>
                        <p className="text-slate-400 font-mono mt-2 text-sm">Sequence ID: #{Math.random().toString().slice(2,10)} // Integrity: 99.8%</p>
                      </div>
                      <button onClick={() => setStep(0)} className="text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg font-bold text-slate-300 uppercase tracking-widest border border-white/10">Re-Scan</button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {traits.map((trait, idx) => (
                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="bg-[#111726]/50 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1 h-full ${trait.bg}`} />
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{trait.name}</p>
                            <p className={`text-lg font-bold ${trait.color} flex items-center gap-2`}>
                               <FiActivity className="opacity-50" /> {trait.value}
                            </p>
                         </motion.div>
                      ))}
                   </div>

                   <div className="mt-8 bg-cyan-950/20 border border-cyan-500/20 p-5 rounded-2xl flex gap-4 items-start">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center shrink-0">
                         <span className="text-cyan-400 font-black">AI</span>
                      </div>
                      <div>
                         <p className="text-cyan-300 text-sm font-bold uppercase tracking-widest mb-1">Aura's Genetic Insight</p>
                         <p className="text-slate-300 text-sm leading-relaxed">Based on your genomic markers, you process carbohydrates highly efficiently but may require 15% more Vitamin D synthesis via sunlight compared to the baseline population. Adjusting your diet tracker algorithms accordingly.</p>
                      </div>
                   </div>

                </div>
             </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default DNAScanner;
