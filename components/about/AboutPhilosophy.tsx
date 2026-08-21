"use client";

export default function AboutPhilosophy() {
  return (
    <section className="about-values-section">
      <div className="container">
        <div className="why-top-layout about-section-top-mb60">
          <div className="why-col-left">
            <span className="why-section-label">+ VISION & MISSION</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Driven by vision, <span className="highlight-focus">guided by values</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              At Entec Media, our core purpose and principles shape every decision, strategy, and line of code we craft for our global partners.
            </p>
          </div>
        </div>

        <div className="about-cards-grid">
          <div className="testimonial-card about-card-auto-height">
            <div className="testimonial-card-quote-icon">01</div>
            <h3 className="about-card-title">
              Our Vision
            </h3>
            <p className="testimonial-card-text about-card-desc">
              To be the global benchmark for creative technology agencies—building digital experiences that inspire audiences, elevate brands, and define industry standards.
            </p>
          </div>

          <div className="testimonial-card about-card-auto-height">
            <div className="testimonial-card-quote-icon">02</div>
            <h3 className="about-card-title">
              Our Mission
            </h3>
            <p className="testimonial-card-text about-card-desc">
              To empower ambitious businesses through bespoke brand identities, cutting-edge Next.js engineering, and data-backed growth strategies that deliver real-world ROI.
            </p>
          </div>

          <div className="testimonial-card about-card-auto-height">
            <div className="testimonial-card-quote-icon">03</div>
            <h3 className="about-card-title">
              Core Values
            </h3>
            <p className="testimonial-card-text about-card-desc">
              Clarity over clutter, depth over decoration, and uncompromised quality. We hold ourselves to relentless standards in design precision and performance speed.
            </p>
          </div>

          <div className="testimonial-card about-card-auto-height">
            <div className="testimonial-card-quote-icon">04</div>
            <h3 className="about-card-title">
              Culture & Impact
            </h3>
            <p className="testimonial-card-text about-card-desc">
              A collaborative, transparent environment where top-tier strategists, designers, and engineers work as true partners with every client we serve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
