import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Wehoware",
  description: "Common questions answered.",
};

export default function FaqPage() {
  return (
    <main>
      <section
        className="relative min-h-screen flex items-center justify-center border-b border-white/10 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(255,90,0,0.09) 0%, transparent 65%), #0D0D0D",
        }}
      >
        <div className="max-w-4xl px-6 text-center">
          <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-6">
            FAQ Section
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            Got Questions?
          </h2>
        </div>
      </section>
    </main>
  );
}
