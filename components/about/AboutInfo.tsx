import PageHero from "@/components/shared/PageHero";

/** About page hero (Kudos "About us — Focused on real impact"). */
export default function AboutInfo() {
  return (
    <PageHero
      label="+ ABOUT US"
      title={
        <>
          <span className="k-muted">Focused on</span>
          <br />
          real impact
        </>
      }
      desc="Entec Media is an IT and digital marketing company from Zirakpur, Punjab — we approach every project with clarity, structure and purposeful creative thinking."
    />
  );
}
