interface PortfolioResultsProps {
  results: { value: string; title: string; desc: string }[];
}

/** Results grid shown at the end of a case study. */
export default function PortfolioResults({ results }: PortfolioResultsProps) {
  return (
    <div className="k-deliverable-grid k-results-grid">
      {results.map((result) => (
        <div key={result.title} className="k-deliverable">
          <span className="k-result-value">{result.value}</span>
          <h3>{result.title}</h3>
          <p>{result.desc}</p>
        </div>
      ))}
    </div>
  );
}
