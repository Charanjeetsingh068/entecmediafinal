"use client";

import Image from "next/image";

const teamMembers = [
  {
    id: 1,
    name: "Kate Lee Cobe",
    role: "Founder, ENTEC",
    image: "/images/founder1.png",
    twitter: "https://x.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: 2,
    name: "Leo Martin",
    role: "Head of Design",
    image: "/images/team1.png",
    twitter: "https://x.com",
    linkedin: "https://linkedin.com",
  },
  {
    id: 3,
    name: "Sienna Cruz",
    role: "Brand Designer",
    image: "/images/team2.png",
    twitter: "https://x.com",
    linkedin: "https://linkedin.com",
  },
];

export default function AboutTeam() {
  return (
    <section className="about-team-section">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb60">
          <div className="why-col-left">
            <span className="why-section-label">+ TEAM</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Small team.<br />
              Big standards.
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Specialists working closely to transform ideas into meaningful, measurable outcomes.
            </p>
          </div>
        </div>

        {/* Team Cards Grid (3 Columns) */}
        <div className="team-v2-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card-v2">
              <div className="team-card-v2-img-box">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="team-card-v2-img"
                />
              </div>

              <div className="team-card-v2-footer">
                <div className="team-card-v2-info">
                  <h4 className="team-card-v2-name">{member.name}</h4>
                  <p className="team-card-v2-role">{member.role}</p>
                </div>
                <div className="team-card-v2-socials">
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-social-icon"
                    title="X (Twitter)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-social-icon"
                    title="LinkedIn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
