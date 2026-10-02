"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import DotBackdrop from "@/components/shared/DotBackdrop";
import { sizedImage } from "@/lib/servicesContent";
import { useHoverScroll } from "@/lib/useHoverScroll";
import type { PortfolioPageContent } from "@/lib/portfolioContent";
import { liveLinkProps, type PortfolioItem } from "@/lib/portfolioItems";

interface PortfolioProjectsProps {
  items: PortfolioItem[];
  /** Preferred tab order */
  categories: string[];
  content: PortfolioPageContent["list"];
}

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

/** Page buttons to show: all of them when there are few, otherwise first, last and the current ±1 with gaps. */
function pageList(total: number, current: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const keep = new Set([0, total - 1, current - 1, current, current + 1]);
  if (current <= 3) [1, 2, 3, 4].forEach((p) => keep.add(p));
  if (current >= total - 4) [total - 5, total - 4, total - 3, total - 2].forEach((p) => keep.add(p));
  const pages = [...keep].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  pages.forEach((p, i) => {
    if (i && p - pages[i - 1] > 1) out.push("gap");
    out.push(p);
  });
  return out;
}

const hostOf = (url?: string) => {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/**
 * "Our projects" (light) over the calm dot background — built for hundreds of projects.
 * Toolbar: category tabs with live counts and a sliding ink, the result count, then a search panel —
 * a large search field (press "/" to jump into it; ✕ clears it) with a line that fills brand blue
 * while it is focused, and a row of the most-used technologies as quick filters (one at a time).
 * Cards: the project in a browser frame (its domain or client in the address bar). Website screenshots
 * scroll top to bottom while the card is hovered, with a "Hover to scroll · %" pill (lib/useHoverScroll.ts);
 * other images zoom gently. Then number, year, title, client, description, technology chips, "View
 * project" (the project page) and, for websites and apps, "Go to website" / "Go to mobile app" (new tab;
 * "#" until its url is added — the labels per category live in content.liveLinks). A rotating "View project"
 * ring follows the mouse over the screenshots. Changing tab, search, technology or page replays the
 * cards' staggered entrance. Pagination: arrows, numbers with gaps (1 … 7 8 9 … 18) and a progress bar;
 * phones get "03 / 18".
 */
export default function PortfolioProjects({ items, categories, content }: PortfolioProjectsProps) {
  const PER_PAGE = Math.max(1, content.perPage || 12);
  const sectionRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState(content.allLabel);
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Tabs: preferred order first, then any other category the projects use; empty ones are hidden
  const tabs = useMemo(() => {
    const used = new Set(items.map((p) => p.category));
    const ordered = [...categories.filter((c) => used.has(c)), ...[...used].filter((c) => !categories.includes(c))];
    return [content.allLabel, ...ordered];
  }, [items, categories, content.allLabel]);

  // The most-used technologies become quick filters
  const popular = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((p) => p.tech.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, Math.max(0, content.techCount ?? 8))
      .map(([t]) => t);
  }, [items, content.techCount]);

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (p) =>
        (!tech || p.tech.includes(tech)) &&
        (!q || [p.title, p.client, p.category, p.description, ...p.tech].some((t) => t?.toLowerCase().includes(q)))
    );
  }, [items, query, tech]);

  const list = filter === content.allLabel ? searched : searched.filter((p) => p.category === filter);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const start = current * PER_PAGE;
  const shown = list.slice(start, start + PER_PAGE);
  const viewKey = `${filter}|${query}|${tech}|${current}`;

  useHoverScroll(gridRef, [viewKey]);

  // Slide the ink under the active tab
  useEffect(() => {
    const place = () => {
      const nav = tabsRef.current;
      const tab = nav?.querySelector<HTMLElement>(".sg-tab.is-active");
      const ink = nav?.querySelector<HTMLElement>(".sg-tabs-ink");
      if (!tab || !ink) return;
      ink.style.width = `${tab.offsetWidth}px`;
      ink.style.transform = `translate3d(${tab.offsetLeft}px, 0, 0)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [filter, tabs]);

  // "/" jumps into the search field (unless the visitor is already typing somewhere)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable='true']")) return;
      const input = inputRef.current;
      if (!input) return;
      e.preventDefault();
      input.focus({ preventScroll: true });
      const r = input.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight) {
        const y = r.top + window.scrollY - window.innerHeight / 3;
        if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.8 });
        else window.scrollTo({ top: y, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Rotating "View project" ring that trails the pointer over the screenshots (mouse only)
  useEffect(() => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const on = !!(e.target as Element).closest(".pj-media");
      if (on && !cursor.classList.contains("is-on")) {
        x = tx;
        y = ty;
      }
      cursor.classList.toggle("is-on", on);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => cursor.classList.remove("is-on");
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToToolbar = () => {
    const el = toolbarRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 120;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const choose = (f: string) => {
    setFilter(f);
    setPage(0);
  };

  const goPage = (p: number) => {
    setPage(p);
    scrollToToolbar();
  };

  const clear = () => {
    setFilter(content.allLabel);
    setQuery("");
    setTech(null);
    setPage(0);
  };

  return (
    <section className="k-section pj" id="projects" data-theme="light" ref={sectionRef} aria-labelledby="projects-title">
      <DotBackdrop />

      <div className="container pj-inner">
        <SectionHeader
          label={content.label}
          title={
            <span id="projects-title">
              <span className="k-muted">{content.title.soft}</span>
              <br />
              {content.title.strong}
            </span>
          }
          desc={content.desc}
        />

        <div className="pj-toolbar" ref={toolbarRef}>
          <div className="pj-toolbar-top">
            <div className="sg-tabs pj-tabs" ref={tabsRef} role="tablist" aria-label="Filter projects by service">
              <span className="sg-tabs-ink" aria-hidden="true" />
              {tabs.map((f) => {
                const count = f === content.allLabel ? searched.length : searched.filter((p) => p.category === f).length;
                return (
                  <button
                    key={f}
                    type="button"
                    role="tab"
                    aria-selected={f === filter}
                    className={`sg-tab ${f === filter ? "is-active" : ""}`}
                    onClick={() => choose(f)}
                  >
                    {f}
                    <sup>{pad(count)}</sup>
                  </button>
                );
              })}
            </div>
            <p className="pj-total" aria-live="polite">
              <strong>{pad(list.length)}</strong>
              <span>
                {content.countLabel}
                {list.length > 0 && (
                  <small>
                    {pad(start + 1)}–{pad(Math.min(start + PER_PAGE, list.length))}
                  </small>
                )}
              </span>
            </p>
          </div>

          <div className="pj-panel">
            <label className="pj-find">
              <svg className="pj-find-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <span className="sr-only">{content.searchPlaceholder}</span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                placeholder={content.searchPlaceholder}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              />
              {query ? (
                <button
                  type="button"
                  className="pj-find-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    setPage(0);
                    inputRef.current?.focus();
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              ) : (
                <kbd className="pj-find-key" aria-hidden="true">
                  /
                </kbd>
              )}
              <span className="pj-find-line" aria-hidden="true" />
            </label>

            {popular.length > 0 && (
              <div className="pj-stack">
                <span className="pj-stack-label">{content.techLabel}</span>
                <div className="pj-stack-chips" role="group" aria-label={content.techLabel}>
                  {popular.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={tech === t}
                      className={tech === t ? "is-active" : ""}
                      onClick={() => {
                        setTech((cur) => (cur === t ? null : t));
                        setPage(0);
                      }}
                    >
                      {t}
                      {tech === t && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {shown.length ? (
          <div className="pj-grid" key={viewKey} ref={gridRef}>
            {shown.map((p, i) => {
              const href = `/portfolio/${p.id}`;
              const host = hostOf(p.url);
              return (
                <article key={p.id} className="pj-card" data-hs-area style={{ "--i": i } as CSSProperties}>
                  <Link href={href} className="pj-media" tabIndex={-1} aria-hidden="true">
                    <span className="pj-bar">
                      <i />
                      <i />
                      <i />
                      <span className="pj-bar-url">{host || p.client || p.title}</span>
                    </span>
                    <span className="pj-shot hs-frame">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sizedImage(p.image, 900)} alt="" className="hs-img" loading="lazy" decoding="async" />
                      <span className="hs-pill">
                        <i />
                        {content.scrollHint}
                        <b className="hs-pct">0%</b>
                      </span>
                    </span>
                    <span className="pj-cat">{p.category}</span>
                  </Link>

                  <div className="pj-body">
                    <div className="pj-top">
                      <span className="pj-num">{pad(start + i + 1, 3)}</span>
                      {p.year && <span className="pj-year">{p.year}</span>}
                    </div>
                    <h3 className="pj-title">
                      <Link href={href}>{p.title}</Link>
                    </h3>
                    {p.client && <p className="pj-client">{p.client}</p>}
                    <p className="pj-desc">{p.description}</p>
                    {p.tech.length > 0 && (
                      <ul className="pj-tech" aria-label="Technology">
                        {p.tech.slice(0, 3).map((t) => (
                          <li key={t} className={t === tech ? "is-match" : undefined}>
                            {t}
                          </li>
                        ))}
                        {p.tech.length > 3 && <li className="pj-tech-more">+{p.tech.length - 3}</li>}
                      </ul>
                    )}
                    <div className="pj-links">
                      <Link href={href} className="pj-visit" tabIndex={-1} aria-hidden="true">
                        {content.visitLabel}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                      {content.liveLinks?.[p.category] && (
                        <a {...liveLinkProps(p.url)} className="pj-live">
                          {content.liveLinks[p.category].label}
                          <span className="sr-only">: {p.title}{p.url ? " (opens in a new tab)" : ""}</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M7 17L17 7M9 7h8v8" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="pj-empty">
            <strong>{content.emptyTitle}</strong>
            <p>{content.emptyText}</p>
            <button type="button" onClick={clear}>
              {content.clearLabel}
            </button>
          </div>
        )}

        {pages > 1 && (
          <nav className="sg-pager pj-pager" aria-label="Project pages">
            <button type="button" className="sg-pager-arrow" onClick={() => goPage(current - 1)} disabled={current === 0} aria-label="Previous page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </button>
            <ol className="sg-pager-pages">
              {pageList(pages, current).map((p, i) =>
                p === "gap" ? (
                  <li key={`gap-${i}`} className="pj-pager-gap" aria-hidden="true">
                    …
                  </li>
                ) : (
                  <li key={p}>
                    <button
                      type="button"
                      className={p === current ? "is-active" : ""}
                      aria-current={p === current ? "page" : undefined}
                      aria-label={`Page ${p + 1}`}
                      onClick={() => goPage(p)}
                    >
                      {pad(p + 1)}
                    </button>
                  </li>
                )
              )}
            </ol>
            {/* Phones: "03 / 18" instead of the page numbers */}
            <span className="pj-pager-status" aria-hidden="true">
              <strong>{pad(current + 1)}</strong> / {pad(pages)}
            </span>
            <span className="sg-pager-bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${(current + 1) / pages})` }} />
            </span>
            <button type="button" className="sg-pager-arrow" onClick={() => goPage(current + 1)} disabled={current === pages - 1} aria-label="Next page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </nav>
        )}
      </div>

      <div className="fp-cursor" ref={cursorRef} aria-hidden="true">
        <span className="fp-cursor-inner">
          <svg className="fp-cursor-ring" viewBox="0 0 100 100">
            <defs>
              <path id="pj-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
            </defs>
            <text>
              <textPath href="#pj-ring" textLength="224" lengthAdjust="spacing">
                {content.cursorText}
              </textPath>
            </text>
          </svg>
          <svg className="fp-cursor-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </section>
  );
}
