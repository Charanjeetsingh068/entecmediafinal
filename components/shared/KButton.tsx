import Link from "next/link";

interface KButtonProps {
  href?: string;
  label: string;
  /**
   * "light" (default) for light sections, "dark" for dark sections (or over photos),
   * "accent" for brand-blue text.
   */
  variant?: "light" | "dark" | "accent";
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  /**
   * Render as a plain <span> for use inside another link (e.g. a whole card that is the link). Give the
   * surrounding link the class "k-btn-host" so hovering it plays the button's hover.
   */
  as?: "span";
  className?: string;
  onClick?: () => void;
}

/**
 * The site's one button, "magnetic orb": an outlined pill with the label on the left and a round
 * brand-blue orb with an arrow inside on the right. Same size everywhere. Hover: the orb swells to
 * fill the pill from the inside (never past its own outline), the label turns white and the arrow
 * turns from ↗ to →. On mouse devices the button also leans slightly towards the pointer
 * (components/shared/ButtonMagnet.tsx).
 */
export default function KButton({
  href,
  label,
  variant = "light",
  type = "button",
  disabled,
  external,
  as,
  className = "",
  onClick,
}: KButtonProps) {
  const classes = `k-btn k-btn-${variant} ${className}`.trim();
  const inner = (
    <>
      <span className="k-btn-fill" aria-hidden="true" />
      <span className="k-btn-label">{label}</span>
      <span className="k-btn-orb" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  );

  if (as === "span") {
    return <span className={classes}>{inner}</span>;
  }
  if (href && external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
