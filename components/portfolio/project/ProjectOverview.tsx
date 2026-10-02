"use client";

import { useRef } from "react";
import KButton from "@/components/shared/KButton";
import { sizedImage } from "@/lib/servicesContent";
import { useHoverScroll } from "@/lib/useHoverScroll";
import type { ProjectPage } from "@/lib/portfolioApi";
import { liveLinkProps } from "@/lib/portfolioItems";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Project overview (light), the section right after the hero.
 * Left: the project in a large browser frame as tall as the info column — website screenshots scroll
 * all the way down while hovered (touch: they scroll with the page), with a "Hover to scroll · %" pill;
 * the project number sits on the frame's corner.
 * Right: label, project name, the write-up, a facts grid (client, year, timeline, service), the
 * technology chips, what we did, and the actions: the category's "Go to website" / "Go to mobile app"
 * button (live link in a new tab, "#" until the project's url is added; none for design, logo, SEO and
 * ads projects) and Get a quote. A smaller copy of that button sits on the screenshot itself too.
 * ≤1199px: image on top, details below.
 */
export default function ProjectOverview({ page }: { page: ProjectPage }) {
  const { project, content, overview, services, number, liveLink } = page;
  const c = content.overview;
  const rootRef = useRef<HTMLElement>(null);
  useHoverScroll(rootRef, [project.id], true);

  const facts = [
    { label: c.clientLabel, value: project.client },
    { label: c.yearLabel, value: project.year },
    { label: c.durationLabel, value: project.duration },
    { label: c.categoryLabel, value: project.category },
  ].filter((f): f is { label: string; value: string } => !!f.value);

  const live = liveLinkProps(project.url);
  const address = project.url ? project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : project.client || project.title;

  return (
    <section className="k-section pd-ov" id="overview" data-theme="light" ref={rootRef} aria-labelledby="overview-title">
      <div className="container pd-ov-grid">
        <div className="pd-ov-media" data-kfx="y:80;opacity:0">
          <div className="pd-ov-frame" data-hs-area>
            <div className="pd-ov-bar">
              <i />
              <i />
              <i />
              <span>{address}</span>
            </div>
            <div className="pd-ov-shot hs-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sizedImage(project.image, 1400)} alt={`${project.title} by Entec Media`} className="hs-img" decoding="async" />
              <span className="hs-pill">
                <i />
                <span className="hs-pill-hover">{c.scrollHint}</span>
                <span className="hs-pill-touch">{c.touchHint}</span>
                <b className="hs-pct">0%</b>
              </span>
              {liveLink && (
                <a {...live} className="pd-ov-visit">
                  {liveLink.label}
                  {project.url && <span className="sr-only"> (opens in a new tab)</span>}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <span className="pd-ov-num" aria-hidden="true">
            {pad(number)}
          </span>
        </div>

        <div className="pd-ov-copy">
          <span className="why-section-label" data-kfx="y:40;opacity:0">
            <span className="k-accent-dot" aria-hidden="true" /> {c.label}
          </span>
          <h2 className="pd-ov-title" id="overview-title" data-kfx="y:56;opacity:0">
            {project.title}
          </h2>
          <div className="pd-ov-text" data-kfx="y:64;opacity:0">
            {overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {facts.length > 0 && (
            <dl className="pd-ov-facts" data-kfx="y:72;opacity:0">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.tech.length > 0 && (
            <div className="pd-ov-group" data-kfx="y:72;opacity:0">
              <span className="pd-ov-group-label">{c.techLabel}</span>
              <ul className="pd-ov-tech">
                {project.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pd-ov-group" data-kfx="y:72;opacity:0">
            <span className="pd-ov-group-label">{c.servicesLabel}</span>
            <ul className="pd-ov-services">
              {services.map((s) => (
                <li key={s}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="pd-ov-actions" data-kfx="y:80;opacity:0">
            {liveLink && (
              <a {...live} className="pd-ov-live">
                <span className="pd-ov-live-icon" aria-hidden="true">
                  {liveLink.icon === "app" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
                      <path d="M10.5 18.5h3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
                    </svg>
                  )}
                </span>
                <span className="pd-ov-live-text">
                  {liveLink.label}
                  <small>{address}</small>
                </span>
                <svg className="pd-ov-live-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
                {project.url && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            )}
            <KButton href={c.cta.href} label={c.cta.label} />
          </div>
        </div>
      </div>
    </section>
  );
}
