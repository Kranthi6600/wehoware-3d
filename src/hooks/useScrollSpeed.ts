"use client";

import { useEffect, useRef, useState } from "react";

type ScrollSpeed = "fast" | "medium" | "slow";

export function useScrollSpeed(): ScrollSpeed {
  const [speed, setSpeed] = useState<ScrollSpeed>("slow");
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());
  const rafId = useRef<number | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const now = Date.now();
        const deltaY = Math.abs(window.scrollY - lastY.current);
        const deltaT = now - lastTime.current || 1;
        const velocity = deltaY / deltaT; // px/ms

        lastY.current = window.scrollY;
        lastTime.current = now;

        let next: ScrollSpeed;
        if (velocity > 2) {
          next = "fast";
        } else if (velocity > 0.5) {
          next = "medium";
        } else {
          next = "slow";
        }

        setSpeed(next);

        if (next === "fast") {
          document.body.classList.add("scrolling-fast");
        } else {
          document.body.classList.remove("scrolling-fast");
        }

        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => {
          setSpeed("slow");
          document.body.classList.remove("scrolling-fast");
        }, 150);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      document.body.classList.remove("scrolling-fast");
    };
  }, []);

  return speed;
}
