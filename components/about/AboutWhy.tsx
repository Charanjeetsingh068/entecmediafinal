"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import KButton from "@/components/shared/KButton";

interface Reason {
  title: string;
  desc: string;
  points: string[];
  icon: ReactNode;
}

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
  },
];

const total = String(reasons.length).padStart(2, "0");

/**
 * About "Why choose us" — dark section. Desktop: the heading, a live 01/05 counter and a progress
 * bar stay pinned on the left while reason cards on the right pin one after another and stack; each
 * card that gets covered shrinks back and dims a little (--cover, set from the scroll). Phones: the same
 * stacking cards under the heading. Behind it a faint dot grid drifts with the scroll.
 */
export default function AboutWhy() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const cards = listRef.current?.querySelectorAll<HTMLElement>(".ab-why-card");
      if (!section || !cards?.length) return;
      const vh = window.innerHeight;

      // Cover progress of each card = how far the next card has slid over it
      let idx = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        let cover = 0;
        if (next) {
          const a = card.getBoundingClientRect();
          const b = next.getBoundingClientRect();
          cover = Math.min(1, Math.max(0, 1 - (b.top - a.top) / (a.height || 1)));
        }
        card.style.setProperty("--cover", cover.toFixed(3));
        if (card.getBoundingClientRect().top < vh * 0.6) idx = i;
      });
      setActive((prev) => (prev === idx ? prev : idx));

      const s = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.5 - s.top) / (s.height - vh * 0.5 || 1)));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      section.style.setProperty("--why-p", p.toFixed(4));
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
    <section className="ab-why" data-theme="dark" ref={sectionRef}>
      <div className="ab-why-grid-bg" aria-hidden="true" />

      <div className="container ab-why-layout">
        <div className="ab-why-side">
          <div className="ab-why-sticky">
            <span className="why-section-label ab-why-label">
              <span className="k-accent-dot" aria-hidden="true" /> WHY CHOOSE US
            </span>
            <h2 className="ab-why-title" data-kfx="opacity:0;y:48">
              <span className="ab-why-soft">Reasons brands</span> stay with us
            </h2>
            <p className="ab-why-desc" data-kfx="opacity:0;y:48">
              Not just a good-looking launch — a partner that keeps working for your growth long after it.
            </p>

            <div className="ab-why-progress" aria-hidden="true">
              <span className="ab-why-count">
                <span key={active} className="ab-why-count-now">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <small>/ {total}</small>
              </span>
              <span className="ab-why-bar">
                <span ref={barRef} />
              </span>
              <span key={`t${active}`} className="ab-why-current">
                {reasons[active].title}
              </span>
            </div>

            <div className="ab-why-cta">
              <KButton href="/contact" label="Start a project" variant="dark" />
            </div>
          </div>
        </div>

        <div className="ab-why-list" ref={listRef}>
          {reasons.map((r, i) => (
            <article
              key={r.title}
              className={`ab-why-card ${i === active ? "is-active" : ""}`}
              style={{ "--i": i } as CSSProperties}
            >
              <div className="ab-why-card-top">
                <span className="ab-why-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ab-why-icon" aria-hidden="true">
                  {r.icon}
                </span>
              </div>
              <h3 className="ab-why-card-title">{r.title}</h3>
              <p className="ab-why-card-desc">{r.desc}</p>
              <ul className="ab-why-points">
                {r.points.map((pt) => (
                  <li key={pt}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
