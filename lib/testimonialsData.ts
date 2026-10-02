/**
 * Client testimonials shown on the home, about and services pages (components/home/Testimonials.tsx).
 * Plain JSON so they can come from an admin panel later.
 */
// NOTE: Replace these with genuine client reviews (with the client's permission) before going live.
export interface Review {
  quote: string;
  service: string;
  name: string;
  role: string;
  /** Image path or URL (square, at least 88px) */
  avatar: string;
}

export const testimonials: Review[] = [
  { quote: "Entec Media rebuilt our website and took over our Google and Meta Ads. The new site loads fast, looks premium, and our enquiries have grown every single month since launch.", service: "Website + Ads", name: "Rohit Arora", role: "Founder, Real Estate Consultancy", avatar: "/images/team1-avatar.webp" },
  { quote: "Our new website is fast, mobile-friendly and easy to update. The team understood exactly what our customers were looking for.", service: "Website", name: "Simran Kaur", role: "Owner, Boutique Clothing Brand", avatar: "/images/team1-avatar.webp" },
  { quote: "From UI/UX design to the final Flutter app, Entec Media handled everything professionally and launched on both app stores on time.", service: "Mobile App", name: "Karan Mehta", role: "Co-Founder, Food Delivery Startup", avatar: "/images/team3-avatar.webp" },
  { quote: "Their Meta Ads campaigns brought us consistent, quality leads at a much lower cost per lead than we were paying before. Reporting is clear and every rupee is accounted for.", service: "Meta Ads", name: "Amit Sharma", role: "Director, Immigration Consultancy", avatar: "/images/team2-avatar.webp" },
  { quote: "Clear communication, transparent reporting and creative ideas every month. It feels like having an in-house marketing team.", service: "Digital Marketing", name: "Harpreet Singh", role: "Managing Partner, Hospitality Group", avatar: "/images/team1-avatar.webp" },
  { quote: "The logo and brand identity they designed gave our business a completely professional look across print and social media.", service: "Branding", name: "Priya Malhotra", role: "Founder, Organic Skincare Brand", avatar: "/images/team2-avatar.webp" },
  { quote: "Within a few months of SEO work we started ranking on the first page of Google for our main services in Mohali and Chandigarh — calls from Google have never been higher.", service: "SEO", name: "Dr. Neha Gupta", role: "Founder, Dental Clinic", avatar: "/images/team4-avatar.webp" },
  { quote: "Our Google Ads account was wasting money. Entec Media restructured it and our cost per enquiry dropped significantly.", service: "Google Ads", name: "Vikram Bansal", role: "Owner, Interior Design Studio", avatar: "/images/team3-avatar.webp" },
  { quote: "They built our WooCommerce store with smooth checkout and payment integration. Online orders have grown steadily ever since.", service: "E-commerce", name: "Ankit Jindal", role: "CEO, Home Decor E-Commerce Store", avatar: "/images/team4-avatar.webp" },
  { quote: "The dashboard UI they designed for our SaaS product made onboarding so much simpler for our customers.", service: "UI/UX Design", name: "Rahul Verma", role: "Product Head, B2B SaaS Company", avatar: "/images/team2-avatar.webp" },
  { quote: "Social media creatives, reels and ad campaigns — all handled on time and always on-brand. Highly recommended.", service: "Social Media", name: "Jasleen Kaur", role: "Marketing Manager, Education Institute", avatar: "/images/team1-avatar.webp" },
];
