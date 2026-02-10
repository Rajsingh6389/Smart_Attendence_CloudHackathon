import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "./Api/api";
import {
  UserPlus,
  Camera,
  Cpu,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    course: "",
    batch: "",
    department: "",
    section: "",
  });

  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uiMessage, setUiMessage] = useState(null);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [modelTrained, setModelTrained] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD STUDENT
  const addStudent = async () => {
    if (!form.name || !form.roll) {
      setUiMessage({ type: "error", text: "Name and Roll are required" });
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/add-student", form);
      setStudentId(res.data.student_id);
      setUiMessage({ type: "success", text: "Student added successfully" });
    } catch {
      setUiMessage({ type: "error", text: "Error adding student" });
    } finally {
      setLoading(false);
    }
  };

  // CAPTURE FACE
  const captureFace = async () => {
    try {
      setUiMessage({
        type: "info",
        text: "Camera opening… Press ESC to stop",
      });
      await API.post(`/capture-face/${studentId}`);
      setFaceCaptured(true);
      setUiMessage({
        type: "success",
        text: "Face captured successfully",
      });
    } catch {
      setUiMessage({ type: "error", text: "Face capture failed" });
    }
  };

  // TRAIN MODEL
  const trainModel = async () => {
    if (!faceCaptured) {
      setUiMessage({ type: "error", text: "Capture face first" });
      return;
    }

    try {
      setUiMessage({ type: "info", text: "Training model…" });
      await API.post("/train-model");
      setModelTrained(true);
      setUiMessage({
        type: "success",
        text: "Model trained successfully",
      });
    } catch {
      setUiMessage({ type: "error", text: "Model training failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl rounded-2xl border border-cyan-500/30 bg-black/70 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(34,211,238,0.25)] text-white"
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
            <UserPlus className="text-cyan-400" size={30} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-wider">
            Add Student
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Student Registration & Face Training
          </p>
        </div>

        {/* INFO NOTICE */}
        <div className="mb-5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-300 text-xs sm:text-sm">
          <div className="flex gap-2 items-start">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>
              Student must be added first, then face capture and model training
              must be completed on an authorized local system.
            </span>
          </div>
        </div>

        {/* MESSAGE */}
        <AnimatePresence>
          {uiMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`mb-4 px-4 py-2 rounded border text-sm ${
                uiMessage.type === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : uiMessage.type === "success"
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
              }`}
            >
              {uiMessage.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {["name", "roll"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              className="px-3 py-2 rounded border border-cyan-500/30 bg-black/40 text-white focus:outline-none"
            />
          ))}
        </div>

        {/* SELECTS */}
        {[
          ["course", ["B.Tech", "M.Tech", "MBA"]],
          ["department", ["CSE", "ECE", "ME", "CE"]],
          ["batch", ["2024", "2025", "2026"]],
          ["section", ["A", "B", "C"]],
        ].map(([name, options]) => (
          <select
            key={name}
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 rounded border border-cyan-500/30 bg-black/40 text-white"
          >
            <option value="">Select {name}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}

        {/* ADD STUDENT BUTTON */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          onClick={addStudent}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-black font-bold mb-4 disabled:opacity-60"
        >
          {loading ? "Saving…" : "Add Student"}
        </motion.button>

        {/* AFTER ADD */}
        {studentId && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-cyan-300 text-center">
              Student ID: <b>{studentId}</b>
            </p>

            {faceCaptured && (
              <p className="flex items-center gap-2 text-green-400 text-sm justify-center">
                <CheckCircle size={16} /> Face Captured
              </p>
            )}

            {modelTrained && (
              <p className="flex items-center gap-2 text-purple-400 text-sm justify-center">
                <CheckCircle size={16} /> Model Trained
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={captureFace}
              className="w-full py-2 rounded border border-green-500 text-green-400 flex items-center justify-center gap-2"
            >
              <Camera size={16} /> Capture Face
            </motion.button>

            <motion.button
              whileHover={{ scale: faceCaptured ? 1.04 : 1 }}
              disabled={!faceCaptured}
              onClick={trainModel}
              className={`w-full py-2 rounded flex items-center justify-center gap-2 ${
                faceCaptured
                  ? "border border-purple-500 text-purple-400"
                  : "border border-gray-600 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Cpu size={16} /> Train Model
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AddStudent;
