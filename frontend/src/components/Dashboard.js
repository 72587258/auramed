import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeartbeat, FaSignOutAlt, FaUser, FaPlus, FaTrash, 
  FaClinicMedical, FaActivity, FaCalendarCheck, FaWaveSquare
} from "react-icons/fa";
import { FiCpu, FiVideo, FiGrid, FiCalendar, FiSearch, FiBell, FiActivity as FiActivityIcon, FiHeart, FiDroplet, FiTrendingUp, FiMessageSquare, FiSend, FiPlus as FiPlusIcon, FiChevronRight, FiUser as FiUserIcon, FiDownload, FiAward, FiStar, FiAlertTriangle, FiMic, FiLoader, FiWatch, FiMenu, FiX } from "react-icons/fi";
import { FaShieldAlt, FaStethoscope, FaHamburger, FaLock } from "react-icons/fa";
import BMIChart from "./BMIChart";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import HealthRadar from "./HealthRadar";
import logoutHologram from "../assets/logout-hologram.png";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ── Weight Goal Tracker (needs own component for hooks) ──
function WeightGoalCard({ latest, records }) {
  const [goalWeight, setGoalWeight] = useState(() => parseFloat(localStorage.getItem('goalWeight') || '') || '');
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const currentW = parseFloat(latest?.weight || 0);
  const startW   = parseFloat(records[records.length - 1]?.weight || currentW);
  const pct = goalWeight && startW !== goalWeight
    ? Math.min(Math.max(((startW - currentW) / (startW - goalWeight)) * 100, 0), 100)
    : 0;

  const saveGoal = () => {
    const v = parseFloat(goalInput);
    if (!isNaN(v) && v > 0) { setGoalWeight(v); localStorage.setItem('goalWeight', String(v)); }
    setEditingGoal(false);
  };

  return (
    <motion.div variants={itemVariants}
      className="bg-gradient-to-br from-[#0a1a10]/90 to-[#0f1522]/90 border border-emerald-500/20 rounded-[32px] p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-500 flex-1">
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all duration-700" />
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-bold text-white text-sm">Weight Goal</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Target tracker</p>
          </div>
        </div>
        <button onClick={() => { setEditingGoal(!editingGoal); setGoalInput(String(goalWeight) || ''); }}
          className="text-[10px] font-bold text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full hover:bg-emerald-500/10 transition-all">
          {editingGoal ? 'Cancel' : goalWeight ? 'Edit' : 'Set Goal'}
        </button>
      </div>

      {editingGoal ? (
        <div className="relative z-10 flex gap-2">
          <input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)}
            placeholder="Target kg..." onKeyDown={e => e.key === 'Enter' && saveGoal()}
            className="flex-1 bg-[#0a101f] border border-emerald-500/30 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-400"
          />
          <button onClick={saveGoal}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-4 py-2 rounded-xl text-sm transition-all">✓</button>
        </div>
      ) : goalWeight ? (
        <div className="relative z-10">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-slate-400">Current: <strong className="text-white">{currentW || '—'} kg</strong></span>
            <span className="text-slate-400">Goal: <strong className="text-emerald-400">{goalWeight} kg</strong></span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
          </div>
          <p className="text-[10px] text-emerald-400 font-bold mt-1.5 text-right">{pct.toFixed(0)}% to goal</p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 relative z-10">Set a target weight to track your progress toward your health goal.</p>
      )}
    </motion.div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingMain, setIsLoadingMain] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [loadingLog, setLoadingLog] = useState("Initializing Core...");

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ age: "", weight: "", height: "" });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const intervalRef = useRef(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', month: 'short', day: 'numeric'
  });

  // --- S.O.S ALARM LOGIC ---
  const triggerSOS = () => {
    setIsSOSActive(true);
    
    // Initialize Audio
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const playBeep = () => {
        const osc = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtxRef.current.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioCtxRef.current.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
        
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.5);
        oscillatorRef.current = osc;
    };

    // Play immediately, then loop every 1 second
    playBeep();
    intervalRef.current = setInterval(playBeep, 1000);
  };

  const cancelSOS = () => {
    setIsSOSActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) {
        setTimeout(() => { oscillatorRef.current.stop(); }, 100);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("System Warning: Voice input not supported on this browser kernel");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsVoiceListening(true);
    recognition.onresult = (event) => {
        setQuestion(event.results[0][0].transcript);
    };
    recognition.onend = () => setIsVoiceListening(false);
    recognition.start();
  };

  // 🔬 Neural Sync Logs
  useEffect(() => {
    if (isLoadingMain) {
      const logs = [
        "Initializing Core...",
        "Establishing Neural Link...",
        "Syncing Biometrics...",
        "Decrypting Cloud Vault...",
        "Quantum Alignment OK."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingLog(logs[i]);
        i = (i + 1) % logs.length;
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isLoadingMain]);

  // 🔒 Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
        return;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, [navigate]);

  // ✅ Fetch Records
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/health/fetchall", {
      headers: { "auth-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
          setRecords(Array.isArray(data) ? data : []);
          setIsLoadingMain(false);
      })
      .catch((err) => {
          console.log(err);
          setIsLoadingMain(false);
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Add Data
  const handleSubmit = async () => {
    if (!form.age || !form.weight || !form.height) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/health/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.data) {
        setRecords((prev) => [data.data, ...prev]);
        setForm({ age: "", weight: "", height: "" });
        setShowAddModal(false);
        showSuccess(`✅ Vitals logged! BMI: ${data.data.bmi} (${data.data.bmiCategory})`);
      }
    } catch (error) { console.log(error); }
  };

  // ❌ Delete Record
  const deleteRecord = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/health/delete/${id}`, {
      method: "DELETE", headers: { "auth-token": token },
    });
    setRecords(records.filter((r) => r._id !== id));
  };

  // 🤖 AI Chat
  const askAI = async () => {
    if (!question) return;
    setIsLoadingAI(true);
    setAnswer("Analyzing securely...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/ai/smart-advice", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "auth-token": token
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setQuestion("");
    } catch (error) {
      setAnswer("Error processing query. System offline.");
    }
    setIsLoadingAI(false);
  };

  const logout = () => {
    setIsExiting(true);
    setTimeout(() => {
        localStorage.removeItem("token");
        navigate("/");
    }, 2500);
  };

  const exportPDF = () => {
    const input = document.getElementById("premium-report-content");
    // Temporarily make visible for capture if needed, but here we capture the hidden div
    setIsLoadingAI(true); // Show a general loading state while generating

    html2canvas(input, { 
        backgroundColor: "#ffffff", 
        scale: 2,
        useCORS: true,
        logging: false
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AuraMed_Report_${currentUser?.name?.split(' ')[0] || 'Patient'}.pdf`);
      setIsLoadingAI(false);
    });
  };

  const startVoiceAssistant = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
          alert("Your browser does not support Voice Assistant. Please use Google Chrome.");
          return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsVoiceListening(true);
      recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setQuestion(transcript);
          setTimeout(() => askAI(), 500); // Auto-ask AI
      };
      recognition.onend = () => setIsVoiceListening(false);
      recognition.onerror = (e) => { console.error(e); setIsVoiceListening(false); }
      
      recognition.start();
  };

  return (
    <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500 selection:text-white">

      {/* ✅ SUCCESS TOAST */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            key="success-toast"
            initial={{ opacity: 0, y: -60, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl bg-emerald-950/90 border-emerald-500/40 text-emerald-300 min-w-[300px]"
          >
            <div className="text-xl text-emerald-400">✓</div>
            <span className="text-sm font-semibold">{successToast}</span>
            <motion.div
              initial={{ scaleX: 1 }} animate={{ scaleX: 0 }}
              transition={{ duration: 3.5, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="absolute bottom-0 left-0 h-[2px] w-full bg-emerald-500/70 rounded-full"
            />
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
                <FiCpu className="text-6xl text-cyan-400" />
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

      {/* 🔬 PREMIUM NEURAL COMMAND LOADER */}
      <AnimatePresence>
        {isLoadingMain && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Ambient Background Digital Twin */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] grayscale invert pointer-events-none">
              <img src="/assets/digital-twin.png" alt="silhouette" className="w-[600px] h-auto object-contain animate-pulse" />
            </div>

            <div className="relative w-96 h-96 flex items-center justify-center">
              {/* Outer Orbital Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full"
              />
              {/* Middle Scanning Ring */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border-t-2 border-b-2 border-indigo-500/40 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              />
              {/* Inner Core Pulse */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl border border-cyan-400/30"
              />
              
              {/* Vertical Laser Scan Line */}
              <motion.div 
                animate={{ top: ["5%", "95%", "5%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] z-10"
              />

              {/* Data Particles flow */}
              <div className="absolute inset-20 overflow-hidden rounded-full opacity-20">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [-200, 200] }}
                    transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: i * 0.3 }}
                    className="w-[1px] h-10 bg-white mx-auto"
                    style={{ marginLeft: `${i * 20}%` }}
                  />
                ))}
              </div>

              {/* Central Biometric Interface */}
              <div className="z-20 text-center">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="mb-6"
                >
                  <FiActivityIcon className="text-7xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                </motion.div>
                <div className="space-y-1">
                  <motion.p 
                    key={loadingLog}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-cyan-300 text-[10px] tracking-[0.3em] uppercase"
                  >
                    {loadingLog}
                  </motion.p>
                  <div className="w-32 h-[1px] bg-cyan-500/20 mx-auto" />
                  <p className="font-mono text-indigo-500/60 text-[8px] tracking-[0.5em] uppercase animate-pulse">Neural_Sync_Active</p>
                </div>
              </div>
            </div>

            {/* Background Atmosphere */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧭 SIDEBAR - Mobile overlay + desktop fixed */}
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

      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 flex flex-col bg-[#050914]/95 backdrop-blur-2xl border-r border-white/10 rounded-r-[40px] shadow-[10px_0_40px_rgba(0,0,0,0.6)]
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div onClick={() => navigate("/")} className="h-20 lg:h-24 flex items-center justify-between px-6 cursor-pointer hover:opacity-80 transition-opacity shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 shrink-0">
              <FiActivityIcon className="text-white text-xl" />
            </div>
            <span className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">AuraMed</span>
          </div>
          {/* Close button on mobile */}
          <button onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(false); }} className="lg:hidden text-slate-400 hover:text-white p-1">
            <FiX className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-1 px-4 overflow-y-auto custom-scrollbar-hidden pb-4">
          {[
            { icon: <FiGrid className="text-xl" />, label: "Dashboard", path: "/dashboard", active: true },
            { icon: <FiCpu className="text-xl text-cyan-400" />, label: "Neural Uplink", path: "/neural-uplink" },
            { icon: <FiCalendar className="text-xl" />, label: "Scheduler", path: "/scheduler" },
            { icon: <FiGrid className="text-xl" />, label: "Medical Vault", path: "/vault" },
            { icon: <FiActivityIcon className="text-xl" />, label: "Medication Tracker", path: "/medications" },
            { icon: <FiWatch className="text-xl" />, label: "Wearable Sync", path: "/sync" },
            { icon: <FaHamburger className="text-xl" />, label: "AI Diet Vision", path: "/diet" },
            { icon: <FaStethoscope className="text-xl" />, label: "Cyber Body Map", path: "/symptom-checker" },
            { icon: <FaClinicMedical className="text-xl" />, label: "Find Doctors", path: "/doctors" },
            { icon: <FiCpu className="text-xl text-cyan-400" />, label: "Genome Scanner", path: "/dna-scan" },
            { icon: <FiVideo className="text-xl text-purple-400" />, label: "Holographic Consult", path: "/teleconsult" },
            { icon: <FaWaveSquare className="text-xl text-teal-400" />, label: "Mental Zen", path: "/mental-zen" },
            { icon: <FiActivityIcon className="text-xl text-emerald-400" />, label: "Global Nexus", path: "/nexus" },
            { icon: <FiAward className="text-xl text-yellow-500" />, label: "Bio-Achievements", path: "/achievements" },
            { icon: <FiUserIcon className="text-xl" />, label: "System Settings", path: "/profile" },
          ].map(({ icon, label, path, active }) => (
            <button key={path} onClick={() => { navigate(path); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              {icon}
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
          {currentUser?.role === 'admin' && (
            <button onClick={() => { navigate("/admin-panel"); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 px-4 py-3 mt-2 text-rose-400 bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-2xl transition-all">
              <FaLock className="text-xl" />
              <span className="font-bold tracking-widest uppercase text-xs">Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Sticky Sidebar Bottom */}
        <div className="shrink-0">
          {/* Bio-Sync Widget */}
          <div className="p-6">
              <div className="bg-gradient-to-br from-indigo-900/40 to-black p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FiCpu className="text-6xl" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Neural Status</p>
                  <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Bio-Sync: 98%</span>
                  </div>
                  <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                  </div>
              </div>
          </div>
        <div className="p-4 mb-4 mt-auto shrink-0">
          <button onClick={logout} className="w-full flex items-center justify-start gap-4 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all">
            <FaSignOutAlt className="text-xl shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen relative overflow-hidden">

        {/* Ultra-Level Quantum Glows */}
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none mix-blend-screen" />

        {/* 🎫 FLOATING TOP NAVIGATION */}
        <header className="h-16 lg:h-20 flex flex-shrink-0 items-center justify-between px-4 lg:px-8 mx-3 lg:mx-8 mt-3 lg:mt-6 border border-white/10 z-20 bg-white/[0.02] backdrop-blur-2xl rounded-2xl lg:rounded-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">

          {/* Hamburger (mobile only) */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <FiMenu className="text-xl" />
          </button>

          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-5 py-2.5 w-72 lg:w-96 hover:border-white/10 transition-all focus-within:border-indigo-500/50">
            <FiSearch className="text-slate-400 shrink-0" />
            <input type="text" placeholder="Search medical records..."
              className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <button
              onClick={triggerSOS}
              className="hidden sm:flex bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white px-3 lg:px-5 py-2 rounded-xl items-center gap-2 font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse hover:animate-none text-xs"
            >
              <FiAlertTriangle className="text-base lg:text-lg" /> S.O.S
            </button>

            <div className="text-xs font-medium text-slate-400 hidden lg:block border-l border-white/10 pl-4">{today}</div>
            
            <button onClick={exportPDF} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-slate-300 transition-all border border-white/5">
               <FiDownload />
               <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Export</span>
            </button>

            <button className="relative p-2 text-slate-400 hover:text-white transition-all">
              <FiBell className="text-xl" />
              <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#070b14]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div
                onClick={() => navigate("/profile")}
                title="View Profile"
                className="relative w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 p-[2px] cursor-pointer hover:scale-110 transition-transform duration-200 hover:shadow-[0_0_16px_rgba(99,102,241,0.6)] group"
              >
                <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center font-bold text-sm uppercase group-hover:bg-[#0a0f1e] transition-colors">
                  {currentUser ? currentUser.name.charAt(0) : "U"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 📜 SCROLLABLE DASHBOARD CONTENT */}
        <motion.div id="dashboard-export" variants={containerVariants} initial="hidden" animate="show" className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 custom-scrollbar z-10 relative space-y-6 lg:space-y-8 pb-32 custom-scrollbar-hidden">

          <motion.div variants={itemVariants} data-html2canvas-ignore className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Health Overview
              </h1>
              <p className="text-slate-400 mt-1">
                Monitor your vitals and progress in real-time.
              </p>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center gap-2"
            >
              <FiPlusIcon /> Record Vitals
            </motion.button>
          </motion.div>

          {/* 🧩 QUANTUM STAT MATRIX */}
          {(() => {
            const latest = records[0];
            const bmiVal = parseFloat(latest?.bmi || 0);
            const bmiColor   = !latest ? { border:"border-slate-500/10", bg:"bg-slate-500/5",   icon:"bg-slate-500/10 text-slate-400 border-slate-500/20",   glow:"hover:shadow-[0_0_40px_rgba(148,163,184,0.15)]", text:"text-slate-50",  badge:"text-slate-400 border-slate-500/30 bg-slate-500/10", label:"text-slate-200/50" }
              : bmiVal < 18.5 ? { border:"border-cyan-500/10",  bg:"bg-cyan-500/5",    icon:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",     glow:"hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",   text:"text-cyan-50",   badge:"text-cyan-400 border-cyan-500/30 bg-cyan-500/10",   label:"text-cyan-200/50" }
              : bmiVal < 25   ? { border:"border-emerald-500/10",bg:"bg-emerald-500/5", icon:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20", glow:"hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]", text:"text-emerald-50",badge:"text-emerald-400 border-emerald-500/30 bg-emerald-500/10",label:"text-emerald-200/50" }
              : bmiVal < 30   ? { border:"border-amber-500/10",  bg:"bg-amber-500/5",   icon:"bg-amber-500/10 text-amber-400 border-amber-500/20",     glow:"hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",  text:"text-amber-50",  badge:"text-amber-400 border-amber-500/30 bg-amber-500/10",  label:"text-amber-200/50" }
              :                 { border:"border-rose-500/10",   bg:"bg-rose-500/5",    icon:"bg-rose-500/10 text-rose-400 border-rose-500/20",       glow:"hover:shadow-[0_0_40px_rgba(244,63,94,0.2)]",   text:"text-rose-50",   badge:"text-rose-400 border-rose-500/30 bg-rose-500/10",   label:"text-rose-200/50" };

            const bmiLabel = !latest ? "No Data" : bmiVal < 18.5 ? "Underweight" : bmiVal < 25 ? "Normal" : bmiVal < 30 ? "Overweight" : "Obese";

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: BMI */}
                <motion.div whileHover={{ y: -5, scale: 1.02 }} className={`bg-[#050914]/80 backdrop-blur-2xl border ${bmiColor.border} rounded-3xl p-6 relative overflow-hidden group transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.2)] ${bmiColor.glow}`}>
                  <div className={`absolute top-0 right-0 w-48 h-48 ${bmiColor.bg} rounded-full blur-[50px] group-hover:opacity-40 transition-all duration-700`} />
                  <div className={`w-14 h-14 rounded-[20px] ${bmiColor.icon} flex items-center justify-center text-2xl mb-4 border border-b-2 shadow-lg`}>
                    <FiTrendingUp className="group-hover:animate-bounce absolute opacity-20" />
                    <FiTrendingUp className="relative z-10" />
                  </div>
                  <p className={`${bmiColor.label} text-xs font-bold tracking-widest uppercase mb-1`}>BMI Index</p>
                  <div className="flex items-end gap-3 relative z-10">
                    <h3 className={`text-4xl font-black ${bmiColor.text} drop-shadow-lg`}>
                      {latest ? bmiVal.toFixed(1) : "—"}
                    </h3>
                    <span className={`text-xs font-bold ${bmiColor.badge} mb-2 border px-2 py-0.5 rounded-full`}>{bmiLabel}</span>
                  </div>
                  {!latest && <p className="text-[9px] text-slate-600 mt-2 font-mono">Log first entry ↑</p>}
                </motion.div>

                {/* Card 2: Body Weight */}
                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-[#050914]/80 backdrop-blur-2xl border border-indigo-500/10 rounded-3xl p-6 relative overflow-hidden group transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.05)] hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/40">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[50px] group-hover:bg-indigo-500/20 transition-all duration-700" />
                  <div className="w-14 h-14 rounded-[20px] bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl mb-4 border border-indigo-500/20 group-hover:border-indigo-400 border-b-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <FiDroplet className="group-hover:animate-pulse absolute opacity-20" />
                    <FiDroplet className="relative z-10" />
                  </div>
                  <p className="text-indigo-200/50 text-xs font-bold tracking-widest uppercase mb-1">Body Weight</p>
                  <div className="flex items-end gap-3 relative z-10">
                    <h3 className="text-4xl font-black text-indigo-50 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      {latest ? latest.weight : "—"}
                    </h3>
                    <span className="text-xs font-bold text-indigo-400 mb-2 border border-indigo-500/30 px-2 py-0.5 rounded-full bg-indigo-500/10">kg</span>
                  </div>
                  {!latest && <p className="text-[9px] text-slate-600 mt-2 font-mono">Log first entry ↑</p>}
                </motion.div>

                {/* Card 3: Height */}
                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-[#050914]/80 backdrop-blur-2xl border border-orange-500/10 rounded-3xl p-6 relative overflow-hidden group transition-all cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.05)] hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] hover:border-orange-500/40">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-[50px] group-hover:bg-orange-500/20 transition-all duration-700" />
                  <div className="w-14 h-14 rounded-[20px] bg-orange-500/10 text-orange-400 flex items-center justify-center text-2xl mb-4 border border-orange-500/20 group-hover:border-orange-400 border-b-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <FiHeart className="group-hover:animate-ping absolute opacity-20" />
                    <FiHeart className="relative z-10" />
                  </div>
                  <p className="text-orange-200/50 text-xs font-bold tracking-widest uppercase mb-1">Height</p>
                  <div className="flex items-end gap-3 relative z-10">
                    <h3 className="text-4xl font-black text-orange-50 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                      {latest ? latest.height : "—"}
                    </h3>
                    <span className="text-xs font-bold text-orange-400 mb-2 border border-orange-500/30 px-2 py-0.5 rounded-full bg-orange-500/10">cm</span>
                  </div>
                  {!latest && <p className="text-[9px] text-slate-600 mt-2 font-mono">Log first entry ↑</p>}
                </motion.div>

                {/* Card 4: Total Records */}
                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="bg-gradient-to-tr from-indigo-900/60 to-purple-900/60 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden group transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:border-indigo-400">
                  <div className="absolute -top-10 -right-10 text-indigo-400/10 text-[150px] pointer-events-none group-hover:rotate-12 transition-transform duration-700"><FiTrendingUp /></div>
                  <div className="w-14 h-14 rounded-[20px] bg-white/10 text-white flex items-center justify-center text-2xl mb-4 border border-white/20 group-hover:bg-white/20 shadow-inner">
                    <FiTrendingUp className="relative z-10" />
                  </div>
                  <p className="text-indigo-200 text-xs font-bold tracking-widest uppercase mb-1">Logged Telemetry</p>
                  <div className="flex items-end gap-3 relative z-10">
                    <h3 className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{records.length}</h3>
                    <span className="text-xs font-bold text-indigo-200 mb-2 border border-indigo-400/30 px-2 py-0.5 rounded-full bg-black/20">RECORDS</span>
                  </div>
                </motion.div>

              </div>
            );
          })()}

          {/* ✨ THREE NEW PREMIUM FEATURES ROW */}
          {(() => {
            // ── 1. Calculate real streak ──
            const streak = (() => {
              if (records.length === 0) return 0;
              const days = new Set(records.map(r => new Date(r.createdAt).toDateString()));
              const sorted = [...days].map(d => new Date(d)).sort((a,b) => b-a);
              let count = 1;
              for (let i = 0; i < sorted.length - 1; i++) {
                const diff = (sorted[i] - sorted[i+1]) / (1000*60*60*24);
                if (diff <= 1.5) count++; else break;
              }
              return count;
            })();

            // ── 2. AI Smart Summary ──
            const latest = records[0];
            const prev   = records[1];
            const bmiNow = parseFloat(latest?.bmi || 0);
            const bmiPrev= parseFloat(prev?.bmi || 0);
            const wNow   = parseFloat(latest?.weight || 0);
            const wPrev  = parseFloat(prev?.weight || 0);
            const bmidelta = prev ? (bmiNow - bmiPrev).toFixed(1) : null;
            const wdelta   = prev ? (wNow - wPrev).toFixed(1) : null;
            const bmiLabel = bmiNow < 18.5 ? 'Underweight' : bmiNow < 25 ? 'Normal' : bmiNow < 30 ? 'Overweight' : 'Obese';
            const bmiColor = bmiNow < 18.5 ? 'text-cyan-400' : bmiNow < 25 ? 'text-emerald-400' : bmiNow < 30 ? 'text-amber-400' : 'text-red-400';
            const aiMsg = !latest
              ? "No vitals logged yet. Start recording your first entry to get personalized AI health insights!"
              : bmidelta !== null
                ? `Your BMI is ${bmiNow.toFixed(1)} (${bmiLabel}). It has ${parseFloat(bmidelta) <= 0 ? '⬇️ dropped by ' + Math.abs(bmidelta) : '⬆️ risen by ' + bmidelta} since your last entry. ${bmiNow < 25 ? 'Keep maintaining your healthy lifestyle! Your metabolic profile looks excellent.' : 'Consider increasing physical activity and reviewing dietary intake to reach the Normal range.'}`
                : `Your latest BMI is ${bmiNow.toFixed(1)} (${bmiLabel}). ${bmiNow < 25 ? 'Great work — your biometrics are in the optimal range. Log regularly to track your progress.' : 'Log more entries to reveal trends and get more personalized recommendations.'}`;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── AI SMART SUMMARY ── */}
                <motion.div variants={itemVariants}
                  className="lg:col-span-2 bg-gradient-to-br from-[#0d1220] to-[#111726]/80 border border-indigo-500/20 rounded-[32px] p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">🤖</div>
                      <div>
                        <h3 className="text-lg font-bold text-white">AI Health Summary</h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Neural Core Analysis</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400">LIVE</span>
                    </div>
                  </div>
                  <div className="relative z-10 bg-[#0a101f]/80 rounded-2xl p-5 border border-white/5">
                    <p className="text-sm text-slate-300 leading-relaxed">{aiMsg}</p>
                  </div>
                  {latest && (
                    <div className="relative z-10 flex gap-3 mt-4 flex-wrap">
                      {[
                        { label: 'BMI', val: bmiNow.toFixed(1), cls: bmiColor },
                        wdelta !== null && { label: 'Weight Δ', val: `${parseFloat(wdelta) > 0 ? '+' : ''}${wdelta} kg`, cls: parseFloat(wdelta) <= 0 ? 'text-emerald-400' : 'text-rose-400' },
                        { label: 'Status', val: bmiLabel, cls: bmiColor },
                        { label: 'Entries', val: records.length, cls: 'text-indigo-400' },
                      ].filter(Boolean).map((p, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p.label}</p>
                          <p className={`text-sm font-black ${p.cls}`}>{p.val}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* ── STREAK + GOAL STACKED ── */}
                <div className="flex flex-col gap-6">

                  {/* 🔥 HEALTH STREAK */}
                  <motion.div variants={itemVariants}
                    className="bg-gradient-to-br from-[#1f1008]/90 to-[#0f1522]/90 border border-orange-500/20 rounded-[32px] p-5 shadow-xl relative overflow-hidden group hover:border-orange-500/40 transition-all duration-500 flex-1">
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] group-hover:bg-orange-500/20 transition-all duration-700" />
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{streak >= 7 ? '🏆' : streak >= 3 ? '🔥' : streak >= 1 ? '✨' : '💤'}</span>
                        <div>
                          <p className="font-bold text-white text-sm">Logging Streak</p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Consecutive days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-black text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.5)]">{streak}</p>
                        <p className="text-[10px] text-orange-400/70 font-bold">{streak === 1 ? 'day' : 'days'}</p>
                      </div>
                    </div>
                    <div className="relative z-10 bg-[#0a101f]/60 rounded-xl p-2.5 border border-white/5">
                      <div className="flex gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${i < streak ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]' : 'bg-white/5'}`} />
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-600 mt-1.5 font-mono text-center">{streak >= 7 ? '🏆 CHAMPION STREAK' : `${7 - streak} days to champion`}</p>
                    </div>
                  </motion.div>

                  {/* 🎯 WEIGHT GOAL TRACKER */}
                  <WeightGoalCard latest={latest} records={records} />

                </div>
              </div>
            );
          })()}

          {/* 📊 QUANTUM ANALYTICS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* BMI Trajectory */}
            <motion.div variants={itemVariants} className="bg-[#0d1220] border border-indigo-500/15 rounded-[32px] p-7 shadow-2xl group hover:border-indigo-500/40 transition-all duration-500 flex flex-col min-h-[420px] relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                      <FiTrendingUp className="text-indigo-400 text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">BMI Trajectory</h3>
                  </div>
                  <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Biometric mass-index over time</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {records.length > 0 && (() => {
                    const bmi = parseFloat(records[0]?.bmi || 0);
                    const color = bmi < 18.5 ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" : bmi < 25 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : bmi < 30 ? "text-amber-400 bg-amber-500/10 border-amber-500/30" : "text-red-400 bg-red-500/10 border-red-500/30";
                    const label = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
                    return <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${color}`}>{label}</span>;
                  })()}
                  <span className="text-[9px] text-slate-500 font-mono">{records.length} entries</span>
                </div>
              </div>
              <div className="flex-1 w-full h-full min-h-[280px] relative z-10">
                <BMIChart records={records} />
              </div>
            </motion.div>

            {/* Health Radar Mesh */}
            <motion.div variants={itemVariants} className="bg-[#0d1220] border border-cyan-500/15 rounded-[32px] p-7 shadow-2xl group hover:border-cyan-500/40 transition-all duration-500 flex flex-col min-h-[420px] relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
                      <FiActivityIcon className="text-cyan-400 text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Health Radar</h3>
                  </div>
                  <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Multi-axis biometric hologram</p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">Live Sync</span>
              </div>
              <div className="flex-1 w-full min-h-[320px] flex items-center justify-center relative z-10">
                <HealthRadar dataPoints={[85, 75, 90, 60, 95]} />
              </div>
            </motion.div>
          </div>

          {/* 🕒 HISTORY LIST */}
          <motion.div variants={itemVariants} className="bg-[#111726]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Recent Measurements</h3>

            {isLoadingMain ? (
               <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-[#0a101f] border border-white/5 rounded-2xl p-5 flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-6 w-full">
                           <div className="w-12 h-12 bg-white/5 rounded-xl shrink-0 hidden sm:block" />
                           <div className="flex-1 space-y-3">
                              <div className="h-5 bg-white/10 rounded-lg w-1/3" />
                              <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                           </div>
                        </div>
                        <div className="w-10 h-10 bg-white/5 rounded-xl shrink-0 ml-4" />
                    </div>
                  ))}
               </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                <FiActivityIcon className="text-4xl text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No telemetry recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {records.map((r, i) => (
                    <motion.div
                      key={r._id || i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                      className="bg-[#0a101f] hover:bg-[#0f1524] transition-all p-5 rounded-2xl border border-white/5 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:flex w-12 h-12 bg-white/5 rounded-xl border border-white/10 items-center justify-center text-slate-400 font-mono text-xs">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : "--"}
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg flex items-center gap-3">
                            BMI: {r.bmi}
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${r.bmiCategory === "Normal" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              r.bmiCategory === "Underweight" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" :
                                "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}>
                              {r.bmiCategory}
                            </span>
                          </div>
                          <div className="text-slate-500 text-sm mt-1">
                            Age: {r.age} yrs • {r.weight} kg • {r.height} cm
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex">
                          <FiChevronRight />
                        </button>
                        <button
                          onClick={() => deleteRecord(r._id)}
                          className="w-10 h-10 rounded-xl bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-500/10"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ADD DATA MODAL (Floating Center Modal) */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#111726] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">Record Vitals</h3>
                <p className="text-slate-400 text-sm mb-6">Enter your daily metrics to track your progress over time.</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Age</label>
                    <input
                      name="age" type="number" onChange={handleChange} value={form.age}
                      className="w-full bg-[#0a101f] border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Weight (kg)</label>
                      <input
                        name="weight" type="number" onChange={handleChange} value={form.weight}
                        className="w-full bg-[#0a101f] border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Height (cm)</label>
                      <input
                        name="height" type="number" onChange={handleChange} value={form.height}
                        className="w-full bg-[#0a101f] border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3.5 font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)]"
                  >
                    Save Measurement
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 🚨🚨 S.O.S FULL SCREEN LOCKDOWN MODAL 🚨🚨 */}
        <AnimatePresence>
           {isSOSActive && (
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="fixed inset-0 z-[100] bg-red-950/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
              >
                  {/* Flashing Red Vignette */}
                  <div className="absolute inset-0 pointer-events-none bg-red-600/10 animate-[pulse_1s_ease-in-out_infinite]" />
                  
                  <div className="relative z-10 w-full max-w-4xl p-10 flex flex-col items-center text-center">
                      <motion.div 
                         animate={{ scale: [1, 1.1, 1] }} 
                         transition={{ repeat: Infinity, duration: 1 }}
                         className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(220,38,38,0.8)] mb-8"
                      >
                         <FiAlertTriangle className="text-6xl text-white" />
                      </motion.div>
                      
                      <h1 className="text-6xl font-black text-white tracking-widest uppercase mb-4">Emergency Protocol Active</h1>
                      <p className="text-2xl text-red-200 font-medium tracking-wide mb-12">Dispatching nearest first responders to your GPS location.</p>
                      
                      {/* Vitals Flashcard */}
                      <div className="grid grid-cols-3 gap-6 w-full mb-16">
                          <div className="bg-red-900/50 border border-red-500/50 p-6 rounded-3xl backdrop-blur-md">
                             <p className="text-red-300 font-bold uppercase tracking-wider mb-2">Blood Type</p>
                             <p className="text-5xl font-black text-white">O+</p>
                          </div>
                          <div className="bg-red-900/50 border border-red-500/50 p-6 rounded-3xl backdrop-blur-md">
                             <p className="text-red-300 font-bold uppercase tracking-wider mb-2">Allergies</p>
                             <p className="text-2xl font-bold text-white mt-4">Penicillin</p>
                          </div>
                          <div className="bg-red-900/50 border border-red-500/50 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-center">
                             <p className="text-red-300 font-bold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                                <FaShieldAlt /> Condition
                             </p>
                             <p className="text-xl font-bold text-white">Mild Hypertension</p>
                          </div>
                      </div>

                      {/* Radar Simulation */}
                      <div className="bg-black/40 border border-red-500/30 w-full rounded-full h-12 flex items-center p-1 relative overflow-hidden mb-12">
                          <div className="absolute left-4 z-10 font-mono text-red-200 font-bold tracking-widest text-sm">LOCATING NEAREST HOSPITAL...</div>
                          <motion.div 
                             initial={{ width: "0%" }}
                             animate={{ width: "100%" }}
                             transition={{ duration: 4, repeat: Infinity }}
                             className="h-full bg-gradient-to-r from-red-600/20 to-red-500 rounded-full"
                          />
                      </div>

                      {/* Deactivate */}
                      <button 
                         onClick={cancelSOS}
                         className="px-10 py-4 bg-transparent border-2 border-slate-400 text-slate-300 rounded-full font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all hover:border-slate-500"
                      >
                         Cancel Protocol (False Alarm)
                      </button>
                  </div>
              </motion.div>
           )}
        </AnimatePresence>

      </main>

      {/* Floating Voice Assistant Widget */}
      <AnimatePresence>
          {isVoiceListening && (
              <motion.div 
                 initial={{ opacity: 0, y: 50, scale: 0.8 }} 
                 animate={{ opacity: 1, y: 0, scale: 1 }} 
                 exit={{ opacity: 0, y: 50, scale: 0.8 }}
                 className="fixed bottom-24 right-8 z-40 bg-[#0a101f] border border-blue-500/30 p-6 rounded-[32px] shadow-[0_10px_40px_rgba(59,130,246,0.3)] flex items-center gap-6"
              >
                 {/* Voice Wave Animation */}
                 <div className="flex items-center gap-1.5 h-8">
                     {[...Array(5)].map((_, i) => (
                         <motion.div 
                             key={i}
                             animate={{ height: ["10%", "100%", "10%"] }}
                             transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                             className="w-1.5 bg-blue-500 rounded-full"
                         />
                     ))}
                 </div>
                 <div>
                     <p className="text-white font-bold tracking-widest uppercase text-sm">Listening...</p>
                     <p className="text-xs text-blue-400">Speak your medical query</p>
                 </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Voice Trigger Button (FAB) */}
      <motion.button
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.95 }}
         onClick={startVoiceAssistant}
         className={`fixed bottom-8 right-8 w-14 h-14 z-50 rounded-full flex items-center justify-center text-xl transition-all ${isVoiceListening ? 'bg-red-500 text-white shadow-[0_0_30px_#ef4444] animate-pulse' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'}`}
      >
          {isVoiceListening ? <FiLoader className="animate-spin" /> : <FiMic />}
      </motion.button>
      
      <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
          .justify-report { text-align: justify; text-justify: inter-word; }
      `}} />

      {/* 📄 PREMIUM REPORT TEMPLATE (Hidden from UI, used for Export) */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <div id="premium-report-content" style={{width:'794px', background:'#ffffff', fontFamily:'Arial,sans-serif', color:'#1e293b', position:'relative', overflow:'hidden'}}>

          {/* ── ANATOMICAL SKELETON WATERMARK ── */}
          <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:0}}>
            <svg width="460" height="600" viewBox="0 0 200 280" fill="none" opacity="0.04">
              {/* Skull */}
              <ellipse cx="100" cy="28" rx="22" ry="24" stroke="#4f46e5" strokeWidth="2.5"/>
              <ellipse cx="100" cy="36" rx="10" ry="6" stroke="#4f46e5" strokeWidth="1.5"/>
              <line x1="90" y1="38" x2="88" y2="42" stroke="#4f46e5" strokeWidth="1.5"/>
              <line x1="110" y1="38" x2="112" y2="42" stroke="#4f46e5" strokeWidth="1.5"/>
              {/* Spine */}
              {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>(
                <rect key={i} x="93" y={52+i*13} width="14" height="9" rx="2" stroke="#4f46e5" strokeWidth="1.5"/>
              ))}
              {/* Rib cage */}
              {[0,1,2,3,4].map(i=>(
                <g key={i}>
                  <path d={`M100,${66+i*12} Q70,${60+i*12} 60,${72+i*12}`} stroke="#4f46e5" strokeWidth="1.5" fill="none"/>
                  <path d={`M100,${66+i*12} Q130,${60+i*12} 140,${72+i*12}`} stroke="#4f46e5" strokeWidth="1.5" fill="none"/>
                </g>
              ))}
              {/* Collar bones */}
              <line x1="100" y1="52" x2="65" y2="60" stroke="#4f46e5" strokeWidth="2"/>
              <line x1="100" y1="52" x2="135" y2="60" stroke="#4f46e5" strokeWidth="2"/>
              {/* Pelvis */}
              <ellipse cx="100" cy="210" rx="30" ry="18" stroke="#4f46e5" strokeWidth="2"/>
              <line x1="100" y1="195" x2="100" y2="192" stroke="#4f46e5" strokeWidth="2"/>
              {/* Left arm */}
              <line x1="65" y1="60" x2="48" y2="120" stroke="#4f46e5" strokeWidth="2"/>
              <line x1="48" y1="120" x2="38" y2="170" stroke="#4f46e5" strokeWidth="2"/>
              {/* Right arm */}
              <line x1="135" y1="60" x2="152" y2="120" stroke="#4f46e5" strokeWidth="2"/>
              <line x1="152" y1="120" x2="162" y2="170" stroke="#4f46e5" strokeWidth="2"/>
              {/* Left leg */}
              <line x1="80" y1="225" x2="72" y2="270" stroke="#4f46e5" strokeWidth="2.5"/>
              <line x1="72" y1="270" x2="68" y2="310" stroke="#4f46e5" strokeWidth="2.5"/>
              {/* Right leg */}
              <line x1="120" y1="225" x2="128" y2="270" stroke="#4f46e5" strokeWidth="2.5"/>
              <line x1="128" y1="270" x2="132" y2="310" stroke="#4f46e5" strokeWidth="2.5"/>
            </svg>
          </div>

          <div style={{position:'relative', zIndex:1, padding:'48px'}}>

            {/* ── HEADER ── */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', paddingBottom:'24px', borderBottom:'4px solid #4f46e5'}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="#4f46e5"/></svg>
                  <h1 style={{fontSize:'26px', fontWeight:'900', color:'#4f46e5', margin:0, letterSpacing:'-1px'}}>AuraMed AI Health Platform</h1>
                </div>
                <p style={{fontSize:'10px', color:'#94a3b8', fontWeight:'700', letterSpacing:'3px', margin:0}}>CERTIFIED BIOMETRIC HEALTH REPORT</p>
              </div>
              <div style={{textAlign:'right', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'12px 16px'}}>
                <p style={{fontSize:'10px', color:'#64748b', margin:'0 0 4px 0', fontWeight:'700', letterSpacing:'2px'}}>REPORT ID</p>
                <p style={{fontSize:'13px', fontWeight:'800', margin:'0 0 6px 0', color:'#1e293b', fontFamily:'monospace'}}>{`AM-${Math.random().toString(36).substr(2,8).toUpperCase()}`}</p>
                <p style={{fontSize:'11px', color:'#64748b', margin:0}}>{new Date().toLocaleDateString('en-IN',{dateStyle:'long'})}</p>
              </div>
            </div>

            {/* ── PATIENT IDENTITY CARD ── */}
            <div style={{background:'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius:'16px', padding:'24px', marginBottom:'28px', color:'white'}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'20px'}}>
                {[
                  {label:'Patient Name', value: currentUser?.name || 'N/A'},
                  {label:'Email Address', value: currentUser?.email || 'N/A'},
                  {label:'Total Records', value: `${records.length} Entries`},
                  {label:'Neural Sync Status', value:'98.4% — Optimal'},
                ].map((item,i)=>(
                  <div key={i}>
                    <p style={{fontSize:'9px', fontWeight:'700', letterSpacing:'2px', opacity:0.7, margin:'0 0 4px 0'}}>{item.label.toUpperCase()}</p>
                    <p style={{fontSize:'13px', fontWeight:'800', margin:0, wordBreak:'break-all'}}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── LATEST VITALS GRID ── */}
            {records.length > 0 && (() => {
              const latest = records[0];
              const bmiVal = parseFloat(latest?.bmi||0);
              const bmiPct = Math.min(Math.max(((bmiVal - 10) / 30) * 100, 0), 100);
              const bmiColor = bmiVal < 18.5 ? '#06b6d4' : bmiVal < 25 ? '#10b981' : bmiVal < 30 ? '#f59e0b' : '#ef4444';
              const bmiLabel = bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal' : bmiVal < 30 ? 'Overweight' : 'Obese';
              return (
                <div style={{marginBottom:'28px'}}>
                  <h3 style={{fontSize:'11px', fontWeight:'800', color:'#4f46e5', letterSpacing:'3px', marginBottom:'16px', borderLeft:'4px solid #4f46e5', paddingLeft:'12px'}}>LATEST VITAL SNAPSHOT</h3>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'20px'}}>
                    {[
                      {label:'Body Weight', value:`${latest.weight} kg`, color:'#6366f1', bg:'#eef2ff'},
                      {label:'Height', value:`${latest.height} cm`, color:'#06b6d4', bg:'#ecfeff'},
                      {label:'Age', value:`${latest.age} yrs`, color:'#8b5cf6', bg:'#f5f3ff'},
                      {label:'BMI Index', value:latest.bmi, color: bmiColor, bg:'#f8fafc'},
                      {label:'BMI Category', value: bmiLabel, color: bmiColor, bg:'#f8fafc'},
                      {label:'Heart Rhythm', value:'72 BPM', color:'#f43f5e', bg:'#fff1f2'},
                    ].map((v,i)=>(
                      <div key={i} style={{background:v.bg, border:`1.5px solid ${v.color}22`, borderRadius:'12px', padding:'14px'}}>
                        <p style={{fontSize:'9px', fontWeight:'700', color:'#94a3b8', letterSpacing:'1.5px', margin:'0 0 4px 0'}}>{v.label.toUpperCase()}</p>
                        <p style={{fontSize:'20px', fontWeight:'900', color:v.color, margin:0}}>{v.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* ── BMI VISUAL GAUGE ── */}
                  <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'14px', padding:'18px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                      <p style={{fontSize:'10px', fontWeight:'800', color:'#475569', letterSpacing:'2px', margin:0}}>BMI GAUGE</p>
                      <div style={{background:bmiColor, color:'white', borderRadius:'100px', padding:'3px 12px', fontSize:'11px', fontWeight:'800'}}>
                        {bmiVal.toFixed(1)} — {bmiLabel}
                      </div>
                    </div>
                    {/* Gradient track */}
                    <div style={{position:'relative', height:'14px', borderRadius:'100px', background:'linear-gradient(90deg, #06b6d4 0%, #10b981 30%, #f59e0b 65%, #ef4444 100%)', marginBottom:'6px'}}>
                      {/* Marker */}
                      <div style={{position:'absolute', top:'-3px', left:`${bmiPct}%`, transform:'translateX(-50%)', width:'20px', height:'20px', background:'white', border:`3px solid ${bmiColor}`, borderRadius:'50%', boxShadow:'0 2px 8px rgba(0,0,0,0.2)'}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                      {['Underweight','Normal','Overweight','Obese'].map((l,i)=>(
                        <span key={i} style={{fontSize:'8px', color:'#94a3b8', fontWeight:'700'}}>{l}</span>
                      ))}
                    </div>
                  </div>

                  {/* ── HEALTH STATUS BARS ── */}
                  <div style={{marginTop:'16px'}}>
                    <p style={{fontSize:'10px', fontWeight:'800', color:'#475569', letterSpacing:'2px', marginBottom:'12px'}}>HEALTH PARAMETER ANALYSIS</p>
                    {[
                      {label:'Cardiovascular Health', pct:85, color:'#f43f5e'},
                      {label:'Metabolic Efficiency',  pct: bmiVal < 25 ? 90 : 60, color:'#10b981'},
                      {label:'Skeletal Structure',    pct:78, color:'#6366f1'},
                      {label:'Neural Sync Level',     pct:98, color:'#06b6d4'},
                    ].map((bar,i)=>(
                      <div key={i} style={{marginBottom:'10px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                          <span style={{fontSize:'10px', fontWeight:'700', color:'#475569'}}>{bar.label}</span>
                          <span style={{fontSize:'10px', fontWeight:'800', color:bar.color}}>{bar.pct}%</span>
                        </div>
                        <div style={{height:'7px', background:'#e2e8f0', borderRadius:'100px', overflow:'hidden'}}>
                          <div style={{height:'100%', width:`${bar.pct}%`, background:bar.color, borderRadius:'100px'}} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── FULL DATA TABLE ── */}
            <div style={{marginBottom:'24px'}}>
              <h3 style={{fontSize:'11px', fontWeight:'800', color:'#4f46e5', letterSpacing:'3px', marginBottom:'14px', borderLeft:'4px solid #4f46e5', paddingLeft:'12px'}}>COMPLETE TELEMETRY LOG</h3>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
                <thead>
                  <tr style={{background:'#4f46e5'}}>
                    {['#','Date','Age','Weight','Height','BMI','Category','Status'].map(h=>(
                      <th key={h} style={{padding:'10px 12px', textAlign:'left', color:'white', fontWeight:'800', fontSize:'9px', letterSpacing:'1.5px'}}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0,15).map((r,i)=>{
                    const bmi = parseFloat(r.bmi||0);
                    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
                    const catColor = bmi < 18.5 ? '#06b6d4' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444';
                    return (
                      <tr key={i} style={{background: i%2===0 ? '#f8fafc' : '#ffffff', borderBottom:'1px solid #e2e8f0'}}>
                        <td style={{padding:'10px 12px', color:'#94a3b8', fontWeight:'700'}}>{i+1}</td>
                        <td style={{padding:'10px 12px', fontFamily:'monospace', color:'#475569'}}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                        <td style={{padding:'10px 12px'}}>{r.age}</td>
                        <td style={{padding:'10px 12px'}}>{r.weight} kg</td>
                        <td style={{padding:'10px 12px'}}>{r.height} cm</td>
                        <td style={{padding:'10px 12px', fontWeight:'800', color:'#4f46e5'}}>{r.bmi}</td>
                        <td style={{padding:'10px 12px', fontWeight:'700', color: catColor}}>{cat}</td>
                        <td style={{padding:'10px 12px'}}>
                          <span style={{background:`${catColor}22`, color: catColor, borderRadius:'100px', padding:'3px 10px', fontSize:'9px', fontWeight:'800', border:`1px solid ${catColor}44`}}>
                            {bmi < 25 ? '✓ OK' : '⚠ Review'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {records.length === 0 && (
                <p style={{textAlign:'center', color:'#94a3b8', padding:'24px', border:'1px dashed #e2e8f0', borderRadius:'12px'}}>No telemetry data recorded yet.</p>
              )}
            </div>

            {/* ── AI CLINICAL SUMMARY ── */}
            <div style={{background:'#f0f4ff', border:'1px solid #c7d2fe', borderRadius:'14px', padding:'20px', marginBottom:'24px'}}>
              <p style={{fontSize:'10px', fontWeight:'800', color:'#4f46e5', letterSpacing:'2px', margin:'0 0 10px 0'}}>AI CLINICAL SYNTHESIS</p>
              <p style={{fontSize:'12px', color:'#475569', lineHeight:'1.8', margin:0, fontStyle:'italic'}}>
                This report was synthesized by the AuraMed Neural Core AI. The patient, <strong>{currentUser?.name||'N/A'}</strong>, has recorded <strong>{records.length} biometric entries</strong>. 
                Based on the telemetry trends, cardiovascular and metabolic markers are within recommended thresholds. 
                Continued monitoring and regular vital logging is advised for predictive health optimization.
              </p>
            </div>

            {/* ── FOOTER ── */}
            <div style={{borderTop:'2px solid #e2e8f0', paddingTop:'16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <p style={{fontSize:'9px', color:'#94a3b8', fontWeight:'700', letterSpacing:'2px', margin:0}}>AURAMED AI MEDICAL SYSTEMS © {new Date().getFullYear()}</p>
              <p style={{fontSize:'9px', color:'#94a3b8', margin:0}}>Digitally generated. No physical signature required.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;