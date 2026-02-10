import { useEffect, useState } from "react";
import API from "./Api/api";
import { Activity, Camera, Cpu, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  // -----------------------------
  // STATES
  // -----------------------------
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

  // -----------------------------
  // FETCH ATTENDANCE
  // -----------------------------
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/dashboard", { params: filters });
      setAttendance(res.data);
    } catch {
      setUiMessage({ type: "error", text: "Failed to load attendance data" });
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const resetFilters = () => {
    setFilters({ course: "", department: "", batch: "", section: "" });
  };

  // -----------------------------
  // FETCH UNTRAINED STUDENTS
  // -----------------------------
  const fetchUntrained = async () => {
    try {
      const res = await API.get("/students/untrained");
      setUntrained(res.data);
      setShowUntrained(true);
    } catch {
      setUiMessage({ type: "error", text: "Failed to load untrained students" });
    }
  };

  // -----------------------------
  // CAPTURE FACE
  // -----------------------------
  const captureFace = async () => {
    if (!studentId) {
      setUiMessage({ type: "error", text: "Enter Student ID first" });
      return;
    }
    try {
      setUiMessage({ type: "info", text: "Camera opening... Press ESC" });
      await API.post(`/capture-face/${studentId}`);
      setFaceCaptured(true);
      setUiMessage({ type: "success", text: "Face captured successfully" });
    } catch {
      setUiMessage({ type: "error", text: "Face capture failed" });
    }
  };

  // -----------------------------
  // TRAIN MODEL
  // -----------------------------
  const trainModel = async () => {
    if (!faceCaptured) {
      setUiMessage({ type: "error", text: "Capture face before training" });
      return;
    }
    try {
      setUiMessage({ type: "info", text: "Training model..." });
      await API.post("/train-model");
      setUiMessage({ type: "success", text: "Model trained successfully" });
      setFaceCaptured(false);
      setStudentId("");
      fetchUntrained();
      fetchAttendance();
    } catch {
      setUiMessage({ type: "error", text: "Model training failed" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono px-4 py-6">
      <div className="max-w-7xl mx-auto border border-cyan-500/30 rounded p-6 bg-black/70">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
          <Activity className="animate-pulse" /> Dashboard
        </h2>

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
                  : "border-cyan-500 text-cyan-300 bg-cyan-500/10"
              }`}
            >
              {uiMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= FACE TRAINING PANEL ================= */}
        <div className="border border-purple-500/30 rounded p-4 mb-8 bg-black/50">
          <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={16} /> Train Face (Untrained Student)
          </h3>

          <div className="flex flex-wrap gap-3 items-center">
            <input
              placeholder="Enter Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="px-3 py-2 rounded border border-gray-600 bg-black/40 text-white"
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

        {/* ================= UNTRAINED STUDENTS ================= */}
        <button
          onClick={fetchUntrained}
          className="mb-6 px-4 py-2 border border-orange-500 text-orange-400 rounded"
        >
          Show Untrained Students
        </button>

        {showUntrained && (
          <div className="mb-10 border border-orange-500/30 rounded p-4 bg-black/60">
            <h3 className="text-orange-400 font-bold mb-3">
              Students Without Face Training
            </h3>

            {untrained.length === 0 ? (
              <p className="text-green-400">✅ All students are trained</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-orange-600/20 text-orange-300">
                  <tr>
                    {["ID","Name","Roll","Course","Dept","Batch","Section","Status"].map(h => (
                      <th key={h} className="px-3 py-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {untrained.map((s) => (
                    <tr key={s.id} className="border-t border-orange-500/20">
                      <td className="px-3 py-2">{s.id}</td>
                      <td className="px-3 py-2">{s.name}</td>
                      <td className="px-3 py-2">{s.roll}</td>
                      <td className="px-3 py-2">{s.course}</td>
                      <td className="px-3 py-2">{s.department}</td>
                      <td className="px-3 py-2">{s.batch}</td>
                      <td className="px-3 py-2">{s.section}</td>
                      <td className="px-3 py-2 text-red-400 font-bold">
                        ❌ Not Trained
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ================= ATTENDANCE FILTERS ================= */}
        <div className="flex flex-wrap gap-4 mb-6">
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
          <button
            onClick={fetchAttendance}
            className="px-4 py-2 bg-green-500 text-black font-bold rounded"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Reset
          </button>
        </div>

        {/* ================= ATTENDANCE TABLE ================= */}
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-cyan-600 to-purple-600">
            <tr>
              {["id","Name","Roll","Course","Department","Batch","Section","Status","Time"].map(h => (
                <th key={h} className="px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendance.map((s, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-black/40" : "bg-black/60"}>
                <td className="px-4 py-2">{s.id}</td>
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.roll}</td>
                <td className="px-4 py-2">{s.course}</td>
                <td className="px-4 py-2">{s.department}</td>
                <td className="px-4 py-2">{s.batch}</td>
                <td className="px-4 py-2">{s.section}</td>
                <td className={`px-4 py-2 font-bold ${
                  s.status === "Present" ? "text-green-400" : "text-red-400"
                }`}>
                  {s.status}
                </td>
                <td className="px-4 py-2">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Dashboard;
