import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiChevronLeft, FiFileText, FiUploadCloud, FiActivity, FiSearch, FiFile, 
  FiShield, FiCpu, FiTrendingUp, FiCheckCircle, FiClock, FiZap, FiDatabase, FiLayers
} from "react-icons/fi";

const MedicalVault = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [isScanning, setIsScanning] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    // Neural Scan Animation on Load
    const timer = setTimeout(() => setIsScanning(false), 2000);
    fetchHistory();
    return () => clearTimeout(timer);
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    try {
      const res = await fetch("http://localhost:5000/api/ai/symptom-history", {
        headers: { "auth-token": token },
      });
      const data = await res.json();
      const logs = Array.isArray(data) ? data : [];
      setHistory(logs);
      if (logs.length > 0) setSelectedLog(logs[0]);
    } catch (err) { console.log(err); }
  };

  const deleteReport = async (id) => {
    if(!window.confirm("Delete this clinical log?")) return;
    const token = localStorage.getItem("token");
    try {
        await fetch(`http://localhost:5000/api/ai/symptom-history/${id}`, { 
            method: 'DELETE',
            headers: { "auth-token": token }
        });
        setHistory(prev => prev.filter(p => p._id !== id));
        if (selectedLog?._id === id) setSelectedLog(null);
    } catch (err) { console.log(err); }
  };

  const purgeVault = async () => {
    if(!window.confirm("CRITICAL: Wipe entire Diagnostic Vault? This is irreversible.")) return;
    const token = localStorage.getItem("token");
    try {
        await fetch(`http://localhost:5000/api/ai/purge-symptoms`, {
            method: 'DELETE',
            headers: { "auth-token": token }
        });
        setHistory([]);
        setSelectedLog(null);
    } catch (err) { console.log(err); }
  };

  return (
    <div className="flex h-screen bg-[#050914] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* 🧬 BACKGROUND NEURAL ATMOSPHERE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[180px]" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050914] flex flex-col items-center justify-center"
          >
            <div className="relative">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="w-48 h-48 rounded-full border-t-2 border-l-2 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <FiShield className="text-4xl text-cyan-400 animate-pulse" />
                </div>
            </div>
            <h2 className="mt-8 font-black text-2xl uppercase tracking-[0.3em] text-white">Neural Scan In Progress</h2>
            <div className="mt-4 w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧭 SIDEBAR - Holographic Slim Islet */}
      <aside className="w-24 lg:w-72 flex flex-col bg-black/40 backdrop-blur-3xl border-r border-white/5 z-50 rounded-r-[40px] shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-10">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-3 text-slate-500 hover:text-cyan-400 transition-all group">
             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-all">
                <FiChevronLeft className="text-xl" />
             </div>
             <span className="hidden lg:block font-bold uppercase tracking-wider text-xs">Exit Vault</span>
          </button>
        </div>

        <nav className="flex-1 mt-10 space-y-4 px-6">
          <button 
             onClick={() => setActiveTab('diagnosis')}
             className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all relative overflow-hidden group ${activeTab === 'diagnosis' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'text-slate-500 hover:bg-white/5'}`}
          >
            {activeTab === 'diagnosis' && <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-500 rounded-full" />}
            <FiCpu className={`text-xl ${activeTab === 'diagnosis' ? 'text-cyan-400' : 'group-hover:text-white'}`} />
            <span className="hidden lg:block font-bold uppercase tracking-widest text-[10px]">Quantum Logs</span>
          </button>
          
          <button 
             onClick={() => setActiveTab('prescriptions')}
             className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all relative overflow-hidden group ${activeTab === 'prescriptions' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'text-slate-500 hover:bg-white/5'}`}
          >
            {activeTab === 'prescriptions' && <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-full" />}
            <FiFileText className={`text-xl ${activeTab === 'prescriptions' ? 'text-indigo-400' : 'group-hover:text-white'}`} />
            <span className="hidden lg:block font-bold uppercase tracking-widest text-[10px]">Data Tablets</span>
          </button>

          <button 
             onClick={() => setActiveTab('genome')}
             className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all relative overflow-hidden group ${activeTab === 'genome' ? 'bg-yellow-600/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'text-slate-500 hover:bg-white/5'}`}
          >
            {activeTab === 'genome' && <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-yellow-500 rounded-full" />}
            <FiDatabase className={`text-xl ${activeTab === 'genome' ? 'text-amber-400' : 'group-hover:text-white'}`} />
            <span className="hidden lg:block font-bold uppercase tracking-widest text-[10px]">Registry</span>
          </button>
        </nav>

        <div className="p-6">
            <button 
                onClick={purgeVault}
                className="w-full py-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
                Purge Vault
            </button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
         
         <header className="h-28 flex-shrink-0 flex items-center px-12 justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">Quantum Vault</h1>
                <p className="text-xs text-cyan-500 font-mono tracking-widest opacity-80 uppercase mt-1">Directory: //User/Medical_History_v3.0</p>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-6 py-3 border border-white/5 focus-within:border-cyan-500/50 transition-all w-80">
                  <FiSearch className="text-slate-500" />
                  <input placeholder="SEARCH DATA BLOCKS..." className="bg-transparent border-none outline-none w-full text-xs font-mono text-cyan-100 placeholder-slate-600 uppercase tracking-widest" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative cursor-pointer hover:bg-white/10 transition-all font-mono text-xs text-cyan-400">
                    <FiClock />
                </div>
            </div>
         </header>

         <div className="flex-1 flex overflow-hidden">
            
            {/* List View Column - Holographic Data Matrix */}
            <div className="w-full md:w-[450px] flex-shrink-0 border-r border-white/5 overflow-y-auto px-8 py-8 custom-scrollbar-hidden bg-black/10">
              
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" /> 
                      Recent Telemetry
                  </h3>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{history.length} Blocks</span>
              </div>

              {activeTab === 'diagnosis' ? (
                <div className="space-y-4">
                  {history.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                        <FiCpu className="text-5xl mx-auto mb-4" />
                        <p className="text-xs font-mono uppercase tracking-widest font-black">No Data Logs Found</p>
                    </div>
                  )}
                  
                  {history.map(item => (
                    <motion.div 
                        key={item._id} 
                        whileHover={{ x: 10 }}
                        onClick={() => setSelectedLog(item)}
                        className={`p-6 rounded-[32px] cursor-pointer border transition-all relative overflow-hidden group ${selectedLog?._id === item._id ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      {selectedLog?._id === item._id && (
                          <motion.div layoutId="glow" className="absolute inset-0 bg-cyan-500/5 blur-xl pointer-events-none" />
                      )}
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <h4 className="font-black text-white text-xs uppercase tracking-widest line-clamp-1 group-hover:text-cyan-400 transition-colors">
                            {item.symptoms?.join(" • ") || "BIO-SCAN"}
                        </h4>
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest bg-black/40 px-3 py-1 rounded-lg border border-white/5">
                           {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed opacity-60 font-medium">
                        {item.advice}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                         <div className="h-[2px] flex-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} className="h-full bg-cyan-500" />
                         </div>
                         <FiTrendingUp className="text-xs text-cyan-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : activeTab === 'prescriptions' ? (
                <div className="space-y-6">
                   <div className="border-2 border-dashed border-indigo-500/20 bg-indigo-500/5 rounded-[40px] p-10 text-center cursor-pointer hover:bg-indigo-500/10 transition-all group shadow-inner">
                      <div className="w-20 h-20 bg-black/40 border border-indigo-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 group-hover:shadow-indigo-500/20 transition-all duration-500">
                        <FiUploadCloud className="text-3xl text-indigo-400"/>
                      </div>
                      <h4 className="font-black text-white text-sm uppercase tracking-widest mb-2">Ingest Data Tablet</h4>
                      <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase opacity-60">PDF / JPG / PNG Max 10MB</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="bg-yellow-500/5 border border-yellow-500/20 p-8 rounded-[40px] relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FiZap className="text-6xl" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 mb-4">Biological Protocol</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Initiating real-time genetic deconstruction. The Aura AI is currently decoding 3.2 billion base pairs to identify resilience anomalies.
                      </p>
                   </div>

                   <div className="space-y-4">
                      {["Resilience Marker #A1", "Neural Drift Core", "Cardiac Elasticity"].map(marker => (
                        <div key={marker} className="bg-white/5 border border-white/5 p-5 rounded-3xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                 <FiCheckCircle />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{marker}</span>
                           </div>
                           <span className="text-[8px] font-mono text-yellow-600">STABLE</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* Detail View Column - Neural Analysis Visualizer */}
            <div className="hidden md:block flex-1 overflow-y-auto px-16 py-12 bg-black/5 relative">
                
                {activeTab === 'genome' ? (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col"
                   >
                     <div className="flex items-center justify-between mb-12">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Node: //GEN-X_CORE</span>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">Genome Pulse Index</h2>
                        </div>
                        <button className="px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-[10px] font-black text-yellow-500 uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
                           Upload Raw Sequence
                        </button>
                     </div>

                     <div className="flex-1 flex gap-12">
                        {/* 🧬 THE ANIMATED DNA HELIX */}
                        <div className="w-64 flex flex-col items-center justify-center relative bg-black/20 rounded-[48px] border border-white/5 shadow-inner py-10">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.2)_0%,transparent_70%)]" />
                            
                            <div className="flex flex-col gap-2">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div 
                                      key={i}
                                      animate={{ 
                                        x: [Math.sin(i + 1) * 30, Math.sin(i + 1 + Math.PI) * 30, Math.sin(i + 1) * 30],
                                        opacity: [0.3, 1, 0.3]
                                      }}
                                      transition={{ repeat: Infinity, duration: 3, delay: i * 0.1, ease: "linear" }}
                                      className="flex items-center gap-6"
                                    >
                                       <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]" />
                                       <div className="w-16 h-[1px] bg-yellow-500/20" />
                                       <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                                    </motion.div>
                                ))}
                            </div>

                            <p className="mt-8 text-[9px] font-mono text-yellow-500 uppercase tracking-[0.4em] animate-pulse">Alpha_Helix_Active</p>
                        </div>

                        {/* Bio-Resilience Stats */}
                        <div className="flex-1 flex flex-col gap-8">
                             <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Immunity Shield", val: 92, color: "emerald", icon: <FiShield /> },
                                    { label: "Neural Recovery", val: 78, color: "cyan", icon: <FiCpu /> },
                                    { label: "Metabolic Flow", val: 84, color: "yellow", icon: <FiActivity /> },
                                    { label: "Stress Offset", val: 65, color: "rose", icon: <FiTrendingUp /> }
                                ].map((stat, i) => (
                                    <motion.div 
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white/5 border border-white/5 p-6 rounded-[32px] relative overflow-hidden group"
                                    >
                                        <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 transition-opacity text-4xl text-${stat.color}-400`}>
                                            {stat.icon}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{stat.label}</p>
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-3xl font-black text-white">{stat.val}%</h4>
                                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stat.val}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                    className={`h-full bg-${stat.color}-500 shadow-[0_0_10px_currentColor]`}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                             </div>

                             {/* Real-time Ticker */}
                             <div className="mt-auto bg-black/40 border border-yellow-500/20 rounded-[32px] p-6 relative overflow-hidden">
                                <p className="text-[8px] font-mono text-yellow-500 uppercase tracking-widest mb-2 opacity-60">Real-time Sequence Analysis</p>
                                <div className="h-4 overflow-hidden uppercase font-mono text-[10px] text-yellow-200/40">
                                    <motion.div 
                                      animate={{ y: ["0%", "-100%"] }} 
                                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    >
                                        A-T-C-G-G-C-T-A-C-G-A-T-T... [DECODING NODE_742]<br/>
                                        G-C-T-A-G-G-A-T-C-C-A-T-A... [MATCHING PHENOTYPIC_X]<br/>
                                        T-A-G-C-C-T-A-G-T-A-C-G-T... [CALIBRATING RESILIENCE]
                                    </motion.div>
                                </div>
                             </div>
                        </div>
                     </div>
                   </motion.div>
                ) : selectedLog && activeTab === 'diagnosis' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={selectedLog._id}
                    className="max-w-3xl"
                  >
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                            <FiActivity className="text-4xl text-cyan-400" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Log Entry #TX-{selectedLog._id.slice(-6).toUpperCase()}</span>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">{selectedLog.symptoms?.join(" & ") || "Physical Analysis"}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FiCpu className="text-cyan-400" /> AI Synthesis
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium mb-6">
                                {selectedLog.advice}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-emerald-400 flex items-center gap-1"><FiCheckCircle /> VERIFIED</span>
                                <span className="h-3 w-[1px] bg-white/10" />
                                <span className="text-slate-500">CONFIDENCE: 94.2%</span>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 backdrop-blur-3xl shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-[40px] animate-pulse" />
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-3">
                                <FiTrendingUp className="text-indigo-400" /> Predicted Pathology
                            </h3>
                            <div className="space-y-6 relative z-10">
                                {selectedLog.possibleDiseases?.map((d, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                            <span className="text-white">{d.name}</span>
                                            <span className="text-indigo-400">{d.probability}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${d.probability}%` }}
                                                transition={{ duration: 1, delay: 0.2 * i }}
                                                className={`h-full ${d.severity === 'High' ? 'bg-rose-500' : d.severity === 'Medium' ? 'bg-orange-500' : 'bg-cyan-500'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gradient-to-r from-indigo-600/10 to-transparent border-l-4 border-indigo-500 rounded-r-3xl">
                        <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Neural Warning</p>
                        <p className="text-xs text-indigo-300/60 leading-relaxed italic">
                            "This analysis is powered by Aura AI Medical Core. All findings should be cross-referenced with biological experts at Holographic Tele-Consult."
                        </p>
                    </div>

                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-20 group">
                    <div className="relative mb-10">
                        <FiCpu className="text-[120px] text-slate-400 group-hover:text-cyan-400 transition-colors duration-700" />
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute -inset-10 border border-dashed border-white/20 rounded-full" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-400 uppercase tracking-[0.2em]">Ready to Access</h3>
                    <p className="text-sm text-slate-500 mt-4 leading-relaxed font-medium">Select a digital telemetry block from the encrypted directory to initiate full-scale holographic analysis.</p>
                  </div>
                )}
            </div>

         </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default MedicalVault;
