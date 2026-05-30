"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" | "hover" | "click";

export default function CustomCursor() {
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { stiffness: 500, damping: 40, mass: 0.3 });
  const y = useSpring(rawY, { stiffness: 500, damping: 40, mass: 0.3 });

  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile.current) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnterInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isDraggable = target.closest("[data-cursor='drag']");
      setState("hover");
      setLabel(isDraggable ? "drag" : "click");
    };

    const onLeaveInteractive = () => {
      setState("default");
      setLabel("");
    };

    const onMouseDown = () => setState("click");
    const onMouseUp = () => setState(prev => (prev === "click" ? "default" : prev));

    const addListeners = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
        el.addEventListener("mouseenter", onEnterInteractive as EventListener);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    };

    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    addListeners();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
    };
  }, [rawX, rawY, visible]);

  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
    return null;
  }

  const size = state === "hover" ? 44 : state === "click" ? 14 : 20;
  const bg = state === "hover" || state === "click" ? "#FF5A00" : "rgba(255,255,255,0.9)";

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor: bg,
          scale: state === "click" ? 0.6 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.5,
        }}
        className="rounded-full flex items-center justify-center overflow-hidden"
      >
        {state === "hover" && label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-[9px] font-bold text-black uppercase tracking-widest whitespace-nowrap select-none"
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Outer ring */}
      <motion.div
        animate={{
          width: state === "hover" ? 64 : state === "click" ? 28 : 38,
          height: state === "hover" ? 64 : state === "click" ? 28 : 38,
          opacity: state === "click" ? 0.3 : 0.15,
          borderColor: state === "hover" ? "#FF5A00" : "rgba(255,255,255,0.6)",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="absolute rounded-full border"
        style={{ borderWidth: 1 }}
      />
    </motion.div>
  );
}
