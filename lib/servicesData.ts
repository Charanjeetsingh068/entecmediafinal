export type ServiceCategory = "Design" | "Development" | "Digital Marketing";

export interface ServiceDetail {
  slug: string;
  num: string;
  category: ServiceCategory;
  title: string;
  /** One-line summary used on the home page services list */
  shortDesc: string;
  /** Card tagline used on the services listing page */
  tagline: string;
  /** Short deliverable pills used on the services listing page */
  highlights: string[];
  image: string;
  thumb: string;
  heroTagline: string;
  heroDesc: string;
  stats: { value: string; label: string }[];
  overviewTitle: string;
  overviewDesc: string[];
  process: { step: string; title: string; desc: string }[];
  deliverables: { title: string; desc: string }[];
  tools: string[];
  faqs: { question: string; answer: string }[];
}

const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&auto=format&fit=crop&q=75`;

export const serviceCategories: ServiceCategory[] = ["Design", "Development", "Digital Marketing"];

export const servicesList: ServiceDetail[] = [
  {
    slug: "website-design",
    num: "01",
    category: "Design",
    title: "Website Design",
    shortDesc:
      "Modern, responsive website designs that reflect your brand, build trust and turn visitors into enquiries.",
    tagline: "Beautiful, conversion-focused websites that represent your brand",
    highlights: ["Custom Layouts", "Responsive Design", "Landing Pages", "Website Redesign"],
    image: unsplash("1547658719-da2b51169166", 1600),
    thumb: unsplash("1547658719-da2b51169166", 200),
    heroTagline: "Websites that look premium, load fast and make visitors take action.",
    heroDesc:
      "Your website is often the first impression of your business. We design custom, mobile-friendly websites with a clear structure, strong visuals and persuasive calls-to-action so every visitor understands what you do and how to reach you.",
    stats: [
      { value: "100%", label: "Custom Designs" },
      { value: "Mobile", label: "First Approach" },
      { value: "SEO", label: "Ready Structure" },
    ],
    overviewTitle: "Design that works as hard as you do",
    overviewDesc: [
      "A good-looking website is not enough — it has to guide people towards a phone call, a form fill or a purchase. We plan every page around your customer's journey, then design it to be clear, fast and on-brand.",
      "Whether you need a new business website, a landing page for your ad campaigns or a redesign of an outdated site, we deliver pixel-perfect designs for desktop, tablet and mobile.",
    ],
    process: [
      { step: "01", title: "Discovery & Planning", desc: "We understand your business, audience, competitors and goals, then plan the sitemap and page structure." },
      { step: "02", title: "Wireframes", desc: "Low-fidelity layouts define the content hierarchy and user flow before visual design begins." },
      { step: "03", title: "Visual Design", desc: "High-fidelity designs with your brand colours, typography, imagery and clear call-to-action placement." },
      { step: "04", title: "Review & Handoff", desc: "We refine the design with your feedback and hand over developer-ready files and assets." },
    ],
    deliverables: [
      { title: "Custom Homepage & Inner Pages", desc: "Unique layouts for home, about, services, portfolio, contact and more." },
      { title: "Responsive Layouts", desc: "Designs adapted for desktop, tablet and mobile screens." },
      { title: "Landing Page Design", desc: "High-converting pages built for Google Ads and Meta Ads campaigns." },
      { title: "Brand-Aligned Visual Style", desc: "Colours, typography, icons and imagery that match your identity." },
      { title: "Clickable Prototype", desc: "An interactive preview so you can experience the site before development." },
      { title: "Design Files & Assets", desc: "Organised Figma files and exported assets ready for development." },
    ],
    tools: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Webflow", "WordPress"],
    faqs: [
      { question: "How long does a website design take?", answer: "A typical business website design takes 2–4 weeks depending on the number of pages and revisions." },
      { question: "Can you redesign my existing website?", answer: "Yes. We audit your current site, keep what works and redesign it with a modern, faster and more user-friendly layout." },
      { question: "Will my website look good on mobile?", answer: "Absolutely. Every design is created mobile-first and tested for tablets and desktops as well." },
    ],
  },
  {
    slug: "website-development",
    num: "02",
    category: "Development",
    title: "Website Development",
    shortDesc:
      "Fast, secure and SEO-friendly websites built on WordPress, React and Next.js — easy for you to manage.",
    tagline: "High-performance websites and web applications built to scale",
    highlights: ["WordPress", "React.js / Next.js", "E-Commerce", "CMS Integration"],
    image: unsplash("1461749280684-dccba630e2f6", 1600),
    thumb: unsplash("1461749280684-dccba630e2f6", 200),
    heroTagline: "Clean code, fast load times and websites your team can update easily.",
    heroDesc:
      "We turn designs into fully functional websites and web applications. From business websites on WordPress to custom React.js and Next.js platforms and e-commerce stores, we build for speed, security and search visibility.",
    stats: [
      { value: "90+", label: "PageSpeed Target" },
      { value: "SSL", label: "Secure by Default" },
      { value: "CMS", label: "Easy Content Updates" },
    ],
    overviewTitle: "Built for speed, security and growth",
    overviewDesc: [
      "A slow or broken website costs you leads. We write clean, maintainable code, optimise images and scripts, and follow SEO best practices so your site ranks well and loads quickly on every device.",
      "Every website comes with an easy-to-use admin panel so your team can update text, images, blogs and products without touching code.",
    ],
    process: [
      { step: "01", title: "Technical Planning", desc: "We choose the right platform (WordPress, Next.js, Shopify or custom) and plan integrations." },
      { step: "02", title: "Development", desc: "Pixel-perfect, responsive front-end and robust back-end development with a CMS." },
      { step: "03", title: "Integrations & QA", desc: "Forms, payment gateways, analytics, CRM and thorough cross-browser testing." },
      { step: "04", title: "Launch & Support", desc: "Domain, hosting and SSL setup, go-live and ongoing maintenance support." },
    ],
    deliverables: [
      { title: "Business & Corporate Websites", desc: "Multi-page responsive websites with a user-friendly CMS." },
      { title: "E-Commerce Stores", desc: "WooCommerce, Shopify or custom stores with payment gateway integration." },
      { title: "Custom Web Applications", desc: "React.js / Next.js portals, dashboards and booking systems." },
      { title: "Technical SEO Setup", desc: "Sitemaps, meta tags, schema markup and clean URL structure." },
      { title: "Speed & Security Optimisation", desc: "Caching, image optimisation, SSL and security hardening." },
      { title: "Maintenance & Support", desc: "Updates, backups, bug fixes and content changes after launch." },
    ],
    tools: ["WordPress", "WooCommerce", "React.js", "Next.js", "Node.js", "PHP", "Shopify", "MySQL"],
    faqs: [
      { question: "Which platform is right for my website?", answer: "For most business sites we recommend WordPress for easy editing. For custom features or high performance we build with React.js / Next.js." },
      { question: "Will I be able to update the website myself?", answer: "Yes. We set up a CMS and give you a walkthrough so you can edit content, images and blog posts on your own." },
      { question: "Do you provide hosting and maintenance?", answer: "We can set up hosting, domain and SSL for you and offer monthly maintenance plans for updates, backups and support." },
    ],
  },
  {
    slug: "mobile-app-design",
    num: "03",
    category: "Design",
    title: "Mobile App Design",
    shortDesc:
      "Intuitive iOS and Android app interfaces designed around real user journeys and your business goals.",
    tagline: "Engaging app experiences users love to come back to",
    highlights: ["iOS & Android UI", "User Flows", "App Prototypes", "Design Systems"],
    image: unsplash("1512941937669-90a1b58e7e9c", 1600),
    thumb: unsplash("1512941937669-90a1b58e7e9c", 200),
    heroTagline: "App screens that are simple to use and a pleasure to look at.",
    heroDesc:
      "We design mobile apps for startups and businesses — from onboarding and navigation to checkout and dashboards. Every screen follows iOS and Android guidelines while staying true to your brand.",
    stats: [
      { value: "iOS", label: "& Android Guidelines" },
      { value: "100%", label: "Clickable Prototypes" },
      { value: "Dev", label: "Ready Handoff" },
    ],
    overviewTitle: "App design that keeps users engaged",
    overviewDesc: [
      "Users decide within seconds whether an app is worth keeping. We map user journeys, reduce friction and design clear, thumb-friendly interfaces that make key actions effortless.",
      "You receive a complete design system and an interactive prototype, so your development team (or ours) can build the app quickly and consistently.",
    ],
    process: [
      { step: "01", title: "Research & User Flows", desc: "Understanding your users, features and competitors to map the app's core journeys." },
      { step: "02", title: "Wireframes", desc: "Screen-by-screen layouts that define structure and navigation." },
      { step: "03", title: "UI Design", desc: "High-fidelity screens with your brand style, icons, states and micro-interactions." },
      { step: "04", title: "Prototype & Handoff", desc: "Interactive prototype for testing and complete specs for developers." },
    ],
    deliverables: [
      { title: "User Flow Diagrams", desc: "Clear maps of how users move through your app." },
      { title: "Wireframes for All Screens", desc: "Structural blueprints for every screen and state." },
      { title: "High-Fidelity App UI", desc: "Polished screens for iOS and Android." },
      { title: "Interactive Prototype", desc: "Clickable prototype for demos, investors and user testing." },
      { title: "App Design System", desc: "Reusable components, colours, typography and icons." },
      { title: "App Store Assets", desc: "App icon and store screenshot designs." },
    ],
    tools: ["Figma", "Adobe XD", "Protopie", "Lottie", "Illustrator", "Miro"],
    faqs: [
      { question: "Do you design for both iOS and Android?", answer: "Yes. We follow Apple Human Interface and Google Material guidelines and adapt designs for both platforms." },
      { question: "Can you redesign my existing app?", answer: "Yes. We audit the current app, identify pain points and deliver an improved, modern design." },
      { question: "Can you also develop the app?", answer: "Yes — our Mobile App Development team can build the app from the same designs." },
    ],
  },
  {
    slug: "mobile-app-development",
    num: "04",
    category: "Development",
    title: "Mobile App Development",
    shortDesc:
      "Native and cross-platform Android and iOS apps built with Flutter and React Native, from idea to app store.",
    tagline: "Reliable Android & iOS apps from concept to launch",
    highlights: ["Flutter", "React Native", "API Integration", "Play Store & App Store"],
    image: unsplash("1551650975-87deedd944c3", 1600),
    thumb: unsplash("1551650975-87deedd944c3", 200),
    heroTagline: "Turn your idea into a fast, stable and scalable mobile app.",
    heroDesc:
      "We develop Android and iOS apps using Flutter, React Native and native technologies. From e-commerce and booking apps to business tools, we handle development, backend, testing and app store publishing.",
    stats: [
      { value: "2-in-1", label: "Android & iOS Builds" },
      { value: "API", label: "& Backend Included" },
      { value: "Store", label: "Publishing Support" },
    ],
    overviewTitle: "One team from idea to app store",
    overviewDesc: [
      "Building an app involves design, development, backend, testing and publishing. We manage the full lifecycle so you get a working product without juggling multiple vendors.",
      "Using cross-platform frameworks like Flutter and React Native, we deliver apps for both Android and iOS from a single codebase — saving time and cost without compromising quality.",
    ],
    process: [
      { step: "01", title: "Scope & Architecture", desc: "Feature list, technology choice and backend/API planning." },
      { step: "02", title: "Agile Development", desc: "Sprint-based development with regular builds for you to test." },
      { step: "03", title: "Testing & QA", desc: "Functional, device and performance testing on Android and iOS." },
      { step: "04", title: "Launch & Maintenance", desc: "Play Store and App Store publishing, updates and support." },
    ],
    deliverables: [
      { title: "Android & iOS Apps", desc: "Cross-platform or native apps built for performance." },
      { title: "Admin Panel & Backend", desc: "Dashboard to manage users, content, orders and data." },
      { title: "API Integrations", desc: "Payment gateways, maps, notifications, CRM and third-party APIs." },
      { title: "Push Notifications", desc: "Engage users with timely, targeted notifications." },
      { title: "App Store Publishing", desc: "Complete submission to Google Play Store and Apple App Store." },
      { title: "Post-Launch Support", desc: "Bug fixes, OS updates and new feature releases." },
    ],
    tools: ["Flutter", "React Native", "Kotlin", "Swift", "Firebase", "Node.js", "Laravel"],
    faqs: [
      { question: "How long does it take to build an app?", answer: "A basic app can take 6–8 weeks, while feature-rich apps take 3–6 months. We share a clear timeline after scoping." },
      { question: "Will I own the source code?", answer: "Yes. After final payment you receive full ownership of the source code and app store accounts." },
      { question: "Do you help publish the app?", answer: "Yes. We handle the complete Play Store and App Store submission process." },
    ],
  },
  {
    slug: "graphic-design",
    num: "05",
    category: "Design",
    title: "Graphic Design",
    shortDesc:
      "Logos, brand identity, social media creatives and print designs that make your brand instantly recognisable.",
    tagline: "Visuals that make your brand stand out everywhere",
    highlights: ["Logo & Branding", "Social Media Creatives", "Brochures & Print", "Ad Creatives"],
    image: unsplash("1626785774573-4b799315345d", 1600),
    thumb: unsplash("1626785774573-4b799315345d", 200),
    heroTagline: "Consistent, eye-catching design for every touchpoint of your brand.",
    heroDesc:
      "From your logo and brand identity to social media posts, ad creatives, brochures and packaging, our designers create visuals that communicate clearly and leave a lasting impression.",
    stats: [
      { value: "Logo", label: "& Brand Identity" },
      { value: "Social", label: "& Ad Creatives" },
      { value: "Print", label: "Ready Files" },
    ],
    overviewTitle: "A strong brand is a consistent brand",
    overviewDesc: [
      "Customers trust brands that look professional and consistent. We create a visual identity for your business and apply it across your website, social media, ads and printed materials.",
      "Need regular creatives? We also offer monthly design packages for social media posts, reels covers, festive creatives and ad banners.",
    ],
    process: [
      { step: "01", title: "Brief & Research", desc: "Understanding your brand, audience and the purpose of each design." },
      { step: "02", title: "Concepts", desc: "Multiple creative directions for you to choose from." },
      { step: "03", title: "Refinement", desc: "We polish the selected concept based on your feedback." },
      { step: "04", title: "Final Delivery", desc: "All formats for web, social and print, ready to use." },
    ],
    deliverables: [
      { title: "Logo Design", desc: "Unique logo with variations for light, dark and small sizes." },
      { title: "Brand Identity Kit", desc: "Colour palette, typography and brand usage guidelines." },
      { title: "Social Media Creatives", desc: "Posts, carousels, stories and reel covers for all platforms." },
      { title: "Ad Creatives", desc: "Banners and creatives for Google Display and Meta Ads." },
      { title: "Print Design", desc: "Brochures, flyers, business cards, standees and packaging." },
      { title: "Presentations", desc: "Company profiles and pitch decks with a professional look." },
    ],
    tools: ["Photoshop", "Illustrator", "InDesign", "CorelDRAW", "Canva Pro", "Figma"],
    faqs: [
      { question: "How many logo concepts do you provide?", answer: "We usually present 2–3 logo concepts and refine the selected one with revisions." },
      { question: "Do you offer monthly social media design packages?", answer: "Yes. We offer monthly packages with a fixed number of posts, stories and ad creatives." },
      { question: "Will I get the source files?", answer: "Yes. You receive the final artwork in editable source formats along with PNG, JPG, SVG and PDF files." },
    ],
  },
  {
    slug: "ui-ux-design",
    num: "06",
    category: "Design",
    title: "UI/UX Design",
    shortDesc:
      "Research-driven user experience and clean interfaces for websites, SaaS products and dashboards.",
    tagline: "User-centred interfaces that are easy to use and convert better",
    highlights: ["UX Research", "Wireframes", "UI Design Systems", "Usability Testing"],
    image: unsplash("1561070791-2526d30994b5", 1600),
    thumb: unsplash("1561070791-2526d30994b5", 200),
    heroTagline: "Great products feel effortless — we design them that way.",
    heroDesc:
      "We combine user research, information architecture and visual design to create digital products that are simple to use. From SaaS dashboards to web portals, we design interfaces that reduce friction and improve conversions.",
    stats: [
      { value: "UX", label: "Research Led" },
      { value: "Figma", label: "Design Systems" },
      { value: "Tested", label: "With Real Users" },
    ],
    overviewTitle: "Good UX is good business",
    overviewDesc: [
      "Confusing interfaces lose customers. Our UX process identifies what users need, where they get stuck and how to make key tasks faster and clearer.",
      "We then translate those insights into a consistent UI design system — making your product easier to build, scale and maintain.",
    ],
    process: [
      { step: "01", title: "UX Audit & Research", desc: "User interviews, analytics review and competitor analysis." },
      { step: "02", title: "Information Architecture", desc: "Sitemaps, user flows and wireframes." },
      { step: "03", title: "UI Design", desc: "High-fidelity screens and a reusable component library." },
      { step: "04", title: "Prototype & Testing", desc: "Interactive prototypes tested with users before development." },
    ],
    deliverables: [
      { title: "UX Audit Report", desc: "Clear findings and recommendations for your existing product." },
      { title: "User Personas & Journeys", desc: "Who your users are and how they interact with your product." },
      { title: "Wireframes & User Flows", desc: "The structural blueprint of your product." },
      { title: "UI Design System", desc: "Components, typography, colours and states in Figma." },
      { title: "Interactive Prototype", desc: "Clickable prototype for testing and stakeholder review." },
      { title: "Developer Handoff", desc: "Specs, assets and documentation for smooth development." },
    ],
    tools: ["Figma", "FigJam", "Maze", "Hotjar", "Miro", "Adobe XD"],
    faqs: [
      { question: "What is the difference between UI and UX?", answer: "UX is how the product works and feels for the user; UI is how it looks. We handle both together." },
      { question: "Do you work on existing products?", answer: "Yes. We regularly audit and redesign existing websites, dashboards and apps." },
      { question: "Can you work with our in-house developers?", answer: "Yes. We provide detailed Figma files and specs, and stay available during development." },
    ],
  },
  {
    slug: "digital-marketing",
    num: "07",
    category: "Digital Marketing",
    title: "Digital Marketing",
    shortDesc:
      "Complete online marketing — social media, content, email and performance campaigns that bring real leads.",
    tagline: "Full-funnel marketing that grows your brand and your revenue",
    highlights: ["Social Media Marketing", "Content Marketing", "Lead Generation", "Analytics & Reporting"],
    image: unsplash("1460925895917-afdab827c52f", 1600),
    thumb: unsplash("1460925895917-afdab827c52f", 200),
    heroTagline: "Reach the right audience, generate quality leads and grow consistently.",
    heroDesc:
      "We plan and run end-to-end digital marketing for your business — social media management, content, paid campaigns, email marketing and conversion tracking — all connected to clear business goals.",
    stats: [
      { value: "360°", label: "Marketing Approach" },
      { value: "Monthly", label: "Performance Reports" },
      { value: "ROI", label: "Focused Strategy" },
    ],
    overviewTitle: "Marketing that is measured, not guessed",
    overviewDesc: [
      "Random posts and boosted ads rarely bring results. We build a strategy around your audience and goals, then execute across the channels that matter most for your business.",
      "Every campaign is tracked — you get transparent monthly reports showing reach, leads, cost per lead and what we are improving next.",
    ],
    process: [
      { step: "01", title: "Audit & Strategy", desc: "Review of your current presence, competitors and goals to build a marketing plan." },
      { step: "02", title: "Content & Creatives", desc: "Content calendar, creatives, reels and ad copy aligned to your brand." },
      { step: "03", title: "Campaign Execution", desc: "Organic and paid campaigns across social media, search and email." },
      { step: "04", title: "Track & Optimise", desc: "Monthly reporting and continuous optimisation for better results." },
    ],
    deliverables: [
      { title: "Social Media Management", desc: "Instagram, Facebook, LinkedIn and YouTube content and community management." },
      { title: "Content Calendar", desc: "Monthly plan of posts, reels and campaigns." },
      { title: "Lead Generation Campaigns", desc: "Campaigns with landing pages and lead forms designed to convert." },
      { title: "Email & WhatsApp Marketing", desc: "Nurture sequences and broadcast campaigns." },
      { title: "Conversion Tracking", desc: "GA4, Meta Pixel and Google Tag Manager setup." },
      { title: "Monthly Reports", desc: "Clear performance reports with insights and next steps." },
    ],
    tools: ["Meta Business Suite", "Google Analytics 4", "Google Tag Manager", "Canva", "Mailchimp", "HubSpot"],
    faqs: [
      { question: "Which platforms should my business be on?", answer: "It depends on your audience. We recommend the right mix after an initial audit — usually Instagram, Facebook, LinkedIn and Google." },
      { question: "How soon will I see results?", answer: "Paid campaigns can bring leads within days. Organic growth and SEO build momentum over 2–3 months." },
      { question: "Do you share reports?", answer: "Yes. You receive a monthly report and can ask for a review call anytime." },
    ],
  },
  {
    slug: "seo",
    num: "08",
    category: "Digital Marketing",
    title: "SEO",
    shortDesc:
      "Search engine optimisation that improves your Google rankings, organic traffic and local visibility.",
    tagline: "Rank higher on Google and get found by customers searching for you",
    highlights: ["Technical SEO", "On-Page SEO", "Local SEO", "Link Building"],
    image: unsplash("1432888498266-38ffec3eaf0a", 1600),
    thumb: unsplash("1432888498266-38ffec3eaf0a", 200),
    heroTagline: "Sustainable organic growth from people already searching for your services.",
    heroDesc:
      "Our SEO services cover technical fixes, keyword research, on-page optimisation, content, local SEO and quality link building — so your website ranks higher on Google and brings consistent, free traffic.",
    stats: [
      { value: "White-Hat", label: "SEO Practices" },
      { value: "Local", label: "& Google Maps SEO" },
      { value: "Monthly", label: "Ranking Reports" },
    ],
    overviewTitle: "Be visible where your customers are searching",
    overviewDesc: [
      "Most customers search on Google before they buy. If your business isn't on the first page, you're handing those customers to competitors.",
      "We follow Google's guidelines and focus on long-term results: a technically healthy website, relevant content and genuine authority building.",
    ],
    process: [
      { step: "01", title: "SEO Audit", desc: "Technical, on-page and backlink audit of your website." },
      { step: "02", title: "Keyword Research", desc: "Finding high-intent keywords your customers actually search for." },
      { step: "03", title: "Optimisation", desc: "On-page fixes, content, local SEO and technical improvements." },
      { step: "04", title: "Authority & Reporting", desc: "Quality link building and monthly ranking and traffic reports." },
    ],
    deliverables: [
      { title: "Technical SEO Fixes", desc: "Site speed, indexing, sitemaps, schema and Core Web Vitals." },
      { title: "On-Page Optimisation", desc: "Titles, meta descriptions, headings, internal links and content." },
      { title: "Local SEO", desc: "Google Business Profile optimisation and local citations." },
      { title: "SEO Content", desc: "Blog posts and service pages targeting valuable keywords." },
      { title: "Link Building", desc: "Relevant, high-quality backlinks from trusted websites." },
      { title: "Monthly SEO Reports", desc: "Rankings, traffic, leads and actions taken." },
    ],
    tools: ["Google Search Console", "Google Analytics 4", "Ahrefs", "SEMrush", "Screaming Frog", "Google Business Profile"],
    faqs: [
      { question: "How long does SEO take to show results?", answer: "Most websites see noticeable improvement in 3–6 months, depending on competition and the website's current condition." },
      { question: "Do you guarantee #1 rankings?", answer: "No honest agency can guarantee rankings. We guarantee transparent work, best practices and steady improvement." },
      { question: "Do you do local SEO?", answer: "Yes. We optimise your Google Business Profile and local listings so you appear in map results near you." },
    ],
  },
  {
    slug: "google-ads",
    num: "09",
    category: "Digital Marketing",
    title: "Google Ads",
    shortDesc:
      "Search, Display, YouTube and Performance Max campaigns that put your business in front of ready-to-buy customers.",
    tagline: "Instant visibility on Google for high-intent customers",
    highlights: ["Search Ads", "Performance Max", "YouTube Ads", "Conversion Tracking"],
    image: unsplash("1573804633927-bfcbcd909acd", 1600),
    thumb: unsplash("1573804633927-bfcbcd909acd", 200),
    heroTagline: "Show up at the exact moment customers search for what you offer.",
    heroDesc:
      "We plan, launch and manage Google Ads campaigns — Search, Display, Shopping, YouTube and Performance Max — with proper conversion tracking, so every rupee of ad spend is measured and optimised.",
    stats: [
      { value: "Search", label: "Display & YouTube" },
      { value: "100%", label: "Conversion Tracking" },
      { value: "Weekly", label: "Optimisation" },
    ],
    overviewTitle: "Paid search that pays for itself",
    overviewDesc: [
      "Google Ads can deliver leads from day one — but poorly managed campaigns waste budget quickly. We focus on the right keywords, strong ad copy, relevant landing pages and accurate tracking.",
      "We continuously test and optimise bids, keywords, audiences and ads to lower your cost per lead and improve return on ad spend.",
    ],
    process: [
      { step: "01", title: "Account & Keyword Research", desc: "Competitor analysis and high-intent keyword planning." },
      { step: "02", title: "Campaign Setup", desc: "Campaign structure, ad copy, extensions and conversion tracking." },
      { step: "03", title: "Launch & Monitor", desc: "Close monitoring of search terms, budgets and performance." },
      { step: "04", title: "Optimise & Scale", desc: "A/B testing and scaling what works profitably." },
    ],
    deliverables: [
      { title: "Search Campaigns", desc: "Text ads targeting customers actively searching for your services." },
      { title: "Performance Max & Shopping", desc: "Campaigns for e-commerce and multi-channel reach." },
      { title: "Display & YouTube Ads", desc: "Visual and video ads for awareness and remarketing." },
      { title: "Landing Page Recommendations", desc: "Suggestions (or full design) for higher conversion rates." },
      { title: "Conversion Tracking", desc: "Calls, forms, WhatsApp clicks and purchases tracked in GA4 and Google Ads." },
      { title: "Performance Reports", desc: "Clear reports on spend, leads, CPL and ROAS." },
    ],
    tools: ["Google Ads", "Google Analytics 4", "Google Tag Manager", "Google Merchant Center", "Looker Studio"],
    faqs: [
      { question: "What budget do I need for Google Ads?", answer: "It depends on your industry and location. We recommend a budget after keyword research so you can get meaningful results." },
      { question: "Is the ad budget included in your fee?", answer: "No. The ad budget is paid directly to Google; our management fee is separate." },
      { question: "How quickly will I get leads?", answer: "Search campaigns usually start generating enquiries within the first few days of going live." },
    ],
  },
  {
    slug: "meta-ads",
    num: "10",
    category: "Digital Marketing",
    title: "Meta Ads",
    shortDesc:
      "Facebook and Instagram ad campaigns with scroll-stopping creatives, precise targeting and lead forms.",
    tagline: "Facebook & Instagram ads that generate leads and sales",
    highlights: ["Facebook Ads", "Instagram Ads", "Lead Form Campaigns", "Retargeting"],
    image: unsplash("1611162617213-7d7a39e9b1d7", 1600),
    thumb: unsplash("1611162617213-7d7a39e9b1d7", 200),
    heroTagline: "Reach your ideal customers on Facebook and Instagram — and turn them into leads.",
    heroDesc:
      "We create and manage Meta Ads campaigns for lead generation, sales and brand awareness. From audience research and ad creatives to Pixel and Conversions API setup, we handle everything.",
    stats: [
      { value: "FB + IG", label: "Campaign Management" },
      { value: "Pixel", label: "& Conversions API" },
      { value: "Creative", label: "Testing Included" },
    ],
    overviewTitle: "Social ads built on data and creativity",
    overviewDesc: [
      "Meta Ads let you reach people by location, interests and behaviour — but results depend on the right audience, creative and offer. We test all three to find what works for your business.",
      "Using instant lead forms, WhatsApp campaigns and retargeting, we build full-funnel campaigns that turn attention into enquiries and sales.",
    ],
    process: [
      { step: "01", title: "Audience & Offer Research", desc: "Defining target audiences, offers and campaign objectives." },
      { step: "02", title: "Creatives & Copy", desc: "Image, carousel and reel ad creatives with persuasive copy." },
      { step: "03", title: "Tracking & Launch", desc: "Meta Pixel, Conversions API and campaign setup." },
      { step: "04", title: "Test & Optimise", desc: "Creative and audience testing to lower cost per lead." },
    ],
    deliverables: [
      { title: "Lead Generation Campaigns", desc: "Instant forms and landing page campaigns for quality leads." },
      { title: "Sales & Catalogue Ads", desc: "Campaigns for e-commerce stores with product catalogues." },
      { title: "WhatsApp & Messenger Ads", desc: "Click-to-chat campaigns for direct conversations." },
      { title: "Retargeting Campaigns", desc: "Reconnect with website visitors and engaged users." },
      { title: "Ad Creatives", desc: "Static, carousel and video creatives designed for each campaign." },
      { title: "Pixel & CAPI Setup", desc: "Accurate tracking with Meta Pixel and Conversions API." },
    ],
    tools: ["Meta Ads Manager", "Meta Business Suite", "Meta Pixel", "Conversions API", "Canva", "CapCut"],
    faqs: [
      { question: "Are Meta Ads good for lead generation?", answer: "Yes. Facebook and Instagram lead ads are one of the most cost-effective ways to generate enquiries for local and service businesses." },
      { question: "Do you create the ad creatives?", answer: "Yes. Our design team creates images, carousels and short video ads for your campaigns." },
      { question: "Can leads come directly to my CRM or WhatsApp?", answer: "Yes. We can connect lead forms to your CRM, Google Sheets, email or WhatsApp." },
    ],
  },
];

export const servicesDictionary: Record<string, ServiceDetail> = Object.fromEntries(
  servicesList.map((service) => [service.slug, service])
);

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return servicesDictionary[slug];
}

/** Old service URLs from the previous site structure, kept alive via redirects in next.config.ts */
export const legacyServiceSlugs: Record<string, string> = {
  branding: "graphic-design",
  "brand-identity": "graphic-design",
  "web-engineering": "website-development",
  "uiux-design": "ui-ux-design",
  ecommerce: "website-development",
  "digital-growth": "digital-marketing",
  "motion-media": "graphic-design",
};
