"use client";

import { useEffect, useRef, type ReactNode } from "react";
import CountUp from "@/components/shared/CountUp";
import Reveal from "@/components/shared/Reveal";
import ScrollHighlightText from "@/components/shared/ScrollHighlightText";
import KButton from "@/components/shared/KButton";

const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;
const MAIN = "1552664730-d307ca884978"; // team planning at a whiteboard
const SIDE = "1531482615713-2afd69097998"; // two people working at a screen

const stats = [
  { value: 20, suffix: "+", label: "Years of experience" },
  { value: 100, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 10, suffix: "+", label: "Digital services" },
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
    icon: icon(<path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />),
  },
  {
    title: "Marketing",
    desc: "SEO, Google Ads and Meta Ads that bring in quality leads and measurable growth.",
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
 * About overview ("Who we are") — light.
 * Desktop: a photo composition stays pinned on the left while the story scrolls past on the right. As the
 * section scrolls (--ovp): the main photo opens from a narrow window to its full frame and settles from a
 * zoom, a second photo rises over its corner faster than the page, and two small cards drift at their own
 * speeds. Right: label, title, the story lighting up word by word, and three pillars (Design, Development,
 * Marketing) whose rows draw in. Below, four counters sit on the guide-line columns.
 * Tablet/phone: the photo composition sits above the text and plays the same motion as it passes.
 */
export default function AboutOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const art = artRef.current;
    if (!section || !art) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const pinned = getComputedStyle(art).position === "sticky";
      const split = section.querySelector<HTMLElement>(".ab-ov-split") ?? section;
      const r = (pinned ? split : art).getBoundingClientRect();
      // Pinned: progress through the split block; stacked: 0 as the art enters, 1 once it nears the top
      const p = pinned ? (vh * 0.85 - r.top) / (r.height - vh * 0.3 || 1) : (vh - r.top) / (vh + r.height * 0.4 || 1);
      art.style.setProperty("--ovp", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="ab-ov" data-theme="light" ref={sectionRef}>
      <div className="container">
        <div className="ab-ov-split">
          <div className="ab-ov-art" ref={artRef}>
            <div className="ab-ov-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo(MAIN, 1200)}
                srcSet={`${photo(MAIN, 700)} 700w, ${photo(MAIN, 1200)} 1200w, ${photo(MAIN, 1600)} 1600w`}
                sizes="(max-width: 1199px) 100vw, 50vw"
                alt="A team planning a project around a whiteboard of sticky notes"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="ab-ov-side">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo(SIDE, 700)}
                srcSet={`${photo(SIDE, 450)} 450w, ${photo(SIDE, 700)} 700w`}
                sizes="(max-width: 809px) 45vw, 20vw"
                alt="Two colleagues reviewing work together on a screen"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="ab-ov-float ab-ov-float-a">
              <span className="ab-ov-float-dot" aria-hidden="true" />
              One team · Design, development &amp; marketing
            </div>

            <div className="ab-ov-float ab-ov-float-b">
              <span className="ab-ov-float-num">98%</span>
              <span className="ab-ov-float-label">
                Clients who stay,
                <br />
                project after project
              </span>
            </div>
          </div>

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
                <Reveal key={p.title} className="ab-ov-pillar" delay={i * 0.08}>
                  <span className="ab-ov-pillar-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ab-ov-pillar-icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="ab-ov-cta" data-kfx="opacity:0;y:48">
              <KButton href="/services" label="Explore services" />
            </div>
          </div>
        </div>

        <div className="ab-ov-stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="ab-ov-stat" delay={i * 0.08}>
              <span className="ab-ov-stat-line" aria-hidden="true" />
              <span className="ab-ov-stat-num">
                <CountUp end={s.value} suffix={s.suffix} />
              </span>
              <span className="ab-ov-stat-label">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
