import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function SoftCursor({ hidden }: { hidden: boolean }) {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50"
      animate={{
        x: pos.x,
        y: pos.y,
        opacity: hidden ? 0 : 1,
        scale: hidden ? 0.8 : 1,
      }}
      transition={{
        x: { type: "spring", stiffness: 900, damping: 55, mass: 0.2 },
        y: { type: "spring", stiffness: 900, damping: 55, mass: 0.2 },
        opacity: { duration: 0.22, ease: "easeOut" },
        scale: { duration: 0.22, ease: "easeOut" },
      }}
    >
      <div style={{ transform: "translate(-50%, -50%)" }}>
        {/* Use design-system tokens (foreground) */}
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "hsl(var(--foreground) / 0.9)" }}
        />
      </div>
    </motion.div>
  );
}
