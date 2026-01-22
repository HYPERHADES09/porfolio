import * as React from "react";

import { cn } from "@/lib/utils";

interface RatingInteractionProps {
  onChange?: (rating: number) => void;
  className?: string;
}

const ratingData = [
  { emoji: "😔", label: "Terrible" },
  { emoji: "😕", label: "Poor" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😍", label: "Amazing" },
];

export function RatingInteraction({ onChange, className }: RatingInteractionProps) {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [justSubmitted, setJustSubmitted] = React.useState(false);

  const displayRating = hoverRating || rating;

  const handleClick = (value: number) => {
    setRating(value);
    onChange?.(value);
    setJustSubmitted(true);
  };

  React.useEffect(() => {
    if (!justSubmitted) return;
    const id = window.setTimeout(() => setJustSubmitted(false), 2200);
    return () => window.clearTimeout(id);
  }, [justSubmitted]);

  return (
    <div
      className={cn(
        "rounded-2xl bg-transparent px-4 py-3",
        className
      )}
      role="group"
      aria-label="Rating"
    >
      <div className="flex items-center justify-center gap-1.5">
        {ratingData.map((item, i) => {
          const value = i + 1;
          const isActive = value <= displayRating;
          const isExact = value === displayRating;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onFocus={() => setHoverRating(value)}
              onBlur={() => setHoverRating(0)}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl",
                "border border-transparent bg-transparent",
                "transition-transform duration-200 motion-reduce:transition-none",
                "hover:-translate-y-0.5 active:translate-y-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                // no selected/hover box styling
              )}
              aria-label={`Rate ${value}: ${item.label}`}
              aria-pressed={rating === value}
            >
              <span
                className={cn(
                  "text-2xl",
                  "transition-all duration-200 motion-reduce:transition-none",
                  isActive
                    ? "grayscale-0 opacity-100"
                    : "grayscale opacity-55 group-hover:opacity-80"
                )}
              >
                {item.emoji}
              </span>

              {/* Intentionally no selected outline/box. */}
            </button>
          );
        })}
      </div>

      <div className="relative mt-2 h-5 overflow-hidden">
        <p
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "font-mono text-[11px] tracking-tight text-foreground/70",
            "transition-all duration-300 motion-reduce:transition-none",
            displayRating > 0 || justSubmitted
              ? "opacity-0 blur-md scale-95"
              : "opacity-100 blur-0 scale-100"
          )}
        >
          Rate us
        </p>

        <p
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "font-mono text-[11px] tracking-tight text-foreground/80",
            "transition-all duration-300 motion-reduce:transition-none",
            justSubmitted && hoverRating === 0
              ? "opacity-100 blur-0 translate-y-0"
              : "opacity-0 blur-md translate-y-1"
          )}
        >
          Thank you
        </p>

        {ratingData.map((item, i) => {
          const value = i + 1;
          return (
            <p
              key={item.label}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "font-mono text-[11px] tracking-tight text-foreground/80",
                "transition-all duration-300 motion-reduce:transition-none",
                displayRating === value && !justSubmitted
                  ? "opacity-100 blur-0 translate-y-0"
                  : "opacity-0 blur-md translate-y-1"
              )}
            >
              {item.label}
            </p>
          );
        })}
      </div>
    </div>
  );
}
