import PortfolioInfo from "@/components/portfolio/PortfolioInfo";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import AboutCTA from "@/components/about/AboutCTA";

export default function PortfolioPage() {
  return (
    <div className="portfolio-page-wrapper">
      <PortfolioInfo />
      <PortfolioGrid />
      <AboutCTA />
    </div>
  );
}
