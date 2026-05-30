"use client";

export default function Blog() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center border-b border-white/10 overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      {/* Orange glow blob — top right */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,90,0,0.45) 0%, rgba(255,90,0,0.15) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary softer glow — center right */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "30%",
          right: "5%",
          width: "35vw",
          height: "35vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,120,0,0.30) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <p className="text-sm tracking-[0.4em] text-white/40 uppercase mb-6">Blog Section</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
          Our Thoughts
        </h2>
      </div>
    </section>
  );
}
