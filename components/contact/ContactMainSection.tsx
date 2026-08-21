"use client";

import { useState } from "react";

export default function ContactMainSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    services: [] as string[],
    budget: "",
    details: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const availableServices = [
    "Website Designing",
    "Website Development",
    "UI/UX Design",
    "Graphic Design",
    "UI/UX Development",
    "WordPress Development",
    "React.js Development",
    "Website SEO",
    "Google Ads",
    "Meta Ads",
  ];

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="contact-main-section">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ CONTACT US</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Let&apos;s start a project <br />
              <span className="highlight-focus">together</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Have a project in mind, need a quote, or want to discuss digital growth? Reach out directly or fill out the form below.
            </p>
          </div>
        </div>

        {/* 2-Column Main Contact Layout */}
        <div className="contact-page-layout">
          {/* Left Column: Phone, Email, Address, Socials, Google Map */}
          <div className="contact-info-left">
            {/* Phone Card */}
            <div className="contact-detail-card">
              <div className="contact-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="contact-card-label">PHONE</span>
                <a href="tel:+919876543210" className="contact-card-value">+91 98765 43210</a>
              </div>
            </div>

            {/* Email Card */}
            <div className="contact-detail-card">
              <div className="contact-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="contact-card-label">EMAIL</span>
                <a href="mailto:hello@entecmedia.com" className="contact-card-value">hello@entecmedia.com</a>
              </div>
            </div>

            {/* Address Card */}
            <div className="contact-detail-card">
              <div className="contact-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="contact-card-label">ADDRESS</span>
                <p className="contact-card-value-text">Entec Media HQ, Innovation Hub, Tech City, India</p>
              </div>
            </div>

            {/* Social Media Row */}
            <div className="contact-socials-box">
              <span className="contact-socials-label">CONNECT ON SOCIAL MEDIA</span>
              <div className="contact-socials-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" title="Twitter / X">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="contact-social-btn" title="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#ffffff"/></svg>
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="contact-map-wrapper">
              <iframe
                title="Entec Media Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4746450654714!2d77.2090212!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="contact-map-iframe"
              />
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="contact-form-right">
            <form onSubmit={handleSubmit} className="work-contact-form">
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Email & Phone */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@framer.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="form-group">
                <label className="form-label">Company (Optional)</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Website */}
              <div className="form-group">
                <label className="form-label">Website (Optional)</label>
                <input
                  type="url"
                  placeholder="https://www.yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Services Checkboxes Grid */}
              <div className="form-group">
                <label className="form-label">Services Interested in:</label>
                <div className="services-checkbox-grid">
                  {availableServices.map((service) => {
                    const isSelected = formData.services.includes(service);
                    return (
                      <button
                        type="button"
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`service-checkbox-btn ${isSelected ? "selected" : ""}`}
                      >
                        <span className="checkbox-box">{isSelected ? "✓" : ""}</span>
                        <span className="checkbox-text">{service}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Dropdown */}
              <div className="form-group">
                <label className="form-label">Estimated budget</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>

              {/* Project Details */}
              <div className="form-group">
                <label className="form-label">Project details</label>
                <textarea
                  rows={5}
                  placeholder="Provide a brief description of your project, goals, and any specific requirements..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* Form Bottom Row */}
              <div className="form-bottom-row">
                <p className="form-disclaimer">
                  By submitting, I confirm I&apos;ve read and agree with <a href="#privacy">Privacy</a> and <a href="#cookies">Cookie Policies</a>.
                </p>
                <button type="submit" className="form-submit-btn">
                  {submitted ? "Message Sent!" : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
