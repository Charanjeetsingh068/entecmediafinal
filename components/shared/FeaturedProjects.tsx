"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";
import CountUp from "@/components/shared/CountUp";
import KButton from "@/components/shared/KButton";
import type { WorkProject } from "@/lib/servicesApi";

export interface FeaturedProjectsProps {
  projects: WorkProject[];
  id?: string;
  label: string;
  title: ReactNode;
  desc: string;
  /** Intro line in the sticky side column */
  quote: ReactNode;
  stats: { label: string; end: number; suffix?: string }[];
  cta: { label: string; href: string };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Measures how far a card's screenshot can scroll and flags long pages. */
function measureShot(row: HTMLElement) {
  const screen = row.querySelector<HTMLElement>(".fp-screen");
  const img = row.querySelector<HTMLImageElement>(".fp-screen-img");
  if (!screen || !img || !img.offsetHeight) return;
  const travel = Math.max(0, img.offsetHeight - screen.clientHeight);
  row.toggleAttribute("data-long", travel > 8);
}

/** Shows the screenshot at progress p (0 = top of the page, 1 = bottom) and updates the pill. */
function setShot(row: HTMLElement, p: number) {
  const screen = row.querySelector<HTMLElement>(".fp-screen");
  const img = row.querySelector<HTMLImageElement>(".fp-screen-img");
  if (!screen || !img) return;
  const travel = Math.max(0, img.offsetHeight - screen.clientHeight);
  img.style.transform = `translate3d(0, ${(-p * travel).toFixed(1)}px, 0)`;
  row.style.setProperty("--ssp", p.toFixed(4));
  const pct = row.querySelector<HTMLElement>(".fp-live-pct");
  const label = `${Math.round(p * 100)}%`;
  if (pct && pct.textContent !== label) pct.textContent = label;
}

/**
 * "Featured projects" (home page and every service detail page) — a scroll-driven deck of project cards.
 * Desktop/tablet (tall enough viewport): every card pins under the header and holds for a moment, then the
 * next card slides up over it and the covered cards shrink back and dim. Small screens: the cards stack.
 * The deck motion is scroll-linked through the --ep / --pp / --depth variables set below. Each stage eases
 * in and shows the project's home page from the top. When the page is long, hovering scrolls
 * it all the way down (leaving scrolls back up) while a percentage pill follows along; touch
 * screens scroll it with the page instead. The sticky side index tracks the active project; soft background
 * blobs drift with the section in the brand blues.
 */
export default function FeaturedProjects({ projects: featured, id = "projects", label, title, desc, quote, stats, cta }: FeaturedProjectsProps) {
  const total = String(featured.length).padStart(2, "0");
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Rotating "View project" cursor that trails the pointer over the project stages (desktop mouse only)
  useEffect(() => {
    const list = listRef.current;
    const cursor = cursorRef.current;
    if (!list || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, inside = false, sraf = 0;
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      inside = true;
      const on = !!(e.target as Element).closest(".fp-stage");
      if (on && !cursor.classList.contains("is-on")) {
        x = tx;
        y = ty;
      }
      cursor.classList.toggle("is-on", on);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      inside = false;
      cursor.classList.remove("is-on");
    };
    // Wheel-scrolling moves cards under a still pointer without any pointer event
    const onScroll = () => {
      if (!inside || sraf) return;
      sraf = requestAnimationFrame(() => {
        sraf = 0;
        const el = document.elementFromPoint(tx, ty);
        cursor.classList.toggle("is-on", !!el?.closest(".fp-stage"));
      });
    };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
    };
  }, []);

  // Screenshots: measure them, then scroll long ones while the pointer is over them (mouse) at a steady
  // reading speed. The stage under the pointer is re-checked on page scroll too: wheel-scrolling slides
  // new cards under a still pointer without firing any pointer event.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>(".fp-row"));
    const measure = () => rows.forEach(measureShot);
    measure();
    const imgs = Array.from(list.querySelectorAll<HTMLImageElement>(".fp-screen-img"));
    imgs.forEach((img) => img.addEventListener("load", measure));
    const ro = new ResizeObserver(measure);
    list.querySelectorAll(".fp-screen").forEach((el) => ro.observe(el));

    const offs: Array<() => void> = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const gos = new Map<Element, (t: number) => void>();
      rows.forEach((row) => {
        const stage = row.querySelector<HTMLElement>(".fp-stage");
        const screen = row.querySelector<HTMLElement>(".fp-screen");
        const img = row.querySelector<HTMLImageElement>(".fp-screen-img");
        if (!stage || !screen || !img) return;
        let p = 0, target = 0, raf = 0, last = 0;
        const tick = (now: number) => {
          const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
          last = now;
          const travel = Math.max(1, img.offsetHeight - screen.clientHeight);
          // ~420px/s down, three times faster back up
          const step = ((target > p ? 420 : 1260) / travel) * dt;
          p = target > p ? Math.min(target, p + step) : Math.max(target, p - step);
          const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          setShot(row, eased);
          raf = p === target ? 0 : requestAnimationFrame(tick);
          if (!raf) last = 0;
        };
        gos.set(stage, (t: number) => {
          target = t;
          if (!raf) raf = requestAnimationFrame(tick);
        });
        offs.push(() => cancelAnimationFrame(raf));
      });

