import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectHero from "@/components/portfolio/project/ProjectHero";
import ProjectOverview from "@/components/portfolio/project/ProjectOverview";
import ServiceFeatures from "@/components/services/detail/ServiceFeatures";
import ServiceProjects from "@/components/services/detail/ServiceProjects";
import QuoteCta from "@/components/shared/QuoteCta";
import FaqShowcase from "@/components/shared/FaqShowcase";
import { getPortfolioItems, getPortfolioPageContent, getProjectPage } from "@/lib/portfolioApi";
import { siteConfig } from "@/lib/siteConfig";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPortfolioItems()).map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getProjectPage(slug);
  if (!page) return { title: "Project Not Found" };
  const { project } = page;
  const title = `${project.title} — ${project.category} Case Study`;
  return {
    title,
    description: project.description,
    alternates: { canonical: `/portfolio/${project.id}` },
    openGraph: {
      title: `${title} | Entec Media`,
      description: project.description,
      url: `/portfolio/${project.id}`,
      type: "article",
      images: [project.image],
    },
    twitter: { card: "summary_large_image", title, description: project.description, images: [project.image] },
  };
}

/**
 * Project page (one for every project in lib/portfolioItems.ts + the case studies) — dark and light
 * sections alternate: hero with the device composition (dark, pinned) → overview: screenshot + details +
 * get a quote (light) → what we delivered (dark, the service pages' "What's included" section) →
 * related projects (light, the Featured projects deck) → get a quote (dark) → project FAQs (light) → footer.
 * Content: lib/portfolioApi.ts → getProjectPage (project data + category defaults + shared copy).
 */
export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [page, listing] = await Promise.all([getProjectPage(slug), getPortfolioPageContent()]);
  if (!page) notFound();
  const { project, content, features, faqs, related } = page;

  const projectLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.image,
    url: `${siteConfig.url}/portfolio/${project.id}/`,
    genre: project.category,
    ...(project.year ? { dateCreated: project.year } : {}),
    keywords: project.tech.join(", "),
    creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(project.client ? { sourceOrganization: { "@type": "Organization", name: project.client } } : {}),
  };

  return (
    <div className="k-page ab-page sd-page pd-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectLd) }} />
      <ProjectHero page={page} listLabel={listing.name} />
      <div className="k-page-body ab-body">
        <ProjectOverview page={page} />
        <ServiceFeatures
          service={{ title: project.title, image: project.image, deliverables: features, tools: project.tech }}
          content={content.features}
        />
        {related.length > 0 && <ServiceProjects projects={related} content={content.related} />}
        <QuoteCta content={content.cta} />
        <FaqShowcase
          id="project-faq"
          items={faqs}
          label={content.faq.label}
          title={content.faq.title}
          desc={content.faq.desc}
          help={content.faq.help}
        />
      </div>
    </div>
  );
}
