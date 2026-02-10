import { useState } from "react";
import API from "./Api/api";
import {
  Camera,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Attendance() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const startAttendance = async () => {
    setLoading(true);
    setStatus({
      type: "info",
      text: "Initializing attendance session…",
    });

    try {
      await API.post("/mark-attendance");
      setStatus({
        type: "success",
        text: "Attendance session completed successfully",
      });
    } catch {
      setStatus({
        type: "error",
        text:
          "Attendance cannot be started from the web. Camera-based face recognition runs only on authorized local systems.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-black/70 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.25)] text-white"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
            <Camera size={30} className="text-cyan-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wide">
            Live Attendance
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Smart Face Recognition System
          </p>
        </div>

        {/* ACCESS NOTICE */}
        <div className="mb-5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-300 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <span>
              <b>Important:</b> Attendance capture requires direct camera access
              and OpenCV execution. This feature works only on authorized local
              systems. The web interface is for monitoring and control only.
            </span>
          </div>
        </div>

        {/* STATUS MESSAGE */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mb-5 rounded-lg border p-3 text-sm flex items-center gap-2 ${
                status.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : status.type === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
              }`}
            >
              {status.type === "success" && <CheckCircle size={18} />}
              {status.type === "error" && <XCircle size={18} />}
              {status.type === "info" && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {status.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTION BUTTON */}
        <button
          onClick={startAttendance}
          disabled={loading}
          className={`w-full rounded-xl py-3 text-base font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            loading
              ? "bg-slate-600 cursor-not-allowed text-slate-200"
              : "bg-gradient-to-r from-cyan-400 to-sky-500 text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Initializing…
            </>
          ) : (
            <>
              <Camera size={18} />
              Start Attendance
            </>
          )}
        </button>

        {/* FOOTER */}
        <p className="mt-5 text-center text-xs text-slate-400">
          ℹ Attendance capture runs on the <b>local system</b> with camera access.
          Press <b>ESC</b> to stop the session.
        </p>
      </motion.div>
    </div>
  );
}

export default Attendance;
