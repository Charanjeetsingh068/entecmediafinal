import type { CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import { sizedImage } from "@/lib/servicesContent";
import type { PortfolioPageContent } from "@/lib/portfolioContent";
import type { PortfolioItem } from "@/lib/portfolioItems";

interface PortfolioPageHeroProps {
  content: PortfolioPageContent["hero"];
  /** Page name for the breadcrumb ("Our Projects") */
  name: string;
  /** Projects shown on the wall (the first dozen with images are used) */
  projects: PortfolioItem[];
}

const COLUMNS = 3;
const PER_COLUMN = 4;

/**
 * Our Projects hero — dark, pinned (the page body slides over it), same family as the About and Services
 * heroes: breadcrumb, a title whose lines slide up out of a mask, intro, actions and three stats.
 * Right (its own design): a "project wall" — three tilted columns of project tiles that keep gliding,
 * the middle one the other way, fading out at the top and bottom. Hovering the wall pauses it and the
 * tile under the pointer lifts and shows its name and category. A floating chip sits on top.
 * The wall is pure CSS (each column's tiles are repeated once so the loop is seamless).
 */
export default function PortfolioPageHero({ content, name, projects }: PortfolioPageHeroProps) {
  const tiles = projects.slice(0, COLUMNS * PER_COLUMN);
  const columns = Array.from({ length: COLUMNS }, (_, c) => tiles.filter((_, i) => i % COLUMNS === c));

  return (
    <section className="k-page-hero ab-hero pf-hero" data-theme="dark" aria-labelledby="portfolio-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: name, href: "/portfolio" },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>

          <h1 className="ab-hero-title" id="portfolio-title">
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
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="pf-hero-art" aria-hidden="true">
          <div className="pf-wall">
            <div className="pf-wall-tilt">
              {columns.map((col, c) => (
                <div key={c} className="pf-col" style={{ "--c": c } as CSSProperties}>
                  <div className="pf-col-track">
                    {[...col, ...col].map((p, i) => (
                      <figure key={`${p.id}-${i}`} className="pf-tile">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sizedImage(p.image, 520)} alt="" loading={i < 2 ? "eager" : "lazy"} decoding="async" />
                        <figcaption>
                          <small>{p.category}</small>
                          <strong>{p.title}</strong>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <span className="sv-hero-chip pf-hero-chip">
            <span className="sv-hero-chip-dot" />
            {content.chip}
          </span>
        </div>
      </div>
    </section>
  );
}
