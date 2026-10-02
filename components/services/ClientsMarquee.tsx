"use client";

import { useRef, type CSSProperties } from "react";
import KButton from "@/components/shared/KButton";
import CountUp from "@/components/shared/CountUp";
import type { Client } from "@/lib/clientsData";
import type { ServicesPageContent } from "@/lib/servicesContent";
import { useScrollVar } from "@/lib/useScrollVar";

interface ClientsMarqueeProps {
  clients: Client[];
  content: ServicesPageContent["clients"];
}

/**
 * "Our clients" (dark) — a rounded panel just above the footer, inset from the sides with space below.
 * A heading row with three counters, then two rows of client logos (images only) that glide in opposite
 * directions forever (CSS animation, so it never stutters). Each logo keeps its own colours on a white
 * tile; under the pointer the tile lifts with a blue ring, and hovering a row pauses it. The rows also drift a little sideways with page scroll, both
 * edges fade out, and a faint dot grid sits behind everything.
 */
export default function ClientsMarquee({ clients, content }: ClientsMarqueeProps) {
  const half = Math.ceil(clients.length / 2);
  const rows = [clients.slice(0, half), clients.slice(half)].filter((r) => r.length);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollVar(sectionRef, "through");

  return (
    <section className="k-section cl" data-theme="dark" ref={sectionRef} aria-labelledby="clients-title">
      <div className="container cl-head">
        <div className="cl-head-copy">
          <span className="why-section-label">
            <span className="k-accent-dot" aria-hidden="true" /> {content.label}
          </span>
          <h2 className="cl-title" id="clients-title">
            <span className="sd-soft">{content.title.soft}</span>
            <br />
            {content.title.strong}
          </h2>
        </div>
        <dl className="cl-stats">
          {content.stats.map((s) => (
            <div key={s.label} className="cl-stat">
              <dt>{s.label}</dt>
              <dd>
                {s.decimals ? (
                  <>
                    {s.value}
                    {s.suffix}
                  </>
                ) : (
                  <CountUp end={s.value} suffix={s.suffix} duration={1800} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="cl-rows">
        {rows.map((row, r) => (
          <div key={r} className={`cl-row ${r === 1 ? "is-reverse" : ""}`} style={{ "--dur": `${row.length * 6}s` } as CSSProperties}>
            <ul className="cl-track" aria-label={r === 0 ? "Some of our clients" : undefined}>
              {[...row, ...row, ...row].map((c, i) => {
                const hidden = i >= row.length;
                return (
                  <li key={i} className="cl-logo" aria-hidden={hidden ? true : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.logo} alt={hidden ? "" : `${c.name} logo`} loading="lazy" decoding="async" />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="container cl-foot">
        <p>
          {content.footText} <strong>{content.footStrong}</strong>
        </p>
        <KButton href={content.cta.href} label={content.cta.label} variant="dark" />
      </div>
    </section>
  );
}
