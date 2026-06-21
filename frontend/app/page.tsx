"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { FlipWords } from "@/components/ui/flip-words";

const flipWords = ["Debate", "Collaborate", "Reason", "Synthesize", "Argue"];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Upload Documents",
    desc: "Drop in 2–3 PDF or TXT files and assign each one a unique AI persona.",
    color: "#22d3ee",
    colorFaded: "rgba(34,211,238,0.08)",
    borderColor: "rgba(34,211,238,0.15)",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Multi-Agent Debate",
    desc: "Watch your documents argue, agree, and build on each other across 2 rounds.",
    color: "#a78bfa",
    colorFaded: "rgba(167,139,250,0.08)",
    borderColor: "rgba(167,139,250,0.15)",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    title: "Deep Reasoning",
    desc: "Peek behind the curtain — see the model's chain-of-thought before every answer.",
    color: "#fbbf24",
    colorFaded: "rgba(251,191,36,0.08)",
    borderColor: "rgba(251,191,36,0.15)",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Final Synthesis",
    desc: "A Moderator AI reads all rounds and produces one unified, authoritative conclusion.",
    color: "#4ade80",
    colorFaded: "rgba(74,222,128,0.08)",
    borderColor: "rgba(74,222,128,0.15)",
  },
];

const processSteps = [
  { step: "01", title: "Upload", desc: "Drop PDFs or TXT files" },
  { step: "02", title: "Assign", desc: "Name your AI personas" },
  { step: "03", title: "Question", desc: "Ask what to debate" },
  { step: "04", title: "Watch", desc: "AI agents debate live" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden noise-overlay" style={{ background: "var(--surface-0)" }}>
      <StarsBackground />
      <ShootingStars />

      {/* ── Large ambient gradient blobs ── */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <img src="/docmeet.png" alt="DocuMeet AI" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-bold text-white text-base tracking-tight">DocuMeet AI</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-neutral-500 text-sm hover:text-neutral-300 transition-colors hidden sm:block">Features</a>
          <a href="#process" className="text-neutral-500 text-sm hover:text-neutral-300 transition-colors hidden sm:block">Process</a>
          <Link
            href="/setup"
            id="nav-get-started"
            className="px-5 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.15))", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="text-neutral-500 text-sm font-medium tracking-widest uppercase mb-8">
            Multi-Agent Document Intelligence
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-[5.2rem] font-extrabold tracking-tight leading-[1.05] mb-6">
            <span className="gradient-text">Let Your Documents</span>
            <br />
            <span className="gradient-text-brand inline-block" style={{ minWidth: "280px", textAlign: "center" }}>
              <FlipWords words={flipWords} duration={2500} />
            </span>
          </h1>

          <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            Upload your documents, assign them AI personas, and watch them
            collaborate and argue to solve your toughest questions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              id="hero-start-btn"
              className="group relative px-10 py-4 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                boxShadow: "0 4px 30px rgba(167,139,250,0.3), 0 0 60px rgba(34,211,238,0.1)",
              }}
            >
              Start a Debate
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="#features"
              id="hero-learn-btn"
              className="px-10 py-4 rounded-xl font-semibold text-neutral-400 text-base hover:text-white transition-all duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              Learn more
            </a>
          </div>
        </motion.div>

        {/* Fading divider */}
        <div className="divider-gradient w-full max-w-4xl mt-28" />
      </section>

      {/* ── Process Steps ── */}
      <section id="process" className="relative z-10 px-6 pb-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-neutral-600 text-xs font-medium tracking-widest uppercase mb-3">How it works</p>
          <h2 className="text-2xl font-bold gradient-text">Four simple steps</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {processSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-5 group hover:border-white/12 transition-all duration-300"
            >
              <div
                className="text-xl font-black mb-3 tabular-nums gradient-text-brand"
                style={{ fontSize: "1.4rem" }}
              >
                {s.step}
              </div>
              <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
              <p className="text-neutral-600 text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-6 pb-28 max-w-5xl mx-auto w-full">
        <div className="divider-gradient w-full mb-20" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-neutral-600 text-xs font-medium tracking-widest uppercase mb-3">Capabilities</p>
          <h2 className="text-3xl font-bold gradient-text">Everything you need</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              id={`feature-card-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="feature-card relative rounded-2xl p-6 overflow-hidden cursor-default group"
              style={{ background: "var(--surface-1)", border: `1px solid ${f.borderColor}` }}
            >
              {/* Corner glow */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-40 pointer-events-none transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: f.colorFaded.replace("0.08", "0.2") }}
              />

              <div className="relative flex items-start gap-4">
                <div
                  className="feature-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                  style={{ background: f.colorFaded, color: f.color, border: `1px solid ${f.borderColor}` }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4">
          {[
            { value: "2–3", label: "AI Personas", color: "#22d3ee" },
            { value: "2", label: "Debate Rounds", color: "#a78bfa" },
            { value: "1", label: "Synthesis", color: "#4ade80" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl py-8 px-6 text-center group hover:border-white/10 transition-all duration-300"
            >
              <div
                className="text-4xl md:text-5xl font-extrabold mb-2 tabular-nums"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-neutral-500 text-xs font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="divider-gradient w-full mt-20 mb-14" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-neutral-500 text-sm mb-6">Ready to see your documents debate?</p>
          <Link
            href="/setup"
            id="bottom-cta"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
              boxShadow: "0 4px 40px rgba(167,139,250,0.25)",
            }}
          >
            Launch DocuMeet →
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-8 border-t border-white/[0.04]">
        <p className="text-neutral-700 text-xs">DocuMeet AI · Powered by NVIDIA NIM</p>
      </footer>
    </main>
  );
}
