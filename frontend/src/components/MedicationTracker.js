import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiPlus, FiTrash2, FiClock, FiCalendar, FiChevronLeft } from "react-icons/fi";

const MedicationTracker = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "Daily", timeOfDay: "After Breakfast", colorTheme: "green" });
  
  // IoT Smart Box Mock State
  const [takenPills, setTakenPills] = useState({ 'Mon': true, 'Tue': true, 'Wed': false, 'Thu': false, 'Fri': false, 'Sat': false, 'Sun': false });
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    try {
      const res = await fetch("http://localhost:5000/api/medication/fetchall", {
        headers: { "auth-token": token },
      });
      const data = await res.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) { console.log(err); }
  };

  const handleToggle = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/medication/toggle/${id}`, {
        method: "PUT", headers: { "auth-token": token },
      });
      const updated = await res.json();
      setMedicines(medicines.map(m => m._id === id ? updated : m));
    } catch (err) { console.log(err); }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:5000/api/medication/delete/${id}`, {
        method: "DELETE", headers: { "auth-token": token },
      });
      setMedicines(medicines.filter(m => m._id !== id));
    } catch (err) { console.log(err); }
  };

  const handleAdd = async () => {
    if(!form.name || !form.dosage) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/medication/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(data.data) {
        setMedicines([data.data, ...medicines]);
        setShowAddForm(false);
        setForm({ name: "", dosage: "", frequency: "Daily", timeOfDay: "After Breakfast", colorTheme: "green" });
      }
    } catch (err) { console.log(err); }
  };

  const getPillStyle = (theme) => {
    switch(theme) {
      case 'pink': return 'from-pink-400 to-rose-600 shadow-pink-500/40 text-pink-50';
      case 'blue': return 'from-cyan-400 to-blue-600 shadow-blue-500/40 text-blue-50';
      case 'yellow': return 'from-amber-300 to-orange-500 shadow-orange-500/40 text-orange-50';
      default: return 'from-emerald-400 to-teal-600 shadow-emerald-500/40 text-emerald-50'; // green
    }
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden">
      
      {/* 🧭 SIDEBAR - Simplified Version for inner pages */}
      <aside className="w-20 lg:w-64 flex flex-col border-r border-white/5 bg-[#0a101f] z-20">
        <div className="h-24 flex items-center justify-center lg:justify-start lg:px-8">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group">
             <FiChevronLeft className="text-2xl group-hover:-translate-x-1 transition-all" />
             <span className="hidden lg:block font-bold">Back to Hub</span>
          </button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen relative overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-4xl mx-auto w-full space-y-8 pb-32 pt-8">
           
           <header className="flex justify-between items-end border-b border-white/10 pb-6">
             <div>
               <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
                 Your Prescriptions
               </h1>
               <p className="text-slate-400 mt-2">Active medication tracking and notifications.</p>
             </div>
             <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all font-medium flex items-center gap-2">
               <FiPlus /> New Medicine
             </button>
           </header>

           {/* IoT Smart Pillbox UI */}
           <div className="bg-gradient-to-r from-[#0b101e] to-[#111726] border border-cyan-500/20 rounded-[32px] p-8 shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px]" />
               
               <div className="flex justify-between items-center mb-8 relative z-10">
                   <div>
                       <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" /> 
                          Aura SmartBox™
                       </h2>
                       <p className="text-xs text-cyan-400 font-mono mt-1">IoT Hardware Sync: Online // Battery: 88%</p>
                   </div>
                   <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 uppercase">
                       {Object.values(takenPills).filter(v => v).length} / 7 Days Compliant
                   </div>
               </div>

               <div className="grid grid-cols-7 gap-2 md:gap-4 relative z-10">
                   {days.map((day, idx) => (
                       <div 
                           key={idx} 
                           onClick={() => setTakenPills({...takenPills, [day]: !takenPills[day]})}
                           className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${takenPills[day] ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                       >
                           <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4">{day}</p>
                           {/* Compartment Graphic */}
                           <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${takenPills[day] ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-slate-700 bg-slate-800/50'}`}>
                               {takenPills[day] ? (
                                   <motion.div initial={{scale: 0}} animate={{scale: 1}} className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                               ) : (
                                   <div className="grid grid-cols-2 gap-1 opacity-50">
                                       {/* Render tiny pills */}
                                       <div className="w-2 h-4 bg-cyan-400 rounded-full" />
                                       <div className="w-4 h-2 bg-rose-400 rounded-full" />
                                   </div>
                               )}
                           </div>
                           <p className={`text-[10px] uppercase font-bold mt-3 ${takenPills[day] ? 'text-emerald-400' : 'text-slate-600'}`}>
                               {takenPills[day] ? 'Empty' : 'Full'}
                           </p>
                       </div>
                   ))}
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence>
               {medicines.map((med) => (
                 <motion.div 
                   key={med._id} 
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                   className="bg-[#111726]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-6 shadow-xl relative overflow-hidden flex flex-col"
                 >
                   <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                   
                   <div className="flex justify-between items-start mb-6 z-10">
                     {/* 3D Glossy Pill CSS Representation */}
                     <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getPillStyle(med.colorTheme)} shadow-lg flex items-center justify-center relative`}>
                        <div className="absolute top-1 left-2 w-4 h-4 bg-white/40 rounded-full blur-[2px]" />
                        <div className="w-full h-[2px] bg-black/20 absolute top-1/2 rotate-45" />
                     </div>
                     
                     <div className="flex items-center gap-3 bg-[#0a101f] px-3 py-1.5 rounded-full border border-white/5">
                        <span className="text-xs font-semibold text-slate-300">Set Alert</span>
                        <div onClick={() => handleToggle(med._id)} className={`w-10 h-5 rounded-full relative cursor-pointer outline-none transition-colors ${med.reminderEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                           <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${med.reminderEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                     </div>
                   </div>

                   <div className="z-10">
                     <h3 className="text-xl font-bold text-white tracking-tight">{med.name}</h3>
                     <p className="text-indigo-400 font-medium text-sm mt-1">{med.dosage}</p>
                   </div>

                   <div className="mt-6 flex flex-col gap-2 z-10">
                     <div className="flex items-center gap-3 text-slate-400 text-sm bg-black/20 px-4 py-2.5 rounded-xl border border-white/5">
                       <FiClock className="text-indigo-400" /> {med.frequency} • {med.timeOfDay}
                     </div>
                   </div>

                   <button onClick={() => handleDelete(med._id)} className="absolute bottom-6 right-6 text-slate-600 hover:text-rose-400 transition-colors z-10">
                     <FiTrash2 size={18} />
                   </button>
                    
                   <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${getPillStyle(med.colorTheme)} opacity-50`} />
                 </motion.div>
               ))}
             </AnimatePresence>

             {medicines.length === 0 && (
               <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-3xl mt-4">
                 <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                   <FiCalendar className="text-3xl text-indigo-400" />
                 </div>
                 <h3 className="text-xl text-white font-medium mb-2">No Active Records</h3>
                 <p className="text-slate-500">Tap "New Medicine" to start tracking your doses.</p>
               </div>
             )}
           </div>

         </div>

         {/* ADD MODAL */}
         <AnimatePresence>
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111726] border border-white/10 rounded-[32px] p-8 w-full max-w-lg shadow-2xl relative">
                <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">✕</button>
                <h3 className="text-2xl font-bold text-white mb-6">New Medication Rx</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 uppercase tracking-wider">Formula Name</label>
                    <input autoFocus placeholder="e.g. Lisinopril" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#0a101f] border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-2 uppercase tracking-wider">Dosage Specifications</label>
                    <input placeholder="e.g. 10mg Capsule" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} className="w-full bg-[#0a101f] border border-white/5 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 block mb-2 uppercase tracking-wider">Frequency</label>
                      <select value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} className="w-full bg-[#0a101f] border border-white/5 rounded-xl px-4 py-3 outline-none text-white">
                        <option>Daily</option>
                        <option>Twice a day</option>
                        <option>Weekly</option>
                        <option>As Needed</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 block mb-2 uppercase tracking-wider">Schedule</label>
                      <select value={form.timeOfDay} onChange={e => setForm({...form, timeOfDay: e.target.value})} className="w-full bg-[#0a101f] border border-white/5 rounded-xl px-4 py-3 outline-none text-white">
                        <option>Morning</option>
                        <option>After Breakfast</option>
                        <option>Before Bed</option>
                        <option>Anytime</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                     <label className="text-xs text-slate-400 block mb-3 uppercase tracking-wider">Select Pill Color Theme</label>
                     <div className="flex gap-3">
                        {['green', 'blue', 'pink', 'yellow'].map(c => (
                          <div 
                            key={c} onClick={() => setForm({...form, colorTheme: c})}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${form.colorTheme === c ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'} bg-gradient-to-br ${getPillStyle(c)}`}
                          />
                        ))}
                     </div>
                  </div>

                  <button onClick={handleAdd} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-4 font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    Save to Vault
                  </button>
                </div>
              </motion.div>
            </div>
          )}
         </AnimatePresence>

      </main>
    </div>
  );
};

export default MedicationTracker;
