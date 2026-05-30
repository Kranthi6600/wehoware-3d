export function attachTilt(el: HTMLElement, intensity = 12): () => void {
  const onMove = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "none";
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(8px)`;
    const shine = el.querySelector<HTMLElement>(".tilt-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,90,0,0.18) 0%, transparent 60%)`;
      shine.style.opacity = "1";
    }
  };
  const onLeave = () => {
    el.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    const shine = el.querySelector<HTMLElement>(".tilt-shine");
    if (shine) shine.style.opacity = "0";
  };
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}
