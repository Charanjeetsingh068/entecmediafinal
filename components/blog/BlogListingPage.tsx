import BlogPageHero from "@/components/blog/BlogPageHero";
import BlogGrid from "@/components/blog/BlogGrid";
import Testimonials from "@/components/home/Testimonials";
import FaqShowcase from "@/components/shared/FaqShowcase";
import { getBlogCategories, getBlogPageContent, getPublishedBlogs, readingMinutes, type BlogCategory } from "@/lib/blogApi";
import { getTestimonials } from "@/lib/servicesApi";
import { siteConfig } from "@/lib/siteConfig";

/**
 * The Blog page layout, shared by /blog and /blog/category/{slug}:
 * hero with breadcrumb and the rotating reading desk (dark, pinned — the body slides over it) → our blogs
 * with category tabs and pagination (light, the Services grid design) → testimonials (dark, shared) →
 * FAQs (light) → footer. A category page opens the grid on that category and names it in the hero.
 * Content: lib/blogApi.ts (articles from the Blog CMS, page copy from lib/blogContent.ts).
 */
export default async function BlogListingPage({ category }: { category?: BlogCategory }) {
  const [content, { blogs }, categories, reviews] = await Promise.all([
    getBlogPageContent(),
    getPublishedBlogs({ limit: 1000 }),
    getBlogCategories(),
    getTestimonials(),
  ]);
  const posts = blogs.map((b) => ({ ...b, minutes: readingMinutes(b) }));
  const heroPosts = category ? [...posts.filter((p) => p.category_slug === category.slug), ...posts.filter((p) => p.category_slug !== category.slug)] : posts;
  const path = category ? `/blog/category/${category.slug}/` : "/blog/";

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: category ? `${category.name} — Entec Media Blog` : "Entec Media Blog",
    url: `${siteConfig.url}${path}`,
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    blogPost: (category ? posts.filter((p) => p.category_slug === category.slug) : posts).slice(0, 50).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteConfig.url}/blog/${p.slug}/`,
      datePublished: p.published_at || p.created_at,
      image: p.featured_image_url || undefined,
      author: { "@type": "Person", name: p.author_name },
    })),
  };

  return (
    <div className="k-page ab-page bl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <BlogPageHero
        content={content.hero}
        name={content.name}
        posts={heroPosts}
        minRead={content.list.minRead}
        crumb={category ? { label: category.name, href: `/blog/category/${category.slug}` } : undefined}
        title={category ? { soft: category.name, strong: "articles & guides" } : undefined}
        desc={category ? category.description || undefined : undefined}
      />
      <div className="k-page-body ab-body">
        <BlogGrid posts={posts} categories={categories} content={content.list} initialCategory={category?.slug} />
        <Testimonials reviews={reviews} />
        <FaqShowcase
          id="blog-faq"
          items={content.faq.items}
          label={content.faq.label}
          title={content.faq.title}
          desc={content.faq.desc}
          help={content.faq.help}
        />
      </div>
    </div>
  );
}
