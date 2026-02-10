import { useState } from "react";
import API from "./Api/api";
import { Camera, Loader2, CheckCircle, XCircle } from "lucide-react";

function Attendance() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const startAttendance = async () => {
    setLoading(true);
    setStatus({
      type: "info",
      text: "Camera is opening… Press ESC to stop attendance",
    });

    try {
      await API.post("/mark-attendance");
      setStatus({
        type: "success",
        text: "Attendance session completed successfully",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: "Failed to mark attendance. Check camera or backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617, #020617, #020617)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, Arial, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 0 40px rgba(34,211,238,0.25)",
          border: "1px solid rgba(34,211,238,0.25)",
          color: "white",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Camera size={42} color="#22d3ee" />
          <h2
            style={{
              marginTop: 12,
              fontSize: 22,
              fontWeight: 700,
              color: "#22d3ee",
              letterSpacing: 1,
            }}
          >
            LIVE ATTENDANCE
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>
            Smart Face Recognition System
          </p>
        </div>

        {/* STATUS MESSAGE */}
        {status && (
          <div
            style={{
              marginBottom: 18,
              padding: "12px 14px",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background:
                status.type === "success"
                  ? "rgba(34,197,94,0.15)"
                  : status.type === "error"
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(234,179,8,0.15)",
              color:
                status.type === "success"
                  ? "#22c55e"
                  : status.type === "error"
                  ? "#ef4444"
                  : "#eab308",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {status.type === "success" && <CheckCircle size={18} />}
            {status.type === "error" && <XCircle size={18} />}
            {status.type === "info" && <Loader2 size={18} />}
            {status.text}
          </div>
        )}

        {/* ACTION BUTTON */}
        <button
          onClick={startAttendance}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            background: loading
              ? "#475569"
              : "linear-gradient(135deg, #22d3ee, #0ea5e9)",
            color: "#020617",
            fontSize: 16,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.3s ease",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={18} />
              Attendance Running…
            </>
          ) : (
            <>
              <Camera size={18} />
              Start Attendance
            </>
          )}
        </button>

        {/* FOOTER NOTE */}
        <p
          style={{
            marginTop: 18,
            fontSize: 12,
            color: "#64748b",
            textAlign: "center",
          }}
        >
          ℹ Camera opens on the server system. Press <b>ESC</b> to stop.
        </p>
      </div>

      {/* SIMPLE SPINNER ANIMATION */}
      <style>
        {`
          .spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Attendance;
