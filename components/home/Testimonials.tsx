"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { testimonials, type Review } from "@/lib/testimonialsData";

// Phones: all reviews are slides, but there are only four dots; they cycle (slide 5 lights dot 1 again)
const DOTS = 4;
// The phone slider loops: three copies of the slides, the visitor always lands back in the middle one
const COPIES = 3;

function ReviewCard({ item, brand, hidden }: { item: Review; brand: boolean; hidden?: boolean }) {
  return (
    <figure className={`sp-card ${brand ? "is-brand" : ""}`} aria-hidden={hidden ? true : undefined}>
      <div className="sp-card-top">
        <span className="sp-card-tag">{item.service}</span>
        <svg className="sp-card-mark" viewBox="0 0 32 24" aria-hidden="true">
          <path d="M0 24V14.4C0 6.4 4.3 1.6 12.3 0l1.4 3.4C9.4 4.8 7.3 7.4 7 11h6.3v13H0Zm18.3 0V14.4c0-8 4.3-12.8 12.3-14.4L32 3.4c-4.3 1.4-6.4 4-6.7 7.6h6.3v13H18.3Z" />
        </svg>
      </div>
      <blockquote>{item.quote}</blockquote>
      <figcaption className="sp-card-author">
        <Image src={item.avatar} alt="" width={44} height={44} className="sp-card-avatar" draggable={false} />
        <span>
          <strong>{item.name}</strong>
          <small>{item.role}</small>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Home "Social proof" — a dark section with a two-row review slider.
 * Behind it, "voice ribbons": thin brand-blue lines that rise and fall like speech, pinned to the screen
 * while the section scrolls and stirred a little by the scroll.
 * The top row glides left and the bottom row right, forever, at one steady speed. The motion is a CSS
 * animation (runs on the compositor), so page scrolling and other scripts can never make it stutter;
 * hovering a row pauses just that row. Every card has the same height.
 * Phones (576px and below): one testimonial at a time instead, moved only by the visitor — swipe, or tap
 * the dots under it (no autoplay). It loops endlessly both ways: once a swipe settles in the first or
 * last copy of the slides, it is moved invisibly to the same slide in the middle copy. All reviews are slides; the four dots cycle with them (slides 1–4
 * light dots 1–4, slide 5 lights dot 1 again, …).
 */
export default function Testimonials({ reviews = testimonials }: { reviews?: Review[] }) {
  // Two rows; each is doubled in the markup so the loop is seamless
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)];
  const phoneSlides = Array.from({ length: COPIES }, (_, c) => reviews.map((item, k) => ({ item, k, c }))).flat();

  const sectionRef = useRef<HTMLElement>(null);
  const voiceRef = useRef<HTMLCanvasElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  // Phone slider: the active dot follows the swipe, and the loop is re-centred once a swipe settles
  useEffect(() => {
    const el = slidesRef.current;
    if (!el) return;
    const n = reviews.length;
    const stepOf = () => {
      const first = el.firstElementChild as HTMLElement | null;
      return first ? first.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0) : 0;
    };
    const jumpTo = (index: number) => {
      const step = stepOf();
      if (step) el.scrollTo({ left: index * step, behavior: "instant" });
    };
    // Start on the first review of the middle copy (and stay there if the width changes)
    let current = n;
    jumpTo(current);

    let raf = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const recentre = () => {
      const step = stepOf();
      if (!step) return;
      const i = Math.round(el.scrollLeft / step);
      const k = ((i % n) + n) % n;
      setSlide(k);
      current = k + n;
      if (i < n || i >= 2 * n) jumpTo(current);
    };
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const step = stepOf();
          if (!step) return;
          current = Math.round(el.scrollLeft / step);
          setSlide(((current % n) + n) % n);
        });
      }
      // Fallback for browsers without "scrollend"
      clearTimeout(settle);
      settle = setTimeout(recentre, 160);
    };
    const onResize = () => jumpTo(current);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", recentre);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", recentre);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [reviews.length]);

  // Four cycling dots: the active one is the slide's place in its group of four
  const activeDot = slide % DOTS;
  const groupStart = slide - activeDot;

  // Tap a dot: glide to that place in the current group of four. The slider rests in the middle copy, so
  // a spot past the last review is simply the start of the next copy (the loop re-centres after).
  const showSlide = (dot: number) => {
    const el = slidesRef.current;
    const card = el?.children[reviews.length + groupStart + dot] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft, behavior: "smooth" }); // .sp-slides is the cards' offset parent
  };

  // Background "voice ribbons": a few sine lines under a speech-like envelope, drawn only while in view
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = voiceRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;
    let w = 0, h = 0, raf = 0, visible = false, lastY = window.scrollY, stir = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ribbons = [
      { f: 1.6, s: 0.55, ph: 0, a: 1, alpha: 0.34, lw: 1.6 },
      { f: 2.3, s: -0.4, ph: 1.7, a: 0.8, alpha: 0.22, lw: 1.2 },
      { f: 1.1, s: 0.3, ph: 3.1, a: 0.65, alpha: 0.18, lw: 1 },
      { f: 3.2, s: 0.7, ph: 4.4, a: 0.45, alpha: 0.14, lw: 1 },
    ];
    const draw = (now: number) => {
      const t = now / 1000;
      const y = window.scrollY;
      stir += (Math.min(40, Math.abs(y - lastY)) / 40 - stir) * 0.08; // 0…1, eases back when scrolling stops
      lastY = y;
      ctx.clearRect(0, 0, w, h);
      const mid = h * 0.52;
      const amp = h * 0.11 * (1 + stir * 0.8);
      ribbons.forEach((rb, l) => {
        // Speech envelope: phrases swell and settle at different times for each line
        const speech = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.7 + l * 0.9) * Math.sin(t * 1.9 + l));
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "rgba(90, 110, 255, 0)");
        grad.addColorStop(0.3, `rgba(90, 110, 255, ${rb.alpha})`);
        grad.addColorStop(0.7, `rgba(60, 150, 255, ${rb.alpha})`);
        grad.addColorStop(1, "rgba(60, 150, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = rb.lw;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const u = x / w;
          const bell = Math.pow(Math.sin(Math.PI * u), 2);
          const yy =
            mid +
            amp * rb.a * speech * bell *
              (Math.sin(u * Math.PI * 2 * rb.f + t * rb.s * 2 + rb.ph) + 0.35 * Math.sin(u * Math.PI * 9 * rb.f + t * 1.3));
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      });
      raf = visible ? requestAnimationFrame(draw) : 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    resize();
    io.observe(section);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="k-section sp" data-theme="dark">
      <div className="sp-bg" aria-hidden="true">
        <div className="sp-bg-sticky">
          <canvas className="sp-voice" ref={voiceRef} />
        </div>
      </div>

      <div className="container sp-head">
        <div>
          <p className="sp-label">
            <span className="sp-dot" aria-hidden="true" />
            Testimonials
          </p>
          <h2 className="sp-title">What our partners say</h2>
        </div>
        <p className="sp-sub">Websites, apps, branding and marketing — short notes from the teams behind the projects.</p>
      </div>

      {/* Tablet and desktop: two rows gliding in opposite directions */}
      <div className="sp-wall">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`sp-row ${r === 1 ? "is-reverse" : ""}`}
            aria-label={r === 0 ? "Client testimonials" : undefined}
            // Same speed for both rows: the loop time grows with the number of cards
            style={{ "--dur": `${row.length * 11}s` } as React.CSSProperties}
          >
            <div className="sp-row-track">
              {[...row, ...row].map((item, i) => (
                <ReviewCard key={i} item={item} brand={(i + r) % 3 === 1} hidden={i >= row.length} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Phones: one testimonial at a time, swipe or tap a dot */}
      <div className="sp-mobile container">
        <div className="sp-slides" ref={slidesRef} aria-label="Client testimonials">
          {phoneSlides.map(({ item, k, c }) => (
            <ReviewCard key={`${c}-${item.name}`} item={item} brand={k % 3 === 1} hidden={c !== 1} />
          ))}
        </div>
        <div className="sp-dots" role="tablist" aria-label="Choose a testimonial">
          {Array.from({ length: DOTS }, (_, dot) => {
            const target = (groupStart + dot) % reviews.length;
            return (
              <button
                key={dot}
                type="button"
                role="tab"
                className={`sp-dot-btn ${dot === activeDot ? "is-active" : ""}`}
                aria-selected={dot === activeDot}
                aria-label={`Show testimonial ${target + 1} of ${reviews.length}: ${reviews[target].name}`}
                onClick={() => showSlide(dot)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
