import type { Metadata } from "next";
import About from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About — Wehoware",
  description: "Who we are and what drives us.",
};

export default function AboutPage() {
  return (
    <main>
      <About />
    </main>
  );
}
