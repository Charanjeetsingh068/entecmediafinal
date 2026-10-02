/**
 * Editable content for the Our Projects page (/portfolio — the URL stays the same, the name shown is `name`). Plain JSON in the same shape an admin panel /
 * CMS API should return — components never hold copy of their own (see lib/portfolioApi.ts).
 * Headings are split into a soft (muted) lead-in and a strong part: { soft, strong }.
 * The projects themselves live in lib/portfolioItems.ts.
 *
 * Project pages (/portfolio/{id}) use `projectDetailContent` (shared section copy) and `categoryDefaults`
 * (what a project of that category delivers + its FAQs, used when the project has none of its own).
 * Tokens: "{project}" → the project title, "{client}" → the client (or the title), "{category}" → the
 * category in lower case ("website design"), "{Category}" → as written.
 */

import type { CounterItem, FaqEntry, FaqHelp, Heading, LinkItem, QuoteCtaContent, SectionIntro, SeoMeta, StatItem } from "@/lib/servicesContent";

export interface PortfolioPageContent {
  /** What the section is called across the site (menu, breadcrumbs, footer) */
  name: string;
  seo: SeoMeta;
  hero: {
    label: string;
    title: Heading;
    desc: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    stats: StatItem[];
    /** Floating chip on the project wall */
    chip: string;
  };
  list: SectionIntro & {
    /** Cards per page */
    perPage: number;
    allLabel: string;
    searchPlaceholder: string;
    /** Under the grid when a search or filter finds nothing */
    emptyTitle: string;
    emptyText: string;
    clearLabel: string;
    /** "of 214 projects" */
    countLabel: string;
    /** Card link to the project page */
    visitLabel: string;
    /**
     * The "Go to …" button per category (cards, project hero and overview). A category that isn't listed
     * gets no button (graphic design, logos, SEO, ads). icon: "web" → globe, "app" → phone.
     */
    liveLinks: Record<string, LiveLink>;
    /** Above the quick technology filters */
    techLabel: string;
    /** How many popular technologies to offer as quick filters */
    techCount: number;
    /** Screenshot hint pill */
    scrollHint: string;
    /** Text in the cursor ring that follows the mouse over a card */
    cursorText: string;
  };
  faq: SectionIntro & { items: FaqEntry[]; help: FaqHelp };
}

/** A "Go to website" / "Go to mobile app" button */
export interface LiveLink {
  label: string;
  icon: "web" | "app";
}

/** Copy shared by every project page */
export interface ProjectDetailContent {
  hero: {
    soft: string;
    primaryCta: LinkItem;
    /** Shown instead of the "Go to …" link when the project's category has none */
    secondaryCta: LinkItem;
    liveChip: string;
    /** Label on the technology card in the hero art */
    stackLabel: string;
  };
  overview: {
    label: string;
    clientLabel: string;
    yearLabel: string;
    durationLabel: string;
    categoryLabel: string;
    techLabel: string;
    servicesLabel: string;
    cta: LinkItem;
    scrollHint: string;
    touchHint: string;
  };
  /** Same shape as the service pages' "What's included" section */
  features: SectionIntro & {
    itemLabel: string;
    countLabel: string;
    quote: string;
    ctaNote: string;
    cta: LinkItem;
    badgeText: string;
  };
  related: SectionIntro & { quote: string; stats: CounterItem[]; cta: LinkItem };
  cta: QuoteCtaContent;
  faq: SectionIntro & { help: FaqHelp };
}

