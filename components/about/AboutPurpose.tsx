"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import KButton from "@/components/shared/KButton";

const photo = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const icons = {
  eye: icon(
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flag: icon(
    <>
      <path d="M5 21V4" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </>
  ),
  heart: icon(<path d="M12 21s-7.5-4.6-9.5-9.3C1 8.2 3.3 4.5 7 4.5c2.1 0 3.8 1.2 5 3 1.2-1.8 2.9-3 5-3 3.7 0 6 3.7 4.5 7.2C19.5 16.4 12 21 12 21z" />),
  handshake: icon(
    <>
      <path d="M8 13l3 3c.8.8 2 .8 2.8 0l4.7-4.7" />
      <path d="M2 11l4-4 5 1 2-2 4 1 5 4" />
      <path d="M2 11l3 3M22 11l-3.5 3.5" />
    </>
  ),
  chart: icon(
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 6-6" />
    </>
  ),
  clock: icon(
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  wallet: icon(
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 12.5h2M3 10h18" />
    </>
  ),
  chat: icon(
    <>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <path d="M8.5 11h7M8.5 14h4" />
    </>
  ),
  shield: icon(
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  star: icon(<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />),
  target: icon(
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 12l6-6M15 6h3v3" />
    </>
  ),
};

type Tile = { icon: ReactNode; title: string; desc: string };

const items: {
  key: string;
  cat: string;
  word: string;
  title: string;
  text: string;
  icon: ReactNode;
  img: string;
  alt: string;
  tiles: Tile[];
}[] = [
  {
    key: "vision",
    cat: "Our vision",
    word: "Vision",
    title: "The most trusted growth partner for ambitious businesses.",
    text: "Technology and marketing that create real, measurable growth — from a partner you rely on for years, not one project.",
    icon: icons.eye,
    img: "1522542550221-31fd19575a2d",
    alt: "Website layouts being planned on paper",
    tiles: [
      { icon: icons.handshake, title: "Long-term partners", desc: "Relationships that last for years." },
      { icon: icons.chart, title: "Measurable growth", desc: "Results you can see in numbers." },
    ],
  },
  {
    key: "mission",
    cat: "Our mission",
    word: "Mission",
    title: "Help businesses win online — with quality, on time and in the open.",
    text: "Websites, mobile apps, design and data-driven marketing, delivered with complete transparency.",
    icon: icons.flag,
    img: "1498050108023-c5249f4df085",
    alt: "A developer's laptop with code on a desk",
    tiles: [
      { icon: icons.clock, title: "On time", desc: "Milestones you can see." },
      { icon: icons.wallet, title: "On budget", desc: "Pricing agreed upfront." },
      { icon: icons.chat, title: "In the open", desc: "Regular, honest updates." },
    ],
  },
  {
    key: "values",
    cat: "Our values",
    word: "Values",
    title: "Four principles behind every decision we make.",
    text: "The way we work with every client, on every project — big or small.",
    icon: icons.heart,
    img: "1531482615713-2afd69097998",
    alt: "Two colleagues reviewing work together on a screen",
    tiles: [
      { icon: icons.shield, title: "Honesty", desc: "Open pricing, real numbers." },
      { icon: icons.star, title: "Quality", desc: "Every detail checked." },
      { icon: icons.target, title: "Accountability", desc: "Your budget, our care." },
      { icon: icons.handshake, title: "Partnership", desc: "We grow when you grow." },
    ],
  },
];

const count = items.length;
const total = String(count).padStart(2, "0");
const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * About "Vision, mission & values" — light version of the home "Our focus" section, over a background
 * that stays visible on white: a light dot grid circling slowly, two slow brand-blue blobs and large
 * dotted rings turning behind the photo deck.
 * Head: label, a title with a photo pill that changes with the item in focus, and a line of intro.
 * Desktop: a tall sticky photo deck on the left (the other photos peek out behind it, a soft brand glow
 * sits behind, and a glass panel at the bottom shows the item's icon, name and points) swaps to the card
 * crossing the middle of the screen; a rail of 01 Vision / 02 Mission / 03 Values scrolls to each card. On the right, three dark cards — Vision, Mission,
 * Values — each with a gradient number, category pill and icon, the statement, a line of text and its own
 * row of glass icon tiles (two goals, three promises, four values), over a large outlined watermark word.
 * The card in focus grows a little and gets a brand glow and side bar, a spotlight follows the mouse over
 * each card.
 * Tablet/phone: no deck — each card shows its own photo on top.
 */
export default function AboutPurpose() {
  const listRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rows = listRef.current?.querySelectorAll<HTMLElement>(".ab-pp-item");
      if (!rows?.length) return;
      const mid = window.innerHeight * 0.55;
      let idx = 0;
      rows.forEach((row, i) => {
        if (row.getBoundingClientRect().top <= mid) idx = i;
      });
      const first = rows[0].getBoundingClientRect();
      const last = rows[rows.length - 1].getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - first.top) / (last.bottom - first.top || 1)));
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

  // Rail: scroll the chosen card to the middle of the screen
  const goTo = (i: number) => {
    const card = listRef.current?.querySelectorAll<HTMLElement>(".ab-pp-item")[i];
    if (!card) return;
    const r = card.getBoundingClientRect();
    const y = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
    // Go through the site's smooth scroller (Lenis) when it is running
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Spotlight that follows the mouse over a card
  const spotlight = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const current = items[active];
  const prev = items[(active - 1 + count) % count];
  const next = items[(active + 1) % count];

  return (
    <section className="ab-pp" data-theme="light">
      <div className="ab-pp-bg" aria-hidden="true">
        <span className="ab-pp-grid-bg" />
        <span className="ab-pp-blob ab-pp-blob-a" />
        <span className="ab-pp-blob ab-pp-blob-b" />
        <svg className="ab-pp-rings" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="196" />
          <circle cx="200" cy="200" r="150" />
          <circle cx="200" cy="200" r="104" />
        </svg>
      </div>

      <div className="container">
        <div className="ab-pp-head">
          <div className="ab-pp-head-main">
            <span className="why-section-label" data-kfx="opacity:0;y:48">
              <span className="k-accent-dot" aria-hidden="true" /> OUR PURPOSE
            </span>
            <h2 className="ab-pp-title" data-kfx="opacity:0;y:48">
              <span className="k-muted">What</span>
              <span className="ab-pp-pill" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={current.img} src={photo(current.img, 300)} alt="" />
              </span>
              drives every project
            </h2>
          </div>
          <p className="ab-pp-intro" data-kfx="opacity:0;y:48">
            The vision we work towards, the mission we deliver on each day, and the values that keep us honest.
          </p>
        </div>

        <div className="ab-pp-layout">
          {/* Sticky photo deck (desktop) */}
          <div className="ab-pp-aside">
            <nav className="ab-pp-rail" aria-label="Vision, mission and values">
              {items.map((it, i) => (
                <button
                  key={it.key}
                  type="button"
                  className={i === active ? "is-active" : ""}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="ab-pp-rail-num">{num(i)}</span>
                  <span className="ab-pp-rail-name">{it.word}</span>
                </button>
              ))}
            </nav>

            <div className="ab-pp-deck" ref={deckRef} aria-hidden="true">
              <span className="ab-pp-deck-glow" />
              <div className="ab-pp-peek ab-pp-peek-back">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={next.img} src={photo(next.img, 800)} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="ab-pp-peek ab-pp-peek-mid">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={prev.img} src={photo(prev.img, 800)} alt="" loading="lazy" decoding="async" />
              </div>

              <div className="ab-pp-media">
                {items.map((it, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={it.img}
                    src={photo(it.img, 1000)}
                    alt=""
                    decoding="async"
                    className={i === active ? "is-active" : ""}
                  />
                ))}
                <div className="ab-pp-media-top">
                  <span key={active} className="ab-pp-media-num">
                    {num(active)}
                    <small>/ {total}</small>
                  </span>
                  <span className="ab-pp-media-cat">{current.cat}</span>
                </div>
                <div key={current.key} className="ab-pp-media-info">
                  <span className="ab-pp-media-icon">{current.icon}</span>
                  <span className="ab-pp-media-name">
                    <span className="ab-pp-word">
                      <span>{current.word}</span>
                    </span>
                  </span>
                  <span className="ab-pp-media-tags">
                    {current.tiles.map((tile, i) => (
                      <span key={tile.title} style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
                        {tile.title}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="ab-pp-list" ref={listRef}>
            {items.map((it, i) => (
              <article
                key={it.key}
                className={`ab-pp-item ab-pp-item-${it.key} ${i === active ? "is-active" : ""}`}
                onPointerMove={spotlight}
              >
                <span className="ab-pp-watermark" aria-hidden="true">
                  {it.word}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="ab-pp-thumb" src={photo(it.img, 800)} alt={it.alt} loading="lazy" decoding="async" />

                <div className="ab-pp-item-top">
                  <span className="ab-pp-num">{num(i)}</span>
                  <span className="ab-pp-cat">{it.cat}</span>
                  <span className="ab-pp-icon" aria-hidden="true">
                    {it.icon}
                  </span>
                </div>

                <h3 className="ab-pp-name">{it.title}</h3>
                <p className="ab-pp-text">{it.text}</p>

                <ul className={`ab-pp-tiles ab-pp-tiles-${it.tiles.length}`}>
                  {it.tiles.map((t) => (
                    <li key={t.title}>
                      <span className="ab-pp-tile-icon" aria-hidden="true">
                        {t.icon}
                      </span>
                      <strong>{t.title}</strong>
                      <span>{t.desc}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            <div className="ab-pp-cta" data-kfx="opacity:0;y:48">
              <span className="k-mono-label">Want a partner who works this way?</span>
              <KButton href="/contact" label="Start a project" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
