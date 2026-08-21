"use client";

import Image from "next/image";

export default function AboutTeam() {
  return (
    <section className="about-team-section" style={{ padding: "100px 0", background: "#ffffff" }}>
      <div className="container">
        <div className="why-top-layout" style={{ marginBottom: "60px" }}>
          <div className="why-col-left">
            <span className="why-section-label">+ THE TEAM</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Meet <span className="highlight-focus">the people</span><br />
              behind the work
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              A passionate group of strategists, engineers, designers, and media producers working together seamlessly.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "30px" }}>
          <div className="blog-card" style={{ background: "#f8f9fa", padding: "24px", borderRadius: "20px" }}>
            <div style={{ position: "relative", width: "100%", height: "280px", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
              <Image src="/images/founder1.png" alt="Kate Lee Cobe" fill style={{ objectFit: "cover" }} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#000", margin: "0 0 4px" }}>Kate Lee Cobe</h3>
            <p style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600", margin: "0 0 12px" }}>Founder & Creative Director</p>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
              Visionary creative leading brand strategy, aesthetic excellence, and strategic partnership growth across global accounts.
            </p>
          </div>

          <div className="blog-card" style={{ background: "#f8f9fa", padding: "24px", borderRadius: "20px" }}>
            <div style={{ position: "relative", width: "100%", height: "280px", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
              <Image src="/images/team1.png" alt="Marcus Vance" fill style={{ objectFit: "cover" }} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#000", margin: "0 0 4px" }}>Marcus Vance</h3>
            <p style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600", margin: "0 0 12px" }}>Lead Systems Architect</p>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
              Pioneer in modern web development, microservices, and performance optimization for high-scale enterprise platforms.
            </p>
          </div>

          <div className="blog-card" style={{ background: "#f8f9fa", padding: "24px", borderRadius: "20px" }}>
            <div style={{ position: "relative", width: "100%", height: "280px", borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
              <Image src="/images/team2.png" alt="Sarah Jenkins" fill style={{ objectFit: "cover" }} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#000", margin: "0 0 4px" }}>Sarah Jenkins</h3>
            <p style={{ fontSize: "13px", color: "#2563eb", fontWeight: "600", margin: "0 0 12px" }}>Strategy & Growth Lead</p>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5", margin: 0 }}>
              Specializes in digital marketing ecosystems, content strategy, and multi-channel audience engagement campaigns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
