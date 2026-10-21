"use client";

import Banner from "@/components/home/Banner";
import Mission from "@/components/home/Mission";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import DynamicSectionsRenderer from "@/components/shared/DynamicSectionsRenderer";
import { useDynamicPage } from "@/lib/useDynamicPage";

export default function Home() {
  const { getSection, getCustomSections } = useDynamicPage("home");

  const heroSec = getSection("sec_hero") || getSection("hero");
  const missionSec = getSection("sec_mission") || getSection("mission");
  const whySec = getSection("sec_why_choose_us") || getSection("features");
  const testimonialsSec = getSection("sec_testimonials") || getSection("testimonials");

  const knownIds = [
    "sec_hero",
    "hero",
    "sec_mission",
    "mission",
    "sec_why_choose_us",
    "features",
    "sec_services_highlight",
    "services",
    "sec_testimonials",
    "testimonials",
    "sec_cta",
    "cta"
  ];
  const customSections = getCustomSections(knownIds);

  return (
    <div className="home-page">
      {heroSec?.visible !== false && <Banner dynamicContent={heroSec} />}
      <div className="main-content-wrapper">
        {missionSec?.visible !== false && <Mission dynamicContent={missionSec} />}
        {whySec?.visible !== false && <WhyChooseUs />}
        <Services />
        <Projects />
        {testimonialsSec?.visible !== false && <Testimonials dynamicContent={testimonialsSec} />}
        <BlogSection />
        {customSections.length > 0 && <DynamicSectionsRenderer sections={customSections} />}
      </div>
    </div>
  );
}
