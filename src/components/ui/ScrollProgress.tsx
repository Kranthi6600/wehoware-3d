"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, pct)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center">
      {/* Simple progress bar */}
      <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#FF5A00] rounded-full"
          style={{ width: `${progress * 100}%` }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Percentage label */}
      <motion.span
        className="text-[9px] font-mono ml-2 tracking-widest"
        animate={{ color: progress > 0 ? "#FF5A00" : "rgba(255,255,255,0.3)" }}
      >
        {Math.round(progress * 100)}%
      </motion.span>
    </div>
  );
}
