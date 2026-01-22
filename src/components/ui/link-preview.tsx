import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { encode } from "qss";
import React from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: "fixed" | "intrinsic" | "responsive" | "fill" | string;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export function LinkPreview({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = "fixed",
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) {
  const [isOpen, setOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const preloadedRef = React.useRef(false);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const src = React.useMemo(() => {
    if (isStatic) return imageSrc;

    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 3,
      "viewport.height": height * 3,
      quality,
    });

    return `https://api.microlink.io/?${params}`;
  }, [imageSrc, isStatic, quality, url, width, height]);

  const preload = React.useCallback(() => {
    if (preloadedRef.current) return;
    if (!src) return;

    // Preload + decode so the hover card can paint instantly.
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    // Decode is best-effort (not supported everywhere).
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    img.decode?.();
    preloadedRef.current = true;
  }, [src]);

  // If the preview is a local/static asset, preload it immediately (only a few images on the About section).
  React.useEffect(() => {
    if (!isStatic) return;
    if (!isMounted) return;
    preload();
  }, [isMounted, isStatic, preload]);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const targetRect = target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  return (
    <HoverCardPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <HoverCardPrimitive.Trigger asChild>
        <span
          onMouseMove={handleMouseMove}
          onMouseEnter={preload}
          onFocus={preload}
          className={cn("story-link inline-flex items-baseline", className)}
        >
          <a href={url} target="_blank" rel="noreferrer">
            {children}
          </a>
        </span>
      </HoverCardPrimitive.Trigger>

      {isMounted ? (
        <AnimatePresence>
          {isOpen ? (
            <HoverCardPrimitive.Portal forceMount>
              <HoverCardPrimitive.Content
                asChild
                side="top"
                align="center"
                sideOffset={12}
                className="z-50"
              >
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={cn(
                    "bg-surface hairline-strong overflow-hidden rounded-[var(--radius)] shadow-lift",
                    layout === "fill" ? "" : "p-2",
                    "w-fit max-w-[80vw] sm:max-w-[520px]"
                  )}
                  style={{
                    transform: `translateX(${translateX.get()}px)`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-[calc(var(--radius)-6px)]">
                    <motion.img
                      src={src}
                      alt={`Preview of ${url}`}
                      loading="lazy"
                      decoding="async"
                      initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
                      animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                      exit={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.99 }}
                      transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
                      className="block h-auto w-full object-contain"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: layout === "fill" ? undefined : width,
                      }}
                    />
                  </div>
                </motion.div>
              </HoverCardPrimitive.Content>
            </HoverCardPrimitive.Portal>
          ) : null}
        </AnimatePresence>
      ) : null}
    </HoverCardPrimitive.Root>
  );
}
