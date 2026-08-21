"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PortfolioProject {
  id: string;
  category: "IT & Web Development" | "UI/UX & Graphic Design" | "Digital Marketing";
  subCategories: string[];
  techStack: string[];
  title: string;
  client: string;
  desc: string;
  metric: string;
  image: string;
  link: string;
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: "project-1",
    category: "IT & Web Development",
    subCategories: ["Website Development", "UI/UX Development", "React.js / Next.js"],
    techStack: ["React.js", "Next.js 16", "TypeScript", "Tailwind CSS"],
    title: "NexaTech Enterprise SaaS Web Portal",
    client: "NexaTech Global",
    desc: "A high-performance Next.js 16 web application built for enterprise SaaS solutions with real-time analytics dashboards and microservice API backend.",
    metric: "+240% Organic Traffic",
    image: "/images/aboutimg.png",
    link: "/portfolio/nexatech-enterprise",
  },
  {
    id: "project-2",
    category: "UI/UX & Graphic Design",
    subCategories: ["Website Designing", "UI/UX Design", "Graphic Design"],
    techStack: ["Figma", "Graphic Design", "Brand Guidelines", "Design Systems"],
    title: "Lumina Luxury Visual Identity & UI System",
    client: "Lumina Studios",
    desc: "Complete visual brand identity creation, typography tokens, luxury packaging specs, and responsive Figma design systems for a premium lifestyle brand.",
    metric: "3.5x Brand Perception",
    image: "/images/entec-about.png",
    link: "/portfolio/lumina-luxury",
  },
  {
    id: "project-3",
    category: "IT & Web Development",
    subCategories: ["Website Development", "Website Designing", "WordPress"],
    techStack: ["WordPress", "WooCommerce", "PHP", "Custom CSS"],
    title: "Apex E-Commerce WordPress & WooCommerce Store",
    client: "Apex Retail Group",
    desc: "Custom WordPress theme development, WooCommerce checkout optimization, dynamic product filters, and payment gateway integration.",
    metric: "+185% Sales Revenue",
    image: "/images/bannerbac.png",
    link: "/portfolio/apex-ecommerce",
  },
  {
    id: "project-4",
    category: "Digital Marketing",
    subCategories: ["Website SEO"],
    techStack: ["Website SEO", "SEMrush", "Google Analytics 4", "Technical SEO"],
    title: "CyberShield Search Engine SEO Dominance",
    client: "CyberShield Security",
    desc: "Technical SEO overhaul, keyword mapping, backlink strategy, and Core Web Vitals optimization leading to #1 Google organic rankings.",
    metric: "#1 Rank for 40+ Keywords",
    image: "/images/about.png",
    link: "/portfolio/cybershield-seo",
  },
  {
    id: "project-5",
    category: "Digital Marketing",
    subCategories: ["Google Ads", "Meta Ads"],
    techStack: ["Google Ads", "Meta Ads", "Conversion API", "Looker Studio"],
    title: "Velocity Scale Google & Meta Ads Campaign",
    client: "Velocity Brands",
    desc: "Data-backed PPC advertising across Google Search and Meta Ads (Facebook & Instagram) engineered for maximum customer acquisition ROAS.",
    metric: "4.2x Average ROAS",
    image: "/images/team1.png",
    link: "/portfolio/velocity-ads",
  },
  {
    id: "project-6",
    category: "IT & Web Development",
    subCategories: ["UI/UX Development", "Website Development", "React.js / Next.js"],
    techStack: ["React.js", "UI/UX Development", "Node.js", "REST APIs"],
    title: "Hyperion Cloud Application & Interactive UI",
    client: "Hyperion Systems",
    desc: "Full-stack React.js web portal featuring intuitive data visualization widgets, dark/light theme switching, and seamless API integrations.",
    metric: "99/100 Speed Score",
    image: "/images/team2.png",
    link: "/portfolio/hyperion-cloud",
  },
];

const filterCategories = [
  "All Projects",
  "IT & Web Development",
  "UI/UX & Graphic Design",
  "WordPress",
  "React.js / Next.js",
  "Website SEO",
  "Google & Meta Ads",
];

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const filteredProjects = portfolioProjects.filter((project) => {
    if (activeFilter === "All Projects") return true;
    if (activeFilter === "IT & Web Development") return project.category === "IT & Web Development";
    if (activeFilter === "UI/UX & Graphic Design") return project.category === "UI/UX & Graphic Design";
    if (activeFilter === "Digital Marketing") return project.category === "Digital Marketing";
    if (activeFilter === "WordPress") return project.techStack.includes("WordPress") || project.subCategories.includes("WordPress");
    if (activeFilter === "React.js / Next.js") return project.techStack.includes("React.js") || project.techStack.includes("Next.js 16");
    if (activeFilter === "Website SEO") return project.techStack.includes("Website SEO") || project.subCategories.includes("Website SEO");
    if (activeFilter === "Google & Meta Ads") return project.techStack.includes("Google Ads") || project.techStack.includes("Meta Ads");
    return true;
  });

  return (
    <section className="portfolio-grid-section" id="projects">
      <div className="container">
        {/* Section Header */}
        <div className="why-top-layout about-section-top-mb60">
          <div className="why-col-left">
            <span className="why-section-label">+ FEATURED WORK</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Crafted with precision, <br />
              <span className="highlight-focus">driven by performance</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Browse our latest IT Solutions, Web Development projects, UI/UX designs, and Digital Marketing growth campaigns.
            </p>
          </div>
        </div>

        {/* Filter Category Bar */}
        <div className="services-filter-bar">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`services-filter-chip ${activeFilter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Bento / Grid */}
        <div className="portfolio-projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="portfolio-card">
              {/* Image Preview Box */}
              <div className="portfolio-card-img-box">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="portfolio-card-img"
                />
                <div className="portfolio-card-overlay" />
                <span className="portfolio-metric-pill">{project.metric}</span>
              </div>

              {/* Card Body */}
              <div className="portfolio-card-body">
                <div className="portfolio-card-meta">
                  <span className="portfolio-cat-badge">{project.category}</span>
                  <span className="portfolio-client-name">{project.client}</span>
                </div>

                <h3 className="portfolio-card-title">{project.title}</h3>
                <p className="portfolio-card-desc">{project.desc}</p>

                {/* Tech Pills */}
                <div className="portfolio-tech-list">
                  {project.techStack.map((tech, idx) => (
                    <span key={idx} className="portfolio-tech-pill">
                      ✦ {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="portfolio-card-footer">
                <Link href={project.link} className="portfolio-action-btn">
                  <span>View Case Study</span>
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
