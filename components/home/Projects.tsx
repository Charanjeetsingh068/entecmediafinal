"use client";

import Link from "next/link";
import { portfolioProjects } from "@/lib/portfolioData";
import SectionHeader from "@/components/shared/SectionHeader";
import CountUp from "@/components/shared/CountUp";
import Reveal from "@/components/shared/Reveal";
import KButton from "@/components/shared/KButton";

const featured = portfolioProjects.slice(0, 4);
const otherProjects = portfolioProjects.slice(4);

const stats = [
  { label: "Websites", end: 136, suffix: "" },
  { label: "Apps", end: 24, suffix: "" },
  { label: "Brands", end: 88, suffix: "" },
  { label: "Services", end: 10, suffix: "+" },
];

/**
 * Kudos "Featured Work": sticky intro + counters in column 1, square project stages in columns 2–3
 * and the project details sticking in column 4 while each stage scrolls past.
 */
export default function Projects() {
  return (
    <section id="projects" className="k-section k-featured" data-theme="light">
      <div className="container">
        <SectionHeader
          label="+ FEATURED PROJECTS"
          title={
            <>
              <span className="text-gradient">Created</span> with
              <br />
              clear purpose
            </>
          }
          desc="Real projects, real challenges and measurable results across web development, UI/UX, SEO and paid advertising."
        />

        <div className="k-featured-grid">
          <aside className="k-featured-side">
            <p className="k-featured-quote">
              A curated selection of <strong>websites, apps, designs and marketing campaigns</strong> we have delivered
              to help businesses stand out and grow online.
            </p>
            <div className="work-left-brand-row">
              <span className="work-left-brand-name">
                <span className="k-mono-small">Team</span>
                ENTEC MEDIA
              </span>
              <span className="work-left-year">2026</span>
            </div>
            <div className="k-showcase-stats k-featured-stats">
              {stats.map((s) => (
                <div key={s.label} className="k-showcase-stat">
                  <span className="k-mono-label">{s.label}</span>
                  <span className="k-showcase-stat-value">
                    <CountUp end={s.end} suffix={s.suffix} duration={2000} />
                  </span>
                </div>
              ))}
            </div>
          </aside>

          <div className="k-featured-list">
            {featured.map((project) => (
              <article key={project.slug} className="k-featured-row">
                <Reveal className="k-featured-media-wrap">
                  <Link href={`/portfolio/${project.slug}`} className="k-featured-media" aria-label={`${project.title} case study`}>
                    <div className="macbook-mockup">
                      <div className="macbook-bezel">
                        <div className="macbook-camera" />
                        <div className="macbook-screen">
                          <img src={project.heroImage} alt={`${project.title} screenshot`} className="macbook-screenshot" loading="lazy" />
                        </div>
                      </div>
                      <div className="macbook-base">
                        <div className="macbook-notch" />
                      </div>
                    </div>
                  </Link>
                </Reveal>

                <div className="k-featured-info">
                  <h3 className="k-showcase-title">{project.title}</h3>
                  <p className="k-showcase-subtitle">{project.category}</p>
                  <dl className="k-showcase-meta">
                    <div>
                      <dt className="k-mono-label">Year:</dt>
                      <dd>{project.year}</dd>
                    </div>
                    <div>
                      <dt className="k-mono-label">Client:</dt>
                      <dd>{project.client}</dd>
                    </div>
                  </dl>
                  <p className="k-showcase-desc">{project.summary}</p>
                  <Link href={`/portfolio/${project.slug}`} className="k-simple-link">
                    View case study
                    <span className="cta-dots-vertical" aria-hidden="true">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="k-keep-exploring">
          <span className="why-section-label">+ OTHER PROJECTS</span>
          <div className="k-keep-exploring-links">
            <span className="k-mono-label">Keep exploring our work</span>
            <div className="k-keep-exploring-row">
              {otherProjects.map((p) => (
                <Link key={p.slug} href={`/portfolio/${p.slug}`} className="k-keep-link">
                  <span className="k-keep-link-main">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.heroImage.replace("w=1600", "w=120")} alt="" className="k-keep-thumb" loading="lazy" />
                    <span className="k-keep-name">{p.client}</span>
                  </span>
                  <span className="cta-dots-vertical" aria-hidden="true">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="k-keep-exploring-cta">
            <span className="k-mono-label">See what we&apos;ve built</span>
            <KButton href="/portfolio" label="All case studies" />
          </div>
        </div>
      </div>
    </section>
  );
}
