import { Fragment } from "react";
import FeaturedProjects from "@/components/shared/FeaturedProjects";
import type { WorkProject } from "@/lib/servicesApi";
import type { ServiceDetailSections } from "@/lib/servicesContent";

interface ServiceProjectsProps {
  projects: WorkProject[];
  content: ServiceDetailSections["projects"];
}

/** "**bold** text" → text with <strong> parts (content stays plain strings for the CMS). */
function rich(text: string) {
  return text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}

/** "Featured projects" (light) — the home page's scroll-driven project deck, showing this service's projects. */
export default function ServiceProjects({ projects, content }: ServiceProjectsProps) {
  return (
    <FeaturedProjects
      projects={projects}
      label={content.label}
      title={
        <>
          <span className="text-gradient">{content.title.soft}</span>
          <br />
          {content.title.strong}
        </>
      }
      desc={content.desc}
      quote={rich(content.quote)}
      stats={content.stats.map((s) => ({ label: s.label, end: s.value, suffix: s.suffix }))}
      cta={content.cta}
    />
  );
}
