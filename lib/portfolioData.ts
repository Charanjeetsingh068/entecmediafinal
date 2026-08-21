export interface PortfolioProjectDetail {
  slug: string;
  id: string;
  category: string;
  subCategories: string[];
  techStack: string[];
  title: string;
  client: string;
  year: string;
  duration: string;
  heroTagline: string;
  heroDesc: string;
  heroImage: string;
  metric: string;
  stats: { value: string; label: string }[];
  challengeTitle: string;
  challengeDesc: string[];
  solutionTitle: string;
  solutionDesc: string[];
  galleryImages: string[];
  results: { value: string; title: string; desc: string }[];
}

export const portfolioProjectsDictionary: Record<string, PortfolioProjectDetail> = {
  "nexatech-enterprise": {
    slug: "nexatech-enterprise",
    id: "project-1",
    category: "IT & Web Development",
    subCategories: ["Website Development", "UI/UX Development", "React.js / Next.js"],
    techStack: ["React.js", "Next.js 16", "TypeScript", "Tailwind CSS", "Vercel"],
    title: "NexaTech Enterprise SaaS Web Portal",
    client: "NexaTech Global",
    year: "2026",
    duration: "8 Weeks",
    heroTagline: "High-speed Next.js 16 web application built for enterprise SaaS solutions.",
    heroDesc: "We engineered a server-rendered, microservices-driven web portal for NexaTech Global. Featuring real-time data visualization, instant page transitions, and strict TypeScript architecture.",
    heroImage: "/images/aboutimg.png",
    metric: "+240% Organic Traffic",
    stats: [
      { value: "+240%", label: "Organic Traffic Lift" },
      { value: "99/100", label: "Lighthouse Speed" },
      { value: "3.2x", label: "Qualified Lead Volume" },
    ],
    challengeTitle: "The Challenge: Bloated Architecture & Slow Load Speeds",
    challengeDesc: [
      "NexaTech's legacy web platform suffered from slow server response times (>4 seconds), cluttered navigation, and low search engine visibility, resulting in a high bounce rate among enterprise prospects.",
      "They needed a modern, resilient Web 3.0-ready architecture using React.js and Next.js 16 that could load under 400ms globally while empowering their marketing team with headless CMS management.",
    ],
    solutionTitle: "Our Solution: Headless Next.js 16 & Microservice Architecture",
    solutionDesc: [
      "We rebuilt the web platform from the ground up using Next.js 16 and TypeScript. By deploying to Vercel's global edge network and connecting Sanity Headless CMS, we achieved instant page renders.",
      "A custom UI/UX design system was created in Figma, featuring interactive product demos, clean dark/light mode switches, and automated lead capture webhooks.",
    ],
    galleryImages: ["/images/aboutbac.png", "/images/entec-about.png", "/images/bannerbac.png"],
    results: [
      { value: "240%", title: "Organic SEO Growth", desc: "Achieved top 3 Google search rankings for competitive enterprise SaaS keywords." },
      { value: "0.3s", title: "Page Speed Load Time", desc: "Reduced initial server load time from 4.2s to sub-300ms across all global edge nodes." },
      { value: "48%", title: "Form Conversion Rate", desc: "Optimized landing page conversion rates resulting in record-breaking demo requests." },
    ],
  },

  "lumina-luxury": {
    slug: "lumina-luxury",
    id: "project-2",
    category: "UI/UX & Graphic Design",
    subCategories: ["Website Designing", "UI/UX Design", "Graphic Design"],
    techStack: ["Figma", "Graphic Design", "Brand Guidelines", "Design Systems"],
    title: "Lumina Luxury Visual Identity & UI System",
    client: "Lumina Studios",
    year: "2026",
    duration: "6 Weeks",
    heroTagline: "Bespoke brand identity, luxury typography, and interactive Figma design system.",
    heroDesc: "A complete visual brand identity transformation for Lumina Studios. We established cohesive design tokens, typography scales, editorial print packaging, and high-fidelity UI design.",
    heroImage: "/images/entec-about.png",
    metric: "3.5x Brand Perception",
    stats: [
      { value: "3.5x", label: "Brand Perception Uplift" },
      { value: "100%", label: "Custom UI Components" },
      { value: "+160%", label: "Social Media Engagement" },
    ],
    challengeTitle: "The Challenge: Inconsistent Brand Image Across Channels",
    challengeDesc: [
      "Lumina Studios lacked a unified visual identity. Different marketing materials used conflicting color schemes, logos, and fonts, diminishing their premium market positioning.",
      "They required a single, elegant design language that communicated luxury and distinction across both physical packaging and digital screen interfaces.",
    ],
    solutionTitle: "Our Solution: Atomic Design System & Editorial Brand Guide",
    solutionDesc: [
      "We developed an atomic Figma design system with strict color tokens, bespoke serif typography, and dark/light UI variants.",
      "The visual identity was expanded into luxury print packaging, digital marketing assets, and dynamic web prototypes.",
    ],
    galleryImages: ["/images/aboutimg.png", "/images/aboutbac.png", "/images/about.png"],
    results: [
      { value: "3.5x", title: "Brand Equity Index", desc: "Elevated market positioning to attract high-net-worth client accounts." },
      { value: "100%", title: "Design Consistency", desc: "Eliminated visual discrepancy across marketing, social media, and web assets." },
      { value: "60%", title: "Faster Design Handoff", desc: "Accelerated production speed for new campaign assets using Figma master components." },
    ],
  },

  "apex-ecommerce": {
    slug: "apex-ecommerce",
    id: "project-3",
    category: "IT & Web Development",
    subCategories: ["Website Development", "Website Designing", "WordPress"],
    techStack: ["WordPress", "WooCommerce", "PHP", "Custom CSS", "MySQL"],
    title: "Apex E-Commerce WordPress & WooCommerce Store",
    client: "Apex Retail Group",
    year: "2026",
    duration: "7 Weeks",
    heroTagline: "Custom WooCommerce storefront engineered for seamless checkout and revenue growth.",
    heroDesc: "We designed and developed a bespoke WordPress e-commerce experience for Apex Retail Group. Featuring custom checkout drawers, high-speed product filters, and payment gateway integrations.",
    heroImage: "/images/bannerbac.png",
    metric: "+185% Sales Revenue",
    stats: [
      { value: "+185%", label: "Sales Revenue Lift" },
      { value: "1.2s", label: "Average Page Load" },
      { value: "+52%", label: "Checkout Conversion" },
    ],
    challengeTitle: "The Challenge: High Checkout Abandonment & Slow Database",
    challengeDesc: [
      "Apex's previous WooCommerce store suffered from sluggish database queries, a multi-step slow checkout, and poor mobile usability, resulting in a 74% cart abandonment rate.",
      "They needed a high-performance, mobile-optimized WordPress store capable of handling high-volume product catalogs and automated payment processing.",
    ],
    solutionTitle: "Our Solution: Custom WordPress Theme & Frictionless Cart Drawer",
    solutionDesc: [
      "We engineered a light-weight custom WordPress theme from scratch without bloated page builder plugins.",
      "Implemented a 1-step Ajax cart drawer, dynamic cross-sell recommendations, dynamic shipping progress bars, and localized Stripe payment gateways.",
    ],
    galleryImages: ["/images/aboutbac.png", "/images/aboutimg.png", "/images/team1.png"],
    results: [
      { value: "185%", title: "Revenue Increase", desc: "Achieved record monthly sales volume within 60 days of launch." },
      { value: "52%", title: "Higher Conversion Rate", desc: "Streamlined checkout drawer reduced cart abandonment by over 40%." },
      { value: "1.2s", title: "Mobile Store Speed", desc: "Optimized WooCommerce database queries for fast mobile browsing." },
    ],
  },

  "cybershield-seo": {
    slug: "cybershield-seo",
    id: "project-4",
    category: "Digital Marketing",
    subCategories: ["Website SEO"],
    techStack: ["Website SEO", "SEMrush", "Ahrefs", "Google Analytics 4", "Technical SEO"],
    title: "CyberShield Search Engine SEO Dominance",
    client: "CyberShield Security",
    year: "2026",
    duration: "Ongoing",
    heroTagline: "Organic SEO strategy & Core Web Vitals optimization achieving #1 Google rankings.",
    heroDesc: "A complete technical SEO and content strategy transformation for CyberShield Security. We optimized site architecture, resolved indexing errors, and acquired high-authority industry backlinks.",
    heroImage: "/images/about.png",
    metric: "#1 Rank for 40+ Keywords",
    stats: [
      { value: "#1 Rank", label: "Google Keyword Dominance" },
      { value: "+310%", label: "Inbound Organic Leads" },
      { value: "0", label: "Technical Indexing Errors" },
    ],
    challengeTitle: "The Challenge: Low Search Visibility & Duplicate Content",
    challengeDesc: [
      "CyberShield Security was invisible on Google page 1 for high-intent cybersecurity search terms. Technical site audits revealed crawlability blocks, slow Core Web Vitals, and keyword cannibalization.",
      "They needed a comprehensive organic SEO growth strategy to outperform established competitors without relying solely on expensive paid ads.",
    ],
    solutionTitle: "Our Solution: Technical SEO Repair & High-Authority Content Strategy",
    solutionDesc: [
      "We executed an in-depth technical audit, fixed canonical redirects, implemented JSON-LD structured schema markup, and optimized page speed metrics.",
      "Created a high-intent content hub with targeted articles, whitepapers, and authoritative digital PR backlinks.",
    ],
    galleryImages: ["/images/aboutimg.png", "/images/bannerbac.png", "/images/team2.png"],
    results: [
      { value: "#1 Rank", title: "Top Google Rankings", desc: "Secured top 3 search positions for over 40 high-value cybersecurity keywords." },
      { value: "310%", title: "Inbound Organic Leads", desc: "Generated a steady stream of qualified inbound sales leads month over month." },
      { value: "100%", title: "Core Web Vitals Pass", desc: "Achieved green passing scores across all Google PageSpeed Insights benchmarks." },
    ],
  },

  "velocity-ads": {
    slug: "velocity-ads",
    id: "project-5",
    category: "Digital Marketing",
    subCategories: ["Google Ads", "Meta Ads"],
    techStack: ["Google Ads", "Meta Ads", "Conversion API", "Looker Studio", "GA4"],
    title: "Velocity Scale Google & Meta Ads Campaign",
    client: "Velocity Brands",
    year: "2026",
    duration: "Ongoing",
    heroTagline: "Data-backed Google & Meta PPC advertising scaling customer acquisition profitability.",
    heroDesc: "Multi-channel paid acquisition engine combining targeted Google Search campaigns and Meta Ads (Facebook & Instagram) with server-side conversion tracking.",
    heroImage: "/images/team1.png",
    metric: "4.2x Average ROAS",
    stats: [
      { value: "4.2x", label: "Average Campaign ROAS" },
      { value: "-35%", label: "Customer Acquisition Cost" },
      { value: "$1.4M+", label: "Attributed Ad Revenue" },
    ],
    challengeTitle: "The Challenge: Rising CAC & Poor Ad Attribution",
    challengeDesc: [
      "Velocity Brands faced rising Customer Acquisition Costs (CAC) due to outdated Meta ad targeting and unoptimized Google Search keyword matching.",
      "iOS privacy changes caused loss of ad tracking accuracy, making it difficult to measure real Return on Ad Spend (ROAS).",
    ],
    solutionTitle: "Our Solution: Server-Side Conversion API & Creative A/B Testing",
    solutionDesc: [
      "We implemented Meta Conversions API (CAPI) and Google Server-Side Tagging to capture 100% of purchase data.",
      "Launched dedicated high-converting landing pages and deployed dynamic video creative A/B testing across Meta Reels and Google Search.",
    ],
    galleryImages: ["/images/aboutbac.png", "/images/about.png", "/images/team3.png"],
    results: [
      { value: "4.2x", title: "Proven ROAS", desc: "Scaled monthly ad spend profitably while maintaining a 4.2x return on ad spend." },
      { value: "-35%", title: "Lower Acquisition Cost", desc: "Decreased cost-per-acquisition (CPA) by testing high-converting ad hooks." },
      { value: "100%", title: "Attribution Accuracy", desc: "Restored full purchase tracking visibility using server-side analytics." },
    ],
  },

  "hyperion-cloud": {
    slug: "hyperion-cloud",
    id: "project-6",
    category: "IT & Web Development",
    subCategories: ["UI/UX Development", "Website Development", "React.js / Next.js"],
    techStack: ["React.js", "UI/UX Development", "Node.js", "REST APIs", "Tailwind"],
    title: "Hyperion Cloud Application & Interactive UI",
    client: "Hyperion Systems",
    year: "2026",
    duration: "10 Weeks",
    heroTagline: "Full-stack React.js web portal with real-time data widgets and responsive UI.",
    heroDesc: "A state-of-the-art cloud management application built with React.js and Node.js APIs. Features intuitive interactive data widgets, custom dark theme UI, and fast API response.",
    heroImage: "/images/team2.png",
    metric: "99/100 Speed Score",
    stats: [
      { value: "99/100", label: "Performance Score" },
      { value: "<200ms", label: "API Response Time" },
      { value: "100%", label: "Responsive Layout" },
    ],
    challengeTitle: "The Challenge: Complex Cloud Data & Confusing User Interface",
    challengeDesc: [
      "Hyperion Systems needed to transform a complex cloud monitoring backend into a clean, intuitive web application for DevOps engineers.",
      "The UI required real-time status updates, customizable widget dashboards, and seamless responsiveness across desktop and mobile screens.",
    ],
    solutionTitle: "Our Solution: Modular React.js Components & Tailwind UI Design",
    solutionDesc: [
      "We designed and developed a modular React.js frontend connected to Node.js REST APIs.",
      "Incorporated real-time chart widgets, smooth micro-interactions, dark/light theme switching, and accessible keyboard navigation.",
    ],
    galleryImages: ["/images/aboutimg.png", "/images/entec-about.png", "/images/bannerbac.png"],
    results: [
      { value: "99/100", title: "Performance Benchmark", desc: "Delivered ultra-smooth 60fps UI renders even under heavy data polling." },
      { value: "70%", title: "Faster User Onboarding", desc: "Intuitive UI reduced user onboarding time from hours to minutes." },
      { value: "100%", title: "Codebase Modularity", desc: "Clean component structure allowing Hyperion developers to build new features easily." },
    ],
  },
};

export const portfolioSlugAliases: Record<string, string> = {
  "project-1": "nexatech-enterprise",
  "project-2": "lumina-luxury",
  "project-3": "apex-ecommerce",
  "project-4": "cybershield-seo",
  "project-5": "velocity-ads",
  "project-6": "hyperion-cloud",
};

export function getPortfolioProjectDetail(slug: string): PortfolioProjectDetail {
  const normalizedSlug = portfolioSlugAliases[slug] || slug;
  return portfolioProjectsDictionary[normalizedSlug] || portfolioProjectsDictionary["nexatech-enterprise"];
}
