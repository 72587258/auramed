import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaHeartbeat, FaStethoscope } from "react-icons/fa";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import NeuralLoading from "./NeuralLoading";

export default function Login() {
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Custom notification state (replaces all alert() calls)
  const [notification, setNotification] = useState(null); // { type: 'error'|'success', msg: '' }
  // Inline field error under password
  const [passError, setPassError] = useState("");

  // Email autocomplete
  const [emailSuggestion, setEmailSuggestion] = useState("");

  const showNotification = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4500);
  };

  // --- Email autocomplete ---
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length > 0 && !val.includes("@")) {
      setEmailSuggestion(val + "@gmail.com");
    } else {
      setEmailSuggestion("");
    }
  };

  const acceptSuggestion = () => {
    if (emailSuggestion) {
      setEmail(emailSuggestion);
      setEmailSuggestion("");
      if (passwordRef.current) passwordRef.current.focus();
    }
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setPassError("");

    if (!email || !password) {
      showNotification("error", "Please fill in all fields to continue.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setIsLoading(false);
        const msg = data.message || "Login failed.";
        // Show inline error for password issues
        if (msg.toLowerCase().includes("password") || msg.toLowerCase().includes("incorrect")) {
          setPassError("Incorrect password. Please try again.");
        } else {
          showNotification("error", msg);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showNotification("error", "Cannot reach server. Make sure backend is running.");
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
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen filter grayscale" style={{backgroundImage: "url('/images/doctor_ui.png')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#040f1a]/50 to-[#040f1a]"></div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 p-16 max-w-xl text-left"
        >
          <FaStethoscope className="text-6xl text-[#00d2ff] mb-6 drop-shadow-[0_0_20px_rgba(0,210,255,0.6)]" />
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Your Health,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5]">Powered by AI</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed font-light">
            Securely access your clinical dashboard. Analyze your symptoms instantly, monitor deep wellness metrics, and consult with our hyper-intelligent diagnosis engine.
          </p>
        </motion.div>
      </div>

      {/* Right Login Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#3a7bd5]/10 blur-[130px] pointer-events-none"></div>

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
            Secure Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL with ghost autocomplete */}
            <div className="relative">
              <div className="flex items-center bg-black/40 border border-[#00d2ff]/20 p-4 rounded-xl transition-colors hover:border-[#00d2ff]/50 focus-within:border-[#00d2ff] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <FaEnvelope className="mr-3 text-[#00d2ff] shrink-0" />
                <div className="relative w-full">
                  {/* Ghost suggestion */}
                  {emailSuggestion && (
                    <div className="absolute inset-0 flex items-center pointer-events-none select-none">
                      <span className="font-light text-base">
                        <span className="text-white">{email}</span>
                        <span className="text-gray-600">{emailSuggestion.slice(email.length)}</span>
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Patient Email Address"
                    className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-light relative z-10"
                    value={email}
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
            </div>

            {/* PASSWORD with inline red error */}
            <div>
              <div className={`flex items-center bg-black/40 border p-4 rounded-xl transition-colors
                ${passError
                  ? "border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.12)]"
                  : "border-[#00d2ff]/20 hover:border-[#00d2ff]/50 focus-within:border-[#00d2ff] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                }`}
              >
                <FaLock className={`mr-3 shrink-0 ${passError ? "text-red-400" : "text-[#00d2ff]"}`} />
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Account Password"
                  className="bg-transparent outline-none w-full text-white placeholder-gray-500 font-light"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (passError) setPassError(""); }}
                />
              </div>

              {/* Inline animated error */}
              <AnimatePresence>
                {passError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-2 ml-1 flex items-center gap-2 text-red-400 text-xs font-semibold overflow-hidden"
                  >
                    <FiAlertCircle className="shrink-0" />
                    {passError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] py-4 rounded-xl font-bold text-lg mt-8 shadow-[0_10px_20px_rgba(0,210,255,0.3)] hover:shadow-[0_15px_30px_rgba(0,210,255,0.5)] transition-all transform hover:-translate-y-[2px]"
            >
              Access Medical Portal
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Unregistered patient?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#00d2ff] font-semibold cursor-pointer hover:underline"
            >
              Enroll today
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}