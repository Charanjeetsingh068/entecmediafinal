import type { CSSProperties } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import DotBackdrop from "@/components/shared/DotBackdrop";
import CareerIcon from "@/components/careers/CareerIcon";
import type { CareersPageContent } from "@/lib/careersContent";

/**
 * "Life at Entec" (light, calm dot background): a bento of six benefit cards — the first is a large dark
 * card, the rest light. Each card has an icon that fills brand blue and turns on hover, a big outlined
 * number and a blue line drawing along the bottom. Cards rise in with the scroll.
 */
export default function CareersPerks({ content }: { content: CareersPageContent["perks"] }) {
  return (
    <section className="k-section sx cr-perks" data-theme="light" aria-labelledby="cr-perks-title">
      <DotBackdrop />
      <div className="container sx-inner">
        <SectionHeader
          label={content.label}
          title={
            <span id="cr-perks-title">
              <span className="k-muted">{content.title.soft}</span>
              <br />
              {content.title.strong}
            </span>
          }
          desc={content.desc}
        />

        <ul className="cr-perks-grid">
          {content.items.map((p, i) => (
            <li key={p.title} className={`cr-perk ${i === 0 ? "is-feature" : ""}`} data-kfx={`y:${48 + (i % 3) * 24};opacity:0`} style={{ "--i": i } as CSSProperties}>
              <span className="cr-perk-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="cr-perk-icon">
                <CareerIcon name={p.icon} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
