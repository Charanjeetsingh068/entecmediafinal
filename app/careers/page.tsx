import type { Metadata } from "next";
import CareersHero from "@/components/careers/CareersHero";
import CareersOpenings from "@/components/careers/CareersOpenings";
import CareersProcess from "@/components/careers/CareersProcess";
import CareersPerks from "@/components/careers/CareersPerks";
import { getCareersPageContent, getOpenings } from "@/lib/careersApi";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getCareersPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/careers" },
    openGraph: { title: `${seo.title} | Entec Media`, description: seo.description, url: "/careers", type: "website" },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

/**
 * Careers page: hero with breadcrumb and the "grow with us" art (team photo, growth path, teams hiring) (dark, pinned — the body
 * slides over it) → open positions with team tabs, job-type chips and search (light) → how we hire
 * (dark) → life at Entec benefits (light) → footer. Every role links to its own page with the
 * application form (app/careers/[slug]/page.tsx).
 * Content: lib/careersApi.ts (jobs from lib/careersData.ts, copy from lib/careersContent.ts).
 */
export default async function CareersPage() {
  const [content, jobs] = await Promise.all([getCareersPageContent(), getOpenings()]);

  const departments = Array.from(new Set(jobs.map((j) => j.department))).map((name) => ({
    name,
    count: jobs.filter((j) => j.department === name).length,
  }));

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Open positions at Entec Media",
    itemListElement: jobs.map((j, i) => ({ "@type": "ListItem", position: i + 1, name: j.title, url: `${siteConfig.url}/careers/${j.slug}/` })),
  };

  return (
    <div className="k-page ab-page cr-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <CareersHero content={content.hero} name={content.name} count={jobs.length} departments={departments} />
      <div className="k-page-body ab-body">
        <CareersOpenings jobs={jobs} content={content.openings} />
        <CareersProcess content={content.process} />
        <CareersPerks content={content.perks} />
      </div>
    </div>
  );
}
