"use client";

import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="about-info-section" style={{ paddingTop: "100px" }}>
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ GET IN TOUCH</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Let&apos;s start a conversation <br />
              <span className="highlight-focus">about your next big idea</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Whether you have a specific project inquiry, need a strategic website redesign, or want to discuss digital growth campaigns, we&apos;re ready to partner with you.
            </p>
          </div>
        </div>

        {/* Full Width 500px Image Section */}
        <div className="about-info-image-card">
          <Image
            src="/images/aboutbac.png"
            alt="Entec Media Contact HQ Visual"
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
              <div className="about-info-card-number">01 / DIRECT CONTACT</div>
              <h3 className="about-info-card-title">hello@entecmedia.com</h3>
              <p className="about-info-card-desc">
                Drop us an email anytime. Phone: +91 98765 43210. Our strategy team monitors inquiries continuously.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">02 / OFFICE &amp; HOURS</div>
              <h3 className="about-info-card-title">Global Remote &amp; HQ</h3>
              <p className="about-info-card-desc">
                Operating Monday through Friday from 9:00 AM to 7:00 PM IST. We serve clients across global timezones.
              </p>
            </div>

            <div className="about-info-bottom-card">
              <div className="about-info-card-number">03 / CONFIDENTIALITY</div>
              <h3 className="about-info-card-title">24-Hour Response &amp; NDA</h3>
              <p className="about-info-card-desc">
                Guaranteed email response within 24 business hours. We execute mutual non-disclosure agreements upon request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
