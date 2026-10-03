import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailHero from "@/components/blog/detail/BlogDetailHero";
import BlogArticleIntro from "@/components/blog/detail/BlogArticleIntro";
import BlogArticleBody from "@/components/blog/detail/BlogArticleBody";
import BlogSection from "@/components/home/BlogSection";
import {
  getBlogBySlug,
  getBlogCategories,
  getBlogDetailContent,
  getBlogPageContent,
  getBlogTags,
  getPublishedBlogs,
  prepareArticle,
  readingMinutes,
} from "@/lib/blogApi";
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
      url: `/blog/${blog.slug}`,
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
      modifiedTime: blog.updated_at || undefined,
      authors: [blog.author_name],
      section: blog.category_name,
      tags: blog.tags?.map((t) => t.name),
      images: imageUrl ? [{ url: imageUrl, alt: blog.featured_image_alt || blog.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: imageUrl ? [imageUrl] : undefined },
  };
}

/**
 * Article page: hero + breadcrumb with the editorial cover (dark, pinned — the body slides over it) →
 * intro: featured image beside the title, lead, facts and share (light) → the article with its
 * sidebar: search, categories, recent posts, tags, sticky help card (white) → recent posts in
 * the home page Insights panels (light) → footer.
 * Content: the article from the Blog CMS (lib/blogApi.ts), shared copy from lib/blogContent.ts.
 */
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const [{ blog, relatedBlogs }, { blogs }, categories, content, pageContent] = await Promise.all([
    getBlogBySlug(slug),
    getPublishedBlogs({ limit: 1000 }),
    getBlogCategories(),
    getBlogDetailContent(),
    getBlogPageContent(),
  ]);
  if (!blog) notFound();

  const tags = await getBlogTags(blog.tags ?? []);
  const { html } = prepareArticle(blog.content || "");
  const minutes = readingMinutes(blog);
  const index = blogs.findIndex((b) => b.slug === blog.slug);
  // The list is newest first: "previous" is the older article, "next" the newer one
  const prev = index >= 0 ? blogs[index + 1] : undefined;
  const next = index > 0 ? blogs[index - 1] : undefined;
  const others = blogs.filter((b) => b.slug !== blog.slug);
  // Recent posts panels: related articles first, topped up with the newest ones
  const recentPanels = [...relatedBlogs, ...others].filter((b, i, arr) => b.slug !== blog.slug && arr.findIndex((x) => x.slug === b.slug) === i).slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featured_image_url ? [blog.featured_image_url] : [],
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.published_at || blog.created_at,
    articleSection: blog.category_name,
    keywords: blog.tags?.map((t) => t.name).join(", "),
    wordCount: (blog.content || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).length,
    timeRequired: `PT${minutes}M`,
    author: { "@type": "Person", name: blog.author_name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/darklogo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${blog.slug}/` },
  };

  return (
    <div className="k-page ab-page bd-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogDetailHero
        blog={blog}
        content={content.hero}
        name={pageContent.name}
        minutes={minutes}
      />
      <div className="k-page-body ab-body">
        <BlogArticleIntro blog={blog} content={content.intro} minutes={minutes} minRead={content.hero.minRead} />
        <BlogArticleBody
          blog={blog}
          html={html}
          content={content}
          categories={categories}
          recent={others.slice(0, 3)}
          tags={tags.slice(0, 8)}
          prev={prev}
          next={next}
        />
        {recentPanels.length > 0 && <BlogSection posts={recentPanels} content={content.recent} />}
      </div>
    </div>
  );
}
