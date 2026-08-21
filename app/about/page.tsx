import AboutPhilosophy from "@/components/about/AboutPhilosophy";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <div className="about-page-wrapper">
      <AboutPhilosophy />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}
