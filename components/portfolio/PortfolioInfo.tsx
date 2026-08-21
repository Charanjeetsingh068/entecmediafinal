"use client";

import Image from "next/image";

export default function PortfolioInfo() {
  return (
    <section className="about-info-section">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ OUR PORTFOLIO</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Selected works &amp; <span className="highlight-focus">digital case studies</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Explore our portfolio of high-performance websites, custom web applications, bespoke brand identities, and ROI-focused digital marketing campaigns.
            </p>
          </div>
        </div>

        {/* Full Width 500px Image Section */}
        <div className="about-info-image-card">
          <Image
            src="/images/aboutbac.png"
            alt="Entec Media Portfolio Showcase"
            fill
            sizes="100vw"
            className="about-info-img"
            priority
          />
        </div>

        {/* Information Grid Below Image */}
        <div className="about-info-bottom-wrapper">
          <div className="about-info-bottom-grid">
            <div className="about-info-bottom-card">
              <div className="about-info-card-number">01 / IT &amp; WEB DEVELOPMENT</div>
              <h3 className="about-info-card-title">WordPress &amp; React.js Engineering</h3>
              <p className="about-info-card-desc">
                Building custom WordPress portals and Next.js / React.js web applications with lightning-fast performance and clean component architecture.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">02 / UI/UX &amp; GRAPHIC DESIGN</div>
              <h3 className="about-info-card-title">Design Systems &amp; Visuals</h3>
              <p className="about-info-card-desc">
                Crafting human-centered UI/UX prototypes, responsive web layouts, brand identity guidelines, and high-impact graphic design assets.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">03 / DIGITAL MARKETING</div>
              <h3 className="about-info-card-title">SEO, Google &amp; Meta Ads</h3>
              <p className="about-info-card-desc">
                Accelerating business revenue through organic search engine optimization (SEO), targeted Google Ads campaigns, and Meta ad strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