      let hovered: Element | null = null;
      let px = -1, py = -1, sraf = 0;
      const setHovered = (stage: Element | null) => {
        if (stage === hovered) return;
        if (hovered) gos.get(hovered)?.(0);
        hovered = stage;
        if (stage) gos.get(stage)?.(1);
      };
      const onMove = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        setHovered((e.target as Element).closest(".fp-stage"));
      };
      const onOut = (e: PointerEvent) => {
        if (e.relatedTarget) return; // still inside the window
        px = -1;
        setHovered(null);
      };
      const onScroll = () => {
        if (px < 0 || sraf) return;
        sraf = requestAnimationFrame(() => {
          sraf = 0;
          setHovered(document.elementFromPoint(px, py)?.closest(".fp-stage") ?? null);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onOut);
      window.addEventListener("scroll", onScroll, { passive: true });
      offs.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onOut);
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(sraf);
      });
    }

    return () => {
      imgs.forEach((img) => img.removeEventListener("load", measure));
      ro.disconnect();
      offs.forEach((off) => off());
    };
  }, []);

  // The deck: every frame, derive each card's entry (--ep), pinned (--pp) and covered (--depth) progress
  // from the in-flow anchors (the cards themselves are sticky, so their own rects stop moving).
  useEffect(() => {
    // Details start hidden only once JS runs, so they never vanish without it
    sectionRef.current?.setAttribute("data-ready", "");
    const touchScroll = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const list = listRef.current;
      if (!list) return;
      const rows = Array.from(list.querySelectorAll<HTMLElement>(".fp-row"));
      const anchors = Array.from(list.querySelectorAll<HTMLElement>(".fp-anchor"));
      const end = list.querySelector<HTMLElement>(".fp-deck-end");
      if (!rows.length || anchors.length !== rows.length) return;

      const vh = window.innerHeight;
      const mid = vh * 0.5;
      const cs = getComputedStyle(rows[0]);
      const stacking = cs.position === "sticky";
      const H = rows[0].offsetHeight;
      const G = list.querySelector<HTMLElement>(".fp-gap")?.offsetHeight || 0;
      const nat = anchors.map((a) => a.getBoundingClientRect().top);
      const stick = rows.map((r) => (stacking ? parseFloat(getComputedStyle(r).top) || 0 : vh * 0.3));

      const ep: number[] = [];
      const pp: number[] = [];
      const cp: number[] = [];
      const sp: number[] = []; // touch screenshot scroll: runs during the hold, before the next card arrives
      rows.forEach((row, i) => {
        const s = stick[i];
        ep[i] = clamp01((vh - nat[i]) / (vh - s || 1));
        if (stacking) {
          const last = i === rows.length - 1;
          const next = last ? s : stick[i + 1];
          const pinDist = last ? end?.offsetHeight || vh * 0.3 : H + G + s - next;
          pp[i] = clamp01((s - nat[i]) / (pinDist || 1));
          cp[i] = last ? 0 : clamp01((s - G - nat[i]) / (H + s - next || 1));
          sp[i] = clamp01((s - nat[i]) / ((last ? end?.offsetHeight : G) || 1));
        } else {
          const stage = row.querySelector<HTMLElement>(".fp-stage");
          const r = stage ? stage.getBoundingClientRect() : row.getBoundingClientRect();
          pp[i] = clamp01((vh * 0.85 - r.top) / (r.height + vh * 0.35));
          cp[i] = 0;
          sp[i] = pp[i];
        }
      });

      let idx = 0;
      nat.forEach((top, i) => {
        if (top <= mid) idx = i;
      });

      rows.forEach((row, i) => {
        // How many cards sit on top of this one (fractional while the next is sliding in)
        let depth = 0;
        for (let k = i; k < rows.length - 1; k++) depth += cp[k];
        row.style.setProperty("--ep", ep[i].toFixed(4));
        row.style.setProperty("--pp", pp[i].toFixed(4));
        row.style.setProperty("--depth", depth.toFixed(4));
        row.toggleAttribute("data-in", ep[i] > 0.45);

        // Touch screens have no hover: scroll the screenshot with the page instead
        if (touchScroll) setShot(row, sp[i]);
      });

      // Section progress drives the background blobs
      const sec = sectionRef.current;
      if (sec) {
        const r = sec.getBoundingClientRect();
        sec.style.setProperty("--sp", clamp01((vh - r.top) / (r.height + vh)).toFixed(4));
      }

      // Overall progress down the side index, and progress through the active project under its tab
      const p = clamp01((idx + pp[idx]) / rows.length);
      if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
      sectionRef.current?.querySelectorAll<HTMLElement>(".fp-tabs").forEach((nav) => {
        const tab = nav.querySelectorAll<HTMLElement>(".fp-tab")[idx];
        if (tab) tab.style.setProperty("--p", pp[idx].toFixed(3));
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

  // Slide the ink behind the active tab
  useEffect(() => {
    const place = () => {
      sectionRef.current?.querySelectorAll<HTMLElement>(".fp-tabs").forEach((nav) => {
        const tab = nav.querySelectorAll<HTMLElement>(".fp-tab")[active];
        const ink = nav.querySelector<HTMLElement>(".fp-tabs-ink");
        if (!tab || !ink) return;
        ink.style.width = `${tab.offsetWidth}px`;
        ink.style.height = `${tab.offsetHeight}px`;
        ink.style.transform = `translate3d(${tab.offsetLeft}px, ${tab.offsetTop}px, 0)`;
      });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Scroll so the chosen card has just pinned (or sits under the header on small screens)
  const goTo = (i: number) => {
    const list = listRef.current;
    const anchor = list?.querySelectorAll<HTMLElement>(".fp-anchor")[i];
    const row = list?.querySelectorAll<HTMLElement>(".fp-row")[i];
    if (!anchor || !row) return;
    const cs = getComputedStyle(row);
    const offset =
      cs.position === "sticky"
        ? parseFloat(cs.top) - 2
        : window.matchMedia("(max-width: 1199px)").matches
          ? 100
          : 120;
    const y = anchor.getBoundingClientRect().top + window.scrollY - offset;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section id={id} ref={sectionRef} className="k-section fp" data-theme="light">
      <div className="fp-bg" aria-hidden="true">
        <div className="fp-bg-inner">
          <span className="fp-blob fp-blob-a" />
          <span className="fp-blob fp-blob-b" />
        </div>
      </div>

      <div className="container">
        <SectionHeader label={label} title={title} desc={desc} />

        <div className="fp-grid">
          {/* Sticky intro column */}
          <aside className="fp-side">
            <p className="fp-quote">{quote}</p>

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

            <KButton href={cta.href} label={cta.label} className="fp-side-cta" />
          </aside>

          {/* The deck */}
          <div className="fp-list" ref={listRef}>

            {featured.map((project, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <Fragment key={project.slug}>
                  {/* In-flow marker: where this card would sit if it were not pinned */}
                  <span className="fp-anchor" aria-hidden="true" />
                  <article className={`fp-row ${i === active ? "is-active" : ""}`}>
                    <div className="fp-card">
                      <Link href={`/portfolio/${project.slug}`} className="fp-stage" aria-label={`${project.title} case study`}>
                        <div className="fp-screen">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.image}
                            alt={`${project.title} home page`}
                            className={`fp-screen-img ${project.fullPage ? "is-full" : "is-pan"}`}
                            loading="lazy"
                          />
                        </div>
                        <span className="fp-live" aria-hidden="true">
                          <i />
                          <span className="fp-live-hover">Hover to scroll</span>
                          <span className="fp-live-touch">Live preview</span>
                          <b className="fp-live-pct">0%</b>
                        </span>
                      </Link>

                      <div className="fp-info">
                        <div className="fp-info-top">
                          <span className="fp-info-index">
                            {num} <small>/ {total}</small>
                          </span>
                          <span className="fp-category">{project.category}</span>
                        </div>
                        <h3 className="fp-title" aria-label={project.title}>
                          {project.title.split(" ").map((word, w) => (
                            <Fragment key={w}>
                              <span className="fp-word" aria-hidden="true">
                                <span style={{ "--w": w } as React.CSSProperties}>{word}</span>
                              </span>{" "}
                            </Fragment>
                          ))}
                        </h3>
                        <p className="fp-sub">
                          {project.client} <i aria-hidden="true" /> {project.year} <i aria-hidden="true" /> {project.duration}
                        </p>
                        <p className="fp-desc">{project.desc}</p>
                        <ul className="fp-scope" aria-label="What we delivered">
                          {project.scope.slice(0, 3).map((sc) => (
                            <li key={sc}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                              {sc}
                            </li>
                          ))}
                        </ul>
                        <div className="fp-foot">
                          <ul className="fp-tags">
                            {project.tech.slice(0, 3).map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                          <KButton href={`/portfolio/${project.slug}`} label="View case study" className="fp-cta" />
                        </div>
                      </div>
                    </div>
                  </article>
                  {/* The pause before the next card arrives. A separate spacer (not a margin) keeps every
                      card's sticky box the same size, so the whole deck releases together at the end. */}
                  {i < featured.length - 1 && <span className="fp-gap" aria-hidden="true" />}
                </Fragment>
              );
            })}

            {/* Reading time for the last card before the deck scrolls away */}
            <span className="fp-deck-end" aria-hidden="true" />
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
