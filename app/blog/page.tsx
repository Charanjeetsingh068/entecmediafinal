import type { Metadata } from "next";
import BlogListingPage from "@/components/blog/BlogListingPage";
import { getBlogPageContent } from "@/lib/blogApi";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getBlogPageContent();
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/blog" },
    openGraph: {
      title: `${seo.title} | Entec Media`,
      description: seo.description,
      url: "/blog",
      type: "website",
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

/**
 * Blog page: hero (dark, pinned) → our blogs (light) → testimonials (dark) → FAQs (light) → footer.
 * Layout: components/blog/BlogListingPage.tsx. Styles: the "BLOG PAGES" block in app/globals.css.
 */
export default function BlogPage() {
  return <BlogListingPage />;
}
