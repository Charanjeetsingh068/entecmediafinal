import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedBlogs, getBlogCategories } from "@/lib/blogApi";
import BlogListing from "@/components/blog/BlogListing";
import BlogListingView from "@/components/blog/BlogListingView";
import PageHero from "@/components/shared/PageHero";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Guides and insights on website design, development, mobile apps, UI/UX, SEO, Google Ads and Meta Ads from the Entec Media team.",
  alternates: { canonical: "/blog" },
};

export default async function BlogListingPage() {
  const [{ blogs }, categories] = await Promise.all([getPublishedBlogs({ limit: 1000 }), getBlogCategories()]);

  return (
    <div className="k-page blog-page-wrapper">
      <PageHero
        label="+ INSIGHTS"
        title={
          <>
            <span className="k-muted">Ideas</span> that
            <br />
            move brands
          </>
        }
        desc="Practical guides on websites, apps, UI/UX, SEO, Google Ads and Meta Ads — written by the Entec Media team."
      />
      <div className="k-page-body">
        {/* The fallback is the unfiltered listing, pre-rendered into the static HTML. */}
        <Suspense fallback={<BlogListingView allBlogs={blogs} categories={categories} category="" search="" />}>
          <BlogListing allBlogs={blogs} categories={categories} />
        </Suspense>
        <AboutCTA source="blog-page" />
      </div>
    </div>
  );
}
