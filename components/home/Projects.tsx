"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { portfolioProjects } from "@/lib/portfolioData";
import SectionHeader from "@/components/shared/SectionHeader";
import CountUp from "@/components/shared/CountUp";
import KButton from "@/components/shared/KButton";

const featured = portfolioProjects.slice(0, 4);
// Four cards under the list: the non-featured projects first, then the latest featured ones
const otherProjects = [...portfolioProjects.slice(4), ...featured.slice().reverse()].slice(0, 4);

const total = String(featured.length).padStart(2, "0");

const stats = [
  { label: "Websites", end: 136, suffix: "" },
  { label: "Apps", end: 24, suffix: "" },
  { label: "Brands", end: 88, suffix: "" },
  { label: "Services", end: 10, suffix: "+" },
];

/**
 * Home "Featured projects".
 * Desktop: the intro column (quote, counters, project index) stays sticky; each project stage scrolls
 * past while its details card sticks beside it. Inside a stage the device floats up and the big
 * outlined number drifts the other way (scroll-linked, data-kfx → lib/scrollFx.ts).
 * Tablet: intro on top, stage + sticky details side by side. Mobile: everything stacks.
 */
export default function Projects() {
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const canHover = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Rotating "View project" cursor that trails the pointer over the project stages (desktop mouse only)
  useEffect(() => {
    const list = listRef.current;
    const cursor = cursorRef.current;
    if (!list || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const on = !!(e.target as Element).closest(".fp-stage");
      if (on && !cursor.classList.contains("is-on")) {
        x = tx;
        y = ty;
      }
      cursor.classList.toggle("is-on", on);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => cursor.classList.remove("is-on");
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // How far each screenshot can travel inside its window; the hover scroll speed follows the length
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const measure = () => {
      list.querySelectorAll<HTMLElement>(".fp-screen").forEach((screen) => {
        const img = screen.querySelector<HTMLImageElement>(".fp-screen-img");
        if (!img) return;
        const travel = Math.max(0, img.offsetHeight - screen.clientHeight);
        screen.style.setProperty("--travel", `${-travel}px`);
        screen.style.setProperty("--dur", `${Math.max(2.2, travel / 260).toFixed(2)}s`);
      });
    };
    measure();
    const imgs = list.querySelectorAll<HTMLImageElement>(".fp-screen-img");
    imgs.forEach((img) => img.addEventListener("load", measure));
    const ro = new ResizeObserver(measure);
    list.querySelectorAll(".fp-screen").forEach((el) => ro.observe(el));
    return () => {
      imgs.forEach((img) => img.removeEventListener("load", measure));
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rows = listRef.current?.querySelectorAll<HTMLElement>(".fp-row");
      if (!rows?.length) return;
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top <= mid) idx = i;
      });
      const first = rows[0].getBoundingClientRect();
      const last = rows[rows.length - 1].getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - first.top) / (last.bottom - first.top || 1)));
      if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;

      // Progress through the active project, shown under its tab
      const ar = rows[idx].getBoundingClientRect();
      const rp = Math.min(1, Math.max(0, (mid - ar.top) / (ar.height || 1)));
      document.querySelectorAll<HTMLElement>(".fp-tabs").forEach((nav) => {
        const tab = nav.querySelectorAll<HTMLElement>(".fp-tab")[idx];
        if (tab) tab.style.setProperty("--p", rp.toFixed(3));
      });

      // Touch screens (no hover): scroll each browser screen through its page while the stage
      // crosses the viewport. Mouse users get the hover scroll instead (see measureScreens).
      if (canHover.current) {
        setActive((prev) => (prev === idx ? prev : idx));
        return;
      }
      const vh = window.innerHeight;
      rows.forEach((row) => {
        const stage = row.querySelector<HTMLElement>(".fp-stage");
        const screen = row.querySelector<HTMLElement>(".fp-screen");
        const img = row.querySelector<HTMLImageElement>(".fp-screen-img");
        const thumb = row.querySelector<HTMLElement>(".fp-scrollbar span");
        if (!stage || !screen || !img) return;
        const r = stage.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const sp = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        const travel = Math.max(0, img.offsetHeight - screen.clientHeight);
        img.style.transform = `translate3d(0, ${-sp * travel}px, 0)`;
        if (thumb) thumb.style.transform = `translateY(${sp * 100 * 2.33}%)`;
      });

      setActive((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Slide the ink behind the active tab; keep the active tab visible in the horizontal bar
  useEffect(() => {
    const place = () => {
      document.querySelectorAll<HTMLElement>(".fp-tabs").forEach((nav) => {
        const tab = nav.querySelectorAll<HTMLElement>(".fp-tab")[active];
        const ink = nav.querySelector<HTMLElement>(".fp-tabs-ink");
        if (!tab || !ink) return;
        ink.style.width = `${tab.offsetWidth}px`;
        ink.style.height = `${tab.offsetHeight}px`;
        ink.style.transform = `translate3d(${tab.offsetLeft}px, ${tab.offsetTop}px, 0)`;
        if (nav.classList.contains("fp-tabs-top") && nav.scrollWidth > nav.clientWidth) {
          nav.scrollTo({ left: tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
        }
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  const goTo = (i: number) => {
    const row = listRef.current?.querySelectorAll<HTMLElement>(".fp-row")[i];
    if (!row) return;
    const offset = window.matchMedia("(max-width: 1199px)").matches ? 150 : 120;
    const y = row.getBoundingClientRect().top + window.scrollY - offset;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id="projects" className="k-section fp" data-theme="light">
      <div className="container">
        <SectionHeader
          label="+ FEATURED PROJECTS"
          title={
            <>
              <span className="text-gradient">Created</span> with
              <br />
              clear purpose
            </>
          }
          desc="Real projects, real challenges and measurable results across web development, UI/UX, SEO and paid advertising."
        />

        <div className="fp-grid">
          {/* Sticky intro column */}
          <aside className="fp-side">
            <p className="fp-quote">
              A curated selection of <strong>websites, apps, designs and marketing campaigns</strong> we have delivered
              to help businesses stand out and grow online.
            </p>

            <nav className="fp-tabs fp-tabs-side" aria-label="Featured projects">
              <span className="fp-tabs-bar" aria-hidden="true">
                <span ref={barRef} />
              </span>
              <span className="fp-tabs-ink" aria-hidden="true" />
              {featured.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  className={`fp-tab ${i === active ? "is-active" : ""}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="fp-tab-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fp-tab-name">{p.client}</span>
                </button>
              ))}
            </nav>

            <div className="fp-stats">
              {stats.map((s) => (
                <div key={s.label} className="fp-stat">
                  <span className="fp-stat-value">
                    <CountUp end={s.end} suffix={s.suffix} duration={2000} />
                  </span>
                  <span className="fp-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Project stages */}
          <div className="fp-list" ref={listRef}>
            <nav className="fp-tabs fp-tabs-top" aria-label="Featured projects">
              <span className="fp-tabs-ink" aria-hidden="true" />
              {featured.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  className={`fp-tab ${i === active ? "is-active" : ""}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="fp-tab-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fp-tab-name">{p.client}</span>
                </button>
              ))}
            </nav>

            {featured.map((project, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <article key={project.slug} className={`fp-row fp-tint-${i % 4} ${i === active ? "is-active" : ""}`}>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="fp-stage"
                    aria-label={`${project.title} case study`}
                    data-kfx="y:60;opacity:0"
                  >
                    <div className="fp-device">
                      <div className="fp-browser">
                        <div className="fp-browser-bar" aria-hidden="true">
                          <span className="fp-browser-dots">
                            <i />
                            <i />
                            <i />
                          </span>
                          <span className="fp-browser-url">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <rect x="5" y="11" width="14" height="9" rx="2" />
                              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                            </svg>
                            {project.client}
                          </span>
                        </div>
                        <div className="fp-screen">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.fullPageImage ?? project.heroImage}
                            alt={`${project.title} home page`}
                            className={`fp-screen-img ${project.fullPageImage ? "is-full" : "is-pan"}`}
                            loading="lazy"
                          />
                          <span className="fp-scrollbar" aria-hidden="true">
                            <span />
                          </span>
                        </div>
                      </div>
                    </div>

                  </Link>

                  <div className="fp-info">
                    <span className="fp-info-index">
                      {num} <small>/ {total}</small>
                    </span>
                    <h3 className="fp-title">{project.title}</h3>
                    <p className="fp-category">{project.category}</p>
                    <dl className="fp-meta">
                      <div>
                        <dt>Year</dt>
                        <dd>{project.year}</dd>
                      </div>
                      <div>
                        <dt>Client</dt>
                        <dd>{project.client}</dd>
                      </div>
                      <div>
                        <dt>Duration</dt>
                        <dd>{project.duration}</dd>
                      </div>
                    </dl>
                    <p className="fp-desc">{project.summary}</p>
                    <ul className="fp-tags">
                      {project.techStack.slice(0, 3).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <KButton href={`/portfolio/${project.slug}`} label="View case study" className="fp-cta" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Other projects — four image cards across the full width */}
        <div className="fp-more">
          <div className="fp-more-head">
            <div>
              <span className="why-section-label">+ OTHER PROJECTS</span>
              <p className="fp-more-sub">Keep exploring our work</p>
            </div>
            <KButton href="/portfolio" label="All case studies" />
          </div>
          <div className="fp-more-grid">
            {otherProjects.map((p) => (
              <Link key={p.slug} href={`/portfolio/${p.slug}`} className="fp-card">
                <span className="fp-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.heroImage.replace("w=1600", "w=700")} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="fp-card-body">
                  <span className="fp-card-text">
                    <strong>{p.client}</strong>
                    <small>{p.category}</small>
                  </span>
                  <span className="fp-card-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="fp-cursor" ref={cursorRef} aria-hidden="true">
        <span className="fp-cursor-inner">
          <svg className="fp-cursor-ring" viewBox="0 0 100 100">
            <defs>
              <path id="fp-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
            </defs>
            <text>
              <textPath href="#fp-ring" textLength="224" lengthAdjust="spacing">
                VIEW PROJECT • VIEW PROJECT •
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
