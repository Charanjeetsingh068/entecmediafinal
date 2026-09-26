"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "./SectionHeader";

export interface ProcessStep {
  title: string;
  desc: string;
  outcome: string;
}

const defaultSteps: ProcessStep[] = [
  {
    title: "Discover",
    desc: "We start by understanding your business, audience, competitors and goals, aligning on a clear plan before any design or code begins.",
    outcome: "A clear brief, sitemap and a focused strategy.",
  },
  {
    title: "Design",
    desc: "We shape wireframes and high-fidelity designs that balance your brand, usability and conversion — reviewed together until they feel right.",
    outcome: "Approved designs and a clickable prototype.",
  },
  {
    title: "Build",
    desc: "Our developers turn the approved designs into fast, secure and SEO-ready websites and apps, tested on every device.",
    outcome: "A polished, high-performing product ready for launch.",
  },
  {
    title: "Launch & Grow",
    desc: "We go live, set up analytics and keep improving with SEO, Google Ads and Meta Ads so the project keeps delivering results.",
    outcome: "A confident launch and measurable growth.",
  },
];

const expectations = [
  { title: "What to expect?", desc: "A clear, structured process with open communication and predictable delivery." },
  { title: "What you get?", desc: "Websites, apps and campaigns designed to scale and evolve with your business." },
  { title: "What it takes?", desc: "Shared ownership, timely feedback and clear collaboration throughout." },
];

interface ProcessSectionProps {
  steps?: ProcessStep[];
}

/** Kudos "Process" section: each step's black title bar grows in width as it scrolls into view. */
export default function ProcessSection({ steps = defaultSteps }: ProcessSectionProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rows = listRef.current?.querySelectorAll<HTMLElement>(".k-process-row");
      if (!rows) return;
      const vh = window.innerHeight;
      rows.forEach((row, i) => {
        const top = row.getBoundingClientRect().top;
        const p = Math.max(0, Math.min(1, (vh * 0.9 - top) / (vh * 0.55)));
        const bar = row.querySelector<HTMLElement>(".k-process-bar");
        if (bar) bar.style.width = `${25 + p * (35 + i * 13.3)}%`;
      });
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
    <section className="k-section k-process-section" data-theme="light">
      <div className="container">
        <SectionHeader
          layout="left"
          label="+ PROCESS"
          title={
            <>
              <span className="k-muted">Structure</span> meets
              <br />
              creative freedom
            </>
          }
          desc="A flexible framework that gives ideas room to grow while keeping projects focused and on track."
        />

        <div className="k-process-list" ref={listRef}>
          {steps.map((step, i) => (
            <div key={step.title} className="k-process-row">
              <div className="k-process-bar-track">
                <div
                  className="k-process-bar"
                  style={{ width: "25%" }}
                >
                  <span className="k-process-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="k-process-title">{step.title}</span>
                </div>
              </div>
              <div className="k-process-body">
                <span className="k-process-dot" aria-hidden="true" />
                <p className="k-process-desc">{step.desc}</p>
                <div className="k-process-outcome">
                  <span className="k-mono-label">Outcome:</span>
                  <p>{step.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="k-process-expect">
          <span className="why-section-label">+ PROJECT EXPERIENCE</span>
          {expectations.map((item) => (
            <div key={item.title} className="k-process-expect-item">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
