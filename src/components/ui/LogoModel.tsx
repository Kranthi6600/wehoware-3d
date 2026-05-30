"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------
const DEPTH = 0.34;
const BEVEL: THREE.ExtrudeGeometryOptions = {
  bevelEnabled: true,
  bevelThickness: 0.030,
  bevelSize:      0.022,
  bevelSegments:  5,
};

function makeExtrude(pts: [number, number][]) {
  const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
  return new THREE.ExtrudeGeometry(shape, { depth: DEPTH, ...BEVEL });
}

// ---------------------------------------------------------------------------
// Logo geometry — built from the 3-piece W + orange triangle
// ---------------------------------------------------------------------------
function LogoMesh() {
  const geos = useMemo(() => {
    // Left slab — leftmost diagonal downstroke of W
    const left = makeExtrude([
      [-1.85,  1.20],
      [-1.42,  1.20],
      [-0.92, -1.30],
      [-1.35, -1.30],
    ]);

    // Middle slab — center stroke (mirrors left, forms first V valley)
    const mid = makeExtrude([
      [-0.52,  1.20],
      [-0.08,  1.20],
      [ 0.42, -1.30],
      [-0.02, -1.30],
    ]);

    // Right complex shape — stepped notch (right half of W)
    // Lower portion is narrower; upper portion steps right where arm widens.
    // Inner boundary has a horizontal step at y=0.42.
    const right = makeExtrude([
      [ 0.52, -1.30],  // bottom-left  (inner-left of lower slab)
      [ 0.96, -1.30],  // bottom-right
      [ 0.96,  0.42],  // right wall — up to step
      [ 1.25,  0.42],  // step right — upper arm begins
      [ 1.25,  1.20],  // top-right
      [ 0.72,  1.20],  // top-left of upper arm (inner corner)
      [ 0.72,  0.42],  // inner step down
      [ 0.52,  0.42],  // step left — inner wall of lower slab
    ]);

    // Orange triangle — right-pointing accent, upper-right corner
    const tri = makeExtrude([
      [ 1.32,  0.90],  // top-left
      [ 1.68,  0.56],  // right vertex
      [ 1.32,  0.22],  // bottom-left
    ]);

    return { left, mid, right, tri };
  }, []);

  useEffect(() => () => Object.values(geos).forEach(g => g.dispose()), [geos]);

  const white = (
    <meshPhysicalMaterial
      color="#DCDCDE"
      metalness={0.10}
      roughness={0.20}
      clearcoat={1.0}
      clearcoatRoughness={0.06}
      envMapIntensity={2.0}
    />
  );

  const orange = (
    <meshPhysicalMaterial
      color="#B84010"
      metalness={0.18}
      roughness={0.26}
      clearcoat={0.6}
      clearcoatRoughness={0.10}
      envMapIntensity={1.5}
    />
  );

  // Shift slightly right to visually centre (logo spans −1.85 → +1.68, centre ≈ −0.085)
  return (
    <group position={[0.09, 0, -DEPTH / 2]}>
      <mesh geometry={geos.left}>{white}</mesh>
      <mesh geometry={geos.mid}>{white}</mesh>
      <mesh geometry={geos.right}>{white}</mesh>
      <mesh geometry={geos.tri}>{orange}</mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene — mouse-tilt + float animation (same feel as PhoneModel)
// ---------------------------------------------------------------------------
interface LogoSceneProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
}

function LogoScene({ mouseRef }: LogoSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef  = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const lerpFactor = 1 - Math.pow(0.002, delta);
    tiltRef.current.x += (mouseRef.current.y * 0.45 - tiltRef.current.x) * lerpFactor;
    tiltRef.current.y += (mouseRef.current.x * 0.55 - tiltRef.current.y) * lerpFactor;
    groupRef.current.rotation.x = tiltRef.current.x;
    groupRef.current.rotation.y = tiltRef.current.y;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 5, 4]} intensity={3.0} color="#FFFFFF" />
      {/* Brand orange rim */}
      <pointLight position={[-4, -3, 2]} intensity={2.2} color="#FF5A00" distance={12} decay={2} />
      {/* Cool blue separation from dark bg */}
      <pointLight position={[2,  3, -5]} intensity={0.8} color="#4488FF" distance={12} decay={2} />

      <group ref={groupRef} scale={[0.76, 0.76, 0.76]}>
        <LogoMesh />
      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// Default export — SSR-safe
// ---------------------------------------------------------------------------
export default function LogoModel() {
  const [isMounted, setIsMounted] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
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
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Suspense fallback={null}>
        <LogoScene mouseRef={mouseRef} />
        <Environment preset="city" background={false} />
      </Suspense>
    </Canvas>
  );
}
