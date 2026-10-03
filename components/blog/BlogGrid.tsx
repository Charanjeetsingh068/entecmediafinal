"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import DotBackdrop from "@/components/shared/DotBackdrop";
import Reveal from "@/components/shared/Reveal";
import DateTile from "@/components/blog/DateTile";
import { sizedImage } from "@/lib/servicesContent";
import type { BlogPageContent } from "@/lib/blogContent";
import type { BlogCategory, BlogPost } from "@/lib/blogApi";

interface BlogGridProps {
  posts: (BlogPost & { minutes: number })[];
  categories: BlogCategory[];
  content: BlogPageContent["list"];
  /** Category slug to open with (category pages) */
  initialCategory?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const ALL = "";
const noSubscribe = () => () => {};

/**
 * "Our blogs" (light) — the Services grid design with articles: category tabs with a sliding ink and
 * counts, cut-corner photo cards in three columns (the middle one lower), numbered pagination.
 * Card: photo with the arrow in its curved top-right cut-out, a white calendar tile with the publish date
 * and the category pill, then title, excerpt, #tags and author · read time. Same motion as the Services
 * cards (photo wipe, pointer tilt, blue underline, cards rise in again on tab / page change).
 * Links from the article pages land here filtered: ?category=seo, ?tag=local-seo or ?q=ads (a chip
 * shows the tag / search with a Clear button).
 */
export default function BlogGrid({ posts, categories, content, initialCategory = ALL }: BlogGridProps) {
  const PER_PAGE = Math.max(1, content.perPage || 6);
  // Tabs: the CMS categories in their order, then any other category the posts use; empty ones are hidden
  const tabs = [
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
    ...posts
      .filter((p) => p.category_slug && !categories.some((c) => c.slug === p.category_slug))
      .map((p) => ({ slug: p.category_slug as string, name: p.category_name || "" })),
  ].filter((t, i, arr) => arr.findIndex((x) => x.slug === t.slug) === i && posts.some((p) => p.category_slug === t.slug));

  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  // Filters from the URL (links from article pages). The page is pre-rendered, so it is read on the client.
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  const [picked, setPicked] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);
  const [page, setPage] = useState(0);
  const filter = picked ?? (params.get("category") || initialCategory);
  const tag = cleared ? "" : params.get("tag") || "";
  const query = cleared ? "" : (params.get("q") || "").trim();

