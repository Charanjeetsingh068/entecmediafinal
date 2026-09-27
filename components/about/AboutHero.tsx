"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import { siteConfig } from "@/lib/siteConfig";
import team1Img from "@/public/images/team1-avatar.webp";
import team2Img from "@/public/images/team2-avatar.webp";
import team3Img from "@/public/images/team3-avatar.webp";
import team4Img from "@/public/images/team4-avatar.webp";

const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;

// What we do, as photos (Unsplash CDN, sized per screen). The first is the tall card of the bento.
const steps = [
  { key: "design", id: "1547658719-da2b51169166", num: "01", tag: "Design", note: "Websites & UI/UX that convert", alt: "A website design shown on a laptop, tablet and phone" },
  { key: "develop", id: "1461749280684-dccba630e2f6", num: "02", tag: "Develop", note: "Fast websites & mobile apps", alt: "Website code on a screen" },
  { key: "grow", id: "1460925895917-afdab827c52f", num: "03", tag: "Grow", note: "SEO & paid ads that bring leads", alt: "A marketing analytics dashboard on a laptop" },
];

type Step = (typeof steps)[number];

function HeroCard({ s, i }: { s: Step; i: number }) {
  return (
    <figure className={`ab-hero-card ab-hero-card-${s.key}`} style={{ "--i": i } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo(s.id, 800)}
        srcSet={`${photo(s.id, 500)} 500w, ${photo(s.id, 800)} 800w, ${photo(s.id, 1200)} 1200w`}
        sizes="(max-width: 809px) 50vw, 26vw"
        alt={s.alt}
        decoding="async"
        fetchPriority={i === 0 ? "high" : "auto"}
      />
      <figcaption>
        <span className="ab-hero-card-num">{s.num}</span>
        <span className="ab-hero-card-text">
          <strong>{s.tag}</strong>
          <span className="ab-hero-card-note">{s.note}</span>
        </span>
        <span className="ab-hero-card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </figcaption>
    </figure>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
    { "@type": "ListItem", position: 2, name: "About Us", item: `${siteConfig.url}/about` },
  ],
};

/**
 * About hero — dark. Left: breadcrumb, a title whose lines slide up out of a mask on load, the intro,
 * actions and a trust row. Right: a bento of three photo cards (one tall, two stacked) that open on load;
 * hovering a card tilts it towards the pointer in 3D, drifts its photo the other way, lights it with a
 * soft spotlight and border sheen, and slides up its caption. The hero stays pinned while the page body
 * slides up over it, and its copy eases up and fades a little as that happens (--hp). Behind everything:
 * a dotted globe canvas (see below) and two soft brand glows.
 */
