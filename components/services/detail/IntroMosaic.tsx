"use client";

import { useEffect, useRef } from "react";

/**
 * The overview photo (one image, never cut up) with scroll-driven effects:
 * Scroll (--sp, the section's progress): the photo starts as a smaller rounded window, slightly turned
 * and zoomed in, and widens to the full frame, straightens and settles as the section scrolls into view
 * (and reverses when scrolling back); the picture also drifts inside the frame.
 * Mouse devices: it tilts a little towards the pointer in 3D with a soft light sheen following it.
 * Always: a faint light sweep passes across the photo every few seconds.
 */
export default function IntroMosaic({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0;
    const tick = () => {
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      el.style.setProperty("--tx", x.toFixed(4));
      el.style.setProperty("--ty", y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      el.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
      el.classList.add("is-hover");
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      tx = ty = 0;
      el.classList.remove("is-hover");
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sd-photo" ref={ref}>
      <div className="sd-photo-window">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        <span className="sd-photo-sheen" aria-hidden="true" />
        <span className="sd-photo-sweep" aria-hidden="true" />
      </div>
    </div>
  );
}
