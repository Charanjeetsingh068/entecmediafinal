import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import ClientsMarquee from "@/components/services/ClientsMarquee";
import Testimonials from "@/components/home/Testimonials";
import FaqShowcase from "@/components/shared/FaqShowcase";
import { getClients, getServices, getServicesPageContent, getTestimonials } from "@/lib/servicesApi";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getServicesPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    openGraph: {
      title: `${seo.title} | Entec Media`,
      description: seo.description,
      url: "/services",
      type: "website",
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

/**
 * Services page: hero with breadcrumb (dark, pinned — the body slides over it) → all services (light,
 * filters + pagination) → testimonials (dark, shared with home/about) → FAQ (light) → client logos
 * (light) → footer. All content comes from lib/servicesApi.ts (local data now, admin API later).
 * Styles: the "SERVICES PAGES" block in app/globals.css.
 */
export default async function ServicesPage() {
  const [content, services, clients, reviews] = await Promise.all([
    getServicesPageContent(),
    getServices(),
    getClients(),
    getTestimonials(),
  ]);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Entec Media services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/services/${s.slug}/`,
      name: s.title,
    })),
  };

  return (
    <div className="k-page ab-page sv-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <ServicesHero content={content.hero} />
      <div className="k-page-body ab-body">
        <ServicesGrid services={services} content={content.list} />
        <Testimonials reviews={reviews} />
        <FaqShowcase items={content.faq.items} label={content.faq.label} title={content.faq.title} desc={content.faq.desc} help={content.faq.help} />
        <ClientsMarquee clients={clients} content={content.clients} />
      </div>
    </div>
  );
}
