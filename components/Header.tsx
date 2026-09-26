"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import whiteLogoImg from "@/public/images/whitelogo.svg";
import darkLogoImg from "@/public/images/darklogo.svg";
import hamburgerMenuImg from "@/public/images/hamburger-menu.svg";
import { siteConfig } from "@/lib/siteConfig";

// ==========================================
// NAVIGATION & BRAND CONFIGURATION
// Edit any text, link, or location here to update both desktop & mobile views dynamically.
// ==========================================
const NAVIGATION_CONFIG = {
  brand: {
    name: "Entec",
    tagline: "We design, develop <br />and market <strong>digital products</strong> <br />that <span class=\"blue-highlight\">drive growth</span>.",
    agencyType: "",
    location: "",
  },
  contact: {
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    phoneHref: siteConfig.contact.phoneHref,
  },
  menuLinks: siteConfig.navLinks,
  socials: siteConfig.socialLinks,
  legals: siteConfig.legalLinks,
  footer: {
    copyright: "© 2026 Entec Media. All rights reserved.",
    credit: "",
  }
};

function getSocialIcon(label: string) {
  switch (label.toLowerCase()) {
    case "facebook":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case "linkedin":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#insta-grad)" strokeWidth="2">
          <defs>
            <linearGradient id="insta-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    case "youtube":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return null;
  }
}

function getLegalIcon(label: string) {
  switch (label.toLowerCase()) {
    case "terms of service":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    case "privacy policy":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      );
    case "user data deletion":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>
      );
    case "cookie policy":
    case "cookies policy":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      );
    case "cookie settings":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
      );
    default:
      return null;
  }
}

