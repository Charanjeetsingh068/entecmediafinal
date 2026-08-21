"use client";

export default function AboutCTA() {
  return (
    <section className="about-cta-section" style={{ padding: "100px 0 120px", background: "#060609", color: "#ffffff" }}>
      <div className="container">
        <div className="blog-bottom-bar" style={{ borderTop: "1px dashed rgba(255, 255, 255, 0.15)", paddingTop: "50px" }}>
          <div className="blog-bottom-left">
            <h2 className="why-main-title" style={{ color: "#ffffff", fontSize: "clamp(28px, 3.5vw, 54px)", lineHeight: "1.15" }}>
              Ready to build <br /><span className="highlight-focus" style={{ color: "#2563eb" }}>something extraordinary?</span>
            </h2>
          </div>
          <div className="blog-bottom-right">
            <span className="blog-bottom-sublabel" style={{ color: "#94a3b8" }}>Let's work together</span>
            <a href="mailto:info@entecmedia.com" className="all-case-studies-button" style={{ background: "#ffffff", color: "#000000", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "16px 32px", borderRadius: "9999px", fontWeight: "700" }}>
              <span>Start a Project</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
