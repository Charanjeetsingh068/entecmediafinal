"use client";

import { useRef } from "react";
import KButton from "@/components/shared/KButton";
import CountUp from "@/components/shared/CountUp";
import WaveBackdrop from "@/components/shared/WaveBackdrop";
import IntroMosaic from "@/components/services/detail/IntroMosaic";
import { useInView, useScrollVar } from "@/lib/useScrollVar";
import type { ServiceDetail } from "@/lib/servicesData";
import { sizedImage, type ServiceDetailSections } from "@/lib/servicesContent";

interface ServiceIntroProps {
  service: ServiceDetail;
  content: ServiceDetailSections["intro"];
}

/**
 * Service overview (light), over a calm wave-line background (components/shared/WaveBackdrop.tsx).
 * Left: a layered image block — a brand-blue panel with fine diagonal lines offset behind (it turns a
 * little with scroll), the overview photo with a scroll-driven reveal (components/services/detail/IntroMosaic.tsx),
 * a small tilted second photo at the bottom right that straightens with scroll, the service number and
 * a key-fact card whose number counts up. Right: heading, story, checklist, tools, button.
 */
export default function ServiceIntro({ service, content }: ServiceIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  useScrollVar(sectionRef, "through");
  useInView(mediaRef, 0.25);

  const [lead, ...rest] = service.overviewDesc;
  const fact = service.stats[0];
  // Count up numeric facts like "100%" or "90+"; others ("2-in-1", "SEO") are shown as written
  const m = fact?.value.match(/^(D*)(d+)(D*)$/);
  const factNum = m ? { pre: m[1], n: Number(m[2]), suf: m[3] } : null;

  return (
    <section className="k-section sd-intro" data-theme="light" ref={sectionRef} aria-labelledby="overview-title">
      <WaveBackdrop />
      <div className="container sd-intro-grid">
        <div className="sd-intro-media" ref={mediaRef}>
          <span className="sd-intro-panel" aria-hidden="true" />

          <div className="sd-intro-frame">
            <IntroMosaic src={sizedImage(service.introImage, 1200)} alt={`${service.title} work in progress at Entec Media`} />
          </div>

          <figure className="sd-intro-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sizedImage(service.image, 600)} alt="" loading="lazy" decoding="async" />
          </figure>

          <span className="sd-intro-num" aria-hidden="true">
            {service.num}
          </span>
          {fact && (
            <div className="sd-intro-fact">
              <strong>{factNum ? <CountUp end={factNum.n} prefix={factNum.pre} suffix={factNum.suf} duration={1600} /> : fact.value}</strong>
              <span>{fact.label}</span>
            </div>
          )}
        </div>

        <div className="sd-intro-copy">
          <span className="why-section-label" data-kfx="y:48;opacity:0">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>
          <h2 className="sd-intro-title" id="overview-title" data-kfx="y:64;opacity:0">
            {service.overviewTitle}
          </h2>
          <p className="sd-intro-lead" data-kfx="y:72;opacity:0">
            {lead}
          </p>
          {rest.map((p, i) => (
            <p key={i} className="sd-intro-text" data-kfx="y:80;opacity:0">
              {p}
            </p>
          ))}

          <ul className="sd-intro-checks" aria-label={`${service.title} includes`} data-kfx="y:88;opacity:0">
            {service.highlights.map((h) => (
              <li key={h}>
                <span aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="sd-intro-tools" data-kfx="y:96;opacity:0">
            <span className="sd-intro-tools-label">{content.toolsLabel}</span>
            <ul>
              {service.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="sd-intro-cta" data-kfx="y:96;opacity:0">
            <KButton href="#quote" label={content.ctaLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
