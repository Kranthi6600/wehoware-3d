"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStartup } from "@/context/StartupContext";

// ── Section → nav mapping ────────────────────────────────────────────────────
type NavId     = "home" | "services" | "news" | "blog" | "more";
type SectionId = "home" | "services" | "news" | "blog" | "faq" | "pricing" | "about" | "contact";

const ROUTE: Record<SectionId, string> = {
  home: "/", services: "/services", news: "/news", blog: "/blog",
  faq: "/faq", pricing: "/pricing", about: "/about", contact: "/contact",
};

const PATH_TO_NAV: Record<string, NavId> = {
  "/": "home", "/services": "services", "/news": "news", "/blog": "blog",
  "/faq": "more", "/pricing": "more", "/about": "more", "/contact": "more",
};

// ── Main items ───────────────────────────────────────────────────────────────
const MAIN: { id: NavId; label: string }[] = [
  { id: "home",     label: "Home"     },
  { id: "services", label: "Services" },
  { id: "news",     label: "News"     },
  { id: "blog",     label: "Blog"     },
  { id: "more",     label: "More"     },
];

// ── More sub-items ───────────────────────────────────────────────────────────
const MORE: { id: SectionId; label: string }[] = [
  { id: "faq",     label: "FAQ's"      },
  { id: "pricing", label: "Pricing"    },
  { id: "about",   label: "About Us"   },
  { id: "contact", label: "Contact Us" },
];

// ── Icons ────────────────────────────────────────────────────────────────────
const W = 22;

function HomeIcon({ active }: { active: boolean }) {
  const s = active ? 2.4 : 1.7;
  return (
    <svg width={W} height={W} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  );
}

function ServicesIcon({ active }: { active: boolean }) {
  const s = active ? 2.4 : 1.7;
  return (
    <svg width={W} height={W} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2"  y="7"  width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="17" />
      <line x1="9"  y1="14.5" x2="15" y2="14.5" />
    </svg>
  );
}

function NewsIcon({ active }: { active: boolean }) {
  const s = active ? 2.4 : 1.7;
  return (
    <svg width={W} height={W} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
      <line x1="10" y1="8"  x2="18" y2="8"  />
      <line x1="10" y1="12" x2="18" y2="12" />
      <line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  );
}

