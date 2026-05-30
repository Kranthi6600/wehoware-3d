import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Wehoware",
  description: "Transparent pricing for every stage of your project.",
};

export default function PricingPage() {
  return (
    <main>
      <section
        className="relative min-h-screen flex items-center justify-center border-b border-white/10 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 20% 50%, rgba(255,90,0,0.1) 0%, transparent 60%), #0D0D0D",
        }}
      >
        <div className="max-w-4xl px-6 text-center">
          <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-6">
            Pricing Section
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            Simple Pricing
          </h2>
        </div>
      </section>
    </main>
  );
}
