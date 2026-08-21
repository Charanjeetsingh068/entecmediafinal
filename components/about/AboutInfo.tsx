"use client";

import Image from "next/image";

export default function AboutInfo() {
  return (
    <section className="about-info-section">
      <div className="container">
        {/* Top Header Layout - Tailored to Entec Media */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ ABOUT ENTEC MEDIA</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Empowering brands <span className="highlight-focus">through creative</span><br />
              & digital innovation
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Entec Media is a digital-first creative agency building high-performance websites, distinctive brand identities, and scalable growth engines for ambitious brands worldwide.
            </p>
          </div>
        </div>

        {/* Full Width 500px Image Section */}
        <div className="about-info-image-card">
          <Image
            src="/images/aboutbac.png"
            alt="About Entec Media Visual"
            fill
            sizes="100vw"
            className="about-info-img"
            priority
          />
        </div>

        {/* Information Grid Below Image - Specific Entec Media Services & Values */}
        <div className="about-info-bottom-wrapper">
          <div className="about-info-bottom-grid">
            <div className="about-info-bottom-card">
              <div className="about-info-card-number">01 / CREATIVE & BRANDING</div>
              <h3 className="about-info-card-title">Bespoke Brand Identity</h3>
              <p className="about-info-card-desc">
                We craft memorable visual identities, logo systems, typography, and brand guidelines that set Entec Media clients apart in competitive markets.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">02 / HIGH-PERFORMANCE WEB</div>
              <h3 className="about-info-card-title">Next.js & React Engineering</h3>
              <p className="about-info-card-desc">
                From custom marketing sites to enterprise web applications, Entec Media builds lightning-fast, SEO-optimized, and responsive digital platforms.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">03 / DIGITAL GROWTH & MEDIA</div>
              <h3 className="about-info-card-title">Scalable Growth & Media</h3>
              <p className="about-info-card-desc">
                We drive long-term business growth through performance marketing, content creation, and data-driven digital campaign strategies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
