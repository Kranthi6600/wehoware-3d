"use client";

import { usePathname } from "next/navigation";
import { useStartup } from "@/context/StartupContext";
import SmoothScroll from "@/components/scroll/SmoothScroll";

export default function ConditionalSmoothScroll({ children }: { children: React.ReactNode }) {
  const { isStartupComplete } = useStartup();
  const pathname = usePathname();
  // Lenis is disabled only while the home startup video is still showing.
  // Always wrapping in <SmoothScroll> keeps Hero/PhoneModel mounted so their
  // animation state (phase, timeRef) is never reset mid-sequence.
  const disabled = pathname === "/" && !isStartupComplete;

  return <SmoothScroll disabled={disabled}>{children}</SmoothScroll>;
}
