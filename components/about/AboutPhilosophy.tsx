"use client";

export default function AboutPhilosophy() {
  return (
    <section className="about-values-section" style={{ padding: "100px 0", background: "#f8f9fa" }}>
      <div className="container">
        <div className="why-top-layout" style={{ marginBottom: "60px" }}>
          <div className="why-col-left">
            <span className="why-section-label">+ OUR PHILOSOPHY</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Principles <span className="highlight-focus">that guide</span><br />
              every project
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              We choose clarity over clutter and depth over decoration, because strong brands deserve meaningful foundations.
            </p>
          </div>
        </div>

        <div className="why-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" }}>
          <div className="testimonial-card" style={{ height: "auto", minHeight: "260px" }}>
            <div className="testimonial-card-quote-icon">01</div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "16px 0 10px", color: "#000000" }}>
              Relentless Strategy
            </h3>
            <p className="testimonial-card-text" style={{ fontSize: "14.5px" }}>
              We dive deep into market dynamics, audience behaviors, and brand positioning to ensure every pixel serves a clear business objective.
            </p>
          </div>

          <div className="testimonial-card" style={{ height: "auto", minHeight: "260px" }}>
            <div className="testimonial-card-quote-icon">02</div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "16px 0 10px", color: "#000000" }}>
              Engineering Excellence
            </h3>
            <p className="testimonial-card-text" style={{ fontSize: "14.5px" }}>
              Built on Next.js, React, and modern Web APIs for lightning-fast speed, flawless responsiveness, and bulletproof security.
            </p>
          </div>

          <div className="testimonial-card" style={{ height: "auto", minHeight: "260px" }}>
            <div className="testimonial-card-quote-icon">03</div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "16px 0 10px", color: "#000000" }}>
              Distinctive Identity
            </h3>
            <p className="testimonial-card-text" style={{ fontSize: "14.5px" }}>
              We create bespoke brand identities, typography systems, and motion languages that leave a lasting mark in crowded industries.
            </p>
          </div>

          <div className="testimonial-card" style={{ height: "auto", minHeight: "260px" }}>
            <div className="testimonial-card-quote-icon">04</div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "16px 0 10px", color: "#000000" }}>
              Scalable Growth
            </h3>
            <p className="testimonial-card-text" style={{ fontSize: "14.5px" }}>
              Our work doesn't stop at launch. We continuously refine, optimize, and scale campaigns to maximize conversion and long-term brand equity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
