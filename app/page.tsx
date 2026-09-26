import Banner from "@/components/home/Banner";
import Mission from "@/components/home/Mission";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Services from "@/components/home/Services";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";
import ProcessSection from "@/components/shared/ProcessSection";
import FAQSection from "@/components/shared/FAQSection";
import CTABand from "@/components/shared/CTABand";
import { generalFaqs } from "@/lib/faqData";

export default function Home() {
  return (
    <div className="home-page">
      <Banner />
      <div className="main-content-wrapper">
        <Mission />
        <WhyChooseUs />
        <Services />
        <ProcessSection />
        <Projects />
        <Testimonials />
        <AboutTeam />
        <FAQSection groups={generalFaqs} />
        <CTABand />
        <AboutCTA source="home-page" />
        <BlogSection />
      </div>
    </div>
  );
}
