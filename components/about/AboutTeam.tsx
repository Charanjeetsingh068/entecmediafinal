import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { teamMembers } from "@/lib/teamData";
import SectionHeader from "@/components/shared/SectionHeader";
import KButton from "@/components/shared/KButton";
import Reveal from "@/components/shared/Reveal";

const linkedinUrl = siteConfig.socialLinks.find((l) => l.label === "LinkedIn")?.href ?? "#";
const instagramUrl = siteConfig.socialLinks.find((l) => l.label === "Instagram")?.href ?? "#";

interface AboutTeamProps {
  /** "about" shows the quote overlay + careers CTA, "default" links back to the about page */
  variant?: "about" | "default";
}

export default function AboutTeam({ variant = "default" }: AboutTeamProps) {
  return (
    <section className="k-section about-team-section" data-theme="light">
      <div className="container">
        <SectionHeader
          layout="left"
          label="+ TEAM"
          title={
            <>
              <span className="k-muted">Small team.</span>
              <br />
              Big standards.
            </>
          }
          desc="Designers, developers and digital marketers working closely to turn ideas into measurable outcomes."
        />

        <div className="team-v2-grid">
          {teamMembers.map((member, idx) => (
            <Reveal key={member.name} className="team-card-v2" delay={idx * 0.08}>
              <div className="team-card-v2-img-box">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 25vw"
                  className="team-card-v2-img"
                />
                {variant === "about" && <p className="team-card-v2-quote">&ldquo;{member.quote}&rdquo;</p>}
              </div>
              <div className="team-card-v2-footer">
                <div className="team-card-v2-info">
                  <h3 className="team-card-v2-name">{member.name}</h3>
                  <p className="team-card-v2-role">{member.role}</p>
                </div>
                <div className="team-card-v2-socials">
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label="Instagram">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                    </svg>
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label="LinkedIn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="k-team-footer">
          {variant === "about" ? (
            <>
              <p className="k-team-footer-text">
                Join the team <strong>shaping thoughtful brands.</strong>
              </p>
              <div className="k-team-footer-action">
                <span className="k-mono-label">Think you&apos;d be a great fit?</span>
                <KButton href="/careers" label="View open jobs" />
              </div>
            </>
          ) : (
            <>
              <p className="k-team-footer-text">
                Behind every result is <strong>a team that cares.</strong>
              </p>
              <div className="k-team-footer-action">
                <span className="k-mono-label">Built by specialists</span>
                <KButton href="/about" label="More about us" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
