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
import { bannerVideoSrc } from "@/lib/bannerVideo";

const paragraphText =
  "At the end of the day, we’re here to help your business grow. That means combining smart design, solid technology and data-driven marketing into one strategy that supports your goals, your team and your future plans.";

// "For ambitious teams" bar chart — 10 bars rising left → right (height in % of the chart)
const bars = [16, 24, 32, 40, 48, 57, 66, 76, 86, 96];

// "Strategy > aesthetics" board — rows of segments (flex weight, tone): g = grey, l = light, a = accent
const strategyRows: Array<Array<[number, "g" | "l" | "a"]>> = [
  [[5, "l"], [3, "g"]],
  [[1.5, "l"], [3, "g"], [3.5, "g"]],
  [[0.7, "l"], [3.4, "g"], [0.4, "l"], [3.5, "a"]],
  [[2, "l"], [3, "g"], [3, "l"]],
];

const features = [
  {
    label: "Clarity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    label: "Performance",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Scale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 6-6" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Card video: nothing downloads on page load. It starts only when the card nears the screen
  // (same file as the hero, so usually already cached), pauses off-screen, and is skipped on
  // data-saver / 2G connections — the wave image stays as the backdrop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return;

    const onPlaying = () => video.classList.add("is-playing");
    video.addEventListener("playing", onPlaying);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute("src")) {
            video.src = bannerVideoSrc();
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
    return () => {
      observer.disconnect();
      video.removeEventListener("playing", onPlaying);
    };
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

        <div className="wcu-grid">
          {/* Design that drives growth — dark wave card, 2 rows tall */}
          <Reveal className="wcu-card wcu-main">
            <div className="wcu-main-bg" aria-hidden="true" />
            <video ref={videoRef} className="wcu-main-video" muted loop playsInline preload="none" aria-hidden="true" />
            <div className="wcu-main-top">
              <h3 className="wcu-main-title">
                <span className="text-gradient">Design</span> that
                <br />
                drives growth
              </h3>
              <p className="wcu-main-desc">
                Websites, apps and campaigns that help businesses grow, scale and compete with confidence.
              </p>
            </div>
            <div className="wcu-main-bottom">
              <ul className="wcu-features">
                {features.map((f) => (
                  <li key={f.label}>
                    <span className="wcu-feature-icon" aria-hidden="true">
                      {f.icon}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>
              <span className="wcu-main-stat">
                <CountUp end={100} suffix="%" duration={2200} />
              </span>
            </div>
          </Reveal>

          {/* Clarity over complexity — blue card, BETTER rises over LESS */}
          <Reveal className="wcu-card wcu-blue" delay={0.08}>
            <h3 className="wcu-blue-title">
              <span aria-hidden="true">+</span> Clarity over complexity
            </h3>
            <p className="wcu-blue-desc">
              Simple, user-friendly websites and apps that customers understand instantly — no unnecessary noise.
            </p>
            <div className="wcu-words" aria-hidden="true">
              <span className="wcu-less">Less</span>
              <span className="wcu-better">Better</span>
            </div>
          </Reveal>

          {/* For ambitious teams — rising bar chart */}
          <Reveal className="wcu-card wcu-white wcu-bars-card" delay={0.16}>
            <div className="wcu-bars" aria-hidden="true">
              {bars.map((h, i) => (
                <span key={i} className="wcu-bar" style={{ "--h": `${h}%`, "--d": `${i * 0.06}s` } as React.CSSProperties} />
              ))}
            </div>
            <h3 className="wcu-card-title">For ambitious teams</h3>
          </Reveal>

          {/* Built with intention — precision area chart */}
          <Reveal className="wcu-card wcu-white wcu-area-card" delay={0.1}>
            <span className="wcu-kicker">Precision rate</span>
            <span className="wcu-area-stat">
              <CountUp end={98} suffix="%" duration={2000} />
            </span>
            <div className="wcu-area" aria-hidden="true">
              <svg viewBox="0 0 240 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wcu-area-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a27d8" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#2a27d8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path className="wcu-area-fill" d="M0 70 C 30 68, 50 64, 80 52 S 120 30, 150 28 S 200 26, 240 12 L 240 80 L 0 80 Z" fill="url(#wcu-area-fill)" />
                <path className="wcu-area-line" d="M0 70 C 30 68, 50 64, 80 52 S 120 30, 150 28 S 200 26, 240 12" pathLength={100} />
              </svg>
              <span className="wcu-area-dot" />
            </div>
            <h3 className="wcu-card-title">Built with intention</h3>
            <p className="wcu-card-desc">We believe the smallest choices make the biggest difference.</p>
          </Reveal>

          {/* Strategy > aesthetics — segment board */}
          <Reveal className="wcu-card wcu-white wcu-strategy-card" delay={0.18}>
            <div className="wcu-strategy" aria-hidden="true">
              {strategyRows.map((row, r) => (
                <div key={r} className="wcu-strategy-row">
                  {row.map(([grow, tone], i) => (
                    <span
                      key={i}
                      className={`wcu-seg wcu-seg-${tone}`}
                      style={{ "--g": grow, "--d": `${(r * 3 + i) * 0.05}s` } as React.CSSProperties}
                    />
                  ))}
                </div>
              ))}
            </div>
            <h3 className="wcu-card-title">Strategy &gt; aesthetics</h3>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
