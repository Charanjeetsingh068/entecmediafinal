/**
 * Open positions shown on /careers and /careers/[slug].
 * Add, edit or remove a job here — the listing, filters and detail pages update automatically.
 */

export type JobType = "Full-time" | "Part-time" | "Internship" | "Remote" | "Hybrid" | "On-site" | "Freelance";

export interface JobOpening {
  slug: string;
  title: string;
  department: "Design" | "Development" | "Digital Marketing" | "Operations";
  types: JobType[];
  location: string;
  experience: string;
  salary: { amount: string; period: string }[];
  summary: string;
  requirementsSummary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
}

export const jobTypeFilters: JobType[] = ["Full-time", "Internship", "Remote", "Hybrid", "On-site", "Freelance"];

export const jobOpenings: JobOpening[] = [
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    types: ["Full-time", "Hybrid"],
    location: "Zirakpur, Punjab",
    experience: "2+ years",
    salary: [{ amount: "₹3.6L – ₹6L", period: "per year" }],
    summary:
      "Design intuitive websites, mobile apps and dashboards — from user flows and wireframes to polished, developer-ready UI.",
    requirementsSummary:
      "2+ years designing for web and mobile, strong Figma skills, a portfolio of real projects and a user-first mindset.",
    responsibilities: [
      "Create user flows, wireframes and high-fidelity UI for websites and mobile apps",
      "Build and maintain design systems and reusable components in Figma",
      "Prepare interactive prototypes for client reviews",
      "Work closely with developers to ensure pixel-perfect implementation",
    ],
    requirements: [
      "2+ years of UI/UX design experience",
      "Expert in Figma; comfortable with Adobe Photoshop and Illustrator",
      "Solid understanding of responsive design, typography and layout",
      "A portfolio showing web and app projects",
    ],
    niceToHave: ["Basic HTML/CSS knowledge", "Experience with motion or micro-interactions"],
  },
  {
    slug: "frontend-developer",
    title: "Frontend Developer (React / Next.js)",
    department: "Development",
    types: ["Full-time", "On-site"],
    location: "Zirakpur, Punjab",
    experience: "2–4 years",
    salary: [{ amount: "₹4.8L – ₹8.4L", period: "per year" }],
    summary:
      "Build fast, responsive and animated websites and web apps with React, Next.js and modern CSS from our design team's Figma files.",
    requirementsSummary:
      "2–4 years with React/Next.js and TypeScript, strong CSS and animation skills, and an eye for pixel-perfect detail.",
    responsibilities: [
      "Develop responsive websites and web applications in React and Next.js",
      "Convert Figma designs into pixel-perfect, accessible UI",
      "Implement scroll and interaction animations (GSAP / Framer Motion)",
      "Optimise performance, Core Web Vitals and technical SEO",
    ],
    requirements: [
      "2–4 years of frontend development experience",
      "Strong React, Next.js and TypeScript skills",
      "Excellent HTML, CSS and responsive layout fundamentals",
      "Experience consuming REST APIs",
    ],
    niceToHave: ["GSAP animation experience", "Basic PHP / WordPress knowledge"],
  },
  {
    slug: "flutter-developer",
    title: "Flutter App Developer",
    department: "Development",
    types: ["Full-time", "Hybrid"],
    location: "Zirakpur, Punjab",
    experience: "2+ years",
    salary: [{ amount: "₹4.2L – ₹7.8L", period: "per year" }],
    summary:
      "Build cross-platform Android and iOS apps with Flutter — from UI to API integration and store publishing.",
    requirementsSummary:
      "2+ years building Flutter apps, solid Dart and state-management skills, and at least one published app.",
    responsibilities: [
      "Develop and maintain Flutter apps for Android and iOS",
      "Integrate REST APIs, payment gateways, maps and push notifications",
      "Publish and update apps on Google Play and the App Store",
      "Write clean, testable and well-structured code",
    ],
    requirements: [
      "2+ years of Flutter / Dart development",
      "Experience with Provider, Riverpod or BLoC",
      "Understanding of app performance and responsive layouts",
      "At least one live app on the Play Store or App Store",
    ],
    niceToHave: ["Firebase experience", "Native Android or iOS knowledge"],
  },
  {
    slug: "wordpress-developer",
    title: "WordPress Developer",
    department: "Development",
    types: ["Full-time", "On-site"],
    location: "Zirakpur, Punjab",
    experience: "1–3 years",
    salary: [{ amount: "₹2.4L – ₹4.8L", period: "per year" }],
    summary:
      "Build and customise WordPress and WooCommerce websites for businesses — themes, plugins, speed and security.",
    requirementsSummary:
      "1–3 years with WordPress, PHP and WooCommerce, comfortable with Elementor and custom theme work.",
    responsibilities: [
      "Build responsive WordPress websites and WooCommerce stores",
      "Customise themes and plugins with PHP, HTML, CSS and JavaScript",
      "Improve site speed, security and on-page SEO",
      "Handle website maintenance, updates and migrations",
    ],
    requirements: [
      "1–3 years of WordPress development",
      "Good knowledge of PHP, MySQL, HTML and CSS",
      "Experience with WooCommerce and page builders",
      "Understanding of hosting, domains and SSL",
    ],
    niceToHave: ["Shopify experience", "Custom Gutenberg block development"],
  },
  {
    slug: "seo-executive",
    title: "SEO Executive",
    department: "Digital Marketing",
    types: ["Full-time", "Hybrid"],
    location: "Zirakpur, Punjab",
    experience: "1–3 years",
    salary: [{ amount: "₹2.4L – ₹4.2L", period: "per year" }],
    summary:
      "Plan and execute on-page, off-page, local and technical SEO that moves client websites up Google's rankings.",
    requirementsSummary:
      "1–3 years of hands-on SEO, confident with Search Console, GA4 and keyword research tools.",
    responsibilities: [
      "Run keyword research, on-page optimisation and technical audits",
      "Manage Google Business Profiles and local SEO",
      "Build quality backlinks and plan content with the writing team",
      "Prepare monthly ranking and traffic reports for clients",
    ],
    requirements: [
      "1–3 years of SEO experience with proven ranking results",
      "Hands-on with Google Search Console, GA4 and Ahrefs/SEMrush",
      "Understanding of technical SEO and Core Web Vitals",
      "Good written English",
    ],
    niceToHave: ["Basic HTML knowledge", "Experience with WordPress SEO plugins"],
  },
  {
    slug: "performance-marketing-executive",
    title: "Performance Marketing Executive",
    department: "Digital Marketing",
    types: ["Full-time", "On-site"],
    location: "Zirakpur, Punjab",
    experience: "1–3 years",
    salary: [{ amount: "₹3L – ₹5.4L", period: "per year" }],
    summary:
      "Plan, launch and optimise Google Ads and Meta Ads campaigns that bring qualified leads and sales for our clients.",
    requirementsSummary:
      "1–3 years running Google and Meta ad campaigns, comfortable with tracking, pixels and ROAS reporting.",
    responsibilities: [
      "Set up and optimise Google Search, Display, YouTube and Performance Max campaigns",
      "Run Meta (Facebook & Instagram) lead-generation and sales campaigns",
      "Manage conversion tracking, pixels and GA4 events",
      "Report on CPL, ROAS and recommend improvements",
    ],
    requirements: [
      "1–3 years of paid-ads experience",
      "Hands-on with Google Ads and Meta Ads Manager",
      "Strong analytical and reporting skills",
      "Understanding of landing-page conversion basics",
    ],
    niceToHave: ["Google Ads certification", "Experience with Meta Conversions API"],
  },
  {
    slug: "graphic-designer",
    title: "Graphic Designer",
    department: "Design",
    types: ["Full-time", "Freelance"],
    location: "Zirakpur, Punjab",
    experience: "1+ years",
    salary: [
      { amount: "₹2.4L – ₹4.2L", period: "per year (Full-time)" },
      { amount: "₹800 – ₹1,500", period: "per creative (Freelance)" },
    ],
    summary:
      "Create logos, brand identities, social media creatives and ad designs that look premium and stay on-brand.",
    requirementsSummary:
      "1+ years in graphic design, expert in Photoshop and Illustrator, with a strong social-media portfolio.",
    responsibilities: [
      "Design social media posts, carousels, stories and reel covers",
      "Create ad creatives for Google Display and Meta campaigns",
      "Design logos, brand kits, brochures and print collateral",
      "Keep every design consistent with each client's brand",
    ],
    requirements: [
      "1+ years of graphic design experience",
      "Expert in Adobe Photoshop and Illustrator",
      "Strong typography, colour and layout skills",
      "A portfolio of social and brand work",
    ],
    niceToHave: ["Basic video editing (Premiere Pro / CapCut)", "Canva experience"],
  },
  {
    slug: "digital-marketing-intern",
    title: "Digital Marketing Intern",
    department: "Digital Marketing",
    types: ["Internship", "On-site"],
    location: "Zirakpur, Punjab",
    experience: "Freshers welcome",
    salary: [{ amount: "₹8,000 – ₹12,000", period: "per month (stipend)" }],
    summary:
      "Learn SEO, social media and paid ads on real client projects, guided by our marketing team — with a chance of a full-time role.",
    requirementsSummary:
      "Freshers or final-year students with a strong interest in digital marketing and good communication skills.",
    responsibilities: [
      "Assist with keyword research, on-page SEO and content planning",
      "Schedule social media posts and track engagement",
      "Support ad campaign setup and reporting",
      "Research competitors and industry trends",
    ],
    requirements: [
      "Graduate or final-year student (any stream)",
      "Genuine interest in digital marketing",
      "Good written and spoken English",
      "Willingness to learn fast",
    ],
    niceToHave: ["Google Digital Garage or similar certification", "Personal social or blog projects"],
  },
];

export function getJobBySlug(slug: string): JobOpening | undefined {
  return jobOpenings.find((job) => job.slug === slug);
}
