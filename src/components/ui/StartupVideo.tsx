"use client";

import { useState, useEffect } from "react";
import { useStartup } from "@/context/StartupContext";

export default function StartupVideo() {
  // Start as true (matches server render = no hydration mismatch).
  // A useEffect below sets it to false only when we're on "/" with no session flag.
  const [skipStartup, setSkipStartup] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { setIsStartupComplete } = useStartup();

  // Determine whether to show the video — runs only on the client after hydration
  useEffect(() => {
    const shouldSkip = window.location.pathname !== "/";
    setSkipStartup(shouldSkip);
  }, []);

  // Lock body scroll while video is showing
  useEffect(() => {
    if (skipStartup) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [skipStartup]);

  // Particles, loading bar, and auto-hide timer
  useEffect(() => {
    if (skipStartup) return;

    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2000,
      duration: 2000 + Math.random() * 2000,
    }));
    setParticles(generatedParticles);

    const duration = 5000;
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setLoadingProgress(Math.round(easedProgress * 100));
      if (progress >= 1) clearInterval(progressInterval);
    }, 50);

    const contentTimer = setTimeout(() => setShowContent(true), 300);
    const timer = setTimeout(() => {
      if (!videoEnded) handleVideoEnd();
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(contentTimer);
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEnded, skipStartup]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setIsStartupComplete(true);
    setTimeout(() => setIsVisible(false), 500);
  };

  if (skipStartup || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${
        videoEnded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        src="/assets/vids/Glowing_neural_network.mp4"
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden z-[2]">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#FF5A00] rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}ms`,
              animationDuration: `${particle.duration}ms`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative w-full h-full flex items-center justify-center z-[5]">
        <div className="absolute inset-0 bg-black/40 z-[3]" />

        <div className="relative z-10 text-center space-y-16">
          <div className={`space-y-4 transition-all duration-1000 transform ${
            showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              {"WEHOWARE".split("").map((letter, i) => (
                <span
                  key={i}
                  className="inline-block transition-all duration-500 transform"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animation: showContent ? "slideInUp 0.6s ease-out forwards" : "none",
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          <p
            className={`text-white/60 text-lg transition-all duration-1000 transform pt-16 ${
              showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ animationDelay: "600ms" }}
          >
            Welcome to our world. Where imagination meets engineering
          </p>

          <div
            className={`flex items-center justify-center space-x-3 transition-all duration-1000 transform ${
              showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "800ms" }}
          >
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF5A00] rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-white/60 text-xs font-mono">{loadingProgress}%</span>
          </div>
        </div>

        <button
          onClick={handleVideoEnd}
          className={`absolute bottom-8 right-8 z-[10] text-white text-xs hover:text-[#FF5A00] transition-all duration-300 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
