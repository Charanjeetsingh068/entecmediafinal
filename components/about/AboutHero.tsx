"use client";

import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="about-hero-section" style={{ paddingBottom: "40px" }}>
      <div className="container">
        <div className="why-top-layout" style={{ marginBottom: "50px" }}>
          <div className="why-col-left">
            <span className="why-section-label">+ WHO WE ARE</span>
          </div>
          <div className="why-col-center">
            <h1 className="why-main-title" style={{ fontSize: "clamp(36px, 4.5vw, 68px)", lineHeight: "1.1" }}>
              Architects of <span className="highlight-focus">digital identity</span> & growth.
            </h1>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc" style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: "1.6" }}>
              We are a modern media & digital agency dedicated to transforming ambitious ideas into market-defining brands through strategy, engineering, and visual design.
            </p>
          </div>
        </div>

        {/* Hero Digital Visual Showcase Card */}
        <div className="mission-visual-card">
          <Image
            src="/images/aboutimg.png"
            alt="Entec About Visual"
            width={3440}
            height={726}
            className="mission-visual-img"
            priority
          />
        </div>
      </div>
    </section>
  );
}
