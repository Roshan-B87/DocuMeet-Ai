"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AgentMessage {
  agent_name: string;
  agent_color: string;
  reasoning: string | null;
  content: string;
}

interface DebateRound {
  round_number: number;
  label: string;
  messages: AgentMessage[];
}

interface DebateResult {
  question: string;
  agents: { name: string; color: string }[];
  rounds: DebateRound[];
  synthesis: { reasoning: string | null; content: string } | null;
}

// ─── Color Maps ─────────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  cyan:    { bg: "rgba(34,211,238,0.06)",    border: "rgba(34,211,238,0.3)",    text: "#22d3ee", glow: "glow-cyan"    },
  violet:  { bg: "rgba(167,139,250,0.06)",   border: "rgba(167,139,250,0.3)",   text: "#a78bfa", glow: "glow-violet"  },
  emerald: { bg: "rgba(74,222,128,0.06)",    border: "rgba(74,222,128,0.3)",    text: "#4ade80", glow: "glow-emerald" },
};

// ─── Thinking Panel ──────────────────────────────────────────────────────────

function ThinkingPanel({ reasoning }: { reasoning: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="thinking-panel p-3 mb-3 rounded-xl">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        🧠 Agent is thinking... {open ? "▲ collapse" : "▼ expand"}
      </button>
      {open && (
        <div className="mt-2 text-xs text-amber-200/70 leading-relaxed max-h-48 overflow-y-auto pr-2 cursor-blink">
          {reasoning}
        </div>
      )}
    </div>
  );
}

// ─── Agent Message Card ──────────────────────────────────────────────────────

function AgentMessageCard({ message, delay }: { message: AgentMessage; delay: number }) {
  const color = COLOR_MAP[message.agent_color] ?? COLOR_MAP["cyan"];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      className={`rounded-2xl p-5 border animate-slide-up ${color.glow}`}
      style={{ background: color.bg, borderColor: color.border }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: color.border, color: color.text }}
        >
          {message.agent_name.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-sm" style={{ color: color.text }}>
          {message.agent_name}
        </span>
        <span className="text-neutral-600 text-xs ml-auto">AI Persona</span>
      </div>

      {message.reasoning && <ThinkingPanel reasoning={message.reasoning} />}

      <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
    </div>
  );
}

// ─── Round Section ──────────────────────────────────────────────────────────

function RoundSection({ round, baseDelay }: { round: DebateRound; baseDelay: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-3">
          Round {round.round_number} — {round.label}
        </span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="flex flex-col gap-4">
        {round.messages.map((msg, i) => (
          <AgentMessageCard
            key={i}
            message={msg}
            delay={baseDelay + i * 400}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Synthesis Card ─────────────────────────────────────────────────────────

function SynthesisCard({ synthesis }: { synthesis: { reasoning: string | null; content: string } }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;

  return (
    <div className="synthesis-card rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold"
          style={{
            background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
            color: "#fff",
          }}
        >
          ✦
        </div>
        <div>
          <p
            className="font-bold text-base"
            style={{
              background: "linear-gradient(90deg, #a78bfa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Final Synthesis
          </p>
          <p className="text-neutral-500 text-xs">Moderator AI · Combined Insights</p>
        </div>
      </div>
      {synthesis.reasoning && <ThinkingPanel reasoning={synthesis.reasoning} />}
      <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">
        {synthesis.content}
      </p>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DebatePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "streaming" | "done" | "error">("loading");
  const [result, setResult] = useState<DebateResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [config, setConfig] = useState<{ agents: { name: string; text: string }[]; question: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("debateConfig");
    if (!stored) {
      router.push("/setup");
      return;
    }
    const parsed = JSON.parse(stored);
    setConfig(parsed);
    runDebate(parsed);
  }, []);

  const runDebate = async (cfg: { agents: { name: string; text: string }[]; question: string }) => {
    setStatus("streaming");
    try {
      const res = await fetch("http://localhost:8000/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agents: cfg.agents, question: cfg.question }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Debate failed");
      }
      const data: DebateResult = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(message);
      setStatus("error");
    }
  };

  const handleStartOver = () => {
    sessionStorage.removeItem("debateConfig");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-neutral-900 relative">
      <StarsBackground />
      <ShootingStars />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 glass-strong">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/docmeet.png" alt="DocuMeet AI" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-bold text-white text-base tracking-tight">DocuMeet AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {status === "streaming" && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400">Debating...</span>
              </>
            )}
            {status === "done" && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400">Complete</span>
              </>
            )}
            {status === "error" && (
              <>
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400">Error</span>
              </>
            )}
          </div>
          <button
            id="start-over-btn"
            onClick={handleStartOver}
            className="px-4 py-2 rounded-lg text-xs text-neutral-400 border border-white/10 hover:bg-white/5 transition-colors"
          >
            ← Start Over
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">

        {/* Question Header */}
        {config && (
          <div className="glass rounded-2xl p-5 mb-8">
            <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-semibold">Debate Question</p>
            <p className="text-white text-base font-medium">"{config.question}"</p>
            {result && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {result.agents.map((a) => {
                  const c = COLOR_MAP[a.color] ?? COLOR_MAP["cyan"];
                  return (
                    <span
                      key={a.name}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                    >
                      {a.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {(status === "loading" || status === "streaming") && (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-neutral-300 font-medium text-base mb-2">
              Agents are debating...
            </p>
            <p className="text-neutral-600 text-sm">
              This may take 30–60 seconds as they reason through your documents.
            </p>
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              {["Analysing documents", "Round 1 debate", "Round 2 rebuttal", "Synthesizing"].map(
                (step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-1.5 text-xs text-neutral-500"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="glass rounded-2xl p-8 text-center border border-red-500/20">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-white font-semibold mb-2">Debate Failed</p>
            <p className="text-red-400 text-sm mb-6">{errorMsg}</p>
            <p className="text-neutral-500 text-xs mb-6">
              Make sure the backend is running: <code className="text-neutral-400">uvicorn main:app --reload</code> in the <code className="text-neutral-400">backend/</code> folder.
            </p>
            <button
              id="retry-btn"
              onClick={() => config && runDebate(config)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)" }}
            >
              Retry Debate
            </button>
          </div>
        )}

        {/* Results */}
        {status === "done" && result && (
          <>
            {result.rounds.map((round, ri) => (
              <RoundSection key={ri} round={round} baseDelay={ri * 1200} />
            ))}

            {/* Synthesis */}
            {result.synthesis && (
              <>
                <div className="flex items-center gap-3 mb-5 mt-6">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-3">
                    ✦ Final Synthesis
                  </span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <SynthesisCard synthesis={result.synthesis} />
              </>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <button
                id="new-debate-btn"
                onClick={() => router.push("/setup")}
                className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", boxShadow: "0 0 30px rgba(167,139,250,0.2)" }}
              >
                ⚡ New Debate
              </button>
              <button
                id="home-btn"
                onClick={handleStartOver}
                className="flex-1 py-3 rounded-xl font-semibold text-neutral-300 text-sm border border-white/10 hover:bg-white/5 transition-colors"
              >
                ← Home
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
