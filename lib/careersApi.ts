/**
 * Data access for the Careers pages (/careers and /careers/{slug}). Local data now; when an admin panel
 * exists, set NEXT_PUBLIC_SERVICES_API_URL and serve:
 *
 *   GET {base}/public/jobs.php          → { data: JobOpening[] }
 *   GET {base}/public/careers-page.php  → { data: CareersPageContent }
 *   GET {base}/public/job-page.php      → { data: JobPageContent }
 *
 * A missing, offline or invalid endpoint falls back to the local files.
 */

import { fromApi, isList, isObject } from "@/lib/servicesApi";
import { jobOpenings, type JobOpening } from "@/lib/careersData";
import { careersPageContent, jobPageContent, type CareersPageContent, type JobPageContent } from "@/lib/careersContent";

/** Every job page (openings + the general application). Entries without a slug or title are skipped. */
export async function getJobs(): Promise<JobOpening[]> {
  const jobs = await fromApi("/public/jobs.php", jobOpenings, isList);
  return jobs.filter((j) => j && j.slug && j.title).map((j) => ({ ...j, types: j.types ?? [], salary: j.salary ?? [] }));
}

/** The listed openings (without the general application) */
export async function getOpenings(): Promise<JobOpening[]> {
  return (await getJobs()).filter((j) => !j.general);
}

export async function getJob(slug: string): Promise<JobOpening | undefined> {
  return (await getJobs()).find((j) => j.slug === slug);
}

export function getCareersPageContent(): Promise<CareersPageContent> {
  return fromApi("/public/careers-page.php", careersPageContent, isObject);
}

export function getJobPageContent(): Promise<JobPageContent> {
  return fromApi("/public/job-page.php", jobPageContent, isObject);
}
