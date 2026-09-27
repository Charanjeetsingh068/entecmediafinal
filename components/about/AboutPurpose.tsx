"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const values = [
  { title: "Honesty", desc: "Straight answers, open pricing and reports that show the real numbers." },
  { title: "Quality", desc: "Every pixel, line of code and ad is checked before it goes live." },
  { title: "Accountability", desc: "We own our work and treat your budget as if it were our own." },
  { title: "Partnership", desc: "Your goals become our goals — we grow when you grow." },
];

const steps = ["Vision", "Mission", "Values"];

/**
 * About "Vision, mission & values" — light section with a pinned horizontal scroll on large screens:
 * while the section is pinned, vertical scrolling slides a track of panels sideways (intro → Vision →
 * Mission → Values). Each panel reads its own progress (--pp) so its big outlined word fills with the
 * brand blue, its drawing completes and its content settles as it arrives. A step bar at the bottom
 * follows along. Small or short screens get the same panels stacked vertically, animated as they enter.
 */
export default function AboutPurpose() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 600px)");
    let raf = 0;
    let travel = 0;

    const measure = () => {
      if (mq.matches) {
        travel = Math.max(0, track.scrollWidth - window.innerWidth);
        section.style.height = `${travel + window.innerHeight}px`;
      } else {
        travel = 0;
        section.style.height = "";
        track.style.transform = "";
      }
      update();
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const panels = track.querySelectorAll<HTMLElement>(".ab-pp-panel");
      if (mq.matches) {
        const top = section.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, -top / (travel || 1)));
        track.style.transform = `translate3d(${(-p * travel).toFixed(1)}px, 0, 0)`;
        section.style.setProperty("--pp-all", p.toFixed(4));
        // A panel's progress: 0 as its left edge enters from the right, 1 once it sits at 45% of the screen
        panels.forEach((panel) => {
          const r = panel.getBoundingClientRect();
          const pp = Math.min(1, Math.max(0, (vw - r.left) / (vw * 0.55)));
          panel.style.setProperty("--pp", pp.toFixed(3));
        });
      } else {
        panels.forEach((panel) => {
          const r = panel.getBoundingClientRect();
          const pp = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
          panel.style.setProperty("--pp", pp.toFixed(3));
        });
        const s = section.getBoundingClientRect();
        section.style.setProperty("--pp-all", Math.min(1, Math.max(0, (vh - s.top) / (s.height + vh * 0.2))).toFixed(4));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="ab-pp" data-theme="light" ref={sectionRef}>
      <div className="ab-pp-sticky">
        <div className="ab-pp-track" ref={trackRef}>
          {/* Intro */}
          <div className="ab-pp-panel ab-pp-intro">
            <span className="why-section-label">
              <span className="k-accent-dot" aria-hidden="true" /> OUR PURPOSE
            </span>
            <h2 className="ab-pp-intro-title">
              <span className="k-muted">What drives</span>
              <br />
              every project
            </h2>
            <p className="ab-pp-intro-desc">
              The vision we work towards, the mission we deliver on each day, and the values that keep us honest.
            </p>
            <span className="ab-pp-hint" aria-hidden="true">
              Keep scrolling
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>

          {/* Vision */}
          <article className="ab-pp-panel ab-pp-card">
            <span className="ab-pp-word" aria-hidden="true" data-text="Vision">
              Vision
            </span>
            <div className="ab-pp-body">
              <span className="ab-pp-num">01 — Our vision</span>
              <h3 className="ab-pp-title">The most trusted growth partner for ambitious businesses.</h3>
              <p className="ab-pp-text">
                We want every business we work with to have technology and marketing that create real, measurable growth —
                and a partner they can rely on for years, not just one project.
              </p>
            </div>
            <svg className="ab-pp-art ab-pp-art-vision" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="88" className="ab-pp-ring ab-pp-ring-1" pathLength={100} />
              <circle cx="100" cy="100" r="62" className="ab-pp-ring ab-pp-ring-2" pathLength={100} />
              <circle cx="100" cy="100" r="36" className="ab-pp-ring ab-pp-ring-3" pathLength={100} />
              <circle cx="100" cy="100" r="9" className="ab-pp-core" />
              <circle cx="100" cy="12" r="4" className="ab-pp-orbit" />
            </svg>
          </article>

          {/* Mission */}
          <article className="ab-pp-panel ab-pp-card">
            <span className="ab-pp-word" aria-hidden="true" data-text="Mission">
              Mission
            </span>
            <div className="ab-pp-body">
              <span className="ab-pp-num">02 — Our mission</span>
              <h3 className="ab-pp-title">Help businesses win online — with quality, on time and in the open.</h3>
              <p className="ab-pp-text">
                High-quality websites, mobile apps, design and data-driven marketing, delivered on time, on budget and with
                complete transparency.
              </p>
              <ul className="ab-pp-checks">
                {["On time", "On budget", "Fully transparent"].map((c, i) => (
                  <li key={c} style={{ "--i": i } as CSSProperties}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <svg className="ab-pp-art ab-pp-art-mission" viewBox="0 0 200 200" aria-hidden="true">
              <path className="ab-pp-path" pathLength={100} d="M20 170 C 60 170, 60 110, 100 110 S 140 50, 180 40" />
              <circle cx="20" cy="170" r="5" className="ab-pp-core" />
              <path className="ab-pp-flag" d="M176 40 V 14 l 18 7 -18 7" />
            </svg>
          </article>

          {/* Values */}
          <article className="ab-pp-panel ab-pp-card ab-pp-values">
            <span className="ab-pp-word" aria-hidden="true" data-text="Values">
              Values
            </span>
            <div className="ab-pp-body">
              <span className="ab-pp-num">03 — Our values</span>
              <h3 className="ab-pp-title">Four principles behind every decision we make.</h3>
            </div>
            <ul className="ab-pp-value-grid">
              {values.map((v, i) => (
                <li key={v.title} style={{ "--i": i } as CSSProperties}>
                  <span className="ab-pp-value-idx">{String(i + 1).padStart(2, "0")}</span>
                  <strong>{v.title}</strong>
                  <p>{v.desc}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Step bar */}
        <div className="container ab-pp-steps" aria-hidden="true">
          <span className="ab-pp-steps-bar">
            <span />
          </span>
          {steps.map((s, i) => (
            <span key={s} className="ab-pp-step" style={{ "--i": i } as CSSProperties}>
              {String(i + 1).padStart(2, "0")} {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
