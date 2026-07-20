"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ProjectItemData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  desc: string;
  img: string;
}

const projectsData: ProjectItemData[] = [
  {
    id: "01",
    slug: "vitalic",
    title: "Vitalic",
    subtitle: "Personal training & coaching Framer template",
    category: "Fitness & Lifestyle",
    year: "2025",
    client: "Vitalic Inc.",
    desc: "Vitalic is a fitness Framer template built for personal trainers and coaches who want a site that feels as considered as their coaching. It features a dark, editorial aesthetic with a complete content system, a 12-section homepage, CMS blog, programs and pricing, and legal pages.",
    img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: "02",
    slug: "kudos",
    title: "Kudos",
    subtitle: "Creative portfolio website template",
    category: "Creative & Design",
    year: "2025",
    client: "Kudos Studio",
    desc: "Kudos is a modern portfolio Framer template for studios, agencies, and independent creators. Engineered for high performance, smooth scroll animations, and minimalist visuals, it provides an exceptional framework for showcasing work.",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: "03",
    slug: "solana",
    title: "Solana",
    subtitle: "Web3 ecosystem dashboard interface",
    category: "Blockchain & Fintech",
    year: "2024",
    client: "Solana Labs",
    desc: "A live crypto dashboard tracking blockchain node metrics, transaction histories, wallet addresses, and network latency. Built using Next.js, tailwind-based components, and high-frequency WebSockets to provide sub-second updates.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80"
  },
  {
    id: "04",
    slug: "aura",
    title: "Aura",
    subtitle: "Premium e-commerce skincare brand",
    category: "E-Commerce & Retail",
    year: "2024",
    client: "Aura Skincare",
    desc: "Aura is a minimalist skincare brand Shopify platform optimized for lightning-fast page loading, high-converting product detail pages, and editorial aesthetic. Built to handle massive concurrent traffic spikes.",
    img: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=700&auto=format&fit=crop&q=80"
  }
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: any;
    let resizeTimeout: any;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 993px)", () => {
          const getViewportHeight = () => containerRef.current?.offsetHeight || window.innerHeight;
          const getGridHeight = () => {
            const gridEl = containerRef.current?.querySelector(".projects-grid");
            return gridEl?.clientHeight || window.innerHeight - 250;
          };
          const getListHeight = () => {
            return listRef.current?.scrollHeight || (180 + 680 * projectsData.length);
          };

          const getScrollDistance = () => {
            const gridHeight = getGridHeight();
            const listHeight = getListHeight();
            return Math.max(0, listHeight - gridHeight);
          };

          const cards = gsap.utils.toArray(".project-card");

          // Initialize states
          gsap.set(".projects-sticky-gsap", { opacity: 1, y: 0 });
          gsap.set(cards, { opacity: 0.85, scale: 1 });

          // Single timeline and ScrollTrigger instance for pinning the section
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              pin: true,
              scrub: 0.1,
              start: "top top",
              end: () => `+=${getScrollDistance()}`,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          });

          // Translate right projects list upward on scroll
          tl.to(listRef.current, {
            y: () => -getScrollDistance(),
            ease: "none",
            duration: 1
          }, 0);

          // Subtle card scale/opacity highlight on scroll
          cards.forEach((card: any) => {
            const cardCenter = card.offsetTop + card.offsetHeight / 2;
            const targetY = cardCenter - (getGridHeight() / 2);

            const activeFraction = getScrollDistance() > 0 ? Math.max(0, Math.min(1, targetY / getScrollDistance())) : 0;
            const activeTime = activeFraction * 1;
            const duration = 0.2;

            tl.to(card, {
              opacity: 1,
              scale: 1.01,
              duration: duration / 2,
              ease: "power2.out"
            }, Math.max(0, activeTime - duration / 2));

            tl.to(card, {
              opacity: 0.85,
              scale: 1,
              duration: duration / 2,
              ease: "power2.in"
            }, activeTime);
          });
        });

        mm.add("(max-width: 992px)", () => {
          gsap.set(containerRef.current, { clearProps: "all" });
          gsap.set(listRef.current, { clearProps: "all" });
          gsap.set(".projects-sticky-gsap", { clearProps: "all" });
          gsap.set(".project-card", { clearProps: "all" });
        });

      }, containerRef);

      ScrollTrigger.refresh();
    };

    initGSAP();

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (ctx) {
          ctx.revert();
        }
        initGSAP();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  return (
    <section id="projects" className="projects-light-section" ref={containerRef}>
      <div className="container">
        {/* Main Grid */}
        <div className="projects-grid">
          {/* Left Column: Sticky Summary & Stats Grid */}
          <div className="projects-col-left">
            <div className="projects-sticky-content projects-sticky-pin-trigger" ref={leftRef}>
              <div className="projects-sticky-inner projects-sticky-gsap">
                {/* Section Label at the top of left sticky column */}
                <span className="projects-section-label">
                  ✦ Featured Projects
                </span>

                <p className="projects-sticky-desc">
                  A curated selection of <strong>work shaped by strategy, creativity, and thoughtful execution</strong>, crafted to help brands stand out and grow with confidence.
                </p>

                {/* Stats Grid */}
                <div className="projects-stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Year</span>
                    <span className="stat-num">2025</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Brands</span>
                    <span className="stat-num">88</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Websites</span>
                    <span className="stat-num">136</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Space</span>
                    <span className="stat-num">56%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Users</span>
                    <span className="stat-num">22M+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Header & MacBook Cards */}
          <div className="projects-col-right">
            <div ref={listRef} className="projects-scroll-container">
              {/* Header Row is now part of the scrolling container! */}
              <div className="projects-header-right-col">
                <div className="projects-header-title-box">
                  <h2 className="why-main-title"><span className="text-gradient">Created</span> for<br />with clear purpose</h2>
                </div>
                <div className="projects-header-desc-box">
                  <p className="projects-section-desc">
                    Real projects, real challenges, and real results, crafted with clarity, creativity, and purpose.
                  </p>
                </div>
              </div>

              <div className="projects-list">
                {projectsData.map((project) => (
                  <div key={project.id} className="project-card">
                    {/* Left: Vector MacBook Mockup */}
                    <div className="project-mockup-col">
                      <div className="macbook-mockup">
                        <div className="macbook-bezel">
                          <div className="macbook-camera"></div>
                          <div className="macbook-screen">
                            <img
                              src={project.img}
                              alt={`${project.title} screenshot`}
                              className="macbook-screenshot"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="macbook-base">
                          <div className="macbook-notch"></div>
                        </div>
                        <div className="macbook-shadow"></div>
                      </div>
                    </div>

                    {/* Right: Project Details & Link */}
                    <div className="project-info-col">
                      <span className="project-card-category">✦ {project.category}</span>
                      <h3 className="project-card-title">{project.title}</h3>
                      <p className="project-card-subtitle">{project.subtitle}</p>

                      <div className="project-meta-row">
                        <div className="project-meta-item">
                          <span className="meta-label">Year</span>
                          <span className="meta-val">{project.year}</span>
                        </div>
                        <div className="project-meta-item">
                          <span className="meta-label">Client</span>
                          <span className="meta-val">{project.client}</span>
                        </div>
                      </div>

                      <p className="project-card-desc">{project.desc}</p>

                      {/* Collab-style button */}
                      <Link href={`/projects/${project.slug}`} className="project-cta-button" aria-label={`View ${project.title} case study`}>
                        <span className="project-cta-text">View case study</span>
                        <div className="project-cta-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Other Projects Row */}
              <div className="other-projects-row">
                <div className="other-projects-left">
                  <span className="other-projects-label">+ OTHER PROJECTS</span>
                </div>
                <div className="other-projects-right">
                  <div className="other-projects-middle">
                    <span className="other-projects-sublabel">Keep exploring our work</span>
                    <div className="other-projects-links">
                      <div className="other-project-link-item">
                        <img src="/images/icons/xzero.png" alt="XZERO" className="other-project-icon" />
                        <span>+XZERO®</span>
                      </div>
                      <div className="other-project-separator"></div>
                      <div className="other-project-link-item">
                        <img src="/images/icons/neozen.png" alt="Neozen" className="other-project-icon" />
                        <span>Neozen</span>
                      </div>
                      <div className="other-project-separator"></div>
                      <div className="other-project-link-item">
                        <img src="/images/icons/predict.png" alt="Predict" className="other-project-icon" />
                        <span>Predict</span>
                      </div>
                      <div className="other-project-separator"></div>
                      <div className="other-project-link-item">
                        <img src="/images/icons/quomi.png" alt="Quomi" className="other-project-icon" />
                        <span>Quomi</span>
                      </div>
                    </div>
                  </div>
                  <div className="other-projects-cta">
                    <span className="other-projects-sublabel-right">See what we&apos;ve built</span>
                    <Link href="/projects" className="all-case-studies-button">
                      <span>All case studies</span>
                      <div className="cta-dots-vertical">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
