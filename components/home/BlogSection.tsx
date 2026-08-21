"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogs, BlogPost as ApiBlogPost } from "@/lib/blogApi";
import { blogsData } from "@/data/blogs";

export default function BlogSection() {
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<any[]>([]);

  // Intersection Observer for scroll entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Fetch dynamic published blogs from PHP API with fallback
  useEffect(() => {
    async function loadDynamicBlogs() {
      try {
        const { blogs: apiBlogs } = await getPublishedBlogs({ limit: 4 });
        if (apiBlogs && apiBlogs.length > 0) {
          const mapped = apiBlogs.map((b: ApiBlogPost, idx: number) => ({
            id: b.id,
            title: b.title,
            category: b.category_name || "Insight",
            date: b.formatted_date || b.published_at || "Recent",
            description: b.excerpt,
            image: b.featured_image_url || "/images/aboutimg.png",
            imgHeight: idx % 2 === 0 ? "350px" : "220px",
            slug: b.slug,
          }));
          setBlogs(mapped);
          return;
        }
      } catch (e) {
        // Silently catch and fallback to blogsData
      }
      setBlogs(blogsData.slice(0, 4));
    }
    loadDynamicBlogs();
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : blogsData.slice(0, 4);

  return (
    <section id="blog" ref={sectionRef} className="blog-section">
      <div className="container">

        {/* Top 3-Column Layout matching Why Choose Us */}
        <div className={`why-top-layout reveal-item ${isRevealed ? "revealed" : ""}`}>

          {/* Left Column: Label */}
          <div className="why-col-left">
            <span className="why-section-label">+ INSIGHTS</span>
          </div>

          {/* Center Column: Heading */}
          <div className="why-col-center">
            <h2 className="why-main-title">
              Ideas <span className="highlight-focus">that</span><br />
              move brands
            </h2>
          </div>

          {/* Right Column: Sidebar Description */}
          <div className="why-col-right">
            <p className="why-header-desc">
              Practical perspectives on shaping thoughtful strategy and elevating distinctive brand identity.
            </p>
          </div>

        </div>

        {/* 4-Column Bento Blog Grid */}
        <div className={`blog-grid reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.15s" }}>
          {displayBlogs.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-card"
            >
              {/* Image Box with Dynamic Height */}
              <div
                className="blog-card-image-box"
                style={{ height: post.imgHeight || "250px" }}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="blog-card-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Text Content */}
              <div className="blog-card-content">
                <span className="blog-card-date">{post.date}</span>
                <h4 className="blog-card-title">{post.title}</h4>
                <p className="blog-card-desc">{post.description}</p>

                {/* Footer read link */}
                <div className="blog-card-link-row">
                  <span className="blog-card-read-link">Read more about this</span>
                  <div className="cta-dots-vertical">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Bottom CTA Row */}
        <div className={`blog-bottom-bar reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.25s" }}>
          <div className="blog-bottom-left">
            <h3 className="why-main-title blog-bottom-headline-small">Good ideas deserve<br /><span className="highlight-focus">deeper exploration.</span></h3>
          </div>
          <div className="blog-bottom-right">
            <span className="blog-bottom-sublabel">Fresh ideas published regularly</span>
            <Link href="/blog" className="all-case-studies-button blog-cta-button">
              <span>Read more Insights</span>
              <div className="cta-dots-vertical">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
