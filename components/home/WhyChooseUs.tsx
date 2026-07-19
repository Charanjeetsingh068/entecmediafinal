"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import team1Img from "@/public/images/team1.png";
import team2Img from "@/public/images/team2.png";
import team3Img from "@/public/images/team3.png";
import team4Img from "@/public/images/team4.png";

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

export default function WhyChooseUs() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [gridProgress, setGridProgress] = useState(0);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  
  const targetGridProgress = useRef(0);
  const currentGridProgress = useRef(0);
  
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Text scroll calculation
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const start = windowHeight * 0.85;
        const end = windowHeight * 0.30;

        const total = start - end;
        const current = start - rect.top;

        const rawProgress = current / total;
        targetProgress.current = Math.max(0, Math.min(1, rawProgress));
      }

      // 2. Grid scroll calculation (for bar charts, strategy rows, etc.)
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Start animating grid when its top enters 95% of viewport
        // Finish animating grid when its top reaches 20% of viewport
        const start = windowHeight * 0.95;
        const end = windowHeight * 0.20;

        const total = start - end;
        const current = start - rect.top;

        const rawProgress = current / total;
        targetGridProgress.current = Math.max(0, Math.min(1, rawProgress));
      }
    };

    const updateAnimation = () => {
      let needsNextFrame = false;

      // Smooth text highlight progress
      const diffText = targetProgress.current - currentProgress.current;
      if (Math.abs(diffText) > 0.0005) {
        currentProgress.current += diffText * 0.08;
        setScrollProgress(currentProgress.current);
        needsNextFrame = true;
      }

      // Smooth grid animation progress
      const diffGrid = targetGridProgress.current - currentGridProgress.current;
      if (Math.abs(diffGrid) > 0.0005) {
        currentGridProgress.current += diffGrid * 0.08;
        setGridProgress(currentGridProgress.current);
        needsNextFrame = true;
      }

      animationFrameId.current = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animationFrameId.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const paragraphText = "At the end of the day, we’re here to help your brand grow. That means thinking beyond visuals, designing with purpose, and delivering work that supports your goals, your team, and your future plans.";
  const words = paragraphText.split(" ");

  // Max Heights for Bar Chart (9 bars)
  const maxBarHeights = [15, 25, 35, 46, 58, 70, 82, 92, 100];

  // Watermark text translations
  const translateXBetter = -25 + gridProgress * 25;
  const translateXLess = 25 - gridProgress * 25;

  // 3D overlapping card calculations
  const rotateX = 20 - gridProgress * 8;
  const rotateY = -20 + gridProgress * 8;
  const translateZFront = 15 + gridProgress * 25;
  const translateZBack = -15 - gridProgress * 25;

  // Strategy timeline rows
  const strategyRows = [
    {
      blocks: [
        { offset: "0%", width: 60, opacity: 0.15, highlight: false },
        { offset: "75%", width: 25, opacity: 0.3, highlight: false }
      ]
    },
    {
      blocks: [
        { offset: "20%", width: 35, opacity: 0.25, highlight: false },
        { offset: "65%", width: 35, opacity: 0.5, highlight: false }
      ]
    },
    {
      blocks: [
        { offset: "10%", width: 45, opacity: 0.4, highlight: false },
        { offset: "60%", width: 40, opacity: 1, highlight: true } // Highlighted blue block
      ]
    },
    {
      blocks: [
        { offset: "30%", width: 40, opacity: 0.6, highlight: false }
      ]
    }
  ];

  return (
    <section id="why-choose-us" ref={sectionRef} className="why-choose-us-section">
      <div className="container">
        {/* Why Choose Us Section Top Layout (3 columns) */}
        <div className={`why-top-layout reveal-item ${isRevealed ? "revealed" : ""}`}>
          {/* Left Column: Label + Rating Card */}
          <div className="why-col-left">
            <span className="why-section-label">+ WHY CHOOSE US?</span>
            
            <div className="why-rating-card">
              <div className="why-avatar-group">
                <Image src={team1Img} alt="Team member 1" className="why-avatar-bubble" />
                <Image src={team2Img} alt="Team member 2" className="why-avatar-bubble" />
                <Image src={team3Img} alt="Team member 3" className="why-avatar-bubble" />
                <Image src={team4Img} alt="Team member 4" className="why-avatar-bubble" />
              </div>
              <div className="why-rating-info">
                <div className="why-rating-stars-row">
                  <span className="why-rating-stars">★★★★★</span>
                  <span className="why-rating-val">4.9/5</span>
                </div>
                <p className="why-rating-label">TRUSTED BY TOP BRANDS</p>
              </div>
            </div>
          </div>

          {/* Center Column: Heading + Highlight Paragraph */}
          <div className="why-col-center">
            <h2 className="why-main-title">
              <span className="text-gradient">Positioned</span> for<br />
              lasting success
            </h2>
            
            <p ref={textRef} className="why-middle-text">
              {words.map((word, idx) => {
                const threshold = idx / words.length;
                const isActive = scrollProgress > threshold;
                return (
                  <span key={idx} className="why-word-wrapper">
                    <span className={`why-word ${isActive ? "active" : ""}`}>
                      {word}
                    </span>
                    {" "}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Right Column: Sidebar Description */}
          <div className="why-col-right">
            <p className="why-header-desc">
              We focus on outcomes, not just aesthetics, helping brands grow with clarity and purpose.
            </p>
          </div>
        </div>

        {/* Bottom Feature Grid */}
        <div className="why-grid" ref={gridRef}>
          {/* Card 1: Design that drives growth (Span 2 rows, Black bg, Video) */}
          <div className={`why-card why-card-video reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.3s" }}>
            <video autoPlay loop muted playsInline className="why-card-video-bg">
              <source src="/images/homebanner.mp4" type="video/mp4" />
            </video>
            <div className="why-card-video-overlay"></div>
            
            <div className="why-card-video-content">
              <div>
                <h3 className="why-card-video-title">
                  <span className="text-gradient">Design</span> that<br />drives growth
                </h3>
                <p className="why-card-video-desc">
                  We focus on creating work that helps brands grow, scale, and compete with confidence.
                </p>
              </div>
              
              <div className="why-card-video-footer">
                <ul className="why-card-video-features">
                  <li>
                    <span className="why-feature-dot">☉</span> Clarity
                  </li>
                  <li>
                    <span className="why-feature-dot">✦</span> Performance
                  </li>
                  <li>
                    <span className="why-feature-dot">◲</span> Scale
                  </li>
                </ul>
                <div className="why-card-video-number">
                  <CountUp end={100} suffix="%" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Clarity over complexity (Blue bg, Better/Less) */}
          <div className={`why-card why-card-blue reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.4s" }}>
            <div className="why-card-blue-header">
              <span className="why-card-blue-icon">✦</span>
              <h4 className="why-card-blue-title">Clarity over complexity</h4>
            </div>
            <p className="why-card-blue-desc">
              We believe the best solutions are clear, focused, and free from unnecessary noise or distraction.
            </p>
            <div className="why-card-blue-watermark">
              <div className="watermark-better" style={{ transform: `translateX(${translateXBetter}px)` }}>BETTER</div>
              <div className="watermark-less" style={{ transform: `translateX(${translateXLess}px)` }}>LESS</div>
            </div>
          </div>

          {/* Card 3: For ambitious teams (White bg, Bar chart) */}
          <div className={`why-card why-card-white why-card-chart reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.5s" }}>
            <div className="why-chart-container">
              <div className="why-bar-chart">
                {maxBarHeights.map((maxH, idx) => (
                  <div 
                    key={idx} 
                    className={`why-bar ${isRevealed ? "animate-bar" : ""}`} 
                    style={{ 
                      '--bar-height': `${maxH}%`,
                      '--delay': `${idx * 0.08}s`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            </div>
            <div className="why-card-white-footer">
              <h4 className="why-card-white-title">For ambitious teams</h4>
            </div>
          </div>

          {/* Card 4: Built with intention (White bg, Interactive Area Chart Stat Widget) */}
          <div className={`why-card why-card-white why-card-area-chart reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.6s" }}>
            <div className="why-area-chart-header">
              <div className="why-area-chart-label">
                <span className="why-area-label-dot"></span> PRECISION RATE
              </div>
              <div className="why-area-chart-value">
                <CountUp end={98} suffix="%" />
              </div>
            </div>
            
            <div className="why-area-chart-container">
              <div className="why-grid-bg"></div>
              <svg className="why-svg-area-chart" viewBox="0 0 260 80" preserveAspectRatio="none">
                <defs>
                  {/* Line Gradient */}
                  <linearGradient id="areaLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1F88F5" />
                    <stop offset="100%" stopColor="#2A27D8" />
                  </linearGradient>
                  {/* Area Fill Gradient */}
                  <linearGradient id="areaFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(42, 39, 216, 0.22)" />
                    <stop offset="100%" stopColor="rgba(42, 39, 216, 0.0)" />
                  </linearGradient>
                </defs>

                {/* Shaded Area */}
                <path 
                  className={`why-area-path ${isRevealed ? "animate-area-fill" : ""}`}
                  d="M 0 70 Q 50 65 90 45 T 180 25 T 265 8 L 265 80 L 0 80 Z" 
                  fill="url(#areaFillGrad)"
                />

                {/* Glowing Stroke Line */}
                <path 
                  className={`why-area-line-path ${isRevealed ? "animate-area-line" : ""}`}
                  d="M 0 70 Q 50 65 90 45 T 180 25 T 265 8" 
                  fill="none" 
                  stroke="url(#areaLineGrad)" 
                  strokeWidth="3"
                />
              </svg>
            </div>
            
            <div className="why-card-white-footer why-area-footer">
              <h4 className="why-card-white-title">Built with intention</h4>
              <p className="why-card-white-desc">
                We believe the smallest choices make the biggest difference.
              </p>
            </div>
          </div>

          {/* Card 5: Strategy > aesthetics (White bg, Gantt-timeline blocks) */}
          <div className={`why-card why-card-white why-card-strategy reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.7s" }}>
            <div className="why-strategy-container">
              {strategyRows.map((row, rowIdx) => (
                <div key={rowIdx} className="why-strategy-row">
                  {row.blocks.map((block, blockIdx) => {
                    const delay = (rowIdx * 0.08) + (blockIdx * 0.04);
                    return (
                      <div 
                        key={blockIdx}
                        className={`why-strat-block ${block.highlight ? "highlighted" : ""} ${isRevealed ? "animate-strat" : ""}`}
                        style={{
                          left: block.offset,
                          opacity: block.highlight ? 1 : block.opacity,
                          '--block-width': `${block.width}%`,
                          '--delay': `${delay}s`
                        } as React.CSSProperties}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="why-card-white-footer">
              <h4 className="why-card-white-title">Strategy &gt; aesthetics</h4>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
