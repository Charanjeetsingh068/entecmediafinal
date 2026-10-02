import FeaturedProjects from "@/components/shared/FeaturedProjects";
import { portfolioProjects } from "@/lib/portfolioData";
import { toWork } from "@/lib/servicesApi";

const stats = [
  { label: "Websites", end: 136 },
  { label: "Apps", end: 24 },
  { label: "Brands", end: 88 },
  { label: "Services", end: 10, suffix: "+" },
];

/** Home "Featured projects" — the first four portfolio projects in the shared scroll-driven deck. */
export default function Projects() {
  return (
    <FeaturedProjects
      projects={portfolioProjects.slice(0, 4).map(toWork)}
      label="+ FEATURED PROJECTS"
      title={
        <>
          <span className="text-gradient">Created</span> with
          <br />
          clear purpose
        </>
      }
      desc="Real projects, real challenges and measurable results across web development, UI/UX, SEO and paid advertising."
      quote={
        <>
          A curated selection of <strong>websites, apps, designs and marketing campaigns</strong> we have delivered to
          help businesses stand out and grow online.
        </>
      }
      stats={stats}
      cta={{ label: "View all projects", href: "/portfolio" }}
    />
  );
}
