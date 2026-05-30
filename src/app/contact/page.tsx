import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact — Wehoware",
  description: "Let's talk about your next project.",
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
