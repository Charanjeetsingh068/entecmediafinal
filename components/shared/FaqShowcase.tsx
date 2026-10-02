"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import DotBackdrop from "@/components/shared/DotBackdrop";
import { siteConfig } from "@/lib/siteConfig";
import type { FaqEntry, FaqHelp, Heading } from "@/lib/servicesContent";

interface FaqShowcaseProps {
  items: FaqEntry[];
  label: string;
  title: Heading;
  desc: string;
  help: FaqHelp;
  id?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const RING = 2 * Math.PI * 54;

/**
 * FAQ (light) over the calm animated dot background.
 * Left (sticky): label, heading, intro, a large counter showing the open question inside a ring that
 * fills as you move down the list, and a help card (call / WhatsApp / contact form).
 * Right: numbered accordion cards. Hover nudges a card and turns its number blue; the open card gets a
 * blue rail, a soft glow and a faint large number behind its answer, which unfolds smoothly with a
 * "talk to us" link. Cards rise in one by one as they scroll into view.
 * Tablet / phones: one column, the counter hidden. Also outputs FAQPage JSON-LD.
 */
export default function FaqShowcase({ items, label, title, desc, help, id = "faq" }: FaqShowcaseProps) {
  const [open, setOpen] = useState(0);

  const shown = open >= 0 ? open : 0;
  const ringOffset = RING * (1 - (shown + 1) / Math.max(1, items.length));

  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  return (
    <section className="k-section fq" id={id} data-theme="light" aria-labelledby={`${id}-title`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <DotBackdrop />

      <div className="container fq-grid">
        <div className="fq-side">
          <div className="fq-side-inner">
            <span className="why-section-label">
              <span className="k-accent-dot" aria-hidden="true" /> {label.replace(/^\+\s*/, "")}
            </span>
            <h2 className="why-main-title fq-title" id={`${id}-title`}>
              <span className="k-muted">{title.soft}</span>
              <br />
              {title.strong}
            </h2>
            <p className="why-header-desc fq-desc">{desc}</p>

            <div className="fq-counter" aria-hidden="true">
              <svg className="fq-ring" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" className="fq-ring-track" />
                <circle cx="60" cy="60" r="54" className="fq-ring-fill" style={{ strokeDasharray: RING, strokeDashoffset: ringOffset }} />
              </svg>
              <span className="fq-counter-num" key={shown}>
                {pad(shown + 1)}
              </span>
              <span className="fq-counter-total">/ {pad(items.length)}</span>
            </div>

            <div className="fq-help">
              <strong>{help.title}</strong>
              <span>{help.text}</span>
              <div className="fq-help-links">
                <a href={siteConfig.contact.phoneHref}>{help.callLabel}</a>
                <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                  {help.whatsappLabel}
                </a>
                <Link href="/contact">{help.contactLabel}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="fq-list">
          {items.map((item, i) => {
            const isOpen = open === i;
            const qid = `${id}-q${i}`;
            return (
              <div
                key={item.question}
                className={`fq-item ${isOpen ? "is-open" : ""}`}
                style={{ "--i": i } as CSSProperties}
                data-kfx={`y:${48 + Math.min(i, 5) * 12};opacity:0`}
              >
                <h3 className="fq-q">
                  <button type="button" id={qid} aria-expanded={isOpen} aria-controls={`${qid}-a`} onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span className="fq-num">{pad(i + 1)}</span>
                    <span className="fq-q-text">
                      {item.tag && <small className="fq-tag">{item.tag}</small>}
                      {item.question}
                    </span>
                    <span className="fq-toggle" aria-hidden="true" />
                  </button>
                </h3>
                <div className="fq-a" id={`${qid}-a`} role="region" aria-labelledby={qid}>
                  <div className="fq-a-inner">
                    <span className="fq-ghost" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <p>{item.answer}</p>
                    <Link href="/contact" className="fq-ask" tabIndex={isOpen ? 0 : -1}>
                      {help.askLabel}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
