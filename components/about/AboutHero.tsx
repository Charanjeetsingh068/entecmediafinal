"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import LineTerrain from "@/components/shared/LineTerrain";
import KButton from "@/components/shared/KButton";
import { siteConfig } from "@/lib/siteConfig";
import team1Img from "@/public/images/team1-avatar.webp";
import team2Img from "@/public/images/team2-avatar.webp";
import team3Img from "@/public/images/team3-avatar.webp";
import team4Img from "@/public/images/team4-avatar.webp";

const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;

// Collage cards: what we do, as photos (Unsplash CDN, sized per screen)
const cards = [
  { key: "design", id: "1547658719-da2b51169166", tag: "01 · Design", alt: "A website design shown on a laptop, tablet and phone" },
  { key: "develop", id: "1461749280684-dccba630e2f6", tag: "02 · Develop", alt: "Website code on a screen" },
  { key: "grow", id: "1460925895917-afdab827c52f", tag: "03 · Grow", alt: "A marketing analytics dashboard on a laptop" },
];

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
    { "@type": "ListItem", position: 2, name: "About Us", item: `${siteConfig.url}/about` },
  ],
};

/**
 * About hero — dark. Left: breadcrumb, a title whose lines slide up out of a mask, the intro, actions
 * and a trust row. Right: a collage of three photo cards (Design · Develop · Grow) that fly in on load,
 * float gently, lean towards the pointer, and fan further apart as the page scrolls; a rotating badge
 * sits on top. Behind everything the site's faint line terrain drifts. The hero stays pinned while the
 * page body slides up over it, and its content eases up and fades a little as that happens (--hp).
 */
export default function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const art = artRef.current;
    if (!hero || !art) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight || 1)));
      hero.style.setProperty("--hp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pointer lean (mouse only): cards shift a few pixels towards the cursor, each by its own depth
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let mx = 0, my = 0, tx = 0, ty = 0, praf = 0;
    const loop = () => {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      art.style.setProperty("--mx", mx.toFixed(3));
      art.style.setProperty("--my", my.toFixed(3));
      praf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.002 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!praf) praf = requestAnimationFrame(loop);
    };
    if (fine) hero.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      hero.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(praf);
    };
  }, []);

  return (
    <section className="k-page-hero ab-hero" data-theme="dark" ref={heroRef}>
      <LineTerrain className="ab-hero-terrain" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <nav className="ab-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-hidden="true" className="ab-crumbs-sep">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </li>
              <li aria-current="page">About Us</li>
            </ol>
          </nav>

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> ABOUT ENTEC MEDIA
          </span>

          <h1 className="ab-hero-title">
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.1s" }}>
                We design, build
              </span>
            </span>
            <span className="ab-line">
              <span style={{ animationDelay: "0.22s" }}>
                &amp; grow brands<em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          <p className="ab-hero-desc">
            An IT and digital marketing company from Zirakpur, Punjab — designers, developers and marketers working as one
            team on your website, app and growth.
          </p>

          <div className="ab-hero-actions">
            <KButton href="/contact" label="Start a project" variant="dark" />
            <Link href="/portfolio" className="ab-hero-link">
              See our work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
          </div>

          <div className="ab-hero-trust">
            <div className="ab-hero-avatars">
              {[team1Img, team2Img, team3Img, team4Img].map((img, i) => (
                <Image key={i} src={img} alt="" width={36} height={36} />
              ))}
            </div>
            <span>
              <strong>4.9/5</strong> — trusted by growing businesses
            </span>
          </div>
        </div>

        <div className="ab-hero-art" ref={artRef} aria-hidden="true">
          {cards.map((c, i) => (
            <figure key={c.key} className={`ab-hero-card ab-hero-card-${c.key}`} style={{ "--i": i } as CSSProperties}>
              <div className="ab-hero-card-float">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo(c.id, 700)}
                  srcSet={`${photo(c.id, 480)} 480w, ${photo(c.id, 700)} 700w, ${photo(c.id, 1000)} 1000w`}
                  sizes="(max-width: 809px) 60vw, 26vw"
                  alt={c.alt}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
                <figcaption>{c.tag}</figcaption>
              </div>
            </figure>
          ))}

          <div className="ab-hero-badge">
            <svg viewBox="0 0 100 100">
              <defs>
                <path id="ab-badge-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <text>
                <textPath href="#ab-badge-ring" textLength="236" lengthAdjust="spacing">
                  DESIGN • DEVELOP • GROW • ONE TEAM •
                </textPath>
              </text>
            </svg>
            <span className="ab-hero-badge-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </span>
          </div>

          <div className="ab-hero-stat">
            <span className="ab-hero-stat-num">100+</span>
            <span className="ab-hero-stat-label">Projects delivered</span>
          </div>
        </div>

        <ul className="ab-hero-facts">
          <li>
            <span className="k-mono-label">Based in</span>
            <strong>Zirakpur, Punjab</strong>
          </li>
          <li>
            <span className="k-mono-label">What we do</span>
            <strong>Design · Development · Marketing</strong>
          </li>
          <li>
            <span className="k-mono-label">Experience</span>
            <strong>20+ years</strong>
          </li>
          <li>
            <span className="k-mono-label">Client retention</span>
            <strong>98%</strong>
          </li>
        </ul>
      </div>
    </section>
  );
}
