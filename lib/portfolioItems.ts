/**
 * Every project shown in the "Our projects" grid on /portfolio — built to hold hundreds of entries.
 * Plain JSON, the same shape an admin panel should return (see lib/portfolioApi.ts).
 *
 * To add a project, copy an entry and change it:
 *   - id        unique, lower-case-with-dashes
 *   - category  one of portfolioCategories below (a new category automatically gets its own tab)
 *   - image     a screenshot or artwork (1200px wide is plenty). For a full-length page screenshot,
 *               set fullPage: true and the card scrolls through it on hover.
 *   - url       the live website — the card opens it in a new tab. Without a url the card opens the
 *               case study (when caseStudy is set) or the image itself (logos, graphics).
 *
 * The detailed case studies in lib/portfolioData.ts are added to the grid automatically.
 */

export interface PortfolioItem {
  id: string;
  title: string;
  client?: string;
  category: string;
  description: string;
  image: string;
  /** True when `image` is a full-length page screenshot (scrolls on hover) */
  fullPage?: boolean;
  tech: string[];
  /** Live website, opened in a new tab */
  url?: string;
  year?: string;
  /** Kept for older data; every project now has its own page at /portfolio/{id} */
  caseStudy?: string;

  // ---- Project page (/portfolio/{id}) — all optional; missing parts fall back to the category's
  //      defaults in lib/portfolioContent.ts, so a project with only the fields above still gets a full page.
  /** One line under the title in the page hero */
  tagline?: string;
  duration?: string;
  /** Longer write-up for the overview section (paragraphs); defaults to `description` */
  overview?: string[];
  /** What we did, shown as tags in the overview (e.g. "UI/UX Design", "Development") */
  services?: string[];
  /** Extra images for the hero composition (a second screenshot, a mobile view…) */
  gallery?: string[];
  /** Up to three key facts in the hero ({ value: "+240%", label: "Organic traffic" }) */
  stats?: { value: string; label: string }[];
  /** "What we delivered" cards */
  features?: { title: string; desc: string }[];
  faqs?: { question: string; answer: string }[];
  /** Ids of projects to show under "Related projects"; defaults to the same category */
  related?: string[];
}

/**
 * Props for a "Go to website" link: the live site in a new tab, or a placeholder "#" until the
 * project's url is added (the button always shows).
 */
export function liveLinkProps(url?: string): { href: string; target?: string; rel?: string } {
  return url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : { href: "#" };
}

