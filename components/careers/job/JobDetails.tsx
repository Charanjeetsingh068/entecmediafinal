import ShareLinks from "@/components/shared/ShareLinks";
import CareerIcon from "@/components/careers/CareerIcon";
import CareersProcess from "@/components/careers/CareersProcess";
import { siteConfig } from "@/lib/siteConfig";
import type { JobOpening } from "@/lib/careersData";
import type { CareersPageContent, JobPageContent } from "@/lib/careersContent";

interface JobDetailsProps {
  job: JobOpening;
  content: JobPageContent;
  process: CareersPageContent["process"];
}

/**
 * Role details (light). Left: about the role, what you'll do, what we're looking for, nice to have,
 * what you'll get (each list with its own marker style) and the hiring steps. Right: a sticky role summary
 * card — department, location, experience, job types, salary, an Apply button and share links.
 * ≤991px: the summary card comes first, then the details.
 */
export default function JobDetails({ job, content, process }: JobDetailsProps) {
  const d = content.details;
  const h = content.hero;
  const salary = job.salary[0];

  return (
    <section className="k-section jb-details" data-theme="light" aria-label={`${job.title} details`}>
      <div className="container jb-grid">
        <div className="jb-main">
          <div className="jb-block" data-kfx="y:48">
            <h2 className="cr-detail-h">{d.aboutTitle}</h2>
            <p className="jb-lead">{job.summary}</p>
            <p className="jb-text">{job.requirementsSummary}</p>
          </div>

          <div className="jb-block" data-kfx="y:48">
            <h2 className="cr-detail-h">{d.responsibilitiesTitle}</h2>
            <ul className="jb-list is-arrow">
              {job.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="jb-block" data-kfx="y:48">
            <h2 className="cr-detail-h">{d.requirementsTitle}</h2>
            <ul className="jb-list is-check">
              {job.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          {job.niceToHave.length > 0 && (
            <div className="jb-block" data-kfx="y:48">
              <h2 className="cr-detail-h">{d.niceTitle}</h2>
              <ul className="jb-chips">
                {job.niceToHave.map((r) => (
                  <li key={r}>
                    <CareerIcon name="spark" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="jb-block jb-offer" data-kfx="y:48">
            <h2 className="cr-detail-h">{d.offerTitle}</h2>
            <ul className="jb-offer-grid">
              {d.offer.map((o) => (
                <li key={o}>
                  <CareerIcon name="gift" />
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div className="jb-block" data-kfx="y:48">
            <CareersProcess content={process} compact title={d.processTitle} />
          </div>
        </div>

        <aside className="jb-side">
          <div className="jb-summary">
            <span className="jb-summary-label">{d.summaryTitle}</span>
            <dl>
              <div>
                <dt>
                  <CareerIcon name="users" />
                  {d.postedLabel}
                </dt>
                <dd>{job.department}</dd>
              </div>
              <div>
                <dt>
                  <CareerIcon name="pin" />
                  {h.locationLabel}
                </dt>
                <dd>{job.location}</dd>
              </div>
              <div>
                <dt>
                  <CareerIcon name="trend" />
                  {h.experienceLabel}
                </dt>
                <dd>{job.experience}</dd>
              </div>
              <div>
                <dt>
                  <CareerIcon name="clock" />
                  {h.typeLabel}
                </dt>
                <dd>{job.types.join(" · ")}</dd>
              </div>
              {salary && (
                <div>
                  <dt>
                    <CareerIcon name="gift" />
                    {h.salaryLabel}
                  </dt>
                  <dd>
                    {salary.amount}
                    {salary.period && <small> {salary.period}</small>}
                  </dd>
                </div>
              )}
            </dl>
            <a href="#apply" className="jb-summary-btn">
              {d.applyLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
            <div className="jb-share">
              <ShareLinks title={`${job.title} — Careers at Entec Media`} url={`${siteConfig.url}/careers/${job.slug}/`} text={job.summary} label={d.shareLabel} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
