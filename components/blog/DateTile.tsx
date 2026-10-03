interface DateTileProps {
  /** ISO date of the article */
  date?: string | null;
  className?: string;
}

/**
 * The publish date as a small white calendar tile (blue top strip with the month, the day large, the
 * year below). Solid so it stays readable on any photo; used on the blog cards and the hero covers.
 */
export default function DateTile({ date, className = "" }: DateTileProps) {
  const d = date ? new Date(date) : null;
  if (!d || Number.isNaN(d.getTime())) return null;
  const month = d.toLocaleDateString("en-IN", { month: "short" }).replace(/\.$/, "");

  return (
    <time className={`bl-date ${className}`.trim()} dateTime={d.toISOString().slice(0, 10)}>
      <span className="bl-date-month">{month}</span>
      <span className="bl-date-day">{String(d.getDate()).padStart(2, "0")}</span>
      <span className="bl-date-year">{d.getFullYear()}</span>
    </time>
  );
}
