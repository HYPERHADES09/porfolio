import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CursorSuppressionContextValue = {
  suppressed: boolean;
  setSuppressed: (value: boolean) => void;
};

const CursorSuppressionContext = createContext<CursorSuppressionContextValue | null>(
  null
);

export function CursorSuppressionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    // Used by non-React layers (pixel trail) to fade in/out smoothly.
    document.documentElement.classList.toggle("cursor-suppressed", suppressed);
    return () => {
      document.documentElement.classList.remove("cursor-suppressed");
    };
  }, [suppressed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) return;

    const prev = document.body.style.cursor;
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = prev;
    };
  }, []);

  const value = useMemo(
    () => ({ suppressed, setSuppressed }),
    [suppressed]
  );

  return (
    <CursorSuppressionContext.Provider value={value}>
      {children}
    </CursorSuppressionContext.Provider>
  );
}

export function useCursorSuppression() {
  const ctx = useContext(CursorSuppressionContext);
  if (!ctx) {
    throw new Error(
      "useCursorSuppression must be used within CursorSuppressionProvider"
    );
  }
  return ctx;
}
