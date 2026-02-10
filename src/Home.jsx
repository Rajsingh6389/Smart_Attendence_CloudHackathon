import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, UserCheck, UserPlus, ScanFace, Info, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL =
  "https://snndcpee7a.execute-api.ap-south-1.amazonaws.com/prod/analyze";

const Home = () => {
  const navigate = useNavigate();

  /* ---------------- TYPEWRITER ---------------- */
  const fullText = "SMART ATTENDANCE ACTIVE";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i = (i + 1) % (fullText.length + 1);
    }, 140);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- STATES ---------------- */
  const [image, setImage] = useState(null);
  const [focused, setFocused] = useState(null);
  const [distracted, setDistracted] = useState(null);
  const [faces, setFaces] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [uiMessage, setUiMessage] = useState(null);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  /* ---------------- AUTO HIDE MESSAGE ---------------- */
  useEffect(() => {
    if (!uiMessage) return;
    const t = setTimeout(() => setUiMessage(null), 3000);
    return () => clearTimeout(t);
  }, [uiMessage]);

  /* ---------------- IMAGE → BASE64 ---------------- */
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  /* ---------------- ANALYZE IMAGE ---------------- */
  const analyzeImage = async () => {
    if (!image) {
      setUiMessage({
        type: "info",
        text: "Please upload a classroom image first",
      });
      return;
    }

    setAnalyzing(true);
    setFocused(null);
    setDistracted(null);
    setFaces([]);

    try {
      const base64 = await convertToBase64(image);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();

      setFocused(data.focused);
      setDistracted(data.distracted);
      setFaces(data.faces || []);
    } catch {
      setUiMessage({
        type: "error",
        text: "Analysis failed. Please try again.",
      });
    }

    setAnalyzing(false);
  };

  /* ---------------- DRAW FACE BOXES ---------------- */
  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const w = img.clientWidth;
      const h = img.clientHeight;

      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      faces.forEach((face, i) => {
        const x = face.left * w;
        const y = face.top * h;
        const bw = face.width * w;
        const bh = face.height * h;

        const color =
          face.emotion === "HAPPY" || face.emotion === "CALM"
            ? "#22c55e"
            : "#ef4444";

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, bw, bh);

        ctx.fillStyle = color;
        ctx.font = "12px monospace";
        ctx.fillText(
          `${i + 1}: ${face.emotion}`,
          x + 4,
          y - 6 < 12 ? y + 14 : y - 6
        );
      });
    };

    if (img.complete) draw();
    else img.onload = draw;

    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [faces]);

  /* ---------------- ENGAGEMENT ---------------- */
  const engagementScore =
    focused !== null && focused + distracted > 0
      ? Math.round((focused / (focused + distracted)) * 100)
      : null;

  const engagementStatus =
    engagementScore >= 75
      ? "Highly Engaged"
      : engagementScore >= 45
      ? "Moderately Engaged"
      : "Needs Attention";

  const pieData =
    focused !== null && {
      labels: ["Focused", "Distracted"],
      datasets: [
        {
          data: [focused, distracted],
          backgroundColor: ["#22c55e", "#ef4444"],
        },
      ],
    };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="min-h-[3.5rem] mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-widest">
            {displayText}
            <span className="opacity-30">
              {fullText.slice(displayText.length)}
            </span>
          </h2>
        </div>

        {/* NAV BAR */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button className="btn" onClick={() => navigate("/attendance")}>
            <UserCheck size={16} /> Attendance
          </button>

          <button className="btn" onClick={() => navigate("/dashboard")}>
            <Activity size={16} /> Dashboard
          </button>

          <button className="btn" onClick={() => navigate("/add-student")}>
            <UserPlus size={16} /> Add Student
          </button>

          <button
            className="btn border-purple-500/40 text-purple-400 hover:border-purple-500"
            onClick={() => navigate("/about")}
          >
            <Info size={16} /> About System
          </button>
        </div>

        {/* PANEL */}
        <div className="border border-cyan-500/30 p-5 rounded bg-black/40">
          <h3 className="flex items-center gap-2 text-cyan-400 mb-4">
            <ScanFace size={18} /> Classroom Engagement Analysis
          </h3>

          {/* MESSAGE */}
          <AnimatePresence>
            {uiMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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

          {/* INPUT */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <button
              onClick={analyzeImage}
              disabled={analyzing}
              className="px-4 py-2 border border-cyan-500 text-cyan-400"
            >
              {analyzing ? "Analyzing..." : "Analyze Engagement"}
            </button>
          </div>

          {focused !== null && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-green-400">
                  Focused Students: <b>{focused}</b>
                </p>
                <p className="text-red-400 mb-4">
                  Distracted Students: <b>{distracted}</b>
                </p>

                <div className="border border-cyan-500/30 rounded p-4 mb-6">
                  <p className="text-cyan-400">Engagement Level</p>
                  <p className="text-3xl font-bold">{engagementScore}%</p>
                  <p className="text-sm text-cyan-300">
                    Status: {engagementStatus}
                  </p>
                </div>

                <div className="max-w-xs">
                  <Pie data={pieData} />
                </div>
              </div>

              <div className="relative w-full">
                <img
                  ref={imageRef}
                  src={URL.createObjectURL(image)}
                  alt="classroom"
                  className="w-full rounded border border-cyan-500/30"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* 🔐 GLOBAL SYSTEM NOTICE (ALL PAGES APPLY) */}
        <div className="mt-10 rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="mt-0.5" />
            <p>
              <b>System Notice:</b> All modules in this application (Attendance,
              Dashboard, Add Student, and Analysis) are designed to work with
              camera-based face recognition executed on authorized local systems.
              The web interface is used for control, visualization, and
              monitoring only.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
