"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useStartup } from "@/context/StartupContext";

// ---------------------------------------------------------------------------
// Screen texture — realistic dark-mode app UI
// ---------------------------------------------------------------------------
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function useScreenTexture() {
  return useMemo(() => {
    const W = 512, H = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // ── Background ──────────────────────────────────────────────────────────
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, W, H);

    // ── Status bar ──────────────────────────────────────────────────────────
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "bold 22px -apple-system, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("9:41", 28, 42);
    // Battery icon
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    roundRect(ctx, 440, 30, 44, 22, 5);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(484, 37, 3, 8);
    ctx.fillStyle = "#4CD964";
    roundRect(ctx, 442, 32, 34, 18, 3);
    ctx.fill();
    // Signal dots
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i < 3 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.arc(390 + i * 14, 41, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    // Dynamic island
    ctx.fillStyle = "#000";
    roundRect(ctx, 186, 18, 140, 36, 18);
    ctx.fill();

    // ── Hero card ───────────────────────────────────────────────────────────
    const heroGrad = ctx.createLinearGradient(0, 72, 0, 310);
    heroGrad.addColorStop(0, "#1a0a00");
    heroGrad.addColorStop(1, "#0D0D0D");
    ctx.fillStyle = heroGrad;
    roundRect(ctx, 16, 72, W - 32, 238, 20);
    ctx.fill();

    // Orange accent glow inside card
    const glowGrad = ctx.createRadialGradient(256, 130, 0, 256, 130, 180);
    glowGrad.addColorStop(0, "rgba(255,90,0,0.18)");
    glowGrad.addColorStop(1, "rgba(255,90,0,0)");
    ctx.fillStyle = glowGrad;
    roundRect(ctx, 16, 72, W - 32, 238, 20);
    ctx.fill();

    // Card border
    ctx.strokeStyle = "rgba(255,90,0,0.2)";
    ctx.lineWidth = 1;
    roundRect(ctx, 16, 72, W - 32, 238, 20);
    ctx.stroke();

    // "wehoware" wordmark
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 44px -apple-system, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("wehoware", 256, 218);

    // Tagline
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.font = "500 17px -apple-system, Arial, sans-serif";
    ctx.fillText("WE BUILD WHAT OTHERS DREAM", 256, 254);

    // Orange pill CTA
    roundRect(ctx, 176, 272, 160, 30, 15);
    ctx.fillStyle = "#FF5A00";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 15px -apple-system, Arial, sans-serif";
    ctx.fillText("Get Started →", 256, 287);

    // ── Section label ───────────────────────────────────────────────────────
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "600 17px -apple-system, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("OUR SERVICES", 28, 342);

    // ── Service cards (2 columns) ────────────────────────────────────────────
    const services = [
      { icon: "◈", label: "Web Design" },
      { icon: "⬡", label: "Branding" },
      { icon: "◎", label: "Development" },
      { icon: "⬢", label: "Strategy" },
    ];
    services.forEach((s, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = 16 + col * (240 + 8), y = 362 + row * (120 + 10);
      // Card bg
      ctx.fillStyle = "#161616";
      roundRect(ctx, x, y, 240, 120, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      roundRect(ctx, x, y, 240, 120, 16);
      ctx.stroke();
      // Icon
      ctx.fillStyle = "#FF5A00";
      ctx.font = "bold 28px -apple-system, Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(s.icon, x + 18, y + 18);
      // Label
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.font = "600 19px -apple-system, Arial, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(s.label, x + 18, y + 82);
    });

    // ── Stats row ────────────────────────────────────────────────────────────
    const stats = [["50+", "Projects"], ["98%", "Satisfaction"], ["5★", "Rating"]];
    const statY = 632;
    ctx.fillStyle = "#111";
    roundRect(ctx, 16, statY, W - 32, 80, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    roundRect(ctx, 16, statY, W - 32, 80, 16);
    ctx.stroke();
    stats.forEach(([val, lbl], i) => {
      const cx = 256 / 3 * (i * 2 + 1);
      ctx.fillStyle = "#FF5A00";
      ctx.font = "bold 26px -apple-system, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(val, cx + 16, statY + 32);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "500 14px -apple-system, Arial, sans-serif";
      ctx.fillText(lbl, cx + 16, statY + 56);
    });

    // ── Recent work label ────────────────────────────────────────────────────
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "600 17px -apple-system, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("RECENT WORK", 28, 742);

    // Work preview card
    const workGrad = ctx.createLinearGradient(16, 760, 496, 860);
    workGrad.addColorStop(0, "#1a0800");
    workGrad.addColorStop(1, "#0f0f0f");
    ctx.fillStyle = workGrad;
    roundRect(ctx, 16, 760, W - 32, 100, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,90,0,0.15)";
    ctx.lineWidth = 1;
    roundRect(ctx, 16, 760, W - 32, 100, 16);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "bold 20px -apple-system, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Wehoware Platform", 32, 795);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "500 15px -apple-system, Arial, sans-serif";
    ctx.fillText("Full-stack web application", 32, 820);
    ctx.fillStyle = "#FF5A00";
    ctx.font = "bold 14px -apple-system, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("View →", W - 32, 808);

    // ── Bottom nav ───────────────────────────────────────────────────────────
    ctx.fillStyle = "#111111";
    roundRect(ctx, 0, H - 100, W, 100, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 100); ctx.lineTo(W, H - 100); ctx.stroke();

    const navItems = [["⊞", "Home"], ["◈", "Work"], ["◎", "About"], ["✉", "Contact"]];
    navItems.forEach(([icon, label], i) => {
      const cx = W / 4 * i + W / 8;
      const active = i === 0;
      ctx.fillStyle = active ? "#FF5A00" : "rgba(255,255,255,0.35)";
      ctx.font = `${active ? "bold" : "500"} 22px -apple-system, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, cx, H - 68);
      ctx.font = `500 13px -apple-system, Arial, sans-serif`;
      ctx.fillStyle = active ? "#FF5A00" : "rgba(255,255,255,0.25)";
      ctx.fillText(label, cx, H - 44);
    });

    // Home indicator
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    roundRect(ctx, 186, H - 16, 140, 5, 3);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// ---------------------------------------------------------------------------
// iPhone 15 Pro proportions (scene units)
// ---------------------------------------------------------------------------
const PW = 1.0;    // width
const PH = 2.1;    // height
const PD = 0.095;  // depth

// ---------------------------------------------------------------------------
// Phone sub-components
// ---------------------------------------------------------------------------
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.06} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#FFF4E8" />
      <pointLight position={[-3, -4, -2]} intensity={3.5} color="#FF5A00" distance={9} decay={2} />
      <pointLight position={[2, 3, -6]} intensity={0.9} color="#5599FF" distance={12} decay={2} />
      <pointLight position={[-4, 0, 3]} intensity={0.35} color="#FFFFFF" distance={8} decay={2} />
      {/* Spotlight bounce — warm fill from below matching the glow disc */}
      <pointLight position={[0, -PH / 2 - 0.5, 0.6]} intensity={1.8} color="#FF6A10" distance={5} decay={2} />
    </>
  );
}

function PhoneChassis() {
  return (
    <group>
      {/* Flat titanium frame — tiny radius gives the modern squared-edge look */}
      <RoundedBox args={[PW, PH, PD]} radius={0.075} smoothness={10}>
        <meshPhysicalMaterial
          color="#3A3A3C"
          metalness={0.97}
          roughness={0.08}
          clearcoat={0.7}
          clearcoatRoughness={0.05}
          envMapIntensity={2.2}
          reflectivity={1.0}
        />
      </RoundedBox>
      {/* Back glass — glossy dark panel */}
      <mesh position={[0, 0, -PD / 2 + 0.003]}>
        <planeGeometry args={[PW - 0.042, PH - 0.052]} />
        <meshPhysicalMaterial
          color="#1A1A1C"
          roughness={0.10}
          metalness={0.04}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
        />
      </mesh>
      {/* USB-C slot at bottom */}
      <mesh position={[0, -PH / 2 + 0.002, 0]}>
        <boxGeometry args={[0.14, 0.018, PD + 0.002]} />
        <meshBasicMaterial color="#080808" />
      </mesh>
    </group>
  );
}

function makeRoundedRectGeo(w: number, h: number, r: number) {
  const hw = w / 2, hh = h / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hh);
  shape.lineTo( hw - r, -hh);
  shape.quadraticCurveTo( hw, -hh,  hw, -hh + r);
  shape.lineTo( hw,  hh - r);
  shape.quadraticCurveTo( hw,  hh,  hw - r,  hh);
  shape.lineTo(-hw + r,  hh);
  shape.quadraticCurveTo(-hw,  hh, -hw,  hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  const geo = new THREE.ShapeGeometry(shape, 8);
  // Normalise UVs to 0-1 so the texture fills the shape correctly
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const bw = bb.max.x - bb.min.x, bh = bb.max.y - bb.min.y;
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;
  for (let i = 0; i < uvs.count; i++) {
    uvs.setXY(i, (pos.getX(i) - bb.min.x) / bw, (pos.getY(i) - bb.min.y) / bh);
  }
  uvs.needsUpdate = true;
  return geo;
}

function PhoneScreen() {
  const texture = useScreenTexture();
  const screenGeo = useMemo(() => makeRoundedRectGeo(0.94, 2.02, 0.065), []);
  const glassGeo  = useMemo(() => makeRoundedRectGeo(0.96, 2.04, 0.067), []);

  useEffect(() => () => {
    texture.dispose();
    screenGeo.dispose();
    glassGeo.dispose();
  }, [texture, screenGeo, glassGeo]);

  return (
    <>
      <mesh geometry={screenGeo} position={[0, 0, PD / 2 + 0.001]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Glass glare layer */}
      <mesh geometry={glassGeo} position={[0, 0, PD / 2 + 0.002]}>
        <meshStandardMaterial
          color="#8BAED4"
          transparent
          opacity={0.055}
          roughness={0.0}
          metalness={0.2}
          envMapIntensity={0.9}
        />
      </mesh>
    </>
  );
}

function PhoneCameraIsland() {
  const iW = 0.42, iH = 0.42, iD = 0.024;
  // Island center: upper-left of back face (iPhone 15 Pro layout)
  const iCX = -0.12, iCY = 0.76;
  const iCZ = -PD / 2 - iD / 2;  // flush with phone back, protruding behind

  type Lens = { dx: number; dy: number; r: number };
  const lenses: Lens[] = [
    { dx:  0.00, dy: -0.082, r: 0.086 }, // Main      — bottom-centre, largest
    { dx: -0.11, dy:  0.072, r: 0.069 }, // Ultrawide — top-left
    { dx:  0.09, dy:  0.072, r: 0.069 }, // Telephoto — top-right
  ];

  return (
    <group position={[iCX, iCY, iCZ]}>
      {/* Square raised module */}
      <RoundedBox args={[iW, iH, iD]} radius={0.062} smoothness={8}>
        <meshPhysicalMaterial
          color="#0D0D10"
          metalness={0.94}
          roughness={0.06}
          clearcoat={0.55}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Three lenses — cylinders rotated so flat faces face ±Z */}
      {lenses.map(({ dx, dy, r }, i) => (
        <group key={i} position={[dx, dy, -iD / 2]}>
          {/* Stainless steel outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[r, r, 0.018, 40]} />
            <meshPhysicalMaterial color="#222226" metalness={0.97} roughness={0.04} envMapIntensity={1.8} />
          </mesh>
          {/* Dark lens glass — protrudes 2 mm further so it wins depth test from back */}
          <mesh position={[0, 0, -0.002]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[r - 0.018, r - 0.018, 0.022, 40]} />
            <meshPhysicalMaterial color="#030308" roughness={0.04} metalness={0.06} envMapIntensity={3.0} />
          </mesh>
          {/* Sapphire-blue shimmer at centre */}
          <mesh position={[0, 0, -0.004]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[r - 0.034, r - 0.034, 0.026, 40]} />
            <meshBasicMaterial color="#0C1830" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}

      {/* Flash — top-right corner of island */}
      <mesh position={[0.14, 0.10, -iD / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.012, 20]} />
        <meshPhysicalMaterial color="#D4CC9A" roughness={0.3} emissive="#1A0900" emissiveIntensity={0.35} />
      </mesh>

      {/* LiDAR scanner */}
      <mesh position={[0.14, 0.04, -iD / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.017, 0.017, 0.010, 16]} />
        <meshPhysicalMaterial color="#0A0A14" metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Microphone dot */}
      <mesh position={[0.14, -0.02, -iD / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.006, 12]} />
        <meshBasicMaterial color="#060606" />
      </mesh>
    </group>
  );
}

function PhoneButtons() {
  const mat = (
    <meshPhysicalMaterial color="#2C2C2E" metalness={0.96} roughness={0.08} clearcoat={0.5} envMapIntensity={1.2} />
  );
  return (
    <>
      {/* Action button — left side, short pill (iPhone 15 Pro+) */}
      <mesh position={[-PW / 2 - 0.006, 0.64, 0.010]}>
        <boxGeometry args={[0.011, 0.095, 0.044]} />
        {mat}
      </mesh>
      {/* Volume up — left */}
      <mesh position={[-PW / 2 - 0.006, 0.42, 0.010]}>
        <boxGeometry args={[0.011, 0.185, 0.044]} />
        {mat}
      </mesh>
      {/* Volume down — left */}
      <mesh position={[-PW / 2 - 0.006, 0.18, 0.010]}>
        <boxGeometry args={[0.011, 0.185, 0.044]} />
        {mat}
      </mesh>
      {/* Power — right, longer */}
      <mesh position={[PW / 2 + 0.006, 0.38, 0.010]}>
        <boxGeometry args={[0.011, 0.285, 0.044]} />
        {mat}
      </mesh>
    </>
  );
}

// ---------------------------------------------------------------------------
// Spotlight glow disc — soft orange halo beneath the phone
// ---------------------------------------------------------------------------
function SpotlightGlow() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0,    "rgba(255, 110, 20, 0.55)");
    grad.addColorStop(0.30, "rgba(255,  90,  0, 0.22)");
    grad.addColorStop(0.65, "rgba(255,  70,  0, 0.07)");
    grad.addColorStop(1,    "rgba(255,  60,  0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  // Disc sits just below the phone bottom edge (phone base ≈ y = −PH/2 = −1.05)
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -PH / 2 - 0.28, 0]}>
      <planeGeometry args={[2.4, 1.5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Scene — owns the animation loop
// ---------------------------------------------------------------------------
interface PhoneSceneProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  ready: boolean;
}

const ANIM_DUR  = 1.1;  // pop animation duration in seconds
const ANIM_DELAY = 0.4; // delay before pop starts
const SPIN_DUR   = 0.5; // intro Y-spin completes after this many seconds

// Single smooth overshoot (~7%), no oscillation — replaces elasticOut
function easeOutBack(t: number) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function PhoneScene({ mouseRef, ready }: PhoneSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef  = useRef({ x: 0, y: 0 });
  // starts negative so the delay counts up to 0 before animation begins
  const timeRef  = useRef(-ANIM_DELAY);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Hold at scale 0 until startup is complete, then begin the pop
    if (!ready) {
      groupRef.current.scale.setScalar(0);
      return;
    }

    timeRef.current = Math.min(timeRef.current + delta, ANIM_DUR);
    const raw   = Math.max(0, timeRef.current) / ANIM_DUR; // 0 → 1
    const eased = easeOutBack(Math.min(raw, 1));            // one smooth overshoot, no oscillation

    // Scale: springs from 0 → 1 with single overshoot
    groupRef.current.scale.setScalar(eased);

    // Y: clamp eased so overshoot doesn't push phone upward during pop
    const popOffset   = (Math.min(eased, 1) - 1) * 1.8;
    // Float blends in over the last 25% of animation → no sudden position jump
    const floatBlend  = easeOutCubic(Math.max(0, Math.min((raw - 0.75) / 0.25, 1)));
    const floatOffset = Math.sin(state.clock.elapsedTime * 0.7) * 0.06 * floatBlend;
    groupRef.current.position.y = popOffset + floatOffset;

    // Intro spin: 135° → 0° over SPIN_DUR seconds, then mouse tilt takes over
    const effectiveTime = Math.max(0, timeRef.current);
    const spinT = easeOutCubic(Math.min(effectiveTime / SPIN_DUR, 1));
    const spinY = Math.PI * 0.75 * (1 - spinT);

    const lerpFactor = 1 - Math.pow(0.002, delta);
    tiltRef.current.x += (mouseRef.current.y * 0.5 - tiltRef.current.x) * lerpFactor;
    tiltRef.current.y += (mouseRef.current.x * 0.6 - tiltRef.current.y) * lerpFactor;
    groupRef.current.rotation.x = tiltRef.current.x * eased * spinT;
    groupRef.current.rotation.y = spinY + tiltRef.current.y * eased * spinT;
  });

  return (
    <>
      <SceneLights />
      <SpotlightGlow />
      <group ref={groupRef}>
        <PhoneChassis />
        <PhoneScreen />
        <PhoneCameraIsland />
        <PhoneButtons />
      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// PhoneModel — default export, SSR-safe
// ---------------------------------------------------------------------------
export default function PhoneModel() {
  const { isStartupComplete } = useStartup();
  const [isMounted, setIsMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!isMounted) return null;

  return (
    <Canvas
      frameloop="always"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <PhoneScene mouseRef={mouseRef} ready={isStartupComplete} />
        <Environment preset="city" background={false} />
      </Suspense>
    </Canvas>
  );
}