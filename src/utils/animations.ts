import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function fadeUpOnScroll(
  targets: string | Element | Element[],
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
    scrub?: boolean | number;
  } = {}
) {
  const {
    y = 60,
    duration = 1,
    stagger = 0.1,
    start = "top 85%",
    scrub = false,
  } = options;

  return gsap.fromTo(
    targets,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: typeof targets === "string" ? targets : undefined,
        start,
        scrub,
        toggleActions: "play none none none",
      },
    }
  );
}

export function pinSection(
  trigger: string | Element,
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
  } = {}
) {
  const { start = "top top", end = "+=200%", scrub = true, pin = true } = options;

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    pin,
    anticipatePin: 1,
  });
}

export function horizontalScroll(
  container: string | Element,
  items: string | Element
) {
  const ctx = gsap.context(() => {
    const panels = gsap.utils.toArray<Element>(items);
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${(panels.length - 1) * window.innerWidth}`,
      },
    });
  });
  return ctx;
}

export function textReveal(
  target: string | Element,
  options: { duration?: number; start?: string } = {}
) {
  const { duration = 1.2, start = "top 80%" } = options;

  return gsap.fromTo(
    target,
    { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      duration,
      ease: "power4.inOut",
      scrollTrigger: { trigger: target, start, toggleActions: "play none none none" },
    }
  );
}

export function scaleOnScroll(
  target: string | Element,
  options: { from?: number; to?: number; start?: string; end?: string } = {}
) {
  const { from = 0.85, to = 1, start = "top bottom", end = "top center" } = options;

  return gsap.fromTo(
    target,
    { scale: from },
    {
      scale: to,
      ease: "none",
      scrollTrigger: { trigger: target, start, end, scrub: true },
    }
  );
}