export interface CategoryDefaults {
  features: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export const portfolioPageContent: PortfolioPageContent = {
  name: "Our Projects",
  seo: {
    title: "Our Projects — Websites, Apps, Branding & Marketing Work",
    description:
      "Explore Entec Media's projects: websites, web applications, mobile apps, logos, graphic design, SEO and digital marketing campaigns for businesses across India and abroad.",
  },
  hero: {
    label: "OUR PROJECTS",
    title: { soft: "Work we're", strong: "proud to share" },
    desc: "Websites, mobile apps, brand identities, SEO and ad campaigns — real projects for real businesses, designed, built and grown by one team in Zirakpur, Punjab.",
    primaryCta: { label: "Start your project", href: "/contact" },
    secondaryCta: { label: "Browse projects", href: "#projects" },
    stats: [
      { value: "250+", label: "Projects delivered" },
      { value: "88+", label: "Happy brands" },
      { value: "4.9/5", label: "Client rating" },
    ],
    chip: "Live websites · Apps · Brands",
  },
  list: {
    label: "+ ALL PROJECTS",
    title: { soft: "Every project,", strong: "built to perform" },
    desc: "Filter by service, search by name or pick a technology. Open any project to see what we built and how.",
    perPage: 12,
    allLabel: "All",
    searchPlaceholder: "Search by project, client or technology",
    emptyTitle: "No projects found",
    emptyText: "Try another word or category — or ask us about work in your industry.",
    clearLabel: "Clear filters",
    countLabel: "projects",
    visitLabel: "View project",
    liveLinks: {
      "Website Design": { label: "Go to website", icon: "web" },
      "Website Development": { label: "Go to website", icon: "web" },
      "Mobile Apps": { label: "Go to mobile app", icon: "app" },
    },
    techLabel: "Popular technology",
    techCount: 8,
    scrollHint: "Hover to scroll",
    cursorText: "VIEW PROJECT • VIEW PROJECT •",
  },
  faq: {
    label: "FAQ",
    title: { soft: "Project", strong: "questions answered" },
    desc: "What clients usually ask after browsing our work. Can't find yours? Ask us directly.",
    help: {
      title: "Still have a question?",
      text: "Talk to a real person — we usually reply within 24 hours.",
      callLabel: "Call us",
      whatsappLabel: "WhatsApp",
      contactLabel: "Contact us",
      askLabel: "Still unsure? Talk to us",
    },
    items: [
      { tag: "Industries", question: "Have you worked with businesses like mine?", answer: "Very likely. We've delivered projects for clinics, schools, real estate, restaurants, retail, e-commerce, SaaS and service businesses. Ask us and we'll share the most relevant examples." },
      { tag: "Projects", question: "Can you build something similar to a project here?", answer: "Yes — share the project you like and we'll plan something with the same quality, designed around your own brand, content and goals. We never copy one client's work for another." },
      { tag: "Pricing", question: "How much does a project like these cost?", answer: "It depends on the scope. After a free discovery call you get a fixed quote with no hidden charges. Business websites typically start from ₹25,000; apps, branding and marketing are quoted on their scope." },
      { tag: "Timeline", question: "How long do these projects take?", answer: "A business website usually takes 3–6 weeks, a mobile app 8–16 weeks and a logo 1–2 weeks. Marketing campaigns can go live within a week. You get a clear timeline in your proposal." },
      { tag: "Results", question: "Can I speak to a past client?", answer: "Yes. For serious enquiries we can connect you with clients in a similar industry who are happy to share their experience of working with us." },
      { tag: "Privacy", question: "Will my project be shown in your portfolio?", answer: "Only with your permission. Many clients are happy to be featured; if your project is confidential we can sign an NDA and keep it private." },
    ],
  },
};

export const projectDetailContent: ProjectDetailContent = {
  hero: {
    soft: "case study",
    primaryCta: { label: "Get a free quote", href: "#quote" },
    secondaryCta: { label: "See the project", href: "#overview" },
    liveChip: "Live project",
    stackLabel: "Built with",
  },
  overview: {
    label: "THE PROJECT",
    clientLabel: "Client",
    yearLabel: "Year",
    durationLabel: "Timeline",
    categoryLabel: "Service",
    techLabel: "Technology",
    servicesLabel: "What we did",
    cta: { label: "Get a quote", href: "#quote" },
    scrollHint: "Hover to scroll",
    touchHint: "Live preview",
  },
  features: {
    label: "WHAT WE DELIVERED",
    title: { soft: "Everything that went into", strong: "{project}" },
    desc: "The work behind the result — what we planned, designed, built and set up for {client}.",
    itemLabel: "Delivered",
    countLabel: "key deliverables",
    quote: "One team planned, designed and delivered this {Category} project — **clear scope, honest timelines** and support that **continues after launch**.",
    ctaNote: "Want something like this for your business?",
    cta: { label: "Get a free quote", href: "#quote" },
    badgeText: "GET A QUOTE • GET A QUOTE •",
  },
  related: {
    label: "+ RELATED PROJECTS",
    title: { soft: "More {Category}", strong: "projects we're proud of" },
    desc: "Similar work for other businesses — open any of them to see what we built and why it works.",
    quote: "More **{Category} projects** we've delivered to help businesses stand out and grow online.",
    stats: [
      { value: 136, label: "Websites" },
      { value: 24, label: "Apps" },
      { value: 88, label: "Brands" },
      { value: 10, suffix: "+", label: "Services" },
    ],
    cta: { label: "View all projects", href: "/portfolio" },
  },
  cta: {
    label: "GET A QUOTE",
    title: { soft: "Want a project", strong: "like this one?" },
    desc: "Tell us about your idea — we'll reply within 24 hours with suggestions, a clear timeline and a fixed quote for your {Category} project. No obligation, no hidden charges.",
    button: { label: "Get a quote", href: "/contact" },
    callLabel: "Or call us",
    cardTitle: "Your {Category} quote",
    cardTag: "Free · No obligation",
    points: [
      "{Category} planned around your goals",
      "Free discovery call with our team",
      "Clear timeline and a fixed price",
      "Reply within 24 hours",
    ],
    readyLabel: "Ready to start",
    badgeText: "GET A QUOTE • GET A QUOTE •",
  },
  faq: {
    label: "FAQ",
    title: { soft: "Project", strong: "questions answered" },
    desc: "What clients usually ask about {Category} projects like {project}.",
    help: {
      title: "Still have a question?",
      text: "Talk to a real person — we usually reply within 24 hours.",
      callLabel: "Call us",
      whatsappLabel: "WhatsApp",
      contactLabel: "Contact us",
      askLabel: "Still unsure? Talk to us",
    },
  },
};

/** What a project of each category delivers, and its FAQs — used when a project has none of its own. */
export const categoryDefaults: Record<string, CategoryDefaults> = {
  "Website Design": {
    features: [
      { title: "Discovery & Sitemap", desc: "We studied {client}'s audience and competitors, then planned every page around what visitors need to find." },
      { title: "Wireframes & Flow", desc: "Clear layouts that guide visitors from the first screen to a call, enquiry or purchase." },
      { title: "Brand-Aligned Visual Design", desc: "Colours, type, imagery and icons that make {client} look premium and trustworthy." },
      { title: "Responsive Layouts", desc: "Every page designed for desktop, tablet and mobile — tested on real devices." },
      { title: "Conversion-Focused Pages", desc: "Strong calls-to-action, trust signals and enquiry forms placed where they work best." },
      { title: "Developer-Ready Handoff", desc: "Organised Figma files, assets and specs so the build matched the design exactly." },
    ],
    faqs: [
      { question: "How long did {project} take to design?", answer: "Design projects like this usually take 2–4 weeks, including research, wireframes, visual design and two rounds of revisions." },
      { question: "Can you design a website like this for my business?", answer: "Yes. We'll plan and design a website around your own brand, audience and goals — similar quality, never a copy of another client's work." },
      { question: "Will my website work well on mobile?", answer: "Yes. Every design is created mobile-first and checked on phones, tablets and desktops before handoff." },
      { question: "How much does a website design like this cost?", answer: "It depends on the number of pages and custom sections. After a free call you get a fixed quote — business website designs typically start from ₹25,000." },
    ],
  },
  "Website Development": {
    features: [
      { title: "Planning & Architecture", desc: "We chose the right platform and structure for {client}'s goals, content and future growth." },
      { title: "Fast, Clean Build", desc: "Carefully coded pages optimised for speed, accessibility and Core Web Vitals." },
      { title: "CMS & Admin Panel", desc: "An easy admin so the team can update pages, products and blog posts without a developer." },
      { title: "Integrations", desc: "Payment gateways, CRMs, WhatsApp, analytics and email — connected and tested." },
      { title: "SEO-Ready Setup", desc: "Clean URLs, meta tags, schema markup and sitemaps from day one." },
      { title: "Launch & Support", desc: "Hosting, SSL, backups and monitoring set up, with support after go-live." },
    ],
    faqs: [
      { question: "Which technology was used for {project}?", answer: "We picked the stack shown on this page for its speed, security and ease of updates. For your project we recommend the right platform after understanding your needs." },
      { question: "Can I update the website myself?", answer: "Yes. We set up a CMS and walk your team through it, so you can edit pages, images and posts on your own." },
      { question: "How long does a website like this take to build?", answer: "A business website usually takes 3–6 weeks; e-commerce stores and web applications take longer. You get a clear timeline in your proposal." },
      { question: "Do you provide hosting and maintenance?", answer: "Yes. We can set up hosting, domain and SSL and offer monthly plans for updates, backups and security." },
    ],
  },
  "Mobile Apps": {
    features: [
      { title: "Product Planning", desc: "We mapped {client}'s users, features and launch scope into a clear roadmap." },
      { title: "App UI/UX Design", desc: "Intuitive screens and flows designed for both Android and iOS guidelines." },
      { title: "Cross-Platform Build", desc: "One codebase for Android and iOS — faster delivery and easier updates." },
      { title: "Backend & Admin Panel", desc: "Secure APIs, user accounts and an admin panel to manage content and orders." },
      { title: "Payments & Notifications", desc: "In-app payments, subscriptions and push notifications that bring users back." },
      { title: "Store Launch", desc: "Play Store and App Store submission handled end to end, plus support after launch." },
    ],
    faqs: [
      { question: "Does {project} work on both Android and iOS?", answer: "Yes. We build cross-platform apps so one codebase runs on both Android and iOS with a native feel." },
      { question: "How long does an app like this take?", answer: "A focused app usually takes 8–16 weeks depending on features, integrations and the admin panel." },
      { question: "Will I own the source code?", answer: "Yes. After final payment you receive full ownership of the source code and app store accounts." },
      { question: "Do you help publish the app?", answer: "Yes. We handle the complete Play Store and App Store submission and review process." },
    ],
  },
  "Graphic Design": {
    features: [
      { title: "Creative Brief", desc: "We understood {client}'s brand, audience and campaign goal before a single sketch." },
      { title: "Visual Direction", desc: "Mood boards and a clear style so every piece looks like it belongs to one brand." },
      { title: "Print & Packaging", desc: "Brochures, menus, labels and signage delivered print-ready." },
      { title: "Social Media Creatives", desc: "Posts, stories, reel covers and ad creatives sized for every platform." },
      { title: "Revisions & Refinement", desc: "Agreed revision rounds so the final designs are exactly right." },
      { title: "Source Files", desc: "Editable source files plus PNG, JPG, SVG and PDF exports." },
    ],
    faqs: [
      { question: "Can you design creatives like {project} for my brand?", answer: "Yes. We'll create a visual direction around your own brand and audience, then design every piece to match it." },
      { question: "Do you offer monthly design packages?", answer: "Yes. Monthly packages include a fixed number of posts, stories and ad creatives." },
      { question: "Will I get the source files?", answer: "Yes. You receive editable source files along with PNG, JPG, SVG and PDF exports." },
      { question: "How many revisions are included?", answer: "Every package includes agreed revision rounds, so you get final designs you're happy with." },
    ],
  },
  "Logo Design": {
    features: [
      { title: "Brand Discovery", desc: "We learned what {client} stands for, who it serves and how it should feel." },
      { title: "Concept Sketches", desc: "Two to three distinct logo directions explored before choosing one." },
      { title: "Logo Refinement", desc: "The chosen mark perfected for balance, readability and small sizes." },
      { title: "Colour & Typography", desc: "A brand palette and fonts that work across screens and print." },
      { title: "Logo Variations", desc: "Horizontal, stacked, icon-only and one-colour versions for every use." },
      { title: "Brand Guidelines", desc: "A simple guide so the logo is always used correctly." },
    ],
    faqs: [
      { question: "How long did the {project} logo take?", answer: "A logo usually takes 1–2 weeks including concepts and revisions; a full identity with guidelines takes 3–4 weeks." },
      { question: "How many logo concepts do you provide?", answer: "We usually present 2–3 concepts and refine the selected one with revisions." },
      { question: "Will I get the source files?", answer: "Yes — AI, EPS, SVG, PNG and PDF files, plus versions for light and dark backgrounds." },
      { question: "Can you design a logo for my business?", answer: "Yes. We start with a short discovery call so the logo truly represents your brand." },
    ],
  },
  SEO: {
    features: [
      { title: "SEO Audit", desc: "A full technical and content audit of {client}'s website to find what held rankings back." },
      { title: "Keyword Research", desc: "The searches real customers use, prioritised by intent and difficulty." },
      { title: "On-Page Optimisation", desc: "Titles, headings, content, internal links and schema improved page by page." },
      { title: "Technical Fixes", desc: "Speed, indexing, broken links and mobile issues resolved." },
      { title: "Local SEO", desc: "Google Business Profile, citations and reviews for strong map rankings." },
      { title: "Monthly Reporting", desc: "Clear reports on rankings, traffic and enquiries — and what we're doing next." },
    ],
    faqs: [
      { question: "How long did it take to see results for {project}?", answer: "Most websites see clear improvement in 3–6 months, depending on competition and the site's starting point." },
      { question: "Do you guarantee #1 rankings?", answer: "No honest agency can. We guarantee transparent work, best practices and steady, measurable improvement." },
      { question: "Do you do local SEO?", answer: "Yes. We optimise your Google Business Profile and local listings so you appear in map results near you." },
      { question: "Will I get reports?", answer: "Yes. You receive a monthly report on rankings, traffic and enquiries, and can ask for a review call anytime." },
    ],
  },
  "Digital Marketing": {
    features: [
      { title: "Audit & Strategy", desc: "We reviewed {client}'s channels and competitors, then built a plan around clear goals." },
      { title: "Audience Targeting", desc: "The right people by location, interests and intent — no wasted spend." },
      { title: "Ad Creatives & Copy", desc: "Images, carousels, reels and ad copy designed to stop the scroll." },
      { title: "Campaign Setup", desc: "Google and Meta campaigns structured for leads or sales, with conversion tracking." },
      { title: "Optimisation", desc: "Weekly tuning of bids, audiences and creatives to lower the cost per lead." },
      { title: "Transparent Reporting", desc: "Monthly reports on spend, leads and cost per lead — every rupee accounted for." },
    ],
    faqs: [
      { question: "What budget does a campaign like {project} need?", answer: "Budgets depend on industry, location and goals. We recommend an amount after research, so you get meaningful results." },
      { question: "Is the ad budget included in your fee?", answer: "No. Ad spend is paid directly to Google or Meta; our management fee is separate and agreed upfront." },
      { question: "How soon will I see leads?", answer: "Paid campaigns usually bring enquiries within the first few days; results improve as we optimise." },
      { question: "Do you create the creatives?", answer: "Yes. Our design team creates the images, carousels and short videos for your campaigns." },
    ],
  },
};

/** Used for a category with no defaults of its own */
export const fallbackCategoryDefaults: CategoryDefaults = categoryDefaults["Website Development"];
