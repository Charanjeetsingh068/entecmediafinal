"use client";

import { useState } from "react";
import Link from "next/link";
import { servicesList, serviceCategories, type ServiceCategory } from "@/lib/servicesData";

/** Services listing: category tabs + Kudos numbered service rows linking to each detail page. */
export default function AllServices() {
  const [active, setActive] = useState<ServiceCategory | "All">("All");
  const visible = active === "All" ? servicesList : servicesList.filter((s) => s.category === active);

  return (
    <section className="k-section k-services-list-section" data-theme="light">
      <div className="container">
        <div className="k-toolbar">
          <span className="k-mono-label">Filter by category</span>
          <div className="k-tabs" role="tablist">
            {(["All", ...serviceCategories] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                className={`k-tab ${active === cat ? "is-active" : ""}`}
                onClick={() => setActive(cat)}
              >
                {cat}
                <span className="k-tab-count">
                  {cat === "All" ? servicesList.length : servicesList.filter((s) => s.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="k-service-rows">
          {visible.map((service) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="k-service-row">
              <span className="k-service-num">
                <span className="k-accent-dot" aria-hidden="true" />
                {service.num}
              </span>
              <span className="k-service-thumb">
                <img src={service.thumb} alt="" loading="lazy" />
              </span>
              <span className="k-service-title-wrap">
                <span className="k-service-cat">{service.category}</span>
                <span className="k-service-title">{service.title}</span>
              </span>
              <span className="k-service-desc">
                {service.shortDesc}
                <span className="k-service-tags">
                  {service.highlights.slice(0, 3).map((h) => (
                    <span key={h} className="k-chip">{h}</span>
                  ))}
                </span>
              </span>
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
  );
}
