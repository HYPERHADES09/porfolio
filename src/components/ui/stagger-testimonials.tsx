import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import testimonialA from "@/assets/testimonial-a.jpeg";
import testimonialB from "@/assets/testimonial-b.jpeg";
import testimonialC from "@/assets/testimonial-c.jpeg";
import testimonialD from "@/assets/testimonial-d.jpeg";
import testimonialE from "@/assets/testimonial-e.jpeg";
import testimonialF from "@/assets/testimonial-f.jpeg";
import testimonialG from "@/assets/testimonial-g.jpeg";

type Testimonial = {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
  imgAlt: string;
  projectUrl: string;
};

const baseTestimonials: Testimonial[] = [
  {
    tempId: 0,
    testimonial:
      "Built a small tool to scan open ports and identify basic network exposure in lab environments.",
    by: "Nmap · Linux · Network Scanning",
    imgSrc: testimonialA,
    imgAlt: "Abstract network topology icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
  {
    tempId: 1,
    testimonial:
      "Tested web applications for common security issues like SQL injection and XSS.",
    by: "Burp Suite · OWASP Top 10",
    imgSrc: testimonialB,
    imgAlt: "Browser security testing icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
  {
    tempId: 2,
    testimonial:
      "Automated basic reconnaissance tasks to speed up repeated security checks.",
    by: "Python · Bash · Automation",
    imgSrc: testimonialC,
    imgAlt: "Security automation pipelines icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
  {
    tempId: 3,
    testimonial:
      "Analyzed network traffic to understand request flows and identify unusual behavior.",
    by: "Wireshark · TCP/IP · Traffic Analysis",
    imgSrc: testimonialD,
    imgAlt: "Network signal waveform icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
  {
    tempId: 4,
    testimonial:
      "Collected publicly available information to map digital footprints for learning purposes.",
    by: "OSINT · Reconnaissance · Research",
    imgSrc: testimonialE,
    imgAlt: "OSINT network graph icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
  {
    tempId: 5,
    testimonial:
      "Performed vulnerability scans and documented findings in a clear, structured format.",
    by: "Vulnerability Assessment · Reporting",
    imgSrc: testimonialF,
    imgAlt: "Shield and target security icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
  {
    tempId: 6,
    testimonial:
      "Worked on securing Linux systems by applying basic hardening and configuration checks.",
    by: "Linux Security · System Hardening",
    imgSrc: testimonialG,
    imgAlt: "Server infrastructure icon",
    projectUrl: "https://github.com/yourusername/your-project",
  },
];

function computePosition(index: number, len: number) {
  // Center item ends up at position 0
  return index - Math.floor(len / 2);
}

function TestimonialCard({
  position,
  testimonial,
  onSelect,
  cardSize,
}: {
  position: number;
  testimonial: Testimonial;
  onSelect: (steps: number) => void;
  cardSize: number;
}) {
  const isCenter = position === 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(position)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(position);
        }
      }}
      className={cn(
        "absolute left-1/2 top-1/2 text-left",
        "cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isCenter
          ? "z-10 bg-selected text-foreground border-border"
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px hsl(var(--border))"
          : "0px 0px 0px 0px transparent",
      }}
      aria-label={testimonial.by}
    >
      <div className="flex items-start gap-4">
        <img
          src={testimonial.imgSrc}
          alt={testimonial.imgAlt}
          loading="lazy"
          className={cn(
            "h-12 w-12 shrink-0 rounded-full border border-border object-cover",
            isCenter ? "opacity-100" : "opacity-80"
          )}
        />
        <div>
          <p className={cn("text-sm leading-relaxed", isCenter ? "text-foreground" : "text-card-foreground")}>
            “{testimonial.testimonial}”
          </p>
          <p
            className={cn(
              "mt-4 font-mono text-xs tracking-tight",
              isCenter ? "text-foreground/80" : "text-muted-foreground"
            )}
          >
            — {testimonial.by}
          </p>

          <div className="mt-5">
            <a
              href={testimonial.projectUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-4 py-2",
                "font-mono text-xs tracking-tight",
                "hairline bg-background text-foreground/85",
                "transition-transform duration-200 motion-reduce:transition-none",
                "hover:-translate-y-0.5"
              )}
              aria-label={`Open GitHub project for ${testimonial.by}`}
            >
              GitHub (placeholder)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StaggerTestimonials() {
  const reducedMotion = useReducedMotion();
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(baseTestimonials);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const touchRef = React.useRef<{ x: number; y: number } | null>(null);
  const pointerRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);

  const handleMove = useCallback(
    (steps: number, opts?: { markInteracted?: boolean }) => {
      const markInteracted = opts?.markInteracted ?? true;
      if (markInteracted && !hasInteracted) setHasInteracted(true);

      if (steps === 0) return;

      setTestimonialsList((prev) => {
        const newList = [...prev];

        if (steps > 0) {
          for (let i = steps; i > 0; i--) {
            const item = newList.shift();
            if (!item) return prev;
            newList.push({ ...item, tempId: Math.random() });
          }
        } else {
          for (let i = steps; i < 0; i++) {
            const item = newList.pop();
            if (!item) return prev;
            newList.unshift({ ...item, tempId: Math.random() });
          }
        }

        return newList;
      });
    },
    [hasInteracted]
  );

  useEffect(() => {
    if (reducedMotion) return;
    if (isPaused || isInteracting) return;

    const id = window.setInterval(() => {
      // Autoplay should not count as user interaction (keeps the hint visible).
      handleMove(1, { markInteracted: false });
    }, 4200);

    return () => window.clearInterval(id);
  }, [handleMove, isInteracting, isPaused, reducedMotion]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingContext =
        tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
      if (isTypingContext) return;

      if (e.key === "ArrowLeft") handleMove(-1);
      if (e.key === "ArrowRight") handleMove(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleMove]);

  const positioned = useMemo(() => {
    const len = testimonialsList.length;
    return testimonialsList.map((t, index) => ({
      t,
      position: computePosition(index, len),
    }));
  }, [testimonialsList]);

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div
        className="relative mx-auto h-[460px] w-full sm:h-[520px]"
        style={{ touchAction: "pan-y" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          if (!hasInteracted) setHasInteracted(true);
          setIsInteracting(true);
          pointerRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            hasMoved: false,
          };
        }}
        onPointerMove={(e) => {
          const state = pointerRef.current;
          if (!state || state.pointerId !== e.pointerId) return;

          const dx = e.clientX - state.startX;
          const dy = e.clientY - state.startY;

          // only treat as a drag if it's mostly horizontal and crosses threshold
          if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;

          if (!state.hasMoved && e.pointerType === "mouse") {
            // Capture only after a real drag begins (keeps click-to-select working).
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          }

          state.hasMoved = true;
          // Reset origin so a long drag can step multiple cards.
          state.startX = e.clientX;
          state.startY = e.clientY;

          handleMove(dx < 0 ? 1 : -1);
        }}
        onPointerUp={(e) => {
          const state = pointerRef.current;
          if (!state || state.pointerId !== e.pointerId) return;
          pointerRef.current = null;
          setIsInteracting(false);
          if (state.hasMoved && e.pointerType === "mouse") {
            (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
          }
        }}
        onPointerCancel={(e) => {
          const state = pointerRef.current;
          if (!state || state.pointerId !== e.pointerId) return;
          pointerRef.current = null;
          setIsInteracting(false);
          if (state.hasMoved && e.pointerType === "mouse") {
            (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
          }
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (!t) return;
          if (!hasInteracted) setHasInteracted(true);
          setIsInteracting(true);
          touchRef.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchRef.current;
          touchRef.current = null;
          const t = e.changedTouches[0];
          setIsInteracting(false);
          if (!start || !t) return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
          handleMove(dx < 0 ? 1 : -1);
        }}
      >
        {positioned.map(({ t, position }) => (
          <TestimonialCard
            key={t.tempId}
            position={position}
            testimonial={t}
            onSelect={handleMove}
            cardSize={cardSize}
          />
        ))}

        {!hasInteracted && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-glass px-3 py-2 font-mono text-[11px] tracking-tight text-foreground/70 hairline md:flex">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Drag</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "transition-colors motion-reduce:transition-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center",
            "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
            "transition-colors motion-reduce:transition-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
