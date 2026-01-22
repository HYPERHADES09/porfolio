import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type DotSection = {
  id: string;
  label: string;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function ScrollDotsNav({
  sections,
  className,
}: {
  sections: DotSection[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.id) setActiveId(top.id);
      },
      {
        root: null,
        threshold: [0.35, 0.5, 0.65],
      }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Section navigation"
      className={cn(
        "fixed right-5 top-1/2 z-50 -translate-y-1/2",
        "hidden md:flex flex-col items-center gap-3",
        className
      )}
    >
      <div className="bg-glass hairline rounded-full p-2">
        <ul className="flex flex-col gap-2">
          {sections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onJump(s.id)}
                  aria-label={s.label}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative flex h-3 w-3 items-center justify-center rounded-full",
                    "transition-transform duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                    !prefersReducedMotion() && "hover:scale-125"
                  )}
                >
                  <span
                    className={cn(
                      "block h-1.5 w-1.5 rounded-full transition-all duration-200",
                      isActive ? "bg-foreground" : "bg-foreground/35",
                      !prefersReducedMotion() && "group-hover:bg-foreground/70"
                    )}
                  />
                  <span
                    className={cn(
                      "pointer-events-none absolute right-6 top-1/2 -translate-y-1/2",
                      "bg-glass hairline rounded-full px-2 py-1",
                      "text-[11px] font-mono tracking-tight text-foreground/80",
                      "opacity-0 translate-x-1 transition-all duration-200",
                      "group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
