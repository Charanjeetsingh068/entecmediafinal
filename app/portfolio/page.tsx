import type { Metadata } from "next";
import PortfolioPageHero from "@/components/portfolio/PortfolioPageHero";
import PortfolioProjects from "@/components/portfolio/PortfolioProjects";
import Testimonials from "@/components/home/Testimonials";
import FaqShowcase from "@/components/shared/FaqShowcase";
import { getPortfolioCategories, getPortfolioItems, getPortfolioPageContent } from "@/lib/portfolioApi";
import { getTestimonials } from "@/lib/servicesApi";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPortfolioPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/portfolio" },
    openGraph: {
      title: `${seo.title} | Entec Media`,
      description: seo.description,
      url: "/portfolio",
      type: "website",
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

/**
 * Our Projects page (/portfolio): hero with breadcrumb and the moving project wall (dark, pinned — the
 * body slides over it) → our projects with tabs, search, technology filters and pagination (light) →
 * testimonials (dark, shared with home / services) → FAQs (light) → footer. Every project links to its
 * own page (app/portfolio/[slug]/page.tsx).
 * Content: lib/portfolioApi.ts (page copy + projects, local now, admin API later).
 */
export default async function PortfolioPage() {
  const [content, items, categories, reviews] = await Promise.all([
    getPortfolioPageContent(),
    getPortfolioItems(),
    getPortfolioCategories(),
    getTestimonials(),
  ]);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Entec Media — Our Projects",
    url: `${siteConfig.url}/portfolio/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${siteConfig.url}/portfolio/${p.id}/`,
      })),
    },
  };

  return (
    <div className="k-page ab-page pf-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <PortfolioPageHero content={content.hero} name={content.name} projects={items} />
      <div className="k-page-body ab-body">
        <PortfolioProjects items={items} categories={categories} content={content.list} />
        <Testimonials reviews={reviews} />
        <FaqShowcase
          id="portfolio-faq"
          items={content.faq.items}
          label={content.faq.label}
          title={content.faq.title}
          desc={content.faq.desc}
          help={content.faq.help}
        />
      </div>
    </div>
  );
}
