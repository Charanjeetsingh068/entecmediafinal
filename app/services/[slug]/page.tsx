import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/detail/ServiceHero";
import ServiceIntro from "@/components/services/detail/ServiceIntro";
import ServiceFeatures from "@/components/services/detail/ServiceFeatures";
import ServiceProjects from "@/components/services/detail/ServiceProjects";
import QuoteCta from "@/components/shared/QuoteCta";
import FaqShowcase from "@/components/shared/FaqShowcase";
import { getService, getServiceProjects, getServices, getServiceSections } from "@/lib/servicesApi";
import { siteConfig } from "@/lib/siteConfig";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getServices()).map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service Not Found" };

  const title = service.seo?.title || `${service.title} Services in Zirakpur, Punjab`;
  const description = service.seo?.description || service.heroDesc;
  const image = service.seo?.ogImage || service.image;
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${title} | Entec Media`,
      description,
      url: `/services/${service.slug}`,
      type: "website",
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/**
 * Service detail page — dark and light sections alternate:
 * hero + breadcrumb (dark, pinned) → overview (light) → what's included (dark) → featured projects for
 * this service (light, same deck as the home page) → get a quote call-to-action (dark, button to /contact) →
 * this service's FAQs (light) → footer.
 * Content: lib/servicesApi.ts (service data + shared section copy, ready for an admin panel).
 */
export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const sections = await getServiceSections(service);
  const projects = getServiceProjects(service);
  const faqs = service.faqs.map((f) => ({ ...f, tag: service.title }));

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.heroDesc,
    image: service.image,
    url: `${siteConfig.url}/services/${service.slug}/`,
    category: service.category,
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "AdministrativeArea", name: "Punjab" },
    ],
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Zirakpur",
        addressRegion: "Punjab",
        addressCountry: "IN",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} deliverables`,
      itemListElement: service.deliverables.map((d) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d.title, description: d.desc },
      })),
    },
  };

  return (
    <div className="k-page ab-page sd-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <ServiceHero service={service} content={sections.hero} />
      <div className="k-page-body ab-body">
        <ServiceIntro service={service} content={sections.intro} />
        <ServiceFeatures service={service} content={sections.features} />
        {projects.length > 0 && <ServiceProjects projects={projects} content={sections.projects} />}
        <QuoteCta content={sections.cta} />
        <FaqShowcase
          id="service-faq"
          items={faqs}
          label={sections.faq.label}
          title={sections.faq.title}
          desc={sections.faq.desc}
          help={sections.faq.help}
        />
      </div>
    </div>
  );
}
