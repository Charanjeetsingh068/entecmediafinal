import { getServiceDetail, servicesDictionary } from "@/lib/servicesData";
import Image from "next/image";
import Link from "next/link";
import AboutCTA from "@/components/about/AboutCTA";
import { notFound } from "next/navigation";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all services
export async function generateStaticParams() {
  return Object.keys(servicesDictionary).map((slug) => ({
    slug,
  }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceDetail(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="service-detail-page-wrapper">
      {/* Hero Section */}
      <section className="service-hero-section">
        <div className="container">
          {/* Breadcrumbs */}
          <div className="service-breadcrumbs">
            <Link href="/" className="crumb-link">Home</Link>
            <span className="crumb-sep">/</span>
            <Link href="/services" className="crumb-link">Services</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">{service.title}</span>
          </div>

          {/* Hero Content Header */}
          <div className="service-hero-header">
            <span className="why-section-label">+ {service.category.toUpperCase()}</span>
            <h1 className="service-hero-title">{service.title}</h1>
            <p className="service-hero-subtitle">{service.heroTagline}</p>
            <p className="service-hero-desc">{service.heroDesc}</p>

            <div className="service-hero-actions">
              <Link href="/contact" className="all-case-studies-button">
                <span>Book a Consultation</span>
              </Link>
              <Link href="/services" className="service-outline-btn">
                <span>Explore All Services</span>
              </Link>
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="service-hero-img-box">
            <Image
              src={service.heroImage}
              alt={service.title}
              fill
              sizes="100vw"
              className="service-hero-img"
              priority
            />
          </div>

          {/* Stats Bar */}
          <div className="service-stats-bar">
            {service.stats.map((stat, idx) => (
              <div key={idx} className="service-stat-item">
                <span className="service-stat-val">{stat.value}</span>
                <span className="service-stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview & Strategic Value Section */}
      <section className="service-overview-section">
        <div className="container">
          <div className="why-top-layout">
            <div className="why-col-left">
              <span className="why-section-label">+ STRATEGIC VALUE</span>
            </div>
            <div className="why-col-center">
              <h2 className="why-main-title">{service.overviewTitle}</h2>
            </div>
            <div className="why-col-right">
              {service.overviewDesc.map((paragraph, idx) => (
                <p key={idx} className="why-header-desc service-overview-p">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process & Methodology Section */}
      <section className="service-process-section">
        <div className="container">
          <div className="why-top-layout about-section-top-mb50">
            <div className="why-col-left">
              <span className="why-section-label">+ METHODOLOGY</span>
            </div>
            <div className="why-col-center">
              <h2 className="why-main-title">
                Our 4-step <span className="highlight-focus">delivery process</span>
              </h2>
            </div>
            <div className="why-col-right">
              <p className="why-header-desc">
                How we move from initial strategic alignment to flawless execution and ongoing optimization.
              </p>
            </div>
          </div>

          {/* Process Cards Grid */}
          <div className="service-process-grid">
            {service.process.map((stepItem) => (
              <div key={stepItem.step} className="service-process-card">
                <span className="process-step-num">{stepItem.step}</span>
                <h3 className="process-step-title">{stepItem.title}</h3>
                <p className="process-step-desc">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Bento Grid */}
      <section className="service-deliverables-section">
        <div className="container">
          <div className="why-top-layout about-section-top-mb50">
            <div className="why-col-left">
              <span className="why-section-label">+ WHAT YOU RECEIVE</span>
            </div>
            <div className="why-col-center">
              <h2 className="why-main-title">
                Key deliverables &amp; <span className="highlight-focus">outcomes</span>
              </h2>
            </div>
            <div className="why-col-right">
              <p className="why-header-desc">
                Tangible visual, technical, and strategic assets delivered with every engagement.
              </p>
            </div>
          </div>

          {/* Deliverables Grid */}
          <div className="service-deliverables-grid">
            {service.deliverables.map((item, idx) => (
              <div key={idx} className="deliverable-card">
                <span className="deliverable-icon">✦</span>
                <h3 className="deliverable-title">{item.title}</h3>
                <p className="deliverable-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Tech Stack */}
      <section className="service-tools-section">
        <div className="container">
          <div className="tools-bar-wrapper">
            <span className="tools-label">ENGINEERED WITH TOP-TIER TOOLS:</span>
            <div className="tools-chips">
              {service.tools.map((tool, idx) => (
                <span key={idx} className="tool-chip">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="service-faq-section">
        <div className="container">
          <div className="why-top-layout about-section-top-mb50">
            <div className="why-col-left">
              <span className="why-section-label">+ QUESTIONS</span>
            </div>
            <div className="why-col-center">
              <h2 className="why-main-title">
                Frequently asked <span className="highlight-focus">questions</span>
              </h2>
            </div>
            <div className="why-col-right">
              <p className="why-header-desc">
                Everything you need to know about working with Entec Media on this service.
              </p>
            </div>
          </div>

          <div className="service-faq-list">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="service-faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Work With Us Form */}
      <AboutCTA />
    </div>
  );
}
