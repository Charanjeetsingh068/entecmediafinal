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
  /** Heading copy (defaults to the home page "Insights" heading), e.g. "Recent posts" under an article */
  content?: {
    label: string;
    /** "after" follows the highlighted words on the first line ("Ideas" + " that") */
    title: { soft: string; strong: string; after?: string };
    desc: string;
    cta: { label: string; href: string };
  };
}

const DEFAULT_CONTENT: NonNullable<BlogSectionProps["content"]> = {
  label: "+ INSIGHTS",
  title: { soft: "Ideas", after: " that", strong: "move brands" },
  desc: "Practical guides on websites, apps, SEO, Google Ads and Meta Ads to help your business grow online.",
  cta: { label: "Read more insights", href: "/blog" },
};

/** Rough reading time from the article body (≈200 words a minute); null when there is no body. */
function readMinutes(post: BlogPost) {
  if (!post.content) return null;
  const words = post.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * "Insights — Ideas that move brands": expanding article panels.
 * Desktop: the articles stand side by side as tall image panels; one is open wide (category, date · read
 * time, title, excerpt, "Read article"), the others are narrow strips with a number and a vertical title.
 * Hovering or focusing a strip opens it and folds the rest (no autoplay). At 991px and below there is no
 * accordion: every post is a normal open card (two columns with a wide first card, one column on phones).
 * Entrance: the panels wipe open upward one after another as they come into view. Closed strips carry a
 * big outlined number; an opening panel's title rises word by word; on desktop the open image drifts with
 * the pointer and a rotating "Read article" badge follows it over the panels.
 * Background: an "idea web" of drifting dots, small rings and hub circles linked like a spider web, with
 * pulses on the threads, hub sonar rings, a web around the pointer and a shockwave on click or tap.
 * Used on the home page, the About page and under a blog post (related articles).
 */
export default function BlogSection({ posts, excludeSlug, content = DEFAULT_CONTENT }: BlogSectionProps) {
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

  // Background "idea web": brand-blue points drifting and linking up like a spider web. Some points are
  // small rings, a few are hubs with a turning dashed orbit that now and then send out a sonar circle.
  // Pulses run along the threads; the pointer becomes the spider — nearby points lean in, threads and
  // two turning web circles form around it; a click or tap sends a shockwave that pushes points away.
  // Drawn only while the section is in view; the scroll nudges the points.
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = netRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const BLUE = "42, 39, 216";
    const SKY = "31, 136, 245";
    const LINK = 160;
    const WEB = 210;

    let w = 0, h = 0, raf = 0, visible = false, last = 0, lastY = window.scrollY, drift = 0, t = 0, nextAuto = 5;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, k: 0, on: false };

    type Kind = "dot" | "ring" | "hub";
    type Node = { x: number; y: number; vx: number; vy: number; r: number; kind: Kind; ph: number; ping: number };
    type Pulse = { a: number; b: number; p: number; speed: number };
    type Wave = { x: number; y: number; age: number; life: number; max: number; push: boolean };
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let waves: Wave[] = [];

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (mouse.k < 0.05) {
        mouse.x = p.x;
        mouse.y = p.y;
      }
      mouse.tx = p.x;
      mouse.ty = p.y;
      mouse.on = e.pointerType === "mouse" || e.pointerType === "pen";
      section.style.setProperty("--ins-sx", `${((p.x / w) * 100).toFixed(1)}%`);
      section.style.setProperty("--ins-sy", `${((p.y / h) * 100).toFixed(1)}%`);
    };
    const onLeave = () => (mouse.on = false);
    const onDown = (e: PointerEvent) => {
      if (waves.length < 8) waves.push({ ...local(e), age: 0, life: 1.4, max: 320, push: true });
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointerdown", onDown);

    const seed = () => {
      const mobile = w < 768;
      nodes = Array.from({ length: mobile ? 34 : 62 }, (_, i) => {
        const kind: Kind = i < (mobile ? 2 : 4) ? "hub" : Math.random() < 0.18 ? "ring" : "dot";
        const speed = kind === "hub" ? 10 : 22;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: kind === "hub" ? 5 : kind === "ring" ? 3.2 + Math.random() * 1.5 : 1.3 + Math.random() * 1.6,
          kind,
          ph: Math.random() * Math.PI * 2,
          ping: 1 + Math.random() * 4,
        };
      });
      pulses = [];
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

    const dot = (x: number, y: number, r: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      const sy = window.scrollY;
      drift += ((sy - lastY) * 0.2 - drift) * 0.1;
      lastY = sy;

      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;
      mouse.k += ((mouse.on ? 1 : 0) - mouse.k) * 0.08;

      // A soft shockwave of its own now and then, so touch screens see it too
      nextAuto -= dt;
      if (nextAuto <= 0) {
        waves.push({ x: w * (0.15 + Math.random() * 0.7), y: h * (0.2 + Math.random() * 0.6), age: 0, life: 1.6, max: 260, push: true });
        nextAuto = 7 + Math.random() * 5;
      }
      waves = waves.filter((wv) => (wv.age += dt) < wv.life);

      // Move: drift, lean towards the pointer, get pushed by shockwave fronts
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt - drift * 0.3;
        if (mouse.k > 0.01) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < WEB && d > 40) {
            const f = (1 - d / WEB) * 26 * mouse.k * dt;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
        for (const wv of waves) {
          if (!wv.push) continue;
          const dx = n.x - wv.x, dy = n.y - wv.y;
          const d = Math.hypot(dx, dy) || 1;
          const front = d - (1 - Math.pow(1 - wv.age / wv.life, 3)) * wv.max;
          const f = Math.exp(-(front * front) / 900) * 90 * (1 - wv.age / wv.life) * dt;
          n.x += (dx / d) * f;
          n.y += (dy / d) * f;
        }
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;

        // Hubs send out a sonar circle every few seconds
        if (n.kind === "hub" && (n.ping -= dt) <= 0) {
          waves.push({ x: n.x, y: n.y, age: 0, life: 2.4, max: 150, push: false });
          n.ping = 3.5 + Math.random() * 3;
        }
      }

      ctx.clearRect(0, 0, w, h);

      // Threads between close points (collected so pulses can travel along them)
      const links: [number, number][] = [];
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            links.push([i, j]);
            ctx.strokeStyle = `rgba(${BLUE}, ${(0.22 * (1 - d / LINK)).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Pulses: a small light dot running from one point to the other along a thread
      if (pulses.length < (w < 768 ? 4 : 9) && links.length && Math.random() < 0.08) {
        const [a, b] = links[Math.floor(Math.random() * links.length)];
        const flip = Math.random() < 0.5;
        pulses.push({ a: flip ? b : a, b: flip ? a : b, p: 0, speed: 0.6 + Math.random() * 0.6 });
      }
      pulses = pulses.filter((pl) => {
        pl.p += pl.speed * dt;
        const a = nodes[pl.a], b = nodes[pl.b];
        if (!a || !b || pl.p >= 1 || Math.hypot(a.x - b.x, a.y - b.y) > LINK * 1.1) return false;
        const x = a.x + (b.x - a.x) * pl.p, y = a.y + (b.y - a.y) * pl.p;
        const fade = Math.sin(pl.p * Math.PI);
        dot(x, y, 5, `rgba(${SKY}, ${(0.18 * fade).toFixed(3)})`);
        dot(x, y, 1.8, `rgba(${SKY}, ${(0.85 * fade).toFixed(3)})`);
        return true;
      });

      // Circles: hub sonar pings and click shockwaves
      for (const wv of waves) {
        const k = wv.age / wv.life;
        ctx.strokeStyle = `rgba(${wv.push ? SKY : BLUE}, ${((wv.push ? 0.32 : 0.2) * (1 - k)).toFixed(3)})`;
        ctx.lineWidth = wv.push ? 1.4 : 1;
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, 6 + (1 - Math.pow(1 - k, 3)) * wv.max, 0, Math.PI * 2);
        ctx.stroke();
      }

      // The pointer as the spider: threads to nearby points and two turning web circles
      if (mouse.k > 0.01) {
        ctx.lineWidth = 1.2;
        for (const n of nodes) {
          const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (d < WEB) {
            ctx.strokeStyle = `rgba(${SKY}, ${(0.42 * (1 - d / WEB) * mouse.k).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        for (const [rad, dir, a] of [[46, 1, 0.3], [92, -1, 0.18]] as const) {
          ctx.lineDashOffset = -t * 18 * dir;
          ctx.strokeStyle = `rgba(${BLUE}, ${(a * mouse.k).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        dot(mouse.x, mouse.y, 2.6, `rgba(${BLUE}, ${(0.6 * mouse.k).toFixed(3)})`);
      }

      // Points: dots, small rings, and hubs with a turning dashed orbit
      for (const n of nodes) {
        const a = 0.45 + 0.3 * Math.sin(t * 2.4 + n.ph);
        if (n.kind === "dot") {
          dot(n.x, n.y, n.r, `rgba(${BLUE}, ${a.toFixed(3)})`);
          continue;
        }
        ctx.strokeStyle = `rgba(${BLUE}, ${(a + 0.1).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        dot(n.x, n.y, n.r, "#fff");
        ctx.stroke();
        dot(n.x, n.y, n.kind === "hub" ? 2 : 1.1, `rgba(${SKY}, ${a.toFixed(3)})`);
        if (n.kind === "hub") {
          ctx.setLineDash([2, 5]);
          ctx.lineDashOffset = t * 10;
          ctx.strokeStyle = `rgba(${BLUE}, 0.3)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 13 + 1.5 * Math.sin(t * 1.5 + n.ph), 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
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
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
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
          <div className="ins-spotlight" />
          <div className="ins-fluid-blob ins-blob-1" />
          <div className="ins-fluid-blob ins-blob-2" />
          <canvas className="ins-net" ref={netRef} />
        </div>
      </div>

      <div className="container">
        <div className="why-top-layout k-section-head" style={{ marginBottom: "clamp(36px, 4.5vw, 64px)" }}>
          <div className="why-col-left">
            <span className="why-section-label">{content.label}</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              <span className="text-gradient">{content.title.soft}</span>
              {content.title.after}
              <br />
              {content.title.strong}
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">{content.desc}</p>
            <div style={{ marginTop: "20px" }}>
              <KButton href={content.cta.href} label={content.cta.label} />
            </div>
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
                  className={`ins-panel k-btn-host ${isOpen ? "is-open" : ""}`}
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
                    <KButton as="span" label="Read article" variant="dark" className="ins-panel-cta" />
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
