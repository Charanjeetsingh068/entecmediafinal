import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import type { ServiceDetail } from "@/lib/servicesData";
import type { ServiceDetailSections } from "@/lib/servicesContent";
import ServiceHeroArt from "@/components/services/detail/ServiceHeroArt";

/**
 * Service detail hero — dark, pinned like the About hero. Right: a layered photo composition
 * (components/services/detail/ServiceHeroArt.tsx).
 * Left: breadcrumb, number / category, the "{service} services." title (both lines slide up out of a mask), tagline,
 * description, actions and the service's three key facts.
 */
interface ServiceHeroProps {
  service: ServiceDetail;
  content: ServiceDetailSections["hero"];
}

export default function ServiceHero({ service, content }: ServiceHeroProps) {
  return (
    <section className="k-page-hero ab-hero sd-hero" data-theme="dark" aria-labelledby="service-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: service.title, href: `/services/${service.slug}` },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {service.num} / {service.category}
          </span>

          <h1 className="ab-hero-title sd-hero-title" id="service-title">
            <span className="ab-line">
              <span style={{ animationDelay: "0.1s" }}>{service.title}</span>
            </span>
            <span className="ab-line">
              <span className="ab-hero-soft" style={{ animationDelay: "0.22s" }}>
                services<em className="ab-hero-dot">.</em>
              </span>
            </span>
          </h1>

          <p className="sd-hero-tagline">{service.heroTagline}</p>
          <p className="ab-hero-desc">{service.heroDesc}</p>

          <div className="ab-hero-actions">
            <KButton href={content.primaryCta.href} label={content.primaryCta.label} variant="dark" />
            <a href={content.secondaryCta.href} className="ab-hero-link">
              {content.secondaryCta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>

          <dl className="sd-hero-facts">
            {service.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ServiceHeroArt
          title={service.title}
          image={service.image}
          subImage={service.introImage}
          fact={service.stats[0]}
          highlights={service.highlights}
          includedLabel={content.includedLabel}
        />
      </div>
    </section>
  );
}
