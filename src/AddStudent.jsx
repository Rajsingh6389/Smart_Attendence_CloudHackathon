import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "./Api/api";
import { UserPlus, Camera, Cpu, CheckCircle } from "lucide-react";

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

  // -----------------------------
  // ADD STUDENT
  // -----------------------------
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

  // -----------------------------
  // CAPTURE FACE
  // -----------------------------
  const captureFace = async () => {
    try {
      setUiMessage({ type: "info", text: "Camera opening... Press ESC to stop" });
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
      setUiMessage({ type: "error", text: "Capture face first" });
      return;
    }

    try {
      setUiMessage({ type: "info", text: "Training model..." });
      await API.post("/train-model");
      setModelTrained(true);
      setUiMessage({ type: "success", text: "Model trained successfully" });
    } catch {
      setUiMessage({ type: "error", text: "Model training failed" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono px-4 py-6">
      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-cyan-400 tracking-widest mb-6 flex items-center gap-2">
          <UserPlus size={22} /> ADD STUDENT
        </h2>

        {/* PANEL */}
        <div className="border border-cyan-500/30 p-6 rounded bg-black/40">

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

          {/* INPUTS */}
          {["name", "roll"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 rounded border border-cyan-500/30 bg-black/40 text-white focus:outline-none"
            />
          ))}

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
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ))}

          {/* ADD STUDENT */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            onClick={addStudent}
            disabled={loading}
            className="w-full px-4 py-2 mt-2 border border-cyan-500 text-cyan-400 rounded"
          >
            {loading ? "Saving..." : "Add Student"}
          </motion.button>

          {/* AFTER ADD */}
          {studentId && (
            <div className="mt-6 space-y-3">

              <p className="text-sm text-cyan-300">
                Student ID: <b>{studentId}</b>
              </p>

              {/* FACE STATUS */}
              {faceCaptured && (
                <p className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} /> Face Captured
                </p>
              )}

              {modelTrained && (
                <p className="flex items-center gap-2 text-purple-400 text-sm">
                  <CheckCircle size={16} /> Model Trained
                </p>
              )}

              {/* CAPTURE FACE */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={captureFace}
                className="w-full px-4 py-2 border border-green-500 text-green-400 rounded flex items-center justify-center gap-2"
              >
                <Camera size={16} /> Capture Face
              </motion.button>

              {/* TRAIN MODEL */}
              <motion.button
                whileHover={{ scale: faceCaptured ? 1.04 : 1 }}
                disabled={!faceCaptured}
                onClick={trainModel}
                className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2
                  ${
                    faceCaptured
                      ? "border border-purple-500 text-purple-400"
                      : "border border-gray-600 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <Cpu size={16} /> Train Model
              </motion.button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AddStudent;
