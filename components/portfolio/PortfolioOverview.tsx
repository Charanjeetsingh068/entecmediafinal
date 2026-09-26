import Image from "next/image";
import type { PortfolioProjectDetail } from "@/lib/portfolioData";
import ShareLinks from "@/components/shared/ShareLinks";
import PortfolioGallery from "./PortfolioGallery";
import PortfolioResults from "./PortfolioResults";

interface PortfolioOverviewProps {
  project: PortfolioProjectDetail;
}

/** Case-study body: sticky sidebar (categories, team, share) + the long-form story with screenshots. */
export default function PortfolioOverview({ project }: PortfolioOverviewProps) {
  const [shot1, shot2, shot3] = project.galleryImages;

  return (
    <section className="k-detail-body" data-theme="light">
      <div className="container k-detail-grid">
        <aside className="k-detail-sidebar">
          <div className="k-side-block">
            <span className="k-mono-label">Categories:</span>
            <ul className="k-side-list">
              {project.subCategories.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="k-side-block">
            <span className="k-mono-label">Our team mates who took part in this project</span>
            <div className="k-avatar-row">
              {["/images/team1-avatar.webp", "/images/team2-avatar.webp", "/images/team3-avatar.webp"].map((src) => (
                <Image key={src} src={src} alt="" width={36} height={36} className="k-avatar" />
              ))}
            </div>
          </div>
          <div className="k-side-block">
            <span className="k-mono-label">Tech stack:</span>
            <div className="k-chip-row">
              {project.techStack.map((t) => (
                <span key={t} className="k-chip">{t}</span>
              ))}
            </div>
          </div>
          <ShareLinks title={`${project.title} — Entec Media case study`} />
        </aside>

        <article className="k-detail-content">
          <PortfolioGallery image={project.heroImage} title={project.title} priority />

          <p className="k-detail-lead">{project.heroDesc}</p>

          <div className="k-detail-stats">
            {project.stats.map((stat) => (
              <div key={stat.label} className="k-detail-stat">
                <span className="k-detail-stat-value">{stat.value}</span>
                <span className="k-mono-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <h2>{project.challengeTitle}</h2>
          {project.challengeDesc.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {shot1 && <PortfolioGallery image={shot1} title={`${project.title} screen 2`} />}

          <h2>{project.solutionTitle}</h2>
          {project.solutionDesc.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {(shot2 || shot3) && (
            <div className="k-detail-image-pair">
              {[shot2, shot3].filter(Boolean).map((src, i) => (
                <div key={src} className="k-detail-media k-detail-media-small">
                  <Image src={src} alt={`${project.title} detail ${i + 1}`} fill sizes="(max-width: 809px) 100vw, 25vw" />
                </div>
              ))}
            </div>
          )}

          <h2>Results</h2>
          <PortfolioResults results={project.results} />
        </article>
      </div>
    </section>
  );
}
