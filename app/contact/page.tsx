import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactMain from "@/components/contact/ContactMain";
import { getContactPageContent } from "@/lib/contactApi";
import { getServices } from "@/lib/servicesApi";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `${seo.title} | Entec Media`,
      description: seo.description,
      url: "/contact",
      type: "website",
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

/**
 * Contact page: hero with breadcrumb and the live chat art (dark, pinned — the body slides over it) →
 * get in touch (light): ways to reach us, the contact form, Google map with the office address,
 * working hours and social media → footer.
 * Content: lib/contactApi.ts (page copy) + lib/siteConfig.ts (phone, email, address, socials).
 * Styles: the "CONTACT PAGE" block in app/globals.css.
 */
export default async function ContactPage() {
  const [content, services] = await Promise.all([getContactPageContent(), getServices()]);
  const c = siteConfig.contact;

  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Entec Media",
    url: `${siteConfig.url}/contact/`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: c.email,
      telephone: c.phone,
      address: { "@type": "PostalAddress", streetAddress: c.addressLines[0], addressLocality: "Zirakpur", addressRegion: "Punjab", addressCountry: "IN" },
      contactPoint: { "@type": "ContactPoint", telephone: c.phone, email: c.email, contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi", "Punjabi"] },
      sameAs: siteConfig.socialLinks.map((s) => s.href),
    },
  };

  return (
    <div className="k-page ab-page ct-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
      <ContactHero content={content.hero} name={content.name} />
      <div className="k-page-body ab-body">
        <ContactMain content={content} services={services.map((s) => s.title)} />
      </div>
    </div>
  );
}
