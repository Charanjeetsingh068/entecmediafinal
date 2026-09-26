"use client";

import { useEffect, useRef, useState } from "react";

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
    let raf = 0;
    const total = text.split(" ").length;
    const update = () => {
      raf = 0;
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
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
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
