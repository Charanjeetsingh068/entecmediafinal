import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

interface Crumb {
  label: string;
  href: string;
}

/**
 * Breadcrumb pill for the dark page heroes (same look as the About hero) plus its BreadcrumbList
 * JSON-LD for search engines. The last crumb is the current page.
 * Always one line: earlier crumbs keep their size and a long current page name ends in "…" (full name
 * in its tooltip).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${siteConfig.url}${c.href === "/" ? "/" : `${c.href}/`}`,
    })),
  };

  return (
    <nav className="ab-crumbs" aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className={`ab-crumbs-item${last ? " is-current" : ""}`}>
              {i > 0 && (
                <span className="ab-crumbs-sep" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              )}
              {last ? (
                <span aria-current="page" title={c.label}>
                  {c.label}
                </span>
              ) : (
                <Link href={c.href}>{c.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
