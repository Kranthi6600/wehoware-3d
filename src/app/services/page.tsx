import type { Metadata } from "next";
import Services from "@/components/sections/Services";

export const metadata: Metadata = {
  title: "Services — Wehoware",
  description: "What we build: immersive websites, web apps, and design systems.",
};

export default function ServicesPage() {
  return (
    <main>
      <Services />
    </main>
  );
}
