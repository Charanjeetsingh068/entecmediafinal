import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogApi";
import ShareLinks from "@/components/shared/ShareLinks";
import BlogSection from "@/components/home/BlogSection";
import AboutCTA from "@/components/about/AboutCTA";
import { siteConfig } from "@/lib/siteConfig";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const { blogs } = await getPublishedBlogs({ limit: 1000 });
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Post Not Found" };

  const title = blog.meta_title || blog.title;
  const description = blog.meta_description || blog.excerpt;
  const imageUrl = blog.featured_image_url || undefined;

  return {
    title,
    description,
    alternates: { canonical: blog.canonical_url || `/blog/${blog.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
      authors: [blog.author_name],
      images: imageUrl ? [{ url: imageUrl, alt: blog.featured_image_alt || blog.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: imageUrl ? [imageUrl] : undefined },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const { blog, relatedBlogs } = await getBlogBySlug(slug);
  if (!blog) notFound();

  const wordCount = (blog.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featured_image_url ? [blog.featured_image_url] : [],
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.published_at || blog.created_at,
    author: { "@type": "Person", name: blog.author_name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/darklogo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${blog.slug}` },
  };

  return (
    <div className="k-page k-detail-page blog-detail-wrapper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="k-detail-hero k-article-hero" data-theme="light">
        <div className="container k-detail-hero-grid">
          <div className="k-detail-hero-side">
            <Link href="/blog" className="k-back-link">
              <span aria-hidden="true">←</span> BACK TO ARTICLES
            </Link>
            <span className="k-mono-label">{blog.formatted_date}</span>
            <span className="k-mono-label">{readingMinutes} min read</span>
          </div>
          <div className="k-detail-hero-main">
            <h1 className="k-detail-title k-article-title">{blog.title}</h1>
          </div>
        </div>
      </section>

      <section className="k-detail-body" data-theme="light">
        <div className="container k-detail-grid">
          <aside className="k-detail-sidebar">
            {blog.category_name && (
              <div className="k-side-block">
                <span className="k-mono-label">Categories:</span>
                <ul className="k-side-list">
                  <li>
                    <Link href={`/blog/category/${blog.category_slug}`}>{blog.category_name}</Link>
                  </li>
                  {blog.tags?.map((tag) => (
                    <li key={tag.id}>#{tag.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="k-side-block">
              <span className="k-mono-label">An article by</span>
              <div className="k-author">
                <span className="k-author-initial">{blog.author_name.charAt(0)}</span>
                <div>
                  <p className="k-author-name">{blog.author_name}</p>
                  <p className="k-author-role">Entec Media</p>
                </div>
              </div>
            </div>
            <ShareLinks title={blog.title} />
          </aside>

          <article className="k-detail-content">
            {blog.featured_image_url && (
              <div className="k-detail-media k-article-media">
                <Image
                  src={blog.featured_image_url}
                  alt={blog.featured_image_alt || blog.title}
                  fill
                  sizes="(max-width: 1199px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
            <p className="k-detail-lead">{blog.excerpt}</p>
            <div className="blog-content-body" dangerouslySetInnerHTML={{ __html: blog.content || "" }} />
          </article>
        </div>
      </section>

      <BlogSection posts={relatedBlogs.slice(0, 4)} />
      <AboutCTA source={`blog-${blog.slug}`} />
    </div>
  );
}
