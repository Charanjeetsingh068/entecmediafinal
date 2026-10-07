"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { servicesList as servicesData } from "@/lib/servicesData";
import Reveal from "@/components/shared/Reveal";
import KButton from "@/components/shared/KButton";
import SvdBackdrop from "@/components/shared/SvdBackdrop";
import { onScrollNear } from "@/lib/scrollNear";

const count = servicesData.length;
const total = String(count).padStart(2, "0");
// Medium-size photo for the sticky preview (the data holds 1600px and 200px versions)
const previewSrc = (url: string) => url.replace("w=1600", "w=900");

/**
 * Home "Our focus" services section — dark, calm, scroll-driven.
 * Desktop: a sticky photo deck on the left swaps to the service crossing the middle of the screen
 * (neighbouring photos peek out behind it), with a 01–10 scroll-spy rail; the matching row in the
 * list is in focus while the others stay soft. Tablet/mobile: each row carries its own photo and
 * the same focus effect. Row contents rise with the scroll (data-kfx → lib/scrollFx.ts).
 * Row heights never change, so nothing jumps while scrolling.
 */
export default function Services() {
  const listRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const rows = listRef.current?.querySelectorAll<HTMLElement>(".svd-row");
      if (!rows?.length) return;
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top <= mid) idx = i;
      });
      const first = rows[0].getBoundingClientRect();
      const last = rows[rows.length - 1].getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - first.top) / (last.bottom - first.top || 1)));
      if (lineRef.current) lineRef.current.style.transform = `scaleY(${p})`;
      // Parallax drift on one wrapper (not a CSS variable read by every photo, which restarted
      // a dozen transitions on every scroll frame)
      if (trackRef.current) trackRef.current.style.transform = `translate3d(0, ${((p - 0.5) * -40).toFixed(1)}px, 0)`;
      setActive((prev) => (prev === idx ? prev : idx));
    };
    // Only while the section is on or near the screen (lib/scrollNear.ts)
    return onScrollNear(listRef.current?.closest("section"), update);
  }, []);

  // "View" cursor that trails the pointer over the list (desktop mouse only)
  useEffect(() => {
    const list = listRef.current;
    const cursor = cursorRef.current;
    if (!list || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 992px)").matches) return;
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
      if (!cursor.classList.contains("is-on")) {
        x = tx;
        y = ty;
      }
      cursor.classList.toggle("is-on", !!(e.target as Element).closest(".svd-row"));
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

  const current = servicesData[active];
  const prev = servicesData[(active - 1 + count) % count];
  const next = servicesData[(active + 1) % count];

  return (
    <section id="services" className="svd" data-theme="dark">
      {/* Canvas particle wave (no downloads), pinned to the screen while the section scrolls over it */}
      <SvdBackdrop />

      <div className="container">
        <div className="svd-top">
          <span className="why-section-label svd-label">
            <span className="k-accent-dot" aria-hidden="true" /> SERVICES
          </span>
          <h2 className="svd-title" data-kfx="opacity:0;y:48">
            <span className="svd-title-soft">Our</span>
            <span className="svd-title-pill" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.slug} src={current.thumb} alt="" loading="lazy" decoding="async" />
            </span>
            focus
          </h2>
          <p className="svd-desc" data-kfx="opacity:0;y:48">
            Design, development and digital marketing under one roof — everything your business needs to launch, grow
            and win online.
          </p>
        </div>
      </div>

      {/* Slow ticker of every service name */}
      <div className="svd-ticker" aria-hidden="true">
        <div className="svd-ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="svd-ticker-set">
              {servicesData.map((s) => (
                <span key={s.slug}>
                  {s.title}
                  <i>✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="svd-layout">
          {/* Sticky photo deck (desktop) */}
          <div className="svd-aside" aria-hidden="true">
            <div className="svd-rail">
              {servicesData.map((s, i) => (
                <span key={s.slug} className={i === active ? "is-active" : ""}>
                  {s.num}
                </span>
              ))}
            </div>

            <div className="svd-deck">
              {/* Neighbouring services peek out behind the main photo */}
              <div className="svd-peek svd-peek-back">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={next.slug} src={previewSrc(next.image)} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="svd-peek svd-peek-mid">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={prev.slug} src={previewSrc(prev.image)} alt="" loading="lazy" decoding="async" />
              </div>

              <div className="svd-media">
                <div className="svd-media-track" ref={trackRef}>
                  {servicesData.map((s, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={s.slug}
                      src={previewSrc(s.image)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={i === active ? "is-active" : ""}
                    />
                  ))}
                </div>
                <div className="svd-media-top">
                  <span key={current.num} className="svd-media-num">
                    {current.num}
                    <small>/ {total}</small>
                  </span>
                  <span className="svd-media-cat">{current.category}</span>
                </div>
                <div key={current.slug} className="svd-media-info">
                  <span className="svd-media-name">
                    {current.title.split(" ").map((w, i) => (
                      <span key={i} className="svd-word">
                        <span style={{ animationDelay: `${i * 0.08}s` }}>{w}</span>
                      </span>
                    ))}
                  </span>
                  <span className="svd-media-tags">{current.highlights.slice(0, 3).join(" · ")}</span>
                </div>
                <Link href={`/services/${current.slug}`} className="svd-badge" tabIndex={-1}>
                  <svg className="svd-badge-ring" viewBox="0 0 100 100">
                    <defs>
                      <path id="svd-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                    </defs>
                    <text>
                      <textPath href="#svd-ring" textLength="236" lengthAdjust="spacing">
                        EXPLORE SERVICE • EXPLORE SERVICE •
                      </textPath>
                    </text>
                  </svg>
                  <svg className="svd-badge-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Service list */}
          <div className="svd-list" ref={listRef}>
            <span className="svd-line" aria-hidden="true">
              <span ref={lineRef} />
            </span>

            {servicesData.map((service, i) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={`svd-row ${i === active ? "is-active" : ""}`}
                aria-label={`Explore our ${service.title} service`}
              >
                <div className="svd-row-inner" data-kfx="opacity:0;y:48">
                  <span className="svd-num">{service.num}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="svd-thumb" src={previewSrc(service.image)} alt="" loading="lazy" decoding="async" />
                  <div className="svd-head">
                    <span className="svd-cat">{service.category}</span>
                    <h3 className="svd-name">{service.title}</h3>
                  </div>
                  <div className="svd-body">
                    <p className="svd-text">{service.shortDesc}</p>
                    <ul className="svd-tags">
                      {service.highlights.slice(0, 2).map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="svd-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}

            <Reveal className="svd-footer">
              <div className="svd-quote">
                <span className="k-quote-mark svd-quote-mark" aria-hidden="true">&ldquo;&ldquo;</span>
                <p>
                  Our approach is simple: <strong>one team for design, development and marketing</strong> — so your
                  website, app and campaigns <strong>work together</strong> and keep growing your business.
                </p>
              </div>
              <div className="svd-cta">
                <span className="k-mono-label">Ready to start something great?</span>
                <KButton href="/contact" label="Let's Collaborate" variant="dark" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="svd-cursor" ref={cursorRef} aria-hidden="true">
        <span>View</span>
      </div>
    </section>
  );
}
