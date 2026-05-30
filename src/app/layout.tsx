import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalSmoothScroll from "@/components/layout/ConditionalSmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import FloatingNav from "@/components/ui/FloatingNav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import StartupVideo from "@/components/ui/StartupVideo";
import Scene3DLoader from "@/components/ui/Scene3DLoader";
import { StartupProvider } from "@/context/StartupContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Wehoware — We Build What Others Dream",
  description:
    "Wehoware crafts immersive digital experiences — scroll-based websites, web apps, and design systems that move people.",
  keywords: ["web design", "Next.js", "scroll animations", "GSAP", "digital agency"],
  openGraph: {
    title: "Wehoware",
    description: "We Build What Others Dream",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StartupProvider>
          <Scene3DLoader />
          <StartupVideo />
          <CustomCursor />
          <ScrollProgress />
          <FloatingNav />
          <ConditionalSmoothScroll>{children}</ConditionalSmoothScroll>
        </StartupProvider>
      </body>
    </html>
  );
}
