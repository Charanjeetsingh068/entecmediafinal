import Banner from "@/components/home/Banner";
import Mission from "@/components/home/Mission";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import Projects from "@/components/home/Projects";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <div className="home-page">
      <Banner />
      <div className="main-content-wrapper">
        <Mission />
        <WhyChooseUs />
        <Services />
        <Projects />
        <CTA />
      </div>
    </div>
  );
}
