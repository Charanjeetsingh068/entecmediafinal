import Banner from "@/components/home/Banner";
import Services from "@/components/home/Services";
import Stats from "@/components/home/Stats";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <div className="home-page">
      <Banner />
      <Services />
      <Stats />
      <CTA />
    </div>
  );
}
