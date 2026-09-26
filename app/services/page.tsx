import type { Metadata } from "next";
import ServiceInfo from "@/components/services/ServiceInfo";
import AllServices from "@/components/services/AllServices";
import ProcessSection from "@/components/shared/ProcessSection";
import FAQSection from "@/components/shared/FAQSection";
import CTABand from "@/components/shared/CTABand";
import AboutCTA from "@/components/about/AboutCTA";
import { generalFaqs } from "@/lib/faqData";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Website design, website development, mobile app design & development, graphic design, UI/UX design, digital marketing, SEO, Google Ads and Meta Ads by Entec Media.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="k-page services-page-wrapper">
      <ServiceInfo />
      <div className="k-page-body">
        <AllServices />
        <ProcessSection />
        <FAQSection groups={generalFaqs} />
        <CTABand />
        <AboutCTA source="services-page" />
      </div>
    </div>
  );
}
