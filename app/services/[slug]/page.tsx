import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceDetail, servicesList } from "@/lib/servicesData";
import DetailHero from "@/components/shared/DetailHero";
import ShareLinks from "@/components/shared/ShareLinks";
import FAQSection from "@/components/shared/FAQSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTABand from "@/components/shared/CTABand";
import AboutCTA from "@/components/about/AboutCTA";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return servicesList.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} Services`,
    description: service.heroDesc,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} Services | Entec Media`,
      description: service.heroDesc,
      images: [service.image],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) notFound();

  const index = servicesList.findIndex((s) => s.slug === service.slug);
  const otherServices = [1, 2, 3, 4].map((offset) => servicesList[(index + offset) % servicesList.length]);

  return (
    <div className="k-page k-detail-page">
      <DetailHero
        backHref="/services"
        backLabel="BACK TO SERVICES"
        eyebrow={`${service.num} / ${service.category}`}
        title={service.title}
        subtitle={service.heroTagline}
        meta={[
          { label: "Category", value: service.category },
          { label: "Process", value: `${service.process.length}-step delivery` },
          { label: "Deliverables", value: `${service.deliverables.length} core outputs` },
          { label: "Tools", value: service.tools.slice(0, 3).join(", ") },
        ]}
      />

      <section className="k-detail-body" data-theme="light">
        <div className="container k-detail-grid">
          <aside className="k-detail-sidebar">
            <div className="k-side-block">
              <span className="k-mono-label">What&apos;s included:</span>
              <ul className="k-side-list">
                {service.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="k-side-block">
              <span className="k-mono-label">Tools we use:</span>
              <div className="k-chip-row">
                {service.tools.map((tool) => (
                  <span key={tool} className="k-chip">{tool}</span>
                ))}
              </div>
            </div>
            <ShareLinks title={`${service.title} — Entec Media`} />
          </aside>

          <article className="k-detail-content">
            <div className="k-detail-media">
              <Image src={service.image} alt={service.title} fill sizes="(max-width: 1199px) 100vw, 50vw" priority />
            </div>

            <p className="k-detail-lead">{service.heroDesc}</p>

            <h2>{service.overviewTitle}</h2>
            {service.overviewDesc.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div className="k-detail-stats">
              {service.stats.map((stat) => (
                <div key={stat.label} className="k-detail-stat">
                  <span className="k-detail-stat-value">{stat.value}</span>
                  <span className="k-mono-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <h2>How we deliver</h2>
            <ol className="k-step-list">
              {service.process.map((step) => (
                <li key={step.step}>
                  <span className="k-step-num">{step.step}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2>What you receive</h2>
            <div className="k-deliverable-grid">
              {service.deliverables.map((item) => (
                <div key={item.title} className="k-deliverable">
                  <span className="k-accent-dot" aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <FAQSection
        groups={[{ group: service.title, items: service.faqs }]}
        title={
          <>
            <span className="k-muted">{service.title}</span>
            <br />
            questions answered
          </>
        }
        desc="Everything you need to know about working with Entec Media on this service."
      />

      <section className="k-section k-related-section" data-theme="light">
        <div className="container">
          <SectionHeader
            label="+ OTHER SERVICES"
            title={
              <>
                <span className="k-muted">Pairs well</span>
                <br />
                with these
              </>
            }
            desc={`Combine ${service.title.toLowerCase()} with other services for a complete solution delivered by one team.`}
          />
          <div className="k-service-rows">
            {otherServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="k-service-row">
                <span className="k-service-num">
                  <span className="k-accent-dot" aria-hidden="true" />
                  {s.num}
                </span>
                <span className="k-service-thumb">
                  <img src={s.thumb} alt="" loading="lazy" />
                </span>
                <span className="k-service-title-wrap">
                  <span className="k-service-cat">{s.category}</span>
                  <span className="k-service-title">{s.title}</span>
                </span>
                <span className="k-service-desc">{s.shortDesc}</span>
                <span className="k-service-arrow" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
      <AboutCTA source={`service-${service.slug}`} defaultService={service.title} />
    </div>
  );
}
