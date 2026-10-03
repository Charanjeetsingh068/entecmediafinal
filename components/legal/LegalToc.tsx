"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

interface LegalTocProps {
  items: { id: string; title: string }[];
  label: string;
}

/**
 * Sticky "Contents" index beside the legal text: numbered section links, the section being read
 * highlighted, and a reading progress line. Clicking glides to the section (Lenis when present).
 */
export default function LegalToc({ items, label }: LegalTocProps) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const body = document.getElementById("legal-sections");
    if (!body) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = body.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.3 - r.top) / Math.max(1, r.height - vh * 0.5)));
      if (barRef.current) barRef.current.style.transform = `scaleY(${p.toFixed(3)})`;
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top < vh * 0.35) current = it.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="lg-toc" aria-label={label}>
      <span className="lg-toc-label">{label}</span>
      <div className="lg-toc-track">
        <span className="lg-toc-bar" aria-hidden="true">
          <span ref={barRef} />
        </span>
        <ol>
          {items.map((it, i) => (
            <li key={it.id}>
              <a href={`#${it.id}`} onClick={(e) => go(e, it.id)} className={active === it.id ? "is-active" : undefined} aria-current={active === it.id ? "true" : undefined}>
                <b>{String(i + 1).padStart(2, "0")}</b>
                {it.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
