"use client";

import { useEffect, useRef, useState } from "react";
import { onScrollNear } from "@/lib/scrollNear";

interface ScrollHighlightTextProps {
  text: string;
  className?: string;
}

/**
 * Kudos paragraph effect: words turn from grey to black as the paragraph scrolls through the viewport.
 * Only re-renders when the number of highlighted words changes (not on every scroll frame).
 */
export default function ScrollHighlightText({ text, className = "" }: ScrollHighlightTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const total = text.split(" ").length;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const distance = vh * 0.5 + rect.height * 0.5;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / distance));
      const next = Math.round(progress * total);
      setLit((prev) => (prev === next ? prev : next));
    };
    // Only while the section is on or near the screen (lib/scrollNear.ts)
    return onScrollNear(ref.current, update);
  }, [text]);

  return (
    <p ref={ref} className={`k-highlight-text ${className}`.trim()}>
      {words.map((word, i) => (
        <span key={i} className={i < lit ? "is-on" : undefined}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
