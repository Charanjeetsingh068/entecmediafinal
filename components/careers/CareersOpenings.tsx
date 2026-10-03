"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import CareerIcon from "@/components/careers/CareerIcon";
import type { JobOpening, JobType } from "@/lib/careersData";
import type { CareersPageContent } from "@/lib/careersContent";

interface CareersOpeningsProps {
  jobs: JobOpening[];
  content: CareersPageContent["openings"];
}

const pad = (n: number) => String(n).padStart(2, "0");
const ALL = "";

/**
 * Open positions (light). Department tabs with a sliding ink and counts, job-type chips and a search box,
 * then one card per role: department, title, summary, location / experience / salary and type tags, and
 * a "View & apply" arrow. The whole card links to the role's page; cards lift with a blue edge on hover
 * and replay their entrance when the filters change. A dark "Don't see your role?" card closes the list.
 */
export default function CareersOpenings({ jobs, content }: CareersOpeningsProps) {
  const departments = Array.from(new Set(jobs.map((j) => j.department)));
  const types = Array.from(new Set(jobs.flatMap((j) => j.types))) as JobType[];
  const [dept, setDept] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [query, setQuery] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const byQuery = jobs.filter(
    (j) => (!type || j.types.includes(type as JobType)) && (!q || [j.title, j.department, j.summary, j.location, ...j.types].join(" ").toLowerCase().includes(q)),
  );
  const list = dept ? byQuery.filter((j) => j.department === dept) : byQuery;

  useEffect(() => {
    const place = () => {
      const nav = tabsRef.current;
      const active = nav?.querySelector<HTMLElement>(".sg-tab.is-active");
      const ink = nav?.querySelector<HTMLElement>(".sg-tabs-ink");
      if (!active || !ink) return;
      ink.style.width = `${active.offsetWidth}px`;
      ink.style.transform = `translate3d(${active.offsetLeft}px, 0, 0)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [dept, type, query]);

  const clear = () => {
    setDept(ALL);
    setType(ALL);
    setQuery("");
  };

  return (
    <section className="k-section cr-openings" id="openings" data-theme="light" aria-labelledby="cr-open-title">
      <div className="container">
        <SectionHeader
          label={content.label}
          title={
            <span id="cr-open-title">
              <span className="k-muted">{content.title.soft}</span>
              <br />
              {content.title.strong}
            </span>
          }
          desc={content.desc}
        />

        <div className="cr-toolbar">
          <div className="sg-tabs" ref={tabsRef} role="tablist" aria-label="Filter roles by team">
            <span className="sg-tabs-ink" aria-hidden="true" />
            {[ALL, ...departments].map((d) => (
              <button
                key={d || "all"}
                type="button"
                role="tab"
                aria-selected={dept === d}
                className={`sg-tab ${dept === d ? "is-active" : ""}`}
                onClick={() => setDept(d)}
              >
                {d || content.allLabel}
                <sup>{pad(d ? byQuery.filter((j) => j.department === d).length : byQuery.length)}</sup>
              </button>
            ))}
          </div>

          <label className="cr-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input type="search" placeholder={content.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={content.searchPlaceholder} />
          </label>
        </div>

        <div className="cr-types" role="group" aria-label={content.typeLabel}>
          <span>{content.typeLabel}</span>
          {types.map((t) => (
            <button key={t} type="button" className={type === t ? "is-on" : undefined} aria-pressed={type === t} onClick={() => setType(type === t ? ALL : t)}>
              {t}
            </button>
          ))}
          <p className="cr-count" aria-live="polite">
            <strong>{pad(list.length)}</strong> {content.countLabel}
          </p>
        </div>

        {list.length ? (
          <ul className="cr-jobs" key={`${dept}-${type}-${q}`}>
            {list.map((j, i) => (
              <li key={j.slug} style={{ "--i": i } as CSSProperties}>
                <Link href={`/careers/${j.slug}`} className="cr-job">
                  <span className="cr-job-top">
                    <span className="cr-job-dept">{j.department}</span>
                    <span className="cr-job-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </span>
                  <h3 className="cr-job-title">{j.title}</h3>
                  <p className="cr-job-summary">{j.summary}</p>
                  <span className="cr-job-meta">
                    <span>
                      <CareerIcon name="pin" />
                      {j.location}
                    </span>
                    <span>
                      <CareerIcon name="trend" />
                      {j.experience}
                    </span>
                    {j.salary[0] && (
                      <span>
                        <CareerIcon name="gift" />
                        {j.salary[0].amount}
                      </span>
                    )}
                  </span>
                  <span className="cr-job-foot">
                    <span className="cr-job-tags">
                      {j.types.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                    <span className="cr-job-view">{content.viewLabel}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pj-empty cr-empty">
            <strong>{content.emptyTitle}</strong>
            <p>{content.emptyText}</p>
            <button type="button" onClick={clear}>
              {content.clearLabel}
            </button>
          </div>
        )}

        <div className="cr-general">
          <span className="cr-general-icon" aria-hidden="true">
            <CareerIcon name="spark" />
          </span>
          <span className="cr-general-text">
            <strong>{content.general.title}</strong>
            <span>{content.general.text}</span>
          </span>
          <Link href={content.general.cta.href} className="cr-general-btn">
            {content.general.cta.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
