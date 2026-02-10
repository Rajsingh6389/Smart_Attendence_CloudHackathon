import { Cpu, Activity, Camera, AlertTriangle, Wifi, Users, UserCheck } from "lucide-react";

function Footer({
  modelName = "SmartAttendance v1.0",
  systemOnline = true,
  fps = 0,
  cameraOnline = false,
  violations = 0,
  backendOnline = false,
  present = 120,
  absent = 8,
  accuracy = 98.5,
  author = "Raj Singh",
}) {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 font-mono h-[60px] max-h-[60px]">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-40" />

      <div
        className="relative h-full bg-black/90 backdrop-blur-xl
                   border-t border-cyan-500/30
                   px-3 sm:px-4
                   flex items-center justify-between
                   text-[10px] sm:text-xs text-gray-300"
      >
        {/* Left */}
        <div className="flex items-center gap-2 shrink-0">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-400">{modelName}</span>
          <span className="hidden md:inline text-gray-500"> • Attendance Engine</span>
        </div>

        {/* Center */}
        <div className="hidden sm:flex items-center gap-3 md:gap-5">
          <span className={systemOnline ? "text-green-400" : "text-red-400"}>
            <Activity className="inline w-3 h-3 animate-pulse" /> {systemOnline ? "System ON" : "System OFF"}
          </span>

          <span className="text-purple-400">{fps.toFixed(1)} FPS</span>

          <span className={cameraOnline ? "text-green-400" : "text-red-400"}>
            <Camera className="inline w-3 h-3" /> Camera
          </span>

          <span className="text-green-400">
            <UserCheck className="inline w-3 h-3" /> {present} Present
          </span>

          <span className="text-red-400">
            <Users className="inline w-3 h-3" /> {absent} Absent
          </span>

          <span className="text-cyan-400">{accuracy}% Accuracy</span>

          <span className={backendOnline ? "text-green-400" : "text-red-400"}>
            <Wifi className="inline w-3 h-3" /> {backendOnline ? "DB Online" : "DB Offline"}
          </span>

          <span className="text-red-400">
            <AlertTriangle className="inline w-3 h-3" /> {violations} Violations
          </span>
        </div>

        {/* Right */}
        <div className="text-right shrink-0">
          <div className="text-gray-400 leading-none">© {new Date().getFullYear()}</div>
          <div className="text-cyan-400 text-[9px] leading-none">{author}</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;