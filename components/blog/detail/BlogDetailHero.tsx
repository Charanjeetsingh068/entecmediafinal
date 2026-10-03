import KButton from "@/components/shared/KButton";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import HeroBackdrop from "@/components/shared/HeroBackdrop";
import { sizedImage } from "@/lib/servicesContent";
import type { BlogPost } from "@/lib/blogApi";
import type { BlogDetailContent } from "@/lib/blogContent";

interface BlogDetailHeroProps {
  blog: BlogPost;
  content: BlogDetailContent["hero"];
  /** Page name for the breadcrumb ("Blog") */
  name: string;
  minutes: number;
}

/**
 * Article hero — dark, pinned like the service detail hero. Left: breadcrumb (Home › Blog › article),
 * category label, the title rising out of a mask, the excerpt, actions and two facts (published,
 * reading time).
 * Right (the same design on every article): an "editorial cover" — the featured photo as a slightly
 * tilted magazine cover on a stack of paper sheets, the photo kept clean; a badge with circling text over its lower left edge jumps to the article and a
 * reading-time chip floats beside the cover. The cover floats gently, the sheets breathe out of step.
 */
export default function BlogDetailHero({ blog, content, name, minutes }: BlogDetailHeroProps) {
  const image = blog.featured_image_url || "/images/aboutimg.webp";

  return (
    <section className="k-page-hero ab-hero bd-hero" data-theme="dark" aria-labelledby="article-title">
      <HeroBackdrop />

      <div className="container ab-hero-inner">
        <div className="ab-hero-copy">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: name, href: "/blog" },
              { label: blog.title, href: `/blog/${blog.slug}` },
            ]}
          />

          <span className="why-section-label ab-hero-label">
            <span className="k-accent-dot" aria-hidden="true" /> {blog.category_name || name}
          </span>

          <h1 className="ab-hero-title bd-hero-title" id="article-title">
            <span className="ab-line">
              <span style={{ animationDelay: "0.1s" }}>{blog.title}</span>
            </span>
          </h1>

          {blog.excerpt && <p className="ab-hero-desc">{blog.excerpt}</p>}

          <div className="ab-hero-actions">
            <KButton href={content.primaryCta.href} label={content.primaryCta.label} variant="dark" />
            <a href={content.secondaryCta.href} className="ab-hero-link">
              {content.secondaryCta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <dl className="sd-hero-facts">
            {blog.formatted_date && (
              <div>
                <dt>{content.publishedLabel}</dt>
                <dd>{blog.formatted_date}</dd>
              </div>
            )}
            <div>
              <dt>{content.readLabel}</dt>
              <dd>
                {minutes} {content.minRead}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bd-hero-art">
          <span className="bd-dots" aria-hidden="true" />

          <div className="bd-cover-wrap">
            <span className="bd-sheet bd-sheet-a" aria-hidden="true" />
            <span className="bd-sheet bd-sheet-b" aria-hidden="true" />
            <figure className="bd-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sizedImage(image, 1200)}
                srcSet={`${sizedImage(image, 700)} 700w, ${sizedImage(image, 1200)} 1200w`}
                sizes="(max-width: 1199px) 80vw, 34vw"
                alt={blog.featured_image_alt || blog.title}
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          </div>

          <a href={content.primaryCta.href} className="bd-badge" aria-label={content.primaryCta.label}>
            <svg className="bd-badge-ring" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <path id="bd-ring" d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
              </defs>
              <text>
                <textPath href="#bd-ring" textLength="230" lengthAdjust="spacing">
                  {content.badgeText}
                </textPath>
              </text>
            </svg>
            <svg className="bd-badge-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>

          <span className="sv-hero-chip bd-chip" aria-hidden="true">
            <span className="sv-hero-chip-dot" />
            {minutes} {content.minRead}
          </span>
        </div>
      </div>
    </section>
  );
}
