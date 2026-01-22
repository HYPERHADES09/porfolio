import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealDirection = "start" | "end" | "center";

export interface ScrambleHoverProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: RevealDirection;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  scrambledClassName?: string;
}

export function ScrambleHover({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className,
  scrambledClassName,
  sequential = false,
  revealDirection = "start",
}: ScrambleHoverProps) {
  const reducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = React.useState(text);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isScrambling, setIsScrambling] = React.useState(false);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const revealedIndices = React.useRef<Set<number>>(new Set());

  // Reduced-motion fallback: no scrambling, just a subtle underline + opacity shift on hover.
  if (reducedMotion) {
    return (
      <span
        className={cn(
          "inline-block whitespace-pre-wrap",
          "underline underline-offset-4 decoration-foreground/25",
          "transition-opacity duration-200 motion-reduce:transition-none",
          "opacity-90 hover:opacity-100",
          className
        )}
      >
        {text}
      </span>
    );
  }

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let currentIteration = 0;

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
      : characters.split("");

    const getNextIndex = () => {
      const textLength = text.length;
      const revealed = revealedIndices.current;

      switch (revealDirection) {
        case "start":
          return revealed.size;
        case "end":
          return textLength - 1 - revealed.size;
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(revealed.size / 2);
          const nextIndex = revealed.size % 2 === 0 ? middle + offset : middle - offset - 1;

          if (nextIndex >= 0 && nextIndex < textLength && !revealed.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLength; i++) {
            if (!revealed.has(i)) return i;
          }
          return 0;
        }
      }
    };

    const shuffleText = (value: string) => {
      const revealed = revealedIndices.current;

      if (useOriginalCharsOnly) {
        const positions = value.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealed.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !p.isSpace && !p.isRevealed)
          .map((p) => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) return " ";
            if (p.isRevealed) return value[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join("");
      }

      return value
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (revealed.has(i)) return value[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    };

    // Behavior (as requested):
    // - Start scrambled by default.
    // - On first hover, reveal the original text and keep it revealed permanently.
    if (isRevealed) {
      setIsScrambling(false);
      setDisplayText(text);
      return () => {
        if (interval) clearInterval(interval);
      };
    }

    setIsScrambling(true);

    interval = setInterval(() => {
      if (isHovering) {
        if (sequential) {
          if (revealedIndices.current.size < text.length) {
            const nextIndex = getNextIndex();
            revealedIndices.current.add(nextIndex);
            setDisplayText(shuffleText(text));
          } else {
            if (interval) clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
            setIsRevealed(true);
          }
        } else {
          setDisplayText(shuffleText(text));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            if (interval) clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
            setIsRevealed(true);
          }
        }
      } else {
        // Not hovering yet -> keep scrambling indefinitely.
        setDisplayText(shuffleText(text));
      }
    }, scrambleSpeed);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isHovering,
    isRevealed,
    text,
    characters,
    scrambleSpeed,
    useOriginalCharsOnly,
    sequential,
    revealDirection,
    maxIterations,
  ]);

  return (
    <motion.span
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      // Keep the effect on a single line and prevent layout wobble while scrambling.
      // We reserve layout using a hidden copy of the original text, and render the
      // animated/scrambled text as an absolute overlay.
      className={cn("relative inline-block whitespace-nowrap", className)}
    >
      <span className="sr-only">{text}</span>

      {/* Width/height reservation layer (prevents wobble) */}
      <span aria-hidden="true" className="invisible whitespace-nowrap">
        {text}
      </span>

      {/* Visible scrambling layer */}
      <span aria-hidden="true" className="absolute inset-0">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              isRevealed || revealedIndices.current.has(index) || !isScrambling
                ? undefined
                : scrambledClassName
            )}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  );
}
