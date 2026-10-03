/**
 * Editable content for the Blog page (/blog) and the shared sections of every article page (/blog/{slug}).
 * Plain JSON in the same shape an admin panel / CMS API should return — components never hold copy of
 * their own (see lib/blogApi.ts). The articles themselves come from the Blog CMS (blog-cms/) with
 * data/blogs.ts as the local fallback.
 * Headings are split into a soft (muted) lead-in and a strong part: { soft, strong }.
 * Tokens in the article copy: "{category}" → the article's category ("SEO"), "{title}" → its title.
 */

import type { FaqEntry, FaqHelp, Heading, LinkItem, SectionIntro, SeoMeta, StatItem } from "@/lib/servicesContent";

export interface BlogPageContent {
  /** What the section is called across the site (menu, breadcrumbs) */
  name: string;
  seo: SeoMeta;
  hero: {
    label: string;
    title: Heading;
    desc: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    stats: StatItem[];
    /** Floating chip on the reading desk */
    chip: string;
    /** Accessible name of the thumbnail rail on the hero art */
    listLabel: string;
    /** How many of the newest articles rotate on the hero art */
    count: number;
    /** Milliseconds each article stays in front */
    interval: number;
  };
  list: SectionIntro & {
    /** Cards per page */
    perPage: number;
    allLabel: string;
    /** "of 09 articles" */
    countLabel: string;
    readLabel: string;
    /** "5 min read" */
    minRead: string;
    /** Shown above the grid when the visitor arrives from a tag or search link */
    tagLabel: string;
    searchLabel: string;
    clearLabel: string;
    emptyTitle: string;
    emptyText: string;
  };
  faq: SectionIntro & { items: FaqEntry[]; help: FaqHelp };
}

/** Copy shared by every article page */
export interface BlogDetailContent {
  hero: {
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    publishedLabel: string;
    readLabel: string;
    minRead: string;
    /** Text that circles the badge on the hero art */
    badgeText: string;
  };
  intro: {
    label: string;
    publishedLabel: string;
    updatedLabel: string;
    readLabel: string;
    categoryLabel: string;
    shareLabel: string;
  };
  sidebar: {
    searchLabel: string;
    searchPlaceholder: string;
    categoriesLabel: string;
    recentLabel: string;
    tagsLabel: string;
    ctaLabel: string;
    ctaTitle: string;
    ctaText: string;
    cta: LinkItem;
  };
  body: {
    tagsLabel: string;
    prevLabel: string;
    nextLabel: string;
    backLabel: string;
  };
  /** "Recent posts" — the home page Insights panels under the article */
  recent: SectionIntro & { title: Heading; cta: LinkItem };
}

export const blogPageContent: BlogPageContent = {
  name: "Blog",
  seo: {
    title: "Blog & Insights — Websites, Apps, SEO and Digital Marketing",
    description:
      "Practical guides on website design, development, mobile apps, UI/UX, branding, SEO, Google Ads and Meta Ads from the Entec Media team in Zirakpur, Punjab.",
  },
  hero: {
    label: "OUR BLOG",
    title: { soft: "Ideas that", strong: "move brands" },
    desc: "Practical guides on websites, apps, design, SEO and ads — written by the people who build and grow them every day, so you can make smarter decisions for your business.",
    primaryCta: { label: "Talk to an expert", href: "/contact" },
    secondaryCta: { label: "Browse articles", href: "#blogs" },
    stats: [
      { value: "Weekly", label: "New articles" },
      { value: "5 min", label: "Average read" },
      { value: "100%", label: "Practical tips" },
    ],
    chip: "Fresh insights · every week",
    listLabel: "Latest reads",
    count: 4,
    interval: 4200,
  },
  list: {
    label: "+ OUR BLOGS",
    title: { soft: "Guides, tips &", strong: "fresh perspectives" },
    desc: "Pick a topic or browse everything. Every article is written to help you plan, build and grow your business online.",
    perPage: 6,
    allLabel: "All",
    countLabel: "articles",
    readLabel: "Read article",
    minRead: "min read",
    tagLabel: "Tagged",
    searchLabel: "Results for",
    clearLabel: "Clear",
    emptyTitle: "No articles found",
    emptyText: "Try another topic — or ask us directly, we're happy to help.",
  },
  faq: {
    label: "FAQ",
    title: { soft: "Blog", strong: "questions answered" },
    desc: "What readers usually ask us about our articles. Didn't find yours? Ask us directly.",
    help: {
      title: "Have a question about your project?",
      text: "Talk to a real person — we usually reply within 24 hours.",
      callLabel: "Call us",
      whatsappLabel: "WhatsApp",
      contactLabel: "Contact us",
      askLabel: "Still unsure? Talk to us",
    },
    items: [
      { tag: "Topics", question: "What topics does the Entec Media blog cover?", answer: "Website design and development, mobile apps, UI/UX, branding and graphic design, SEO, Google Ads and Meta Ads — the same services we deliver for our clients every day." },
      { tag: "Authors", question: "Who writes these articles?", answer: "Our own designers, developers and marketers. Every guide is based on real projects and campaigns, not theory, so the advice is practical and up to date." },
      { tag: "Updates", question: "How often do you publish new articles?", answer: "We add new articles regularly and update older ones when tools, Google guidelines or best practices change, so the advice stays current." },
      { tag: "Help", question: "Can you help me apply what I read?", answer: "Yes. If an article matches what your business needs, contact us for a free consultation — we'll look at your website, app or campaigns and suggest clear next steps." },
      { tag: "Requests", question: "Can I suggest a topic?", answer: "Of course. Send us your question by email or WhatsApp — if it helps other business owners too, we'll turn it into an article." },
      { tag: "Sharing", question: "Can I share or quote your articles?", answer: "You're welcome to share links to our articles anywhere. If you quote a section, please credit Entec Media and link back to the original article." },
    ],
  },
};

export const blogDetailContent: BlogDetailContent = {
  hero: {
    primaryCta: { label: "Read the article", href: "#article" },
    secondaryCta: { label: "Get a free quote", href: "/contact" },
    publishedLabel: "Published",
    readLabel: "Reading time",
    minRead: "min read",
    badgeText: "ENTEC INSIGHTS • ENTEC INSIGHTS • ",
  },
  intro: {
    label: "THE ARTICLE",
    publishedLabel: "Published",
    updatedLabel: "Updated",
    readLabel: "Reading time",
    categoryLabel: "Category",
    shareLabel: "Share",
  },
  sidebar: {
    searchLabel: "Search the blog",
    searchPlaceholder: "Search articles…",
    categoriesLabel: "Categories",
    recentLabel: "Recent posts",
    tagsLabel: "Tags",
    ctaLabel: "NEED HELP?",
    ctaTitle: "Let's put this into practice",
    ctaText: "Get a free consultation for your {category} project — we reply within 24 hours.",
    cta: { label: "Get a free quote", href: "/contact" },
  },
  body: {
    tagsLabel: "Tagged",
    prevLabel: "Previous article",
    nextLabel: "Next article",
    backLabel: "All articles",
  },
  recent: {
    label: "+ RECENT POSTS",
    title: { soft: "Keep", strong: "reading" },
    desc: "More practical guides from the Entec Media team — pick the next one that fits your business.",
    cta: { label: "View all articles", href: "/blog" },
  },
};
