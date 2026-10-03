import Link from "next/link";
import LegalToc from "@/components/legal/LegalToc";
import LegalIcon from "@/components/legal/LegalIcon";
import ContactIcon from "@/components/contact/ContactIcon";
import { siteConfig } from "@/lib/siteConfig";
import type { LegalDoc } from "@/lib/legalContent";

/**
 * The legal text (light). Left: a sticky numbered "Contents" index with reading progress (hidden on
 * phones). Right: every section as a card — a large outlined number, the title, an "In short" line in
 * plain language, then the full text. Ends with a dark "Questions?" card (email, call, WhatsApp) and a
 * link to the other legal page.
 */
export default function LegalBody({ doc }: { doc: LegalDoc }) {
  const c = siteConfig.contact;

  return (
    <section className="k-section lg-body" id="legal-content" data-theme="light" aria-label={doc.name}>
      <div className="container lg-grid">
        <aside className="lg-side">
          <LegalToc items={doc.sections.map(({ id, title }) => ({ id, title }))} label={doc.contentsLabel} />
        </aside>

        <div className="lg-main">
          <div className="lg-sections" id="legal-sections">
            {doc.sections.map((s, i) => (
              <article key={s.id} id={s.id} className="lg-card">
                <span className="lg-card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="lg-card-title">{s.title}</h2>
                {s.summary && (
                  <p className="lg-short">
                    <span className="lg-short-label">
                      <LegalIcon name="eye" />
                      {doc.summaryLabel}
                    </span>
                    {s.summary}
                  </p>
                )}
                <div className="lg-prose" dangerouslySetInnerHTML={{ __html: s.html }} />
              </article>
            ))}
          </div>

          <div className="lg-help">
            <div className="lg-help-text">
              <span className="lg-help-label">{doc.contact.label}</span>
              <strong>{doc.contact.title}</strong>
              <p>{doc.contact.text}</p>
            </div>
            <div className="lg-help-actions">
              <a href={`mailto:${c.email}`} className="lg-help-btn is-primary">
                <ContactIcon name="mail" />
                {c.email}
              </a>
              <a href={c.phoneHref} className="lg-help-btn">
                <ContactIcon name="phone" />
                {c.phone}
              </a>
              <a href={c.whatsappHref} target="_blank" rel="noopener noreferrer" className="lg-help-btn">
                <ContactIcon name="whatsapp" />
                WhatsApp
              </a>
            </div>
            <Link href={doc.contact.other.href} className="lg-help-other">
              {doc.contact.other.label}
              <ContactIcon name="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
