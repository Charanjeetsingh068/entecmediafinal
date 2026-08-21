export interface ServiceDetail {
  slug: string;
  num: string;
  category: string;
  title: string;
  heroTagline: string;
  heroDesc: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  overviewTitle: string;
  overviewDesc: string[];
  process: { step: string; title: string; desc: string }[];
  deliverables: { title: string; desc: string }[];
  tools: string[];
  faqs: { question: string; answer: string }[];
}

export const servicesDictionary: Record<string, ServiceDetail> = {
  "branding": {
    slug: "branding",
    num: "01",
    category: "Branding & Design",
    title: "Brand Identity & Strategy",
    heroTagline: "Crafting iconic visual languages that command authority and inspire trust.",
    heroDesc: "We build enduring brand identities from the ground up. By fusing deep market research with high-end visual design, we ensure your brand leaves an indelible mark in crowded digital marketplaces.",
    heroImage: "/images/aboutimg.png",
    stats: [
      { value: "+180%", label: "Brand Recognition" },
      { value: "3.2x", label: "Audience Trust Rate" },
      { value: "100%", label: "Bespoke Guidelines" },
    ],
    overviewTitle: "Why Brand Identity Matters in 2026",
    overviewDesc: [
      "In an era oversaturated with generic templates, distinctiveness is your single greatest competitive edge. A compelling brand identity goes far beyond a logo—it communicates your values, positioning, and standards before a single word is read.",
      "At Entec Media, we craft unified brand ecosystems—including bespoke typography, color palettes, motion principles, and design systems—engineered to scale effortlessly across web, mobile, social, and print.",
    ],
    process: [
      { step: "01", title: "Discovery & Market Research", desc: "We analyze competitor landscapes, target audience psychographics, and your core mission to establish a sharp strategic positioning." },
      { step: "02", title: "Concept & Visual Direction", desc: "We explore multiple creative directions, logo marks, and visual moodboards to establish your unique aesthetic frequency." },
      { step: "03", title: "Design System Architecture", desc: "We expand the chosen direction into a complete visual system—typography rules, color tokens, layout grids, and icon sets." },
      { step: "04", title: "Brand Handoff & Guidelines", desc: "We deliver comprehensive interactive brand guidelines ensuring internal teams and external agency partners maintain 100% visual consistency." },
    ],
    deliverables: [
      { title: "Primary & Secondary Logo Marks", desc: "Scalable vector marks optimized for dark/light UIs, app icons, and physical print." },
      { title: "Typography Systems", desc: "Curated font pairings and hierarchy rules for digital platforms and editorial print." },
      { title: "Color Tokens & Palettes", desc: "Tailored color palettes compliant with WCAG accessibility standards." },
      { title: "Interactive Brand Style Guide", desc: "A living digital manual detailing usage rules, spacing, and brand do's and don'ts." },
      { title: "Social & Media Assets", desc: "Templates for Instagram, LinkedIn, YouTube banners, and digital ad formats." },
      { title: "Stationery & Packaging Assets", desc: "Bespoke business cards, pitch deck templates, and merchandise mockups." },
    ],
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "After Effects", "Rive", "FontLab"],
    faqs: [
      { question: "How long does a full brand identity project take?", answer: "A comprehensive brand identity engagement typically takes between 3 to 6 weeks depending on scope and deliverable complexity." },
      { question: "Do we get full copyright ownership of the brand assets?", answer: "Yes, upon project completion and final payment, 100% IP and copyright ownership of all vector files and guidelines belong to you." },
      { question: "Can you rebrand an existing established company?", answer: "Absolutely. We specialize in strategic rebrands that preserve brand equity while modernizing visual standards for future growth." },
    ],
  },

  "web-engineering": {
    slug: "web-engineering",
    num: "02",
    category: "Web Engineering",
    title: "Next.js & Web Application Engineering",
    heroTagline: "Engineering high-speed, SEO-dominant web platforms built for scale.",
    heroDesc: "We build enterprise-grade web applications using Next.js 16, React, and modern microservice APIs. Expect sub-second page loads, bulletproof security, and seamless CMS control.",
    heroImage: "/images/aboutbac.png",
    stats: [
      { value: "99/100", label: "Lighthouse Performance" },
      { value: "<300ms", label: "Average Server Response" },
      { value: "+210%", label: "Organic SEO Traffic" },
    ],
    overviewTitle: "The Engineering Standard of Modern Web",
    overviewDesc: [
      "Slow, bloated websites kill conversions and tank search rankings. We build digital platforms on modern server-rendered and statically generated architectures using Next.js and TypeScript.",
      "Every line of code is written with clean component modularity, strict type safety, automatic image optimization, and headless CMS integrations so your content team can publish with complete freedom.",
    ],
    process: [
      { step: "01", title: "Architecture & Data Modeling", desc: "We structure component trees, define API contracts, and design database schemas to ensure optimal data flow." },
      { step: "02", title: "Component Development", desc: "Building modular, reusable UI components adhering strictly to design tokens and accessibility guidelines." },
      { step: "03", title: "CMS & API Integration", desc: "Connecting headless CMS platforms (Sanity, Strapi, Contentful) and third-party SaaS APIs." },
      { step: "04", title: "Testing, CI/CD & Deployment", desc: "Automated end-to-end testing, performance audits, and instant deployment on global edge networks (Vercel, Cloudflare)." },
    ],
    deliverables: [
      { title: "Custom Next.js Application", desc: "Server-side rendered, statically generated web application with zero bloat." },
      { title: "Headless CMS Setup", desc: "Intuitive content editor interface customized specifically to your operational workflow." },
      { title: "Technical SEO Optimization", desc: "Structured JSON-LD schema, dynamic sitemaps, Open Graph social cards, and canonical routing." },
      { title: "Responsive Cross-Device Layouts", desc: "Flawless rendering on ultra-wide desktop monitors, tablets, and mobile screens." },
      { title: "API & Microservice Integration", desc: "RESTful and GraphQL API connections for CRM, analytics, authentication, and payments." },
      { title: "Performance & Security Audits", desc: "Core Web Vitals compliance, security headers, and rate-limiting protections." },
    ],
    tools: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Vercel", "GraphQL", "Sanity CMS", "Node.js"],
    faqs: [
      { question: "Why do you use Next.js instead of traditional WordPress?", answer: "Next.js delivers unmatched speed, top-tier security (no vulnerable plugins), instant edge deployment, and vastly superior SEO performance compared to traditional monolithic CMSs." },
      { question: "Will my team be able to update website content easily?", answer: "Yes! We connect an intuitive headless CMS (like Sanity or Strapi) that allows non-technical team members to edit text, images, and publish blog posts without touching code." },
      { question: "How do you ensure fast page load speeds?", answer: "We leverage server-side rendering, dynamic asset optimization, edge caching, and zero inline script bloat to guarantee 90+ Core Web Vitals scores." },
    ],
  },

  "uiux-design": {
    slug: "uiux-design",
    num: "03",
    category: "Branding & Design",
    title: "UI/UX Design & Prototyping",
    heroTagline: "Designing intuitive, human-centered interfaces that convert visitors into loyal users.",
    heroDesc: "Great user experiences feel effortless. We design beautiful digital interfaces backed by deep UX research, user journey mapping, and pixel-perfect Figma design systems.",
    heroImage: "/images/entec-about.png",
    stats: [
      { value: "3.5x", label: "Conversion Lift" },
      { value: "<2%", label: "User Friction Rate" },
      { value: "100%", label: "Figma Component Library" },
    ],
    overviewTitle: "User Experience Engineered for Growth",
    overviewDesc: [
      "A stunning visual design means nothing if users struggle to navigate your app or website. Our UX methodology focuses on clarity, intuitive user flows, and reducing cognitive load at every touchpoint.",
      "We build modular Figma design systems that bridge the gap between design and development, accelerating build speed while ensuring UI consistency across your entire product ecosystem.",
    ],
    process: [
      { step: "01", title: "User Research & Journey Mapping", desc: "Conducting user interviews, heatmaps analysis, and mapping user journeys to eliminate friction." },
      { step: "02", title: "Low-Fidelity Wireframing", desc: "Structuring page layouts and information architecture before visual styling begins." },
      { step: "03", title: "High-Fidelity UI Design", desc: "Applying visual design tokens, custom typography, micro-interactions, and dark/light modes." },
      { step: "04", title: "Interactive Prototyping & Handoff", desc: "Building click-through prototypes for usability testing and smooth developer handoff." },
    ],
    deliverables: [
      { title: "Complete Figma Design System", desc: "Atomic UI components, variant states, auto-layout cards, and typography scales." },
      { title: "UX Wireframes & Flowcharts", desc: "Detailed structural blueprints for web pages and mobile app screens." },
      { title: "High-Fidelity UI Screen Specs", desc: "Pixel-perfect mockups for desktop, tablet, and mobile breakpoints." },
      { title: "Clickable Interactive Prototypes", desc: "Simulated user experience for stakeholder presentation and testing." },
      { title: "Micro-Interaction Motion Specs", desc: "Detailed animation timelines for hover states, page transitions, and modals." },
      { title: "Developer Handoff Documentation", desc: "Exact CSS specifications, asset exports, and interaction notes." },
    ],
    tools: ["Figma", "Framer", "Principle", "Lottie", "Maze UX", "Miro"],
    faqs: [
      { question: "What is included in the Figma Design System?", answer: "You get a comprehensive atomic library containing buttons, inputs, navigation, cards, typography scales, color styles, and icon sets with auto-layout specs." },
      { question: "Can you redesign an existing mobile app or web platform?", answer: "Yes, we conduct UX audits of existing applications, identify drop-off points, and execute complete UI/UX modernizations." },
      { question: "Do you perform user testing on prototypes?", answer: "Yes, we test clickable prototypes with real target users to validate usability and navigation before development begins." },
    ],
  },

  "ecommerce": {
    slug: "ecommerce",
    num: "04",
    category: "Web Engineering",
    title: "E-Commerce & Digital Stores",
    heroTagline: "Building high-converting digital storefronts engineered for revenue and speed.",
    heroDesc: "We build custom online stores designed to maximize average order value (AOV) and checkout conversion rates. Seamless payment flows, instant search, and mobile-first shopping.",
    heroImage: "/images/bannerbac.png",
    stats: [
      { value: "+45%", label: "Average Checkout Rate" },
      { value: "1.2s", label: "Storefront Load Time" },
      { value: "100%", label: "PCI-DSS Compliant" },
    ],
    overviewTitle: "Next-Generation E-Commerce Architecture",
    overviewDesc: [
      "Modern shoppers expect lightning-fast product filtering, zero-lag cart updates, and effortless one-click checkout. Standard templates slow down your store and cause cart abandonment.",
      "We design custom e-commerce experiences—integrating Shopify Plus, Stripe, Headless Commerce, and custom inventory APIs—built to handle high-traffic product drops and global sales scaling.",
    ],
    process: [
      { step: "01", title: "Product Catalog Architecture", desc: "Structuring product taxonomy, variants, filtering tags, and cross-sell data structures." },
      { step: "02", title: "Conversion UX Storefront Design", desc: "Designing high-converting product detail pages (PDPs), collections, and cart drawers." },
      { step: "03", title: "Engineered Commerce Build", desc: "Developing storefronts with Next.js & Shopify Storefront API for sub-second page speeds." },
      { step: "04", title: "Payment & Fulfillment Integration", desc: "Connecting Stripe, PayPal, Apple Pay, inventory management, and shipping webhooks." },
    ],
    deliverables: [
      { title: "Custom Headless or Shopify Storefront", desc: "Unique high-speed storefront built specifically around your brand story." },
      { title: "Frictionless Cart & Checkout Drawer", desc: "Slide-out cart drawer with dynamic upsells, free shipping threshold bars, and instant checkout." },
      { title: "Product Detail Page (PDP) Templates", desc: "Rich PDPs featuring video previews, size guides, customer reviews, and accordion specs." },
      { title: "Advanced Search & Filtering", desc: "Instant AJAX search, multi-attribute collection filters, and search autocomplete." },
      { title: "Payment & Localized Currency Setup", desc: "Multi-currency routing, local payment methods, and automated tax calculations." },
      { title: "Analytics & Conversion Tracking", desc: "GA4 e-commerce events, Meta Pixel, Klaviyo email integration, and revenue tracking." },
    ],
    tools: ["Shopify Plus", "Next.js Commerce", "Stripe API", "Klaviyo", "Sanity CMS", "Tailwind"],
    faqs: [
      { question: "Should we build on Shopify or Headless Next.js Commerce?", answer: "We evaluate your order volume and custom feature requirements. Standard Shopify Plus works great for many brands, while Headless Next.js Commerce provides absolute performance freedom for scaling enterprises." },
      { question: "Can you migrate our store from Magento or WooCommerce?", answer: "Yes, we handle complete data migration including customer accounts, order history, product catalogs, and 301 redirects to preserve SEO rankings." },
      { question: "How do you help increase average order value (AOV)?", answer: "We implement dynamic in-cart upsells, bundle builders, free shipping progress bars, and targeted cross-sell recommendation engines." },
    ],
  },

  "digital-growth": {
    slug: "digital-growth",
    num: "05",
    category: "Digital Growth",
    title: "Performance Marketing & Growth",
    heroTagline: "Data-backed acquisition campaigns that scale customer acquisition profitability.",
    heroDesc: "Growth isn't luck—it's a system. We combine data analytics, search engine dominance, targeted paid media, and conversion rate optimization (CRO) to fuel predictable revenue growth.",
    heroImage: "/images/about.png",
    stats: [
      { value: "4.2x", label: "Average Campaign ROAS" },
      { value: "#1 Rank", label: "SEO Keyword Dominance" },
      { value: "+160%", label: "Inbound Lead Volume" },
    ],
    overviewTitle: "Engineered Growth Ecosystems",
    overviewDesc: [
      "Random marketing tactics waste budget. Our digital growth framework connects every channel—SEO, paid acquisition, landing page CRO, and retargeting—into a unified revenue machine.",
      "We continuously test ad creative, optimize search keywords, and refine landing page copy based on real-time user behavior analytics, ensuring every dollar spent delivers measurable business growth.",
    ],
    process: [
      { step: "01", title: "Growth Audit & Funnel Analysis", desc: "Analyzing your current traffic sources, customer acquisition cost (CAC), and landing page drop-off points." },
      { step: "02", title: "Strategy & Media Planning", desc: "Crafting multi-channel acquisition plans across Google Search, Meta Ads, LinkedIn, and organic SEO." },
      { step: "03", title: "Campaign Execution & Creative", desc: "Deploying high-converting ad creative, optimized search copy, and dedicated landing pages." },
      { step: "04", title: "CRO & Weekly Scaling", desc: "Iterative A/B testing of headlines, offers, and forms to increase conversion percentages week over week." },
    ],
    deliverables: [
      { title: "Comprehensive SEO Strategy & Execution", desc: "Technical audits, keyword target mapping, on-page optimization, and high-authority link acquisition." },
      { title: "Paid Search & Social Campaign Management", desc: "End-to-end management of Google Search/Shopping, Meta Ads, and LinkedIn campaigns." },
      { title: "High-Conversion Landing Page Design", desc: "Dedicated landing pages engineered specifically to maximize ad click-to-lead conversion." },
      { title: "Funnel Analytics & Real-Time Dashboard", desc: "Custom Looker Studio dashboard tracking ROAS, CAC, conversion volume, and revenue." },
      { title: "Conversion Rate Optimization (CRO)", desc: "A/B testing of headlines, CTA buttons, form fields, and value propositions." },
      { title: "Content Strategy & Copywriting", desc: "SEO-optimized articles, whitepapers, and email nurture sequences." },
    ],
    tools: ["Google Ads", "Meta Business Suite", "SEMrush", "Ahrefs", "Google Analytics 4", "Looker Studio", "Hotjar"],
    faqs: [
      { question: "How soon can we expect results from digital marketing campaigns?", answer: "Paid acquisition campaigns (Google & Meta Ads) generate immediate traffic and leads within 24-48 hours. Organic SEO strategies build compounding results starting in months 2-3." },
      { question: "How do you track return on ad spend (ROAS)?", answer: "We set up server-side conversion tracking (Conversions API & GA4) to attribute every sale or lead directly to the exact ad campaign and keyword." },
      { question: "What is your recommended minimum monthly ad spend?", answer: "We recommend a minimum monthly ad budget of $2,500 to $5,000 to gather statistically meaningful data for audience optimization." },
    ],
  },

  "motion-media": {
    slug: "motion-media",
    num: "06",
    category: "Media & Motion",
    title: "Motion Graphics & Media Production",
    heroTagline: "Scroll-stopping animations and video content that make your brand unforgettable.",
    heroDesc: "Video and motion graphics drive 80%+ of modern digital engagement. We create high-end 2D/3D motion graphics, brand promo videos, UI animations, and media assets that capture attention.",
    heroImage: "/images/team4.png",
    stats: [
      { value: "5.8x", label: "Social Video Views" },
      { value: "60 FPS", label: "Butter-Smooth Motion" },
      { value: "100%", label: "Cross-Platform Specs" },
    ],
    overviewTitle: "Visual Storytelling in Motion",
    overviewDesc: [
      "In a feed dominated by noise, motion design creates instant visual hierarchy and emotional connection. Whether it's micro-interactions in a web UI or a high-impact product video, motion brings your brand to life.",
      "Our team handles full-cycle media production—from scriptwriting and storyboarding to 3D render animations, sound design, and platform-specific video exports.",
    ],
    process: [
      { step: "01", title: "Concept & Scriptwriting", desc: "Drafting compelling narrative scripts and message pacing tailored to campaign objectives." },
      { step: "02", title: "Storyboarding & Styleframes", desc: "Creating detailed visual storyboards and styleframes before animation begins." },
      { step: "03", title: "Motion Animation & Sound Design", desc: "Animating keyframes, adding camera movement, kinetic typography, and custom audio tracks." },
      { step: "04", title: "Rendering & Multi-Format Exports", desc: "Exporting high-bitrate MP4, WebM, Lottie JSON, and GIF files for web, app, and social." },
    ],
    deliverables: [
      { title: "Brand Manifesto & Hero Videos", desc: "High-impact 30-90 second brand videos for website headers, pitch decks, and keynotes." },
      { title: "2D & 3D Motion Graphics", desc: "Custom kinetic typography, product render animations, and visual effects." },
      { title: "UI Animation & Lottie Files", desc: "Lightweight JSON/Lottie animations for seamless web UI integration with zero page lag." },
      { title: "Social Media Video Assets", desc: "Vertical 9:16 reels, TikTok assets, and 1:1 square video ads for Meta and LinkedIn." },
      { title: "Product Explainer Animations", desc: "Clarity-focused motion videos breaking down complex software or physical products." },
      { title: "Custom Audio & Sound Design", desc: "Licensed sound tracks, voiceovers, and custom sound effects (SFX)." },
    ],
    tools: ["After Effects", "Cinema 4D", "Blender", "Premiere Pro", "Rive", "LottieFiles", "Audition"],
    faqs: [
      { question: "What formats do you deliver for web UI animations?", answer: "We deliver Lottie JSON files, Rive animations, WebM videos, and SVG animations that load instantaneously on mobile and web." },
      { question: "How long does a 60-second animated video take to produce?", answer: "Production typically takes 2 to 4 weeks from script approval to final render." },
      { question: "Do you handle voiceover recording and licensed music?", answer: "Yes, we manage professional voiceover talent casting and license commercial audio tracks as part of complete production." },
    ],
  },
};

// Aliases for fallback slugs used across components
export const slugAliases: Record<string, string> = {
  "brand-identity": "branding",
  "brand-strategy": "branding",
  "website-design": "web-engineering",
  "digital-products": "uiux-design",
  "physical-product-design": "ecommerce",
  "marketing-campaigns": "digital-growth",
  "motion-content": "motion-media",
  "strategy-positioning": "branding",
};

export function getServiceDetail(slug: string): ServiceDetail {
  const normalizedSlug = slugAliases[slug] || slug;
  return servicesDictionary[normalizedSlug] || servicesDictionary["branding"];
}
