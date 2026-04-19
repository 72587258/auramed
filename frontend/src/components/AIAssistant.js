import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FiCpu, FiMessageSquare, FiSend, FiMic, FiLoader, FiArrowLeft, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const API_BASE_URL = "http://localhost:5000";

// --- TYPEWRITER COMPONENT ---
const TypeWriter = ({ text, delay = 20 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:opacity-90 prose-headings:text-cyan-400 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-li:text-slate-300">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
      {currentIndex < text.length && (
        <motion.span 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-1.5 h-4 bg-cyan-400 ml-1 translate-y-0.5"
        />
      )}
    </div>
  );
};

export default function AIAssistant() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isLoading]);

  const fetchHistory = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/ai/chat-history`, {
            headers: { "auth-token": token }
        });
        setChats(res.data.reverse()); // Chronological
    } catch (err) {
        console.error(err);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("System Warning: Voice input not supported on this browser kernel");
    
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).id : "guest";

    const userMsg = { _id: "temp", question: input, response: null, isTemp: true };
    setChats(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
        const res = await axios.post(`${API_BASE_URL}/api/ai/smart-advice`, 
            { question: userMsg.question, userId }, 
            { headers: { "auth-token": token }}
        );
        // Refresh to get actual DB items with IDs
        fetchHistory();
    } catch (err) {
        setChats(prev => prev.filter(c => !c.isTemp)); // Remove temp
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const submitEdit = async (id) => {
    if(!editInput.trim()) return setEditingId(null);
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setEditingId(null); // Close editor visually
    
    try {
        // Temporarily clear the answer while it thinks
        setChats(prev => prev.map(c => c._id === id ? { ...c, question: editInput, response: null } : c));
        
        await axios.put(`${API_BASE_URL}/api/ai/chat-history/${id}`, { question: editInput }, {
            headers: { "auth-token": token }
        });
    } catch (err) {
        console.error(err);
    } finally {
        fetchHistory();
        setIsLoading(false);
    }
  };

  const deleteChat = async (id) => {
    const token = localStorage.getItem("token");
    try {
        await axios.delete(`${API_BASE_URL}/api/ai/chat-history/${id}`, {
            headers: { "auth-token": token }
        });
        setChats(prev => prev.filter(c => c._id !== id));
    } catch (err) {
        console.error(err);
    }
  };

  const purgeChats = async () => {
    if(!window.confirm("CRITICAL: This will PERMANENTLY WIPE all neural memory logs. Proceed?")) return;
    const token = localStorage.getItem("token");
    try {
        const res = await axios.delete(`${API_BASE_URL}/api/ai/purge-chat`, {
            headers: { "auth-token": token }
        });
        setChats([]);
        alert("Neural protocol successful: All memory blocks purged.");
    } catch (err) {
        console.error(err);
        alert("System Error: Could not complete memory wipe. Check console for neural logs.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#010613] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      
      {/* Background Holographic Atmosphere */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Floating Nano-Header */}
      <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 mx-8 mt-6 border border-cyan-500/20 bg-black/40 backdrop-blur-3xl rounded-[30px] shadow-[0_20px_50px_rgba(6,182,212,0.1)] relative z-20">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all shadow-inner">
                <FiArrowLeft />
            </button>
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400/50 flex items-center justify-center bg-cyan-500/10 relative shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <span className="absolute w-full h-full animate-[spin_3s_linear_infinite] border-t-2 border-cyan-300 rounded-full pointer-events-none" />
                <div className="text-cyan-300 text-xl"><FiCpu /></div>
            </div>
            <div>
                <h1 className="font-black text-white text-xl uppercase tracking-widest flex items-center gap-3">
                    Neural Uplink <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                </h1>
                <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase opacity-80">Quantum AI Processing Core</p>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 hidden md:flex border border-cyan-500/20 px-4 py-2 rounded-full bg-cyan-500/5">
                <FiMessageSquare className="text-cyan-400" />
                <span className="text-xs font-bold text-cyan-200 tracking-wider">Memory Blocks: {chats.length}</span>
            </div>
            {chats.length > 0 && (
                <button 
                  onClick={purgeChats}
                  className="px-4 py-2 border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                >
                   Clear All Memory
                </button>
            )}
        </div>
      </header>

      {/* Main Chat Display */}
      <main className="flex-1 overflow-y-auto px-8 py-10 w-full max-w-5xl mx-auto custom-scrollbar relative z-10">
        
        {chats.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <FiCpu className="text-7xl mb-6 text-cyan-500" />
                <p className="font-mono text-cyan-400 tracking-widest uppercase">No Active Session Log</p>
            </div>
        )}

        <div className="space-y-8">
            <AnimatePresence>
                {chats.map((chat) => (
                    <motion.div key={chat._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                        
                        {/* USER QUESTION BUBBLE */}
                        <div className="flex justify-end relative group">
                            <div className="max-w-[75%] bg-indigo-600/20 border border-indigo-500/30 rounded-[28px] rounded-br-sm px-6 py-4 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative">
                                
                                {editingId === chat._id ? (
                                    <div className="flex flex-col gap-3 min-w-[250px]">
                                        <textarea 
                                            className="w-full bg-black/40 border border-indigo-500/50 rounded-xl p-3 outline-none text-white text-sm focus:border-indigo-400 min-h-[80px]"
                                            value={editInput}
                                            onChange={e => setEditInput(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase transition"><FiX /></button>
                                            <button onClick={() => submitEdit(chat._id)} className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold uppercase tracking-widest transition flex items-center gap-1"><FiCheck /> Submit Alteration</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-indigo-50 leading-relaxed font-medium">{chat.question}</p>
                                        {/* Floating Actions on Hover */}
                                        <div className="absolute top-0 -left-20 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingId(chat._id); setEditInput(chat.question); }} className="w-8 h-8 rounded-full bg-black/60 border border-indigo-500/30 flex items-center justify-center hover:bg-indigo-500/20 text-indigo-400 transition" title="Edit Question & Regenerate">
                                                <FiEdit2 className="text-xs" />
                                            </button>
                                            <button onClick={() => deleteChat(chat._id)} className="w-8 h-8 rounded-full bg-black/60 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/20 text-rose-400 transition" title="Delete Log">
                                                <FiTrash2 className="text-xs" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* AI RESPONSE BUBBLE */}
                        <div className="flex justify-start">
                            <div className="max-w-[85%] bg-cyan-900/10 border border-cyan-500/20 rounded-[28px] rounded-tl-sm px-6 py-5 shadow-[0_0_20px_rgba(6,182,212,0.05)] backdrop-blur-md">
                                {chat.response === null ? (
                                    <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm uppercase tracking-widest">
                                        <FiLoader className="animate-spin text-xl" /> Regenerating Quantum Output...
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 shrink-0 flex items-center justify-center">
                                            <FiCpu className="text-cyan-400 text-sm" />
                                        </div>
                                        <div className="text-cyan-50 leading-relaxed font-sans">
                                            <TypeWriter text={chat.response} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Waiting for response skeleton */}
            {isLoading && chats.length > 0 && chats[chats.length-1].response !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="max-w-[85%] bg-cyan-900/10 border border-cyan-500/20 rounded-[28px] rounded-tl-sm px-6 py-5 flex items-center gap-3 text-cyan-400 font-mono text-sm uppercase tracking-widest">
                        <FiLoader className="animate-spin text-xl" /> Decoding Response...
                    </div>
                </motion.div>
            )}

            <div ref={chatEndRef} />
        </div>
      </main>

      {/* Futuristic Input Terminal */}
      <footer className="shrink-0 p-8 pt-0 relative z-20 mx-auto w-full max-w-5xl">
         <div className="bg-black/60 backdrop-blur-2xl border border-cyan-500/20 rounded-[32px] p-2 flex items-end gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-cyan-500/5">
            <button 
                onClick={startListening} 
                className={`p-4 rounded-[24px] transition-all border ${isListening ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-white/5 border-transparent text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                title="Voice Protocol"
            >
                <FiMic className={isListening ? "animate-pulse" : ""} />
            </button>
            <textarea
                className="flex-1 bg-transparent text-white border-none outline-none resize-none px-4 py-4 min-h-[56px] max-h-32 custom-scrollbar font-mono placeholder-cyan-700/50"
                placeholder="ENTER QUERY DIRECTIVE..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === "Enter" && !e.shiftKey) { 
                        e.preventDefault(); 
                        handleSend(); 
                    }
                }}
            />
             <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-4 rounded-[24px] bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
                <FiSend />
            </button>
         </div>
      </footer>

    </div>
  );
}
