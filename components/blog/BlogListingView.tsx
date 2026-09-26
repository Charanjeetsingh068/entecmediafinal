"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogCategory, BlogPost } from "@/lib/blogApi";
import BlogMasonry from "./BlogMasonry";

const PAGE_SIZE = 8;

interface BlogListingViewProps {
  allBlogs: BlogPost[];
  categories: BlogCategory[];
  category: string;
  search: string;
  /** Mirror the filters into ?category=&search= (off on the /blog/category/[slug] archive pages) */
  syncUrl?: boolean;
}

/** Articles toolbar (search + category tabs), masonry grid and "Load more" — all filtering runs client-side. */
export default function BlogListingView({ allBlogs, categories, category: initialCategory, search: initialSearch, syncUrl = true }: BlogListingViewProps) {
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Keep the URL shareable (?category=…&search=…) without a navigation.
  useEffect(() => {
    if (!syncUrl) return;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [category, search, syncUrl]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allBlogs.filter(
      (b) =>
        (!category || b.category_slug === category) &&
        (!q || b.title.toLowerCase().includes(q) || (b.excerpt || "").toLowerCase().includes(q))
    );
  }, [allBlogs, category, search]);

  const shown = filtered.slice(0, visibleCount);

  return (
    <section className="k-section k-blog-list" data-theme="light">
      <div className="container">
        <div className="k-toolbar k-blog-toolbar">
          <label className="k-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-label="Search articles"
            />
          </label>
          <div className="k-tabs" role="tablist" aria-label="Article categories">
            <button
              type="button"
              role="tab"
              aria-selected={!category}
              className={`k-tab ${!category ? "is-active" : ""}`}
              onClick={() => {
                setCategory("");
                setVisibleCount(PAGE_SIZE);
              }}
            >
              All
              <span className="k-tab-count">{allBlogs.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={category === cat.slug}
                className={`k-tab ${category === cat.slug ? "is-active" : ""}`}
                onClick={() => {
                  setCategory(cat.slug);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {cat.name}
                <span className="k-tab-count">{cat.published_blogs_count ?? allBlogs.filter((b) => b.category_slug === cat.slug).length}</span>
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="k-empty">
            <p>No articles match your search.</p>
            <button
              type="button"
              className="k-text-link"
              onClick={() => {
                setCategory("");
                setSearch("");
              }}
            >
              View all articles
            </button>
          </div>
        ) : (
          <BlogMasonry posts={shown} headingLevel={2} />
        )}

        {filtered.length > visibleCount && (
          <div className="k-load-more">
            <button type="button" className="k-btn k-btn-light" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              <span className="k-btn-label">Load more articles</span>
              <span className="k-btn-icon" aria-hidden="true">
                <span className="k-btn-dot" />
                <span className="k-btn-dot" />
                <span className="k-btn-dot" />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
