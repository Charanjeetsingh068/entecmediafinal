"use client";

import Link from "next/link";
import Image from "next/image";
import darkLogoImg from "@/public/images/darklogo.svg";

export default function Footer() {
  const scrollToTop = () => {
    const startPosition =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;

    if (startPosition === 0) return;

    const duration = 800; // 800ms duration for butter smooth scrolling
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition * (1 - easeProgress));

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, 0);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <footer className="kudos-footer-container">
      <div className="container kudos-footer-content">
        {/* Main Footer Grid Layout */}
        <div className="kudos-footer-grid">
          {/* Left Column: Logo, Tagline, Large Email & Phone */}
          <div className="kudos-left-col">
            <div className="kudos-hero-block">
              {/* Entec Media Logo above 'We choose' quote */}
              <div className="kudos-footer-logo-wrapper">
                <Link href="/">
                  <Image
                    src={darkLogoImg}
                    alt="Entec Media Logo"
                    className="kudos-footer-logo"
                    height={82}
                    priority
                  />
                </Link>
              </div>

              <p className="kudos-quote-text">
                We choose <strong>clarity over clutter</strong> and{" "}
                <strong>depth over decoration</strong>, because strong brands
                deserve <strong>meaningful foundations</strong>.
              </p>
            </div>

            <div className="kudos-contact-block">
              <a href="mailto:info@entecmedia.com" className="kudos-email-link">
                info@entecmedia.com
              </a>
              <a href="tel:+919812388888" className="kudos-phone-link">
                +91-9812388888
              </a>
            </div>
          </div>

          {/* Middle Column: Main Navigation Links */}
          <div className="kudos-mid-col">
            <nav className="kudos-main-nav">
              <Link href="/" className="kudos-nav-item">
                Home
              </Link>
              <Link href="/about" className="kudos-nav-item">
                About
              </Link>
              <Link href="/services" className="kudos-nav-item">
                Services
              </Link>
              <Link href="/portfolio" className="kudos-nav-item">
                Portfolio
              </Link>
              <Link href="/blog" className="kudos-nav-item">
                Blog
              </Link>
              <Link href="/contact" className="kudos-nav-item">
                Contact
              </Link>
            </nav>
          </div>

          {/* Vertical Dotted Divider */}
          <div className="kudos-vertical-divider" aria-hidden="true" />

          {/* Right Column: Address (Top), Social media & Legal (Bottom) */}
          <div className="kudos-right-col">
            {/* Top Right Address Section */}
            <div className="kudos-address-block">
              <span className="kudos-address-title">Location / Address</span>
              <p className="kudos-address-text">
                #123, First Floor, Complex Street,<br />
                Zirakpur, Punjab, India
              </p>
            </div>

            {/* Bottom Right Social & Legal Links Grid */}
            <div className="kudos-sub-links-grid">
              {/* Social media column */}
              <div className="kudos-link-group">
                <span className="kudos-link-section-title">Social media</span>
                <ul className="kudos-sub-links-list">
                  <li>
                    <a
                      href="https://framer.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kudos-sub-link"
                    >
                      Framer
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kudos-sub-link"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kudos-sub-link"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kudos-sub-link"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="#academy" className="kudos-sub-link">
                      Academy
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal column */}
              <div className="kudos-link-group">
                <span className="kudos-link-section-title">Legal</span>
                <ul className="kudos-sub-links-list">
                  <li>
                    <Link href="#terms" className="kudos-sub-link">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#privacy" className="kudos-sub-link">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#cookie-policy" className="kudos-sub-link">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#cookie-settings" className="kudos-sub-link">
                      Cookie Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="kudos-bottom-bar">
          <div className="kudos-bottom-left">
            <span>© 2026 Entec Media. All rights reserved.</span>
          </div>

          <div className="kudos-bottom-right">
            <button
              onClick={scrollToTop}
              className="kudos-scroll-top-btn"
              title="Back to top"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
