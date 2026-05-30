"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useStartup } from "@/context/StartupContext";
import { gsap } from "@/utils/animations";
import PhoneModel from "@/components/ui/PhoneModel";
import MeteorCanvas from "@/components/ui/MeteorCanvas";
import WaveTransition from "@/components/ui/WaveTransition";

type Phase = "idle" | "type1" | "type2" | "hold" | "del2" | "del1" | "wait";

const PHRASES = [
  { line1: "welcome to",         line2: "wehoware"            },
  { line1: "make your",          line2: "websites interactive" },
  { line1: "we craft",           line2: "bold brands"          },
  { line1: "launch your",        line2: "mobile app"           },
  { line1: "we grow your",       line2: "digital reach"        },
  { line1: "scale with",         line2: "the cloud"            },
  { line1: "rank higher",        line2: "get found"            },
  { line1: "design that",        line2: "users love"           },
  { line1: "we build",           line2: "businesses"           },
] as const;

const TAGLINE = "We are a full-service website design, development and digital marketing company specializing in SEO, content marketing that grows brands.";
const TAGLINE_WORDS = TAGLINE.split(" ");

const STATS = [
  { target: 10, suffix: "+", label: "Years of Experienced\nDevelopers" },
  { target: 54, suffix: "",  label: "Completed\nProjects"               },
];

