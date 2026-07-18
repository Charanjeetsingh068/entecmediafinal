"use client";

import Image from "next/image";
import Link from "next/link";

export default function Mission() {
  return (
    <section id="mission" className="mission-section">
      <div className="figma-container">

        {/* Giant ENTEC Text Visual */}
        <div className="mission-giant-title">
          <Image
            src="/images/entec-about.png"
            alt="ENTEC"
            width={3430}
            height={640}
            className="mission-giant-img"
            priority
          />
        </div>

        {/* Asymmetrical Layout Content */}
        <div className="mission-content-area">

          {/* Top Row: Left-center (Title Badge) & Right (Text Intro) */}
          <div className="mission-top-row">
            <div className="mission-title-badge">
              <h2>
                <span className="blue-text">Aligned</span> with <br />your mission
              </h2>
            </div>

            <div className="mission-right-intro">
              <p>
                We work closely with our clients to turn ideas into clear, compelling brands and digital experiences.
              </p>
            </div>
          </div>

          {/* Center Visual Horizontal Card */}
          <div className="mission-visual-card">
            <Image
              src="/images/aboutimg.png"
              alt="Our Mission Visual"
              width={3440}
              height={726}
              className="mission-visual-img"
            />

            {/* Overlay 1: Bottom Left Quote block */}
            <div className="mission-quote-card">
              <p className="mission-quote-text">
                We believe in <strong>clarity over complexity</strong>, and <strong>creativity over conformity</strong>, because the best work is both <strong>simple and distinctive</strong>.
              </p>
              <div className="mission-author">
                <Image
                  src="/images/founder1.png"
                  alt="Kate Lee Cobe"
                  width={40}
                  height={40}
                  className="mission-author-avatar"
                />
                <div className="mission-author-info">
                  <h4 className="mission-author-name">Kate Lee Cobe</h4>
                  <p className="mission-author-title">Founder, ENTEC</p>
                </div>
              </div>
            </div>

            {/* Overlay 2: Bottom Right Call to Action block */}
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
          <div className="mission-stat-card">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">YEARS OF EXPERIENCE</span>
            </div>
            <h3 className="stat-value">20+</h3>
            <p className="stat-desc">Built on years of real-world projects.</p>
          </div>

          {/* Card 2 */}
          <div className="mission-stat-card">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">BRANDS TRANSFORMED</span>
            </div>
            <h3 className="stat-value">100+</h3>
            <p className="stat-desc">Helping brands evolve and stand out.</p>
          </div>

          {/* Card 3 */}
          <div className="mission-stat-card">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">CLIENT RETENTION RATE</span>
            </div>
            <h3 className="stat-value">98%</h3>
            <p className="stat-desc">Clients who stay, project after project.</p>
          </div>

          {/* Card 4 */}
          <div className="mission-stat-card">
            <div className="stat-card-header">
              <Image src="/images/years.png" alt="" width={18} height={6} className="stat-pill-icon" />
              <span className="stat-label">AWARDS & RECOGNITIONS</span>
            </div>
            <h3 className="stat-value">30+</h3>
            <p className="stat-desc">Industry recognition for our work.</p>
          </div>

        </div>

      </div>
    </section>
  );
}
