import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiSearch, FiShield, FiAlertTriangle, FiTrash2, FiUserCheck, FiUserX, FiActivity, FiTerminal, FiDatabase, FiSettings, FiFileText, FiCheck, FiX } from "react-icons/fi";

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("users"); // 'users', 'audit', 'logs', 'tuning', 'globaldb'
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");

    // Data States
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [chatLogs, setChatLogs] = useState([]);
    const [configs, setConfigs] = useState([]);
    const [diseases, setDiseases] = useState([]);

    // UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [promptValue, setPromptValue] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!storedToken || user?.role !== 'admin') {
            navigate("/dashboard");
            return;
        }
        setToken(storedToken);
        fetchTabData(activeTab, storedToken);
    }, [navigate, activeTab]);

    const fetchTabData = async (tab, tokenStr) => {
        setLoading(true);
        try {
            if (tab === "users") {
                const res = await fetch("http://localhost:5000/api/admin/users", { headers: { "auth-token": tokenStr }});
                setUsers(await res.json());
            } else if (tab === "audit") {
                const res = await fetch("http://localhost:5000/api/admin/reports", { headers: { "auth-token": tokenStr }});
                setReports(await res.json());
            } else if (tab === "logs") {
                const res = await fetch("http://localhost:5000/api/admin/chat-logs", { headers: { "auth-token": tokenStr }});
                setChatLogs(await res.json());
            } else if (tab === "tuning") {
                const res = await fetch("http://localhost:5000/api/admin/system-config", { headers: { "auth-token": tokenStr }});
                const conf = await res.json();
                setConfigs(conf);
                const p = conf.find(c => c.key === 'ai_assistant_prompt');
                if (p) setPromptValue(p.value);
            } else if (tab === "globaldb") {
                const res = await fetch("http://localhost:5000/api/admin/global-diseases", { headers: { "auth-token": tokenStr }});
                setDiseases(await res.json());
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    // USER ACTIONS
    const toggleBlock = async (userId, status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/user/${userId}/block`, { method: "PUT", headers: { "auth-token": token }});
            const data = await res.json();
            if (res.ok) setUsers(users.map(u => u._id === userId ? { ...u, status: data.status } : u));
        } catch (error) { console.error(error); }
    };
    const deleteUser = async (userId) => {
        if (!window.confirm("Permanently delete this user?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/user/${userId}/delete`, { method: "DELETE", headers: { "auth-token": token }});
            if (res.ok) setUsers(users.filter(u => u._id !== userId));
        } catch (error) { console.error(error); }
    };

    // REPORT AUDIT ACTIONS
    const flagReport = async (reportId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/reports/${reportId}/flag`, { 
                method: "PUT", 
                headers: { "auth-token": token, "Content-Type": "application/json" },
                body: JSON.stringify({ adminNotes: "Flagged by System Administrator" })
            });
            const data = await res.json();
            if (res.ok) setReports(reports.map(r => r._id === reportId ? data.report : r));
        } catch (error) { console.error(error); }
    };

    // SYSTEM TUNING ACTIONS
    const savePrompt = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/system-config`, {
                method: "POST",
                headers: { "auth-token": token, "Content-Type": "application/json" },
                body: JSON.stringify({ key: 'ai_assistant_prompt', value: promptValue })
            });
            if (res.ok) alert("AI Personality matrix updated successfully.");
        } catch (error) { console.error(error); }
    };


    return (
        <div className="flex h-screen bg-[#070b14] text-slate-200 font-sans overflow-hidden py-10 selection:bg-rose-500/50">
            <main className="max-w-7xl w-full mx-auto flex flex-col h-full bg-[#0a101f] border border-rose-500/10 rounded-[40px] relative overflow-hidden shadow-2xl">
                
                {/* Header */}
                <header className="flex justify-between items-center p-8 z-20 relative bg-[#0a101f] border-b border-rose-500/10">
                     <button onClick={() => navigate("/dashboard")} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-all">
                        <FiChevronLeft className="text-xl" />
                     </button>
                     <h2 className="font-bold text-xl tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">God Mode Control Center</h2>
                     <div className="w-10 h-10 flex items-center justify-center text-rose-400 bg-rose-500/10 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                         <FiShield />
                     </div>
                </header>

                <div className="flex flex-1 overflow-hidden">
                    {/* Navigation Sidebar */}
                    <nav className="w-64 bg-[#111726]/50 border-r border-rose-500/10 p-6 flex flex-col gap-2">
                        <button onClick={() => setActiveTab('users')} className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm tracking-wider uppercase transition-all ${activeTab === 'users' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <FiUserCheck /> Oversight
                        </button>
                        <button onClick={() => setActiveTab('audit')} className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm tracking-wider uppercase transition-all ${activeTab === 'audit' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <FiFileText /> AI Audit
                        </button>
                        <button onClick={() => setActiveTab('logs')} className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm tracking-wider uppercase transition-all ${activeTab === 'logs' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <FiActivity /> Live Logs
                        </button>
                        <button onClick={() => setActiveTab('tuning')} className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm tracking-wider uppercase transition-all ${activeTab === 'tuning' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <FiTerminal /> Neural Tuning
                        </button>
                        <button onClick={() => setActiveTab('globaldb')} className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm tracking-wider uppercase transition-all ${activeTab === 'globaldb' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <FiDatabase /> Global DB
                        </button>
                    </nav>

                    {/* Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 bg-[#0a101f]/80 backdrop-blur-sm z-50 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {/* USERS TAB */}
                            {activeTab === 'users' && !loading && (
                                <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="flex items-center bg-[#111726] border border-white/10 rounded-2xl px-4 py-4 mb-6">
                                        <FiSearch className="text-slate-500 mr-3" />
                                        <input type="text" placeholder="Search accounts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent outline-none flex-1 text-white" />
                                    </div>
                                    <div className="space-y-4">
                                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                            <div key={user._id} className="bg-[#111726]/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10">
                                                 <div>
                                                     <p className="font-bold text-white tracking-widest">{user.name} <span className="text-xs text-slate-500 ml-2">({user.email})</span></p>
                                                     <p className="text-xs text-emerald-500 font-mono mt-1">Last online: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                                                 </div>
                                                 <div className="flex items-center gap-2">
                                                    {user.status === 'active' ? (
                                                        <button onClick={()=>toggleBlock(user._id)} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold uppercase"><FiUserCheck className="inline mr-1"/> Active</button>
                                                    ) : (
                                                        <button onClick={()=>toggleBlock(user._id)} className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/50 rounded-lg text-xs font-bold uppercase"><FiUserX className="inline mr-1"/> Blocked</button>
                                                    )}
                                                    {user.role !== 'admin' && (
                                                        <button onClick={()=>deleteUser(user._id)} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-500 text-slate-400 hover:text-white flex items-center justify-center"><FiTrash2 /></button>
                                                    )}
                                                 </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* AUDIT TAB */}
                            {activeTab === 'audit' && !loading && (
                                <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <h3 className="text-xl font-bold text-rose-400 border-b border-white/10 pb-4 mb-6">Diagnosis Audit Matrix</h3>
                                    {reports.map((report) => (
                                        <div key={report._id} className={`p-6 rounded-3xl border transition-all ${report.isFlaggedWrong ? 'bg-rose-500/10 border-rose-500/50' : 'bg-[#111726] border-white/5'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-xs text-slate-500 font-mono mb-1">User: {report.user?.name || "Deleted"} • {new Date(report.date).toLocaleString()}</p>
                                                    <p className="font-bold text-white text-lg">Symptoms: <span className="text-[#00d2ff]">{report.symptoms.join(', ')}</span></p>
                                                </div>
                                                <button onClick={() => flagReport(report._id)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${report.isFlaggedWrong ? 'bg-rose-500 text-white shadow-[0_0_15px_#f43f5e]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                                                    {report.isFlaggedWrong ? <><FiX /> Flagged Wrong</> : <><FiAlertTriangle /> Mark Wrong</>}
                                                </button>
                                            </div>
                                            <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-2">
                                                <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">AI Output</p>
                                                {report.possibleDiseases.map((d, i) => (
                                                    <p key={i} className="text-slate-300">• {d.name} <span className="text-xs opacity-50 px-2 py-0.5 rounded ml-2 bg-white/10">{d.severity}</span></p>
                                                ))}
                                                <p className="text-xs text-slate-500 mt-4 italic">Advice: {report.advice}</p>
                                            </div>
                                            {report.isFlaggedWrong && (
                                                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-xl">
                                                    <p className="text-rose-400 text-xs font-mono">Admin Note: {report.adminNotes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* LOGS TAB */}
                            {activeTab === 'logs' && !loading && (
                                <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                                        <h3 className="font-bold tracking-widest text-white uppercase text-sm">Real-time Stream</h3>
                                    </div>
                                    <div className="bg-[#0b0f19] border border-white/5 rounded-3xl p-6 h-[600px] overflow-y-auto custom-scrollbar-hidden font-mono text-sm space-y-6">
                                        {chatLogs.map(log => (
                                            <div key={log._id} className="border-b border-white/5 pb-4">
                                                <p className="text-indigo-400 mb-1">[{new Date(log.date).toLocaleTimeString()}] <span className="text-white font-bold">{log.user?.email || 'Anonymous'}</span>:</p>
                                                <p className="text-slate-300 mb-3 pl-4 border-l-2 border-indigo-500/30">{log.question}</p>
                                                <p className="text-emerald-400 mb-1">Aura AI Response:</p>
                                                <p className="text-slate-400 pl-4 border-l-2 border-emerald-500/30">{log.response}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* TUNING TAB */}
                            {activeTab === 'tuning' && !loading && (
                                <motion.div key="tuning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="bg-[#111726]/50 border border-rose-500/30 rounded-[32px] p-8 shadow-[0_0_30px_rgba(244,63,94,0.05)]">
                                        <h3 className="text-2xl font-black text-white mb-2">Neural Link Injector</h3>
                                        <p className="text-slate-400 text-sm mb-8">Directly modify the Master System Prompt that governs Aura AI's personality and rules across the platform.</p>
                                        
                                        <label className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3 block">System Message (GPT-4o Role)</label>
                                        <textarea 
                                            className="w-full h-80 bg-[#0a101f] border border-white/10 rounded-2xl p-6 text-emerald-400 font-mono text-sm resize-none focus:border-rose-500/50 outline-none leading-relaxed transition-colors shadow-inner"
                                            value={promptValue}
                                            onChange={(e) => setPromptValue(e.target.value)}
                                        />
                                        
                                        <div className="flex justify-end mt-6">
                                            <button onClick={savePrompt} className="px-8 py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                                                Compile & Override Protocol
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* GLOBAL DB TAB */}
                            {activeTab === 'globaldb' && !loading && (
                                <motion.div key="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                     <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-white">Global Medical Library</h3>
                                        <button className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">Add New Disease +</button>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {diseases.length === 0 ? (
                                            <p className="text-slate-500">Database is empty. Populating dynamically later.</p>
                                        ) : diseases.map(d => (
                                            <div key={d._id} className="bg-[#111726] p-6 rounded-2xl border border-white/5">
                                                <h4 className="font-bold text-white tracking-widest">{d.name}</h4>
                                                <p className="text-xs text-slate-400 mt-2">{d.description}</p>
                                            </div>
                                        ))}
                                     </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>

            </main>
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
};

export default AdminPanel;
