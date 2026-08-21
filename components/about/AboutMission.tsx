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
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [end, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

const slides = [
  {
    text: (
      <>
        We believe in <strong>clarity over complexity</strong>, and <strong>creativity over conformity</strong>, because the best work is both <strong>simple and distinctive</strong>.
      </>
    ),
    avatar: "/images/founder1.png",
    name: "Kate Lee Cobe",
    role: "Founder, ENTEC"
  },
  {
    text: (
      <>
        Our goal is to build <strong>digital products</strong> that feel natural, run fast, and leave a <strong>lasting impression</strong> on your users.
      </>
    ),
    avatar: "/images/team1.png",
    name: "Marcus Vance",
    role: "Lead Architect, ENTEC"
  },
  {
    text: (
      <>
        We merge <strong>strategy, design, and technology</strong> to help modern brands <strong>scale and win</strong> in their industries.
      </>
    ),
    avatar: "/images/team2.png",
    name: "Sarah Jenkins",
    role: "Strategy Director, ENTEC"
  }
];

export default function AboutMission() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05 }
    );

    const currentSec = sectionRef.current;
    if (currentSec) {
      observer.observe(currentSec);
    }

    return () => {
      if (currentSec) {
        observer.unobserve(currentSec);
      }
    };
  }, []);

  return (
    <section id="about-mission" ref={sectionRef} className="mission-section">
      <div className="container">

        {/* Asymmetrical Layout Content */}
        <div className={`mission-content-area reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.3s" }}>

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
                We work closely with our clients to turn ideas into clear, compelling brands and digital experiences.
              </p>
            </div>

            <Image
              src="/images/aboutimg.png"
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
                        <h4 className="mission-author-name">{slide.name}</h4>
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
              <Link href="#contact" className="mission-collab-box">
                <span className="mission-collab-text">Let's Collaborate</span>
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
          <div className={`mission-stat-card reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.4s" }}>
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
          <div className={`mission-stat-card reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.5s" }}>
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">BRANDS TRANSFORMED</span>
            </div>
            <h3 className="stat-value">
              <CountUp end={100} suffix="+" />
            </h3>
            <p className="stat-desc">Helping brands evolve and stand out.</p>
          </div>

          {/* Card 3 */}
          <div className={`mission-stat-card reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.6s" }}>
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
          <div className={`mission-stat-card reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.7s" }}>
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">AWARDS & RECOGNITIONS</span>
            </div>
            <h3 className="stat-value">
              <CountUp end={30} suffix="+" />
            </h3>
            <p className="stat-desc">Industry recognition for our work.</p>
          </div>

        </div>

      </div>
    </section>
  );
}
