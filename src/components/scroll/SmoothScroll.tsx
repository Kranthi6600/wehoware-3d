"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "@/utils/animations";
import { ScrollTrigger } from "@/utils/animations";

export default function SmoothScroll({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [disabled]);

  return <>{children}</>;
}
