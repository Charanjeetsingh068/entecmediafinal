"use client";

import Image from "next/image";

interface PortfolioGalleryProps {
  images: string[];
  title: string;
}

export default function PortfolioGallery({ images, title }: PortfolioGalleryProps) {
  return (
    <section className="portfolio-gallery-section">
      <div className="container">
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ VISUAL SHOWCASE</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Project gallery &amp; <span className="highlight-focus">ui showcase</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              High-resolution captures of responsive web views, component design systems, and visual layouts.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="portfolio-gallery-grid">
          {images.map((imgSrc, idx) => (
            <div key={idx} className="portfolio-gallery-card">
              <Image
                src={imgSrc}
                alt={`${title} Gallery image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="portfolio-gallery-img"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
