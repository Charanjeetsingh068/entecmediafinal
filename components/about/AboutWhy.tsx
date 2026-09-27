"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import KButton from "@/components/shared/KButton";
import CountUp from "@/components/shared/CountUp";

interface Reason {
  title: string;
  desc: string;
  points: string[];
  icon: ReactNode;
  img: string;
  alt: string;
}

const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const reasons: Reason[] = [
  {
    title: "One team, start to finish",
    desc: "Design, development and marketing sit together, so your website, app and campaigns are planned as one — no hand-offs between agencies.",
    points: ["Single point of contact", "Shared strategy across channels"],
    icon: icon(
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M2.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M10.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
      </>
    ),
    img: "1552664730-d307ca884978",
    alt: "A team planning a project together around a whiteboard",
  },
  {
    title: "Results you can measure",
    desc: "Every project starts with the numbers that matter to you — enquiries, sales, rankings — and we track them from day one.",
    points: ["Clear goals before we begin", "Transparent reporting"],
    icon: icon(
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 6-6" />
        <path d="M16 8h4v4" />
      </>
    ),
    img: "1460925895917-afdab827c52f",
    alt: "A marketing analytics dashboard on a laptop",
  },
  {
    title: "Honest, open communication",
    desc: "You always know what we're working on, what it costs and why. Transparent pricing and reporting, with no hidden surprises.",
    points: ["Transparent pricing", "Regular check-ins"],
    icon: icon(
      <>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        <path d="M8.5 11h7M8.5 14h4" />
      </>
    ),
    img: "1531482615713-2afd69097998",
    alt: "Two colleagues reviewing work together on a screen",
  },
  {
    title: "On time, every time",
    desc: "A clear plan with milestones you can see. We deliver when we say we will, and keep you updated at every step.",
    points: ["Milestone-based timelines", "On budget, as agreed"],
    icon: icon(
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5M9 2h6" />
      </>
    ),
    img: "1522542550221-31fd19575a2d",
    alt: "Website layouts being planned on paper",
  },
  {
    title: "Built fast, secure and ready to grow",
    desc: "Modern, lightweight code and SEO-ready structure, so your site loads quickly, ranks well and scales with your business.",
    points: ["Speed & SEO best practice", "Easy for your team to manage"],
    icon: icon(
      <>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </>
    ),
    img: "1461749280684-dccba630e2f6",
    alt: "Clean website code on a screen",
  },
];

const stats = [
  { value: 20, suffix: "+", label: "Years of experience" },
  { value: 100, suffix: "+", label: "Projects delivered" },
  { value: 98, suffix: "%", label: "Client retention" },
  { value: 10, suffix: "+", label: "Digital services" },
];

/**
 * About "Why choose us" — dark. Left: label, title, a line of intro and an accordion of the five reasons —
 * one open at a time, showing its text and points. The open reason has a progress line; when it fills,
 * the next reason opens (it only plays while the section is on screen and pauses on hover). Right: a
 * large rounded photo that cross-fades to the open reason's picture, and under it a slim row of the four
 * counters (they count up when they come into view). Phones: the counters sit in a 2×2 grid.
 */
export default function AboutWhy() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Auto-advance only while the section is on screen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.35 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const next = () => setActive((a) => (a + 1) % reasons.length);

  return (
    <section className={`ab-why ${playing ? "is-playing" : ""}`} data-theme="dark" ref={sectionRef}>
      <div className="ab-why-grid-bg" aria-hidden="true" />
      <span className="ab-why-glow" aria-hidden="true" />

      <div className="container ab-why-layout">
        {/* Left: heading + accordion */}
        <div className="ab-why-side">
          <span className="why-section-label ab-why-label">
            <span className="k-accent-dot" aria-hidden="true" /> WHY CHOOSE US
          </span>
          <h2 className="ab-why-title" data-kfx="opacity:0;y:48">
            <span className="ab-why-soft">Reasons brands</span> stay with us
          </h2>
          <p className="ab-why-desc" data-kfx="opacity:0;y:48">
            Not just a good-looking launch — a partner that keeps working for your growth long after it.
          </p>

          <div className="ab-why-acc">
            {reasons.map((r, i) => {
              const open = i === active;
              return (
                <div key={r.title} className={`ab-why-item ${open ? "is-open" : ""}`}>
                  <button
                    type="button"
                    className="ab-why-head"
                    id={`ab-why-head-${i}`}
                    aria-expanded={open}
                    aria-controls={`ab-why-panel-${i}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="ab-why-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="ab-why-head-title">{r.title}</span>
                    <span className="ab-why-plus" aria-hidden="true" />
                  </button>
                  <div className="ab-why-panel" id={`ab-why-panel-${i}`} role="region" aria-labelledby={`ab-why-head-${i}`}>
                    <div className="ab-why-panel-inner">
                      <p>{r.desc}</p>
                    </div>
                  </div>
                  {open && <span key={`p${active}`} className="ab-why-timer" aria-hidden="true" onAnimationEnd={next} />}
                </div>
              );
            })}
          </div>

          <div className="ab-why-cta">
            <KButton href="/contact" label="Start a project" variant="dark" />
          </div>
        </div>

        {/* Right: photo with the open reason + counters */}
        <div className="ab-why-visual">
          <div className="ab-why-frame">
            {reasons.map((r, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={r.img}
                className={i === active ? "is-on" : undefined}
                src={photo(r.img, 1200)}
                srcSet={`${photo(r.img, 700)} 700w, ${photo(r.img, 1200)} 1200w, ${photo(r.img, 1600)} 1600w`}
                sizes="(max-width: 1199px) 100vw, 46vw"
                alt={i === active ? r.alt : ""}
                aria-hidden={i === active ? undefined : true}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
            <span className="ab-why-shade" aria-hidden="true" />
          </div>

          <ul className="ab-why-badges">
            {stats.map((s) => (
              <li key={s.label} className="ab-why-badge">
                <span className="ab-why-badge-num">
                  <CountUp end={s.value} suffix={s.suffix} />
                </span>
                <span className="ab-why-badge-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
