"use client";

import { useEffect } from "react";

/**
 * Magnetic buttons: while a mouse is over a .k-btn it leans a few pixels towards the pointer (kept
 * small so it never runs into nearby content) and springs back when the pointer leaves. One delegated
 * listener for the whole site (buttons rendered later are picked up automatically). Buttons inside a hosting card (.k-btn-host) are skipped — the
 * card has its own effects. Touch screens are left alone.
 */
export default function ButtonMagnet() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let current: HTMLElement | null = null;

    const reset = (el: HTMLElement) => {
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };

    const onMove = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest<HTMLElement>(".k-btn");
      if (current && current !== btn) {
        reset(current);
        current = null;
      }
      if (!btn || btn.closest(".k-btn-host")) return;
      current = btn;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.setProperty("--mx", `${(dx * 0.1).toFixed(1)}px`);
      btn.style.setProperty("--my", `${(dy * 0.18).toFixed(1)}px`);
    };

    const onLeave = () => {
      if (current) reset(current);
      current = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
