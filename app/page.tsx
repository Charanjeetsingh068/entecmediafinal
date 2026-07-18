import Banner from "@/components/home/Banner";
import Mission from "@/components/home/Mission";
import Services from "@/components/home/Services";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <div className="home-page">
      <Banner />
      <div className="main-content-wrapper">
        <Mission />
        <Services />
        <CTA />
      </div>
    </div>
  );
}
