"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PortfolioProjectDetail } from "@/lib/portfolioData";
import KButton from "@/components/shared/KButton";

interface PortfolioShowcaseProps {
  projects: PortfolioProjectDetail[];
  /** Shows the search box + category dropdown (portfolio listing page) */
  withFilters?: boolean;
  intro?: React.ReactNode;
  /** 2 on the portfolio listing (right under the h1), 3 inside a titled section */
  headingLevel?: 2 | 3;
}

/**
 * Kudos "Projects" layout: sticky left column (search, category filter, live stats of the project in view),
 * MacBook-framed screenshot in the middle and sticky project details on the right.
 */
export default function PortfolioShowcase({ projects, withFilters = false, intro, headingLevel = 3 }: PortfolioShowcaseProps) {
  const Title = headingLevel === 2 ? "h2" : "h3";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => ["All Categories", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (category === "All Categories" || p.category === category) &&
        (!q ||
          [p.title, p.client, p.summary, p.category, ...p.subCategories, ...p.techStack]
            .join(" ")
            .toLowerCase()
            .includes(q))
    );
  }, [projects, query, category]);

  // Track which project is in the middle of the viewport to drive the sidebar stats.
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-project-idx]");
    if (!rows || rows.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveIdx(Number((entry.target as HTMLElement).dataset.projectIdx));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [visible]);

  const active = visible[Math.min(activeIdx, visible.length - 1)];

  return (
    <div className="k-showcase">
      <aside className="k-showcase-side">
        <div className="k-showcase-side-inner">
          {withFilters && (
            <div className="k-showcase-filters">
              <label className="k-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search projects"
                />
              </label>
              <label className="k-select">
                <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {intro && <div className="k-showcase-intro">{intro}</div>}

          {active && (
            <div className="k-showcase-stats" key={active.slug}>
              {active.stats.map((stat) => (
                <div key={stat.label} className="k-showcase-stat">
                  <span className="k-mono-label">{stat.label}</span>
                  <span className="k-showcase-stat-value">{stat.value}</span>
                </div>
              ))}
              <div className="k-showcase-stat">
                <span className="k-mono-label">Year</span>
                <span className="k-showcase-stat-value">{active.year}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="k-showcase-list" ref={listRef}>
        {visible.length === 0 && (
          <div className="k-empty">
            <p>No projects match your search.</p>
            <button
              type="button"
              className="k-text-link"
              onClick={() => {
                setQuery("");
                setCategory("All Categories");
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {visible.map((project, idx) => (
          <article key={project.slug} className="k-showcase-row" data-project-idx={idx}>
            <Link href={`/portfolio/${project.slug}`} className="k-showcase-media" aria-label={`${project.title} case study`}>
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

            <div className="k-showcase-info">
              <Title className="k-showcase-title">{project.title}</Title>
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
              <KButton href={`/portfolio/${project.slug}`} label="View case study" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
