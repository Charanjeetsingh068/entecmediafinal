export default function Services() {
  return (
    <section id="services" className="services-section">
      <div className="figma-container">
        <div className="section-header">
          <span className="section-label">Capabilities</span>
          <h2 className="section-title">Designed for Growth & Impact</h2>
          <p className="section-description">
            We deliver tailored strategies and digital solutions that align with your goals and position your brand at the absolute top of your industry.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3 className="service-title">Digital Marketing</h3>
            <p className="service-text">
              Targeted campaigns, SEO optimization, and data-driven growth strategies that put your brand directly in front of your ideal audience.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🎬</div>
            <h3 className="service-title">Video & Media Production</h3>
            <p className="service-text">
              Stunning cinematic videography, high-quality audio engineering, and storytelling that captivates and connects with viewers globally.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">✨</div>
            <h3 className="service-title">UI/UX & Web Engineering</h3>
            <p className="service-text">
              Developing responsive, fast, and secure web applications with highly refined aesthetics and interactive user journeys.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
