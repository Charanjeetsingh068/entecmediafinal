import KButton from "./KButton";

interface CTABandProps {
  text?: string;
  label?: string;
  buttonLabel?: string;
  href?: string;
}

/** The slim Kudos call-to-action row that sits above the contact form ("Let's talk it through"). */
export default function CTABand({
  text = "The best collaborations start with clear expectations. We're here to answer whatever's on your mind today.",
  label = "Let's talk it through",
  buttonLabel = "Get in touch",
  href = "/contact",
}: CTABandProps) {
  return (
    <section className="k-cta-band" data-theme="light">
      <div className="container k-cta-band-inner">
        <p className="k-cta-band-text">{text}</p>
        <div className="k-cta-band-action">
          <span className="k-mono-label">{label}</span>
          <KButton href={href} label={buttonLabel} />
        </div>
      </div>
    </section>
  );
}