export default function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLCanvasElement>(null);

  // Canvas backdrop across the whole section, in the same dotted style as the other sections: a dot
  // matrix with slow light waves rolling over it, a particle wave along the bottom, a slowly turning dotted globe behind the photos, a tilted dotted orbit with a
  // bright comet, and drifting sparkles. The globe leans a little
  // towards the mouse. Runs only while the hero is visible and the tab is open, capped at 30fps.
  useEffect(() => {
    const canvas = globeRef.current;
    const hero = heroRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    const MAX_A = 0.5;
    const shades = Array.from({ length: 26 }, (_, i) => `rgba(165, 185, 255, ${((i / 25) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(25, Math.round((a / MAX_A) * 25)))];
    const ACCENT = "rgba(79, 140, 255, 0.55)";

    let w = 0, h = 0, small = false;
    let raf = 0, last = 0, t = 0, inView = true;
    let tx = 0, ty = 0, mx = 0, my = 0, hasPointer = false;
    let pts: { x: number; y: number; z: number }[] = [];
    let sparks: { x: number; y: number; v: number; p: number }[] = [];

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 1200;
      // Evenly spread points on a sphere (Fibonacci lattice)
      const n = small ? 520 : 1000;
      const golden = Math.PI * (3 - Math.sqrt(5));
      pts = Array.from({ length: n }, (_, i) => {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        return { x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r };
      });
      sparks = Array.from({ length: small ? 30 : 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: 5 + Math.random() * 12,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      ctx.clearRect(0, 0, w, h);

      // Globe sits behind the photo bento (right on desktop, under the copy on smaller screens)
      const cx = small ? w * 0.5 : w * 0.73;
      const cy = small ? h * 0.72 : h * 0.52;
      const R = small ? Math.min(w * 0.7, h * 0.4) : Math.min(h * 0.62, w * 0.34);

      // 00. Dot matrix over the whole section; slow diagonal light waves roll across it, and the dots near
      //     the mouse brighten a little, so the full background is alive, not just the corner behind the photos
      const gap = small ? 24 : 30;
      const px = (mx * 0.5 + 0.5) * w;
      const py = (my * 0.5 + 0.5) * h;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const wv = Math.sin(x * 0.006 + y * 0.004 - t * 2.4) * 0.5 + Math.sin(x * 0.011 - y * 0.007 + t * 1.6) * 0.5;
          const d = Math.hypot(x - px, y - py);
          const near = hasPointer ? Math.max(0, 1 - d / 260) : 0;
          const a = 0.03 + Math.max(0, wv) * 0.09 + near * 0.08;
          ctx.fillStyle = shade(a);
          const size = 1.1 + Math.max(0, wv) * 0.5;
          ctx.fillRect(x, y, size, size);
        }
      }

      // 0. Particle wave across the full width along the bottom of the section
      const cols = small ? 44 : 96;
      const rows = small ? 14 : 22;
      for (let r = 0; r < rows; r++) {
        const z = r / (rows - 1);
        const baseY = h * 0.55 + z * z * h * 0.38;
        const spread = w * (1.1 + z * 0.9);
        const amp = 8 + z * 40;
        const size = 1.1 + z * 1.6;
        for (let c = 0; c < cols; c++) {
          const x = c / (cols - 1) - 0.5;
          const wave = Math.sin(x * 7 + t * 2.2 + z * 3.2) * 0.6 + Math.sin(x * 2.6 - t * 1.3 + z * 5.5) * 0.4;
          const alpha = (0.03 + z * 0.15) * (0.5 + 0.5 * wave);
          if (alpha < 0.02) continue;
          ctx.fillStyle = shade(alpha);
          ctx.fillRect(w / 2 + x * spread, baseY + wave * amp, size, size);
        }
      }

      // 1. Dotted globe: turn around Y, tilt around X, dim the far side
      const ry = t * 0.9 + mx * 0.35;
      const rx = -0.38 + my * 0.2;
      const cosY = Math.cos(ry), sinY = Math.sin(ry), cosX = Math.cos(rx), sinX = Math.sin(rx);
      for (const p of pts) {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const a = 0.02 + depth * depth * 0.14;
        const size = 0.8 + depth * 1.1;
        ctx.fillStyle = shade(a);
        ctx.fillRect(cx + x1 * R, cy + y2 * R, size, size);
      }

      // 2. Tilted dotted orbit around the globe with a comet
      const oR = R * 1.32;
      const tilt = 0.32;
      const n = Math.floor((Math.PI * 2 * oR) / 8);
      ctx.fillStyle = shade(0.09);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        ctx.fillRect(cx + Math.cos(a) * oR, cy + Math.sin(a) * oR * tilt, 1.6, 1.6);
      }
      const head = t * 2.4;
      for (let i = 0; i < 16; i++) {
        const a = head - i * 0.04;
        const px = cx + Math.cos(a) * oR;
        const py = cy + Math.sin(a) * oR * tilt;
        if (i === 0) {
          ctx.fillStyle = ACCENT;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        } else {
          ctx.fillStyle = shade(0.22 * (1 - i / 16));
          ctx.fillRect(px - 1, py - 1, 2, 2);
        }
      }

      // 3. Drifting sparkles
      for (const sp of sparks) {
        sp.y -= sp.v * dt * 0.001;
        if (sp.y < -4) {
          sp.y = h + 4;
          sp.x = Math.random() * w;
        }
        ctx.fillStyle = shade(0.05 + 0.12 * (0.5 + 0.5 * Math.sin(t * 6 + sp.p)));
        ctx.fillRect(sp.x, sp.y, 1.6, 1.6);
      }
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      const dt = time - last;
      if (dt < 33) return; // ~30fps is plenty for a slow backdrop
      last = time;
      frame(Math.min(dt, 100));
    };
    const start = () => {
      if (!raf && inView && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    frame(0);
    const ro = new ResizeObserver(() => {
      resize();
      frame(0);
    });
    ro.observe(canvas);

    // The hero is pinned, so it counts as visible until the page body has fully covered it
    const onScroll = () => {
      const next = window.scrollY < hero.offsetHeight;
      if (next === inView) return;
      inView = next;
      if (inView) start();
      else stop();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      hasPointer = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    hero.addEventListener("pointermove", onMove);
    onScroll();
    start();

    // Hide the site's dashed column guides over the hero only (they run from the top of the page, and
    // the hero is the first thing on it), so no box lines cross the background animation
    const guides = document.querySelector<HTMLElement>(".k-guides");
    const maskGuides = () => {
      if (!guides) return;
      const mask = `linear-gradient(to bottom, transparent ${hero.offsetHeight}px, #000 ${hero.offsetHeight}px)`;
      guides.style.setProperty("-webkit-mask-image", mask);
      guides.style.setProperty("mask-image", mask);
    };
    maskGuides();
    const heroRo = new ResizeObserver(maskGuides);
    heroRo.observe(hero);

    return () => {
      stop();
      ro.disconnect();
      heroRo.disconnect();
      guides?.style.removeProperty("-webkit-mask-image");
      guides?.style.removeProperty("mask-image");
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      hero.removeEventListener("pointermove", onMove);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      hero.style.setProperty("--hp", clamp01(window.scrollY / (hero.offsetHeight || 1)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Card hover (mouse only): the card tilts towards the pointer, its photo drifts the other way, and a
    // soft light plus a border sheen follow the cursor. --cx/--cy are -1…1, --px/--py the pointer in %.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cards = fine ? Array.from(hero.querySelectorAll<HTMLElement>(".ab-hero-card")) : [];
    const onCardMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const x = clamp01((e.clientX - r.left) / r.width);
      const y = clamp01((e.clientY - r.top) / r.height);
      el.style.setProperty("--cx", (x * 2 - 1).toFixed(3));
      el.style.setProperty("--cy", (y * 2 - 1).toFixed(3));
      el.style.setProperty("--px", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--py", `${(y * 100).toFixed(1)}%`);
    };
    const onCardLeave = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty("--cx", "0");
      el.style.setProperty("--cy", "0");
    };
    cards.forEach((el) => {
      el.addEventListener("pointermove", onCardMove);
      el.addEventListener("pointerleave", onCardLeave);
    });

    return () => {
      cards.forEach((el) => {
        el.removeEventListener("pointermove", onCardMove);
        el.removeEventListener("pointerleave", onCardLeave);
      });
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="k-page-hero ab-hero" data-theme="dark" ref={heroRef}>
      <div className="ab-hero-bg" aria-hidden="true">
        <canvas className="ab-hero-globe" ref={globeRef} />
        <span className="ab-hero-glow ab-hero-glow-a" />
        <span className="ab-hero-glow ab-hero-glow-b" />
      </div>
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

        <div className="ab-hero-art" aria-hidden="true">
          <div className="ab-hero-col">
            <HeroCard s={steps[0]} i={0} />
          </div>
          <div className="ab-hero-col">
            <HeroCard s={steps[1]} i={1} />
            <HeroCard s={steps[2]} i={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
