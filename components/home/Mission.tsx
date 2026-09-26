"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setCount(end), 0);
      return () => clearTimeout(timer);
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              frame = window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          frame = window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

const slides = [
  {
    text: (
      <>
        We believe in <strong>clarity over complexity</strong> and <strong>results over vanity metrics</strong> — every website, app and campaign we deliver is built to <strong>grow your business</strong>.
      </>
    ),
    avatar: "/images/founder1.png",
    name: "Team Entec Media",
    role: "Strategy & Leadership"
  },
  {
    text: (
      <>
        Our developers build <strong>fast, secure websites and mobile apps</strong> that feel natural to use and are <strong>easy for you to manage</strong>.
      </>
    ),
    avatar: "/images/team1-avatar.webp",
    name: "Development Team",
    role: "Web & App Development"
  },
  {
    text: (
      <>
        We combine <strong>SEO, Google Ads and Meta Ads</strong> with creative design to bring you <strong>quality leads and real ROI</strong>.
      </>
    ),
    avatar: "/images/team2-avatar.webp",
    name: "Marketing Team",
    role: "Digital Marketing & Ads"
  }
];

export default function Mission() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Kudos intro effect: while the panel slides up, its wordmark stays exactly on top of the banner's
  // giant logo, so the letters read as one (chrome above the panel edge, image-filled inside it).
  // Once the panel edge has passed the banner logo, the wordmark locks to the top of the panel
  // with a little breathing room. Works for every screen size because it uses live measurements.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = sectionRef.current;
      const logo = logoRef.current;
      const bannerLogo = document.querySelector<HTMLElement>(".giant-logo-img");
      if (!sec || !logo || !bannerLogo) return;
      const vh = window.innerHeight;
      // Banner logo is flush with the bottom of the fixed hero and drifts up at 0.24× (see Banner.tsx)
      const bannerTop = vh - bannerLogo.offsetHeight - Math.min(window.scrollY, vh) * 0.24;
      const panelTop = sec.getBoundingClientRect().top;
      const shift = Math.min(0, bannerTop - (panelTop + logo.offsetTop));
      logo.style.transform = `translate3d(0, ${shift}px, 0)`;
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);


  return (
    <section id="mission" ref={sectionRef} className="mission-section">
      <div className="container">

        {/* Giant ENTEC Text Visual */}
        <div className="mission-giant-title" ref={logoRef}>
          <Image
            src="/images/entec-about.webp"
            alt="ENTEC"
            width={3430}
            height={640}
            className="mission-giant-img"
            priority
          />
        </div>

        {/* Asymmetrical Layout Content */}
        <div className="mission-content-area" data-kfx="y:-120">

          {/* Center Visual Horizontal Card with absolute overlays */}
          <div className="mission-visual-card">

            {/* Overlay 1: Top Left-center Title Badge */}
            <div className="mission-title-badge">
              <h2>
                <span className="blue-text">Aligned</span> with <br />your mission
              </h2>
            </div>

            {/* Overlay 2: Top Right Intro Text */}
            <div className="mission-right-intro">
              <p>
                We partner with startups and businesses to turn ideas into websites, apps and marketing campaigns that deliver results.
              </p>
            </div>

            <Image
              src="/images/aboutimg.webp"
              alt="Our Mission Visual"
              width={3440}
              height={726}
              className="mission-visual-img"
              priority
            />

            {/* Overlay 3: Bottom Left Quote block with Slider */}
            <div className="mission-quote-card">
              <div className="mission-slider-container">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`mission-slide ${index === currentSlide ? "active" : ""}`}
                  >
                    <p className="mission-quote-text">{slide.text}</p>
                    <div className="mission-author">
                      <Image
                        src={slide.avatar}
                        alt={slide.name}
                        width={40}
                        height={40}
                        className="mission-author-avatar"
                      />
                      <div className="mission-author-info">
                        <p className="mission-author-name">{slide.name}</p>
                        <p className="mission-author-title">{slide.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overlay 4: Bottom Right Call to Action block */}
            <div className="mission-cta-card">
              <span className="mission-cta-label">MEET THE PEOPLE BEHIND THE WORK</span>
              <Link href="/contact" className="mission-collab-box">
                <span className="mission-collab-text">Let&apos;s Collaborate</span>
                <div className="mission-collab-dots">
                  <span className="mission-collab-dot"></span>
                  <span className="mission-collab-dot"></span>
                  <span className="mission-collab-dot"></span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Grid: 4 Stats Cards */}
        <div className="mission-stats-grid">

          {/* Card 1 */}
          <div className="mission-stat-card" data-kfx="y:48">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">YEARS OF EXPERIENCE</span>
            </div>
            <h3 className="stat-value">
              <CountUp end={20} suffix="+" />
            </h3>
            <p className="stat-desc">Built on years of real-world projects.</p>
          </div>

          {/* Card 2 */}
          <div className="mission-stat-card" data-kfx="y:72">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">PROJECTS DELIVERED</span>
            </div>
            <h3 className="stat-value">
              <CountUp end={100} suffix="+" />
            </h3>
            <p className="stat-desc">Websites, apps and campaigns launched.</p>
          </div>

          {/* Card 3 */}
          <div className="mission-stat-card" data-kfx="y:96">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">CLIENT RETENTION RATE</span>
            </div>
            <h3 className="stat-value">
              <CountUp end={98} suffix="%" />
            </h3>
            <p className="stat-desc">Clients who stay, project after project.</p>
          </div>

          {/* Card 4 */}
          <div className="mission-stat-card" data-kfx="y:120">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">DIGITAL SERVICES</span>
            </div>
            <h3 className="stat-value">
              <CountUp end={10} suffix="+" />
            </h3>
            <p className="stat-desc">Design, development &amp; marketing under one roof.</p>
          </div>

        </div>

      </div>
    </section>
  );
}
