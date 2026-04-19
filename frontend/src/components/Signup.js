import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaHeartbeat, FaNotesMedical } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import NeuralLoading from "./NeuralLoading";

export default function Signup() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Custom notification (replaces all alert() calls)
  const [notification, setNotification] = useState(null); // { type: 'error'|'success', msg: '' }

  // Email autocomplete suggestion
  const [emailSuggestion, setEmailSuggestion] = useState("");

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4500);
  };

  // --- Email autocomplete ---
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, email: val });
    if (val.length > 0 && !val.includes("@")) {
      setEmailSuggestion(val + "@gmail.com");
    } else {
      setEmailSuggestion("");
    }
  };

  const acceptSuggestion = () => {
    if (emailSuggestion) {
      setForm(f => ({ ...f, email: emailSuggestion }));
      setEmailSuggestion("");
      if (passwordRef.current) passwordRef.current.focus();
    }
  };

  // --- Enter key: Name → Email → Password ---
  const handleNameKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); if (emailRef.current) emailRef.current.focus(); }
  };

  const handleEmailKeyDown = (e) => {
    if ((e.key === "Tab" || e.key === "Enter") && emailSuggestion) {
      e.preventDefault();
      acceptSuggestion();
    } else if (e.key === "Enter" && !emailSuggestion) {
      e.preventDefault();
      if (passwordRef.current) passwordRef.current.focus();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      showNotification("error", "Please fill in all fields to continue.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login");
      } else {
        showNotification("error", data.message || "Signup failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      showNotification("error", "Cannot reach server. Make sure backend is running.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#040f1a] font-sans overflow-hidden">
      <NeuralLoading show={isLoading} />

      {/* ── CUSTOM TOAST NOTIFICATION (replaces all alert() calls) ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="notif"
            initial={{ opacity: 0, y: -70, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3
              px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[300px] max-w-[90vw]
              ${notification.type === "error"
                ? "bg-[#1a0a0a]/90 border-red-500/40 text-red-300"
                : "bg-[#0a1a0f]/90 border-emerald-500/40 text-emerald-300"
              }`}
          >
            {notification.type === "error"
              ? <FiAlertCircle className="text-xl text-red-400 shrink-0" />
              : <FiCheckCircle className="text-xl text-emerald-400 shrink-0" />
            }
            <span className="text-sm font-semibold">{notification.msg}</span>
            {/* Shrinking progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full
                ${notification.type === "error" ? "bg-red-500/70" : "bg-emerald-500/70"}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Health Branding Panel */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-black/20 overflow-hidden border-r border-[#00d2ff]/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen" style={{backgroundImage: "url('/images/categories_bg.png')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#040f1a]/70 to-[#040f1a]"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 p-16 max-w-xl text-left"
        >
          <FaNotesMedical className="text-6xl text-[#00d2ff] mb-6 drop-shadow-[0_0_20px_rgba(0,210,255,0.6)]" />
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Next-Gen Care,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">Starts Here.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            Join the HealthAI network today. Securely link your vitals, monitor real-time AI diagnoses, and connect with verified holographic care specialists instantly.
          </p>
        </motion.div>
      </div>

      {/* Right Signup Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00d2ff]/10 blur-[130px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 sm:p-14 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-[90%] max-w-[480px] text-white z-10"
        >
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">
              <FaHeartbeat className="text-[#00d2ff]" /> HealthAI Patient Portal
            </div>
          </div>

          <h2 className="text-2xl font-bold text-left mb-6 tracking-wide text-slate-200">
            Patient Enrollment
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* NAME */}
            <div className="flex items-center bg-black/40 border border-[#00d2ff]/20 p-4 rounded-xl transition-colors hover:border-[#00d2ff]/50 focus-within:border-[#00d2ff] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.2)]">
              <FaUser className="mr-3 text-[#00d2ff] shrink-0" />
              <input
                type="text"
                placeholder="Full Legal Name"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-light"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={handleNameKeyDown}
              />
            </div>

            {/* EMAIL with ghost autocomplete */}
            <div className="flex items-center bg-black/40 border border-[#00d2ff]/20 p-4 rounded-xl transition-colors hover:border-[#00d2ff]/50 focus-within:border-[#00d2ff] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.2)]">
              <FaEnvelope className="mr-3 text-[#00d2ff] shrink-0" />
              <div className="relative w-full">
                {emailSuggestion && (
                  <div className="absolute inset-0 flex items-center pointer-events-none select-none">
                    <span className="font-light text-base">
                      <span className="text-white">{form.email}</span>
                      <span className="text-gray-600">{emailSuggestion.slice(form.email.length)}</span>
                    </span>
                  </div>
                )}
                <input
                  ref={emailRef}
                  type="text"
                  placeholder="Secure Email Address"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-light relative z-10"
                  value={form.email}
                  onChange={handleEmailChange}
                  onKeyDown={handleEmailKeyDown}
                  autoComplete="off"
                />
              </div>
              {emailSuggestion && (
                <span
                  onClick={acceptSuggestion}
                  className="ml-2 shrink-0 text-[9px] font-bold text-[#00d2ff]/60 border border-[#00d2ff]/30 rounded px-1.5 py-0.5 cursor-pointer hover:text-[#00d2ff] transition-colors"
                >
                  TAB
                </span>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex items-center bg-black/40 border border-[#00d2ff]/20 p-4 rounded-xl transition-colors hover:border-[#00d2ff]/50 focus-within:border-[#00d2ff] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.2)]">
              <FaLock className="mr-3 text-[#00d2ff] shrink-0" />
              <input
                ref={passwordRef}
                type="password"
                placeholder="Account Password"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-light"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] py-4 rounded-xl font-bold text-lg mt-8 shadow-[0_10px_20px_rgba(0,210,255,0.3)] hover:shadow-[0_15px_30px_rgba(0,210,255,0.5)] transition-all transform hover:-translate-y-[2px]"
            >
              Enroll &amp; Secure Identity
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Existing patient?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#00d2ff] font-semibold cursor-pointer hover:underline"
            >
              Access portal here
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}