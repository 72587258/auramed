import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiChevronLeft, FiCamera, FiUploadCloud, FiCheckCircle, 
    FiMinimize2, FiMaximize2, FiTarget, FiCodepen 
} from "react-icons/fi";
import { FaFireAlt, FaDumbbell, FaBreadSlice, FaHamburger, FaSkull } from "react-icons/fa";

const DietTracker = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [previewImage, setPreviewImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);

    // Mock Macro Data with molecular breakdowns
    const mockMacros = {
        calories: 640,
        protein: 42,
        carbs: 58,
        fats: 22,
        mealType: "High Protein Lunch",
        molecules: ["Peptide", "Glucose", "Lipid", "Vitamin-D"]
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                startAIAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    const startAIAnalysis = () => {
        setIsScanning(true);
        setAnalysisComplete(false);
        setTimeout(() => {
            setIsScanning(false);
            setAnalysisComplete(true);
        }, 4000);
    };

    const resetTracker = () => {
        setPreviewImage(null);
        setAnalysisComplete(false);
    }

    return (
        <div className="flex h-screen bg-[#02050d] text-slate-200 font-sans overflow-hidden py-10 px-10 selection:bg-orange-500/30">
            
            {/* 🍱 MOLECULAR BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="max-w-6xl w-full mx-auto flex flex-col h-full bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] relative overflow-hidden shadow-2xl">
                
                {/* Tactical Header */}
                <header className="h-24 flex items-center justify-between px-12 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate("/dashboard")} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:text-orange-400 transition-all shadow-inner">
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Diet Matrix V2</h1>
                            <p className="text-[10px] text-orange-500 font-mono tracking-[0.4em] uppercase opacity-70">Aura Food-Vision Synthesis Engine</p>
                        </div>
                    </div>
                    
                    <div className="bg-orange-500/5 border border-orange-500/20 px-6 py-2 rounded-full hidden md:block">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest animate-pulse">Scanning Grid: Active</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-12 flex flex-col custom-scrollbar-hidden">
                    
                    {!previewImage ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-12">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="w-56 h-56 border-2 border-dashed border-orange-500/20 rounded-full" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FiTarget className="text-6xl text-orange-400 animate-pulse" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-4">Ingest Data Image</h1>
                            <p className="text-slate-500 mb-12 max-w-sm font-medium leading-relaxed">Prepare for molecular deconstruction. Please upload a high-resolution visual of your substrate.</p>
                            
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-10 py-5 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[12px] shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(234,88,12,0.5)] transition-all flex items-center gap-4"
                            >
                                <FiCamera className="text-xl" /> Capture Substrate
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                        </div>
                    ) : (
                        <div className="flex flex-col xl:flex-row gap-16">
                            
                            {/* Left: THE SCANNING HUB */}
                            <div className="w-full xl:w-[500px] shrink-0">
                                <div className="relative rounded-[48px] overflow-hidden border-2 border-white/5 aspect-square bg-black shadow-2xl">
                                    <img src={previewImage} alt="Substrate" className="w-full h-full object-cover opacity-60" />
                                    
                                    {/* TARGETING RETICLE OVERLAY */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-orange-500/50 rounded-tl-3xl" />
                                        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-orange-500/50 rounded-tr-3xl" />
                                        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-orange-500/50 rounded-bl-3xl" />
                                        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-orange-500/50 rounded-br-3xl" />
                                        
                                        <FiTarget className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-orange-500/20" />
                                    </div>

                                    {isScanning && (
                                        <>
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                                            {/* MOLECULAR SWARMS ANIMATION */}
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div 
                                                    key={i}
                                                    initial={{ opacity: 0, x: Math.random() * 500, y: Math.random() * 500 }}
                                                    animate={{ opacity: [0, 1, 0], x: Math.random() * 500, y: Math.random() * 500, scale: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                                    className="absolute w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]"
                                                />
                                            ))}
                                            <motion.div 
                                                animate={{ top: ["0%", "100%", "0%"] }} 
                                                transition={{ duration: 2.5, ease: "linear", repeat: Infinity }}
                                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_40px_#f97316] z-20"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <FiCodepen className="text-6xl text-orange-400 animate-spin mb-6" />
                                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.5em] bg-black/60 px-6 py-2 rounded-full border border-orange-500/30 backdrop-blur-md">Deconstructing Molecular Grid...</span>
                                            </div>
                                        </>
                                    )}

                                    {analysisComplete && (
                                        <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-2xl p-6 rounded-[32px] border border-emerald-500/30 flex items-center gap-6 shadow-2xl">
                                            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/20">
                                                <FiCheckCircle />
                                            </div>
                                            <div>
                                                <p className="font-black text-white uppercase tracking-widest text-[12px]">Structure Identified</p>
                                                <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest mt-1">{mockMacros.mealType}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {analysisComplete && (
                                     <button onClick={resetTracker} className="mt-8 w-full py-5 rounded-[28px] border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg">
                                         Initialize New Scan
                                     </button>
                                )}
                            </div>

                            {/* Right: MOLECULAR BREAKDOWN MATRIX */}
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    {analysisComplete ? (
                                        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Nutritional Matrix</h3>
                                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Macro Synthesis</h2>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Confidence</span>
                                                    <span className="text-xl font-mono font-black text-white">99.2%</span>
                                                </div>
                                            </div>

                                            {/* The Big Calorie Engine */}
                                            <div className="bg-gradient-to-br from-[#1c1c1c] to-black p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden group">
                                                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-20 transition-opacity">
                                                    <FaFireAlt className="text-[180px] text-orange-600" />
                                                </div>
                                                <div className="relative z-10 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Total Energy Load</p>
                                                        <h4 className="text-8xl font-black text-white tracking-widest">{mockMacros.calories}<span className="text-xl text-slate-600 ml-2 uppercase">KCal</span></h4>
                                                    </div>
                                                    <div className="h-24 w-[2px] bg-white/5 mx-8" />
                                                    <div className="text-right">
                                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-2">Daily Threshold</p>
                                                        <p className="text-2xl font-black text-orange-400">28.4% Used</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Molecular Clusters */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
                                                    <FaDumbbell className="absolute -right-4 -bottom-4 text-6xl text-blue-500/10" />
                                                    <p className="text-blue-400 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Protein Influx
                                                    </p>
                                                    <h5 className="text-3xl font-black text-white">{mockMacros.protein}g</h5>
                                                    <div className="mt-6 flex gap-1">
                                                        {[...Array(12)].map((_, i) => (
                                                            <div key={i} className={`h-1 flex-1 rounded-full ${i < 8 ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/10'}`} />
                                                        ))}
                                                    </div>
                                                </motion.div>

                                                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
                                                    <FaBreadSlice className="absolute -right-4 -bottom-4 text-6xl text-yellow-500/10" />
                                                    <p className="text-yellow-400 font-black uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" /> Glycemic Load
                                                    </p>
                                                    <h5 className="text-3xl font-black text-white">{mockMacros.carbs}g</h5>
                                                    <div className="mt-6 flex gap-1">
                                                        {[...Array(12)].map((_, i) => (
                                                            <div key={i} className={`h-1 flex-1 rounded-full ${i < 6 ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-white/10'}`} />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Molecule Ticker */}
                                            <div className="bg-orange-500/5 border-l-4 border-orange-500 p-8 rounded-r-[40px]">
                                                <h3 className="text-[12px] font-black text-orange-400 uppercase tracking-widest mb-4">Detected Molecules</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {mockMacros.molecules.map(m => (
                                                        <span key={m} className="px-4 py-2 bg-black/40 border border-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{m}_DATA_BLOCK</span>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 group">
                                            <FiCodepen className="text-8xl mb-8 group-hover:text-orange-400 transition-colors duration-700" />
                                            <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Biological Feed Empty</p>
                                            <div className="mt-8 flex gap-4">
                                                <div className="w-32 h-1 bg-white/5 rounded-full" />
                                                <div className="w-16 h-1 bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    )}
                </div>

            </main>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
};

export default DietTracker;
