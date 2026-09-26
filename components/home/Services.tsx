"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { servicesList as servicesData } from "@/lib/servicesData";
import Reveal from "@/components/shared/Reveal";
import KButton from "@/components/shared/KButton";

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
  const deckRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLCanvasElement>(null);

  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
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
      if (deckRef.current) deckRef.current.style.setProperty("--drift", `${(p - 0.5) * -40}px`);
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

  // Canvas backdrop that reads like a looping video but downloads nothing: a flowing particle
  // wave, dotted sonar ripples, a rotating dotted orbit with a bright comet, and drifting sparkles.
  // Runs only while the section is on screen and the tab is visible, capped at 30fps.
  useEffect(() => {
    const canvas = dotsRef.current;
    const section = canvas?.closest("section");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !section || !ctx) return;

    const MAX_A = 0.5;
    // Pre-built shades so no colour strings are created while drawing
    const shades = Array.from({ length: 26 }, (_, i) => `rgba(165, 185, 255, ${((i / 25) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(25, Math.round((a / MAX_A) * 25)))];
    const ACCENT = "rgba(79, 140, 255, 0.95)";

    let w = 0, h = 0, cols = 0, rows = 0, small = false;
    let raf = 0, last = 0, t = 0, inView = false;
    let sparks: { x: number; y: number; v: number; p: number }[] = [];

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 810;
      cols = small ? 44 : 88;
      rows = small ? 18 : 28;
      sparks = Array.from({ length: small ? 22 : 44 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        v: 6 + Math.random() * 14,
        p: Math.random() * Math.PI * 2,
      }));
    };

    // A circle drawn as dots, `gap` px apart
    const dotRing = (cx: number, cy: number, r: number, alpha: number, gap: number, size: number, rot = 0) => {
      if (alpha <= 0.01 || r <= 0) return;
      ctx.fillStyle = shade(alpha);
      const n = Math.max(12, Math.floor((Math.PI * 2 * r) / gap));
      for (let i = 0; i < n; i++) {
        const a = rot + (i / n) * Math.PI * 2;
        ctx.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r, size, size);
      }
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      ctx.clearRect(0, 0, w, h);

      // 1. Particle wave along the bottom
      for (let r = 0; r < rows; r++) {
        const z = r / (rows - 1);
        const baseY = h * 0.42 + z * z * h * 0.7;
        const spread = w * (0.7 + z * 1.3);
        const amp = 10 + z * 50;
        const size = 0.8 + z * 1.6;
        for (let c = 0; c < cols; c++) {
          const x = c / (cols - 1) - 0.5;
          const wave = Math.sin(x * 7 + t * 2.2 + z * 3.2) * 0.6 + Math.sin(x * 2.6 - t * 1.3 + z * 5.5) * 0.4;
          const alpha = (0.06 + z * 0.34) * (0.5 + 0.5 * wave);
          if (alpha < 0.02) continue;
          ctx.fillStyle = shade(alpha);
          ctx.fillRect(w / 2 + x * spread, baseY + wave * amp, size, size);
        }
      }

      // 2. Sonar ripples from behind the list
      const cx = small ? w * 0.5 : w * 0.68;
      const cy = small ? h * 0.35 : h * 0.42;
      const maxR = Math.max(w, h) * (small ? 0.7 : 0.55);
      const period = 4.2;
      for (let k = 0; k < 3; k++) {
        const phase = ((t * 2.2) / period + k / 3) % 1; // 0 → 1
        dotRing(cx, cy, phase * maxR, (1 - phase) * 0.34, 9, 1.4);
      }

      // 3. Rotating dotted orbit with a comet
      const orbitR = Math.min(w, h) * (small ? 0.3 : 0.26);
      const rot = t * 0.9;
      dotRing(cx, cy, orbitR, 0.22, 7, 1.2, rot);
      dotRing(cx, cy, orbitR * 0.55, 0.14, 8, 1.1, -rot * 1.4);
      const head = t * 3.2;
      for (let i = 0; i < 14; i++) {
        const a = head - i * 0.045;
        const px = cx + Math.cos(a) * orbitR;
        const py = cy + Math.sin(a) * orbitR;
        if (i === 0) {
          ctx.fillStyle = ACCENT;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        } else {
          ctx.fillStyle = shade(0.45 * (1 - i / 14));
          ctx.fillRect(px - 1, py - 1, 2, 2);
        }
      }

      // 4. Drifting sparkles
      for (const s of sparks) {
        s.y -= s.v * dt * 0.001;
        if (s.y < -4) {
          s.y = h + 4;
          s.x = Math.random() * w;
        }
        const a = 0.12 + 0.28 * (0.5 + 0.5 * Math.sin(t * 6 + s.p));
        ctx.fillStyle = shade(a);
        ctx.fillRect(s.x, s.y, 1.6, 1.6);
      }
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      const dt = time - last;
      if (dt < 33) return; // ~30fps is plenty for a slow backdrop
      last = time;
      frame(Math.min(dt, 100));
    };

    const start = () => {
      if (!raf && inView && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    frame(0);
    const ro = new ResizeObserver(() => {
      resize();
      frame(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(section);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
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
      <div className="svd-bg" aria-hidden="true">
        <div className="svd-bg-sticky">
          <canvas className="svd-dots" ref={dotsRef} />
        </div>
      </div>

      <div className="container">
        <div className="svd-top">
          <span className="why-section-label svd-label">
            <span className="k-accent-dot" aria-hidden="true" /> SERVICES
          </span>
          <h2 className="svd-title" data-kfx="opacity:0;y:48">
            <span className="svd-title-soft">Our</span>
            <span className="svd-title-pill" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.slug} src={current.thumb} alt="" />
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

            <div className="svd-deck" ref={deckRef}>
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
