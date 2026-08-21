import AboutInfo from "@/components/about/AboutInfo";
import AboutMission from "@/components/about/AboutMission";
import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      <AboutInfo />
      <AboutMission />
      <AboutPhilosophy />
      <WhyChooseUs />
      <Testimonials />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}
