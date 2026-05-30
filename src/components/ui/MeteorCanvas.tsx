"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
}

interface Meteor {
  x: number; y: number;
  vx: number; vy: number;
  trail: number; width: number;
  baseAlpha: number;
  life: number; maxLife: number;
  sparkles: Sparkle[];
  nextSparkle: number;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function spawnMeteor(w: number, h: number): Meteor {
  const speed = 5 + Math.random() * 5;
  const angle = (20 + Math.random() * 10) * (Math.PI / 180);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const trail = 150 + Math.random() * 120;
  const maxLife = Math.round((Math.sqrt(w * w + h * h) / speed) * 0.9);
  const edge = Math.random();
  const x = edge < 0.6 ? -trail : Math.random() * w * 0.55 - trail;
  const y = edge < 0.6 ? Math.random() * h * 0.65 : -trail;
  return {
    x, y, vx, vy, trail,
    width: 1 + Math.random() * 1.2,
    baseAlpha: 0.7 + Math.random() * 0.3,
    life: 0, maxLife,
    sparkles: [], nextSparkle: 0,
  };
}

export default function MeteorCanvas({ total = 5 }: { total?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const ro = new ResizeObserver(() => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    });
    ro.observe(canvas);

    const meteors: Meteor[] = [];
    let spawned = 0;
    let nextSpawn = Date.now() + 300;
    let rafId: number;

    function drawMeteor(m: Meteor) {
      const progress = m.life / m.maxLife;
      let alpha: number;
      if (progress < 0.15)      alpha = m.baseAlpha * easeInOut(progress / 0.15);
      else if (progress > 0.78) alpha = m.baseAlpha * easeInOut((1 - progress) / 0.22);
      else                      alpha = m.baseAlpha;

      const spd = Math.hypot(m.vx, m.vy);
      const tailX = m.x - (m.vx / spd) * m.trail;
      const tailY = m.y - (m.vy / spd) * m.trail;

      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0,    `rgba(255,150,60,${alpha})`);
      grad.addColorStop(0.15, `rgba(255,90,0,${alpha * 0.9})`);
      grad.addColorStop(0.5,  `rgba(255,60,0,${alpha * 0.4})`);
      grad.addColorStop(1,    `rgba(255,40,0,0)`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.width;
      ctx.lineCap = "round";
      ctx.shadowBlur = 14;
      ctx.shadowColor = `rgba(255,90,0,${alpha * 0.9})`;
      ctx.stroke();

      // Head dot
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.width * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,210,140,${alpha})`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(255,90,0,${alpha})`;
      ctx.fill();
      ctx.restore();

      // Emit sparkles
      if (m.life >= m.nextSparkle && Math.random() < 0.65) {
        m.sparkles.push({
          x: m.x + (Math.random() - 0.5) * 5,
          y: m.y + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 0.5,
          alpha: alpha * (0.5 + Math.random() * 0.5),
          size: 0.7 + Math.random() * 1.3,
        });
        m.nextSparkle = m.life + 3 + Math.floor(Math.random() * 4);
      }

      for (let i = m.sparkles.length - 1; i >= 0; i--) {
        const s = m.sparkles[i];
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,110,20,${s.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(255,90,0,${s.alpha * 0.6})`;
        ctx.fill();
        ctx.restore();
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.02;
        if (s.alpha <= 0) m.sparkles.splice(i, 1);
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();
      if (spawned < total && now >= nextSpawn) {
        meteors.push(spawnMeteor(w, h));
        spawned++;
        nextSpawn = now + 800 + Math.random() * 900;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        drawMeteor(m);
        m.x += m.vx; m.y += m.vy; m.life++;
        if (m.life >= m.maxLife || (m.x > w + 150 && m.y > h + 150)) {
          meteors.splice(i, 1);
        }
      }

      // Stop loop when all meteors are done and we've spawned all of them
      if (spawned >= total && meteors.length === 0) return;

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, [total]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}
