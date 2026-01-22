import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Combined component for 404 page
export default function NotFoundPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      {/* Background canvas */}
      <CircleAnimation />

      {/* Characters layer */}
      <CharactersAnimation />

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 py-16">
        <MessageDisplay />
      </div>
    </main>
  );
}

// 1. Message Display Component
function MessageDisplay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      aria-label="404 page not found"
      className={cn(
        "w-full max-w-2xl",
        "rounded-xl border border-border bg-background/70 backdrop-blur",
        "shadow-sm",
        isVisible ? "animate-fade-in" : "opacity-0",
      )}
    >
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Page Not Found</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">404</h1>
        </header>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-auto gap-2 px-6 py-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            type="button"
            className="h-auto gap-2 px-6 py-2"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </section>
  );
}

// 2. Characters Animation Component
type StickFigure = {
  top?: string;
  bottom?: string;
  src: string;
  transform?: string;
  speedX: number;
  speedRotation?: number;
};

function CharactersAnimation() {
  const charactersRef = useRef<HTMLDivElement | null>(null);

  const stickFigures: StickFigure[] = useMemo(
    () => [
      {
        top: "0%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg",
        transform: "rotateZ(-90deg)",
        speedX: 1500,
      },
      {
        top: "10%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick1.svg",
        speedX: 3000,
        speedRotation: 2000,
      },
      {
        top: "20%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick2.svg",
        speedX: 5000,
        speedRotation: 1000,
      },
      {
        top: "25%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg",
        speedX: 2500,
        speedRotation: 1500,
      },
      {
        top: "35%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick0.svg",
        speedX: 2000,
        speedRotation: 300,
      },
      {
        bottom: "5%",
        src: "https://raw.githubusercontent.com/RicardoYare/imagenes/9ef29f5bbe075b1d1230a996d87bca313b9b6a63/sticks/stick3.svg",
        speedX: 0,
      },
    ],
    [],
  );

  useEffect(() => {
    const container = charactersRef.current;
    if (!container) return;

    const createAndAnimate = () => {
      container.innerHTML = "";

      stickFigures.forEach((figure, index) => {
        const stick = document.createElement("img");
        stick.style.position = "absolute";
        stick.style.width = "18%";
        stick.style.height = "18%";
        stick.style.pointerEvents = "none";
        stick.style.userSelect = "none";

        if (figure.top) stick.style.top = figure.top;
        if (figure.bottom) stick.style.bottom = figure.bottom;
        stick.src = figure.src;

        if (figure.transform) stick.style.transform = figure.transform;

        container.appendChild(stick);

        // Skip animation for the last figure (static)
        if (index === stickFigures.length - 1) return;

        stick.animate([{ left: "100%" }, { left: "-20%" }], {
          duration: figure.speedX,
          easing: "linear",
          fill: "forwards",
        });

        // Skip rotation for the first figure
        if (index === 0) return;

        if (figure.speedRotation) {
          stick.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-360deg)" }], {
            duration: figure.speedRotation,
            iterations: Infinity,
            easing: "linear",
          });
        }
      });
    };

    createAndAnimate();

    const handleResize = () => createAndAnimate();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      container.innerHTML = "";
    };
  }, [stickFigures]);

  return <div ref={charactersRef} aria-hidden="true" className="absolute inset-0 z-[1]" />;
}

// 3. Circle Animation Component
type Circle = {
  x: number;
  y: number;
  size: number;
};

function readRootHslVar(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `hsl(${v})` : fallback;
}

function CircleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const timerRef = useRef(0);
  const circlesRef = useRef<Circle[]>([]);

  const initArr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    circlesRef.current = [];

    for (let index = 0; index < 260; index++) {
      const randomX =
        Math.floor(Math.random() * (canvas.width * 3 - canvas.width * 1.2 + 1)) + canvas.width * 1.2;

      const randomY =
        Math.floor(Math.random() * (canvas.height - canvas.height * -0.2 + 1)) + canvas.height * -0.2;

      const size = canvas.width / 1100;
      circlesRef.current.push({ x: randomX, y: randomY, size });
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    timerRef.current++;

    context.setTransform(1, 0, 0, 1, 0, 0);

    const distanceX = canvas.width / 80;
    const growthRate = canvas.width / 1000;

    // Use design tokens (falls back to a subtle neutral)
    context.fillStyle = readRootHslVar("--foreground", "rgba(255,255,255,0.9)");
    context.globalAlpha = 0.08;
    context.clearRect(0, 0, canvas.width, canvas.height);

    circlesRef.current.forEach((circle) => {
      context.beginPath();

      if (timerRef.current < 65) {
        circle.x = circle.x - distanceX;
        circle.size = circle.size + growthRate;
      }

      if (timerRef.current > 65 && timerRef.current < 500) {
        circle.x = circle.x - distanceX * 0.02;
        circle.size = circle.size + growthRate * 0.2;
      }

      context.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
      context.fill();
    });

    if (timerRef.current > 500) {
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;
      return;
    }

    requestIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const start = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      timerRef.current = 0;
      initArr();
      draw();
    };

    start();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      timerRef.current = 0;
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;

      const context = canvas.getContext("2d");
      if (context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      initArr();
      draw();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 h-full w-full"
    />
  );
}
