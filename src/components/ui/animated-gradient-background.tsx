import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  /** Initial size of the radial gradient, defining the starting width. */
  startingGap?: number;

  /** Enables or disables the breathing animation effect. */
  breathing?: boolean;

  /** Alias for `breathing` to match external snippets. */
  Breathing?: boolean;

  /** Array of colors to use in the radial gradient. */
  gradientColors?: string[];

  /** Array of percentage stops corresponding to each color in `gradientColors`. */
  gradientStops?: number[];

  /** Speed of the breathing animation. Lower values result in slower animation. */
  animationSpeed?: number;

  /** Maximum range for the breathing animation in percentage points. */
  breathingRange?: number;

  /** Additional inline styles for the gradient container. */
  containerStyle?: React.CSSProperties;

  /** Additional class names for the gradient container. */
  containerClassName?: string;

  /** Additional top offset for the gradient container from the top. */
  topOffset?: number;
}

/**
 * AnimatedGradientBackground
 *
 * Renders an animated radial gradient backdrop. Uses CSS gradients + rAF for the
 * breathing effect. Defaults use semantic design tokens (HSL vars).
 */
export default function AnimatedGradientBackground({
  startingGap = 125,
  breathing,
  Breathing,
  gradientColors = [
    "hsl(var(--background))",
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))",
    "hsl(var(--muted))",
    "hsl(var(--foreground) / 0.25)",
    "hsl(var(--foreground) / 0)",
  ],
  gradientStops = [35, 50, 60, 70, 80, 90, 100],
  animationSpeed = 0.02,
  breathingRange = 5,
  containerStyle = {},
  topOffset = 0,
  containerClassName = "",
}: AnimatedGradientBackgroundProps) {
  const isBreathing = useMemo(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return false;

    // Prefer the canonical prop when provided; fall back to alias.
    if (typeof breathing === "boolean") return breathing;
    return Boolean(Breathing);
  }, [breathing, Breathing]);

  // Validation: Ensure gradientStops and gradientColors lengths match
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `gradientColors and gradientStops must have the same length. Received gradientColors length: ${gradientColors.length}, gradientStops length: ${gradientStops.length}`
    );
  }

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let width = startingGap;
    let directionWidth = 1;

    const animateGradient = () => {
      if (width >= startingGap + breathingRange) directionWidth = -1;
      if (width <= startingGap - breathingRange) directionWidth = 1;

      if (!isBreathing) directionWidth = 0;
      width += directionWidth * animationSpeed;

      const gradientStopsString = gradientStops
        .map((stop, index) => `${gradientColors[index]} ${stop}%`)
        .join(", ");

      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${gradientStopsString})`;

      if (containerRef.current) containerRef.current.style.background = gradient;

      animationFrame = window.requestAnimationFrame(animateGradient);
    };

    animationFrame = window.requestAnimationFrame(animateGradient);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [
    startingGap,
    isBreathing,
    gradientColors,
    gradientStops,
    animationSpeed,
    breathingRange,
    topOffset,
  ]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={cn("absolute inset-0", containerClassName)}
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
  );
}
