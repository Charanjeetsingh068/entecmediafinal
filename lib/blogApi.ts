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

// Helper for fallback blogs
function getFallbackBlogs(): BlogPost[] {
  return blogsData.map((b) => {
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
      author_name: "Entec Media Team",
      status: "published",
      meta_title: b.title,
      meta_description: b.description,
      published_at: b.date,
      created_at: b.date,
      category_name: b.category,
      category_slug: toSlug(b.category),
      formatted_date: formatDate(b.date),
      tags: [],
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
    const related = fallbackList.filter((b) => b.slug !== slug).slice(0, 3);
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
