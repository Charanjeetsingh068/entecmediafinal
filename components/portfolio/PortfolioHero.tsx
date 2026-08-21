"use client";

import Image from "next/image";
import Link from "next/link";
import { PortfolioProjectDetail } from "@/lib/portfolioData";

interface PortfolioHeroProps {
  project: PortfolioProjectDetail;
}

export default function PortfolioHero({ project }: PortfolioHeroProps) {
  return (
    <section className="portfolio-hero-section">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="service-breadcrumbs">
          <Link href="/" className="crumb-link">Home</Link>
          <span className="crumb-sep">/</span>
          <Link href="/portfolio" className="crumb-link">Portfolio</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{project.client}</span>
        </div>

        {/* Hero Meta & Title */}
        <div className="portfolio-hero-content">
          <div className="portfolio-hero-tags">
            <span className="why-section-label">+ {project.category.toUpperCase()}</span>
            <span className="portfolio-hero-metric-badge">{project.metric}</span>
          </div>

          <h1 className="service-hero-title">{project.title}</h1>
          <p className="service-hero-subtitle">{project.heroTagline}</p>
          <p className="service-hero-desc">{project.heroDesc}</p>

          {/* Project Details Strip */}
          <div className="portfolio-meta-strip">
            <div className="meta-strip-item">
              <span className="meta-strip-label">CLIENT</span>
              <span className="meta-strip-value">{project.client}</span>
            </div>
            <div className="meta-strip-item">
              <span className="meta-strip-label">YEAR</span>
              <span className="meta-strip-value">{project.year}</span>
            </div>
            <div className="meta-strip-item">
              <span className="meta-strip-label">DURATION</span>
              <span className="meta-strip-value">{project.duration}</span>
            </div>
            <div className="meta-strip-item">
              <span className="meta-strip-label">TECHNOLOGY</span>
              <div className="meta-strip-tags">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="meta-tag-pill">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Box */}
        <div className="service-hero-img-box">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="100vw"
            className="service-hero-img"
            priority
          />
        </div>
      </div>
    </section>
  );
}
