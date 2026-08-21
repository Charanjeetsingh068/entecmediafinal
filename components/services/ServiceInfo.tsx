"use client";

import Image from "next/image";

export default function ServiceInfo() {
  return (
    <section className="about-info-section">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ OUR SERVICES</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Comprehensive solutions <span className="highlight-focus">tailored for</span><br />
              digital growth
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              At Entec Media, we offer end-to-end creative, engineering, and strategic marketing services to help modern brands scale and win in competitive industries.
            </p>
          </div>
        </div>

        {/* Full Width 500px Image Section */}
        <div className="about-info-image-card">
          <Image
            src="/images/aboutbac.png"
            alt="Entec Media Services Visual"
            fill
            sizes="100vw"
            className="about-info-img"
            priority
          />
        </div>

        {/* Information Grid Below Image - Key Service Highlights */}
        <div className="about-info-bottom-wrapper">
          <div className="about-info-bottom-grid">
            <div className="about-info-bottom-card">
              <div className="about-info-card-number">01 / BRAND & IDENTITY</div>
              <h3 className="about-info-card-title">Bespoke Brand Strategy</h3>
              <p className="about-info-card-desc">
                Crafting memorable brand identities, logo systems, design guidelines, and positioning strategies that build trust and market distinction.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">02 / WEB & ENGINEERING</div>
              <h3 className="about-info-card-title">Next.js & Full-Stack Apps</h3>
              <p className="about-info-card-desc">
                Developing high-speed, SEO-optimized marketing sites, custom web applications, and seamless e-commerce platforms built for conversion.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">03 / DIGITAL MARKETING</div>
              <h3 className="about-info-card-title">Performance & Growth</h3>
              <p className="about-info-card-desc">
                Accelerating business reach with targeted media campaigns, social media management, content creation, and search engine dominance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
