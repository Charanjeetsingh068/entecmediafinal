"use client";

import { useEffect, type RefObject } from "react";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Writes the element's scroll progress into a CSS variable (default `--sp`), for parallax and
 * scroll-drawn lines:
 *   "through" — 0 when its top meets the bottom of the screen, 1 when its bottom leaves the top
 *   "enter"   — 0 when its top meets the bottom of the screen, 1 when its top reaches the middle
 *   "pin"     — 0 when its top reaches the top of the screen, 1 when its bottom reaches the bottom
 * Runs for every visitor (including reduced-motion), only while the element is near the screen.
 */
export function useScrollVar(
  ref: RefObject<HTMLElement | null>,
  mode: "through" | "enter" | "pin" = "through",
  name = "--sp"
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let near = true;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "enter") p = (vh - r.top) / (vh * 0.5);
      else if (mode === "pin") p = -r.top / Math.max(1, r.height - vh);
      else p = (vh - r.top) / (r.height + vh);
      el.style.setProperty(name, clamp01(p).toFixed(4));
    };
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (near) onScroll();
    }, { rootMargin: "25% 0px" });
    io.observe(el);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, mode, name]);
}

/** Adds `is-in` to the element once it scrolls into view (for CSS-driven entrance animations). */
export function useInView(ref: RefObject<HTMLElement | null>, threshold = 0.2) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
}
