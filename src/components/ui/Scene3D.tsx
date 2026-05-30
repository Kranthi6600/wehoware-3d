"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShapeProps {
  position: [number, number, number];
  color: string;
  opacity: number;
  rotSpeed: number;
  floatSpeed: number;
  parallaxFactor: number;
  scrollRef: MutableRefObject<number>;
  children: React.ReactNode;
}

function FloatingShape({
  position, color, opacity, rotSpeed, floatSpeed, parallaxFactor, scrollRef, children,
}: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * rotSpeed * 0.3;
    meshRef.current.rotation.y = t * rotSpeed * 0.5;
    meshRef.current.position.y =
      baseY + Math.sin(t * floatSpeed) * 0.4 - scrollRef.current * parallaxFactor;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {children}
      <meshStandardMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

const SHAPES = [
  // TorusKnots
  { pos: [-7,  2,  -4] as [number,number,number], color: "#FF5A00", opacity: 0.55, rot: 0.8, float: 0.6, parallax: 8,  geo: "torusKnot",   idx: 0 },
  { pos: [ 6, -5,  -3] as [number,number,number], color: "#FF5A00", opacity: 0.45, rot: 0.6, float: 0.5, parallax: 12, geo: "torusKnot",   idx: 1 },
  { pos: [ 3, 14,  -5] as [number,number,number], color: "#FF5A00", opacity: 0.50, rot: 1.0, float: 0.4, parallax: 6,  geo: "torusKnot",   idx: 2 },
  // Octahedra
  { pos: [ 8, -9,  -2] as [number,number,number], color: "#CC3300", opacity: 0.50, rot: 0.7, float: 0.8, parallax: 15, geo: "octahedron",  idx: 0 },
  { pos: [-5,  7,  -4] as [number,number,number], color: "#CC3300", opacity: 0.60, rot: 0.5, float: 0.7, parallax: 10, geo: "octahedron",  idx: 1 },
  { pos: [ 2,-16,  -3] as [number,number,number], color: "#CC3300", opacity: 0.45, rot: 0.9, float: 0.5, parallax: 5,  geo: "octahedron",  idx: 2 },
  // Icosahedra
  { pos: [-8, -3,  -5] as [number,number,number], color: "#FF8C42", opacity: 0.45, rot: 0.6, float: 0.6, parallax: 9,  geo: "icosahedron", idx: 0 },
  { pos: [ 5,  9,  -2] as [number,number,number], color: "#FF8C42", opacity: 0.55, rot: 0.8, float: 0.4, parallax: 14, geo: "icosahedron", idx: 1 },
  { pos: [-3,-11,  -4] as [number,number,number], color: "#FF8C42", opacity: 0.50, rot: 1.1, float: 0.7, parallax: 7,  geo: "icosahedron", idx: 2 },
  // Tori
  { pos: [ 7,  5,  -3] as [number,number,number], color: "#FF5A00", opacity: 0.40, rot: 0.7, float: 0.5, parallax: 11, geo: "torus",       idx: 0 },
  { pos: [-6, -7,  -2] as [number,number,number], color: "#FF5A00", opacity: 0.50, rot: 0.9, float: 0.6, parallax: 13, geo: "torus",       idx: 1 },
  { pos: [ 1, 18,  -5] as [number,number,number], color: "#FF5A00", opacity: 0.45, rot: 0.5, float: 0.4, parallax: 4,  geo: "torus",       idx: 2 },
];

function SceneContent({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#FF5A00" intensity={1.5} />
      <pointLight position={[-5, -3, 3]} color="#CC3300" intensity={0.8} />
      {SHAPES.map((s, i) => (
        <FloatingShape
          key={i}
          position={s.pos}
          color={s.color}
          opacity={s.opacity}
          rotSpeed={s.rot}
          floatSpeed={s.float}
          parallaxFactor={s.parallax}
          scrollRef={scrollRef}
        >
          {s.geo === "torusKnot"   && <torusKnotGeometry   args={[0.40 + s.idx * 0.07, 0.12, 80, 12]} />}
          {s.geo === "octahedron"  && <octahedronGeometry   args={[0.55 + s.idx * 0.10, 0]} />}
          {s.geo === "icosahedron" && <icosahedronGeometry  args={[0.45 + s.idx * 0.08, 0]} />}
          {s.geo === "torus"       && <torusGeometry        args={[0.50 + s.idx * 0.08, 0.12, 12, 48]} />}
        </FloatingShape>
      ))}
    </>
  );
}

export default function Scene3D() {
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
        camera={{ fov: 60, position: [0, 0, 12] }}
      >
        <SceneContent scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
