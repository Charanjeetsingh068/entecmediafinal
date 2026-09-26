import Link from "next/link";

interface KButtonProps {
  href?: string;
  label: string;
  /** "light" (default) for light sections, "dark" for dark sections, "accent" for the brand fill */
  variant?: "light" | "dark" | "accent";
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

/** Kudos-style block button: label on the left, three dots on the right that morph into an arrow on hover. */
export default function KButton({
  href,
  label,
  variant = "light",
  type = "button",
  disabled,
  external,
  className = "",
  onClick,
}: KButtonProps) {
  const classes = `k-btn k-btn-${variant} ${className}`.trim();
  const inner = (
    <>
      <span className="k-btn-label">{label}</span>
      <span className="k-btn-icon" aria-hidden="true">
        <span className="k-btn-dot" />
        <span className="k-btn-dot" />
        <span className="k-btn-dot" />
      </span>
    </>
  );

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
