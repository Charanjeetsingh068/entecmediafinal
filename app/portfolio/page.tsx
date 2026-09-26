import type { Metadata } from "next";
import PortfolioInfo from "@/components/portfolio/PortfolioInfo";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import CTABand from "@/components/shared/CTABand";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Entec Media's portfolio of websites, web applications, mobile apps, brand identities, SEO and paid advertising campaigns.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <div className="k-page portfolio-page-wrapper">
      <PortfolioInfo />
      <div className="k-page-body">
        <PortfolioGrid />
        <CTABand />
        <AboutCTA source="portfolio-page" />
      </div>
    </div>
  );
}
