import ServiceInfo from "@/components/services/ServiceInfo";
import AllServices from "@/components/services/AllServices";

export default function ServicesPage() {
  return (
    <div className="services-page-wrapper">
      <ServiceInfo />
      <AllServices />
    </div>
  );
}
