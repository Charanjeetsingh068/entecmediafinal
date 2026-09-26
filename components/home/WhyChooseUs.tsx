"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import team1Img from "@/public/images/team1-avatar.webp";
import team2Img from "@/public/images/team2-avatar.webp";
import team3Img from "@/public/images/team3-avatar.webp";
import team4Img from "@/public/images/team4-avatar.webp";
import CountUp from "@/components/shared/CountUp";
import Reveal from "@/components/shared/Reveal";
import ScrollHighlightText from "@/components/shared/ScrollHighlightText";

const paragraphText =
  "At the end of the day, we’re here to help your business grow. That means combining smart design, solid technology and data-driven marketing into one strategy that supports your goals, your team and your future plans.";

// Bar heights (px at desktop) — light grey → black, exactly like the Kudos "For ambitious teams" card
const bars = [11, 11, 22, 33, 43, 54, 87, 130, 174, 217];

// 4 × 5 tile grid for "Strategy > aesthetics": l = light grey, m = mid grey, w = white, a = accent, s = soft accent, d = dark, g = grey
const strategyTiles = [
  "s", "", "m", "",
  "", "m", "w", "g",
  "m", "l", "a", "",
  "", "d", "w", "m",
  "m", "s", "m", "s",
];

export default function WhyChooseUs() {
  const gridRef = useRef<HTMLDivElement>(null);
  const betterRef = useRef<HTMLSpanElement>(null);
  const squareRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Scroll-linked Kudos values written straight to the DOM (no React re-render per frame):
  // BETTER slides from translateY(48px) → 0 and the white card flattens from a tilted 3D pose.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const grid = gridRef.current;
      if (!grid) return;
      const vh = window.innerHeight;
      const top = grid.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, (vh * 0.82 - top) / (vh * 0.82)));
      const inv = 1 - p;
      if (betterRef.current) betterRef.current.style.transform = `translate3d(0, ${48 * inv}px, 0)`;
      if (squareRef.current) {
        squareRef.current.style.transform = `perspective(1200px) translate3d(${48 * inv}px, ${-48 * inv}px, 0) rotateX(${24 * inv}deg) rotateY(${-12 * inv}deg) rotateZ(${-6 * inv}deg) scale(${1 + 0.16 * inv})`;
      }
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

  // The card video only downloads when the grid comes near the screen, and pauses when it leaves.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = "/images/homebanner.mp4";
            video.load();
          }
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-choose-us" className="why-choose-us-section" data-theme="light">
      <div className="container">
        <div className="why-top-layout k-section-head">
          <div className="why-col-left">
            <span className="why-section-label">+ WHY CHOOSE US?</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              <span className="text-gradient">Positioned</span> for
              <br />
              lasting success
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              One partner for design, development and digital marketing — focused on outcomes, not just aesthetics.
            </p>
          </div>
        </div>

        <div className="k-why-intro">
          <Reveal className="k-why-rating">
            <div className="k-rating-avatars">
              {[team1Img, team2Img, team3Img, team4Img].map((img, i) => (
                <Image key={i} src={img} alt="" className="k-rating-avatar" />
              ))}
            </div>
            <div className="k-rating-info">
              <span className="k-rating-stars">
                <span className="k-stars">◆◆◆◆◆</span> 4.9/5
              </span>
              <span className="k-rating-label">TRUSTED BY TOP BRANDS</span>
            </div>
          </Reveal>
          <ScrollHighlightText className="k-why-paragraph" text={paragraphText} />
        </div>

        <div className="k-why-grid" ref={gridRef}>
          {/* Design that drives growth — video card, 2 columns × 2 rows */}
          <Reveal className="k-why-card k-why-video">
            <video ref={videoRef} loop muted playsInline preload="none" poster="/images/bannerbac.webp" className="k-why-video-bg" aria-hidden="true" />
            <div className="k-why-video-shade" />
            <div className="k-why-card-inner">
              <div>
                <span className="k-why-dot" aria-hidden="true" />
                <h3 className="k-why-video-title">
                  <span className="text-gradient">Design</span> that
                  <br />
                  drives growth
                </h3>
                <p className="k-why-video-desc">
                  Websites, apps and campaigns that help businesses grow, scale and compete with confidence.
                </p>
              </div>
              <div className="k-why-video-footer">
                <ul className="k-why-pills">
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></svg>
                    Clarity
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    Performance
                  </li>
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 6-6" /></svg>
                    Scale
                  </li>
                </ul>
                <span className="k-why-counter">
                  <CountUp end={100} suffix="%" duration={2200} />
                </span>
              </div>
            </div>
          </Reveal>

          {/* Clarity over complexity — BETTER slides up over LESS */}
          <Reveal className="k-why-card k-why-accent" delay={0.08}>
            <div className="k-why-card-inner">
              <div>
                <span className="k-why-dot" aria-hidden="true" />
                <h4 className="k-why-card-title">Clarity over complexity</h4>
                <p className="k-why-card-desc">
                  Simple, user-friendly websites and apps that customers understand instantly — no unnecessary noise.
                </p>
              </div>
              <div className="k-why-words" aria-hidden="true">
                <span className="k-why-less">LESS</span>
                <span className="k-why-better" ref={betterRef}>
                  BETTER
                </span>
              </div>
            </div>
          </Reveal>

          {/* Built with intention — tilted card settles flat */}
          <Reveal className="k-why-card k-why-white k-why-intention" delay={0.16}>
            <div className="k-why-stack" aria-hidden="true">
              <span className="k-why-line k-why-line-top" />
              <span className="k-why-line k-why-line-bottom" />
              <span className="k-why-line-v k-why-line-left" />
              <span className="k-why-line-v k-why-line-right" />
              <span className="k-why-square" />
              <span className="k-why-square-main" ref={squareRef} />
            </div>
            <div className="k-why-intention-text">
              <h4 className="k-why-card-title">Built with intention</h4>
              <p className="k-why-card-desc">We believe the smallest choices make the biggest difference.</p>
            </div>
          </Reveal>

          {/* For ambitious teams — bar chart */}
          <Reveal className="k-why-card k-why-white k-why-bars-card" delay={0.1}>
            <h4 className="k-why-card-title">For ambitious teams</h4>
            <div className="k-why-bars" aria-hidden="true">
              {bars.map((h, i) => (
                <span
                  key={i}
                  className="k-why-bar"
                  style={{ "--h": `${(h / 217) * 100}%`, "--o": 0.14 + (i / (bars.length - 1)) * 0.86, "--d": `${i * 0.06}s` } as React.CSSProperties}
                />
              ))}
            </div>
          </Reveal>

          {/* Strategy > aesthetics — tile board */}
          <Reveal className="k-why-card k-why-white k-why-strategy" delay={0.18}>
            <div className="k-why-tiles" aria-hidden="true">
              {strategyTiles.map((t, i) => (
                <span key={i} className={`k-why-tile ${t ? `k-why-tile-${t}` : ""}`} />
              ))}
            </div>
            <h4 className="k-why-card-title k-why-strategy-title">Strategy &gt; aesthetics</h4>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
