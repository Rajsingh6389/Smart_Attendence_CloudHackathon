import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Linkedin,
  Github,
  Code,
  Home,
  Cpu,
  Camera,
  Activity,
  ScanFace,
} from "lucide-react";
import Particles from "react-tsparticles";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function About() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full shadow-[0_0_40px_#06b6d4]"
        />
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">

      {/* 🌌 Particle Background */}
      <Particles
        className="absolute inset-0"
        options={{
          background: { color: "black" },
          fpsLimit: 60,
          particles: {
            number: { value: 80 },
            size: { value: 2 },
            move: { enable: true, speed: 1 },
            links: { enable: true, color: "#06b6d4" },
            color: { value: ["#06b6d4", "#a855f7", "#ec4899"] },
          },
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto space-y-32">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-6">
            About <span className="text-cyan-400">SmartAttend AI</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed">
            A real-time{" "}
            <span className="text-cyan-400">AI-powered Smart Attendance System</span>{" "}
            that uses Facial Recognition and Emotion Analysis to automate attendance,
            monitor engagement, and deliver classroom intelligence in real-world conditions.
          </p>
        </motion.section>

        {/* PROJECT OVERVIEW */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="rounded-2xl bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-cyan-500/30 shadow-lg p-10"
        >
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <ShieldCheck /> System Initialization
          </h2>
          <pre className="text-green-400 text-sm leading-relaxed whitespace-pre-wrap">
{`> Booting SmartAttend AI...
> Initializing Face Detection Module...
> Loading In-the-Wild FER Model...
> Connecting Cloud Inference Endpoint...
> Real-time Classroom Analytics Ready.`}
          </pre>
        </motion.section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Camera,
              title: "Automated Attendance",
              desc: "Face recognition-based attendance without manual intervention",
            },
            {
              icon: ScanFace,
              title: "Emotion & Focus Analysis",
              desc: "In-the-wild FER model to measure attention and classroom engagement",
            },
            {
              icon: Activity,
              title: "Live Analytics Dashboard",
              desc: "Visual insights, statistics, and engagement reports for educators",
            },
          ].map((f, i) => (
            <Tilt key={i} tiltMaxAngleX={15} tiltMaxAngleY={15} glareEnable glareColor="white">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl p-6 bg-white/5 backdrop-blur-lg border border-white/20
                           hover:border-cyan-400 hover:shadow-[0_0_20px_#06b6d4] transition-all duration-300"
              >
                <f.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm">{f.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </section>

        {/* DEVELOPER */}
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareColor="cyan">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="rounded-2xl bg-gradient-to-br from-gray-800 via-black to-gray-900 border border-cyan-500/30 shadow-lg p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-[0_0_25px_#06b6d4]"
            />

            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              About the Developer
            </h2>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Hi, I’m <span className="text-cyan-400 font-semibold">Raj Singh</span>,  
              a Computer Science student passionate about Artificial Intelligence,
              Computer Vision, and Full-Stack Development.  
              I focus on building intelligent, scalable systems that solve real-world problems.
            </p>

            <div className="flex justify-center gap-4">
              <SocialLink
                href="https://www.linkedin.com/in/raj-singh-8b7457333/"
                icon={Linkedin}
                label="LinkedIn"
              />
              <SocialLink
                href="https://github.com/Rajsingh6389/"
                icon={Github}
                label="GitHub"
              />
              <SocialLink
                href="https://leetcode.com/u/rajsingh63/"
                icon={Code}
                label="LeetCode"
              />
            </div>
          </motion.section>
        </Tilt>

        {/* HOME BUTTON */}
        <motion.section whileHover={{ scale: 1.05 }} className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="relative px-8 py-4 rounded-xl font-semibold text-black bg-cyan-400
                       overflow-hidden group hover:shadow-[0_0_25px_#06b6d4]"
          >
            <span className="absolute inset-0 bg-white/30 scale-x-0 group-hover:scale-x-100
                             origin-left transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Home
            </span>
          </button>
        </motion.section>
      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                 border border-cyan-500/40 bg-black/50
                 hover:bg-cyan-500/10 hover:scale-105 transition-all"
    >
      <Icon className="w-4 h-4 text-cyan-400" />
      {label}
    </a>
  );
}

export default About;
