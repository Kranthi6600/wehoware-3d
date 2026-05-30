"use client";

export default function Testimonials() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center border-b border-white/10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,90,0,0.07) 0%, transparent 60%), #0D0D0D",
      }}
    >
      <div className="max-w-4xl px-6 text-center">
        <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-6">Testimonials Section</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
          Kind Words
        </h2>
      </div>
    </section>
  );
}
