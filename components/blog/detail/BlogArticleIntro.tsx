import Link from "next/link";
import ShareLinks from "@/components/shared/ShareLinks";
import { siteConfig } from "@/lib/siteConfig";
import { sizedImage } from "@/lib/servicesContent";
import type { BlogPost } from "@/lib/blogApi";
import type { BlogDetailContent } from "@/lib/blogContent";

interface BlogArticleIntroProps {
  blog: BlogPost;
  content: BlogDetailContent["intro"];
  minutes: number;
  minRead: string;
}

const formatDate = (iso?: string | null) =>
  iso && !Number.isNaN(new Date(iso).getTime())
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

/**
 * Article intro (light), right after the hero. Left: the featured image, large. Right: label, category
 * link, the article title, the excerpt as a lead, a facts grid (published, updated, reading time,
 * category) and the share buttons.
 * ≤1199px: image on top, details below.
 */
export default function BlogArticleIntro({ blog, content, minutes, minRead }: BlogArticleIntroProps) {
  const published = blog.formatted_date || formatDate(blog.published_at || blog.created_at);
  const updated = formatDate(blog.updated_at);

  const facts = [
    { label: content.publishedLabel, value: published },
    ...(updated && updated !== published ? [{ label: content.updatedLabel, value: updated }] : []),
    { label: content.readLabel, value: `${minutes} ${minRead}` },
    ...(blog.category_name ? [{ label: content.categoryLabel, value: blog.category_name }] : []),
  ].filter((f) => f.value);

  return (
    <section className="k-section bd-intro" data-theme="light" aria-labelledby="intro-title">
      <div className="container bd-intro-grid">
        <div className="bd-intro-media" data-kfx="y:80;opacity:0">
          <figure className="bd-intro-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sizedImage(blog.featured_image_url || "/images/aboutimg.webp", 1400)}
              alt={blog.featured_image_alt || blog.title}
              decoding="async"
            />
          </figure>
        </div>

        <div className="bd-intro-copy">
          <span className="why-section-label" data-kfx="y:40;opacity:0">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>
          {blog.category_name && blog.category_slug && (
            <Link href={`/blog/category/${blog.category_slug}`} className="bd-intro-cat" data-kfx="y:40;opacity:0">
              {blog.category_name}
            </Link>
          )}
          <h2 className="bd-intro-title" id="intro-title" data-kfx="y:56;opacity:0">
            {blog.title}
          </h2>
          {blog.excerpt && (
            <p className="bd-intro-lead" data-kfx="y:64;opacity:0">
              {blog.excerpt}
            </p>
          )}

          <dl className="bd-intro-facts" data-kfx="y:72;opacity:0">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="bd-share" data-kfx="y:72;opacity:0">
            <ShareLinks title={blog.title} url={`${siteConfig.url}/blog/${blog.slug}/`} text={blog.excerpt} label={content.shareLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
