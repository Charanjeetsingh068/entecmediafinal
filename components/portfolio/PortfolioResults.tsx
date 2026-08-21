"use client";

import { PortfolioProjectDetail } from "@/lib/portfolioData";

interface PortfolioResultsProps {
  results: PortfolioProjectDetail["results"];
}

export default function PortfolioResults({ results }: PortfolioResultsProps) {
  return (
    <section className="service-deliverables-section">
      <div className="container">
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ KEY OUTCOMES</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Measurable <span className="highlight-focus">results &amp; impact</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Data-backed business impact delivered through technical precision and strategic design.
            </p>
          </div>
        </div>

        {/* Results Bento Grid */}
        <div className="service-deliverables-grid">
          {results.map((res, idx) => (
            <div key={idx} className="deliverable-card">
              <span className="service-stat-val" style={{ textAlign: "left", marginBottom: "8px" }}>{res.value}</span>
              <h3 className="deliverable-title">{res.title}</h3>
              <p className="deliverable-desc">{res.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
