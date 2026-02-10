import { useEffect, useState } from "react";
import API from "./Api/api";
import { Activity, Camera, Cpu, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  // ================= STATES =================
  const [attendance, setAttendance] = useState([]);
  const [untrained, setUntrained] = useState([]);
  const [showUntrained, setShowUntrained] = useState(false);

  const [filters, setFilters] = useState({
    course: "",
    department: "",
    batch: "",
    section: "",
  });

  const [studentId, setStudentId] = useState("");
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [uiMessage, setUiMessage] = useState(null);

  // ================= FETCH ATTENDANCE (FIXED) =================
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/dashboard", { params: filters });

      if (!res.data || res.data.length === 0) {
        setAttendance([]);
        setUiMessage({
          type: "info",
          text:
            "Attendance data is not available. This project uses local camera-based face recognition, which cannot run directly from a web environment.",
        });
      } else {
        setAttendance(res.data);
        setUiMessage(null);
      }
    } catch {
      setAttendance([]);
      setUiMessage({
        type: "error",
        text:
          "Data could not be fetched because camera and OpenCV processing run only on authorized local systems.",
      });
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const resetFilters = () => {
    setFilters({ course: "", department: "", batch: "", section: "" });
  };

  // ================= FETCH UNTRAINED =================
  const fetchUntrained = async () => {
    try {
      const res = await API.get("/students/untrained");
      setUntrained(res.data);
      setShowUntrained(true);
    } catch {
      setUiMessage({
        type: "error",
        text: "Failed to load untrained students",
      });
    }
  };

  // ================= FACE CAPTURE =================
  const captureFace = async () => {
    if (!studentId) {
      setUiMessage({ type: "error", text: "Enter Student ID first" });
      return;
    }
    try {
      setUiMessage({
        type: "info",
        text: "Camera opening... Press ESC to capture images",
      });
      await API.post(`/capture-face/${studentId}`);
      setFaceCaptured(true);
      setUiMessage({
        type: "success",
        text: "Face captured successfully",
      });
    } catch {
      setUiMessage({
        type: "error",
        text: "Face capture failed (camera must run locally)",
      });
    }
  };

  // ================= TRAIN MODEL =================
  const trainModel = async () => {
    if (!faceCaptured) {
      setUiMessage({
        type: "error",
        text: "Capture face before training",
      });
      return;
    }
    try {
      setUiMessage({ type: "info", text: "Training model..." });
      await API.post("/train-model");
      setUiMessage({
        type: "success",
        text: "Model trained successfully",
      });
      setFaceCaptured(false);
      setStudentId("");
      fetchUntrained();
      fetchAttendance();
    } catch {
      setUiMessage({
        type: "error",
        text: "Model training failed (local execution required)",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono px-3 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto border border-cyan-500/30 rounded p-4 sm:p-6 bg-black/70">

        {/* TITLE */}
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
          <Activity className="animate-pulse" /> Faculty Dashboard
        </h2>

        {/* ACCESS NOTICE */}
        <div className="mb-6 px-4 py-3 rounded border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 text-sm">
          🔐 <b>Access Notice:</b> This system is intended for authorized faculty
          use only. Face recognition and attendance capture run on approved local
          systems. The web dashboard is used for viewing synchronized data.
        </div>

        {/* MESSAGE */}
        <AnimatePresence>
          {uiMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`mb-4 px-4 py-2 rounded border text-sm ${
                uiMessage.type === "error"
                  ? "border-red-500 text-red-400 bg-red-500/10"
                  : uiMessage.type === "success"
                  ? "border-green-500 text-green-400 bg-green-500/10"
                  : "border-yellow-500 text-yellow-300 bg-yellow-500/10"
              }`}
            >
              {uiMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= FACE TRAINING ================= */}
        <div className="border border-purple-500/30 rounded p-4 mb-8 bg-black/50">
          <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={16} /> Train Face (Untrained Student)
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full sm:w-60 px-3 py-2 rounded border border-gray-600 bg-black/40 text-white"
            />

            <button
              onClick={captureFace}
              className="px-4 py-2 border border-green-500 text-green-400 rounded flex items-center gap-2"
            >
              <Camera size={16} /> Capture Face
            </button>

            <button
              disabled={!faceCaptured}
              onClick={trainModel}
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                faceCaptured
                  ? "border border-purple-500 text-purple-400"
                  : "border border-gray-600 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Cpu size={16} /> Train Model
            </button>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {["course", "department", "batch", "section"].map((f) => (
            <input
              key={f}
              placeholder={`Filter by ${f}`}
              value={filters[f]}
              onChange={(e) =>
                setFilters({ ...filters, [f]: e.target.value })
              }
              className="px-3 py-2 rounded border border-gray-700 bg-black/40 text-gray-200"
            />
          ))}
        </div>

        {/* ================= ATTENDANCE TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gradient-to-r from-cyan-600 to-purple-600">
              <tr>
                {[
                  "ID",
                  "Name",
                  "Roll",
                  "Course",
                  "Department",
                  "Batch",
                  "Section",
                  "Status",
                  "Time",
                ].map((h) => (
                  <th key={h} className="px-4 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendance.map((s, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-black/40" : "bg-black/60"}
                >
                  <td className="px-4 py-2">{s.id}</td>
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.roll}</td>
                  <td className="px-4 py-2">{s.course}</td>
                  <td className="px-4 py-2">{s.department}</td>
                  <td className="px-4 py-2">{s.batch}</td>
                  <td className="px-4 py-2">{s.section}</td>
                  <td
                    className={`px-4 py-2 font-bold ${
                      s.status === "Present"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {s.status}
                  </td>
                  <td className="px-4 py-2">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= WHY DATA NOT FETCHED ================= */}
        {attendance.length === 0 && (
          <div className="mt-6 px-4 py-3 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm">
            ⚠️ <b>Why is attendance not visible?</b>
            <br />
            Face recognition and attendance capture are executed only on
            authorized local systems with camera access. When accessed purely
            through the web, OpenCV-based processing is restricted, so attendance
            data will appear only after synchronization from a local system.
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
