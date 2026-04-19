import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiSmile, FiFrown, FiMeh, FiSun } from "react-icons/fi";

const MentalHealth = () => {
    const navigate = useNavigate();
    const [moodScore, setMoodScore] = useState(7);
    const [energyLevel, setEnergyLevel] = useState(80);
    const [stressLevel, setStressLevel] = useState(40);

    const getMoodIcon = () => {
        if (moodScore >= 8) return <FiSmile className="text-6xl text-emerald-400" />;
        if (moodScore >= 5) return <FiMeh className="text-6xl text-yellow-400" />;
        return <FiFrown className="text-6xl text-rose-400" />;
    };

    const getMoodColor = () => {
        if (moodScore >= 8) return '#10b981'; // emerald
        if (moodScore >= 5) return '#facc15'; // yellow
        return '#f43f5e'; // rose
    };

    const circleCircumference = 2 * Math.PI * 120;
    const strokeDashoffset = circleCircumference - (moodScore / 10) * circleCircumference;

    return (
        <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden py-10 selection:bg-indigo-500">
            <main className="max-w-md w-full mx-auto flex flex-col h-full bg-[#0a101f] border border-white/5 rounded-[40px] relative overflow-hidden shadow-2xl">
                
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-600/20 to-transparent pointer-events-none" />

                {/* Header */}
                <header className="flex justify-between items-center p-8 z-10 relative">
                     <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all">
                        <FiChevronLeft className="text-xl" />
                     </button>
                     <h2 className="font-bold text-lg tracking-widest uppercase text-slate-400">Mental Zen</h2>
                     <div className="w-10 h-10" /> {/* spacer */}
                </header>

                {/* Circular Mood Ring */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    <div className="relative w-72 h-72 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background Track */}
                            <circle 
                                cx="144" cy="144" r="120" 
                                fill="transparent" stroke="#111726" strokeWidth="20" strokeLinecap="round"
                            />
                            {/* Progress Ring */}
                            <motion.circle 
                                initial={{ strokeDashoffset: circleCircumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                cx="144" cy="144" r="120" 
                                fill="transparent" stroke={getMoodColor()} strokeWidth="20" strokeLinecap="round"
                                strokeDasharray={circleCircumference}
                                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }} className="mb-2">
                                {getMoodIcon()}
                            </motion.div>
                            <h3 className="text-4xl font-extrabold text-white">{moodScore}<span className="text-xl text-slate-500">/10</span></h3>
                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Daily Mood</p>
                        </div>
                    </div>

                    <div className="w-full px-12 mt-10 space-y-8">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">
                                <span><FiSun className="inline -mt-1 mr-1" /> Energy Output</span>
                                <span className="text-yellow-400">{energyLevel}%</span>
                            </div>
                            <div className="w-full h-3 bg-[#111726] rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${energyLevel}%` }} transition={{ delay: 0.8 }} className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
                            </div>
                            <input type="range" min="0" max="100" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} className="w-full mt-3 opacity-0 cursor-pointer absolute h-4 -mt-6" />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">
                                <span>Mental Load</span>
                                <span className="text-purple-400">{stressLevel}%</span>
                            </div>
                            <div className="w-full h-3 bg-[#111726] rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${stressLevel}%` }} transition={{ delay: 1.0 }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" />
                            </div>
                            <input type="range" min="0" max="100" value={stressLevel} onChange={(e) => setStressLevel(e.target.value)} className="w-full mt-3 opacity-0 cursor-pointer absolute h-4 -mt-6" />
                        </div>
                    </div>
                </div>

                <div className="p-8 pb-12 w-full z-10 flex flex-col items-center">
                     <p className="text-slate-400 text-sm mb-6 text-center">Adjust sliders or Drag ring (simulated) to log your psychological state.</p>
                     <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest cursor-pointer hover:text-indigo-300 transition-all">+ Add Journal Entry</p>
                </div>
            </main>
        </div>
    );
};

export default MentalHealth;