  // Arriving with a filter in the URL: bring the grid into view
  const scrolled = useRef(false);
  useEffect(() => {
    if (scrolled.current || !search || !sectionRef.current) return;
    scrolled.current = true;
    const y = sectionRef.current.getBoundingClientRect().top + window.scrollY - 40;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, [search]);

  const q = query.toLowerCase();
  const pool = posts.filter(
    (p) =>
      (!tag || p.tags?.some((t) => t.slug === tag)) &&
      (!q || [p.title, p.excerpt, p.category_name, ...(p.tags ?? []).map((t) => t.name)].join(" ").toLowerCase().includes(q)),
  );
  const list = filter === ALL ? pool : pool.filter((p) => p.category_slug === filter);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const start = page * PER_PAGE;
  const shown = list.slice(start, start + PER_PAGE);
  const tagName = tag ? (posts.flatMap((p) => p.tags ?? []).find((t) => t.slug === tag)?.name ?? tag) : "";

  // Slide the ink under the active tab
  useEffect(() => {
    const place = () => {
      const nav = tabsRef.current;
      const active = nav?.querySelector<HTMLElement>(".sg-tab.is-active");
      const ink = nav?.querySelector<HTMLElement>(".sg-tabs-ink");
      if (!active || !ink) return;
      ink.style.width = `${active.offsetWidth}px`;
      ink.style.transform = `translate3d(${active.offsetLeft}px, 0, 0)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter, tag, query]);

  // Photo tilt towards the pointer (mouse only)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>(".sg-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      card.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const onOut = (e: PointerEvent) => {
      const card = (e.target as Element).closest<HTMLElement>(".sg-card");
      if (card && !card.contains(e.relatedTarget as Node)) {
        card.style.setProperty("--tx", "0");
        card.style.setProperty("--ty", "0");
      }
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerout", onOut);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerout", onOut);
    };
  }, []);

  const scrollToTop = () => {
    const el = tabsRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const choose = (slug: string) => {
    setPicked(slug);
    setPage(0);
  };

  const goPage = (p: number) => {
    setPage(p);
    scrollToTop();
  };

  const clearExtra = () => {
    setCleared(true);
    setPage(0);
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  };

  const countFor = (slug: string) => (slug === ALL ? pool.length : pool.filter((p) => p.category_slug === slug).length);

  return (
    <section className="k-section sx bg-list" id="blogs" data-theme="light" ref={sectionRef} aria-label="All articles">
      <DotBackdrop />

      <div className="container sx-inner">
        <SectionHeader
          label={content.label}
          title={
            <>
              <span className="k-muted">{content.title.soft}</span>
              <br />
              {content.title.strong}
            </>
          }
          desc={content.desc}
        />

        <div className="sg-toolbar">
          <div className="sg-tabs" ref={tabsRef} role="tablist" aria-label="Filter articles by category">
            <span className="sg-tabs-ink" aria-hidden="true" />
            {[{ slug: ALL, name: content.allLabel }, ...tabs].map((t) => (
              <button
                key={t.slug || "all"}
                type="button"
                role="tab"
                aria-selected={t.slug === filter}
                className={`sg-tab ${t.slug === filter ? "is-active" : ""}`}
                onClick={() => choose(t.slug)}
              >
                {t.name}
                <sup>{pad(countFor(t.slug))}</sup>
              </button>
            ))}
          </div>
          <p className="sg-count" aria-live="polite">
            <strong>
              {list.length ? `${pad(start + 1)}–${pad(Math.min(start + PER_PAGE, list.length))}` : "00"}
            </strong>{" "}
            of {pad(list.length)} {content.countLabel}
          </p>
        </div>

        {(tag || query) && (
          <div className="bg-active">
            <span>
              {tag ? content.tagLabel : content.searchLabel}{" "}
              <b>{tag ? `#${tagName}` : `“${query}”`}</b>
            </span>
            <button type="button" onClick={clearExtra}>
              {content.clearLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        )}

        {shown.length ? (
          <div className="sg-grid" key={`${filter}-${tag}-${query}-${page}`}>
            {shown.map((p, i) => {
              return (
                <Reveal key={p.slug} delay={(i % 3) * 0.08} className="sg-cell" style={{ "--i": i } as CSSProperties}>
                  <Link href={`/blog/${p.slug}`} className="sg-card bg-card">
                    <span className="sg-media">
                      <span className="sg-photo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sizedImage(p.featured_image_url || "/images/aboutimg.webp", 900)}
                          alt={p.featured_image_alt || p.title}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <DateTile date={p.published_at || p.created_at} className="bg-date" />
                      {p.category_name && <span className="sg-cat">{p.category_name}</span>}
                      <span className="sg-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </span>
                    <span className="sg-body">
                      <h3 className="sg-title">{p.title}</h3>
                      <span className="sg-tagline bg-excerpt">{p.excerpt}</span>
                      {!!p.tags?.length && (
                        <span className="sg-tags">
                          {p.tags.slice(0, 3).map((t) => (
                            <span key={t.slug}>#{t.name}</span>
                          ))}
                        </span>
                      )}
                      <span className="bg-meta">
                        <span className="bg-meta-avatar" aria-hidden="true">
                          {p.author_name.charAt(0)}
                        </span>
                        <span>{p.author_name}</span>
                        <i aria-hidden="true" />
                        <span>
                          {p.minutes} {content.minRead}
                        </span>
                      </span>
                      <span className="sg-more">{content.readLabel}</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        ) : (
          <div className="pj-empty bg-empty">
            <strong>{content.emptyTitle}</strong>
            <p>{content.emptyText}</p>
            <button type="button" className="bg-empty-btn" onClick={() => { clearExtra(); choose(ALL); }}>
              {content.clearLabel}
            </button>
          </div>
        )}

        {pages > 1 && (
          <nav className="sg-pager" aria-label="Blog pages">
            <button type="button" className="sg-pager-arrow" onClick={() => goPage(page - 1)} disabled={page === 0} aria-label="Previous page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </button>
            <ol className="sg-pager-pages">
              {Array.from({ length: pages }, (_, n) => (
                <li key={n}>
                  <button
                    type="button"
                    className={n === page ? "is-active" : ""}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={`Page ${n + 1}`}
                    onClick={() => goPage(n)}
                  >
                    {pad(n + 1)}
                  </button>
                </li>
              ))}
            </ol>
            <span className="sg-pager-bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${(page + 1) / pages})` }} />
            </span>
            <button type="button" className="sg-pager-arrow" onClick={() => goPage(page + 1)} disabled={page === pages - 1} aria-label="Next page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