export default function Header() {
  const pathname = usePathname();
  const [scrollState, setScrollState] = useState({
    visible: true,
    sticky: false,
    theme: "dark", // "dark" | "light"
    overBanner: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle body scroll locking when menu is toggled
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open-scroll-lock");
    } else {
      document.body.classList.remove("menu-open-scroll-lock");
    }
    return () => {
      document.body.classList.remove("menu-open-scroll-lock");
    };
  }, [menuOpen]);

  // Close menu overlay instantly on route navigation (state adjusted during render;
  // the scroll-lock effect above removes the body class once menuOpen flips to false)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    let ticking = false;
    let lastScrollY = window.scrollY;
    let hidden = false;

    const updateHeaderTheme = () => {
      const currentScrollY = window.scrollY;

      // 1. Determine stickiness (sticky after scrolling past 90px)
      const isSticky = currentScrollY > 90;

      // 2. Kudos behaviour: hide while scrolling down, reveal on scroll up.
      //    A small threshold stops tiny (smooth-scroll) direction changes from making it flicker.
      const delta = currentScrollY - lastScrollY;
      if (!isSticky) hidden = false;
      else if (delta > 6) hidden = true;
      else if (delta < -6) hidden = false;
      if (Math.abs(delta) > 6 || !isSticky) lastScrollY = currentScrollY;
      const isVisible = !hidden;

      // 3. Theme of whatever is actually painted under the header's centre line.
      //    elementsFromPoint respects stacking, so sticky/pinned sections underneath are ignored.
      let theme = pathname === "/" ? "dark" : "light";
      const headerEl = document.querySelector<HTMLElement>(".header-main");
      const probeY = Math.max(40, (headerEl?.offsetHeight ?? 88) - 8); // section under the header's bottom edge
      const stack = document.elementsFromPoint(Math.min(24, window.innerWidth * 0.02), probeY);
      for (const el of stack) {
        if (el.closest(".header-main, .nav-overlay, .k-guides")) continue;
        let node: HTMLElement | null = el as HTMLElement;
        let resolved: string | null = null;
        while (node && node !== document.body) {
          const explicit = node.getAttribute("data-theme");
          if (explicit === "light" || explicit === "dark") {
            resolved = explicit;
            break;
          }
          const rgb = window.getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
          if (rgb && rgb.length >= 3 && (rgb[3] === undefined || parseFloat(rgb[3]) > 0.1)) {
            const brightness = 0.299 * +rgb[0] + 0.587 * +rgb[1] + 0.114 * +rgb[2];
            resolved = brightness > 160 ? "light" : "dark";
            break;
          }
          node = node.parentElement;
        }
        if (resolved) {
          theme = resolved;
          break;
        }
      }

      // Transparent only while the header sits over the home banner (the fixed hero video)
      const banner = document.querySelector(".banner-section");
      const overBanner =
        pathname === "/" && !!banner && currentScrollY < window.innerHeight - 88 &&
        !stack.some((el) => el.closest(".main-content-wrapper"));

      // Only re-render when something actually changed (this runs on every scroll frame)
      setScrollState((prev) =>
        prev.visible === isVisible && prev.sticky === isSticky && prev.theme === theme && prev.overBanner === overBanner
          ? prev
          : { visible: isVisible, sticky: isSticky, theme, overBanner }
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderTheme);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateHeaderTheme(); // Run once initially

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const isLightMode = scrollState.theme === "light";

  const headerClass = [
    "header-main",
    pathname === "/" ? "header-home" : "",
    scrollState.sticky ? "header-sticky" : "header-normal",
    !scrollState.visible && scrollState.sticky ? "header-hidden" : "",
    isLightMode ? "header-theme-light" : "header-theme-dark",
    scrollState.overBanner ? "header-over-banner" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <header className={headerClass}>
        <div className="container header-wrapper">
          <Link href="/" className="logo-link">
            <Image 
              src={isLightMode ? darkLogoImg : whiteLogoImg} 
              alt="Entec Media Logo" 
              className="logo-img" 
              priority 
            />
          </Link>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open Menu">
            <Image src={hamburgerMenuImg} alt="Menu" className="menu-icon-img" />
          </button>
        </div>
      </header>

      {/* Full Page Navigation Overlay */}
      <div className={`nav-overlay ${menuOpen ? "nav-overlay-open" : ""}`} data-lenis-prevent>
        <div className="container nav-overlay-wrapper">
          {/* Top Row Header */}
          <div className="nav-overlay-header">
            <Link href="/" className="logo-link" onClick={() => setMenuOpen(false)}>
              <Image src={darkLogoImg} alt="Entec Media Logo" className="logo-img-dark" />
            </Link>
            <button className="nav-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close Menu">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Grid Layout Content */}
          <div className="nav-overlay-grid">
            {/* Column 1: Brand & Contact Info */}
            <div className="nav-col-left">
              <p 
                className="nav-brand-tagline" 
                dangerouslySetInnerHTML={{ __html: NAVIGATION_CONFIG.brand.tagline }}
              />
              
              {/* Short Blue horizontal line */}
              <div className="nav-blue-divider"></div>
              
              {/* Services Tags */}
              <div className="nav-services-tags">
                <p>Website Design <span className="tag-dot">•</span> Development</p>
                <p>Mobile Apps <span className="tag-dot">•</span> UI/UX Design</p>
                <p>SEO <span className="tag-dot">•</span> Google &amp; Meta Ads</p>
              </div>

              <div className="nav-brand-meta">
                {NAVIGATION_CONFIG.brand.agencyType && <p>{NAVIGATION_CONFIG.brand.agencyType}</p>}
                {NAVIGATION_CONFIG.brand.location && <p>{NAVIGATION_CONFIG.brand.location}</p>}
              </div>

              <div className="nav-contact-info">
                <a href={`mailto:${NAVIGATION_CONFIG.contact.email}`} className="nav-email-link">
                  {NAVIGATION_CONFIG.contact.email}
                </a>
                <a href={NAVIGATION_CONFIG.contact.phoneHref} className="nav-phone-link">
                  {NAVIGATION_CONFIG.contact.phone}
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="nav-col-center">
              <ul className="nav-main-links">
                {NAVIGATION_CONFIG.menuLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="nav-main-link-item"
                    >
                      <span className="nav-link-text">{link.label}</span>
                      <span className="nav-link-arrow">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal & Social Media Blocks */}
            <div className="nav-col-right">
              {/* Legal Block */}
              <div className="nav-sub-list">
                <span className="nav-sub-label">Legal</span>
                <div className="nav-sub-divider"></div>
                <ul className="nav-icon-links">
                  {NAVIGATION_CONFIG.legals.map((link, idx) => (
                    <li key={idx}>
                      <Link href={link.href} onClick={() => setMenuOpen(false)}>
                        <div className="nav-icon-box">
                          {getLegalIcon(link.label)}
                        </div>
                        <span className="nav-link-label">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media Block */}
              <div className="nav-sub-list">
                <span className="nav-sub-label">Social media</span>
                <div className="nav-sub-divider"></div>
                <ul className="nav-icon-links">
                  {NAVIGATION_CONFIG.socials.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        <div className="nav-icon-box">
                          {getSocialIcon(link.label)}
                        </div>
                        <span className="nav-link-label">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>



          {/* Giant Watermark Background Image */}
          <div className="nav-watermark-wrapper">
            <img 
              src="/images/ENTEC.png" 
              alt="ENTEC Watermark" 
              className="nav-watermark-img" 
            />
          </div>
        </div>
      </div>
    </>
  );
}
