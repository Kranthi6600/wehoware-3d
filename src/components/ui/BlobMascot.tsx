"use client";

import { useEffect, useRef, useState } from "react";

export default function BlobMascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const id = "blob-mascot-keyframes";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes blob-float {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-18px); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dy, dx);
      const r = Math.min(Math.sqrt(dx * dx + dy * dy) / 100, 1);
      setEyeOffset({ x: Math.cos(angle) * r * 3.5, y: Math.sin(angle) * r * 3.5 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedBlink = () => {
      timeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => { setIsBlinking(false); schedBlink(); }, 120);
      }, 2500 + Math.random() * 3500);
    };
    schedBlink();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>

      {/* Floating orb */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
        animation: "blob-float 3s ease-in-out infinite",
      }}>

        {/* Sphere — orange 3D gradient + rim-only glow via box-shadow */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 32%, #FF9940 0%, #FF5A00 28%, #CC3300 55%, #5C1500 78%, #1A0500 100%)",
          boxShadow: [
            "0 0 0 2px rgba(255,90,0,0.15)",      // tight border rim
            "0 0 12px 4px rgba(255,90,0,0.55)",   // close rim glow
            "0 0 28px 6px rgba(255,60,0,0.25)",   // medium edge bloom
            "inset 0 -10px 28px rgba(0,0,0,0.55)", // inner depth shadow
            "inset 4px 4px 18px rgba(255,160,80,0.10)", // inner highlight
          ].join(", "),
        }}>

          {/* Specular highlight */}
          <div style={{
            position: "absolute",
            top: 16,
            left: 24,
            width: 48,
            height: 28,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,220,160,0.32) 0%, transparent 70%)",
            filter: "blur(4px)",
            transform: "rotate(-20deg)",
          }} />

          {/* Left eye */}
          <div style={{
            position: "absolute",
            left: 38,
            top: 62,
            width: 26,
            height: isBlinking ? 3 : 26,
            background: "#ffffff",
            borderRadius: "50%",
            transition: "height 0.07s ease",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px rgba(255,255,255,0.7)",
          }}>
            <div style={{
              width: 13, height: 13,
              borderRadius: "50%",
              background: "#1a0500",
              flexShrink: 0,
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: "transform 0.12s ease-out",
            }} />
          </div>

          {/* Right eye */}
          <div style={{
            position: "absolute",
            right: 38,
            top: 62,
            width: 26,
            height: isBlinking ? 3 : 26,
            background: "#ffffff",
            borderRadius: "50%",
            transition: "height 0.07s ease",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px rgba(255,255,255,0.7)",
          }}>
            <div style={{
              width: 13, height: 13,
              borderRadius: "50%",
              background: "#1a0500",
              flexShrink: 0,
              transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
              transition: "transform 0.12s ease-out",
            }} />
          </div>


        </div>
      </div>
    </div>
  );
}