export default function Hero() {
  const { isStartupComplete } = useStartup();
  const [l1, setL1]           = useState(0);
  const [l2, setL2]           = useState(0);
  const [phase, setPhase]     = useState<Phase>("idle");
  const [phrase, setPhrase]   = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showWave, setShowWave]   = useState(false);
  const [showSub, setShowSub]     = useState(false);
  const [counts, setCounts]       = useState([0, 0]);
  const [doneCount, setDoneCount] = useState([false, false]);
  const rafRef = useRef(0);

  // Inject stat-pulse keyframe once
  useEffect(() => {
    const id = "hero-sub-keyframes";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes stat-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      @keyframes sub-line   { from{transform:scaleX(0)} to{transform:scaleX(1)} }
    `;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Trigger everything when startup finishes
  useEffect(() => {
    if (!isStartupComplete) return;
    setShowWave(true);
    setPhase("type1");
    const t = setTimeout(() => setShowSub(true), 500);
    return () => clearTimeout(t);
  }, [isStartupComplete]);

  // GSAP counting animation
  useEffect(() => {
    if (!showSub) return;
    const c = [{ v: 0 }, { v: 0 }];
    const durations = [1.6, 2.0];
    const delays    = [0.4, 0.6];
    c.forEach((obj, i) => {
      gsap.to(obj, {
        v: STATS[i].target,
        duration: durations[i],
        ease: "expo.out",
        delay: delays[i],
        onUpdate() {
          const rounded = Math.round(obj.v);
          setCounts(prev => { const n = [...prev]; n[i] = rounded; return n; });
        },
        onComplete() {
          setDoneCount(prev => { const n = [...prev]; n[i] = true; return n; });
        },
      });
    });
  }, [showSub]);

  const handleWaveComplete = useCallback(() => setShowWave(false), []);

  const runAnim = useCallback((
    duration: number, from: number, to: number,
    onUpdate: (v: number) => void, onDone: () => void
  ) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      onUpdate(from + (to - from) * e);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else onDone();
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (phase === "type1") {
      setL1(0); runAnim(900, 0, 1, setL1, () => setPhase("type2"));
    } else if (phase === "type2") {
      setL2(0); runAnim(700, 0, 1, setL2, () => setPhase("hold"));
    } else if (phase === "hold") {
      const id = setTimeout(() => setPhase("del2"), 1800);
      return () => clearTimeout(id);
    } else if (phase === "del2") {
      runAnim(500, 1, 0, setL2, () => setPhase("del1"));
    } else if (phase === "del1") {
      setL2(0); runAnim(700, 1, 0, setL1, () => setPhase("wait"));
    } else if (phase === "wait") {
      setL1(0);
      setPhrase(p => (p + 1) % PHRASES.length);
      const id = setTimeout(() => setPhase("type1"), 400);
      return () => clearTimeout(id);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, runAnim]);

  const cursor1 = phase === "type1" || phase === "del1";
  const cursor2 = phase === "type2" || phase === "del2" || phase === "hold";

  return (
    <section
      suppressHydrationWarning
      className="relative min-h-screen border-b border-white/10 overflow-hidden flex items-center"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,90,0,0.12) 0%, transparent 70%), rgba(13,13,13,0.65)",
      }}
    >
      {/* Wave transition */}
      {showWave && <WaveTransition onComplete={handleWaveComplete} />}

      {/* Meteor shower */}
      {isStartupComplete && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <MeteorCanvas total={5} />
        </div>
      )}

      <div className="relative z-10" style={{ paddingLeft: "clamp(2rem, 8vw, 6.25rem)", paddingRight: "2rem" }}>
        <div className="text-left" style={{ maxWidth: isDesktop ? "48vw" : "100%" }}>

          {/* ── Typewriter h1 ─────────────────────────────────── */}
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
            <span style={{ display: "table", position: "relative", marginBottom: "-0.25em" }}>
              <span style={{ display: "block", whiteSpace: "nowrap", paddingBottom: "0.25em", clipPath: l1 >= 1 ? "none" : `inset(0 ${(1 - l1) * 100}% 0 0)` }}>
                {PHRASES[phrase].line1}
              </span>
              {cursor1 && (
                <span style={{ position: "absolute", top: 0, left: `${l1 * 100}%`, width: 3, height: "100%", background: "#FF5A00", borderRadius: 2 }} />
              )}
            </span>

            <span style={{ display: "table", position: "relative", marginBottom: "-0.25em" }}>
              <span style={{ display: "block", whiteSpace: "nowrap", paddingBottom: "0.25em", clipPath: l2 >= 1 ? "none" : `inset(0 ${(1 - l2) * 100}% 0 0)` }}>
                {PHRASES[phrase].line2}
              </span>
              {cursor2 && (
                <span
                  className={phase === "hold" ? "animate-pulse" : ""}
                  style={{ position: "absolute", top: 0, left: `${l2 * 100}%`, width: 3, height: "100%", background: "#FF5A00", borderRadius: 2 }}
                />
              )}
            </span>
          </h1>

          {/* ── Tagline ───────────────────────────────────────── */}
          <p
            suppressHydrationWarning
            aria-label={TAGLINE}
            style={{
              marginTop: "clamp(1rem, 2.5vw, 1.75rem)",
              fontSize: "clamp(0.8rem, 1.1vw, 1rem)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.52)",
              maxWidth: 480,
            }}
          >
            {TAGLINE_WORDS.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.28em",
                  opacity: showSub ? 1 : 0,
                  transform: showSub ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.45s ease ${i * 38}ms, transform 0.45s ease ${i * 38}ms, color 0.2s ease`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,90,0,0.8)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = ""; }}
              >
                {word}
              </span>
            ))}
          </p>

          {/* ── Separator ─────────────────────────────────────── */}
          <div suppressHydrationWarning style={{
            marginTop: "clamp(1.2rem, 2.5vw, 2rem)",
            height: 1,
            background: "rgba(255,255,255,0.08)",
            maxWidth: 480,
            transformOrigin: "left",
            transform: showSub ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.7s ease 0.3s",
          }} />

          {/* ── Stats ─────────────────────────────────────────── */}
          <div style={{
            display: "flex",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            marginTop: "clamp(1.2rem, 2.5vw, 2rem)",
            flexWrap: "wrap",
          }}>
            {STATS.map((stat, i) => {
              const counting = !doneCount[i] && showSub;
              return (
                <div
                  key={i}
                  suppressHydrationWarning
                  style={{
                    opacity: showSub ? 1 : 0,
                    transform: showSub ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.5s ease ${0.6 + i * 0.15}s, transform 0.5s ease ${0.6 + i * 0.15}s`,
                    paddingLeft: 16,
                    borderLeft: "2px solid rgba(255,90,0,0.35)",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderLeftColor = "#FF5A00";
                    el.style.transform = "translateX(5px)";
                    const num = el.querySelector<HTMLElement>(".stat-num");
                    if (num) num.style.textShadow = "0 0 24px rgba(255,90,0,0.7)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderLeftColor = "rgba(255,90,0,0.35)";
                    el.style.transform = showSub ? "translateY(0)" : "translateY(20px)";
                    const num = el.querySelector<HTMLElement>(".stat-num");
                    if (num) num.style.textShadow = "";
                  }}
                >
                  {/* Number */}
                  <div
                    className="stat-num"
                    suppressHydrationWarning
                    style={{
                      fontSize: "clamp(2rem, 3.5vw, 3rem)",
                      fontWeight: 900,
                      color: "#FF5A00",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      transition: "text-shadow 0.2s ease",
                      animation: counting ? "stat-pulse 0.7s ease infinite" : "none",
                      display: "flex",
                      alignItems: "baseline",
                      gap: 2,
                    }}
                  >
                    <span>{counts[i]}</span>
                    <span style={{
                      display: "inline-block",
                      transform: doneCount[i] ? "scale(1)" : "scale(0)",
                      transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                      transformOrigin: "left center",
                    }}>
                      {stat.suffix}
                    </span>
                  </div>

                  {/* Label */}
                  <div suppressHydrationWarning style={{
                    marginTop: 6,
                    fontSize: "0.68rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.38)",
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3D Phone — desktop only */}
      {isDesktop && (
        <div
          className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <div style={{ width: "100%", height: "100%", maxWidth: 500, maxHeight: 700 }}>
            <PhoneModel />
          </div>
        </div>
      )}

      {/* Ambient glow orb */}
      <div
        suppressHydrationWarning
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,90,0,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </section>
  );
}
