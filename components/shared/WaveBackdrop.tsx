/**
 * Calm background for light sections: a few faint brand-blue wave lines that drift slowly sideways
 * (each at its own speed, CSS only) and two soft blobs. Kept very light so content stays the focus.
 * Place it as the first child of a `position: relative` section.
 */
const waves = [
  "M0 60 C 150 20, 300 100, 450 60 S 750 20, 900 60 S 1200 100, 1350 60 S 1650 20, 1800 60",
  "M0 60 C 150 100, 300 20, 450 60 S 750 100, 900 60 S 1200 20, 1350 60 S 1650 100, 1800 60",
];

export default function WaveBackdrop() {
  return (
    <div className="wb-bg" aria-hidden="true">
      <span className="wb-blob wb-blob-a" />
      <span className="wb-blob wb-blob-b" />
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} className={`wb-wave wb-wave-${i}`} viewBox="0 0 1800 120" preserveAspectRatio="none">
          <path d={waves[i % 2]} />
        </svg>
      ))}
    </div>
  );
}
