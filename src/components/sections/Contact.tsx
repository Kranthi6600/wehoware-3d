"use client";

export default function Contact() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(255,90,0,0.13) 0%, transparent 70%), #0D0D0D",
      }}
    >
      <div className="max-w-4xl px-6 text-center">
        <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-6">Contact Section</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
          Let&apos;s Talk
        </h2>
        <a
          href="mailto:support@wehoware.com"
          className="inline-block mt-10 px-10 py-4 text-sm tracking-[0.3em] uppercase font-bold border border-white/20 rounded-full hover:border-[#FF5A00] hover:text-[#FF5A00] transition-colors duration-300"
        >
          Get In Touch
        </a>
      </div>
    </section>
  );
}
