"use client";

import { useEffect, useState } from "react";
import { getPublishedBlogs, type BlogPost } from "@/lib/blogApi";
import SectionHeader from "@/components/shared/SectionHeader";
import KButton from "@/components/shared/KButton";
import Reveal from "@/components/shared/Reveal";
import BlogMasonry from "@/components/blog/BlogMasonry";

interface BlogSectionProps {
  /** Posts to show instead of the four latest (e.g. related articles) */
  posts?: BlogPost[];
  excludeSlug?: string;
}

/** Kudos "Insights — Ideas that move brands" section with the four latest articles. */
export default function BlogSection({ posts, excludeSlug }: BlogSectionProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(posts ?? []);

  // Fetch published blogs from the PHP Blog CMS (getPublishedBlogs falls back to local posts)
  useEffect(() => {
    if (posts) return;
    getPublishedBlogs({ limit: 5 }).then(({ blogs: apiBlogs }) => {
      setBlogs(apiBlogs.filter((b) => b.slug !== excludeSlug).slice(0, 4));
    });
  }, [posts, excludeSlug]);

  return (
    <section id="blog" className="k-section blog-section" data-theme="light">
      <div className="container">
        <SectionHeader
          label="+ INSIGHTS"
          title={
            <>
              <span className="highlight-focus">Ideas</span> that
              <br />
              move brands
            </>
          }
          desc="Practical guides on websites, apps, SEO, Google Ads and Meta Ads to help your business grow online."
        />

        <Reveal>
          <BlogMasonry posts={blogs} />
        </Reveal>

        <div className="blog-bottom-bar">
          <p className="k-team-footer-text">
            Good ideas deserve <strong>deeper exploration.</strong>
          </p>
          <div className="k-team-footer-action">
            <span className="k-mono-label">Fresh ideas published regularly</span>
            <KButton href="/blog" label="Read more insights" />
          </div>
        </div>
      </div>
    </section>
  );
}
