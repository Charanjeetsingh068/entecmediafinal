import { getPortfolioProjectDetail, portfolioProjectsDictionary } from "@/lib/portfolioData";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import PortfolioResults from "@/components/portfolio/PortfolioResults";
import AboutCTA from "@/components/about/AboutCTA";
import { notFound } from "next/navigation";

interface PortfolioPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(portfolioProjectsDictionary).map((slug) => ({
    slug,
  }));
}

export default async function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const { slug } = await params;
  const project = getPortfolioProjectDetail(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="portfolio-detail-page-wrapper">
      <PortfolioHero project={project} />
      <PortfolioOverview project={project} />
      <PortfolioGallery images={project.galleryImages} title={project.title} />
      <PortfolioResults results={project.results} />
      <AboutCTA />
    </div>
  );
}
