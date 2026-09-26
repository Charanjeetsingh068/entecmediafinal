import type { Metadata } from "next";
import AboutInfo from "@/components/about/AboutInfo";
import AboutMission from "@/components/about/AboutMission";
import AboutTeam from "@/components/about/AboutTeam";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import AboutCTA from "@/components/about/AboutCTA";
import CTABand from "@/components/shared/CTABand";
import BlogSection from "@/components/home/BlogSection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Entec Media is an IT and digital marketing company from Zirakpur, Punjab, helping businesses grow with websites, mobile apps, design, SEO and paid advertising.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="k-page about-page-wrapper">
      <AboutInfo />
      <div className="k-page-body">
        <AboutMission />
        <AboutTeam variant="about" />
        <AboutPhilosophy />
        <CTABand />
        <AboutCTA source="about-page" />
        <BlogSection />
      </div>
    </div>
  );
}
