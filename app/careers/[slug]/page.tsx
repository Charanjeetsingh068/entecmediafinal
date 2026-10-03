import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobHero from "@/components/careers/job/JobHero";
import JobDetails from "@/components/careers/job/JobDetails";
import JobApply from "@/components/careers/job/JobApply";
import JobOthers from "@/components/careers/job/JobOthers";
import { getCareersPageContent, getJob, getJobPageContent, getJobs } from "@/lib/careersApi";
import { siteConfig } from "@/lib/siteConfig";

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getJobs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Job Not Found" };
  const title = job.general ? "Send Your CV — Careers at Entec Media" : `${job.title} Job in ${job.location.split("/")[0].trim()}`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: { title: `${title} | Entec Media`, description: job.summary, url: `/careers/${job.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title, description: job.summary },
  };
}

/**
 * Job page: hero with breadcrumb and the job-ticket art (dark, pinned — the body slides over it) →
 * role details with a sticky summary card (light) → apply form with CV upload (light, #apply) →
 * other open roles → footer. Content: lib/careersApi.ts.
 */
export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const [job, jobs, content, careers] = await Promise.all([getJob(slug), getJobs(), getJobPageContent(), getCareersPageContent()]);
  if (!job) notFound();

  const others = jobs.filter((j) => j.slug !== job.slug && !j.general);
  const sameTeam = others.filter((j) => j.department === job.department);
  const related = [...sameTeam, ...others.filter((j) => j.department !== job.department)].slice(0, 3);

  // Google for Jobs structured data (not for the open "send your CV" page)
  const salary = job.salary[0]?.amount.match(/₹?([\d.]+)L\s*–\s*₹?([\d.]+)L/);
  const jobLd = job.general
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: `<p>${job.summary}</p><p>${job.requirementsSummary}</p><ul>${job.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>`,
        datePosted: "2026-10-01",
        validThrough: "2027-03-31",
        employmentType: job.types
          .map((t) => ({ "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Internship: "INTERN", Freelance: "CONTRACTOR" })[t as string])
          .filter(Boolean),
        hiringOrganization: { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url, logo: `${siteConfig.url}/images/darklogo.svg` },
        jobLocation: {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: "Zirakpur", addressRegion: "Punjab", addressCountry: "IN" },
        },
        ...(job.types.includes("Remote") ? { jobLocationType: "TELECOMMUTE" } : {}),
        ...(salary
          ? {
              baseSalary: {
                "@type": "MonetaryAmount",
                currency: "INR",
                value: { "@type": "QuantitativeValue", minValue: Number(salary[1]) * 100000, maxValue: Number(salary[2]) * 100000, unitText: "YEAR" },
              },
            }
          : {}),
      };

  return (
    <div className="k-page ab-page jb-page">
      {jobLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobLd) }} />}
      <JobHero job={job} content={content.hero} name={careers.name} />
      <div className="k-page-body ab-body">
        <JobDetails job={job} content={content} process={careers.process} />
        <JobApply job={job} content={content.form} />
        <JobOthers jobs={related} content={content.others} viewLabel={careers.openings.viewLabel} />
      </div>
    </div>
  );
}
