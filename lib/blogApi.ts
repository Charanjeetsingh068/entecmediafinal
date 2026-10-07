/**
 * Entec Media Blog CMS - Next.js API Client
 * Connects Next.js Frontend to PHP Blog REST API with Seamless Local Fallback
 */

import { blogsData } from "@/data/blogs";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  published_blogs_count?: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featured_image: string | null;
  featured_image_alt: string | null;
  featured_image_url: string | null;
  author_name: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
  category_name?: string;
  category_slug?: string;
  tags?: BlogTag[];
  formatted_date?: string;
}

export interface BlogPagination {
  total_records: number;
  total_pages: number;
  current_page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface FetchBlogsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}

const BLOG_API_BASE_URL =
  process.env.NEXT_PUBLIC_BLOG_API_URL || 'http://localhost/blog-cms/api';

// A localhost API can only answer on the developer's own machine. On the live site the browser would
// just fail to connect (a console error in PageSpeed), so it goes straight to the fallback posts.
const apiReachable = () =>
  typeof window === 'undefined' ||
  !/^https?:\/\/(localhost|127\.0\.0\.1)\b/.test(BLOG_API_BASE_URL) ||
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// Fallback categories derived from the fallback posts
const DEFAULT_CATEGORIES: BlogCategory[] = Array.from(new Set(blogsData.map((b) => b.category))).map(
  (name, idx) => ({
    id: idx + 1,
    name,
    slug: toSlug(name),
    published_blogs_count: blogsData.filter((b) => b.category === name).length,
  })
);

// Fallback tags derived from the fallback posts (ids follow first appearance)
const DEFAULT_TAGS: BlogTag[] = Array.from(new Set(blogsData.flatMap((b) => b.tags))).map((name, idx) => ({
  id: idx + 1,
  name,
  slug: toSlug(name),
}));

// Helper for fallback blogs (newest first, like the API)
function getFallbackBlogs(): BlogPost[] {
  return [...blogsData]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((b) => {
      const category = DEFAULT_CATEGORIES.find((c) => c.name === b.category);
      return {
        id: b.id,
        category_id: category?.id ?? null,
        title: b.title,
        slug: b.slug,
        excerpt: b.description,
        content: b.content,
        featured_image: null,
        featured_image_alt: b.title,
        featured_image_url: b.image,
        author_name: b.author || "Entec Media Team",
        status: "published",
        meta_title: b.title,
        meta_description: b.description,
        published_at: b.date,
        created_at: b.date,
        category_name: b.category,
        category_slug: toSlug(b.category),
        formatted_date: formatDate(b.date),
        tags: DEFAULT_TAGS.filter((t) => b.tags.includes(t.name)),
      };
    });
}

/**
 * Fetch paginated list of published blogs from PHP API
 */
export async function getPublishedBlogs(params: FetchBlogsParams = {}): Promise<{
  blogs: BlogPost[];
  pagination: BlogPagination;
}> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.category) queryParams.set('category', params.category);
    if (params.tag) queryParams.set('tag', params.tag);
    if (params.search) queryParams.set('search', params.search);

    const url = `${BLOG_API_BASE_URL}/public/blogs.php?${queryParams.toString()}`;
    if (!apiReachable()) throw new Error('Blog API not reachable from this site');
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.blogs && data.data.blogs.length > 0) {
        return {
          blogs: data.data.blogs,
          pagination: data.data.pagination || {
            total_records: data.data.blogs.length,
            total_pages: 1,
            current_page: params.page || 1,
            limit: params.limit || 9,
            has_next: false,
            has_prev: false,
          },
        };
      }
    }
  } catch {
    // API offline - use fallback
  }

  // Fallback filtering
  let fallback = getFallbackBlogs();
  if (params.category) {
    fallback = fallback.filter((b) => b.category_slug === params.category);
  }
  if (params.tag) {
    fallback = fallback.filter((b) => b.tags?.some((t) => t.slug === params.tag));
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    fallback = fallback.filter(
      (b) => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)
    );
  }

  return {
    blogs: fallback,
    pagination: {
      total_records: fallback.length,
      total_pages: 1,
      current_page: 1,
      limit: params.limit || 9,
      has_next: false,
      has_prev: false,
    },
  };
}

/**
 * Fetch a single published blog details by slug + related posts
 */
