import Link from "next/link";
import StickySide from "@/components/blog/detail/StickySide";
import { sizedImage } from "@/lib/servicesContent";
import type { BlogCategory, BlogPost, BlogTag } from "@/lib/blogApi";
import type { BlogDetailContent } from "@/lib/blogContent";

interface BlogArticleBodyProps {
  blog: BlogPost;
  html: string;
  content: BlogDetailContent;
  categories: BlogCategory[];
  recent: BlogPost[];
  tags: BlogTag[];
  prev?: BlogPost;
  next?: BlogPost;
}

const FALLBACK_IMAGE = "/images/aboutimg.webp";

/**
 * The article itself (white). Left: the body (CMS HTML in readable prose styles), its #tags, a dark
 * "Need help?" card and previous / next article cards; it fills the space beside the sidebar.
 * Right: the sidebar — search (opens the Blog page filtered), categories with counts, recent posts with
 * thumbnails and a tag cloud — which sticks as one column while you read (StickySide).
 * ≤991px: the sidebar follows the article and doesn't stick.
 */
export default function BlogArticleBody({ blog, html, content, categories, recent, tags, prev, next }: BlogArticleBodyProps) {
  const { sidebar: s, body: b } = content;
  const ctaText = s.ctaText.replace(/\{category\}/g, blog.category_name || "digital").replace(/\{title\}/g, blog.title);
  const pn = [
    { post: prev, label: b.prevLabel, dir: "prev" },
    { post: next, label: b.nextLabel, dir: "next" },
  ];

  return (
    <section className="k-section bd-body" id="article" data-theme="light" aria-label={blog.title}>
      <div className="container bd-body-grid">
        <article className="bd-article">
          <div className="bd-prose" id="article-body" dangerouslySetInnerHTML={{ __html: html }} />

          {!!blog.tags?.length && (
            <div className="bd-article-tags">
              <span>{b.tagsLabel}</span>
              <ul>
                {blog.tags.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/blog/?tag=${t.slug}`}>#{t.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bd-help">
            <div className="bd-help-text">
              <span className="bd-help-label">{s.ctaLabel}</span>
              <strong>{s.ctaTitle}</strong>
              <p>{ctaText}</p>
            </div>
            <Link href={s.cta.href} className="bd-help-btn">
              {s.cta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </Link>
          </div>

          {(prev || next) && (
            <nav className="bd-pn" aria-label="More articles">
              {pn.map(({ post, label, dir }) =>
                post ? (
                  <Link key={dir} href={`/blog/${post.slug}`} className={`bd-pn-card is-${dir}`}>
                    <span className="bd-pn-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sizedImage(post.featured_image_url || FALLBACK_IMAGE, 300)} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="bd-pn-text">
                      <small>{label}</small>
                      <strong>{post.title}</strong>
                    </span>
                  </Link>
                ) : (
                  <Link key={dir} href="/blog" className={`bd-pn-card is-${dir} is-all`}>
                    <span className="bd-pn-text">
                      <small>{label}</small>
                      <strong>{b.backLabel}</strong>
                    </span>
                  </Link>
                ),
              )}
            </nav>
          )}
        </article>

        <StickySide className="bd-side">
          <form className="bd-side-card bd-search" action="/blog/" method="get" role="search">
            <label className="bd-side-label" htmlFor="bd-search-input">
              {s.searchLabel}
            </label>
            <div className="bd-search-field">
              <input id="bd-search-input" type="search" name="q" placeholder={s.searchPlaceholder} required />
              <button type="submit" aria-label={s.searchLabel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
            </div>
          </form>

          {categories.length > 0 && (
            <div className="bd-side-card">
              <span className="bd-side-label">{s.categoriesLabel}</span>
              <ul className="bd-cats">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/blog/category/${c.slug}`} className={c.slug === blog.category_slug ? "is-current" : undefined}>
                      <span>{c.name}</span>
                      {typeof c.published_blogs_count === "number" && <b>{String(c.published_blogs_count).padStart(2, "0")}</b>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recent.length > 0 && (
            <div className="bd-side-card">
              <span className="bd-side-label">{s.recentLabel}</span>
              <ul className="bd-recent">
                {recent.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`}>
                      <span className="bd-recent-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sizedImage(p.featured_image_url || FALLBACK_IMAGE, 240)} alt="" loading="lazy" decoding="async" />
                      </span>
                      <span className="bd-recent-text">
                        <strong>{p.title}</strong>
                        <small>{p.formatted_date}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tags.length > 0 && (
            <div className="bd-side-card">
              <span className="bd-side-label">{s.tagsLabel}</span>
              <ul className="bd-tags">
                {tags.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/blog/?tag=${t.slug}`} className={blog.tags?.some((x) => x.slug === t.slug) ? "is-current" : undefined}>
                      #{t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </StickySide>
      </div>
    </section>
  );
}
