"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogs, type BlogPost } from "@/lib/blogApi";
import KButton from "@/components/shared/KButton";

interface BlogSectionProps {
  /** Posts to show instead of the five latest (e.g. related articles) */
  posts?: BlogPost[];
  excludeSlug?: string;
}

/** Rough reading time from the article body (≈200 words a minute); null when there is no body. */
function readMinutes(post: BlogPost) {
  if (!post.content) return null;
  const words = post.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

/**
 * "Insights — Ideas that move brands": expanding article panels.
 * Desktop: the articles stand side by side as tall image panels; one is open wide (category, date · read
 * time, title, excerpt, "Read article"), the others are narrow strips with a number and a vertical title.
 * Hovering or focusing a strip opens it and folds the rest (no autoplay). At 991px and below there is no
 * accordion: every post is a normal open card (two columns with a wide first card, one column on phones).
 * Entrance: the panels wipe open upward one after another as they come into view. Closed strips carry a
 * big outlined number; an opening panel's title rises word by word; on desktop the open image drifts with
 * the pointer and a rotating "Read article" badge follows it over the panels.
 * Background: a faint "idea network" — brand-blue points drifting on the light surface, linked by thin
 * lines when they come close; drawn only while the section is in view and nudged by the scroll.
 * Used on the home page, the About page and under a blog post (related articles).
 */
export default function BlogSection({ posts, excludeSlug }: BlogSectionProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(posts ?? []);
  const [open, setOpen] = useState(0);
  const panelsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Entrance: the panels wipe open once they come into view (hidden state only applies once JS runs)
  useEffect(() => {
    const el = panelsRef.current;
    if (!el) return;
    sectionRef.current?.setAttribute("data-ready", "");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      // Trigger once the top of the panels is ~15% into the screen, however tall the stack is
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [blogs.length]);

  // Desktop pointer: a rotating "Read article" badge trails the pointer; the hovered image leans with it
  useEffect(() => {
    const el = panelsRef.current;
    const cursor = cursorRef.current;
    if (!el || !cursor || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const panel = (e.target as Element).closest<HTMLElement>(".ins-panel");
      if (panel && !cursor.classList.contains("is-on")) {
        x = tx;
        y = ty;
      }
      cursor.classList.toggle("is-on", !!panel);
      if (panel) {
        const r = panel.getBoundingClientRect();
        panel.style.setProperty("--mx", ((tx - r.left) / r.width - 0.5).toFixed(3));
        panel.style.setProperty("--my", ((ty - r.top) / r.height - 0.5).toFixed(3));
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => cursor.classList.remove("is-on");
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [blogs.length]);
  const sectionRef = useRef<HTMLElement>(null);
  const netRef = useRef<HTMLCanvasElement>(null);

  // Background idea network
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = netRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;
    let w = 0, h = 0, raf = 0, visible = false, last = 0, lastY = window.scrollY, drift = 0;
    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];
    const seed = () => {
      const count = Math.round(Math.min(56, Math.max(18, (w * h) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        r: 1.2 + Math.random() * 1.8,
      }));
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const LINK = 150;
    const draw = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const y = window.scrollY;
      drift += ((y - lastY) * 0.25 - drift) * 0.1; // the page scroll nudges the points up or down
      lastY = y;
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt - drift * 0.3;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(42, 39, 216, ${(0.14 * (1 - d / LINK)).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(42, 39, 216, 0.28)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = visible ? requestAnimationFrame(draw) : 0;
      if (!raf) last = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        lastY = window.scrollY;
        raf = requestAnimationFrame(draw);
      }
    });
    resize();
    io.observe(section);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Fetch published blogs from the PHP Blog CMS (getPublishedBlogs falls back to local posts)
  useEffect(() => {
    if (posts) return;
    getPublishedBlogs({ limit: 6 }).then(({ blogs: apiBlogs }) => {
      setBlogs(apiBlogs.filter((b) => b.slug !== excludeSlug).slice(0, 5));
    });
  }, [posts, excludeSlug]);


  return (
    <section id="blog" ref={sectionRef} className="k-section ins" data-theme="light">
      <div className="ins-bg" aria-hidden="true">
        <div className="ins-bg-sticky">
          <canvas className="ins-net" ref={netRef} />
        </div>
      </div>

      <div className="container">
        <div className="ins-head">
          <div>
            <p className="ins-label">
              <span className="ins-dot" aria-hidden="true" />
              Insights
            </p>
            <h2 className="ins-title">
              Ideas that <span className="ins-title-accent">move brands</span>
            </h2>
          </div>
          <div className="ins-head-side">
            <p className="ins-desc">
              Practical guides on websites, apps, SEO, Google Ads and Meta Ads to help your business grow online.
            </p>
            <KButton href="/blog" label="Read more insights" />
          </div>
        </div>

        {blogs.length ? (
          <div className="ins-panels" ref={panelsRef}>
            {blogs.map((post, i) => {
              const isOpen = i === open;
              const minutes = readMinutes(post);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`ins-panel ${isOpen ? "is-open" : ""}`}
                  style={{ "--k": i } as React.CSSProperties}
                  onMouseEnter={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  onClick={(e) => {
                    // Desktop panels: a closed one opens first (touch); the open one goes to the article.
                    // At 991px and below every card is already open, so a tap always goes to the article.
                    if (!isOpen && !window.matchMedia("(max-width: 991px)").matches) {
                      e.preventDefault();
                      setOpen(i);
                    }
                  }}
                >
                  <Image
                    src={post.featured_image_url || "/images/aboutimg.webp"}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="ins-panel-img"
                    sizes="(max-width: 991px) 100vw, 60vw"
                  />
                  <span className="ins-panel-shade" aria-hidden="true" />

                  {/* Closed: big outlined number + vertical title */}
                  <span className="ins-panel-big" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ins-panel-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ins-panel-spine" aria-hidden="true">
                    {post.title}
                  </span>

                  {/* Open: the story */}
                  <span className="ins-panel-body">
                    <span className="ins-panel-meta">
                      {post.category_name && <b>{post.category_name}</b>}
                      <span>
                        {post.formatted_date}
                        {minutes && ` · ${minutes} min read`}
                      </span>
                    </span>
                    <h3 className="ins-panel-title" aria-label={post.title}>
                      {post.title.split(" ").map((word, w) => (
                        <Fragment key={w}>
                          <span className="ins-w" aria-hidden="true">
                            <span style={{ "--w": w } as React.CSSProperties}>{word}</span>
                          </span>{" "}
                        </Fragment>
                      ))}
                    </h3>
                    <span className="ins-panel-excerpt">{post.excerpt}</span>
                    <span className="ins-panel-cta">
                      Read article
                      <span className="ins-panel-cta-icon">
                        <ArrowIcon />
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          // Placeholders while the articles load, so the layout does not jump
          <div className="ins-panels" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} className={`ins-skel ins-panel ${k === 0 ? "is-open" : ""}`} />
            ))}
          </div>
        )}
      </div>

      <div className="ins-cursor" ref={cursorRef} aria-hidden="true">
        <span className="ins-cursor-inner">
          <svg className="ins-cursor-ring" viewBox="0 0 100 100">
            <defs>
              <path id="ins-ring" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
            </defs>
            <text>
              <textPath href="#ins-ring" textLength="224" lengthAdjust="spacing">
                READ ARTICLE • READ ARTICLE •
              </textPath>
            </text>
          </svg>
          <svg className="ins-cursor-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </section>
  );
}
