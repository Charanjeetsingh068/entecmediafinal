import type { ReactNode } from "react";
import SectionHeader from "./SectionHeader";

interface PageHeroProps {
  label: string;
  title: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
}

/**
 * Inner-page hero (About, Services, Portfolio, Blog, Careers, Contact).
 * Like Kudos it stays pinned while the page body (.k-page-body) slides up over it.
 */
export default function PageHero({ label, title, desc, children }: PageHeroProps) {
  return (
    <section className="k-page-hero" data-theme="light">
      <div className="container k-page-hero-inner">
        <SectionHeader as="h1" label={label} title={title} desc={desc} className="k-hero-head" />
        {children}
      </div>
    </section>
  );
}
