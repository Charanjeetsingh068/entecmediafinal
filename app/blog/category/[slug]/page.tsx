import { getPublishedBlogs, getBlogCategories } from "@/lib/blogApi";
import Image from "next/image";
import Link from "next/link";
import AboutCTA from "@/components/about/AboutCTA";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getBlogCategories();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) {
    return { title: "Category Not Found | Entec Media" };
  }

  return {
    title: cat.meta_title || `${cat.name} Articles | Entec Media Blog`,
    description: cat.meta_description || cat.description || `Explore latest articles in ${cat.name}.`,
  };
}

export default async function CategoryArchivePage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);

  const categories = await getBlogCategories();
  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const { blogs, pagination } = await getPublishedBlogs({
    page,
    limit: 9,
    category: slug,
  });

  return (
    <div className="blog-category-wrapper" style={{ paddingTop: "100px" }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div className="service-breadcrumbs">
          <Link href="/" className="crumb-link">Home</Link>
          <span className="crumb-sep">/</span>
          <Link href="/blog" className="crumb-link">Blog</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{currentCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ CATEGORY</span>
          </div>
          <div className="why-col-center">
            <h1 className="why-main-title">
              {currentCategory.name} <br />
              <span className="highlight-focus">articles &amp; guides</span>
            </h1>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              {currentCategory.description || `Articles and publications focused on ${currentCategory.name}.`}
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="portfolio-filter-bar">
          <Link href="/blog" className="portfolio-filter-chip">
            All Articles
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className={`portfolio-filter-chip ${cat.slug === slug ? "active" : ""}`}
            >
              {cat.name} ({cat.published_blogs_count || 0})
            </Link>
          ))}
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="card" style={{ padding: "60px 24px", textAlign: "center", margin: "40px 0", background: "#f8f9fa", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>No articles in this category</h3>
            <p style={{ color: "#6b7280", fontSize: "14.5px" }}>Check back soon for new articles in {currentCategory.name}.</p>
          </div>
        ) : (
          <div className="portfolio-projects-grid" style={{ marginBottom: "60px" }}>
            {blogs.map((post) => (
              <div key={post.id} className="portfolio-card">
                <div className="portfolio-card-img-box">
                  <Image
                    src={post.featured_image_url || "/images/aboutimg.png"}
                    alt={post.featured_image_alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="portfolio-card-img"
                  />
                  <span className="portfolio-metric-pill">{post.formatted_date}</span>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-cat-badge">{post.category_name}</span>
                    <span className="portfolio-client-name">By {post.author_name}</span>
                  </div>

                  <h3 className="portfolio-card-title">
                    <Link href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="portfolio-card-desc">{post.excerpt}</p>
                </div>

                <div className="portfolio-card-footer">
                  <Link href={`/blog/${post.slug}`} className="portfolio-action-btn">
                    <span>Read Article</span>
                    <span className="action-btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.total_pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", margin: "40px 0 80px" }}>
            {pagination.has_prev && (
              <Link href={`/blog/category/${slug}?page=${page - 1}`} className="portfolio-filter-chip">
                ← Previous
              </Link>
            )}
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#4b5563" }}>
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            {pagination.has_next && (
              <Link href={`/blog/category/${slug}?page=${page + 1}`} className="portfolio-filter-chip">
                Next →
              </Link>
            )}
          </div>
        )}
      </div>

      <AboutCTA />
    </div>
  );
}
