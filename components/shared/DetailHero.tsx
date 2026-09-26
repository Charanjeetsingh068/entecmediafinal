import Link from "next/link";
import type { ReactNode } from "react";

interface DetailHeroProps {
  backHref: string;
  backLabel: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: { label: string; value: ReactNode }[];
  children?: ReactNode;
}

/** Kudos case-study / article / job hero: back link in column 1, title + meta grid in columns 2–3. */
export default function DetailHero({ backHref, backLabel, eyebrow, title, subtitle, meta, children }: DetailHeroProps) {
  return (
    <section className="k-detail-hero" data-theme="light">
      <div className="container k-detail-hero-grid">
        <div className="k-detail-hero-side">
          <Link href={backHref} className="k-back-link">
            <span aria-hidden="true">←</span> {backLabel}
          </Link>
          {children}
        </div>
        <div className="k-detail-hero-main">
          {eyebrow && <span className="k-mono-label k-detail-eyebrow">{eyebrow}</span>}
          <h1 className="k-detail-title">
            {title}
            {subtitle && <span className="k-detail-subtitle">{subtitle}</span>}
          </h1>
          {meta && meta.length > 0 && (
            <dl className="k-detail-meta">
              {meta.map((item) => (
                <div key={item.label} className="k-detail-meta-item">
                  <dt className="k-mono-label">{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
