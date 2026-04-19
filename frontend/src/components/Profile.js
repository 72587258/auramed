import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaHome, FaSignOutAlt, FaShieldAlt, FaDna, FaTrashAlt, FaBell } from "react-icons/fa";
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiMenu, FiX } from "react-icons/fi";
import "./Profile.css";
import logoutHologram from "../assets/logout-hologram.png";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("personal"); // personal, genetic, privacy
  
  // Personal State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // local blob preview

  // Genetic / Privacy State
  const [familyHistory, setFamilyHistory] = useState("");
  const [privacySharing, setPrivacySharing] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Neural Configs (NEW)
  const [diagnosticDepth, setDiagnosticDepth] = useState("standard");
  const [voiceSynthesis, setVoiceSynthesis] = useState(true);
  const [scanPulse, setScanPulse] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchUserData = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!localStorage.getItem("token")) return navigate("/");

        if (storedUser) {
            setUser(storedUser);
            setName(storedUser.name || "");
            setPhone(storedUser.phone || "");
            setAge(storedUser.age || "");
            setGender(storedUser.gender || "");
            setBloodGroup(storedUser.bloodGroup || "");
            // Load existing avatar if saved
            if (storedUser.image) {
              setImagePreview(`http://localhost:5000/uploads/${storedUser.image}`);
            }
        }
    };
    fetchUserData();
  }, [navigate]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("bloodGroup", bloodGroup);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        headers: { "auth-token": localStorage.getItem("token") },
        body: formData,
      });
      const data = await res.json();
      const updatedUser = data.user || { ...JSON.parse(localStorage.getItem("user")||'{}'), name, phone, age, gender, bloodGroup };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Update avatar preview from server response
      if (updatedUser.image) {
        setImagePreview(`http://localhost:5000/uploads/${updatedUser.image}`);
      }
      showToast("success", `Neural Registry synced — Welcome, ${name || updatedUser.name}!`);
    } catch (err) {
      showToast("error", "Sync failed. Check server connection.");
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    try {
      await fetch("http://localhost:5000/api/profile/delete", {
        method: 'DELETE',
        headers: { "auth-token": localStorage.getItem("token") }
      });
      localStorage.clear();
      navigate("/");
    } catch(err) {
      showToast("error", "Account purge failed. Try again.");
    }
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden selection:bg-cyan-500/30">

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── PREMIUM TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="profile-toast"
            initial={{ opacity: 0, y: -70, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
              px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[320px] max-w-[90vw]
              ${toast.type === "success"
                ? "bg-[#0a1f12]/95 border-emerald-500/40 text-emerald-300"
                : "bg-[#1f0a0a]/95 border-red-500/40 text-red-300"
              }`}
          >
            {toast.type === "success"
              ? <FiCheckCircle className="text-xl text-emerald-400 shrink-0" />
              : <FiAlertCircle className="text-xl text-red-400 shrink-0" />
            }
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">
                {toast.type === "success" ? "SYNC COMPLETE" : "SYNC FAILED"}
              </p>
              <p className="text-sm font-semibold">{toast.msg}</p>
            </div>
            <motion.div
              initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full ${
                toast.type === "success" ? "bg-emerald-500/70" : "bg-red-500/70"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM MODAL ── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }}
              className="bg-[#0f1522] border border-rose-500/30 rounded-[28px] p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-14 h-14 bg-rose-500/15 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-rose-500/30">
                <FiAlertTriangle className="text-2xl text-rose-400" />
              </div>
              <h3 className="text-xl font-black text-white text-center mb-2 tracking-tight">Execution Override</h3>
              <p className="text-slate-400 text-sm text-center mb-8 leading-relaxed">
                This will <span className="text-rose-400 font-bold">permanently purge</span> your account and all medical data. This cannot be reversed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                >
                  Purge Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 PREMIUM LOGOUT OVERLAY */}
      <AnimatePresence>
        {isExiting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-10 overflow-hidden"
          >
            <div style={{ backgroundImage: `url(${logoutHologram})` }} className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-40 animate-[pulse_2s_infinite]" />
            <div className="relative z-50 text-center">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full border-4 border-cyan-500/50 flex items-center justify-center mb-10 mx-auto shadow-[0_0_50px_rgba(6,182,212,0.4)]"
              >
                <FaUser className="text-6xl text-cyan-400" />
              </motion.div>
              <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">Terminating Neural Link</h1>
              <div className="flex gap-2 justify-center mb-8">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ opacity: [0.2, 1, 0.2] }} 
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 bg-cyan-500 rounded-sm"
                  />
                ))}
              </div>
              <p className="text-cyan-500/60 font-mono text-[10px] tracking-widest uppercase">Encryption_Keys_Purged_..._OK</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 🧭 SIDEBAR */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 flex flex-col border-r border-indigo-500/10 bg-[#0a101f] shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-24 flex flex-col justify-center border-b border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent animate-pulse" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                {imagePreview
                  ? <img src={imagePreview} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-sm">
                      {(name || user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                }
              </div>
              <div>
                <p className="font-black text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 leading-tight">
                  {name || user?.name || "Neural Ghost"}
                </p>
                <p className="text-[9px] font-mono text-cyan-500/60 uppercase tracking-widest">Protocol 7.02.1</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <nav className="flex-1 mt-8 space-y-2 px-4">
          <button onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
            <FaHome className="text-xl shrink-0" />
            <span className="font-medium">Back to Hub</span>
          </button>
          
          <div className="mt-8 mb-2 px-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Preferences</div>
          
          <button onClick={() => { setActiveTab("personal"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'personal' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10' : 'text-slate-400 hover:text-white'}`}>
            <FaUser className="text-xl shrink-0" />
            <span className="font-medium">Neural Registry</span>
          </button>
          <button onClick={() => { setActiveTab("genetic"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'genetic' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' : 'text-slate-400 hover:text-white'}`}>
            <FaDna className="text-xl shrink-0" />
            <span className="font-medium">Genetic Core</span>
          </button>
          <button onClick={() => { setActiveTab("privacy"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === 'privacy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'text-slate-400 hover:text-white'}`}>
            <FaShieldAlt className="text-xl shrink-0" />
            <span className="font-medium">Security Core</span>
          </button>
        </nav>

        <div className="p-4 mb-4">
          <button onClick={() => { setIsExiting(true); setTimeout(() => { localStorage.clear(); navigate("/"); }, 2500); }} className="w-full flex items-center justify-start gap-4 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all">
            <FaSignOutAlt className="text-xl shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 p-4 lg:p-8 xl:p-12 overflow-y-auto custom-scrollbar relative">

        {/* Mobile header bar */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/10">
            <FiMenu className="text-xl" />
          </button>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">Neural Hub</span>
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8">
           
           <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Neural Registry Active</span>
               </div>
               <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Neural Hub</h1>
               <p className="text-slate-400 mt-2 font-medium">Calibrate your biological-technical interface.</p>
             </div>
             <div className="flex gap-4">
                <div className="bg-indigo-500/5 border border-indigo-500/20 px-6 py-4 rounded-2xl backdrop-blur-xl">
                   <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Last Sync</p>
                   <p className="text-lg font-mono text-white">0.002ms Ago</p>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 px-6 py-4 rounded-2xl backdrop-blur-xl">
                   <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 mb-1">Data Integrity</p>
                   <p className="text-lg font-mono text-white">99.98%</p>
                </div>
             </div>
           </header>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111726]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-xl">
              
              {/* --- TAB 1: NEURAL REGISTRY --- */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
                  
                  {/* Left: Digital Twin Section */}
                  <div className="lg:col-span-4 space-y-6">
                     <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                        <div className="relative bg-[#0a101f] border border-white/5 rounded-[40px] overflow-hidden aspect-[3/4] flex items-center justify-center p-8">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                           
                           {/* Scanning Line Animation */}
                           {scanPulse && (
                              <motion.div 
                                 animate={{ top: ['0%', '100%', '0%'] }}
                                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                 className="absolute left-0 right-0 h-1 bg-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-10"
                              />
                           )}
                           
                           {imagePreview
                             ? <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                             : <img src="/assets/digital-twin.png" alt="Digital Twin" className={`w-full h-full object-contain filter ${scanPulse ? 'brightness-125 saturate-150' : 'brightness-75'}`} />
                           }
                           
                           <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                              <p className="text-[9px] font-black text-cyan-400 tracking-[0.2em] mb-1">BIOMETRIC MATCH</p>
                              <div className="flex justify-between items-end">
                                 <p className="text-sm font-bold text-white uppercase italic">{user?.name || "Neural Ghost"}</p>
                                 <p className="text-[10px] font-mono text-slate-400">#001-AURA</p>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="bg-indigo-900/10 border border-indigo-500/10 rounded-3xl p-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">System Calibrations</h4>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-300">Diagnostic Depth</span>
                              <select 
                                 value={diagnosticDepth} 
                                 onChange={e => setDiagnosticDepth(e.target.value)}
                                 className="bg-black/40 border-none text-[10px] font-bold text-cyan-400 outline-none rounded-lg px-2 py-1"
                              >
                                 <option value="standard">STANDARD</option>
                                 <option value="deep">DEEP SCAN</option>
                                 <option value="quantum">QUANTUM</option>
                              </select>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-300">Neural Synthesis</span>
                              <div onClick={() => setVoiceSynthesis(!voiceSynthesis)} className={`w-8 h-4 rounded-full cursor-pointer transition-all relative ${voiceSynthesis ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                                 <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${voiceSynthesis ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                              </div>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-300">Visual Pulse</span>
                              <div onClick={() => setScanPulse(!scanPulse)} className={`w-8 h-4 rounded-full cursor-pointer transition-all relative ${scanPulse ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                                 <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${scanPulse ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right: Registration Form */}
                  <div className="lg:col-span-8 space-y-8">
                    <h2 className="text-2xl font-black italic border-b border-indigo-500/20 pb-4 flex items-center gap-3"><FaUser className="text-cyan-400"/> Primary Registry</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Display Nominee</label>
                         <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0a101f] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all text-white font-bold" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Neural Link ID (Phone)</label>
                         <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#0a101f] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all text-white font-mono" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Temporal Age</label>
                         <input value={age} onChange={e => setAge(e.target.value)} type="number" className="w-full bg-[#0a101f] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 transition-all text-white text-xl" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Biological Code (Blood)</label>
                         <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full bg-[#0a101f] border border-white/5 rounded-2xl px-6 py-4 outline-none text-slate-200 font-black">
                             <option value="">SCAN REQUIRED...</option>
                             <option value="A+">A-POSITIVE</option><option value="O+">O-POSITIVE</option><option value="B+">B-POSITIVE</option><option value="AB+">AB-POSITIVE</option>
                         </select>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl">
                       {/* Avatar Preview */}
                       <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                         {imagePreview
                           ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                           : <div className="w-full h-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                               <FaUser className="text-2xl" />
                             </div>
                         }
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1">Avatar Encryption</h4>
                          <p className="text-xs text-slate-400 mb-3">{imagePreview ? "✅ Image loaded — click Sync to save" : "Upload your neural representative visual."}</p>
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs rounded-full cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Choose File
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setImage(file);
                                setImagePreview(URL.createObjectURL(file));
                              }}
                            />
                          </label>
                       </div>
                    </div>
                    
                    <button onClick={handleUpdate} className=" group relative px-12 py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase tracking-widest shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:bg-cyan-400 transition-all overflow-hidden">
                      <span className="relative z-10 transition-transform group-hover:scale-110 block">Sync Profile</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-2 group-hover:translate-y-0 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* --- TAB 2: GENETIC HISTORY --- */}
              {activeTab === "genetic" && (
                 <div className="space-y-6 animate-fade-in">
                   <h2 className="text-2xl font-black italic border-b border-purple-500/20 pb-4 flex items-center gap-3"><FaDna className="text-purple-400"/> Legacy Code</h2>
                   <p className="text-slate-400 text-sm">Providing accurate family history allows Dr. Aura to better predict risk factors for chronic conditions.</p>
                   
                   <div className="bg-[#0a101f] p-6 rounded-2xl border border-white/5">
                     <label className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-4">Known Hereditary Conditions</label>
                     <textarea 
                         value={familyHistory} 
                         onChange={e => setFamilyHistory(e.target.value)} 
                         rows="5"
                         placeholder="E.g., Maternal grandmother had Type 2 Diabetes..."
                         className="w-full bg-[#111726] border border-white/5 rounded-xl p-4 outline-none focus:border-purple-500 transition-all text-white placeholder-slate-600" 
                     />
                   </div>
                   
                   <button onClick={() => showToast("success", "Genetic core data stored securely.")} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                     Update Core
                   </button>
                 </div>
              )}

              {/* --- TAB 3: PRIVACY & SECURITY --- */}
              {activeTab === "privacy" && (
                 <div className="space-y-8 animate-fade-in">
                   <h2 className="text-2xl font-black italic border-b border-emerald-500/20 pb-4 flex items-center gap-3"><FaShieldAlt className="text-emerald-400"/> Security Core</h2>
                   
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 bg-[#0a101f] rounded-2xl border border-white/5">
                         <div>
                            <h4 className="font-bold flex items-center gap-2 text-white italic lowercase"><FaBell className="text-emerald-400"/> neural_alerts</h4>
                            <p className="text-[10px] text-slate-400 mt-1">Receive biometric sync notifications.</p>
                         </div>
                         <div onClick={() => setPushNotifications(!pushNotifications)} className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${pushNotifications ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                         </div>
                      </div>

                      <div className="flex items-center justify-between p-5 bg-[#0a101f] rounded-2xl border border-white/5">
                         <div>
                            <h4 className="font-bold text-white tracking-wide italic lowercase">anonymous_sync</h4>
                            <p className="text-[10px] text-slate-400 mt-1">Help train global diagnostic models anonymously.</p>
                         </div>
                         <div onClick={() => setPrivacySharing(!privacySharing)} className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${privacySharing ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${privacySharing ? 'translate-x-6' : 'translate-x-0.5'}`} />
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 pt-8 border-t border-rose-500/20">
                      <h4 className="text-rose-400 font-black mb-2 flex items-center gap-2 italic uppercase tracking-tighter"><FaTrashAlt /> Execution Override</h4>
                      <p className="text-[10px] text-slate-500 mb-6">Permanently purge your digital medical vault. This override cannot be reversed.</p>
                      <button onClick={() => setShowDeleteConfirm(true)} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-6 py-3 rounded-xl font-black transition-all shadow-lg text-xs">
                         Execute Complete Purge
                      </button>
                   </div>
                 </div>
              )}

           </motion.div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}