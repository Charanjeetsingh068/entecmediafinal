"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import Reveal from "@/components/shared/Reveal";
import SvdBackdrop from "@/components/shared/SvdBackdrop";
import { sizedImage, type ServiceDetailSections } from "@/lib/servicesContent";
import type { ServiceDetail } from "@/lib/servicesData";

interface ServiceFeaturesProps {
  /** A service — or anything shaped like one (the project pages pass a project's title, image, deliverables and tech) */
  service: Pick<ServiceDetail, "title" | "image" | "deliverables" | "tools">;
  content: ServiceDetailSections["features"];
  id?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const CYCLE_MS = 3200;

/** "**bold** text" → text with <strong> parts (content stays plain strings for the CMS). */
function withBold(text: string) {
  return text.split("**").map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
}

/**
 * "What's included" (dark) — background and heading from the home "Our focus" section (.svd styles +
 * components/shared/SvdBackdrop.tsx, blue-navy gradient), then a hub layout:
 * the service photo in a circular hub (turning dotted ring, service name, deliverable count) with the
 * deliverables as cards on both sides, each linked to the hub by a curved line. The lines draw in when
 * the section enters, and light dots keep flowing along them from the hub to the cards. Every few
 * seconds the next deliverable lights up (card, its line and the hub's number); hovering a card picks it.
 * Closing card with the quote line and "Get a free quote" underneath.
 * ≥1200px: cards | hub | cards with lines · below: hub on top, cards in 2 columns (tablet) / 1 (phones).
 */
export default function ServiceFeatures({ service, content, id }: ServiceFeaturesProps) {
  const items = service.deliverables;
  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);
  const ticker = service.tools.length ? service.tools : items.map((d) => d.title);
  const toolsOf = (i: number) =>
    service.tools.length ? [...new Set([service.tools[i % service.tools.length], service.tools[(i + 1) % service.tools.length]])] : [];

  const stageRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);

  // Curved lines from the hub's edge to the inner edge of every card (desktop layout only)
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const hub = hubRef.current;
    if (!stage || !hub) return;
    if (!window.matchMedia("(min-width: 1200px)").matches) {
      setPaths([]);
      return;
    }
    const s = stage.getBoundingClientRect();
    const h = hub.getBoundingClientRect();
    const cx = h.left + h.width / 2 - s.left;
    const cy = h.top + h.height / 2 - s.top;
    const r = h.width / 2 + 10;
    const next = Array.from(stage.querySelectorAll<HTMLElement>(".sdh-card")).map((card) => {
      const c = card.getBoundingClientRect();
      const isLeft = c.left + c.width / 2 - s.left < cx;
      const ex = (isLeft ? c.right : c.left) - s.left;
      const ey = c.top + c.height / 2 - s.top;
      const ang = Math.atan2(ey - cy, ex - cx);
      const sx = cx + Math.cos(ang) * r;
      const sy = cy + Math.sin(ang) * r;
      const mx = (sx + ex) / 2;
      return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${mx.toFixed(1)} ${sy.toFixed(1)}, ${mx.toFixed(1)} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    });
    setSize({ w: s.width, h: s.height });
    setPaths(next);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(stage);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [measure]);

  // Move the highlight on by itself while the pointer is elsewhere
  useEffect(() => {
    if (!inView || hovering) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % items.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [active, inView, hovering, items.length]);

  const card = (d: (typeof items)[number], i: number) => (
    <article
      key={d.title}
      className={`sdh-card ${i === active ? "is-active" : ""}`}
      style={{ "--i": i } as CSSProperties}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        setHovering(true);
        setActive(i);
      }}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
    >
      <div className="sdh-card-top">
        <span className="sdh-num">{pad(i + 1)}</span>
        <span className="sdh-label">{content.itemLabel}</span>
      </div>
      <h3 className="sdh-title">{d.title}</h3>
      <p className="sdh-text">{d.desc}</p>
      {toolsOf(i).length > 0 && (
        <ul className="sdh-tags" aria-label="Tools">
          {toolsOf(i).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </article>
  );

  return (
    <section className="svd sd-feat" id={id} data-theme="dark" aria-labelledby="features-title">
      <SvdBackdrop />

      <div className="container">
        <div className="svd-top">
          <span className="why-section-label svd-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>
          <h2 className="svd-title" id="features-title" data-kfx="opacity:0;y:48">
            <span className="svd-title-soft">{content.title.soft}</span>
            <span className="svd-title-pill" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sizedImage(service.image, 200)} alt="" />
            </span>
            {content.title.strong}
          </h2>
          <p className="svd-desc" data-kfx="opacity:0;y:48">
            {content.desc}
          </p>
        </div>
      </div>

      {/* Slow ticker of the tools used for this service */}
      <div className="svd-ticker" aria-hidden="true">
        <div className="svd-ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="svd-ticker-set">
              {[...ticker, ...ticker].map((t, i) => (
                <span key={i}>
                  {t}
                  <i>✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className={`sdh ${inView ? "is-in" : ""}`} ref={stageRef}>
          {paths.length > 0 && (
            <svg className="sdh-lines" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
              {paths.map((d, i) => (
                <g key={i} className={i === active ? "is-active" : ""} style={{ "--i": i } as CSSProperties}>
                  <path className="sdh-line" d={d} pathLength={1} />
                  <path className="sdh-flow" d={d} />
                </g>
              ))}
            </svg>
          )}

          <div className="sdh-col sdh-col-left">{left.map((d, k) => card(d, k))}</div>

          <div className="sdh-hub-wrap">
            <div className="sdh-hub" ref={hubRef}>
              <span className="sdh-ring" aria-hidden="true" />
              <span className="sdh-ring sdh-ring-2" aria-hidden="true" />
              <span className="sdh-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sizedImage(service.image, 800)} alt={`${service.title} by Entec Media`} loading="lazy" decoding="async" />
              </span>
              <span className="sdh-hub-num" key={active} aria-hidden="true">
                {pad(active + 1)}
              </span>
            </div>
            <div className="sdh-hub-caption">
              <strong>{service.title}</strong>
              <span>
                {pad(items.length)} {content.countLabel}
              </span>
            </div>
          </div>

          <div className="sdh-col sdh-col-right">{right.map((d, k) => card(d, k + half))}</div>
        </div>

        <Reveal className="sdh-cta-wrap">
          <div className="sdf-card sdf-cta">
            <span className="k-quote-mark svd-quote-mark" aria-hidden="true">
              &ldquo;&ldquo;
            </span>
            <p className="sdf-quote">{withBold(content.quote)}</p>
            <div className="sdf-cta-row">
              <span className="k-mono-label">{content.ctaNote}</span>
              <KButton href={content.cta.href} label={content.cta.label} variant="dark" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
