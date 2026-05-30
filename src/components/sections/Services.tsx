"use client";

import { useEffect, useRef } from "react";
import BlobMascot from "@/components/ui/BlobMascot";
import { attachTilt } from "@/utils/tilt3d";

const SERVICES = [
  {
    icon: "◈",
    title: "Web Design",
    desc: "Stunning, responsive websites that captivate your audience and convert visitors into customers.",
  },
  {
    icon: "◉",
    title: "Mobile Apps",
    desc: "Native and cross-platform apps built for performance, reliability, and user delight.",
  },
  {
    icon: "◆",
    title: "Branding",
    desc: "Bold visual identities that differentiate your business and make a lasting impression.",
  },
  {
    icon: "▲",
    title: "SEO & Growth",
    desc: "Data-driven strategies to climb search rankings and dominate your niche market.",
  },
  {
    icon: "⬡",
    title: "Cloud & Infra",
    desc: "Scalable cloud infrastructure that grows with your business and keeps you online 24/7.",
  },
  {
    icon: "◎",
    title: "Digital Marketing",
    desc: "Campaigns that convert and content that genuinely engages your target audience.",
  },
];

export default function Services() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cleanups = cardRefs.current.map(el => (el ? attachTilt(el) : () => {}));
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section
      className="relative min-h-screen border-b border-white/10 overflow-hidden py-24"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 80% 30%, rgba(255,90,0,0.09) 0%, transparent 65%), rgba(13,13,13,0.65)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-8">
          <BlobMascot />
          <div>
            <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-4">What We Do</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
              Our Services
            </h2>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "2rem",
                cursor: "default",
                transformStyle: "preserve-3d",
                willChange: "transform",
                overflow: "hidden",
              }}
            >
              {/* Shine overlay */}
              <div
                className="tilt-shine"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              />
              {/* Icon */}
              <div style={{ fontSize: "1.75rem", marginBottom: "1rem", color: "#FF5A00" }}>
                {svc.icon}
              </div>
              {/* Title */}
              <h3 style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "0.6rem",
                letterSpacing: "-0.02em",
              }}>
                {svc.title}
              </h3>
              {/* Description */}
              <p style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.75,
              }}>
                {svc.desc}
              </p>
              {/* Bottom accent line */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, #FF5A00, transparent)",
                opacity: 0.4,
                borderRadius: "0 0 16px 16px",
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
