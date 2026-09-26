"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { registerFx } from "@/lib/scrollFx";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger step (0, 0.08, 0.16…) — like Kudos, later items start further down: 48 → 72 → 96 → 120px */
  delay?: number;
  style?: CSSProperties;
}

/**
 * Kudos scroll transform: children rise into place linked to scroll progress (lib/scrollFx.ts).
 * Adds `.revealed` once in view so CSS-driven child animations (bars, tiles) still play.
 */
export default function Reveal({ children, className = "", delay = 0, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const step = Math.min(3, Math.round(delay / 0.08));
    return registerFx(el, { y: 48 + step * 24 }, "revealed");
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-item ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
