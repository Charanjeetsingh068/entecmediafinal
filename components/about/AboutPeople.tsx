"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { teamMembers } from "@/lib/teamData";
import SectionHeader from "@/components/shared/SectionHeader";

// The About page shows three teams: design, development and marketing
const team = teamMembers.slice(0, 3);

// Mouse only: the card tilts towards the pointer and a soft light follows it (--cx/--cy -1…1, --px/--py)
const onMove = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  el.style.setProperty("--cx", (x * 2 - 1).toFixed(3));
  el.style.setProperty("--cy", (y * 2 - 1).toFixed(3));
  el.style.setProperty("--px", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--py", `${(y * 100).toFixed(1)}%`);
};
const onLeave = (e: PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--cx", "0");
  e.currentTarget.style.setProperty("--cy", "0");
};

/**
 * About "Our team" — light. Three portrait cards in one row across the full width, the middle one set
 * lower. Each card: the photo (soft grey until hovered), a number pill, the team's word running up
 * the right edge in outlined type, and a glass panel with the name and role that opens on hover to show the
 * team's quote. On a mouse the card tilts towards the pointer, a soft light follows it and the border
 * lights up in the brand blue. Cards open upwards one after another when the row comes into view.
 * Tablets: two columns with the third card centred below; phones: one column. Touch screens always show
 * the quotes.
 */
export default function AboutPeople() {
  const rowRef = useRef<HTMLDivElement>(null);

  // The cards open once the row comes into view
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          row.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <section className="ab-team" data-theme="light">
      <span className="ab-team-blob" aria-hidden="true" />

      <div className="container">
        <SectionHeader
          label="+ OUR TEAM"
          title={
            <>
              <span className="k-muted">The people</span>
              <br />
              behind the work
            </>
          }
          desc="Specialists in design, development and marketing — one team, working closely on every project."
        />
      </div>

      <div className="ab-team-row-wrap">
        <div className="container ab-team-row" ref={rowRef}>
          {team.map((m, i) => (
            <div key={m.name} className="ab-team-col">
              <article
                className="ab-team-card"
                style={{ "--i": i } as CSSProperties}
                tabIndex={0}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
              >
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 599px) 92vw, (max-width: 1023px) 50vw, 33vw" className="ab-team-img" />
                <span className="ab-team-shade" aria-hidden="true" />
                <span className="ab-team-light" aria-hidden="true" />

                <span className="ab-team-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ab-team-word" aria-hidden="true">
                  {m.name.split(" ")[0]}
                </span>

                <div className="ab-team-panel">
                  <div className="ab-team-panel-head">
                    <span>
                      <h3 className="ab-team-name">{m.name}</h3>
                      <span className="ab-team-role">{m.role}</span>
                    </span>
                    <span className="ab-team-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </div>
                  <div className="ab-team-more">
                    <p className="ab-team-quote">&ldquo;{m.quote}&rdquo;</p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
