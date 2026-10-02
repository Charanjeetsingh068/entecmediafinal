"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import KButton from "@/components/shared/KButton";
import DotBackdrop from "@/components/shared/DotBackdrop";
import { useInView, useScrollVar } from "@/lib/useScrollVar";
import { siteConfig } from "@/lib/siteConfig";
import type { QuoteCtaContent } from "@/lib/servicesContent";

interface QuoteCtaProps {
  content: QuoteCtaContent;
}

/**
 * "Get a quote" call-to-action (dark) — used on the service detail pages and the portfolio page.
 * No form — the button goes to the contact page.
 * Left: label, a two-line heading that rises out of a mask line by line, a short note, the button and
 * a phone link. Right: a "quote brief" card that fills in as you scroll — each point slides in and its
 * tick draws itself, a progress bar runs to 100% and "Ready to start" lights up at the end. A circular
 * "GET A QUOTE" badge on the card's corner spins all the time (and turns further with the page).
 * Behind: the site's twinkling dot field (light-blue tone, always moving, brighter near the pointer)
 * plus faint rings that draw with the scroll and keep slowly orbiting, each with a small dot travelling
 * round it; on mouse devices they lean gently towards the pointer. All kept faint so the text stays
 * the focus.
 */
export default function QuoteCta({ content }: QuoteCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useScrollVar(sectionRef, "through", "--sp");
  useScrollVar(cardRef, "enter", "--p");
  useInView(headRef, 0.15);

  // The copy is hidden for its entrance only once JS is running, so it can never get stuck invisible
  useEffect(() => {
    sectionRef.current?.setAttribute("data-ready", "");
  }, []);

  // Mouse: the rings lean gently towards the pointer (--mx / --my, -1 → 1), easing back on leave
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0, mx = 0, my = 0;
    const apply = () => {
      raf = 0;
      section.style.setProperty("--mx", mx.toFixed(3));
      section.style.setProperty("--my", my.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const { contact } = siteConfig;
  const steps = content.points.length;

  return (
    <section ref={sectionRef} className="k-section sd-cta" id="quote" data-theme="dark" aria-labelledby="cta-title">
      <DotBackdrop tone="dark" />
      <svg className="sd-cta-rings" viewBox="0 0 600 600" aria-hidden="true">
        {[120, 190, 260].map((r, i) => (
          <g key={r} className="sd-cta-ring" style={{ "--i": i } as React.CSSProperties}>
            <circle cx="300" cy="300" r={r} pathLength="1" />
            <circle className="sd-cta-ring-dot" cx="300" cy={300 - r} r="3" />
          </g>
        ))}
      </svg>

      <div className="container sd-cta-grid">
        <div className="sd-cta-copy" ref={headRef}>
          <span className="why-section-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>
          <h2 className="sd-cta-title" id="cta-title">
            <span className="sd-cta-line">
              <span className="sd-soft">{content.title.soft}</span>
            </span>{" "}
            <span className="sd-cta-line">
              <span>{content.title.strong}</span>
            </span>
          </h2>
          <p className="sd-cta-desc">{content.desc}</p>
          <div className="sd-cta-actions">
            <KButton href={content.button.href} label={content.button.label} variant="dark" />
            <a className="sd-cta-call" href={contact.phoneHref}>
              <span>{content.callLabel}</span>
              {contact.phone}
            </a>
          </div>
        </div>

        <div className="sd-cta-card" ref={cardRef} style={{ "--n": steps } as React.CSSProperties}>
          <div className="sd-cta-card-head">
            <strong>{content.cardTitle}</strong>
            <span>{content.cardTag}</span>
          </div>

          <ul className="sd-cta-points">
            {content.points.map((point, i) => (
              <li key={point} style={{ "--i": i } as React.CSSProperties}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" />
                  <path d="M7 12.5l3.2 3.2L17 9" pathLength="1" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          <div className="sd-cta-progress">
            <span className="sd-cta-bar" aria-hidden="true">
              <span />
            </span>
            <span className="sd-cta-ready">{content.readyLabel}</span>
          </div>

          <Link href={content.button.href} className="sd-cta-badge" aria-label={content.button.label}>
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="sd-cta-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <g className="sd-cta-badge-spin">
                <text>
                  <textPath href="#sd-cta-ring" textLength="236" lengthAdjust="spacing">
                    {content.badgeText}
                  </textPath>
                </text>
              </g>
            </svg>
            <svg className="sd-cta-badge-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
