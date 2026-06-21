"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { FileUpload } from "@/components/ui/file-upload";

const AGENT_STYLES = [
  {
    label: "Agent A",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.04)",
    bgActive: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.12)",
    borderActive: "rgba(34,211,238,0.35)",
    glow: "0 0 24px rgba(34,211,238,0.1)",
    glowActive: "0 0 24px rgba(34,211,238,0.2), 0 4px 16px rgba(34,211,238,0.06)",
    dot: "bg-cyan-400",
  },
  {
    label: "Agent B",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.04)",
    bgActive: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.12)",
    borderActive: "rgba(167,139,250,0.35)",
    glow: "0 0 24px rgba(167,139,250,0.1)",
    glowActive: "0 0 24px rgba(167,139,250,0.2), 0 4px 16px rgba(167,139,250,0.06)",
    dot: "bg-violet-400",
  },
  {
    label: "Agent C",
    color: "#4ade80",
    bg: "rgba(74,222,128,0.04)",
    bgActive: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.12)",
    borderActive: "rgba(74,222,128,0.35)",
    glow: "0 0 24px rgba(74,222,128,0.1)",
    glowActive: "0 0 24px rgba(74,222,128,0.2), 0 4px 16px rgba(74,222,128,0.06)",
    dot: "bg-emerald-400",
  },
];

