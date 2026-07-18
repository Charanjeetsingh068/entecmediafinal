"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-brand-section">
          <Link href="/" className="footer-logo">
            <span className="logo-text">Entec<span className="logo-accent">Media</span></span>
          </Link>
          <p className="footer-description">
            Crafting next-generation digital experiences, high-impact visuals, and premium digital solutions that empower brands to dominate their space.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Twitter">
              <span>𝕏</span>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <span>in</span>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <span>ig</span>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <span>yt</span>
            </a>
          </div>
        </div>

        <div className="footer-links-section">
          <h3 className="footer-section-title">Navigation</h3>
          <ul className="footer-links-list">
            <li>
              <Link href="/" className="footer-link">Home</Link>
            </li>
            <li>
              <Link href="/about" className="footer-link">About Us</Link>
            </li>
            <li>
              <a href="#services" className="footer-link">Services</a>
            </li>
            <li>
              <a href="#contact" className="footer-link">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact-section">
          <h3 className="footer-section-title">Contact Us</h3>
          <ul className="footer-contact-list">
            <li>
              <span className="contact-icon">📍</span>
              <span className="contact-text">123 Media Boulevard, Suite 500, New York, NY 10001</span>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <a href="mailto:hello@entecmedia.com" className="contact-link">hello@entecmedia.com</a>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+15550199" className="contact-link">+1 (555) 0199</a>
            </li>
          </ul>
        </div>

        <div className="footer-newsletter-section">
          <h3 className="footer-section-title">Newsletter</h3>
          <p className="newsletter-text">Subscribe to receive the latest updates, digital insights, and case studies.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input" 
              required 
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-wrapper">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Entec Media. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <a href="#" className="legal-link">Privacy Policy</a>
            <a href="#" className="legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
