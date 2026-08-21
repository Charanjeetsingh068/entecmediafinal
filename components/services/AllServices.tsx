"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface DetailedService {
  id: string;
  num: string;
  category: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  deliverables: string[];
}

const detailedServices: DetailedService[] = [
  {
    id: "branding",
    num: "01",
    category: "Branding & Design",
    title: "Brand Identity & Strategy",
    tagline: "Define your voice & stand out in crowded markets",
    desc: "We craft cohesive brand identities from scratch—combining strategic positioning, visual identity systems, typography, and comprehensive brand guidelines that resonate with your target audience.",
    image: "/images/aboutimg.png",
    deliverables: ["Naming & Positioning", "Visual Identity Systems", "Brand Style Guides", "Typography & Color Palette"],
  },
  {
    id: "web-engineering",
    num: "02",
    category: "Web Engineering",
    title: "Next.js & Web Application Engineering",
    tagline: "Lightning-fast, SEO-optimized digital platforms",
    desc: "Using Next.js, React, and modern full-stack architectures, we engineer high-performance web applications, marketing portals, and enterprise platforms optimized for speed, security, and organic growth.",
    image: "/images/aboutbac.png",
    deliverables: ["Next.js Development", "Full-Stack Architecture", "Headless CMS Integration", "SEO & Speed Optimization"],
  },
  {
    id: "uiux-design",
    num: "03",
    category: "Branding & Design",
    title: "UI/UX Design & Prototyping",
    tagline: "Human-centered interfaces crafted for conversion",
    desc: "We turn complex ideas into intuitive, delightful user experiences. From user research and interactive Figma prototypes to micro-interactions and design systems, every detail is engineered for maximum user engagement.",
    image: "/images/entec-about.png",
    deliverables: ["User Research & Wireframes", "Figma Design Systems", "Interactive Prototypes", "Micro-Animations"],
  },
  {
    id: "ecommerce",
    num: "04",
    category: "Web Engineering",
    title: "E-Commerce & Digital Stores",
    tagline: "Scalable online shopping experiences built for revenue",
    desc: "Empower your sales with custom e-commerce platforms. We build lightning-fast online storefronts featuring frictionless checkout flows, multi-currency support, custom inventory systems, and payment integrations.",
    image: "/images/bannerbac.png",
    deliverables: ["Custom Storefronts", "Shopify & Headless Stores", "Frictionless Checkout", "Payment & API Integration"],
  },
  {
    id: "digital-growth",
    num: "05",
    category: "Digital Growth",
    title: "Performance Marketing & Growth",
    tagline: "Data-driven campaigns that maximize ROI",
    desc: "Accelerate audience acquisition with targeted performance marketing. We leverage data analytics, CRO (Conversion Rate Optimization), SEO dominance, and multi-channel ad campaigns to scale your digital presence.",
    image: "/images/about.png",
    deliverables: ["SEO & Content Strategy", "Paid Search & Social Ads", "Conversion Optimization", "Analytics & Tracking"],
  },
  {
    id: "motion-media",
    num: "06",
    category: "Media & Motion",
    title: "Motion Graphics & Media Production",
    tagline: "Scroll-stopping visual assets that capture attention",
    desc: "Bring your brand story to life with dynamic motion graphics, promotional video production, social media visual assets, and high-impact copywriting that captivate audiences across every screen.",
    image: "/images/team4.png",
    deliverables: ["2D/3D Motion Animation", "Promotional Video Editing", "Social Content Assets", "Copywriting & Messaging"],
  },
];

const categories = ["All Services", "Branding & Design", "Web Engineering", "Digital Growth", "Media & Motion"];

export default function AllServices() {
  const [activeCategory, setActiveCategory] = useState("All Services");

  const filteredServices = activeCategory === "All Services"
    ? detailedServices
    : detailedServices.filter(s => s.category === activeCategory);

  return (
    <section className="all-services-section" id="all-services">
      <div className="container">
        {/* Section Header */}
        <div className="why-top-layout about-section-top-mb60">
          <div className="why-col-left">
            <span className="why-section-label">+ WHAT WE DO</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              What we do best <br />
              <span className="highlight-focus">& how we deliver</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              A full spectrum of creative engineering, strategic branding, and high-conversion digital solutions engineered to scale modern businesses.
            </p>
          </div>
        </div>

        {/* 2026 Trend Filter Category Chips */}
        <div className="services-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`services-filter-chip ${activeCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Showcase Cards Grid */}
        <div className="all-services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="all-service-card">
              {/* Card Header & Number */}
              <div className="service-card-top-bar">
                <span className="service-badge-pill">{service.num} / {service.category.toUpperCase()}</span>
              </div>

              {/* Image Preview Box */}
              <div className="service-card-img-wrapper">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="service-card-img"
                />
                <div className="service-card-img-overlay" />
              </div>

              {/* Content Body */}
              <div className="service-card-body">
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-tagline">{service.tagline}</p>
                <p className="service-card-desc">{service.desc}</p>

                {/* Deliverables Tags */}
                <div className="service-deliverables-list">
                  {service.deliverables.map((item, idx) => (
                    <span key={idx} className="service-deliverable-pill">
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="service-card-footer">
                <Link href={`/services/${service.id}`} className="service-card-action-btn">
                  <span>Explore Service Details</span>
                  <span className="action-btn-arrow">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
