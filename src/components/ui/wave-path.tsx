import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type WavePathProps = React.ComponentProps<"div"> & {
  height?: number;
};

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);
}

const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

export function WavePath({ className, height = 120, ...props }: WavePathProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [active, setActive] = useState(false);

  const progress = useRef(0);
  const x = useRef(0.2);
  const time = useRef(Math.PI / 2);
  const raf = useRef<number | null>(null);

  const getWidth = () => rootRef.current?.getBoundingClientRect().width ?? window.innerWidth;

  const setPath = (p: number) => {
    const w = getWidth();
    const mid = height / 2;
    const cpY = mid + p * 0.6;
    const cpX = w * x.current;
    pathRef.current?.setAttributeNS(null, "d", `M0 ${mid} Q${cpX} ${cpY}, ${w} ${mid}`);
  };

  useEffect(() => {
    setPath(progress.current);

    const onResize = () => setPath(progress.current);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  const resetAnimation = () => {
    time.current = Math.PI / 2;
    progress.current = 0;
    setActive(false);
  };

  const animateOut = () => {
    const newProgress = progress.current * Math.sin(time.current);
    progress.current = lerp(progress.current, 0, 0.025);
    time.current += 0.2;
    setPath(newProgress);

    if (Math.abs(progress.current) > 0.75) {
      raf.current = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
      raf.current = null;
      setPath(0);
    }
  };

  const onMouseEnter = () => {
    if (reduce) return;
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
      resetAnimation();
      setPath(0);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const { movementY, clientX } = e;
    const bounds = rootRef.current?.getBoundingClientRect();
    if (!bounds) return;
    x.current = (clientX - bounds.left) / bounds.width;
    progress.current += movementY;
    if (!active) setActive(true);
    setPath(progress.current);
  };

  const onMouseLeave = () => {
    if (reduce) return;
    animateOut();
  };

  return (
    <div
      ref={rootRef}
      className={cn("w-full", className)}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="block w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d={`M0 ${height / 2} Q0 ${height / 2}, 0 ${height / 2}`}
          className={cn("fill-none")}
          style={{
            stroke: "hsl(var(--foreground) / 0.78)",
            filter: active
              ? "drop-shadow(0 0 12px hsl(var(--foreground) / 0.75)) drop-shadow(0 0 28px hsl(var(--foreground) / 0.35))"
              : "none",
          }}
          strokeWidth={1}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
