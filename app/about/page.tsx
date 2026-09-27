import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutOverview from "@/components/about/AboutOverview";
import AboutWhy from "@/components/about/AboutWhy";
import AboutPurpose from "@/components/about/AboutPurpose";
import AboutPeople from "@/components/about/AboutPeople";
import Testimonials from "@/components/home/Testimonials";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Entec Media is an IT and digital marketing company from Zirakpur, Punjab, helping businesses grow with websites, mobile apps, design, SEO and paid advertising.",
  alternates: { canonical: "/about" },
};

/**
 * About page: hero with breadcrumb (pinned, the body slides over it) → overview → why choose us (dark)
 * → vision, mission & values (pinned horizontal scroll) → testimonials (dark, shared with home) → team.
 * Styles: the "ABOUT PAGE" block in app/globals.css.
 */
export default function AboutPage() {
  return (
    <div className="k-page ab-page">
      <AboutHero />
      <div className="k-page-body ab-body">
        <AboutOverview />
        <AboutWhy />
        <AboutPurpose />
        <Testimonials />
        <AboutPeople />
      </div>
    </div>
  );
}
