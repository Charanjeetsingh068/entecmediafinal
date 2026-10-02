/**
 * Data access for the Services pages — the only place the pages get their content from.
 *
 * Today everything comes from local files (lib/servicesData.ts, lib/servicesContent.ts,
 * lib/clientsData.ts, lib/testimonialsData.ts, lib/portfolioData.ts). When an admin panel exists, set
 * NEXT_PUBLIC_SERVICES_API_URL (e.g. https://entecmedia.com/blog-cms/api) and serve these endpoints,
 * each returning JSON in the same shape as the local data:
 *
 *   GET {base}/public/services.php            → { data: ServiceDetail[] }
 *   GET {base}/public/services-page.php       → { data: ServicesPageContent }
 *   GET {base}/public/service-sections.php    → { data: ServiceDetailSections }
 *   GET {base}/public/clients.php             → { data: Client[] }
 *   GET {base}/public/testimonials.php        → { data: Review[] }
 *
 * Any endpoint that is missing, offline or returns bad data falls back to the local file, so the site
 * always builds. The site is a static export: content changes from the admin panel go live on the next
 * `npm run build` (or wire a rebuild webhook to the admin "Publish" button).
 */

import { servicesList, type ServiceDetail } from "@/lib/servicesData";
import {
  fillService,
  serviceDetailSections,
  servicesPageContent,
  type ServiceDetailSections,
  type ServicesPageContent,
} from "@/lib/servicesContent";
import { clients as localClients, type Client } from "@/lib/clientsData";
import { testimonials as localTestimonials, type Review } from "@/lib/testimonialsData";
import { portfolioProjects, type PortfolioProjectDetail } from "@/lib/portfolioData";

const API_BASE = process.env.NEXT_PUBLIC_SERVICES_API_URL;

/** Fetches {base}{path} (when an API is configured) and falls back to the local data on any problem. */
export async function fromApi<T>(path: string, fallback: T, valid: (d: unknown) => boolean): Promise<T> {
  if (!API_BASE) return fallback;
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return fallback;
    const json = await res.json();
    const data = json?.data ?? json;
    return valid(data) ? (data as T) : fallback;
  } catch {
    return fallback;
  }
}

export const isList = (d: unknown) => Array.isArray(d) && d.length > 0;
export const isObject = (d: unknown) => !!d && typeof d === "object" && !Array.isArray(d);

export function getServices(): Promise<ServiceDetail[]> {
  return fromApi("/public/services.php", servicesList, isList);
}

export async function getService(slug: string): Promise<ServiceDetail | undefined> {
  return (await getServices()).find((s) => s.slug === slug);
}

export function getServicesPageContent(): Promise<ServicesPageContent> {
  return fromApi("/public/services-page.php", servicesPageContent, isObject);
}

export function getClients(): Promise<Client[]> {
  return fromApi("/public/clients.php", localClients, isList);
}

export function getTestimonials(): Promise<Review[]> {
  return fromApi("/public/testimonials.php", localTestimonials, isList);
}

/** A portfolio project as the "Featured projects" section needs it (plain JSON, safe to pass to the client). */
export interface WorkProject {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  duration: string;
  desc: string;
  image: string;
  /** True when `image` is a full-length page screenshot (it then scrolls inside the browser frame) */
  fullPage: boolean;
  tech: string[];
  scope: string[];
  stats: { value: string; label: string }[];
  liveUrl?: string;
}

export const toWork = (p: PortfolioProjectDetail): WorkProject => ({
  slug: p.slug,
  title: p.title,
  client: p.client,
  category: p.category,
  year: p.year,
  duration: p.duration,
  desc: p.heroDesc,
  image: p.fullPageImage ?? p.heroImage,
  fullPage: !!p.fullPageImage,
  // Optional fields default to empty, so a project added with less detail never breaks the page
  tech: p.techStack ?? [],
  scope: p.subCategories ?? [],
  stats: p.stats ?? [],
  liveUrl: p.liveUrl,
});

/**
 * Projects for a service's "Featured projects" section: the service's chosen projectSlugs when set (admin
 * picks them), otherwise projects matched by category, topped up with others so there are at least 3.
 */
export function getServiceProjects(service: ServiceDetail, limit = 6): WorkProject[] {
  // Chosen slugs win; unknown slugs (a deleted or renamed project) are skipped, and if none are left
  // the automatic category match below takes over so the section never goes empty.
  const chosen = (service.projectSlugs ?? [])
    .map((slug) => portfolioProjects.find((p) => p.slug === slug))
    .filter((p): p is PortfolioProjectDetail => !!p);
  if (chosen.length) return chosen.slice(0, limit).map(toWork);
  const keyword: Record<string, RegExp> = {
    Design: /design|ui\/ux|graphic|brand/i,
    Development: /develop|web|e-?commerce|app/i,
    "Digital Marketing": /marketing|seo|ads/i,
  };
  const re = keyword[service.category];
  const text = (p: PortfolioProjectDetail) => `${p.category} ${(p.subCategories ?? []).join(" ")}`;
  const matched = portfolioProjects.filter((p) => re?.test(text(p)));
  const rest = portfolioProjects.filter((p) => !matched.includes(p));
  const list = matched.length >= 3 ? matched : [...matched, ...rest].slice(0, 3);
  return list.slice(0, limit).map(toWork);
}

/** Shared detail-page sections merged with the service's own overrides, with {service} tokens filled in. */
export async function getServiceSections(service: ServiceDetail): Promise<ServiceDetailSections> {
  const base = await fromApi("/public/service-sections.php", serviceDetailSections, isObject);
  // Per section, a service only needs to override the fields it changes (e.g. just projects.title)
  const merged = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(service.sections ?? {})) {
    const shared = merged[key];
    merged[key] = isObject(shared) && isObject(value) ? { ...(shared as object), ...(value as object) } : value;
  }
  // Fill tokens in every string of the merged object
  const fill = (v: unknown): unknown => {
    if (typeof v === "string") return fillService(v, service.title);
    if (Array.isArray(v)) return v.map(fill);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]));
    return v;
  };
  return fill(merged) as ServiceDetailSections;
}
