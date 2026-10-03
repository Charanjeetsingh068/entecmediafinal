import Link from "next/link";
import type { CSSProperties } from "react";
import CareerIcon from "@/components/careers/CareerIcon";
import KButton from "@/components/shared/KButton";
import type { JobOpening } from "@/lib/careersData";
import type { JobPageContent } from "@/lib/careersContent";

interface JobOthersProps {
  jobs: JobOpening[];
  content: JobPageContent["others"];
  viewLabel: string;
}

/** "More openings" under a job page: up to three other roles in the same card style as the Careers list. */
export default function JobOthers({ jobs, content, viewLabel }: JobOthersProps) {
  if (!jobs.length) return null;
  return (
    <section className="k-section cr-openings jb-others" data-theme="light" aria-labelledby="jb-others-title">
      <div className="container">
        <div className="why-top-layout k-section-head">
          <div className="why-col-left">
            <span className="why-section-label">{content.label}</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title" id="jb-others-title">
              <span className="k-muted">{content.title.soft}</span>
              <br />
              {content.title.strong}
            </h2>
          </div>
          <div className="why-col-right">
            <KButton href={content.cta.href} label={content.cta.label} />
          </div>
        </div>

        <ul className="cr-jobs">
          {jobs.map((j, i) => (
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
                </span>
                <span className="cr-job-foot">
                  <span className="cr-job-tags">
                    {j.types.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                  <span className="cr-job-view">{viewLabel}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
