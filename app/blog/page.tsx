import { getPublishedBlogs, getBlogCategories } from "@/lib/blogApi";
import Image from "next/image";
import Link from "next/link";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata = {
  title: "Blog & Insights | Entec Media",
  description: "Explore the latest insights, web design trends, engineering articles, and digital strategy thought leadership from Entec Media.",
};

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function BlogListingPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const category = resolvedParams.category || "";
  const search = resolvedParams.search || "";

  const [{ blogs, pagination }, categories] = await Promise.all([
    getPublishedBlogs({ page, limit: 9, category, search }),
    getBlogCategories(),
  ]);

  const featuredPost = blogs.length > 0 ? blogs[0] : null;
  const remainingBlogs = blogs.length > 1 ? blogs.slice(1) : (blogs.length === 1 ? blogs : []);

  return (
    <div className="blog-page-wrapper">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ OUR BLOG &amp; JOURNAL</span>
          </div>
          <div className="why-col-center">
            <h1 className="why-main-title">
              Fresh insights &amp; <br />
              <span className="highlight-focus">thought leadership</span>
            </h1>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Discover articles on Next.js engineering, UI/UX design, digital marketing campaigns, and technology trends written by the Entec Media team.
            </p>
          </div>
        </div>

        {/* Toolbar Row: Categories Chips + Search Input */}
        <div className="blog-toolbar-row">
          <div className="portfolio-filter-bar" style={{ margin: 0 }}>
            <Link
              href="/blog"
              className={`portfolio-filter-chip ${category === "" && search === "" ? "active" : ""}`}
            >
              All Articles
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`portfolio-filter-chip ${category === cat.slug ? "active" : ""}`}
              >
                {cat.name} ({cat.published_blogs_count || 0})
              </Link>
            ))}
          </div>

          {/* Search Input Form */}
          <form action="/blog" method="GET" className="blog-search-form">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="text"
              name="search"
              placeholder="Search articles..."
              defaultValue={search}
              className="blog-search-input"
            />
            <button type="submit" className="blog-search-btn" title="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        {/* Empty State Fallback */}
        {blogs.length === 0 && (
          <div className="blog-empty-card">
            <h3 className="blog-empty-title">No articles found</h3>
            <p className="blog-empty-desc">
              We couldn&apos;t find any published articles matching your selected category or search filter.
            </p>
            <Link href="/blog" className="all-case-studies-button">
              <span>View All Articles</span>
            </Link>
          </div>
        )}

        {/* Featured Post Hero Card (When on Page 1 without active search) */}
        {featuredPost && page === 1 && !search && (
          <div className="blog-featured-card">
            <div className="blog-featured-img-box">
              <Image
                src={featuredPost.featured_image_url || "/images/aboutimg.png"}
                alt={featuredPost.featured_image_alt || featuredPost.title}
                fill
                sizes="(max-width: 991px) 100vw, 50vw"
                className="blog-card-image"
                priority
              />
            </div>
            <div className="blog-featured-body">
              <div className="blog-featured-meta">
                <span className="portfolio-cat-badge">{featuredPost.category_name || "Featured"}</span>
                <span className="blog-featured-date">{featuredPost.formatted_date}</span>
              </div>
              <h2 className="blog-featured-title">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="blog-featured-excerpt">
                {featuredPost.excerpt}
              </p>
              <div>
                <Link href={`/blog/${featuredPost.slug}`} className="portfolio-action-btn" style={{ color: "#60a5fa" }}>
                  <span>Read Featured Article</span>
                  <span className="action-btn-arrow">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Bento Grid */}
        {remainingBlogs.length > 0 && (
          <div className="portfolio-projects-grid" style={{ marginBottom: "60px" }}>
            {remainingBlogs.map((post) => (
              <div key={post.id} className="portfolio-card">
                <div className="portfolio-card-img-box">
                  <Image
                    src={post.featured_image_url || "/images/aboutimg.png"}
                    alt={post.featured_image_alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="portfolio-card-img"
                  />
                  <div className="portfolio-card-overlay" />
                  <span className="portfolio-metric-pill">{post.formatted_date}</span>
                </div>

                <div className="portfolio-card-body">
                  <div className="portfolio-card-meta">
                    <span className="portfolio-cat-badge">{post.category_name || "Journal"}</span>
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
              <Link
                href={`/blog?page=${page - 1}${category ? `&category=${category}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className="portfolio-filter-chip"
              >
                ← Previous
              </Link>
            )}
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#4b5563", padding: "0 12px" }}>
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            {pagination.has_next && (
              <Link
                href={`/blog?page=${page + 1}${category ? `&category=${category}` : ""}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className="portfolio-filter-chip"
              >
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
