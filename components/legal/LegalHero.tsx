import type { CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import LegalIcon from "@/components/legal/LegalIcon";
import type { LegalDoc } from "@/lib/legalContent";

interface LegalHeroProps {
  doc: LegalDoc;
  updated: string;
  minutes: number;
}

/**
 * Legal page hero — dark, pinned (the body slides over it), same family as the other inner-page heroes:
 * breadcrumb, a title whose lines slide up out of a mask, intro, actions and three facts (last updated,
 * reading time, sections).
 * Right: a "document" composition — a paper sheet on two tilted sheets, its title and section lines
 * writing themselves in one after another, a light scanning down the page, a round seal with circling
 * text and the page's main icon, and the key promises floating beside it as chips.
 */
export default function LegalHero({ doc, updated, minutes }: LegalHeroProps) {
  const { hero } = doc;
  const lines = doc.sections.slice(0, 7);
  const seal = hero.highlights[0]?.icon ?? "shield";

  return (
    <section className="k-page-hero ab-hero lg-hero" data-theme="dark" aria-labelledby="legal-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: doc.name, href: doc.path },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {hero.label}
          </span>

          <h1 className="ab-hero-title" id="legal-title">
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.1s" }}>
                {hero.title.soft}
              </span>
            </span>
            <span className="ab-line">
              <span style={{ animationDelay: "0.22s" }}>
                {hero.title.strong}
                <em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          <p className="ab-hero-desc">{hero.desc}</p>

          <div className="ab-hero-actions">
            <KButton href={hero.primaryCta.href} label={hero.primaryCta.label} variant="dark" />
            <a href={hero.secondaryCta.href} className="ab-hero-link">
              {hero.secondaryCta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <dl className="sd-hero-facts lg-facts">
            <div>
              <dt>{doc.updatedLabel}</dt>
              <dd>{updated}</dd>
            </div>
            <div>
              <dt>{doc.readLabel}</dt>
              <dd>{minutes} min</dd>
            </div>
            <div>
              <dt>{doc.sectionsLabel}</dt>
              <dd>{doc.sections.length}</dd>
            </div>
          </dl>
        </div>

        <div className="lg-art" aria-hidden="true">
          <span className="lg-orbit" />

          <div className="lg-doc-wrap">
            <span className="lg-sheet lg-sheet-a" />
            <span className="lg-sheet lg-sheet-b" />
            <div className="lg-doc">
              <span className="lg-scan" />
              <div className="lg-doc-head">
                <span className="lg-doc-logo">E</span>
                <span>
                  <strong>{hero.docTitle}</strong>
                  <small>entecmedia.com</small>
                </span>
              </div>
              <ol className="lg-doc-lines">
                {lines.map((s, i) => (
                  <li key={s.id} style={{ "--i": i } as CSSProperties}>
                    <b>{String(i + 1).padStart(2, "0")}</b>
                    <span className="lg-doc-text">
                      <em>{s.title}</em>
                      <i />
                      <i />
                    </span>
                  </li>
                ))}
              </ol>
              <div className="lg-doc-sign">
                <svg viewBox="0 0 160 40">
                  <path d="M4 30c14-18 22-22 26-14s-6 14 2 10 14-22 20-18-4 20 4 16 10-14 16-12 2 12 10 10 12-10 20-12 14 6 22 4 14-8 20-10" />
                </svg>
                <small>{updated}</small>
              </div>
            </div>
          </div>

          <span className="lg-seal">
            <svg className="lg-seal-ring" viewBox="0 0 100 100">
              <defs>
                <path id="lg-ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
              </defs>
              <text>
                <textPath href="#lg-ring" textLength="230" lengthAdjust="spacing">
                  ENTEC MEDIA • TRUST • CLARITY •
                </textPath>
              </text>
            </svg>
            <LegalIcon name={seal} className="lg-seal-icon" />
          </span>

          <ul className="lg-chips">
            {hero.highlights.map((h, i) => (
              <li key={h.text} style={{ "--i": i } as CSSProperties}>
                <span className="lg-chip-icon">
                  <LegalIcon name={h.icon} />
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
