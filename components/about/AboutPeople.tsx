"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { teamMembers } from "@/lib/teamData";
import SectionHeader from "@/components/shared/SectionHeader";
import KButton from "@/components/shared/KButton";

const roles = ["Designers", "Developers", "Marketers", "Strategists"];

/**
 * About "Our team" — light section.
 * - A band of role names slides sideways with the scroll (two rows in opposite directions), set in
 *   soft grey so it frames the section without competing with the cards.
 * - Four team cards on the guide-line columns; the even ones sit lower and all drift at slightly
 *   different speeds as the page scrolls (a gentle parallax). Hover (or focus): the photo zooms a
 *   touch and the member's quote slides up over it. On touch screens the quote is always shown.
 * - Careers call to action underneath.
 */
export default function AboutPeople() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
      section.style.setProperty("--tp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const band = [...roles, ...roles, ...roles];

  return (
    <section className="ab-team" data-theme="light" ref={sectionRef}>
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

      <div className="ab-team-band" aria-hidden="true">
        <div className="ab-team-band-row ab-team-band-a">
          {band.map((r, i) => (
            <span key={i}>
              {r}
              <i>✦</i>
            </span>
          ))}
        </div>
        <div className="ab-team-band-row ab-team-band-b">
          {band.map((r, i) => (
            <span key={i}>
              {r}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="ab-team-grid">
          {teamMembers.map((m, i) => (
            <article key={m.name} className="ab-team-card" style={{ "--i": i } as CSSProperties} tabIndex={0}>
              <div className="ab-team-photo">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 25vw"
                  className="ab-team-img"
                />
                <span className="ab-team-idx">{String(i + 1).padStart(2, "0")}</span>
                <p className="ab-team-quote">&ldquo;{m.quote}&rdquo;</p>
              </div>
              <div className="ab-team-info">
                <h3 className="ab-team-name">{m.name}</h3>
                <p className="ab-team-role">{m.role}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="ab-team-cta" data-kfx="opacity:0;y:48">
          <p>
            Want to build <strong>work people remember?</strong>
          </p>
          <div className="ab-team-cta-action">
            <span className="k-mono-label">We&apos;re always meeting good people</span>
            <KButton href="/careers" label="Join the team" />
          </div>
        </div>
      </div>
    </section>
  );
}
