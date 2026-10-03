import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { getTermsOfService } from "@/lib/legalApi";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, path } = await getTermsOfService();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: { title: `${seo.title} | Entec Media`, description: seo.description, url: path, type: "website" },
  };
}

export default async function TermsOfServicePage() {
  return <LegalPage doc={await getTermsOfService()} />;
}
