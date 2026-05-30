"use client";

import BlobMascot from "@/components/ui/BlobMascot";

export default function Services() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center border-b border-white/10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 80% 30%, rgba(255,90,0,0.09) 0%, transparent 65%), #0D0D0D",
      }}
    >
      <div className="max-w-4xl px-6 text-center flex flex-col items-center gap-12">
        <BlobMascot />
        <div>
          <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-6">Services Section</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
            What We Do
          </h2>
        </div>
      </div>
    </section>
  );
}
