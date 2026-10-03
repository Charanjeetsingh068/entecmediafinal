"use client";

import { useEffect, useState, type CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import CareerIcon from "@/components/careers/CareerIcon";
import { sizedImage } from "@/lib/servicesContent";
import type { CareerIconName, CareersPageContent } from "@/lib/careersContent";

interface CareersHeroProps {
  content: CareersPageContent["hero"];
  name: string;
  /** Number of open roles */
  count: number;
  /** Teams with their number of open roles (chips on the hero art) */
  departments: { name: string; count: number }[];
}

const STEP = 1800;

const DEPT_ICON: Record<string, CareerIconName> = {
  Design: "spark",
  Development: "laptop",
  "Digital Marketing": "trend",
  Operations: "users",
};

/**
 * Careers hero — dark, pinned (the page body slides over it), same family as the other inner-page heroes:
 * breadcrumb, a title whose lines slide up out of a mask, intro, actions and three stats.
 * Right (its own design), "grow with us": the team photo in a tall rounded frame (slow pan, team
 * avatars and a note on it); a "Your growth path" card over its left edge where a marker climbs from
 * Intern to Team Lead, lighting each level in turn; the teams with their number of open roles as chips
 * drifting on the right; and a round badge with circling "Join the team" text and the open-role count.
 */
export default function CareersHero({ content, name, count, departments }: CareersHeroProps) {
  const levels = content.growth;
  const [k, setK] = useState(0);

  useEffect(() => {
    if (levels.length < 2) return;
    const t = setInterval(() => setK((v) => (v + 1) % (levels.length + 1)), STEP);
    return () => clearInterval(t);
  }, [levels.length]);

  // k runs 0…n: levels 0…n-1 light up one by one, then a short pause on the top level before restarting
  const step = Math.min(k, levels.length - 1);

  return (
    <section className="k-page-hero ab-hero cr-hero" data-theme="dark" aria-labelledby="careers-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: name, href: "/careers" },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>

          <h1 className="ab-hero-title" id="careers-title">
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
            {content.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value.replace("{count}", String(count))}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="cr-art" aria-hidden="true">
          <span className="cr-orbit" />

          {/* Team photo */}
          <figure className="cr-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sizedImage(content.photo, 1200)}
              srcSet={`${sizedImage(content.photo, 700)} 700w, ${sizedImage(content.photo, 1200)} 1200w`}
              sizes="(max-width: 1199px) 80vw, 32vw"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
            <figcaption className="cr-team">
              <span className="cr-team-faces">
                {content.avatars.map((a) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={a} src={a} alt="" decoding="async" />
                ))}
              </span>
              <span>{content.teamNote}</span>
            </figcaption>
          </figure>

          {/* Growth path: a marker climbs from the first level to the last */}
          <div className="cr-growth">
            <span className="cr-growth-title">
              <CareerIcon name="trend" />
              {content.growthTitle}
            </span>
            <ol style={{ "--n": levels.length, "--p": levels.length > 1 ? step / (levels.length - 1) : 0 } as CSSProperties}>
              <span className="cr-growth-track">
                <span />
              </span>
              {[...levels].reverse().map((l, ri) => {
                const i = levels.length - 1 - ri;
                return (
                  <li key={l.title} className={`${i <= step ? "is-done" : ""} ${i === step ? "is-now" : ""}`.trim() || undefined}>
                    <span className="cr-growth-dot" />
                    <span className="cr-growth-text">
                      <strong>{l.title}</strong>
                      <small>{l.note}</small>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Teams hiring */}
          <ul className="cr-depts">
            {departments.map((d, i) => (
              <li key={d.name} style={{ "--i": i } as CSSProperties}>
                <span className="cr-dept-icon">
                  <CareerIcon name={DEPT_ICON[d.name] ?? "users"} />
                </span>
                <span className="cr-dept-name">{d.name}</span>
                <b>{d.count}</b>
              </li>
            ))}
          </ul>

          {/* Round badge with the open-role count */}
          <a href={content.primaryCta.href} className="cr-badge" tabIndex={-1}>
            <svg className="cr-badge-ring" viewBox="0 0 100 100">
              <defs>
                <path id="cr-ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
              </defs>
              <text>
                <textPath href="#cr-ring" textLength="230" lengthAdjust="spacing">
                  {content.badgeText}
                </textPath>
              </text>
            </svg>
            <span className="cr-badge-count">
              <strong>{count}</strong>
              <small>{content.rolesLabel}</small>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
