"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import team1Img from "@/public/images/team1.png";
import team2Img from "@/public/images/team2.png";
import team3Img from "@/public/images/team3.png";
import team4Img from "@/public/images/team4.png";

export interface ServiceItemData {
  id: string;
  slug: string;
  num: string;
  title: string;
  desc: string;
  img: string;
}

const servicesData: ServiceItemData[] = [
  {
    id: "01",
    slug: "brand-identity",
    num: "01",
    title: "Brand Identity",
    desc: "From naming to complete visual systems, we craft brand identities that are bold, strategic, and unmistakably yours.",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "02",
    slug: "website-design",
    num: "02",
    title: "Website Design",
    desc: "We design modern, responsive websites built for performance, usability, and long-term scalability across platforms.",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "03",
    slug: "digital-products",
    num: "03",
    title: "Digital Products",
    desc: "From apps to platforms, we create intuitive, human-centered experiences that solve real problems beautifully.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "04",
    slug: "physical-product-design",
    num: "04",
    title: "Physical Product Design",
    desc: "We collaborate on packaging and product design that elevates every touchpoint—from digital to physical.",
    img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "05",
    slug: "marketing-campaigns",
    num: "05",
    title: "Marketing Campaigns",
    desc: "End-to-end creative for campaigns that launch, position, and amplify—across digital, social, and beyond.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "06",
    slug: "motion-content",
    num: "06",
    title: "Motion & Content",
    desc: "We craft scroll-stopping animations, Lottie files, and video content that bring brands to life in motion and engage audiences.",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "07",
    slug: "strategy-positioning",
    num: "07",
    title: "Strategy & Positioning",
    desc: "Clear thinking before clean design—we help brands find their voice, purpose, and point of view in the market.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "08",
    slug: "photography",
    num: "08",
    title: "Photography",
    desc: "Art direction, production, and editing for lifestyle, editorial, and product photography that tells a visual story.",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "09",
    slug: "video-production",
    num: "09",
    title: "Video Production",
    desc: "Cinematic storytelling, brand films, and short-form video for campaigns, social, and everything in between.",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&auto=format&fit=crop&q=60"
  }
];

export default function Services() {
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
          const getListHeight = () => {
            // 176px per item + 60px blank row
            return 176 * servicesData.length + 60;
          };

          const getScrollDistance = () => {
            const viewportHeight = getViewportHeight();
            const listHeight = getListHeight();
            return Math.max(0, listHeight - viewportHeight);
          };

          const rows = gsap.utils.toArray(".service-row-link");

          // Initialize states (fully visible by default, matching CSS)
          gsap.set(".services-sticky-gsap", { opacity: 1, x: 0 });
          gsap.set(rows, { opacity: 0.65, y: 0, scale: 1 });
          gsap.set(".services-cta-gsap", { opacity: 1, y: 0 });

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

          // Translate right services list upward on scroll
          tl.to(listRef.current, {
            y: () => -getScrollDistance(),
            ease: "none",
            duration: 1
          }, 0);

          // Active row highlighting centered in viewport
          rows.forEach((row: any) => {
            const rowCenter = row.offsetTop + row.offsetHeight / 2;
            const targetY = rowCenter - (getViewportHeight() / 2);

            const activeFraction = getScrollDistance() > 0 ? Math.max(0, Math.min(1, targetY / getScrollDistance())) : 0;
            const activeTime = activeFraction * 1;
            const duration = 0.15;

            tl.to(row, {
              opacity: 1,
              scale: 1.02,
              duration: duration / 2,
              ease: "power2.out"
            }, Math.max(0, activeTime - duration / 2));

            tl.to(row, {
              opacity: 0.65,
              scale: 1,
              duration: duration / 2,
              ease: "power2.in"
            }, activeTime);
          });
        });

        mm.add("(max-width: 992px)", () => {
          gsap.set(containerRef.current, { clearProps: "all" });
          gsap.set(listRef.current, { clearProps: "all" });
          gsap.set(".services-sticky-gsap", { clearProps: "all" });
          gsap.set(".service-row-link", { clearProps: "all" });
          gsap.set(".services-cta-gsap", { clearProps: "all" });
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
    <section id="services" className="services-dark-section" ref={containerRef}>
      <div className="container">
        <div className="services-grid">

          {/* Left Column: Editorial Sticky Title */}
          <div className="services-col-left">
            <div className="services-sticky-content services-sticky-pin-trigger" ref={leftRef}>
              <div className="services-sticky-inner services-sticky-gsap">
                <span className="services-section-label">✦ Services</span>
                <h2 className="services-main-title">
                  <span className="highlight-focus">Our</span> focus
                </h2>
                <p className="services-main-desc">
                  A complete yet focused range of services, created to support ambitious brands at every stage of their growth journey.
                </p>


                {/* Bottom Collaboration Box */}
                <div className="collab-wrapper services-cta services-cta-no-anim">
                  <p className="collab-label">Ready to start something great?</p>
                  <Link href="/contact" className="collab-box services-cta-link">
                    <span className="collab-text">Let&apos;s Collaborate</span>
                    <div className="collab-dots">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </Link>
                </div>


              </div>
            </div>
          </div>

          {/* Right Column: Scrolling Bento-Grid Rows */}
          <div className="services-col-right">
            <div ref={listRef} className="services-list-container">
              <div className="services-list">
                {/* Blank row for spacing and grid border alignments at the top */}
                <div className="service-row service-blank-row">
                  <div className="service-cell service-number-cell"></div>
                  <div className="service-cell service-thumb-cell"></div>
                  <div className="service-cell service-title-cell"></div>
                  <div className="service-cell service-desc-cell"></div>
                </div>

                {servicesData.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="service-row-link service-row-item-gsap"
                    aria-label={`Explore our ${service.title} service`}
                  >
                    <div className="service-row">
                      {/* Number with Star */}
                      <div className="service-cell service-number-cell">
                        <span className="service-number">
                          <span className="service-num-star">✦</span> {service.num}
                        </span>
                      </div>

                      {/* Thumbnail */}
                      <div className="service-cell service-thumb-cell">
                        <div className="service-thumb-container">
                          <img
                            src={service.img}
                            alt=""
                            loading="lazy"
                            className="service-thumb-img"
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <div className="service-cell service-title-cell">
                        <h3 className="service-row-title">{service.title}</h3>
                      </div>

                      {/* Description */}
                      <div className="service-cell service-desc-cell">
                        <p className="service-row-desc">{service.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>



            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
