"use client";

import { useEffect, useRef } from "react";
import { sizedImage } from "@/lib/servicesContent";

interface ServiceHeroArtProps {
  title: string;
  image: string;
  subImage: string;
  fact?: { value: string; label: string };
  highlights: string[];
  includedLabel: string;
}

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Right side of the service detail hero — organic photo composition.
 * The service photo sits in a large blob shape whose curves slowly morph; a thin outline blob behind it
 * morphs out of step and slowly turns. The overview photo sits in a circle overlapping the lower left,
 * framed by a navy gap ring and a slowly turning dashed orbit. A faint dotted square adds texture.
 * Load: the blob grows in, then the circle pops in. Mouse devices: the blob and the circle drift in
 * opposite directions with the pointer (--mx / --my). Ongoing, calm motion: the main photo slowly pans,
 * the circle and the fact card float, the dots drift and the orbit dot pulses. One glass card keeps the
 * key fact + highlights (they appear one by one).
 */
export default function ServiceHeroArt({ title, image, subImage, fact, highlights, includedLabel }: ServiceHeroArtProps) {
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
    const onMove = (e: Event) => {
      const p = e as PointerEvent;
      const r = art.getBoundingClientRect();
      tx = clamp1(((p.clientX - r.left) / r.width) * 2 - 1);
      ty = clamp1(((p.clientY - r.top) / r.height) * 2 - 1);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      tx = ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="sd-hero-art" ref={artRef}>
      <span className="sd-dots" aria-hidden="true" />
      <span className="sd-blob-line" aria-hidden="true" />

      <figure className="sd-blob">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sizedImage(image, 1200)}
          srcSet={`${sizedImage(image, 700)} 700w, ${sizedImage(image, 1200)} 1200w, ${sizedImage(image, 1600)} 1600w`}
          sizes="(max-width: 1199px) 80vw, 38vw"
          alt={`${title} by Entec Media`}
          fetchPriority="high"
          decoding="async"
        />
      </figure>

      <figure className="sd-circle">
        <span className="sd-orbit" aria-hidden="true" />
        <span className="sd-circle-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sizedImage(subImage, 600)} alt={`${title} project work`} decoding="async" />
        </span>
      </figure>

      <div className="sd-fact">
        {fact && (
          <div className="sd-fact-top">
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </div>
        )}
        <span className="sd-fact-label">{includedLabel}</span>
        <ul>
          {highlights.slice(0, 3).map((h) => (
            <li key={h}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
