import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["gsap", "framer-motion", "three", "@react-three/fiber", "@react-three/drei"],
  },
};

export default nextConfig;
