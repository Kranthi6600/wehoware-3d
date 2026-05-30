"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/utils/animations";

interface Props {
  onComplete?: () => void;
}

export default function WaveTransition({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width  = w;
    canvas.height = h;

    const state = { alpha: 1 };

    const draw = () => { ctx.clearRect(0, 0, w, h); };

    const tl = gsap.timeline();

    tl.to({}, { duration: 0.3 })
    .to(state, {
      alpha    : 0,
      duration : 0.45,
      ease     : "power2.in",
      onUpdate : draw,
      onComplete() {
        ctx.clearRect(0, 0, w, h);
        canvas.style.display = "none";
        onComplete?.();
      },
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position     : "fixed",
        inset        : 0,
        zIndex       : 8000,
        pointerEvents: "none",
      }}
    />
  );
}
