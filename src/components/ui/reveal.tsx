import React from "react";

import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
  );
}

export function Reveal({
  children,
  className,
  once = true,
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={cn("reveal-on-scroll", visible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
