/**
 * Fallback blog posts shown only when the PHP Blog CMS API is unreachable or has
 * no published posts yet. Live posts are managed from /blog-cms/admin.
 */
export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
  imgHeight: string;
  slug: string;
  content: string;
}

export const blogsData: BlogPost[] = [
  {
    id: 1,
    title: "Website Design Trends for Businesses in 2026",
    category: "Web Design",
    date: "2026-09-10",
    description:
      "From bento-grid layouts to AI-assisted personalisation, here are the website design trends that actually help businesses win more enquiries in 2026.",
    image: "/images/blogs/future-trends.webp",
    imgHeight: "350px",
    slug: "website-design-trends-2026",
    content: `<p>Your website is often the first conversation a customer has with your business. In 2026, visitors expect sites that load instantly, feel personal and make it effortless to take the next step. These are the trends we see delivering real results for our clients.</p>
<h2>1. Bento-grid and modular layouts</h2>
<p>Content arranged in clean, card-based grids makes it easy to scan services, results and testimonials at a glance — especially on mobile.</p>
<h2>2. Bold typography with plenty of white space</h2>
<p>Large, confident headlines and generous spacing communicate premium quality and help key messages stand out.</p>
<h2>3. Purposeful micro-interactions</h2>
<p>Subtle hover states, scroll reveals and progress indicators guide users without slowing the site down.</p>
<h2>4. Speed as a design feature</h2>
<p>Google's Core Web Vitals directly affect rankings. Optimised images, modern frameworks like Next.js and lean code are now part of good design.</p>
<h2>5. Conversion-first page structure</h2>
<p>Clear calls-to-action, trust signals, WhatsApp buttons and short enquiry forms placed where users need them turn visitors into leads.</p>
<p>Planning a new website or redesign? <a href="/contact">Talk to Entec Media</a> about a site that looks great and performs even better.</p>`,
  },
  {
    id: 2,
    title: "Google Ads vs Meta Ads: Which Is Right for Your Business?",
    category: "Digital Marketing",
    date: "2026-08-22",
    description:
      "Both platforms can generate leads — but they work very differently. Here's how to decide where to spend your ad budget first.",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&auto=format&fit=crop&q=75",
    imgHeight: "220px",
    slug: "google-ads-vs-meta-ads",
    content: `<p>Google Ads and Meta Ads (Facebook &amp; Instagram) are the two most popular paid advertising platforms for Indian businesses. Choosing the right one depends on how your customers find you.</p>
<h2>Google Ads captures existing demand</h2>
<p>People searching "website development company near me" already need the service. Google Search ads put you in front of them at the moment of intent, which usually means higher-quality leads.</p>
<h2>Meta Ads creates new demand</h2>
<p>On Facebook and Instagram, people aren't searching — they're scrolling. Meta Ads use interests, demographics and behaviour to introduce your offer to the right audience, often at a lower cost per lead.</p>
<h2>When to use which</h2>
<ul>
<li><strong>Urgent or high-intent services</strong> (repairs, clinics, B2B services): start with Google Search.</li>
<li><strong>Visual products, offers and local brands</strong>: Meta Ads with strong creatives work well.</li>
<li><strong>Growing businesses</strong>: combine both, and retarget website visitors on Meta.</li>
</ul>
<h2>Tracking is non-negotiable</h2>
<p>Whichever platform you choose, set up GA4, Google Tag Manager, Meta Pixel and Conversions API so every lead is attributed correctly.</p>
<p>Not sure where to start? Our <a href="/services/google-ads">Google Ads</a> and <a href="/services/meta-ads">Meta Ads</a> teams can audit your account for free.</p>`,
  },
  {
    id: 3,
    title: "Local SEO Checklist: Rank Higher on Google Maps",
    category: "SEO",
    date: "2026-07-30",
    description:
      "A practical checklist to help your business appear in Google's local map pack and get more calls from nearby customers.",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&auto=format&fit=crop&q=75",
    imgHeight: "430px",
    slug: "local-seo-checklist",
    content: `<p>When someone searches for a service "near me", Google shows a map with three businesses before any website. Getting into that local pack can transform your enquiries.</p>
<h2>Optimise your Google Business Profile</h2>
<ul>
<li>Choose the most accurate primary category and relevant secondary categories.</li>
<li>Add your services, working hours, photos and a keyword-rich description.</li>
<li>Post updates and offers regularly.</li>
</ul>
<h2>Keep your NAP consistent</h2>
<p>Your business Name, Address and Phone number should be identical on your website, Google profile and directories such as Justdial and IndiaMART.</p>
<h2>Collect and reply to reviews</h2>
<p>Ask happy customers for reviews and respond to every review — positive or negative. Review quantity, quality and recency all influence rankings.</p>
<h2>Build local landing pages</h2>
<p>If you serve multiple cities (for example Zirakpur, Mohali and Chandigarh), create useful pages for each location with genuine local content.</p>
<p>Need help? Explore our <a href="/services/seo">SEO services</a>.</p>`,
  },
  {
    id: 4,
    title: "Flutter or React Native? Choosing a Framework for Your App",
    category: "App Development",
    date: "2026-07-05",
    description:
      "Cross-platform frameworks let you launch on Android and iOS with one codebase. Here's how Flutter and React Native compare.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=75",
    imgHeight: "200px",
    slug: "flutter-vs-react-native",
    content: `<p>Building separate native apps for Android and iOS doubles cost and time. Cross-platform frameworks solve this — and Flutter and React Native are the two leaders.</p>
<h2>Flutter</h2>
<p>Built by Google, Flutter renders its own UI, which gives pixel-perfect consistency across devices and excellent animation performance. It's a great fit for design-heavy apps.</p>
<h2>React Native</h2>
<p>Backed by Meta, React Native uses native components and JavaScript/TypeScript. If your team already works with React for the web, code and skills can be shared.</p>
<h2>How we decide</h2>
<ul>
<li><strong>Custom, animation-rich UI</strong>: Flutter.</li>
<li><strong>Existing React web product</strong>: React Native.</li>
<li><strong>Heavy device-specific features</strong>: native Kotlin/Swift modules where needed.</li>
</ul>
<p>Have an app idea? Our <a href="/services/mobile-app-development">mobile app development</a> team will help you pick the right stack.</p>`,
  },
  {
    id: 5,
    title: "Why Good UI/UX Design Pays for Itself",
    category: "UI/UX Design",
    date: "2026-06-18",
    description:
      "Better user experience means fewer drop-offs, more conversions and lower support costs. Here's the business case for investing in UI/UX.",
    image: "/images/blogs/design-value.webp",
    imgHeight: "350px",
    slug: "why-ui-ux-design-pays-off",
    content: `<p>Design is not decoration. Every confusing form, hidden button or slow screen costs you customers. Good UI/UX removes that friction.</p>
<h2>Higher conversion rates</h2>
<p>Clear navigation and focused calls-to-action help more visitors complete the action you want — whether that's an enquiry, a booking or a purchase.</p>
<h2>Lower development costs</h2>
<p>Testing ideas with wireframes and prototypes is far cheaper than rebuilding features after launch.</p>
<h2>Stronger brand trust</h2>
<p>Consistent, polished interfaces make your business look credible and professional.</p>
<p>See how our <a href="/services/ui-ux-design">UI/UX design</a> process works.</p>`,
  },
  {
    id: 6,
    title: "Our Process: From Idea to Launch in 4 Steps",
    category: "Web Development",
    date: "2026-05-27",
    description:
      "How Entec Media takes a website or app from first call to go-live — with clear milestones, transparent communication and no surprises.",
    image: "/images/blogs/design-process.webp",
    imgHeight: "220px",
    slug: "our-website-development-process",
    content: `<p>A clear process keeps projects on time and on budget. Here's how we work with every client.</p>
<h2>1. Discovery</h2>
<p>We learn about your business, audience, competitors and goals, then agree on scope, timeline and budget.</p>
<h2>2. Design</h2>
<p>Wireframes and high-fidelity designs for desktop and mobile, refined with your feedback.</p>
<h2>3. Development</h2>
<p>Clean, fast, SEO-friendly development with a CMS so you can manage content yourself.</p>
<h2>4. Launch &amp; growth</h2>
<p>Testing, go-live, analytics setup and — if you want — ongoing SEO and ad campaigns to bring in traffic.</p>
<p>Ready to start? <a href="/contact">Get a free consultation</a>.</p>`,
  },
];
