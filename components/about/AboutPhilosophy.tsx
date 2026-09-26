import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";
import Reveal from "@/components/shared/Reveal";

const valueGroups = [
  {
    group: "Purpose",
    items: [
      {
        title: "Our Vision",
        desc: "To be the most trusted IT and digital marketing partner for growing businesses — delivering technology and marketing that create real, measurable growth.",
        metaLabel: "Focus:",
        meta: "Long-term growth",
        href: "/services",
        linkLabel: "Explore services",
      },
      {
        title: "Our Mission",
        desc: "To help businesses succeed online with high-quality websites, mobile apps, design and data-driven marketing — delivered on time, on budget and with complete transparency.",
        metaLabel: "Focus:",
        meta: "Quality & transparency",
        href: "/portfolio",
        linkLabel: "See our work",
      },
    ],
  },
  {
    group: "Principles",
    items: [
      {
        title: "Core Values",
        desc: "Honesty, quality and accountability. We communicate clearly, report transparently and treat every client's budget as if it were our own.",
        metaLabel: "Focus:",
        meta: "Trust",
        href: "/contact",
        linkLabel: "Talk to us",
      },
      {
        title: "Culture & Impact",
        desc: "Designers, developers and marketers working as one team — so your website, app and campaigns are planned together and work together.",
        metaLabel: "Focus:",
        meta: "One team",
        href: "/careers",
        linkLabel: "Join the team",
      },
    ],
  },
];

/** Vision & values presented in the Kudos "Awards & Recognition" list layout. */
export default function AboutPhilosophy() {
  return (
    <section className="k-section k-list-section" data-theme="light">
      <div className="container">
        <SectionHeader
          label="+ VISION & VALUES"
          title={
            <>
              <span className="k-muted">Driven by vision,</span>
              <br />
              guided by values
            </>
          }
          desc="The purpose and principles that shape every website, app and campaign we deliver."
        />

        {valueGroups.map((group) => (
          <div key={group.group} className="k-list-group">
            <span className="k-list-group-label">{group.group}</span>
            <div className="k-list-rows">
              {group.items.map((item, idx) => (
                <Reveal key={item.title} className="k-list-row" delay={idx * 0.06}>
                  <div className="k-list-main">
                    <h3 className="k-list-title">{item.title}</h3>
                    <p className="k-list-desc">{item.desc}</p>
                  </div>
                  <div className="k-list-meta">
                    <span className="k-mono-label">{item.metaLabel}</span>
                    <span className="k-list-meta-value">{item.meta}</span>
                  </div>
                  <Link href={item.href} className="k-text-link">
                    {item.linkLabel}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
