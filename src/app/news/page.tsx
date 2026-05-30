import type { Metadata } from "next";
import Testimonials from "@/components/sections/Testimonials";
import Awards from "@/components/sections/Awards";

export const metadata: Metadata = {
  title: "News — Wehoware",
  description: "Client stories and recognition.",
};

export default function NewsPage() {
  return (
    <main>
      <Testimonials />
      <Awards />
    </main>
  );
}
