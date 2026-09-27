"use client";

import Link from "next/link";
import Image from "next/image";
import whiteLogoImg from "@/public/images/whitelogo.svg";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    const startPosition = window.scrollY || document.documentElement.scrollTop;
    if (startPosition === 0) return;

    const duration = 800;
    let startTime: number | null = null;
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      window.scrollTo(0, startPosition * (1 - easeInOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(animateScroll);
    };
    requestAnimationFrame(animateScroll);
  };

  return (
    <>
      <footer className="kudos-footer-container" data-theme="dark">
        {/* Giant watermark */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/entec-wordmark-light.svg" alt="" aria-hidden="true" className="k-footer-watermark" />

        <div className="container kudos-footer-content">
          <div className="kudos-footer-grid">
            {/* Column 1: Brand statement + contact */}
            <div className="kudos-left-col">
              <div className="kudos-hero-block">
                <Link href="/" className="kudos-footer-logo-wrapper" aria-label="Entec Media home">
                  <Image src={whiteLogoImg} alt="Entec Media" className="kudos-footer-logo" height={52} />
                </Link>
                <p className="kudos-quote-text">
                  We <strong>design</strong>, <strong>develop</strong> and <strong>market</strong> digital
                  experiences that help businesses <strong>grow online</strong>.
                </p>
                <p className="k-mono-small kudos-footer-meta">
                  IT &amp; Digital Marketing Company
                  <br />
                  Based in Zirakpur, Punjab, India
                </p>
              </div>

              <div className="kudos-contact-block">
                <a href={`mailto:${siteConfig.contact.email}`} className="kudos-email-link">
                  {siteConfig.contact.email}
                </a>
                <a href={siteConfig.contact.phoneHref} className="kudos-phone-link">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>

            {/* Column 2: Main navigation */}
            <div className="kudos-mid-col">
              <nav className="kudos-main-nav" aria-label="Footer">
                {siteConfig.navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="kudos-nav-item">
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="kudos-sub-links-grid">
                <div className="kudos-link-group">
                  <span className="kudos-link-section-title">Social media</span>
                  <ul className="kudos-sub-links-list">
                    {siteConfig.socialLinks.map((link) => (
                      <li key={link.label}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="kudos-sub-link">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 3: Address + legal */}
            <div className="kudos-right-col">
              <div className="kudos-address-block">
                <span className="kudos-link-section-title">Location / Address</span>
                <p className="kudos-address-text">
                  {siteConfig.contact.addressLines[0]}
                  <br />
                  {siteConfig.contact.addressLines[1]}
                </p>
                <p className="kudos-address-text kudos-hours">{siteConfig.contact.hours}</p>
              </div>

              <div className="kudos-link-group">
                <span className="kudos-link-section-title">Legal</span>
                <ul className="kudos-sub-links-list">
                  {siteConfig.legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="kudos-sub-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="kudos-bottom-bar">
            <span className="k-mono-small">© {new Date().getFullYear()} Entec Media. All rights reserved.</span>
            <button onClick={scrollToTop} className="kudos-scroll-top-btn" aria-label="Scroll back to top">
              <span>Back to top</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
