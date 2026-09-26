import PageHero from "@/components/shared/PageHero";
import { siteConfig } from "@/lib/siteConfig";

/** Contact hero (Kudos "Let's define what's next") with address, email/phone and social links. */
export default function ContactMainSection() {
  return (
    <PageHero
      label="+ CONTACT"
      title={
        <>
          <span className="k-muted">Let&apos;s</span> define
          <br />
          what&apos;s next
        </>
      }
      desc="Need a website, mobile app or marketing campaign? Call, email or fill out the form — we reply within 24 hours."
    >
      <div className="k-contact-info">
        <div className="k-contact-col">
          <p className="k-mono-small">
            IT &amp; Digital Marketing Company
            <br />
            Based in Zirakpur, Punjab
          </p>
          <p className="k-mono-small">
            {siteConfig.contact.addressLines[0]}
            <br />
            {siteConfig.contact.addressLines[1]}
          </p>
        </div>
        <div className="k-contact-main">
          <a href={`mailto:${siteConfig.contact.email}`} className="k-contact-email">
            {siteConfig.contact.email}
          </a>
          <a href={siteConfig.contact.phoneHref} className="k-contact-phone">
            {siteConfig.contact.phone}
          </a>
          <a href={siteConfig.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="k-text-link">
            Chat on WhatsApp
          </a>
          <p className="k-mono-small">{siteConfig.contact.hours}</p>
        </div>
        <div className="k-contact-col">
          <span className="k-mono-label">Social media</span>
          <ul className="k-side-list">
            {siteConfig.socialLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageHero>
  );
}
