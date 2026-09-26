import { portfolioProjects } from "@/lib/portfolioData";
import PortfolioShowcase from "./PortfolioShowcase";

/** Portfolio listing body: searchable, filterable case studies in the Kudos projects layout. */
export default function PortfolioGrid() {
  return (
    <section className="k-section k-portfolio-list" id="projects" data-theme="light">
      <div className="container">
        <PortfolioShowcase projects={portfolioProjects} withFilters headingLevel={2} />
      </div>
    </section>
  );
}
