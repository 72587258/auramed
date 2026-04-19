import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiMapPin, FiStar, FiPhoneCall } from "react-icons/fi";
import { FaUserMd, FaStethoscope, FaHospitalAlt, FaHeartbeat } from "react-icons/fa";

const MOCK_DOCTORS = [
    { id: 1, name: "Dr. Sarah Jenkins", type: "Cardiologist", rating: 4.9, distance: "1.2 miles away", status: "Available Today", icon: <FaHeartbeat /> },
    { id: 2, name: "Dr. Michael Chen", type: "General Physician", rating: 4.8, distance: "2.5 miles away", status: "Available Tomorrow", icon: <FaStethoscope /> },
    { id: 3, name: "Mercy General Hospital", type: "Urgent Care Facility", rating: 4.6, distance: "3.8 miles away", status: "Open 24/7", icon: <FaHospitalAlt /> },
    { id: 4, name: "Dr. Emily Rostova", type: "Endocrinologist", rating: 4.9, distance: "4.1 miles away", status: "Next Week", icon: <FaUserMd /> }
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DoctorFinder = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        // Simulate network fetch to show skeleton
        const timer = setTimeout(() => {
            setDoctors(MOCK_DOCTORS);
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden py-10 selection:bg-indigo-500">
            <main className="max-w-3xl w-full mx-auto flex flex-col h-full bg-[#0a101f] border border-white/5 rounded-[40px] relative overflow-hidden shadow-2xl">
                
                <header className="p-8 border-b border-white/5 bg-[#111726]/50">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-2">
                        <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all">
                            <FiChevronLeft className="text-xl" />
                        </button>
                        <h1 className="text-2xl font-bold text-white">Local Specialists Network</h1>
                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 pl-14">
                        AI-Suggested doctors based on your recent health trajectory.
                    </motion.p>
                </header>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar-hidden">
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 flex gap-4 items-start mb-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] pointer-events-none" />
                         <div className="text-2xl text-indigo-400 mt-1"><FiMapPin /></div>
                         <div>
                             <h4 className="font-bold text-indigo-100">Location Synced</h4>
                             <p className="text-sm text-indigo-200/70">Showing results verified around your current GPS coordinates. Recommendations are tailored for your latest BMI/Vitals inputs.</p>
                         </div>
                     </motion.div>

                     {isLoading ? (
                         <div className="space-y-4">
                             {[1, 2, 3, 4].map((n) => (
                                 <div key={n} className="bg-[#111726] border border-white/5 rounded-3xl p-6 flex items-center justify-between animate-pulse">
                                     <div className="flex items-center gap-5 w-full">
                                         <div className="w-14 h-14 rounded-2xl bg-white/5 shrink-0" />
                                         <div className="flex-1 space-y-3">
                                             <div className="h-5 bg-white/10 rounded-lg w-1/3" />
                                             <div className="h-4 bg-white/5 rounded-lg w-1/4" />
                                             <div className="h-3 bg-white/5 rounded-lg w-1/5 mt-2" />
                                         </div>
                                     </div>
                                     <div className="flex flex-col items-end gap-3 shrink-0">
                                         <div className="w-24 h-6 bg-white/10 rounded-full" />
                                         <div className="w-10 h-10 rounded-full bg-white/5" />
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ) : (
                         <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
                             {doctors.map(doc => (
                                 <motion.div variants={itemVariants} whileHover={{ scale: 1.02, backgroundColor: "rgba(17, 23, 38, 0.9)" }} key={doc.id} className="bg-[#111726] border border-white/5 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-colors shadow-lg relative overflow-hidden">
                                     <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                     
                                     <div className="flex items-center gap-5 z-10">
                                         <div className="w-14 h-14 rounded-2xl bg-[#0a101f] flex items-center justify-center text-3xl text-indigo-400 shadow-inner group-hover:text-indigo-300 transition-colors border border-transparent group-hover:border-indigo-500/20">
                                             {doc.icon}
                                         </div>
                                         <div>
                                             <h3 className="font-bold text-lg text-white group-hover:text-indigo-50 transition-colors">{doc.name}</h3>
                                             <p className="text-indigo-400 font-medium text-sm">{doc.type}</p>
                                             <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                                                 <span className="flex items-center gap-1"><FiStar className="text-yellow-400" /> {doc.rating}</span>
                                                 <span className="text-white/20">•</span>
                                                 <span>{doc.distance}</span>
                                             </div>
                                         </div>
                                     </div>

                                     <div className="flex flex-col items-end gap-3 text-right z-10">
                                         <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">{doc.status}</span>
                                         <button className="w-10 h-10 rounded-full border border-white/10 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 text-slate-400 shadow-lg hover:shadow-indigo-500/50">
                                             <FiPhoneCall />
                                         </button>
                                     </div>
                                 </motion.div>
                             ))}
                         </motion.div>
                     )}
                </div>
            </main>
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
};

export default DoctorFinder;
