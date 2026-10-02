"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { sizedImage } from "@/lib/servicesContent";

interface ProjectHeroArtProps {
  image: string;
  /** Shown in the back window (a second screenshot, or the same image) */
  second: string;
  /** Text in the browser's address bar */
  address: string;
  tech: string[];
  /** "Live project" chip text — only when the project has a live website */
  live?: string;
  stackLabel: string;
}

/**
 * Right side of the project hero — a desktop composition (no phone), different from the services'
 * photo blobs: a large browser window showing the project, whose page scrolls top ↔ bottom on its own
 * with a scrollbar thumb that follows; a second, smaller window tilted behind it (a second view); a
 * pointer that glides across the main window and clicks now and then; a glass "Built with" card whose
 * technology chips appear one by one, and a "Live project" chip when there is a live site. A faint
 * dotted square and a slowly turning ring sit behind.
 * Load: the main window rises in, then the back window, the card and the chip. Mouse devices: the two
 * windows drift in opposite directions with the pointer (--mx / --my). Phones keep the two windows only.
 */
export default function ProjectHeroArt({ image, second, address, tech, live, stackLabel }: ProjectHeroArtProps) {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = artRef.current;
    if (!art || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const section = art.closest("section") ?? art;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      art.style.setProperty("--mx", x.toFixed(4));
      art.style.setProperty("--my", y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = art.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    section.addEventListener("pointermove", onMove as EventListener);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove as EventListener);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pd-art" ref={artRef} aria-hidden="true">
      <span className="pd-art-dots" />
      <span className="pd-art-ring" />

      {/* Second window behind, a little smaller and tilted */}
      <div className="pd-win pd-win-back">
        <div className="pd-win-bar">
          <i />
          <i />
          <i />
          <span>{address}</span>
        </div>
        <div className="pd-win-screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sizedImage(second, 900)} alt="" decoding="async" />
        </div>
      </div>

      {/* Main window: the page scrolls by itself, with a scrollbar that follows */}
      <div className="pd-win pd-win-front">
        <div className="pd-win-bar">
          <i />
          <i />
          <i />
          <span>{address}</span>
        </div>
        <div className="pd-win-screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sizedImage(image, 1400)} alt="" fetchPriority="high" decoding="async" />
          <span className="pd-win-scroll">
            <span />
          </span>
        </div>
      </div>

      {/* A pointer that glides over the window and clicks now and then */}
      <svg className="pd-cursor" viewBox="0 0 24 24">
        <path d="M5 3l14 8-6 1.6L10 19z" />
      </svg>

      {tech.length > 0 && (
        <div className="pd-stack">
          <span className="pd-stack-label">{stackLabel}</span>
          <ul>
            {tech.slice(0, 5).map((t, i) => (
              <li key={t} style={{ "--i": i } as CSSProperties}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {live && (
        <span className="pd-live">
          <i />
          {live}
        </span>
      )}
    </div>
  );
}
