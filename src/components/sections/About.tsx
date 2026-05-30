"use client";

import { useEffect, useRef } from "react";
import { attachTilt } from "@/utils/tilt3d";

const STATS = [
  { value: "10+",  label: "Years Experience"    },
  { value: "54",   label: "Projects Delivered"  },
  { value: "98%",  label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available"   },
];

const VALUES = [
  {
    title: "Innovation First",
    desc: "We push creative and technical boundaries to deliver solutions that stand out in a crowded market.",
  },
  {
    title: "Built to Perform",
    desc: "Speed, reliability, and scalability are never afterthoughts — they're the foundation of everything we ship.",
  },
  {
    title: "Client Partnership",
    desc: "Your success is our metric. We work as an extension of your team, not just a vendor.",
  },
];

export default function About() {
  const statRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cleanups = [
      ...statRefs.current.map(el  => (el ? attachTilt(el, 8)  : () => {})),
      ...valueRefs.current.map(el => (el ? attachTilt(el, 10) : () => {})),
    ];
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section
      className="relative min-h-screen border-b border-white/10 overflow-hidden py-24"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(255,90,0,0.07) 0%, transparent 60%), rgba(13,13,13,0.65)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-4">Who We Are</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-8">
            We Build What<br />Others Dream
          </h2>
          <p style={{
            fontSize: "1.05rem",
            color: "rgba(255,255,255,0.5)",
            maxWidth: 560,
            lineHeight: 1.85,
          }}>
            Wehoware is a full-service digital agency specializing in immersive web experiences,
            mobile products, and growth marketing. We turn ambitious ideas into pixel-perfect reality.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((s, i) => (
            <div
              key={i}
              ref={el => { statRefs.current[i] = el; }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,90,0,0.2)",
                borderRadius: 12,
                padding: "1.5rem",
                textAlign: "center",
                transformStyle: "preserve-3d",
                willChange: "transform",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              <div className="tilt-shine" style={{
                position: "absolute", inset: 0, borderRadius: 12,
                pointerEvents: "none", opacity: 0, transition: "opacity 0.3s",
              }} />
              <div style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "#FF5A00",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginTop: 8,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Core values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((v, i) => (
            <div
              key={i}
              ref={el => { valueRefs.current[i] = el; }}
              style={{
                position: "relative",
                borderLeft: "2px solid rgba(255,90,0,0.4)",
                paddingLeft: "1.5rem",
                transformStyle: "preserve-3d",
                willChange: "transform",
                cursor: "default",
              }}
            >
              <h3 style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "0.5rem",
                letterSpacing: "-0.01em",
              }}>
                {v.title}
              </h3>
              <p style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.75,
              }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
