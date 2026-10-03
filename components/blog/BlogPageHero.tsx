"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import DateTile from "@/components/blog/DateTile";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import { sizedImage } from "@/lib/servicesContent";
import type { BlogPageContent } from "@/lib/blogContent";
import type { BlogPost } from "@/lib/blogApi";

interface BlogPageHeroProps {
  content: BlogPageContent["hero"];
  /** Page name for the breadcrumb ("Blog") */
  name: string;
  /** Newest articles first; the first `content.count` rotate on the art */
  posts: (BlogPost & { minutes: number })[];
  minRead: string;
  /** Category page: extra breadcrumb crumb and a different title */
  crumb?: { label: string; href: string };
  title?: { soft: string; strong: string };
  desc?: string;
}

/**
 * Blog hero — dark, pinned (the page body slides over it), same family as the About / Services / Projects
 * heroes: breadcrumb, a title whose lines slide up out of a mask, intro, actions and three stats.
 * Right (its own design): a "reading desk". The newest articles take turns as a large card laid on two
 * softly tilted paper sheets: the photo on top, kept clean, and a solid caption panel under it (white
 * calendar tile with the date, category, read time, title, arrow). A rail of round thumbnails sits on the cover's left edge (under it on phones); a ring around the
 * active one fills while the article is in front, then the next one wipes in. Hovering pauses it; a
 * thumbnail picks an article.
 */
export default function BlogPageHero({ content, name, posts, minRead, crumb, title, desc }: BlogPageHeroProps) {
  const shown = posts.slice(0, Math.max(1, content.count || 4));
  const n = shown.length;
  const INTERVAL = content.interval || 4200;
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const heading = title ?? content.title;

  useEffect(() => {
    if (paused || n < 2) return;
    timer.current = setTimeout(() => setFront((f) => (f + 1) % n), INTERVAL);
    return () => clearTimeout(timer.current);
  }, [front, paused, n, INTERVAL]);

  return (
    <section className="k-page-hero ab-hero bh-hero" data-theme="dark" aria-labelledby="blog-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: name, href: "/blog" },
              ...(crumb ? [crumb] : []),
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>

          <h1 className="ab-hero-title" id="blog-title">
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.1s" }}>
                {heading.soft}
              </span>
            </span>
            <span className="ab-line">
              <span style={{ animationDelay: "0.22s" }}>
                {heading.strong}
                <em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          <p className="ab-hero-desc">{desc ?? content.desc}</p>

          <div className="ab-hero-actions">
            <KButton href={content.primaryCta.href} label={content.primaryCta.label} variant="dark" />
            <a href={content.secondaryCta.href} className="ab-hero-link">
              {content.secondaryCta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>

          <dl className="sv-hero-stats">
            {content.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {n > 0 && (
          <div
            className={`bh-art ${paused ? "is-paused" : ""}`}
            style={{ "--bh-dur": `${INTERVAL}ms` } as CSSProperties}
            onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
          >
            <div className="bh-stage">
              <span className="bh-sheet bh-sheet-a" aria-hidden="true" />
              <span className="bh-sheet bh-sheet-b" aria-hidden="true" />

              <div className="bh-covers">
                {shown.map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className={`bh-cover ${i === front ? "is-active" : ""}`}
                    tabIndex={i === front ? 0 : -1}
                    aria-hidden={i === front ? undefined : true}
                  >
                    <span className="bh-cover-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sizedImage(p.featured_image_url || "/images/aboutimg.webp", 1200)}
                        alt={p.featured_image_alt || p.title}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "low"}
                      />
                    </span>
                    <span className="bh-cover-cap">
                      <DateTile date={p.published_at || p.created_at} className="bh-cover-date" />
                      <span className="bh-cover-text">
                        <span className="bh-cover-meta">
                          {p.category_name && <b>{p.category_name}</b>}
                          <span className="bh-cover-read">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v5l3 2" />
                            </svg>
                            {p.minutes} {minRead}
                          </span>
                        </span>
                        <strong className="bh-cover-title">{p.title}</strong>
                      </span>
                      <span className="bh-cover-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Round thumbnails along the cover's edge pick an article; the active one shows the time left */}
            <div className="bh-thumbs" role="tablist" aria-label={content.listLabel}>
              {shown.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === front}
                  aria-label={p.title}
                  title={p.title}
                  className={`bh-thumb ${i === front ? "is-active" : ""}`}
                  onClick={() => setFront(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sizedImage(p.featured_image_url || "/images/aboutimg.webp", 200)} alt="" decoding="async" />
                  {i === front && (
                    <svg className="bh-thumb-ring" viewBox="0 0 48 48" aria-hidden="true" key={`${front}-${paused}`}>
                      <circle cx="24" cy="24" r="22.5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <span className="sv-hero-chip bh-chip" aria-hidden="true">
              <span className="sv-hero-chip-dot" />
              {content.chip}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
