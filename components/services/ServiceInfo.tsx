import PageHero from "@/components/shared/PageHero";

/** Services page hero. */
export default function ServiceInfo() {
  return (
    <PageHero
      label="+ SERVICES"
      title={
        <>
          <span className="k-muted">Everything</span> you need
          <br />
          to grow online
        </>
      }
      desc="Design, development and digital marketing under one roof — a complete yet focused range of services for every stage of your growth."
    />
  );
}
