import LegalHero from "@/components/legal/LegalHero";
import LegalBody from "@/components/legal/LegalBody";
import { legalReadingMinutes } from "@/lib/legalApi";
import { siteConfig } from "@/lib/siteConfig";
import type { LegalDoc } from "@/lib/legalContent";

/**
 * Legal page layout (Privacy Policy, Terms of Service): hero with breadcrumb and the animated document
 * art (dark, pinned — the body slides over it) → the text with a sticky contents index and a
 * "Questions?" card (light) → footer. Content: lib/legalApi.ts. Styles: "LEGAL PAGES" in app/globals.css.
 */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const updated = new Date(doc.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: doc.name,
    url: `${siteConfig.url}${doc.path}/`,
    dateModified: doc.updated,
    description: doc.seo.description,
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <div className="k-page ab-page lg-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LegalHero doc={doc} updated={updated} minutes={legalReadingMinutes(doc)} />
      <div className="k-page-body ab-body">
        <LegalBody doc={doc} />
      </div>
    </div>
  );
}
