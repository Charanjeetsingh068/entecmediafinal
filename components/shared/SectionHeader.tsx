import type { ReactNode } from "react";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  desc?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  /** "left": label on top, title across columns 1–2, description in column 3 (Kudos Process/Team headers) */
  layout?: "default" | "left";
}

/**
 * The Kudos 4-column section header: label (col 1), heading (cols 2–3), description (col 4).
 * Wrap the lead-in word(s) of the title in <span className="k-muted"> or <span className="highlight-focus">.
 */
export default function SectionHeader({ label, title, desc, as = "h2", className = "", layout = "default" }: SectionHeaderProps) {
  const Heading = as;
  return (
    <div className={`why-top-layout k-section-head ${layout === "left" ? "k-section-head-left" : ""} ${className}`.trim()}>
      <div className="why-col-left">
        <span className="why-section-label">{label}</span>
      </div>
      <div className="why-col-center">
        <Heading className="why-main-title">{title}</Heading>
      </div>
      <div className="why-col-right">{desc && <p className="why-header-desc">{desc}</p>}</div>
    </div>
  );
}
