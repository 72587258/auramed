import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiWatch, FiSmartphone, FiCheckCircle } from "react-icons/fi";
import { FaBluetoothB } from "react-icons/fa";

const MOCK_DEVICES = [
    { id: "AURA-7", name: "AuraBand Pro", type: "smartband", icon: <FiWatch /> },
    { id: "AW-S9", name: "Apple Watch Series 9", type: "smartwatch", icon: <FiWatch /> },
    { id: "WHP-4", name: "WHOOP 4.0", type: "fitness", icon: <FiSmartphone /> }
];

const DeviceSync = () => {
    const navigate = useNavigate();
    const [scannedDevices, setScannedDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(true);
    const [connectedDevice, setConnectedDevice] = useState(null);

    useEffect(() => {
        // Sequentially reveal devices to act purely as a simulation
        if (!isScanning) return;
        
        const t1 = setTimeout(() => setScannedDevices(prev => [...prev, MOCK_DEVICES[0]]), 1500);
        const t2 = setTimeout(() => setScannedDevices(prev => [...prev, MOCK_DEVICES[1]]), 3000);
        const t3 = setTimeout(() => {
            setScannedDevices(prev => [...prev, MOCK_DEVICES[2]]);
            setIsScanning(false);
        }, 4500);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [isScanning]);

    const handleConnect = (dev) => {
        setConnectedDevice(dev.id);
        setTimeout(() => navigate('/dashboard'), 2000);
    };

    return (
        <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden py-10 selection:bg-indigo-500">
            <main className="max-w-4xl w-full mx-auto flex flex-col h-full bg-[#0a101f] border border-white/5 rounded-[40px] relative overflow-hidden shadow-2xl">
                
                {/* Header */}
                <header className="flex justify-between items-center p-8 z-20 relative bg-[#0a101f]">
                     <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all">
                        <FiChevronLeft className="text-xl" />
                     </button>
                     <h2 className="font-bold text-lg tracking-widest uppercase text-slate-400">Wearable Sync</h2>
                     <div className="w-10 h-10 flex items-center justify-center text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
                         <FaBluetoothB />
                     </div>
                </header>

                <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden">
                    
                    {/* Left: Radar Scanning Simulator */}
                    <div className="flex-1 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/5 p-10 min-h-[400px]">
                        <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl top-0 pointer-events-none" />
                        
                        <div className="relative flex items-center justify-center w-64 h-64">
                            {/* Inner Dot */}
                            <div className="w-8 h-8 bg-blue-500 rounded-full z-10 shadow-[0_0_20px_#3b82f6]" />
                            
                            {/* Pulsing Radar Rings */}
                            {isScanning && (
                                <>
                                    <motion.div animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} className="absolute w-full h-full border-2 border-blue-500 rounded-full" />
                                    <motion.div animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeOut" }} className="absolute w-full h-full border-2 border-blue-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2, delay: 1.2, repeat: Infinity, ease: "easeOut" }} className="absolute w-full h-full border-2 border-blue-300 rounded-full" />
                                </>
                            )}

                            {!isScanning && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-64 h-64 border-2 border-slate-700 border-dashed rounded-full" />
                            )}
                        </div>

                        <div className="absolute bottom-10 left-0 right-0 text-center font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
                             {isScanning ? "Scanning Local Frequencies..." : "Scan Complete"}
                        </div>
                    </div>

                    {/* Right: Found Devices List */}
                    <div className="w-full md:w-96 bg-[#111726]/50 p-8 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-6">Discovered Devices</h3>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar-hidden">
                            <AnimatePresence>
                                {scannedDevices.map(dev => {
                                    const isConnected = connectedDevice === dev.id;
                                    return (
                                        <motion.div 
                                            key={dev.id}
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                            className={`p-4 rounded-2xl border transition-all ${isConnected ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#0a101f] border-white/5 hover:border-blue-500/30'}`}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                                                    {dev.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{dev.name}</h4>
                                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{dev.id}</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleConnect(dev)}
                                                disabled={connectedDevice && !isConnected}
                                                className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${isConnected ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}
                                            >
                                                {isConnected ? <span className="flex items-center justify-center gap-2"><FiCheckCircle /> Synced</span> : "Pair Device"}
                                            </button>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>

                            {scannedDevices.length === 0 && (
                                <div className="text-center text-slate-500 py-10">
                                    <FaBluetoothB className="mx-auto text-3xl mb-3 opacity-30" />
                                    Gathering telemetry...
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>

            </main>
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
};

export default DeviceSync;
