"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import whiteLogoImg from "@/public/images/whitelogo.svg";
import { siteConfig } from "@/lib/siteConfig";
import { servicesList } from "@/lib/servicesData";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/** Link text that rolls up on hover: the word slides out and a copy slides in from below. */
const Roll = ({ children }: { children: string }) => (
  <span className="ef-roll" data-text={children}>
    <span>{children}</span>
  </span>
);

/** Endings for the closing line; they turn over one after another. */
const ENDINGS = ["people remember.", "that ranks.", "that sells.", "that scales."];

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.contact.mapQuery)}`;

/**
 * Dark footer laid out on the page's four guide-line quarters. Behind it, the site's dotted language
 * (as in the Services section) in a scene of its own: a dotted terrain rolling across the whole footer
 * and a rotating dotted globe with an orbiting comet, faint enough to keep the content readable.
 * The creative touches on the content:
 * - Top: a big closing line whose last words turn over ("people remember." → "that ranks." → …)
 *   with a round magnetic "Start a project" button, then an info strip with one cell per guide-line
 *   quarter: email (with a copy icon), phone, careers, WhatsApp.
 * - Services band: every service glides past in a slow full-width marquee; hovering stops it and the
 *   hovered service turns white.
 * - Four equal columns on the page's guide lines, each inset the same: brand (logo, about, address),
 *   Explore, Follow, Legal + hours. Links roll up on hover.
 * - Bottom bar: copyright, and a smooth "Back to top" with a scroll-progress ring.
 * Everything rises in once the footer comes into view.
 */
export default function Footer() {
  const footRef = useRef<HTMLElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const topRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [ending, setEnding] = useState(0);

  // Closing line: turn to the next ending every few seconds
  useEffect(() => {
    const id = setInterval(() => setEnding((e) => (e + 1) % ENDINGS.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Background: the site's dotted language (as in the Services section) but its own scene, covering
  // the whole footer — a dotted terrain that rolls slowly towards the viewer from top to bottom, and a
  // rotating dotted globe with a tilted orbit and a satellite comet — large, in the open space between
  // the headline and the "Start a project" button on tablets and desktops, and left of the button on
  // phones (where the button has its own row).
  // Kept light: fixed dot counts, pre-built colours, fillRect only, ~30fps, and it runs only while the
  // footer is on screen and the tab is visible.
  useEffect(() => {
    const canvas = fxRef.current;
    const foot = footRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !foot || !ctx) return;

    const MAX_A = 0.5;
    // Pre-built shades so no colour strings are created while drawing
    const shades = Array.from({ length: 26 }, (_, i) => `rgba(165, 185, 255, ${((i / 25) * MAX_A).toFixed(3)})`);
    const shade = (a: number) => shades[Math.max(0, Math.min(25, Math.round((a / MAX_A) * 25)))];
    const ACCENT = "rgba(79, 140, 255, 0.95)";

    let w = 0, h = 0, cols = 0, rows = 0, small = false;
    let raf = 0, last = 0, t = 0, inView = false;
    // Globe centre and radius: the globe is built around the "Start a project" button on every screen
    let gx = 0, gy = 0, R = 0;
    // Globe points (unit sphere, Fibonacci lattice) — built once per resize
    let globe: { x: number; y: number; z: number }[] = [];

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = w < 810;
      // Dot counts follow the footer's real size, so the terrain has the same spacing (and the same
      // look) on phones, tablets and desktops; the total stays under ~3,000 dots.
      cols = Math.max(30, Math.min(90, Math.round(w / 21)));
      rows = Math.max(22, Math.min(50, Math.round(h / 37)));
      // Button centre from layout offsets (not getBoundingClientRect, so the entrance and magnetic
      // transforms don't shift it)
      const btn = btnRef.current;
      let bx = w * 0.85, by = 220, bw = 120;
      if (btn) {
        bx = btn.offsetWidth / 2;
        by = btn.offsetHeight / 2;
        for (let el: HTMLElement | null = btn; el && el !== foot; el = el.offsetParent as HTMLElement | null) {
          bx += el.offsetLeft;
          by += el.offsetTop;
        }
        bw = btn.offsetWidth;
      }

      // Tablet and desktop: a large globe in the open space between the headline and the button.
      // The headline's right edge is its widest line (including the longest turning ending).
      const head = foot.querySelector<HTMLElement>(".ef-hero-head");
      const title = foot.querySelector<HTMLElement>(".ef-cta-title");
      let placed = false;
      if (!small && head && title) {
        const fr = foot.getBoundingClientRect();
        const range = document.createRange();
        let textRight = 0;
        title.querySelectorAll<HTMLElement>(".ef-line, .ef-turn-word").forEach((el) => {
          range.selectNodeContents(el);
          textRight = Math.max(textRight, range.getBoundingClientRect().right - fr.left);
        });
        const space = bx - bw / 2 - textRight; // free width between the text and the button
        const hr = head.getBoundingClientRect();
        if (space > 160) {
          gx = textRight + space / 2;
          gy = hr.top - fr.top + hr.height / 2;
          R = Math.min(space / 2 - 24, hr.height * 0.62, 230);
          placed = true;
        }
      }
      // Phones: the button sits alone on its row (right), so the globe fills the open space to its left
      if (!placed && small && head) {
        const fr = foot.getBoundingClientRect();
        const left = head.getBoundingClientRect().left - fr.left + 16; // content edge
        const space = bx - bw / 2 - left;
        if (space > 120) {
          gx = left + space / 2;
          gy = by;
          R = Math.min(space / 2 - 12, 110);
          placed = true;
        }
      }
      // No open space at all (narrow tablets): the globe wraps the button instead
      if (!placed) {
        gx = bx;
        gy = by;
        R = Math.max(bw * 0.8, Math.min(w * 0.26, 100));
        R = Math.min(R, w - gx - 12, gx - 12); // always fits inside the footer
      }
      const n = small ? 260 : 520;
      const golden = Math.PI * (3 - Math.sqrt(5));
      globe = Array.from({ length: n }, (_, i) => {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const a = i * golden;
        return { x: Math.cos(a) * r, y, z: Math.sin(a) * r };
      });
    };

    const frame = (dt: number) => {
      t += dt * 0.00045;
      ctx.clearRect(0, 0, w, h);

      // 1. Dotted terrain over the whole footer: far rows small and faint at the top, near rows larger at
      //    the bottom; the hills roll towards the viewer.
      const flow = t * 0.9;
      for (let r = 0; r < rows; r++) {
        const z = r / (rows - 1); // 0 far → 1 near
        const y0 = h * 0.04 + Math.pow(z, 1.35) * h * 0.98;
        const spread = w * (0.75 + z * 0.9);
        const amp = 6 + z * 30;
        const size = 1.1 + z * 1.3;
        const depth = z * 6 - flow;
        for (let c = 0; c < cols; c++) {
          const x = c / (cols - 1) - 0.5;
          const hill =
            Math.sin(x * 6.2 + depth * 1.3) * 0.55 +
            Math.sin(x * 2.1 - depth * 0.8 + 1.7) * 0.3 +
            Math.sin((x + z) * 11 + depth * 2.1) * 0.15;
          const alpha = (0.12 + z * 0.24) * (0.55 + 0.45 * hill);
          if (alpha < 0.02) continue;
          ctx.fillStyle = shade(alpha);
          ctx.fillRect(w / 2 + x * spread, y0 - hill * amp, size, size);
        }
      }

      // 2. Rotating dotted globe around the "Start a project" button (front dots brighter than the back)
      const rot = t * 1.2;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      const tilt = 0.35, ct = Math.cos(tilt), st = Math.sin(tilt);
      for (const p of globe) {
        const x1 = p.x * cr - p.z * sr;
        const z1 = p.x * sr + p.z * cr;
        const y2 = p.y * ct - z1 * st;
        const z2 = p.y * st + z1 * ct;
        const a = z2 > 0 ? 0.2 + z2 * 0.3 : 0.07 + (1 + z2) * 0.05;
        ctx.fillStyle = shade(a);
        const s = z2 > 0 ? 1.8 : 1.2;
        ctx.fillRect(gx + x1 * R, gy + y2 * R, s, s);
      }

      // 3. Tilted orbit ring around the globe with a satellite comet
      const oR = R * 1.45;
      const steps = small ? 70 : 120;
      ctx.fillStyle = shade(0.26);
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        ctx.fillRect(gx + Math.cos(a) * oR, gy + Math.sin(a) * oR * 0.32 - Math.cos(a) * oR * 0.12, 1.1, 1.1);
      }
      const head = t * 2.6;
      for (let i = 0; i < 16; i++) {
        const a = head - i * 0.05;
        const px = gx + Math.cos(a) * oR;
        const py = gy + Math.sin(a) * oR * 0.32 - Math.cos(a) * oR * 0.12;
        if (i === 0) {
          ctx.fillStyle = ACCENT;
          ctx.fillRect(px - 2, py - 2, 4, 4);
        } else {
          ctx.fillStyle = shade(0.42 * (1 - i / 16));
          ctx.fillRect(px - 1, py - 1, 2, 2);
        }
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
    io.observe(foot);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Entrance + magnetic button
  useEffect(() => {
    const foot = footRef.current;
    const btn = btnRef.current;
    if (!foot) return;

    foot.setAttribute("data-ready", "");
    const reveal = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          foot.classList.add("is-in");
          reveal.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    reveal.observe(foot);

    // Magnetic button: leans towards the pointer while it is near
    const zone = btn?.parentElement;
    const onBtnMove = (e: PointerEvent) => {
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--bx", `${((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px`);
      btn.style.setProperty("--by", `${((e.clientY - (r.top + r.height / 2)) * 0.25).toFixed(1)}px`);
    };
    const onBtnLeave = () => {
      btn?.style.setProperty("--bx", "0px");
      btn?.style.setProperty("--by", "0px");
    };
    zone?.addEventListener("pointermove", onBtnMove);
    zone?.addEventListener("pointerleave", onBtnLeave);

    return () => {
      reveal.disconnect();
      zone?.removeEventListener("pointermove", onBtnMove);
      zone?.removeEventListener("pointerleave", onBtnLeave);
    };
  }, []);

  // "Back to top" ring follows the page scroll
  useEffect(() => {
    const btn = topRef.current;
    if (!btn) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      btn.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(3) : "0");
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

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${siteConfig.contact.email}`;
    }
  };

  // Back to top: one smooth glide straight to the top (Lenis; rAF fallback). The duration grows a
  // little with the distance so long pages don't rush.
  const scrollToTop = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const from = window.scrollY;
    if (from <= 0) return;
    const duration = Math.min(2.4, Math.max(1.2, from / 6000 + 0.9));
    const easing = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const lenis = window.__lenis;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { duration, easing, force: true });
      return;
    }
    let t0: number | null = null;
    const frame = (now: number) => {
      if (t0 === null) t0 = now;
      const k = Math.min(1, (now - t0) / (duration * 1000));
      window.scrollTo(0, from * (1 - easing(k)));
      if (k < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const rise = (d: number) => ({ "--d": d }) as React.CSSProperties;

  // One pass of the services band; it is rendered twice so the marquee loops seamlessly
  const serviceRun = (copy: boolean) => (
    <ul className="ef-band-run" aria-hidden={copy || undefined}>
      {servicesList.map((s) => (
        <Fragment key={s.slug}>
          <li>
            <Link href={`/services/${s.slug}`} className="ef-band-item" tabIndex={copy ? -1 : undefined}>
              {s.title}
            </Link>
          </li>
          <li className="ef-band-sep" aria-hidden="true">
            ✦
          </li>
        </Fragment>
      ))}
    </ul>
  );

  return (
    <footer className="ef" ref={footRef} data-theme="dark">
      <canvas className="ef-fx" ref={fxRef} aria-hidden="true" />

      {/* Top: logo + closing line with the magnetic button, then the giant email and an info strip */}
      <div className="container ef-hero">
        <div className="ef-hero-head">
          <div className="ef-cta">
            <span className="ef-label ef-rise" style={rise(0)}>
              + Have an idea?
            </span>
            <p className="ef-cta-title">
              <span className="ef-line ef-rise" style={rise(1)}>
                Let&apos;s build something
              </span>
              <span className="ef-turn ef-rise" style={rise(2)} aria-live="polite">
                {ENDINGS.map((text, i) => (
                  <span
                    key={text}
                    className={`ef-turn-word ${i === ending ? "is-on" : ""} ${i === (ending + ENDINGS.length - 1) % ENDINGS.length ? "is-out" : ""}`}
                    aria-hidden={i !== ending}
                  >
                    {text}
                  </span>
                ))}
              </span>
            </p>
          </div>

          <div className="ef-cta-zone ef-rise" style={rise(3)}>
            <Link href="/contact" className="ef-cta-btn" ref={btnRef}>
              <svg className="ef-cta-ring" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <path id="ef-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                </defs>
                <text>
                  <textPath href="#ef-ring" textLength="236" lengthAdjust="spacing">
                    START A PROJECT • LET&apos;S TALK •
                  </textPath>
                </text>
              </svg>
              <span className="ef-cta-core">
                <Arrow />
              </span>
              <span className="sr-only">Start a project</span>
            </Link>
          </div>
        </div>

        {/* Info strip: one cell per guide-line quarter */}
        <div className="ef-info">
          <div className="ef-info-cell ef-rise" style={rise(5)}>
            <span className="ef-info-label">Email</span>
            <span className="ef-info-mail">
              <a href={`mailto:${siteConfig.contact.email}`} className="ef-info-value ef-link">
                <Roll>{siteConfig.contact.email}</Roll>
              </a>
              <button
                type="button"
                className={`ef-copy ${copied ? "is-done" : ""}`}
                onClick={copyEmail}
                aria-label="Copy email address"
                title={copied ? "Copied" : "Copy"}
              >
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                  </svg>
                )}
              </button>
            </span>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>
          <div className="ef-info-cell ef-rise" style={rise(6)}>
            <span className="ef-info-label">Call us</span>
            <a href={siteConfig.contact.phoneHref} className="ef-info-value ef-link">
              <Roll>{siteConfig.contact.phone}</Roll>
            </a>
          </div>
          <div className="ef-info-cell ef-rise" style={rise(7)}>
            <span className="ef-info-label">Careers</span>
            <Link href="/careers" className="ef-info-value ef-link">
              <Roll>Join our team</Roll>
              <Arrow />
            </Link>
          </div>
          <div className="ef-info-cell ef-rise" style={rise(8)}>
            <span className="ef-info-label">Chat</span>
            <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="ef-info-value ef-link">
              <Roll>WhatsApp</Roll>
              <Arrow />
            </a>
          </div>
        </div>
      </div>

      {/* Services band: a slow full-width marquee of every service */}
      <nav className="ef-band ef-rise" style={rise(4)} aria-label="Our services">
        <div className="ef-band-track">
          {serviceRun(false)}
          {serviceRun(true)}
        </div>
      </nav>

      {/* Four equal columns: brand, explore, follow, legal + hours */}
      <div className="container">
        <div className="ef-grid">
          <div className="ef-col ef-brand ef-rise" style={rise(5)}>
            <Link href="/" className="ef-logo" aria-label="Entec Media home">
              <Image src={whiteLogoImg} alt="Entec Media" height={44} />
            </Link>
            <p className="ef-about">
              We design, develop and market digital experiences that help businesses grow online.
            </p>
            <p className="ef-address">
              {siteConfig.contact.addressLines[0]}
              <br />
              {siteConfig.contact.addressLines[1]}
            </p>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="ef-link">
              <Roll>Get directions</Roll>
              <Arrow />
            </a>
          </div>

          <nav className="ef-col ef-rise" style={rise(6)} aria-label="Footer navigation">
            <span className="ef-label">Explore</span>
            <ul className="ef-list">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="ef-link">
                    <Roll>{link.label}</Roll>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ef-col ef-rise" style={rise(7)}>
            <span className="ef-label">Follow</span>
            <ul className="ef-list">
              {siteConfig.socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="ef-link">
                    <Roll>{link.label}</Roll>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ef-col ef-rise" style={rise(8)}>
            <span className="ef-label">Legal</span>
            <ul className="ef-list">
              {siteConfig.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="ef-link">
                    <Roll>{link.label}</Roll>
                  </Link>
                </li>
              ))}
            </ul>
            <span className="ef-label ef-label-gap">Hours</span>
            <p className="ef-address">{siteConfig.contact.hours}</p>
          </div>

        </div>
      </div>

      {/* Bottom bar: copyright | back to top */}
      <div className="container ef-bottom">
        <span>© {new Date().getFullYear()} Entec Media. All rights reserved.</span>
        <button type="button" onClick={scrollToTop} className="ef-top" ref={topRef} aria-label="Scroll back to top">
          <span>Back to top</span>
          <span className="ef-top-ring">
            <svg viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="17" className="ef-top-track" />
              <circle cx="20" cy="20" r="17" className="ef-top-bar" pathLength="1" />
            </svg>
            <svg className="ef-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </span>
        </button>
      </div>
    </footer>
  );
}
