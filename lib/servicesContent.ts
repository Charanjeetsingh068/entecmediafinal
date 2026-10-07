import { imageManifest } from "@/lib/imageManifest";
/**
 * Editable content for the Services listing page and the shared sections of every service detail page.
 * Everything here is plain JSON (strings, numbers, arrays) — the same shape an admin panel / CMS API
 * should return — so it can move to a database without touching the components. Components never hold
 * copy of their own; they receive these objects as props (see lib/servicesApi.ts).
 *
 * Text tokens: "{service}" is replaced with the service name in lower case ("website design"),
 * "{Service}" with the name as written ("Website Design").
 * Headings are split into a soft (muted) lead-in and a strong part: { soft, strong }.
 */

export interface LinkItem {
  label: string;
  href: string;
}

export interface Heading {
  soft: string;
  strong: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  ogImage?: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface CounterItem {
  /** Number to count up to */
  value: number;
  suffix?: string;
  /** Decimal places (shown without counting, e.g. 4.9) */
  decimals?: number;
  label: string;
}

export interface SectionIntro {
  label: string;
  title: Heading;
  desc: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
  /** Optional topic tag shown above the question */
  tag?: string;
}

/** Labels for the FAQ's help card and answer link (components/shared/FaqShowcase.tsx) */
export interface FaqHelp {
  title: string;
  text: string;
  callLabel: string;
  whatsappLabel: string;
  contactLabel: string;
  /** Small link under each open answer */
  askLabel: string;
}

export interface HeroCard {
  image: string;
  alt: string;
  tag: string;
  note: string;
  href: string;
}

export interface ServicesPageContent {
  seo: SeoMeta;
  hero: {
    label: string;
    title: Heading;
    desc: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    stats: StatItem[];
    cards: HeroCard[];
    chip: string;
    /** Milliseconds each card stays in front */
    interval: number;
  };
  list: SectionIntro & {
    /** Cards per page */
    perPage: number;
    exploreLabel: string;
  };
  faq: SectionIntro & { items: FaqEntry[]; help: FaqHelp };
  clients: SectionIntro & {
    stats: CounterItem[];
    footText: string;
    footStrong: string;
    cta: LinkItem;
  };
}

/** The dark "Get a quote" call-to-action (components/shared/QuoteCta.tsx) — no form, the button opens /contact */
export interface QuoteCtaContent extends SectionIntro {
  button: LinkItem;
  /** Small label before the phone number */
  callLabel: string;
  cardTitle: string;
  cardTag: string;
  /** Points that tick in one by one on the card */
  points: string[];
  readyLabel: string;
  badgeText: string;
}

export interface ServiceDetailSections {
  hero: { primaryCta: LinkItem; secondaryCta: LinkItem; includedLabel: string };
  intro: { label: string; toolsLabel: string; ctaLabel: string };
  features: SectionIntro & {
    /** Small label above each deliverable's title */
    itemLabel: string;
    /** Under the service name in the hub, after the count ("06 core deliverables") */
    countLabel: string;
    /** Closing line under the list; **double asterisks** mark the bold parts */
    quote: string;
    ctaNote: string;
    cta: LinkItem;
    badgeText: string;
  };
  projects: SectionIntro & {
    /** Intro line in the sticky side column; **double asterisks** mark the bold parts */
    quote: string;
    stats: CounterItem[];
    cta: LinkItem;
  };
  /** The questions themselves come from each service's own faqs (lib/servicesData.ts) */
  faq: SectionIntro & { help: FaqHelp };
  /** "Get a quote" call-to-action between Featured projects and the FAQ (no form — the button opens /contact) */
  cta: QuoteCtaContent;
}

const unsplash = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop&q=72`;

export const servicesPageContent: ServicesPageContent = {
  seo: {
    title: "Our Services — Website, App, Design & Digital Marketing",
    description:
      "Website design & development, mobile app design & development, UI/UX, graphic design, digital marketing, SEO, Google Ads and Meta Ads by Entec Media, Zirakpur, Punjab.",
    ogImage: unsplash("1559028012-481c04fa702d", 1200),
  },
  hero: {
    label: "OUR SERVICES",
    title: { soft: "Digital services", strong: "that grow brands" },
    desc: "Website design and development, mobile apps, UI/UX, branding, SEO, Google Ads and Meta Ads — planned and delivered by one team in Zirakpur, Punjab, for businesses across India and abroad.",
    primaryCta: { label: "Get a free quote", href: "/contact" },
    secondaryCta: { label: "Explore services", href: "#services-list" },
    stats: [
      { value: "10+", label: "Services" },
      { value: "250+", label: "Projects delivered" },
      { value: "4.9/5", label: "Client rating" },
    ],
    cards: [
      { image: unsplash("1559028012-481c04fa702d", 1300), alt: "A website being designed on a large monitor", tag: "Websites", note: "Design & development", href: "/services/website-design" },
      { image: unsplash("1586953208448-b95a79798f07", 1300), alt: "A mobile shopping app open on a phone", tag: "Mobile Apps", note: "Android & iOS", href: "/services/mobile-app-development" },
      { image: unsplash("1626785774625-ddcddc3445e9", 1300), alt: "Design software icons on a screen in a dark studio", tag: "Branding", note: "Logos & creatives", href: "/services/graphic-design" },
      { image: unsplash("1611926653458-09294b3142bf", 1300), alt: "Social media apps on a phone screen", tag: "Marketing", note: "SEO, Google & Meta Ads", href: "/services/digital-marketing" },
    ],
    chip: "One team · Design → Build → Grow",
    interval: 3600,
  },
  list: {
    label: "+ WHAT WE DO",
    title: { soft: "Everything you need", strong: "to grow online" },
    desc: "Ten focused services across design, development and digital marketing. Choose one, or combine them — one team plans and delivers it all.",
    perPage: 6,
    exploreLabel: "Explore service",
  },
  faq: {
    help: {
      title: "Still have a question?",
      text: "Talk to a real person — we usually reply within 24 hours.",
      callLabel: "Call us",
      whatsappLabel: "WhatsApp",
      contactLabel: "Contact us",
      askLabel: "Still unsure? Talk to us",
    },
    label: "FAQ",
    title: { soft: "Questions,", strong: "answered clearly" },
    desc: "Straight answers about pricing, timelines and how we work. Can't find yours? Ask us directly.",
    items: [
      { tag: "Getting started", question: "How do you start a new project?", answer: "Every project begins with a free discovery call. We understand your business, goals, audience and budget, then share a clear proposal with scope, timeline and cost before any work starts." },
      { tag: "Pricing", question: "How much does a website or app cost?", answer: "It depends on pages, features and integrations. After the discovery call you receive a fixed-price quote with no hidden charges. Business websites typically start from ₹25,000." },
      { tag: "Services", question: "Can I combine services, like a website with SEO and ads?", answer: "Yes — most clients do. One team designs, builds and markets your website or app, so everything works together and you get one plan and one point of contact." },
      { tag: "Timeline", question: "How long does a typical project take?", answer: "A business website usually takes 3–6 weeks, a mobile app 8–16 weeks, and marketing campaigns can go live within a week. You get a clear timeline in your proposal." },
      { tag: "Location", question: "Do you work with clients outside Punjab and India?", answer: "Yes. We work with businesses across India and internationally. Calls, updates and reviews happen online, so location is never a barrier." },
      { tag: "Support", question: "What happens after my website or app goes live?", answer: "We offer maintenance and growth plans — updates, backups, security, new features, SEO and campaign management — so your product keeps performing after launch." },
    ],
  },
  clients: {
    label: "OUR CLIENTS",
    title: { soft: "Brands that", strong: "grow with Entec Media" },
    desc: "",
    stats: [
      { value: 88, suffix: "+", label: "Brands served" },
      { value: 12, suffix: "+", label: "Industries" },
      { value: 4.9, suffix: "/5", decimals: 1, label: "Average rating" },
    ],
    footText: "From local clinics and boutiques to SaaS companies and e-commerce brands —",
    footStrong: "your logo could be next.",
    cta: { label: "Start your project", href: "/contact" },
  },
};

/** Sections shared by every service detail page. A service can override any of them (ServiceDetail.sections). */
export const serviceDetailSections: ServiceDetailSections = {
  hero: {
    primaryCta: { label: "Get a free quote", href: "#quote" },
    secondaryCta: { label: "See our work", href: "#projects" },
    includedLabel: "What's included",
  },
  intro: {
    label: "OVERVIEW",
    toolsLabel: "Tools & platforms",
    ctaLabel: "Discuss your {service} project",
  },
  features: {
    label: "WHAT'S INCLUDED",
    title: { soft: "Everything your", strong: "{service} project needs" },
    desc: "Clear deliverables, agreed before we start. Here is what you receive when you choose Entec Media for {service}.",
    itemLabel: "Included",
    countLabel: "core deliverables",
    quote: "One team plans, designs and delivers your {service} — **clear deliverables, honest timelines** and support that **continues after launch**.",
    ctaNote: "Ready to start your {service} project?",
    cta: { label: "Get a free quote", href: "#quote" },
    badgeText: "GET A QUOTE • GET A QUOTE •",
  },
  projects: {
    label: "+ FEATURED PROJECTS",
    title: { soft: "{Service}", strong: "projects we're proud of" },
    desc: "Real projects, real challenges and measurable results — a selection of our {service} work for growing businesses.",
    quote: "A curated selection of **{service} projects** we have delivered to help businesses stand out and grow online.",
    stats: [
      { value: 136, label: "Websites" },
      { value: 24, label: "Apps" },
      { value: 88, label: "Brands" },
      { value: 10, suffix: "+", label: "Services" },
    ],
    cta: { label: "View all projects", href: "/portfolio" },
  },
  faq: {
    help: {
      title: "Still have a question?",
      text: "Talk to a real person — we usually reply within 24 hours.",
      callLabel: "Call us",
      whatsappLabel: "WhatsApp",
      contactLabel: "Contact us",
      askLabel: "Still unsure? Talk to us",
    },
    label: "FAQ",
    title: { soft: "{Service}", strong: "questions answered" },
    desc: "Everything you need to know about working with Entec Media on {service}.",
  },
  cta: {
    label: "GET A QUOTE",
    title: { soft: "Ready to start your", strong: "{Service} project?" },
    desc: "Tell us what you need — we'll reply within 24 hours with ideas, a clear timeline and a fixed quote. No obligation, no hidden charges.",
    button: { label: "Get a quote", href: "/contact" },
    callLabel: "Or call us",
    cardTitle: "Your {Service} quote",
    cardTag: "Free · No obligation",
    points: [
      "{Service} planned around your goals",
      "Free discovery call with our team",
      "Clear timeline and a fixed price",
      "Reply within 24 hours",
    ],
    readyLabel: "Ready to start",
    badgeText: "GET A QUOTE • GET A QUOTE •",
  },
};

/** Replaces the {service} / {Service} / {SERVICE} tokens. */
export function fillService(text: string, serviceTitle: string): string {
  return text
    .replace(/\{service\}/g, serviceTitle.toLowerCase())
    .replace(/\{Service\}/g, serviceTitle)
    .replace(/\{SERVICE\}/g, serviceTitle.toUpperCase());
}

/** Resizes an Unsplash-style URL (one with a w= parameter); other URLs are returned unchanged. */
export function sizedImage(url: string, width: number): string {
  if (/[?&]w=\d+/.test(url)) return url.replace(/([?&]w=)\d+/, `$1${width}`);
  // Local images with responsive copies (scripts/optimize-images.mjs): the smallest copy at least that wide
  const m = imageManifest[url];
  if (m) return `${m.base}-${m.widths.find((w) => w >= width) ?? m.width}.webp`;
  return url;
}
