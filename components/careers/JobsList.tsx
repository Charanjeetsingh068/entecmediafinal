"use client";

import { useState } from "react";
import Link from "next/link";
import { jobOpenings, jobTypeFilters, type JobType } from "@/lib/careersData";
import KButton from "@/components/shared/KButton";

/** Kudos careers list: job-type filter tabs and one row per opening (salary, description, requirements, apply). */
export default function JobsList() {
  const [filter, setFilter] = useState<JobType | "All">("All");
  const visible = filter === "All" ? jobOpenings : jobOpenings.filter((job) => job.types.includes(filter));
  const filters = jobTypeFilters.filter((t) => jobOpenings.some((j) => j.types.includes(t)));

  return (
    <section className="k-section k-jobs-section" data-theme="light">
      <div className="container">
        <div className="k-toolbar">
          <span className="k-mono-label">All available posts</span>
          <div className="k-tabs" role="tablist" aria-label="Filter jobs by type">
            {(["All", ...filters] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={filter === t}
                className={`k-tab ${filter === t ? "is-active" : ""}`}
                onClick={() => setFilter(t)}
              >
                {t}
                <span className="k-tab-count">
                  {t === "All" ? jobOpenings.length : jobOpenings.filter((j) => j.types.includes(t)).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="k-job-list">
          {visible.length === 0 && (
            <div className="k-empty">
              <p>No openings for this type right now — send us your CV anyway!</p>
            </div>
          )}
          {visible.map((job) => (
            <article key={job.slug} className="k-job-row">
              <div className="k-job-head">
                <h2 className="k-job-title">
                  <Link href={`/careers/${job.slug}`}>{job.title}</Link>
                </h2>
                <p className="k-job-types">
                  {job.types.map((t, i) => (
                    <span key={t}>
                      {i > 0 && <span className="k-job-sep">|</span>}
                      {t}
                    </span>
                  ))}
                </p>
                <p className="k-job-location">{job.location} · {job.experience}</p>
              </div>
              <div className="k-job-col">
                <span className="k-mono-label">Salary:</span>
                {job.salary.map((s) => (
                  <p key={s.period} className="k-job-salary">
                    {s.amount} <span>({s.period})</span>
                  </p>
                ))}
              </div>
              <div className="k-job-col">
                <span className="k-mono-label">Job description:</span>
                <p>{job.summary}</p>
              </div>
              <div className="k-job-col">
                <span className="k-mono-label">Requirements:</span>
                <p>{job.requirementsSummary}</p>
                <KButton href={`/careers/${job.slug}`} label="Apply for this job" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
