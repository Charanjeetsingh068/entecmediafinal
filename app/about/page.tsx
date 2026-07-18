export default function About() {
  return (
    <div className="about-page">
      {/* About Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-container">
            <span className="section-label">Who We Are</span>
            <h1 className="about-title text-gradient">
              Our Story. Our Vision. <br />Our Principles.
            </h1>
            <p className="about-tagline">
              We are on a mission to redefine digital interaction through creative media, engineering excellence, and storytelling that resonates.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-wrapper">
            <div className="story-visual">
              <div className="story-visual-glowing-core"></div>
            </div>
            <div className="story-content">
              <h2 className="story-lead">
                Entec Media started with a simple belief: Digital presence should feel alive, premium, and meaningful.
              </h2>
              <p className="story-text">
                Founded by a collective of media producers, engineers, and digital marketers, we noticed that many modern websites and platforms feel flat and uninspiring. We set out to change that by combining premium aesthetic design with robust, high-performance web technology.
              </p>
              <p className="story-text">
                Today, we work with high-growth businesses and creator brands to establish, scale, and optimize their media footprint. From deep web applications to multi-million view campaigns, we build digital assets that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Foundations</span>
            <h2 className="section-title">What Drives Us Every Day</h2>
            <p className="section-description">
              Our principles are embedded in every line of code we write, every pixel we design, and every campaign we launch.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-card-header">
                <div className="value-icon">🚀</div>
                <h3 className="value-title">Relentless Innovation</h3>
              </div>
              <p className="value-description">
                We push the absolute limits of technology and design to build products that are fast, modern, and stand out from the competition.
              </p>
            </div>

            <div className="value-card">
              <div className="value-card-header">
                <div className="value-icon">💎</div>
                <h3 className="value-title">Aesthetic Perfection</h3>
              </div>
              <p className="value-description">
                Every layout, visual transition, and interactive state is engineered with premium aesthetics to provide a state-of-the-art feel.
              </p>
            </div>

            <div className="value-card">
              <div className="value-card-header">
                <div className="value-icon">🎯</div>
                <h3 className="value-title">Impact First</h3>
              </div>
              <p className="value-description">
                Aesthetics are nothing without results. We ensure that our designs align with your business goals to generate real, measurable outcomes.
              </p>
            </div>

            <div className="value-card">
              <div className="value-card-header">
                <div className="value-icon">🤝</div>
                <h3 className="value-title">Absolute Integrity</h3>
              </div>
              <p className="value-description">
                We believe in transparency, clear communication, and working closely with our clients as extension of their own teams.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
