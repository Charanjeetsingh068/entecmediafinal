import type { CSSProperties } from "react";
import type { CareersPageContent } from "@/lib/careersContent";

interface CareersProcessProps {
  content: CareersPageContent["process"];
  /** Smaller variant inside a job page (no section header, light) */
  compact?: boolean;
  title?: string;
}

/**
 * "How we hire" — four steps on a line. A pulse travels along the line from step to step and each step's
 * number lights up in turn; each step shows its timing (Day 1, Day 2–3 …). Dark section on the Careers
 * page; a compact light version sits on every job page.
 */
export default function CareersProcess({ content, compact, title }: CareersProcessProps) {
  const steps = (
    <ol className="cr-steps" style={{ "--n": content.steps.length } as CSSProperties}>
      <span className="cr-steps-line" aria-hidden="true">
        <span />
      </span>
      {content.steps.map((s, i) => (
        <li key={s.title} className="cr-step" style={{ "--i": i } as CSSProperties}>
          <span className="cr-step-num">{String(i + 1).padStart(2, "0")}</span>
          <small className="cr-step-time">{s.time}</small>
          <strong>{s.title}</strong>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );

  if (compact) {
    return (
      <div className="cr-process-compact">
        {title && <h2 className="cr-detail-h">{title}</h2>}
        {steps}
      </div>
    );
  }

  return (
    <section className="k-section cr-process" id="process" data-theme="dark" aria-labelledby="cr-process-title">
      <div className="container">
        <div className="why-top-layout k-section-head">
          <div className="why-col-left">
            <span className="why-section-label">{content.label}</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title" id="cr-process-title">
              <span className="sd-soft">{content.title.soft}</span>
              <br />
              {content.title.strong}
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">{content.desc}</p>
          </div>
        </div>
        {steps}
      </div>
    </section>
  );
}