interface DocFile {
  file: File;
  personaName: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<DocFile[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (files: File[]) => {
    setDocs((prev) => {
      const existing = prev.map((d) => d.file.name);
      const fresh: DocFile[] = files
        .filter((f) => !existing.includes(f.name))
        .map((f) => ({ file: f, personaName: "" }));
      return [...prev, ...fresh].slice(0, 3);
    });
    setError("");
  };

  const updatePersona = (idx: number, name: string) => {
    setDocs((prev) => prev.map((d, i) => (i === idx ? { ...d, personaName: name } : d)));
  };

  const canStart =
    docs.length >= 2 &&
    docs.every((d) => d.personaName.trim().length > 0) &&
    question.trim().length > 0;

  const completedSteps = [
    docs.length >= 2,
    docs.length > 0 && docs.every((d) => d.personaName.trim()),
    question.trim().length > 0,
  ].filter(Boolean).length;

  const handleStartDebate = async () => {
    if (!canStart) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      docs.forEach((d) => formData.append("files", d.file));
      const uploadRes = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.detail || "Upload failed");
      }
      const uploadData = await uploadRes.json();
      const agents = uploadData.documents.map(
        (doc: { full_text: string }, i: number) => ({ name: docs[i].personaName, text: doc.full_text })
      );
      sessionStorage.setItem("debateConfig", JSON.stringify({ agents, question }));
      router.push("/debate");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden noise-overlay" style={{ background: "var(--surface-0)" }}>
      <StarsBackground starDensity={0.00008} />
      <ShootingStars minDelay={3000} maxDelay={6000} />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/[0.04]">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/docmeet.png" alt="DocuMeet AI" className="w-7 h-7 rounded-md object-contain" />
          <span className="font-bold text-white text-sm tracking-tight">DocuMeet AI</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-300"
                  style={{
                    background: i < completedSteps ? "linear-gradient(135deg, #22d3ee, #a78bfa)" : "rgba(255,255,255,0.04)",
                    color: i < completedSteps ? "#fff" : "#525252",
                    border: `1px solid ${i < completedSteps ? "transparent" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {i < completedSteps ? "✓" : i + 1}
                </div>
                {i < 2 && <div className="w-4 h-px" style={{ background: i < completedSteps ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.06)" }} />}
              </div>
            ))}
          </div>
          <Link href="/" className="text-neutral-600 text-xs hover:text-neutral-400 transition-colors">← Back</Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold gradient-text mb-2">
            New Debate
          </h1>
          <p className="text-neutral-600 text-sm">
            Upload documents, assign AI personas, and ask your question.
          </p>
        </motion.div>

        {/* ── Step 1: Upload ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
              style={{
                background: docs.length >= 2 ? "linear-gradient(135deg, #22d3ee, #a78bfa)" : "rgba(255,255,255,0.04)",
                color: docs.length >= 2 ? "#fff" : "#525252",
                border: docs.length >= 2 ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {docs.length >= 2 ? "✓" : "1"}
            </div>
            <h2 className="text-white font-semibold text-sm">Upload Documents</h2>
            <span className="text-neutral-700 text-xs ml-auto">{docs.length}/3</span>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <FileUpload onChange={handleFileChange} maxFiles={3} />
          </div>
        </motion.section>

        {/* ── Step 2: Personas ── */}
        <AnimatePresence>
          {docs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: docs.every((d) => d.personaName.trim()) ? "linear-gradient(135deg, #22d3ee, #a78bfa)" : "rgba(255,255,255,0.04)",
                    color: docs.every((d) => d.personaName.trim()) ? "#fff" : "#525252",
                    border: docs.every((d) => d.personaName.trim()) ? "none" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {docs.every((d) => d.personaName.trim()) ? "✓" : "2"}
                </div>
                <h2 className="text-white font-semibold text-sm">Assign Personas</h2>
              </div>

              <div className="flex flex-col gap-3">
                {docs.map((doc, idx) => {
                  const style = AGENT_STYLES[idx];
                  const isActive = doc.personaName.trim().length > 0;
                  return (
                    <motion.div
                      key={doc.file.name + idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="relative rounded-xl overflow-hidden transition-all duration-400"
                      style={{
                        background: isActive ? style.bgActive : style.bg,
                        border: `1px solid ${isActive ? style.borderActive : style.border}`,
                        boxShadow: isActive ? style.glowActive : style.glow,
                      }}
                    >
                      {/* Top bar accent */}
                      <div className="h-[2px] w-full transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${style.color}, transparent)`, opacity: isActive ? 1 : 0.3 }} />

                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {/* Agent avatar */}
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-all duration-300"
                            style={{
                              background: isActive ? style.color : "rgba(255,255,255,0.04)",
                              color: isActive ? "#000" : style.color,
                              border: isActive ? "none" : `1px solid ${style.border}`,
                            }}
                          >
                            {isActive ? doc.personaName.charAt(0).toUpperCase() : (idx + 1).toString()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium truncate">{doc.file.name}</p>
                              {isActive && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
                              )}
                            </div>
                            <p className="text-neutral-600 text-xs mt-0.5">
                              {(doc.file.size / 1024).toFixed(1)} KB · {style.label}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: style.color, opacity: 0.7 }}>
                            Persona Name
                          </label>
                          <input
                            id={`persona-input-${idx}`}
                            type="text"
                            placeholder={`e.g. "The Critic", "The Optimist"`}
                            value={doc.personaName}
                            onChange={(e) => updatePersona(idx, e.target.value)}
                            className="w-full rounded-lg px-3 py-2.5 text-white text-sm placeholder-neutral-700 focus:outline-none transition-all duration-200"
                            style={{
                              background: "rgba(0,0,0,0.3)",
                              border: `1px solid ${isActive ? style.borderActive : "rgba(255,255,255,0.06)"}`,
                            }}
                            onFocus={(e) => (e.target.style.borderColor = style.borderActive)}
                            onBlur={(e) => (e.target.style.borderColor = isActive ? style.borderActive : "rgba(255,255,255,0.06)")}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Step 3: Question ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
              style={{
                background: question.trim() ? "linear-gradient(135deg, #22d3ee, #a78bfa)" : "rgba(255,255,255,0.04)",
                color: question.trim() ? "#fff" : "#525252",
                border: question.trim() ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {question.trim() ? "✓" : "3"}
            </div>
            <h2 className="text-white font-semibold text-sm">Debate Question</h2>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--surface-1)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <textarea
              id="question-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What should the agents debate? e.g., 'Compare the effectiveness of these two approaches and recommend one.'"
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-700 focus:outline-none transition-all resize-none"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.3)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}
            />
          </div>
        </motion.section>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Button */}
        <motion.button
          id="start-debate-btn"
          onClick={handleStartDebate}
          disabled={!canStart || loading}
          whileHover={canStart ? { scale: 1.015 } : {}}
          whileTap={canStart ? { scale: 0.985 } : {}}
          className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all duration-400 disabled:cursor-not-allowed"
          style={{
            background: canStart
              ? "linear-gradient(135deg, #22d3ee, #a78bfa)"
              : "rgba(255,255,255,0.03)",
            boxShadow: canStart ? "0 4px 30px rgba(167,139,250,0.25)" : "none",
            border: canStart ? "none" : "1px solid rgba(255,255,255,0.06)",
            opacity: canStart ? 1 : 0.4,
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            <span>
              Start Debate
              <span className="ml-2 opacity-60">→</span>
            </span>
          )}
        </motion.button>

        {/* Minimal requirements bar */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-neutral-700">
          <span className={docs.length >= 2 ? "text-emerald-500" : ""}>
            {docs.length >= 2 ? "✓" : "○"} 2+ docs
          </span>
          <span className="text-neutral-800">·</span>
          <span className={docs.length > 0 && docs.every((d) => d.personaName.trim()) ? "text-emerald-500" : ""}>
            {docs.length > 0 && docs.every((d) => d.personaName.trim()) ? "✓" : "○"} named
          </span>
          <span className="text-neutral-800">·</span>
          <span className={question.trim() ? "text-emerald-500" : ""}>
            {question.trim() ? "✓" : "○"} question
          </span>
        </div>
      </div>
    </main>
  );
}
