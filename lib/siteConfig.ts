/**
 * Single source of truth for Entec Media company details, navigation and links.
 * Update contact info or social profile URLs here and every page picks it up.
 */

export const siteConfig = {
  name: "Entec Media",
  url: process.env.SITE_URL || "https://entecmedia.com",
  tagline: "IT & Digital Marketing Company",
  description:
    "Entec Media is an IT and digital marketing company offering website design & development, mobile app design & development, UI/UX, graphic design, SEO, Google Ads and Meta Ads.",
  contact: {
    email: "info@entecmedia.com",
    phone: "+91-9996550841",
    phoneHref: "tel:+919996550841",
    whatsappHref: "https://wa.me/919996550841",
    addressLines: ["#123, First Floor, Complex Street,", "Zirakpur, Punjab, India"],
    mapQuery: "Zirakpur, Punjab, India",
    hours: "Monday – Saturday, 10:00 AM – 7:00 PM IST",
  },
  navLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Our Projects", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "User Data Deletion", href: "/data-deletion" },
  ],
  // TODO: replace with Entec Media's actual profile URLs.
  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
  ],
};

/**
 * Every website form (enquiry, job application, newsletter) posts JSON here.
 * The PHP handler lives in public/api/send-mail.php and is copied to out/api/ on build.
 * Recipient address and SMTP settings are configured in public/api/mail-config.php.
 */
export const MAIL_ENDPOINT = process.env.NEXT_PUBLIC_MAIL_ENDPOINT || "/api/send-mail.php";

export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  siteConfig.contact.mapQuery
)}&z=14&output=embed`;
