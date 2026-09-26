import type { PortfolioProjectDetail } from "@/lib/portfolioData";
import DetailHero from "@/components/shared/DetailHero";

interface PortfolioHeroProps {
  project: PortfolioProjectDetail;
}

/** Case-study hero: back link, project title + tagline and the Year / Duration / Client / Category grid. */
export default function PortfolioHero({ project }: PortfolioHeroProps) {
  return (
    <DetailHero
      backHref="/portfolio"
      backLabel="BACK TO CASE STUDIES"
      title={project.title}
      subtitle={project.heroTagline}
      meta={[
        { label: "Year", value: project.year },
        { label: "Duration", value: project.duration },
        { label: "Client", value: project.client },
        { label: "Category", value: project.category },
      ]}
    />
  );
}
