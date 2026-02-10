import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  UserCheck,
  BarChart3,
  Menu,
  X,
  Cpu,
  Activity,
  Users,
} from "lucide-react";

function Navbar({
  modelName = "SmartAttendance v1.0",
  systemOnline = true,
  fps = 0,
  gpu = false,
  present = 120,
  absent = 8,
  accuracy = 98.5,
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]"
      : "text-gray-300 hover:text-cyan-300";

  const routes = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Mark Attendance", path: "/attendance", icon: <UserCheck className="w-4 h-4" /> },
    { name: "Add Student", path: "/add-student", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <nav className="relative z-50 font-mono">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-600/30 to-pink-500/30 blur-xl opacity-40" />

      {/* TOP BAR */}
      <div className="relative bg-black/85 backdrop-blur-xl border border-cyan-500/30 px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_12px_#22d3ee]" />
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider">
              Smart<span className="text-cyan-400">Attendance</span>
            </h1>
            <p className="text-xs tracking-widest text-cyan-400 uppercase">
              {modelName} • REAL-TIME
            </p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10 text-sm">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`${isActive(route.path)} flex items-center gap-1 transition-colors`}
            >
              {route.icon} {route.name}
            </Link>
          ))}
        </div>

        {/* DESKTOP STATS */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <div className={`flex items-center gap-2 ${systemOnline ? "text-green-400" : "text-red-400"}`}>
            <span className={`w-2 h-2 rounded-full ${systemOnline ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            {systemOnline ? "System ON" : "OFF"}
          </div>
          <div className="flex items-center gap-1 text-purple-400">
            <Activity className="w-4 h-4 animate-pulse" /> {fps.toFixed(1)} FPS
          </div>
          <div className="flex items-center gap-1 text-green-400">
            <UserCheck className="w-4 h-4" /> {present} Present
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <Users className="w-4 h-4" /> {absent} Absent
          </div>
          <div className="flex items-center gap-1 text-cyan-400">
            <Cpu className="w-4 h-4" /> {accuracy}% Accuracy
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white focus:outline-none">
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
            {open ? <X size={26} className="text-cyan-400" /> : <Menu size={26} />}
          </motion.div>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="md:hidden absolute top-full left-0 w-full overflow-hidden bg-black/90 backdrop-blur-2xl border-b border-cyan-500/30 shadow-2xl"
          >
            <div className="px-8 py-8 flex flex-col gap-6">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] opacity-50" />

              {routes.map((route, idx) => (
                <motion.div
                  key={route.path}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={route.path}
                    onClick={() => setOpen(false)}
                    className={`text-lg uppercase tracking-tighter font-bold ${isActive(route.path)}`}
                  >
                    {route.name}
                  </Link>
                </motion.div>
              ))}

              {/* MOBILE STATS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px] text-cyan-400/80"
              >
                <div className="flex flex-col">
                  <span className="text-gray-500 uppercase text-[9px]">Engine</span>
                  <span className="text-white">{modelName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 uppercase text-[9px]">Performance</span>
                  <span className="text-white">{fps.toFixed(1)} FPS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 uppercase text-[9px]">Present</span>
                  <span className="text-green-400">{present}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 uppercase text-[9px]">Absent</span>
                  <span className="text-red-400">{absent}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;