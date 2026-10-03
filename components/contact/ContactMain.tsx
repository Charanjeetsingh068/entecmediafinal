import SectionHeader from "@/components/shared/SectionHeader";
import DotBackdrop from "@/components/shared/DotBackdrop";
import ContactForm from "@/components/contact/ContactForm";
import ContactIcon, { socialIcon, type ContactIconName } from "@/components/contact/ContactIcon";
import { mapEmbedUrl, siteConfig } from "@/lib/siteConfig";
import type { ContactPageContent } from "@/lib/contactContent";

interface ContactMainProps {
  content: ContactPageContent;
  services: string[];
}

/**
 * "Get in touch" (light), over the calm dot background used on the Services page.
 * Header, then four "ways to reach us" cards (call, email, WhatsApp, visit) — each lifts on hover, its
 * icon fills brand blue and a line draws along the bottom. Below: the contact form card (left) and a
 * column with the Google map (the office address card sits on the map, with a Get directions button),
 * working hours and social media. The form is never faded by the scroll effect (it is tall, so a
 * scroll-linked fade would leave it washed out while people fill it in on phones); it stands out with
 * a brand-blue frame and glow instead. ≤1199px: form, then the map column; cards go 2 × 2, then one column.
 */
export default function ContactMain({ content, services }: ContactMainProps) {
  const { main: m, form } = content;
  const c = siteConfig.contact;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.mapQuery)}`;
  const waNumber = c.whatsappHref.replace(/^\D*wa\.me\//, "+").replace(/^\+(\d{2})(\d{5})(\d+)$/, "+$1 $2 $3");

  const cards: { icon: ContactIconName; title: string; value: string; note: string; href: string; external?: boolean }[] = [
    { icon: "phone", title: m.cards.callTitle, value: c.phone, note: m.cards.callNote, href: c.phoneHref },
    { icon: "mail", title: m.cards.mailTitle, value: c.email, note: m.cards.mailNote, href: `mailto:${c.email}` },
    { icon: "whatsapp", title: m.cards.whatsappTitle, value: waNumber, note: m.cards.whatsappNote, href: c.whatsappHref, external: true },
    { icon: "pin", title: m.cards.visitTitle, value: c.addressLines[c.addressLines.length - 1] ?? "", note: m.cards.visitNote, href: directions, external: true },
  ];

  return (
    <section className="k-section sx ct-main" id="contact-form" data-theme="light" aria-labelledby="ct-main-title">
      <DotBackdrop />

      <div className="container sx-inner">
        <SectionHeader
          label={m.label}
          title={
            <span id="ct-main-title">
              <span className="k-muted">{m.title.soft}</span>
              <br />
              {m.title.strong}
            </span>
          }
          desc={m.desc}
        />

        <ul className="ct-cards">
          {cards.map((card, i) => (
            <li key={card.title} data-kfx={`y:${48 + i * 24};opacity:0`}>
              <a
                href={card.href}
                className="ct-card"
                {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="ct-card-icon">
                  <ContactIcon name={card.icon} />
                </span>
                <span className="ct-card-title">{card.title}</span>
                <strong className="ct-card-value">{card.value}</strong>
                <span className="ct-card-note">{card.note}</span>
                <span className="ct-card-arrow" aria-hidden="true">
                  <ContactIcon name="arrow" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="ct-grid">
          <div className="ct-form-col">
            <ContactForm content={form} services={services} />
          </div>

          <div className="ct-side">
            <div className="ct-map" data-kfx="y:80;opacity:0">
              <iframe src={mapEmbedUrl} title="Entec Media office on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="ct-map-card">
                <span className="ct-map-pin" aria-hidden="true">
                  <ContactIcon name="pin" />
                </span>
                <span className="ct-map-text">
                  <small>{m.addressTitle}</small>
                  <strong>{siteConfig.name}</strong>
                  <span>{c.addressLines.join(" ")}</span>
                </span>
                <a href={directions} target="_blank" rel="noopener noreferrer" className="ct-map-btn">
                  {m.directionsLabel}
                  <ContactIcon name="arrow" />
                </a>
              </div>
            </div>

            <div className="ct-info" data-kfx="y:80;opacity:0">
              <div className="ct-hours">
                <span className="ct-info-icon" aria-hidden="true">
                  <ContactIcon name="clock" />
                </span>
                <span>
                  <small>{m.hoursTitle}</small>
                  <strong>{c.hours}</strong>
                </span>
              </div>

              <div className="ct-social">
                <div className="ct-social-head">
                  <strong>{m.socialTitle}</strong>
                  <small>{m.socialText}</small>
                </div>
                <ul>
                  {siteConfig.socialLinks.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                        <ContactIcon name={socialIcon(s.label)} />
                        <span>{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
