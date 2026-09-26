import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogApi";

interface BlogCardProps {
  post: BlogPost;
  tall?: boolean;
  /** 2 on listing pages (cards sit right under the h1), 3 inside a titled section */
  headingLevel?: 2 | 3;
}

/** Kudos article card: image (tall or short), mono date, title, excerpt and a "Read more ⋮" link. */
export default function BlogCard({ post, tall, headingLevel = 3 }: BlogCardProps) {
  const Title = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={`/blog/${post.slug}`} className={`blog-card ${tall ? "is-tall" : "is-short"}`}>
      <div className="blog-card-image-box">
        <Image
          src={post.featured_image_url || "/images/aboutimg.webp"}
          alt={post.featured_image_alt || post.title}
          fill
          className="blog-card-image"
          sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 25vw"
        />
      </div>
      <div className="blog-card-content">
        <span className="blog-card-date">
          {post.formatted_date}
          {post.category_name && <span className="blog-card-cat"> · {post.category_name}</span>}
        </span>
        <Title className="blog-card-title">{post.title}</Title>
        <p className="blog-card-desc">{post.excerpt}</p>
        <div className="blog-card-link-row">
          <span className="blog-card-read-link">Read more</span>
          <span className="cta-dots-vertical" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </span>
        </div>
      </div>
    </Link>
  );
}
