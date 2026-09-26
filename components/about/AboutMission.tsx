import Image from "next/image";
import CountUp from "@/components/shared/CountUp";
import Reveal from "@/components/shared/Reveal";
import ScrollHighlightText from "@/components/shared/ScrollHighlightText";

const stats = [
  { label: "Years of Experience", value: 20, suffix: "+", desc: "Built on years of real-world projects" },
  { label: "Projects Delivered", value: 100, suffix: "+", desc: "Websites, apps and campaigns launched" },
  { label: "Client Retention Rate", value: 98, suffix: "%", desc: "Clients who stay, project after project" },
  { label: "Digital Services", value: 10, suffix: "+", desc: "Design, development & marketing under one roof" },
];

/** About intro: wide visual, founder-style quote with scroll highlight, and the four stat cards. */
export default function AboutMission() {
  return (
    <section className="k-section k-about-intro" data-theme="light">
      <div className="container">
        <Reveal className="k-about-visual">
          <Image
            src="/images/aboutbac.webp"
            alt="Entec Media team at work"
            fill
            sizes="100vw"
            className="k-about-visual-img"
            priority
          />
        </Reveal>

        <div className="k-about-quote-row">
          <div className="k-about-quote-author">
            <span className="k-quote-mark" aria-hidden="true">&ldquo;&ldquo;</span>
            <div className="k-author">
              <Image src="/images/founder1.png" alt="" width={36} height={36} className="k-author-avatar" />
              <div>
                <p className="k-author-name">Team Entec Media</p>
                <p className="k-author-role">Strategy &amp; Leadership</p>
              </div>
            </div>
          </div>
          <ScrollHighlightText
            className="k-about-quote-text"
            text="We believe in clarity over complexity and results over vanity metrics. Great work communicates with purpose, connects with people and keeps growing your business long after it's launched."
          />
        </div>

        <div className="k-stat-grid">
          {stats.map((stat, idx) => (
            <Reveal key={stat.label} className="k-stat-card" delay={idx * 0.08}>
              <span className="k-stat-pill" aria-hidden="true" />
              <span className="k-stat-label">{stat.label}</span>
              <span className="k-stat-value">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </span>
              <p className="k-stat-desc">{stat.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
