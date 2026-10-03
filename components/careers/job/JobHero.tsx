import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import CareerIcon from "@/components/careers/CareerIcon";
import type { JobOpening } from "@/lib/careersData";
import type { JobPageContent } from "@/lib/careersContent";

interface JobHeroProps {
  job: JobOpening;
  content: JobPageContent["hero"];
  /** Page name for the breadcrumb ("Careers") */
  name: string;
}

/**
 * Job page hero — dark, pinned, same family as the other inner-page heroes: breadcrumb (Home › Careers ›
 * role), department label, the role title rising out of a mask, the summary, actions (Apply now / All
 * open roles) and three facts (location, experience, salary).
 * Right (the same design on every role): a "job ticket" on two tilted sheets — role, department, location,
 * job types and salary, a barcode that draws itself and a shine sweeping across, with a perforated stub
 * holding a round "Now hiring" stamp that turns slowly.
 */
export default function JobHero({ job, content, name }: JobHeroProps) {
  const salary = job.salary[0];

  return (
    <section className="k-page-hero ab-hero jb-hero" data-theme="dark" aria-labelledby="job-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: name, href: "/careers" },
              { label: job.title, href: `/careers/${job.slug}` },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {job.department}
          </span>

          <h1 className="ab-hero-title jb-hero-title" id="job-title">
            <span className="ab-line">
              <span style={{ animationDelay: "0.1s" }}>{job.title}</span>
            </span>
          </h1>

          <p className="ab-hero-desc">{job.summary}</p>

          <div className="ab-hero-actions">
            <KButton href={content.applyCta.href} label={content.applyCta.label} variant="dark" />
            <a href={content.backCta.href} className="ab-hero-link">
              {content.backCta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <dl className="sd-hero-facts jb-facts">
            <div>
              <dt>{content.locationLabel}</dt>
              <dd>{job.location}</dd>
            </div>
            <div>
              <dt>{content.experienceLabel}</dt>
              <dd>{job.experience}</dd>
            </div>
            {salary && (
              <div>
                <dt>{content.salaryLabel}</dt>
                <dd>{salary.amount}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="jb-art" aria-hidden="true">
          <span className="jb-orbit" />
          <div className="jb-ticket-wrap">
            <span className="jb-sheet jb-sheet-a" />
            <span className="jb-sheet jb-sheet-b" />
            <div className="jb-ticket">
              <span className="jb-shine" />
              <div className="jb-ticket-main">
                <div className="jb-ticket-head">
                  <span className="jb-ticket-logo">E</span>
                  <span>
                    <small>{content.ticketLabel}</small>
                    <strong>Entec Media</strong>
                  </span>
                </div>
                <strong className="jb-ticket-title">{job.title}</strong>
                <ul className="jb-ticket-rows">
                  <li>
                    <CareerIcon name="users" />
                    {job.department}
                  </li>
                  <li>
                    <CareerIcon name="pin" />
                    {job.location}
                  </li>
                  <li>
                    <CareerIcon name="trend" />
                    {job.experience}
                  </li>
                </ul>
                <span className="jb-ticket-tags">
                  {job.types.slice(0, 3).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </span>
                <span className="jb-barcode">
                  {Array.from({ length: 28 }, (_, i) => (
                    <i key={i} style={{ width: `${[2, 1, 3, 1, 2, 4, 1][i % 7]}px`, animationDelay: `${1 + i * 0.03}s` }} />
                  ))}
                </span>
              </div>
              <div className="jb-ticket-stub">
                <span className="jb-stamp">
                  <svg className="jb-stamp-ring" viewBox="0 0 100 100">
                    <defs>
                      <path id="jb-ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
                    </defs>
                    <text>
                      <textPath href="#jb-ring" textLength="230" lengthAdjust="spacing">
                        {content.stamp}
                      </textPath>
                    </text>
                  </svg>
                  <CareerIcon name="rocket" className="jb-stamp-icon" />
                </span>
                {salary && (
                  <span className="jb-stub-salary">
                    <strong>{salary.amount}</strong>
                    {salary.period && <small>{salary.period}</small>}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
