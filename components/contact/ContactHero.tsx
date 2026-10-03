import type { CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import ContactIcon, { type ContactIconName } from "@/components/contact/ContactIcon";
import { siteConfig } from "@/lib/siteConfig";
import { sizedImage } from "@/lib/servicesContent";
import type { ContactPageContent } from "@/lib/contactContent";

interface ContactHeroProps {
  content: ContactPageContent["hero"];
  name: string;
}

/** Contact icons riding the orbit ring (angles in degrees) */
const ORBIT_ICONS: { name: ContactIconName; angle: number }[] = [
  { name: "phone", angle: 200 },
  { name: "mail", angle: 290 },
  { name: "whatsapp", angle: 20 },
  { name: "pin", angle: 110 },
];

/**
 * Contact hero — dark, pinned (the page body slides over it), same family as the other inner-page
 * heroes: breadcrumb, a title whose lines slide up out of a mask, intro, actions and three stats.
 * Right (its own, contact-themed design): a client-meeting photo in an arch frame (slow pan,
 * "replies within 24 hrs" chip), a second round photo over its lower left inside a turning dashed ring,
 * and a badge with circling "Say hello" text. Call, email, WhatsApp and location icons ride a slowly
 * turning orbit ring around it all, staying upright as they travel.
 * On phones the ring is smaller and centred on the photo so the icons never touch the chip or badge.
 */
export default function ContactHero({ content, name }: ContactHeroProps) {
  const c = siteConfig.contact;

  return (
    <section className="k-page-hero ab-hero ch-hero" data-theme="dark" aria-labelledby="contact-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: name, href: "/contact" },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>

          <h1 className="ab-hero-title" id="contact-title">
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.1s" }}>
                {content.title.soft}
              </span>
            </span>
            <span className="ab-line">
              <span style={{ animationDelay: "0.22s" }}>
                {content.title.strong}
                <em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          <p className="ab-hero-desc">{content.desc}</p>

          <div className="ab-hero-actions">
            <KButton href={content.primaryCta.href} label={content.primaryCta.label} variant="dark" />
            <a href={c.whatsappHref} target="_blank" rel="noopener noreferrer" className="ab-hero-link">
              {content.whatsappLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <dl className="sv-hero-stats">
            {content.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="ch-art">
          <span className="ch-orbit ch-orbit-a" aria-hidden="true" />
          <span className="ch-orbit ch-orbit-b" aria-hidden="true" />

          {/* Arch photo */}
          <figure className="ch-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sizedImage(content.photo, 1200)}
              srcSet={`${sizedImage(content.photo, 700)} 700w, ${sizedImage(content.photo, 1200)} 1200w`}
              sizes="(max-width: 1199px) 80vw, 34vw"
              alt={content.photoAlt}
              fetchPriority="high"
              decoding="async"
            />
            <figcaption className="ch-photo-chip">
              <i aria-hidden="true" /> {content.replyNote}
            </figcaption>
          </figure>

          {/* Second round photo */}
          <figure className="ch-photo2">
            <span className="ch-photo2-ring" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sizedImage(content.photo2, 500)} alt={content.photo2Alt} decoding="async" />
          </figure>

          {/* Contact icons riding the orbit */}
          <div className="ch-icons" aria-hidden="true">
            {ORBIT_ICONS.map((o) => (
              <span key={o.name} className="ch-icon" style={{ "--a": `${o.angle}deg` } as CSSProperties}>
                <span className="ch-icon-dot">
                  <ContactIcon name={o.name} />
                </span>
              </span>
            ))}
          </div>

          {/* Circling "say hello" badge */}
          <a href={c.phoneHref} className="ch-badge" aria-label={`Call ${c.phone}`}>
            <svg className="ch-badge-ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="ch-ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
              </defs>
              <text>
                <textPath href="#ch-ring" textLength="230" lengthAdjust="spacing">
                  {content.badgeText}
                </textPath>
              </text>
            </svg>
            <span className="ch-badge-icon" aria-hidden="true">
              <ContactIcon name="phone" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
