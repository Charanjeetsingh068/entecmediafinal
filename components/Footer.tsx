"use client";

import Link from "next/link";
import Image from "next/image";
import darkLogoImg from "@/public/images/darklogo.svg";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-card">
          {/* Header section inside the card */}
          <div className="footer-card-header">
            <div className="footer-header-text">
              <h2 className="footer-header-title">Stay in the <span className="text-gradient">loop</span></h2>
              <p className="footer-header-subtitle">Get insights delivered straight to your inbox</p>
            </div>
            <div className="footer-header-action">
              <Link href="#services" className="all-case-studies-button footer-view-services-btn">
                <span>View Services</span>
                <div className="cta-dots-vertical">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </Link>
            </div>
          </div>

          {/* Grid content section */}
          <div className="footer-card-grid">
            {/* Column 1: Services */}
            <div className="footer-grid-col">
              <h3 className="footer-col-title">Services</h3>
              <ul className="footer-col-links">
                <li><Link href="#services">Brand Identity</Link></li>
                <li><Link href="#services">Website Design</Link></li>
                <li><Link href="#services">Digital Products</Link></li>
                <li><Link href="#services">Physical Product Design</Link></li>
                <li><Link href="#services">Marketing Campaigns</Link></li>
                <li><Link href="#services">Motion & Content</Link></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="footer-grid-col">
              <h3 className="footer-col-title">Resources</h3>
              <ul className="footer-col-links">
                <li><Link href="#articles">Case Studies</Link></li>
                <li><Link href="#articles">Articles</Link></li>
                <li><Link href="#about">Design Process</Link></li>
                <li><Link href="#">Documentation</Link></li>
                <li><Link href="#">Support & FAQ</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="footer-grid-col">
              <h3 className="footer-col-title">Company</h3>
              <ul className="footer-col-links">
                <li><Link href="#about">About Us</Link></li>
                <li><Link href="#about">Our Team</Link></li>
                <li><Link href="#careers">Careers</Link></li>
                <li><Link href="#articles">Blogs</Link></li>
                <li><Link href="#contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="footer-grid-col">
              <h3 className="footer-col-title">Legal</h3>
              <ul className="footer-col-links">
                <li><Link href="#">Privacy Policy</Link></li>
                <li><Link href="#">Terms & Conditions</Link></li>
                <li><Link href="#">Cookie Policy</Link></li>
                <li className="footer-phone-num">
                  <a href="tel:+919812388888" className="phone-link">
                    +91-9812388888
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Locations */}
            <div className="footer-grid-col footer-col-locations">
              <h3 className="footer-col-title">Locations</h3>
              <div className="locations-wrapper">
                <div className="location-item">
                  <p className="location-address">
                    #123,First Floor, Complex street,Zirakpur
                  </p>
                </div>
              </div>

              {/* Connect with us block */}
              <div className="connect-us-block">
                <span className="connect-title">Connect With Us</span>
                <div className="footer-social-icons">
                  <a href="#" className="footer-social-icon-btn" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="footer-social-icon-btn" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="footer-social-icon-btn" aria-label="YouTube">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48L15.45 11.75z"></path>
                    </svg>
                  </a>
                  <a href="#" className="footer-social-icon-btn" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section with separator */}
          <div className="footer-card-bottom">
            <div className="footer-logo-wrapper">
              <Link href="/">
                <Image src={darkLogoImg} alt="Entec Media Logo" className="footer-logo-image" />
              </Link>
            </div>
            <p className="footer-copyright-text">
              &copy; {new Date().getFullYear()} Entec Media. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
