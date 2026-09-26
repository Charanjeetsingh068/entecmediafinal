import type { ReactNode } from "react";

export type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  label: string;
  title: string;
  highlight: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export default function LegalPage({
  label,
  title,
  highlight,
  intro,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <section className="legal-page-section">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ {label}</span>
          </div>
          <div className="why-col-center">
            <h1 className="why-main-title">
              {title} <br />
              <span className="highlight-focus">{highlight}</span>
            </h1>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">{intro}</p>
          </div>
        </div>

        <div className="legal-content">
          <p className="legal-updated">Last updated: {lastUpdated}</p>
          {sections.map((section, index) => (
            <div key={section.title} className="legal-block">
              <h2 className="legal-block-title">
                <span className="legal-block-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <div className="legal-block-body">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
