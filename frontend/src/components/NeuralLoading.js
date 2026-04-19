import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiShield, FiDatabase, FiActivity, FiZap } from 'react-icons/fi';

const PROTOCOL_LOGS = [
    "[SYSTEM] Initiating Secure Handshake...",
    "[ENCRYPT] Decrypting Bio-Metric Keys...",
    "[PROTOCOL] Establishing Neural Link...",
    "[NETWORK] Syncing with Aura Central Core...",
    "[IDENTITY] Matching DNA Fingerprint...",
    "[ACCESS] Verification in Progress...",
    "[SECURITY] Bypassing Local Firewalls...",
    "[BIO-SYNC] Frequency Match Found: 432Hz",
    "[DATA] Fetching Patient Records Matrix...",
    "[FINALIZE] Opening Quantized Web Portal..."
];

const NeuralLoading = ({ show }) => {
    const [currentLog, setCurrentLog] = useState(0);

    useEffect(() => {
        if (show) {
            const interval = setInterval(() => {
                setCurrentLog(prev => (prev + 1) % PROTOCOL_LOGS.length);
            }, 800);
            return () => clearInterval(interval);
        }
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02050d]/80 backdrop-blur-3xl overflow-hidden"
                >
                    {/* Background Tech Mesh */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,210,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,210,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px]" />
                    </div>

                    <div className="relative flex flex-col items-center max-w-lg w-full px-8">
                        
                        {/* THE CENTRAL NEURAL CORE */}
                        <div className="relative mb-12 group">
                            {/* Outer Rings */}
                            <motion.div 
                                animate={{ rotate: 360 }} 
                                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                className="w-48 h-48 border-2 border-dashed border-cyan-500/20 rounded-full"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }} 
                                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                className="absolute inset-4 border border-cyan-400/10 rounded-full"
                            />
                            <div className="absolute inset-8 rounded-full bg-cyan-500/5 backdrop-blur-xl border border-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-cyan-400 text-5xl"
                                >
                                    <FiCpu className="drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Status Module */}
                        <div className="w-full bg-black/40 border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden text-center">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.5em] mb-4">Neural Authentication</h3>
                            
                            <div className="flex items-center justify-center gap-6 mb-8 text-cyan-500/40">
                                <FiShield className="text-xl" />
                                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: "100%" }} 
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" 
                                     />
                                </div>
                                <FiActivity className="text-xl" />
                            </div>

                            {/* LOG TICKER */}
                            <div className="h-6 overflow-hidden relative">
                                <AnimatePresence mode="wait">
                                    <motion.p 
                                        key={currentLog}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest"
                                    >
                                        {PROTOCOL_LOGS[currentLog]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer Detail */}
                        <div className="mt-8 flex items-center gap-4 text-slate-500 text-[8px] font-black uppercase tracking-[0.3em]">
                            <FiDatabase /> Secure Cluster: B-12
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <FiZap /> Quantum Grade
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NeuralLoading;
