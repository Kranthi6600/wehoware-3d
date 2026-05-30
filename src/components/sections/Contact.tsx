"use client";

import { useEffect, useRef } from "react";
import { attachTilt } from "@/utils/tilt3d";

const INFO = [
  { label: "Email",         value: "support@wehoware.com", href: "mailto:support@wehoware.com" },
  { label: "Response Time", value: "Within 24 hours",      href: null                          },
  { label: "Location",      value: "Remote — Worldwide",   href: null                          },
];

export default function Contact() {
  const formRef  = useRef<HTMLDivElement>(null);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    if (formRef.current) cleanups.push(attachTilt(formRef.current, 8));
    infoRefs.current.forEach(el => { if (el) cleanups.push(attachTilt(el, 10)); });
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden py-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,90,0,0.13) 0%, transparent 70%), rgba(13,13,13,0.65)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — heading + info cards */}
          <div>
            <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-4">Get In Touch</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-10">
              Let&apos;s Build<br />Something Bold
            </h2>
            <div className="flex flex-col gap-4">
              {INFO.map((item, i) => (
                <div
                  key={i}
                  ref={el => { infoRefs.current[i] = el; }}
                  onClick={() => item.href && window.open(item.href)}
                  style={{
                    position: "relative",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "1rem 1.25rem",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    overflow: "hidden",
                    cursor: item.href ? "pointer" : "default",
                  }}
                >
                  <div className="tilt-shine" style={{
                    position: "absolute", inset: 0, borderRadius: 12,
                    pointerEvents: "none", opacity: 0, transition: "opacity 0.3s",
                  }} />
                  <div style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#FF5A00",
                    marginBottom: 4,
                  }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact form */}
          <div
            ref={formRef}
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "2.5rem",
              transformStyle: "preserve-3d",
              willChange: "transform",
              overflow: "hidden",
            }}
          >
            <div className="tilt-shine" style={{
              position: "absolute", inset: 0, borderRadius: 20,
              pointerEvents: "none", opacity: 0, transition: "opacity 0.3s",
            }} />
            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Your Name"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,90,0,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <input
                type="email"
                placeholder="Email Address"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,90,0,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <textarea
                placeholder="Tell us about your project..."
                rows={5}
                style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(255,90,0,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                style={btnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = "#e04d00")}
                onMouseLeave={e => (e.currentTarget.style.background = "#FF5A00")}
              >
                Send Message
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "0.875rem 1rem",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s",
};

const btnStyle: React.CSSProperties = {
  background: "#FF5A00",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "0.875rem 1.5rem",
  fontSize: "0.875rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "background 0.2s",
  width: "100%",
};
