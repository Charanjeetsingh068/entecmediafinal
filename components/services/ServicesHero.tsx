"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import { sizedImage, type ServicesPageContent } from "@/lib/servicesContent";

/**
 * Services hero — dark, pinned (the page body slides over it), same family as the About hero.
 * Left: breadcrumb, a title whose lines slide up out of a mask, intro, actions and three stats.
 * Right (different from About's bento): a fanned deck of service photo cards. Every few seconds the
 * front card swings out to the back and the next one comes forward; a ring around the "next" button
 * shows the time left. Hovering the deck pauses it; the buttons or a card's tab pick a card.
 */
export default function ServicesHero({ content }: { content: ServicesPageContent["hero"] }) {
  const { cards, stats } = content;
  const INTERVAL = content.interval || 3600;
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const n = cards.length;

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => setFront((f) => (f + 1) % n), INTERVAL);
    return () => clearTimeout(timer.current);
  }, [front, paused, n, INTERVAL]);

  const go = (dir: number) => setFront((f) => (f + dir + n) % n);

  return (
    <section className="k-page-hero ab-hero sv-hero" data-theme="dark" aria-labelledby="services-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>

          <h1 className="ab-hero-title" id="services-title">
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.1s" }}>
                {content.title.soft}
              </span>
            </span>
            <span className="ab-line">
              <span style={{ animationDelay: "0.22s" }}>
                {content.title.strong}
                <em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          <p className="ab-hero-desc">{content.desc}</p>

          <div className="ab-hero-actions">
            <KButton href={content.primaryCta.href} label={content.primaryCta.label} variant="dark" />
            <a href={content.secondaryCta.href} className="ab-hero-link">
              {content.secondaryCta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>

          <dl className="sv-hero-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className={`sv-hero-art ${paused ? "is-paused" : ""}`}
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
        >
          <div className="sv-deck">
            {cards.map((c, i) => {
              const pos = (i - front + n) % n;
              return (
                <Link
                  key={c.href + i}
                  href={c.href}
                  className="sv-deck-card"
                  data-pos={pos}
                  style={{ "--i": i } as CSSProperties}
                  tabIndex={pos === 0 ? 0 : -1}
                  aria-hidden={pos === 0 ? undefined : true}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sizedImage(c.image, 900)}
                    srcSet={`${sizedImage(c.image, 600)} 600w, ${sizedImage(c.image, 900)} 900w, ${sizedImage(c.image, 1300)} 1300w`}
                    sizes="(max-width: 1199px) 80vw, 34vw"
                    alt={c.alt}
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : "auto"}
                  />
                  <span className="sv-deck-cap">
                    <span className="sv-deck-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="sv-deck-text">
                      <strong>{c.tag}</strong>
                      <small>{c.note}</small>
                    </span>
                    <span className="sv-deck-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="sv-deck-ui">
            <div className="sv-deck-tabs" role="tablist" aria-label="Service families">
              {cards.map((c, i) => (
                <button
                  key={c.href + i}
                  type="button"
                  role="tab"
                  aria-selected={i === front}
                  className={i === front ? "is-active" : ""}
                  onClick={() => setFront(i)}
                >
                  {c.tag}
                </button>
              ))}
            </div>
            <div className="sv-deck-nav">
              <button type="button" onClick={() => go(-1)} aria-label="Previous card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 18l-6-6 6-6" />
                </svg>
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next card" className="sv-deck-next">
                <svg className="sv-deck-ring" viewBox="0 0 48 48" aria-hidden="true" key={`${front}-${paused}`}>
                  <circle cx="24" cy="24" r="22" style={{ animationDuration: `${INTERVAL}ms` }} />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <span className="sv-hero-chip" aria-hidden="true">
            <span className="sv-hero-chip-dot" />
            {content.chip}
          </span>
        </div>
      </div>
    </section>
  );
}
