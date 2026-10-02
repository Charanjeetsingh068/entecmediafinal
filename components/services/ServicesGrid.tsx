"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import DotBackdrop from "@/components/shared/DotBackdrop";
import Reveal from "@/components/shared/Reveal";
import type { ServiceDetail } from "@/lib/servicesData";
import { sizedImage, type ServicesPageContent } from "@/lib/servicesContent";

interface ServicesGridProps {
  services: ServiceDetail[];
  content: ServicesPageContent["list"];
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services listing (light) over a calm animated dot background.
 * Category tabs with a sliding ink, then photo cards in three columns (the middle column sits lower for
 * rhythm), six per page with numbered pagination.
 * Card: a photo with a curved cut-out in its top-right corner where the arrow button sits, the service
 * number and category over the photo, then title, tagline and highlights. The photo opens with a wipe
 * as it scrolls into view; on hover it zooms and tilts slightly towards the pointer, the arrow fills
 * brand blue and turns, and a blue line runs along the bottom of the card. Cards rise in linked to
 * scroll; changing tab or page replays their entrance one after another.
 */
export default function ServicesGrid({ services, content }: ServicesGridProps) {
  const PER_PAGE = Math.max(1, content.perPage || 6);
  // Tabs come from the categories the services actually use, in order of first appearance
  const filters = ["All", ...Array.from(new Set(services.map((s) => s.category)))];

  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);

  const list = filter === "All" ? services : services.filter((s) => s.category === filter);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const start = page * PER_PAGE;
  const shown = list.slice(start, start + PER_PAGE);

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
  }, [filter]);

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

  const choose = (f: string) => {
    setFilter(f);
    setPage(0);
  };

  const goPage = (p: number) => {
    setPage(p);
    scrollToTop();
  };

  return (
    <section className="k-section sx" id="services-list" data-theme="light" ref={sectionRef} aria-label="All services">
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
          <div className="sg-tabs" ref={tabsRef} role="tablist" aria-label="Filter services by category">
            <span className="sg-tabs-ink" aria-hidden="true" />
            {filters.map((f) => {
              const count = f === "All" ? services.length : services.filter((s) => s.category === f).length;
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
          <p className="sg-count" aria-live="polite">
            <strong>
              {pad(start + 1)}–{pad(Math.min(start + PER_PAGE, list.length))}
            </strong>{" "}
            of {pad(list.length)} services
          </p>
        </div>

        <div className="sg-grid" key={`${filter}-${page}`}>
          {shown.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.08} className="sg-cell" style={{ "--i": i } as CSSProperties}>
              <Link href={`/services/${s.slug}`} className="sg-card">
                <span className="sg-media">
                  <span className="sg-photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sizedImage(s.image, 900)} alt={`${s.title} services by Entec Media`} loading="lazy" decoding="async" />
                  </span>
                  <span className="sg-num" aria-hidden="true">
                    {s.num}
                  </span>
                  <span className="sg-cat">{s.category}</span>
                  <span className="sg-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </span>
                <span className="sg-body">
                  <h3 className="sg-title">{s.title}</h3>
                  <span className="sg-tagline">{s.tagline}</span>
                  <span className="sg-tags">
                    {s.highlights.slice(0, 3).map((h) => (
                      <span key={h}>{h}</span>
                    ))}
                  </span>
                  <span className="sg-more">{content.exploreLabel}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        {pages > 1 && (
          <nav className="sg-pager" aria-label="Services pages">
            <button type="button" className="sg-pager-arrow" onClick={() => goPage(page - 1)} disabled={page === 0} aria-label="Previous page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
            </button>
            <ol className="sg-pager-pages">
              {Array.from({ length: pages }, (_, p) => (
                <li key={p}>
                  <button
                    type="button"
                    className={p === page ? "is-active" : ""}
                    aria-current={p === page ? "page" : undefined}
                    aria-label={`Page ${p + 1}`}
                    onClick={() => goPage(p)}
                  >
                    {pad(p + 1)}
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
