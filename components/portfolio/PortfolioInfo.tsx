import PageHero from "@/components/shared/PageHero";

/** Portfolio page hero (Kudos "Projects — Thinking that drives impact"). */
export default function PortfolioInfo() {
  return (
    <PageHero
      label="+ OUR PROJECTS"
      title={
        <>
          <span className="k-muted">Thinking</span> that
          <br />
          drives impact
        </>
      }
      desc="Real projects, real challenges and measurable results — websites, apps, designs and campaigns crafted with clarity and purpose."
    />
  );
}
