import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import ProjectHeroArt from "@/components/portfolio/project/ProjectHeroArt";
import type { ProjectPage } from "@/lib/portfolioApi";
import { liveLinkProps } from "@/lib/portfolioItems";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Project page hero — dark, pinned like the About / Services heroes (the page body slides over it).
 * Left: breadcrumb, number / category, the project name with a soft "case study." line (both slide up
 * out of a mask), tagline, intro, actions (quote + "Go to website" / "Go to mobile app" for the
 * categories that have one, otherwise "See the project") and three key facts.
 * Right: a device composition built for projects (components/portfolio/project/ProjectHeroArt.tsx).
 */
export default function ProjectHero({ page, listLabel }: { page: ProjectPage; listLabel: string }) {
  const { project, content, stats, number, gallery, liveLink } = page;
  const hero = content.hero;

  return (
    <section className="k-page-hero ab-hero pd-hero" data-theme="dark" aria-labelledby="project-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: listLabel, href: "/portfolio" },
              { label: project.title, href: `/portfolio/${project.id}` },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {pad(number)} / {project.category}
          </span>

          <h1 className="ab-hero-title pd-hero-title" id="project-title">
            <span className="ab-line">
              <span style={{ animationDelay: "0.1s" }}>{project.title}</span>
            </span>
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.22s" }}>
                {hero.soft}
                <em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          {project.tagline && <p className="sd-hero-tagline">{project.tagline}</p>}
          <p className="ab-hero-desc">{project.description}</p>

          <div className="ab-hero-actions">
            <KButton href={hero.primaryCta.href} label={hero.primaryCta.label} variant="dark" />
            {liveLink ? (
              <a {...liveLinkProps(project.url)} className="ab-hero-link">
                {liveLink.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            ) : (
              <a href={hero.secondaryCta.href} className="ab-hero-link">
                {hero.secondaryCta.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </a>
            )}
          </div>

          <dl className="sd-hero-facts">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ProjectHeroArt
          image={project.image}
          second={gallery[1] ?? project.image}
          address={project.url ? project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : project.client || project.title}
          tech={project.tech}
          live={liveLink ? hero.liveChip : undefined}
          stackLabel={hero.stackLabel}
        />
      </div>
    </section>
  );
}