/** Tab order on the portfolio page */
export const portfolioCategories = [
  "Website Design",
  "Website Development",
  "Mobile Apps",
  "Graphic Design",
  "Logo Design",
  "SEO",
  "Digital Marketing",
];

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?w=1200&auto=format&fit=crop&q=72`;

// SAMPLE ENTRIES — replace with your real projects (and add as many as you like).
export const portfolioItems: PortfolioItem[] = [
  {
    id: "urban-nest-realty",
    title: "Urban Nest Realty Website",
    client: "Urban Nest Realty",
    category: "Website Design",
    description: "A clean property website with smart search, project pages and enquiry forms that send leads straight to the sales team.",
    image: unsplash("1547658719-da2b51169166"),
    tech: ["Figma", "WordPress", "Elementor", "Google Maps API"],
    year: "2026",
  },
  {
    id: "glowcare-clinic",
    title: "GlowCare Skin Clinic",
    client: "GlowCare Clinic",
    category: "Website Design",
    description: "A calm, trust-building clinic website with treatment pages, before/after galleries and online appointment booking.",
    image: unsplash("1559028012-481c04fa702d"),
    tech: ["Figma", "WordPress", "Booking Plugin"],
    year: "2026",
  },
  {
    id: "brightpath-academy",
    title: "BrightPath Academy Portal",
    client: "BrightPath Academy",
    category: "Website Development",
    description: "Course listings, student enquiries and a fast admissions flow for a growing coaching institute in Mohali.",
    image: unsplash("1498050108023-c5249f4df085"),
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    year: "2026",
  },
  {
    id: "freshkart-store",
    title: "FreshKart Grocery Store",
    client: "FreshKart",
    category: "Website Development",
    description: "An online grocery store with slot-based delivery, Razorpay payments and a simple stock dashboard for the owner.",
    image: unsplash("1555066931-4365d14bab8c"),
    tech: ["WooCommerce", "PHP", "Razorpay", "MySQL"],
    year: "2025",
  },
  {
    id: "stackline-saas",
    title: "Stackline SaaS Dashboard",
    client: "Stackline",
    category: "Website Development",
    description: "A data-heavy analytics dashboard with role-based access, live charts and exports, built for speed on every screen.",
    image: unsplash("1461749280684-dccba630e2f6"),
    tech: ["React.js", "Node.js", "PostgreSQL", "AWS"],
    year: "2025",
  },
  {
    id: "fitpulse-app",
    title: "FitPulse Workout App",
    client: "FitPulse",
    category: "Mobile Apps",
    description: "Workout plans, progress tracking and in-app subscriptions for a fitness brand — one Flutter codebase for Android and iOS.",
    image: unsplash("1512941937669-90a1b58e7e9c"),
    tech: ["Flutter", "Firebase", "RevenueCat"],
    year: "2026",
  },
  {
    id: "shopease-app",
    title: "ShopEase Shopping App",
    client: "ShopEase",
    category: "Mobile Apps",
    description: "A fast shopping app with wishlists, offers, order tracking and push notifications that bring customers back.",
    image: unsplash("1586953208448-b95a79798f07"),
    tech: ["React Native", "Node.js", "MongoDB"],
    year: "2025",
  },
  {
    id: "payquick-wallet",
    title: "PayQuick Wallet",
    client: "PayQuick",
    category: "Mobile Apps",
    description: "A secure wallet app with UPI payments, bill reminders and a clear spending overview, designed for first-time users.",
    image: unsplash("1563986768609-322da13575f3"),
    tech: ["Flutter", "Laravel", "MySQL"],
    year: "2025",
  },
  {
    id: "spice-route-branding",
    title: "Spice Route Restaurant Branding",
    client: "Spice Route",
    category: "Graphic Design",
    description: "Menus, signage, packaging and a month of social creatives that gave a family restaurant a premium, consistent look.",
    image: unsplash("1626785774573-4b799315345d"),
    tech: ["Illustrator", "Photoshop", "InDesign"],
    year: "2026",
  },
  {
    id: "aurora-fashion-creatives",
    title: "Aurora Fashion Campaign Creatives",
    client: "Aurora Fashion",
    category: "Graphic Design",
    description: "Festive campaign creatives — posts, stories, banners and lookbook pages — designed as one recognisable system.",
    image: unsplash("1626785774625-ddcddc3445e9"),
    tech: ["Photoshop", "Illustrator", "Canva"],
    year: "2025",
  },
  {
    id: "peakline-logo",
    title: "Peakline Builders Logo",
    client: "Peakline Builders",
    category: "Logo Design",
    description: "A strong, simple mark for a construction company, with colour rules and versions for sites, vehicles and helmets.",
    image: unsplash("1561070791-2526d30994b5"),
    tech: ["Illustrator", "Brand Guidelines"],
    year: "2026",
  },
  {
    id: "leafy-organics-logo",
    title: "Leafy Organics Identity",
    client: "Leafy Organics",
    category: "Logo Design",
    description: "A fresh logo and packaging labels for an organic food brand, built to stand out on crowded store shelves.",
    image: unsplash("1541462608143-67571c6738dd"),
    tech: ["Illustrator", "Packaging Design"],
    year: "2025",
  },
  {
    id: "kidzone-logo",
    title: "KidZone Play School Logo",
    client: "KidZone",
    category: "Logo Design",
    description: "A playful, colourful identity for a play school — friendly for kids, reassuring for parents.",
    image: unsplash("1586717791821-3f44a563fa4c"),
    tech: ["Illustrator", "Photoshop"],
    year: "2025",
  },
  {
    id: "dentacare-seo",
    title: "DentaCare Local SEO",
    client: "DentaCare Clinic",
    category: "SEO",
    description: "Google Business Profile, local pages and reviews that took a dental clinic to the top three map results in Zirakpur.",
    image: unsplash("1432888498266-38ffec3eaf0a"),
    tech: ["Google Business Profile", "Search Console", "Ahrefs"],
    year: "2026",
  },
  {
    id: "travelmate-seo",
    title: "TravelMate Organic Growth",
    client: "TravelMate Holidays",
    category: "SEO",
    description: "Technical fixes and a content plan around holiday packages that tripled organic enquiries in six months.",
    image: unsplash("1460925895917-afdab827c52f"),
    tech: ["Semrush", "Search Console", "WordPress"],
    year: "2025",
  },
  {
    id: "homestyle-meta-ads",
    title: "HomeStyle Furniture Meta Ads",
    client: "HomeStyle Furniture",
    category: "Digital Marketing",
    description: "Carousel and reel campaigns on Facebook and Instagram that brought steady showroom visits and WhatsApp enquiries.",
    image: unsplash("1611162617213-7d7a39e9b1d7"),
    tech: ["Meta Ads", "Meta Pixel", "Canva"],
    year: "2026",
  },
  {
    id: "edgeacademy-google-ads",
    title: "Edge Academy Google Ads",
    client: "Edge Academy",
    category: "Digital Marketing",
    description: "Search campaigns and landing pages for course admissions, with call and form tracking on every rupee spent.",
    image: unsplash("1611926653458-09294b3142bf"),
    tech: ["Google Ads", "GA4", "Tag Manager"],
    year: "2025",
  },
  {
    id: "cafe-brew-social",
    title: "Cafe Brew Social Media",
    client: "Cafe Brew",
    category: "Digital Marketing",
    description: "Monthly content, reels and influencer collaborations that grew a local cafe's Instagram following and weekend footfall.",
    image: unsplash("1533750349088-cd871a92f312"),
    tech: ["Instagram", "Meta Business Suite", "CapCut"],
    year: "2025",
  },
];
