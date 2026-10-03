/**
 * Editable content for the Contact page (/contact). Plain JSON in the same shape an admin panel / CMS
 * API should return — components never hold copy of their own (see lib/contactApi.ts).
 * Phone, email, address, hours and social links come from lib/siteConfig.ts so they stay the same
 * everywhere on the site. Headings are split into a soft (muted) lead-in and a strong part.
 */

import type { Heading, LinkItem, SeoMeta, StatItem } from "@/lib/servicesContent";

export interface ContactPageContent {
  name: string;
  seo: SeoMeta;
  hero: {
    label: string;
    title: Heading;
    desc: string;
    primaryCta: LinkItem;
    /** Second action — WhatsApp (href comes from siteConfig) */
    whatsappLabel: string;
    stats: StatItem[];
    /** Hero art: the main photo in an arch frame */
    photo: string;
    photoAlt: string;
    /** Second, round photo over the main photo's lower left */
    photo2: string;
    photo2Alt: string;
    /** Text circling the round badge */
    badgeText: string;
    /** Small chip on the photo */
    replyNote: string;
  };
  main: {
    label: string;
    title: Heading;
    desc: string;
    /** The four "ways to reach us" cards */
    cards: {
      callTitle: string;
      callNote: string;
      mailTitle: string;
      mailNote: string;
      whatsappTitle: string;
      whatsappNote: string;
      visitTitle: string;
      visitNote: string;
    };
    addressTitle: string;
    hoursTitle: string;
    directionsLabel: string;
    socialTitle: string;
    socialText: string;
  };
  form: {
    label: string;
    title: string;
    desc: string;
    progressLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    countrySearchPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    servicesLabel: string;
    sourceLabel: string;
    sourcePlaceholder: string;
    sources: string[];
    messageLabel: string;
    messagePlaceholder: string;
    messageMax: number;
    privacyText: string;
    submitLabel: string;
    sendingLabel: string;
    successTitle: string;
    successText: string;
    againLabel: string;
    errorText: string;
  };
}

export const contactPageContent: ContactPageContent = {
  name: "Contact Us",
  seo: {
    title: "Contact Us — Talk to Entec Media in Zirakpur, Punjab",
    description:
      "Get in touch with Entec Media for website design & development, mobile apps, UI/UX, graphic design, SEO, Google Ads and Meta Ads. Call +91-9996550841, WhatsApp or email info@entecmedia.com.",
  },
  hero: {
    label: "CONTACT US",
    title: { soft: "Let's talk about", strong: "your next idea" },
    desc: "Websites, apps, branding or marketing — tell us what you have in mind. A real person from our team replies within 24 hours with clear next steps.",
    primaryCta: { label: "Send a message", href: "#contact-form" },
    whatsappLabel: "Chat on WhatsApp",
    stats: [
      { value: "< 24 hrs", label: "Reply time" },
      { value: "Free", label: "Consultation" },
      { value: "4.9/5", label: "Client rating" },
    ],
    photo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=75",
    photoAlt: "Entec Media team celebrating a successful project with a client",
    photo2: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=75",
    photo2Alt: "The Entec Media team working together",
    badgeText: "SAY HELLO • GET IN TOUCH • ",
    replyNote: "Replies within 24 hrs",
  },
  main: {
    label: "+ GET IN TOUCH",
    title: { soft: "We're one message", strong: "away from you" },
    desc: "Pick whatever is easiest — call, WhatsApp, email, visit our office or send the form. Every message reaches a real person on our team.",
    cards: {
      callTitle: "Call us",
      callNote: "Talk to our team directly",
      mailTitle: "Email us",
      mailNote: "We reply within 24 hours",
      whatsappTitle: "WhatsApp",
      whatsappNote: "Quick questions & updates",
      visitTitle: "Visit us",
      visitNote: "Meet us at our office",
    },
    addressTitle: "Our office",
    hoursTitle: "Working hours",
    directionsLabel: "Get directions",
    socialTitle: "Follow us",
    socialText: "Work in progress, tips and launches — every week.",
  },
  form: {
    label: "SEND A MESSAGE",
    title: "Tell us about your project",
    desc: "A few details help us prepare. It takes less than a minute.",
    progressLabel: "complete",
    nameLabel: "Your name",
    namePlaceholder: "Full name",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    phoneLabel: "Phone number",
    phonePlaceholder: "98765 43210",
    countrySearchPlaceholder: "Search country or code",
    companyLabel: "Company / brand",
    companyPlaceholder: "Optional",
    servicesLabel: "What can we help with?",
    sourceLabel: "How did you hear about us?",
    sourcePlaceholder: "Select an option",
    sources: ["Google search", "Instagram / Facebook", "LinkedIn", "Friend or referral", "Existing client", "Other"],
    messageLabel: "Your message",
    messagePlaceholder: "Tell us about your business, what you'd like to build and any ideas you already have…",
    messageMax: 1500,
    privacyText: "By sending, you agree to our {privacy}. We never share your details.",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    successTitle: "Message sent!",
    successText: "Thank you — your message is with our team. We'll get back to you within 24 hours.",
    againLabel: "Send another message",
    errorText: "We couldn't send your message right now.",
  },
};
