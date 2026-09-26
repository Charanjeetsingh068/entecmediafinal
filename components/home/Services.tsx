"use client";

import Link from "next/link";
import { servicesList as servicesData } from "@/lib/servicesData";
import Reveal from "@/components/shared/Reveal";
import KButton from "@/components/shared/KButton";

/**
 * Kudos "Our focus" services section: the heading block stays sticky in column 1 while the
 * numbered service rows scroll naturally in columns 2–4, each row fading/sliding in as it enters.
 */
export default function Services() {
  return (
    <section id="services" className="k-services-dark" data-theme="dark">
      <div className="container k-services-grid">
        <div className="k-services-head">
          <span className="why-section-label k-label-light">
            <span className="k-accent-dot" aria-hidden="true" /> SERVICES
          </span>
          <h2 className="k-services-title">
            <span className="highlight-focus">Our</span> focus
          </h2>
          <p className="k-services-desc">
            Design, development and digital marketing under one roof — everything your business needs to launch, grow
            and win online.
          </p>
        </div>

        <div className="k-services-rows">
          {servicesData.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="k-svc-row" aria-label={`Explore our ${service.title} service`}>
              <div className="k-svc-num k-svc-anim" data-kfx="opacity:0;y:48">
                <span className="k-accent-dot" aria-hidden="true" />
                {service.num}
              </div>
              <div className="k-svc-thumb k-svc-anim" data-kfx="opacity:0;y:48">
                <img src={service.thumb} alt="" loading="lazy" />
              </div>
              <div className="k-svc-title k-svc-anim" data-kfx="opacity:0;y:48">
                <h3>{service.title}</h3>
              </div>
              <div className="k-svc-desc k-svc-anim" data-kfx="opacity:0;y:48">
                <p>{service.shortDesc}</p>
              </div>
            </Link>
          ))}

          <div className="k-svc-footer">
            <Reveal className="k-svc-quote">
              <span className="k-quote-mark k-quote-mark-light" aria-hidden="true">&ldquo;&ldquo;</span>
              <p>
                Our approach is simple: <strong>one team for design, development and marketing</strong> — so your
                website, app and campaigns <strong>work together</strong> and keep growing your business.
              </p>
            </Reveal>
            <Reveal className="k-svc-cta" delay={0.1}>
              <span className="k-mono-label">Ready to start something great?</span>
              <KButton href="/contact" label="Let's Collaborate" variant="dark" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
