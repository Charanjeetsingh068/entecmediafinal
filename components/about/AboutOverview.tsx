"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Reveal from "@/components/shared/Reveal";
import ScrollHighlightText from "@/components/shared/ScrollHighlightText";
import KButton from "@/components/shared/KButton";

const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;

// Two columns of photos that glide past each other (one up, one down)
const columns = [
  [
    { id: "1552664730-d307ca884978", alt: "A team planning a project around a whiteboard of sticky notes" },
    { id: "1547658719-da2b51169166", alt: "A website design shown on a laptop, tablet and phone" },
    { id: "1522542550221-31fd19575a2d", alt: "Designers sketching website layouts on paper" },
    { id: "1551650975-87deedd944c3", alt: "A mobile app shown on a phone" },
  ],
  [
    { id: "1531482615713-2afd69097998", alt: "Two colleagues reviewing work together on a screen" },
    { id: "1461749280684-dccba630e2f6", alt: "Website code on a screen" },
    { id: "1460925895917-afdab827c52f", alt: "A marketing analytics dashboard on a laptop" },
    { id: "1498050108023-c5249f4df085", alt: "A developer's laptop with code on a desk" },
  ],
];

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const pillars = [
  {
    title: "Design",
    desc: "UI/UX, websites, branding and creatives that make your business look as good as it is.",
    tags: ["UI/UX", "Websites", "Branding"],
    icon: icon(
      <>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <circle cx="11" cy="11" r="2" />
      </>
    ),
  },
  {
    title: "Development",
    desc: "Fast, secure websites, web apps and mobile apps — easy for your team to manage.",
    tags: ["Web apps", "Mobile apps", "CMS"],
    icon: icon(<path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />),
  },
  {
    title: "Marketing",
    desc: "SEO, Google Ads and Meta Ads that bring in quality leads and measurable growth.",
    tags: ["SEO", "Google Ads", "Meta Ads"],
    icon: icon(
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 6-6" />
      </>
    ),
  },
];

const story =
  "We started with a simple belief: a business deserves one partner who understands design, technology and marketing together. Today our team plans, builds and grows websites, apps and campaigns that work as one — clear, fast and measured by the results they bring.";

/**
 * About overview ("Who we are") — light, over a calm animated background: a dot grid whose dots twinkle
 * softly, each on its own rhythm (dots near the mouse brighten a little), and two slow brand-blue blobs.
 * Left: two columns of photos gliding past each other, one up and one down, faded at the top and bottom
 * (they pause on hover) inside a rounded frame as tall as the content beside it. Right: label, title, the
 * story lighting up word by word, the three pillars as bento cards (two side by side, the third full
 * width) and a button.
 */
export default function AboutOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLCanvasElement>(null);

  // Background dot grid. Kept faint so the content stays the focus; runs only while the section is on
  // screen and the tab is open, capped at 30fps.
  useEffect(() => {
    const canvas = dotsRef.current;
    const section = sectionRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;

    const MAX_A = 0.4;
    const shades = Array.from({ length: 21 }, (_, i) => `rgba(42, 39, 216, ${((i / 20) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(20, Math.round((a / MAX_A) * 20)))];

    let w = 0, h = 0, gap = 28;
    let raf = 0, last = 0, t = 0, inView = false;
    let px = -9999, py = -9999;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 810 ? 24 : 28;
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          // Each dot twinkles on its own slow rhythm (phase from its position); dots near the mouse brighten
          const phase = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const tw = 0.5 + 0.5 * Math.sin(t * 3 + (phase - Math.floor(phase)) * Math.PI * 2);
          const near = Math.max(0, 1 - Math.hypot(x - px, y - py) / 220);
          ctx.fillStyle = shade(0.07 + tw * 0.14 + near * 0.16);
          const size = 1.4 + tw * 0.7 + near * 0.9;
          ctx.fillRect(x, y, size, size);
        }
      }
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      const dt = time - last;
      if (dt < 33) return;
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
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(section);
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = () => {
      px = py = -9999;
    };
    document.addEventListener("visibilitychange", onVisibility);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="ab-ov" data-theme="light" ref={sectionRef}>
      <div className="ab-ov-bg" aria-hidden="true">
        <div className="ab-ov-bg-sticky">
          <span className="ab-ov-blob ab-ov-blob-a" />
          <span className="ab-ov-blob ab-ov-blob-b" />
          <canvas className="ab-ov-dots" ref={dotsRef} />
        </div>
      </div>

      <div className="container">
        <div className="ab-ov-split">
          {/* Left: gliding photo columns */}
          <div className="ab-ov-gallery" data-kfx="y:80">
            {columns.map((col, c) => (
              <div key={c} className={`ab-ov-track ${c === 0 ? "is-up" : "is-down"}`}>
                <div className="ab-ov-track-inner">
                  {[...col, ...col].map((img, i) => (
                    <figure key={i} className="ab-ov-shot" aria-hidden={i >= col.length || undefined}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo(img.id, 600)}
                        srcSet={`${photo(img.id, 400)} 400w, ${photo(img.id, 600)} 600w, ${photo(img.id, 900)} 900w`}
                        sizes="(max-width: 809px) 45vw, 22vw"
                        alt={i >= col.length ? "" : img.alt}
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: overview content */}
          <div className="ab-ov-copy">
            <span className="why-section-label" data-kfx="opacity:0;y:48">
              <span className="k-accent-dot" aria-hidden="true" /> OVERVIEW
            </span>
            <h2 className="ab-ov-title" data-kfx="opacity:0;y:48">
              <span className="k-muted">Who</span> we are
            </h2>
            <ScrollHighlightText className="ab-ov-story-text" text={story} />


            <div className="ab-ov-pillars">
              {pillars.map((p, i) => (
                <Reveal key={p.title} className={`ab-ov-pillar ab-ov-pillar-${i + 1}`} delay={i * 0.08}>
                  <div className="ab-ov-pillar-top">
                    <span className="ab-ov-pillar-icon" aria-hidden="true">
                      {p.icon}
                    </span>
                    <span className="ab-ov-pillar-num">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="ab-ov-pillar-text">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                  <ul className="ab-ov-pillar-tags">
                    {p.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <div className="ab-ov-cta" data-kfx="opacity:0;y:48">
              <KButton href="/services" label="Explore services" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
