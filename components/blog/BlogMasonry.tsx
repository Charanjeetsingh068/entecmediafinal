"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/blogApi";
import BlogCard from "./BlogCard";

function useColumnCount() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => setCols(window.innerWidth >= 1200 ? 4 : window.innerWidth >= 810 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

interface BlogMasonryProps {
  posts: BlogPost[];
  headingLevel?: 2 | 3;
}

/**
 * Kudos articles grid: posts flow left-to-right into independent columns whose
 * image heights alternate tall/short, giving the staggered masonry look.
 */
export default function BlogMasonry({ posts, headingLevel }: BlogMasonryProps) {
  const cols = useColumnCount();
  const columns: { post: BlogPost; tall: boolean }[][] = Array.from({ length: cols }, () => []);

  posts.forEach((post, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    columns[col].push({ post, tall: cols === 1 ? false : (col + row) % 2 === 0 });
  });

  return (
    <div className="blog-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {columns.map((column, ci) => (
        <div key={ci} className="blog-grid-col">
          {column.map(({ post, tall }) => (
            <BlogCard key={post.id} post={post} tall={tall} headingLevel={headingLevel} />
          ))}
        </div>
      ))}
    </div>
  );
}
