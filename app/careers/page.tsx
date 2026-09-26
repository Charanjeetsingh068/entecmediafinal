import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import JobsList from "@/components/careers/JobsList";
import AboutTeam from "@/components/about/AboutTeam";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Entec Media in Zirakpur, Punjab. Open positions for designers, developers, SEO and digital marketing specialists, plus internships.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <div className="k-page careers-page-wrapper">
      <PageHero
        label="+ CAREERS"
        title={
          <>
            <span className="k-muted">Grow</span> with
            <br />
            the team
          </>
        }
        desc="Collaborate with people who care deeply about design, technology and real business impact."
      />
      <div className="k-page-body">
        <JobsList />
        <AboutTeam />
        <AboutCTA source="careers-page" />
      </div>
    </div>
  );
}