export async function getBlogBySlug(slug: string): Promise<{
  blog: BlogPost | null;
  relatedBlogs: BlogPost[];
}> {
  try {
    const url = `${BLOG_API_BASE_URL}/public/blog.php?slug=${encodeURIComponent(slug)}`;
    if (!apiReachable()) throw new Error('Blog API not reachable from this site');
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.blog) {
        return {
          blog: data.data.blog,
          relatedBlogs: data.data.related_blogs || [],
        };
      }
    }
  } catch {
    // Fallback
  }

  const fallbackList = getFallbackBlogs();
  const found = fallbackList.find((b) => b.slug === slug);

  if (found) {
    // Same category first, then shared tags, then the newest of the rest
    const score = (b: BlogPost) =>
      (b.category_slug === found.category_slug ? 10 : 0) +
      (b.tags ?? []).filter((t) => found.tags?.some((f) => f.slug === t.slug)).length;
    const related = fallbackList
      .filter((b) => b.slug !== slug)
      .map((b, i) => ({ b, i, s: score(b) }))
      .sort((x, y) => y.s - x.s || x.i - y.i)
      .map(({ b }) => b)
      .slice(0, 4);
    return { blog: found, relatedBlogs: related };
  }

  return { blog: null, relatedBlogs: [] };
}

/**
 * Fetch active blog categories list
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const url = `${BLOG_API_BASE_URL}/public/categories.php`;
    if (!apiReachable()) throw new Error('Blog API not reachable from this site');
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(1500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.categories && data.data.categories.length > 0) {
        return data.data.categories;
      }
    }
  } catch {
    // Fallback
  }

  return DEFAULT_CATEGORIES;
}

/**
 * Every tag used by the published articles, most used first. The list API does not include tags, so
 * with a live CMS this falls back to the tags of the articles that carry them (e.g. the current one).
 */
export async function getBlogTags(extra: BlogTag[] = []): Promise<(BlogTag & { count: number })[]> {
  const { blogs } = await getPublishedBlogs({ limit: 1000 });
  const map = new Map<string, BlogTag & { count: number }>();
  for (const t of [...blogs.flatMap((b) => b.tags ?? []), ...extra]) {
    const hit = map.get(t.slug);
    if (hit) hit.count += 1;
    else map.set(t.slug, { ...t, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/* --------------------------------------------------------------------------
   Page copy (lib/blogContent.ts now, admin API later):
     GET {base}/public/blog-page.php    → { data: BlogPageContent }
     GET {base}/public/blog-detail.php  → { data: BlogDetailContent }
   Loaded with dynamic imports so the client components that use this file stay light.
   -------------------------------------------------------------------------- */
export async function getBlogPageContent() {
  const [{ fromApi, isObject }, { blogPageContent }] = await Promise.all([import("@/lib/servicesApi"), import("@/lib/blogContent")]);
  return fromApi("/public/blog-page.php", blogPageContent, isObject);
}

export async function getBlogDetailContent() {
  const [{ fromApi, isObject }, { blogDetailContent }] = await Promise.all([import("@/lib/servicesApi"), import("@/lib/blogContent")]);
  return fromApi("/public/blog-detail.php", blogDetailContent, isObject);
}

/* --------------------------------------------------------------------------
   Helpers shared by the blog pages
   -------------------------------------------------------------------------- */

/** Reading time at ≈200 words a minute (at least 1). */
export function readingMinutes(post: Pick<BlogPost, "content" | "excerpt">): number {
  const text = (post.content || post.excerpt || "").replace(/<[^>]+>/g, " ").trim();
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 200));
}

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Gives every h2 / h3 of an article body an id (kept when it already has one) so the table of contents
 * can link to it, and returns the list of headings.
 */
export function prepareArticle(html: string): { html: string; headings: ArticleHeading[] } {
  const headings: ArticleHeading[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, lvl: string, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();
    const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1];
    let id = existing || toSlug(text.replace(/^\d+[.)]\s*/, "")) || `section-${headings.length + 1}`;
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    }
    used.add(id);
    headings.push({ id, text, level: Number(lvl) as 2 | 3 });
    return `<h${lvl}${existing ? attrs : `${attrs} id="${id}"`}>${inner}</h${lvl}>`;
  });
  return { html: out, headings };
}
