"use client";

import { useSearchParams } from "next/navigation";
import type { BlogCategory, BlogPost } from "@/lib/blogApi";
import BlogListingView from "./BlogListingView";

interface BlogListingProps {
  allBlogs: BlogPost[];
  categories: BlogCategory[];
}

/** Reads ?category= / ?search= from the URL and hands them to the listing as its starting filters. */
export default function BlogListing({ allBlogs, categories }: BlogListingProps) {
  const params = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("search") || "";

  return (
    <BlogListingView
      key={`${category}|${search}`}
      allBlogs={allBlogs}
      categories={categories}
      category={category}
      search={search}
    />
  );
}
