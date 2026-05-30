import type { Metadata } from "next";
import Blog from "@/components/sections/Blog";

export const metadata: Metadata = {
  title: "Blog — Wehoware",
  description: "Our thoughts on design, code, and culture.",
};

export default function BlogPage() {
  return (
    <main>
      <Blog />
    </main>
  );
}
