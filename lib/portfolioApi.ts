/**
 * Data access for the Our Projects pages (/portfolio and /portfolio/{id}) — the only place they get
 * their content from.
 *
 * Today everything comes from local files (lib/portfolioContent.ts, lib/portfolioItems.ts and the case
 * studies in lib/portfolioData.ts). When an admin panel exists, set NEXT_PUBLIC_SERVICES_API_URL and serve:
 *
 *   GET {base}/public/portfolio-page.php        → { data: PortfolioPageContent }
 *   GET {base}/public/portfolio-items.php       → { data: PortfolioItem[] }
 *   GET {base}/public/portfolio-categories.php  → { data: string[] }   (tab order)
 *   GET {base}/public/project-page.php          → { data: ProjectDetailContent }
 *   GET {base}/public/project-defaults.php      → { data: Record<category, CategoryDefaults> }
 *
 * Any endpoint that is missing, offline or returns bad data falls back to the local file.
 */

import { fromApi, isList, isObject, type WorkProject } from "@/lib/servicesApi";
import {
  categoryDefaults,
  fallbackCategoryDefaults,
  portfolioPageContent,
  projectDetailContent,
  type CategoryDefaults,
  type LiveLink,
  type PortfolioPageContent,
  type ProjectDetailContent,
} from "@/lib/portfolioContent";
import { portfolioCategories, portfolioItems, type PortfolioItem } from "@/lib/portfolioItems";
import { portfolioProjects, type PortfolioProjectDetail } from "@/lib/portfolioData";

export function getPortfolioPageContent(): Promise<PortfolioPageContent> {
  return fromApi("/public/portfolio-page.php", portfolioPageContent, isObject);
}

/** A detailed case study as a project, so it shows in the grid and gets the same project page. */
function caseStudyItem(p: PortfolioProjectDetail): PortfolioItem {
  const sub = p.subCategories.join(" ");
  const category = /seo/i.test(sub)
    ? "SEO"
    : /ads|marketing/i.test(sub)
      ? "Digital Marketing"
      : /^website designing/i.test(p.subCategories[0] ?? "")
        ? "Website Design"
        : "Website Development";
  return {
    id: p.slug,
    title: p.title,
    client: p.client,
    category,
    description: p.summary,
    image: p.fullPageImage ?? p.heroImage,
    fullPage: !!p.fullPageImage,
    tech: p.techStack,
    url: p.liveUrl,
    year: p.year,
    tagline: p.heroTagline,
    duration: p.duration,
    overview: [p.heroDesc, ...p.solutionDesc],
    services: p.subCategories,
    gallery: p.galleryImages,
    stats: p.stats,
    features: p.results.map((r) => ({ title: `${r.value} ${r.title}`, desc: r.desc })),
  };
}

/**
 * Every project: case studies first, then the rest. Entries missing an id, title or image are skipped
 * and missing lists default to empty, so one incomplete entry never breaks a page.
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const items = await fromApi("/public/portfolio-items.php", portfolioItems, isList);
  const all = [...portfolioProjects.map(caseStudyItem), ...items];
  const seen = new Set<string>();
  return all
    .filter((p) => p && p.id && p.title && p.image && !seen.has(p.id) && seen.add(p.id))
    .map((p) => ({ ...p, category: p.category || "Other", tech: p.tech ?? [], description: p.description ?? "" }));
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
  return (await getPortfolioItems()).find((p) => p.id === id);
}

/** Tab order; categories used by projects but missing here are added at the end automatically. */
export function getPortfolioCategories(): Promise<string[]> {
  return fromApi("/public/portfolio-categories.php", portfolioCategories, isList);
}

/** A project in the shape the "Featured projects" deck uses. */
export const projectToWork = (p: PortfolioItem): WorkProject => ({
  slug: p.id,
  title: p.title,
  client: p.client ?? p.category,
  category: p.category,
  year: p.year ?? "",
  duration: p.duration ?? "",
  desc: p.description,
  image: p.image,
  fullPage: !!p.fullPage,
  tech: p.tech,
  scope: p.services?.length ? p.services : [p.category],
  stats: p.stats ?? [],
  liveUrl: p.url,
});

/** Everything a project page needs, with defaults filled in and {project}/{client}/{category} tokens replaced. */
export interface ProjectPage {
  project: PortfolioItem;
  /** 1-based position in the full list (shown as "07") */
  number: number;
  overview: string[];
  services: string[];
  gallery: string[];
  stats: { value: string; label: string }[];
  features: { title: string; desc: string }[];
  faqs: { question: string; answer: string; tag?: string }[];
  related: WorkProject[];
  content: ProjectDetailContent;
  /** The "Go to …" button for this project's category, or null when the category has none */
  liveLink: LiveLink | null;
}

export async function getProjectPage(id: string): Promise<ProjectPage | undefined> {
  const [items, base, defaultsMap, listing] = await Promise.all([
    getPortfolioItems(),
    fromApi("/public/project-page.php", projectDetailContent, isObject),
    fromApi<Record<string, CategoryDefaults>>("/public/project-defaults.php", categoryDefaults, isObject),
    getPortfolioPageContent(),
  ]);
  const index = items.findIndex((p) => p.id === id);
  if (index < 0) return undefined;
  const project = items[index];
  const defaults = defaultsMap[project.category] ?? fallbackCategoryDefaults;

  const fill = (text: string) =>
    text
      .replace(/\{project\}/g, project.title)
      .replace(/\{client\}/g, project.client || project.title)
      .replace(/\{category\}/g, project.category.toLowerCase().replace(/^seo$/, "SEO"))
      .replace(/\{Category\}/g, project.category);
  const fillAll = <T,>(v: T): T => {
    if (typeof v === "string") return fill(v) as T;
    if (Array.isArray(v)) return v.map(fillAll) as T;
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillAll(x)])) as T;
    return v;
  };

  // Related: chosen ids first, then the same category, then anything else — four in all
  const chosen = (project.related ?? []).map((r) => items.find((p) => p.id === r)).filter((p): p is PortfolioItem => !!p);
  const same = items.filter((p) => p.category === project.category);
  const pool = [...chosen, ...same, ...items].filter((p, i, arr) => p.id !== project.id && arr.indexOf(p) === i);

  const facts = [
    { value: project.category, label: "Service" },
    ...(project.year ? [{ value: project.year, label: "Year" }] : []),
    ...(project.duration ? [{ value: project.duration, label: "Timeline" }] : []),
  ];

  return {
    project,
    number: index + 1,
    overview: project.overview?.length ? project.overview : [project.description],
    services: project.services?.length ? project.services : [project.category],
    gallery: [project.image, ...(project.gallery ?? [])],
    stats: (project.stats?.length ? project.stats : facts).slice(0, 3),
    features: fillAll(project.features?.length ? project.features : defaults.features),
    faqs: fillAll(project.faqs?.length ? project.faqs : defaults.faqs).map((f) => ({ ...f, tag: project.category })),
    related: pool.slice(0, 4).map(projectToWork),
    content: fillAll(base),
    liveLink: listing.list.liveLinks?.[project.category] ?? null,
  };
}