function BlogIcon({ active }: { active: boolean }) {
  const s = active ? 2.4 : 1.7;
  return (
    <svg width={W} height={W} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function MoreIcon({ active }: { active: boolean }) {
  const color = active ? "currentColor" : "currentColor";
  const r = 2.2;
  return (
    <svg width={W} height={W} viewBox="0 0 24 24" fill={color}>
      <circle cx="8"  cy="8"  r={r} opacity={active ? 1 : 0.7} />
      <circle cx="16" cy="8"  r={r} opacity={active ? 1 : 0.7} />
      <circle cx="8"  cy="16" r={r} opacity={active ? 1 : 0.7} />
      <circle cx="16" cy="16" r={r} opacity={active ? 1 : 0.7} />
    </svg>
  );
}

// More popup icons (slightly smaller)
const P = 20;

function FaqIcon() {
  return (
    <svg width={P} height={P} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r=".5" fill="currentColor" />
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg width={P} height={P} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width={P} height={P} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth={2.5} />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width={P} height={P} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

const MAIN_ICONS: Record<NavId, (active: boolean) => React.ReactNode> = {
  home:     (a) => <HomeIcon     active={a} />,
  services: (a) => <ServicesIcon active={a} />,
  news:     (a) => <NewsIcon     active={a} />,
  blog:     (a) => <BlogIcon     active={a} />,
  more:     (a) => <MoreIcon     active={a} />,
};

const MORE_ICONS: Record<string, () => React.ReactNode> = {
  faq:     () => <FaqIcon     />,
  pricing: () => <PricingIcon />,
  about:   () => <AboutIcon   />,
  contact: () => <ContactIcon />,
};

// ── Glow indicator ───────────────────────────────────────────────────────────
function GlowBar({ visible }: { visible: boolean }) {
  return (
    <span style={{
      position: "absolute",
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 24,
      height: 3,
      borderRadius: 9999,
      background: visible ? "#FF5A00" : "transparent",
      boxShadow: visible
        ? "0 0 6px #FF5A00, 0 0 14px rgba(255,90,0,0.75), 0 0 30px rgba(255,90,0,0.4)"
        : "none",
      transition: "background 0.25s ease, box-shadow 0.25s ease",
    }} />
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FloatingNav() {
  const { isStartupComplete } = useStartup();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const router   = useRouter();
  const pathname = usePathname();
  const active   = PATH_TO_NAV[pathname] ?? "home";

  // Mount client-side only to avoid Dark Reader hydration mismatches
  useEffect(() => setMounted(true), []);

  // Fade in: on home page wait for startup to complete; on other pages show immediately
  useEffect(() => {
    if (pathname === "/" && !isStartupComplete) return;
    const delay = pathname === "/" ? 400 : 100;
    const id = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(id);
  }, [isStartupComplete, pathname]);

  // Close More on outside click
  useEffect(() => {
    if (!showMore) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMore]);

  const navigateTo = (id: SectionId) => {
    router.push(ROUTE[id]);
    setShowMore(false);
  };

  if (!mounted) return null;

  return (
    <nav style={{
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease, transform 0.5s ease",
      zIndex: 9000,
      pointerEvents: visible ? "auto" : "none",
      display: "flex",
      alignItems: "center",
      background: "rgba(10,10,10,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 9999,
      padding: "10px 16px",
    }}>

      {/* Main nav buttons */}
      {MAIN.map(({ id, label }) => {
        const isActive = active === id;

        if (id === "more") {
          return (
            <div key="more" ref={moreRef} style={{ position: "relative" }}>
              {/* More popup */}
              <div style={{
                position: "absolute",
                bottom: "calc(100% + 14px)",
                right: "-6px",
                width: 192,
                background: "rgba(12,12,12,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                opacity: showMore ? 1 : 0,
                transform: showMore ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
                pointerEvents: showMore ? "auto" : "none",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                transformOrigin: "bottom right",
              }}>
                {MORE.map(({ id: sid, label: slabel }) => (
                  <button
                    key={sid}
                    onClick={() => navigateTo(sid)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "12px 6px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 14,
                      cursor: "none",
                      color: "rgba(255,255,255,0.75)",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      transition: "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,90,0,0.12)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,90,0,0.3)";
                      (e.currentTarget as HTMLElement).style.color = "#FF5A00";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                    }}
                  >
                    {MORE_ICONS[sid]?.()}
                    {slabel}
                  </button>
                ))}
              </div>

              {/* More button */}
              <button
                onClick={() => setShowMore(v => !v)}
                aria-label="More"
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 68,
                  height: 44,
                  background: "none",
                  border: "none",
                  borderRadius: 9999,
                  cursor: "none",
                  color: (isActive || showMore) ? "#FFFFFF" : "rgba(255,255,255,0.38)",
                  transition: "color 0.25s ease",
                  padding: 0,
                }}>
                <GlowBar visible={isActive || showMore} />
                <span style={{ marginTop: 6 }}>{MAIN_ICONS.more(isActive || showMore)}</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 500,
                  marginTop: 2,
                  letterSpacing: "0.02em",
                  opacity: 0.7,
                }}>{label}</span>
              </button>
            </div>
          );
        }

        return (
          <button
            key={id}
            onClick={() => navigateTo(id as SectionId)}
            aria-label={label}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 54,
              height: 44,
              background: "none",
              border: "none",
              borderRadius: 9999,
              cursor: "none",
              color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.38)",
              transition: "color 0.25s ease",
              padding: 0,
            }}
          >
            <GlowBar visible={isActive} />
            <span style={{ marginTop: 6 }}>{MAIN_ICONS[id](isActive)}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              marginTop: 2,
              letterSpacing: "0.02em",
              opacity: 0.7,
            }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
