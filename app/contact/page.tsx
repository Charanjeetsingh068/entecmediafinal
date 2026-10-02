import type { Metadata } from "next";
import ContactMainSection from "@/components/contact/ContactMainSection";
import ContactFAQ from "@/components/contact/ContactFAQ";
import AboutCTA from "@/components/about/AboutCTA";
import { mapEmbedUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Entec Media for website design & development, mobile apps, UI/UX, graphic design, SEO, Google Ads and Meta Ads. Call +91-9996550841 or email info@entecmedia.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="k-page contact-page-wrapper">
      <ContactMainSection />
      <div className="k-page-body">
        <AboutCTA source="contact-page" />
        <section className="k-map-section" data-theme="light">
          <div className="container">
            <div className="k-map-frame">
              <iframe
                src={mapEmbedUrl}
                title="Entec Media location on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
        <ContactFAQ />
      </div>
    </div>
  );
}
