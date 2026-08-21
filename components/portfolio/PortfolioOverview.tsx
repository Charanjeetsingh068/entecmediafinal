"use client";

import { PortfolioProjectDetail } from "@/lib/portfolioData";

interface PortfolioOverviewProps {
  project: PortfolioProjectDetail;
}

export default function PortfolioOverview({ project }: PortfolioOverviewProps) {
  return (
    <section className="service-overview-section">
      <div className="container">
        {/* Challenge Block */}
        <div className="why-top-layout about-section-top-mb60">
          <div className="why-col-left">
            <span className="why-section-label">+ THE CHALLENGE</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">{project.challengeTitle}</h2>
          </div>
          <div className="why-col-right">
            {project.challengeDesc.map((p, idx) => (
              <p key={idx} className="why-header-desc service-overview-p">{p}</p>
            ))}
          </div>
        </div>

        {/* Solution Block */}
        <div className="why-top-layout" style={{ marginTop: "60px" }}>
          <div className="why-col-left">
            <span className="why-section-label">+ OUR SOLUTION</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">{project.solutionTitle}</h2>
          </div>
          <div className="why-col-right">
            {project.solutionDesc.map((p, idx) => (
              <p key={idx} className="why-header-desc service-overview-p">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
