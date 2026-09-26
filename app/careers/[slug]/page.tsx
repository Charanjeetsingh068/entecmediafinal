import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobBySlug, jobOpenings } from "@/lib/careersData";
import CareerApplicationForm from "@/components/forms/CareerApplicationForm";
import SectionHeader from "@/components/shared/SectionHeader";
import KButton from "@/components/shared/KButton";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return jobOpenings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} – Careers`,
    description: job.summary,
    alternates: { canonical: `/careers/${job.slug}` },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) notFound();

  const otherJobs = jobOpenings.filter((j) => j.slug !== job.slug).slice(0, 3);

  return (
    <div className="k-page k-detail-page">
      <section className="k-detail-hero" data-theme="light">
        <div className="container k-detail-hero-grid">
          <div className="k-detail-hero-side">
            <Link href="/careers" className="k-back-link">
              <span aria-hidden="true">←</span> BACK TO CAREERS
            </Link>
          </div>
          <div className="k-detail-hero-main">
            <span className="k-mono-label k-detail-eyebrow">Apply for</span>
            <h1 className="k-detail-title">{job.title}</h1>
            <p className="k-job-types">
              {job.types.map((t, i) => (
                <span key={t}>
                  {i > 0 && <span className="k-job-sep">|</span>}
                  {t}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section className="k-detail-body" data-theme="light">
        <div className="container k-detail-grid k-apply-grid">
          <aside className="k-detail-sidebar">
            <div className="k-side-block">
              <span className="k-mono-label">Salary:</span>
              {job.salary.map((s) => (
                <p key={s.period} className="k-job-salary">
                  {s.amount} <span>({s.period})</span>
                </p>
              ))}
            </div>
            <div className="k-side-block">
              <span className="k-mono-label">Location &amp; experience:</span>
              <p>{job.location}<br />{job.experience}</p>
            </div>
            <div className="k-side-block">
              <span className="k-mono-label">Job description:</span>
              <p>{job.summary}</p>
            </div>
            <div className="k-side-block">
              <span className="k-mono-label">Requirements:</span>
              <p>{job.requirementsSummary}</p>
            </div>
          </aside>

          <div className="k-apply-form">
            <CareerApplicationForm jobTitle={job.title} jobTypes={job.types} />
          </div>
        </div>
      </section>

      <section className="k-section k-role-section" data-theme="light">
        <div className="container">
          <SectionHeader
            label="+ ABOUT THE ROLE"
            title={
              <>
                <span className="k-muted">What you&apos;ll</span>
                <br />
                do &amp; bring
              </>
            }
            desc={`Everything you need to know about the ${job.title} position at Entec Media.`}
          />
          <div className="k-role-grid">
            <div className="k-role-col">
              <h3>Responsibilities</h3>
              <ul>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="k-role-col">
              <h3>Requirements</h3>
              <ul>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="k-role-col">
              <h3>Nice to have</h3>
              <ul>
                {job.niceToHave.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="k-section k-related-section" data-theme="light">
        <div className="container">
          <SectionHeader
            label="+ MORE OPENINGS"
            title={
              <>
                <span className="k-muted">Other roles</span>
                <br />
                you might like
              </>
            }
          />
          <div className="k-job-list">
            {otherJobs.map((j) => (
              <article key={j.slug} className="k-job-row k-job-row-compact">
                <div className="k-job-head">
                  <h3 className="k-job-title">
                    <Link href={`/careers/${j.slug}`}>{j.title}</Link>
                  </h3>
                  <p className="k-job-types">{j.types.join(" | ")}</p>
                </div>
                <div className="k-job-col">
                  <span className="k-mono-label">Job description:</span>
                  <p>{j.summary}</p>
                </div>
                <div className="k-job-col k-job-col-action">
                  <KButton href={`/careers/${j.slug}`} label="View role" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
