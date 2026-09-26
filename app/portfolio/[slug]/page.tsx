import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioProjectDetail, portfolioProjects } from "@/lib/portfolioData";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import PortfolioShowcase from "@/components/portfolio/PortfolioShowcase";
import SectionHeader from "@/components/shared/SectionHeader";
import KButton from "@/components/shared/KButton";
import AboutCTA from "@/components/about/AboutCTA";

interface PortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return portfolioProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioProjectDetail(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} – Case Study`,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, images: [project.heroImage] },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const project = getPortfolioProjectDetail(slug);
  if (!project) notFound();

  const others = portfolioProjects.filter((p) => p.slug !== project.slug);
  const featuredOthers = others.slice(0, 3);
  const moreOthers = others.slice(3);

  return (
    <div className="k-page k-detail-page portfolio-detail-page-wrapper">
      <PortfolioHero project={project} />
      <PortfolioOverview project={project} />

      <section className="k-section k-related-section" data-theme="light">
        <div className="container">
          <SectionHeader
            label="+ OTHER PROJECTS"
            title={
              <>
                <span className="k-muted">More ideas</span>
                <br />
                turned real
              </>
            }
            desc="Real projects, real challenges and real results, crafted with clarity, creativity and purpose."
          />
          <PortfolioShowcase
            projects={featuredOthers}
            intro={
              <p className="k-showcase-intro-text">
                A curated selection of work shaped by <strong>strategy, creativity and thoughtful execution</strong>,
                crafted to help brands stand out and grow with confidence.
              </p>
            }
          />

          <div className="k-keep-exploring">
            <span className="why-section-label">+ OTHER PROJECTS</span>
            <div className="k-keep-exploring-links">
              <span className="k-mono-label">Keep exploring our work</span>
              <div className="k-keep-exploring-row">
                {moreOthers.map((p) => (
                  <Link key={p.slug} href={`/portfolio/${p.slug}`} className="k-keep-link">
                  <span className="k-keep-link-main">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.heroImage.replace("w=1600", "w=120")} alt="" className="k-keep-thumb" loading="lazy" />
                    <span className="k-keep-name">{p.client}</span>
                  </span>
                  <span className="cta-dots-vertical" aria-hidden="true">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="k-keep-exploring-cta">
              <span className="k-mono-label">See what else we&apos;ve built</span>
              <KButton href="/portfolio" label="All case studies" />
            </div>
          </div>
        </div>
      </section>

      <AboutCTA source={`portfolio-${project.slug}`} />
    </div>
  );
}
