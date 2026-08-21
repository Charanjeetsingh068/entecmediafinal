import { getBlogBySlug } from "@/lib/blogApi";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AboutCTA from "@/components/about/AboutCTA";
import { Metadata } from "next";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Entec Media",
    };
  }

  const title = blog.meta_title || `${blog.title} | Entec Media Blog`;
  const description = blog.meta_description || blog.excerpt;
  const imageUrl = blog.featured_image_url || undefined;

  return {
    title,
    description,
    alternates: blog.canonical_url ? { canonical: blog.canonical_url } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
      authors: [blog.author_name],
      images: imageUrl ? [{ url: imageUrl, alt: blog.featured_image_alt || blog.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const { blog, relatedBlogs } = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Calculate estimated reading time
  const wordCount = (blog.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.featured_image_url ? [blog.featured_image_url] : [],
    "datePublished": blog.published_at || blog.created_at,
    "dateModified": blog.updated_at || blog.published_at || blog.created_at,
    "author": {
      "@type": "Person",
      "name": blog.author_name,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Entec Media",
      "logo": {
        "@type": "ImageObject",
        "url": "https://entecmedia.com/images/darklogo.svg",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://entecmedia.com/blog/${blog.slug}`,
    },
  };

  return (
    <div className="blog-detail-wrapper">
      {/* Dynamic JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container">
        {/* Breadcrumbs */}
        <div className="service-breadcrumbs">
          <Link href="/" className="crumb-link">Home</Link>
          <span className="crumb-sep">/</span>
          <Link href="/blog" className="crumb-link">Blog</Link>
          <span className="crumb-sep">/</span>
          {blog.category_slug && (
            <>
              <Link href={`/blog/category/${blog.category_slug}`} className="crumb-link">
                {blog.category_name}
              </Link>
              <span className="crumb-sep">/</span>
            </>
          )}
          <span className="crumb-active">{blog.title}</span>
        </div>

        {/* Article Hero */}
        <div className="portfolio-hero-content blog-detail-hero-box">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span className="why-section-label">+ {blog.category_name || "ARTICLE"}</span>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>• {readingMinutes} min read</span>
          </div>

          <h1 className="service-hero-title">{blog.title}</h1>
          <p className="service-hero-subtitle">{blog.excerpt}</p>

          <div className="blog-author-strip">
            <div className="blog-author-avatar">
              {blog.author_name.charAt(0)}
            </div>
            <div>
              <span style={{ fontSize: "14px", fontWeight: "800", color: "#111827", display: "block" }}>{blog.author_name}</span>
              <span style={{ fontSize: "12.5px", color: "#6b7280" }}>Published on {blog.formatted_date}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.featured_image_url && (
          <div className="service-hero-img-box" style={{ maxWidth: "1000px", margin: "0 auto 60px", height: "480px" }}>
            <Image
              src={blog.featured_image_url}
              alt={blog.featured_image_alt || blog.title}
              fill
              sizes="100vw"
              className="service-hero-img"
              priority
            />
          </div>
        )}

        {/* Article Body Content */}
        <article
          className="blog-content-body"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        {/* Tags Section */}
        {blog.tags && blog.tags.length > 0 && (
          <div style={{ maxWidth: "780px", margin: "0 auto 60px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#6b7280", letterSpacing: "0.06em" }}>TAGS:</span>
            {blog.tags.map((tag) => (
              <span key={tag.id} className="meta-tag-pill">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div style={{ padding: "80px 0 60px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="why-top-layout about-section-top-mb50">
              <div className="why-col-left">
                <span className="why-section-label">+ CONTINUE READING</span>
              </div>
              <div className="why-col-center">
                <h2 className="why-main-title">
                  Related <span className="highlight-focus">articles &amp; insights</span>
                </h2>
              </div>
            </div>

            <div className="portfolio-projects-grid">
              {relatedBlogs.map((rel) => (
                <div key={rel.id} className="portfolio-card">
                  <div className="portfolio-card-img-box">
                    <Image
                      src={rel.featured_image_url || "/images/aboutimg.png"}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="portfolio-card-img"
                    />
                    <span className="portfolio-metric-pill">{rel.formatted_date}</span>
                  </div>

                  <div className="portfolio-card-body">
                    <div className="portfolio-card-meta">
                      <span className="portfolio-cat-badge">{rel.category_name || "Article"}</span>
                    </div>

                    <h3 className="portfolio-card-title">
                      <Link href={`/blog/${rel.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {rel.title}
                      </Link>
                    </h3>
                    <p className="portfolio-card-desc">{rel.excerpt}</p>
                  </div>

                  <div className="portfolio-card-footer">
                    <Link href={`/blog/${rel.slug}`} className="portfolio-action-btn">
                      <span>Read Article</span>
                      <span className="action-btn-arrow">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AboutCTA />
    </div>
  );
}
