import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);
}

export function ParallaxBackdrop({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [y, setY] = useState(0);

  useEffect(() => {
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY || 0));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  const driftA = clamp(y * 0.08, 0, 220);
  const driftB = clamp(y * 0.14, 0, 380);

  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 -z-10", className)}>
      {/* soft grid */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{ transform: `translateY(${reduce ? 0 : driftA}px)` }}
      >
        <div className="absolute inset-0 grain" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
      </div>

      {/* a slow-moving spotlight for depth */}
      <div
        className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          transform: `translate(-50%, ${reduce ? 0 : driftB}px)` ,
          background:
            "radial-gradient(closest-side, hsl(var(--foreground) / 0.08), transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% 10%, transparent 0%, hsl(var(--background) / 0.75) 55%, hsl(var(--background)) 100%)",
        }}
      />
    </div>
  );
}
