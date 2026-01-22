import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Pixel {
  id: number;
  x: number;
  y: number;
  opacity: number;
  age: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

const PIXEL_SIZE = 12;
const TRAIL_LENGTH = 40;
const FADE_SPEED = 0.04;

const BURST_COUNT = 14;
const BURST_RADIUS = 34;
const RIPPLE_FADE_SPEED = 0.055;
const RIPPLE_GROWTH = 0.055;

export function PixelCursorTrail() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [visible, setVisible] = useState(true);
  const pixelIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number | null>(null);

  const hiddenByHeroRef = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // Reads the global suppression state without wiring a React dependency chain.
  // We toggle `visible` (CSS fade) when the body has the marker class.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = document.documentElement;
    const className = "cursor-suppressed";

    const sync = () => {
      const suppressed = root.classList.contains(className);
      if (suppressed === hiddenByHeroRef.current) return;

      hiddenByHeroRef.current = suppressed;
      setVisible(!suppressed);

      // When hiding, clear existing artifacts after the fade.
      if (suppressed) {
        window.setTimeout(() => {
          if (hiddenByHeroRef.current) {
            setPixels([]);
            setRipples([]);
            lastPositionRef.current = null;
          }
        }, 240);
      }
    };

    sync();

    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [prefersReducedMotion]);

  const createPixel = useCallback((x: number, y: number): Pixel => {
    return {
      id: pixelIdRef.current++,
      x,
      y,
      opacity: 1,
      age: 0,
    };
  }, []);

  const createRipple = useCallback((x: number, y: number): Ripple => {
    return {
      id: rippleIdRef.current++,
      x,
      y,
      opacity: 1,
      scale: 0.25,
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // If suppressed, don't attach listeners.
    if (hiddenByHeroRef.current) return;

    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const last = lastPositionRef.current;
      if (!last) {
        lastPositionRef.current = { x, y };
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > PIXEL_SIZE) {
        const newPixel = createPixel(x, y);
        setPixels((prev) => [...prev.slice(-TRAIL_LENGTH), newPixel]);
        lastPositionRef.current = { x, y };
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // Keep it "primary mouse" like you asked (ignore touch).
      if (e.pointerType !== "mouse") return;

      const x = e.clientX;
      const y = e.clientY;

      // Burst pixels (short spray)
      setPixels((prev) => {
        const burst: Pixel[] = Array.from({ length: BURST_COUNT }).map(() => {
          const theta = Math.random() * Math.PI * 2;
          const radius = Math.random() * BURST_RADIUS;
          const bx = x + Math.cos(theta) * radius;
          const by = y + Math.sin(theta) * radius;
          const p = createPixel(bx, by);
          // Make burst pixels fade a bit faster by starting them slightly older.
          return { ...p, age: 18 };
        });

        // Keep total pixels bounded.
        const combined = [...prev, ...burst];
        return combined.slice(-TRAIL_LENGTH);
      });

      // Ripple ring
      setRipples((prev) => [...prev.slice(-5), createRipple(x, y)]);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [createPixel, createRipple, prefersReducedMotion, visible]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    if (!visible) return;

    const animate = () => {
      setPixels((prev) =>
        prev
          .map((pixel) => ({
            ...pixel,
            opacity: pixel.opacity - FADE_SPEED,
            age: pixel.age + 1,
          }))
          .filter((pixel) => pixel.opacity > 0)
      );

      setRipples((prev) =>
        prev
          .map((r) => ({
            ...r,
            opacity: r.opacity - RIPPLE_FADE_SPEED,
            scale: r.scale + RIPPLE_GROWTH,
          }))
          .filter((r) => r.opacity > 0)
      );
      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion, visible]);

  if (prefersReducedMotion) return null;

  const alphas = [1, 0.85, 0.7, 0.55, 0.4];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {ripples.map((r) => {
        const size = 64 * r.scale;
        return (
          <span
            key={r.id}
            className="absolute rounded-full"
            style={{
              left: r.x - size / 2,
              top: r.y - size / 2,
              width: size,
              height: size,
              border: `1px solid hsl(var(--foreground) / ${Math.max(
                0,
                Math.min(1, 0.55 * r.opacity)
              )})`,
              boxShadow: `0 0 0 1px hsl(var(--foreground) / ${Math.max(
                0,
                Math.min(1, 0.12 * r.opacity)
              )})`,
              transform: "translateZ(0)",
            }}
          />
        );
      })}

      {pixels.map((pixel, index) => {
        // older pixels are smaller
        const sizeMultiplier = Math.max(0.3, 1 - pixel.age / 100);
        const currentSize = PIXEL_SIZE * sizeMultiplier;
        const alpha = alphas[index % alphas.length] * pixel.opacity;

        return (
          <span
            key={pixel.id}
            className="absolute rounded-[2px]"
            style={{
              left: pixel.x - currentSize / 2,
              top: pixel.y - currentSize / 2,
              width: currentSize,
              height: currentSize,
              backgroundColor: `hsl(var(--foreground) / ${Math.max(0, Math.min(1, alpha))})`,
              transform: "translateZ(0)",
            }}
          />
        );
      })}
    </div>
  );
}

