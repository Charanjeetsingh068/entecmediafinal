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

const getCareersApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SERVICES_API_URL) {
    return process.env.NEXT_PUBLIC_SERVICES_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

/** Every job page (openings + the general application). Entries without a slug or title are skipped. */
export async function getJobs(): Promise<JobOpening[]> {
  try {
    const base = getCareersApiBaseUrl();
    const res = await fetch(`${base}/api/careers.php`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const text = await res.text();
      if (!text.trim().startsWith("<?php")) {
        const json = JSON.parse(text);
        const data = json?.data ?? json;
        if (Array.isArray(data) && data.length > 0) {
          const list = data
            .filter((j: any) => j && j.slug && j.title)
            .map((j: any) => ({
              slug: String(j.slug),
              title: String(j.title),
              department: (j.department || "Development") as JobOpening["department"],
              types: Array.isArray(j.types) && j.types.length ? j.types : [j.job_type || "Full-time"],
              location: String(j.location || "Zirakpur, Punjab"),
              experience: String(j.experience || "1+ years"),
              salary: Array.isArray(j.salary) && j.salary.length ? j.salary : [{ amount: j.salary_range || "Competitive", period: "per year" }],
              summary: String(j.summary || j.description || ""),
              requirementsSummary: String(j.requirementsSummary || (j.description ? j.description.slice(0, 160) + "..." : "")),
              responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : (typeof j.responsibilities === "string" ? j.responsibilities.split("\n").filter(Boolean) : []),
              requirements: Array.isArray(j.requirements) ? j.requirements : (typeof j.requirements === "string" ? j.requirements.split("\n").filter(Boolean) : []),
              niceToHave: Array.isArray(j.niceToHave) ? j.niceToHave : [],
              general: Boolean(j.general),
            }));

          if (list.length > 0) {
            return list as JobOpening[];
          }
        }
      }
    }
  } catch {
    // API offline or dev static file - fallback to local careers
  }

  return jobOpenings.filter((j) => j && j.slug && j.title).map((j) => ({ ...j, types: j.types ?? [], salary: j.salary ?? [] }));
}

/** The listed openings (without the general application) */
export async function getOpenings(): Promise<JobOpening[]> {
  return (await getJobs()).filter((j) => !j.general);
}

export async function getJob(slug: string): Promise<JobOpening | undefined> {
  try {
    const base = getCareersApiBaseUrl();
    const res = await fetch(`${base}/api/careers.php?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const text = await res.text();
      if (!text.trim().startsWith("<?php")) {
        const json = JSON.parse(text);
        const j = json?.data ?? json;
        if (j && j.slug && j.title) {
          return {
            slug: String(j.slug),
            title: String(j.title),
            department: (j.department || "Development") as JobOpening["department"],
            types: Array.isArray(j.types) && j.types.length ? j.types : [j.job_type || "Full-time"],
            location: String(j.location || "Zirakpur, Punjab"),
            experience: String(j.experience || "1+ years"),
            salary: Array.isArray(j.salary) && j.salary.length ? j.salary : [{ amount: j.salary_range || "Competitive", period: "per year" }],
            summary: String(j.summary || j.description || ""),
            requirementsSummary: String(j.requirementsSummary || (j.description ? j.description.slice(0, 160) + "..." : "")),
            responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : (typeof j.responsibilities === "string" ? j.responsibilities.split("\n").filter(Boolean) : []),
            requirements: Array.isArray(j.requirements) ? j.requirements : (typeof j.requirements === "string" ? j.requirements.split("\n").filter(Boolean) : []),
            niceToHave: Array.isArray(j.niceToHave) ? j.niceToHave : [],
            general: Boolean(j.general),
          } as JobOpening;
        }
      }
    }
  } catch {
    // Fallback
  }

  return (await getJobs()).find((j) => j.slug === slug);
}

export function getCareersPageContent(): Promise<CareersPageContent> {
  return fromApi("/public/careers-page.php", careersPageContent, isObject);
}

export function getJobPageContent(): Promise<JobPageContent> {
  return fromApi("/public/job-page.php", jobPageContent, isObject);
}
