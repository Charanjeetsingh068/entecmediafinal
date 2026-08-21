"use client";

import { useState } from "react";
import Image from "next/image";

export default function AboutCTA() {
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
    "Graphic Design",
    "E-commerce Solutions",
    "Mobile App Design",
    "Digital Marketing",
    "Content Creation",
    "Social Media Management",
    "Video Production",
    "Consulting Services",
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
    <section className="about-work-section" id="contact">
      <div className="container">
        {/* Top Header Layout */}
        <div className="why-top-layout about-section-top-mb60">
          <div className="why-col-left">
            <span className="why-section-label">+ WORK WITH US</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              Let&apos;s create<br />
              with purpose
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Share your goals, timeline, and challenges, we&apos;ll respond with clarity and next steps.
            </p>
          </div>
        </div>

        {/* Two-Column Asymmetrical Grid Layout with Sticky Left */}
        <div className="work-form-layout">
          {/* Sticky Left Column */}
          <div className="work-sticky-left">
            <h3 className="work-left-title">
              Ambitious ideas deserve <strong>thoughtful execution</strong>. Start the conversation and let&apos;s define what success looks like.
            </h3>

            <div className="work-left-brand-row">
              <span className="work-left-brand-name">Team ENTEC MEDIA</span>
              <span className="work-left-year">2026</span>
            </div>

            <div className="work-left-trust-box">
              <div className="work-avatars-group">
                <Image src="/images/founder1.png" alt="Avatar" width={32} height={32} className="work-avatar-img" />
                <Image src="/images/team1.png" alt="Avatar" width={32} height={32} className="work-avatar-img" />
                <Image src="/images/team2.png" alt="Avatar" width={32} height={32} className="work-avatar-img" />
                <Image src="/images/team3.png" alt="Avatar" width={32} height={32} className="work-avatar-img" />
              </div>
              <div className="work-rating-info">
                <span className="work-rating-stars">★★★★★ 4.9/5</span>
                <span className="work-rating-label">TRUSTED BY TOP BRANDS</span>
              </div>
            </div>
          </div>

          {/* Scrollable Right Form Column */}
          <div className="work-form-right">
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
                    placeholder="(+1) 999 888 777"
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
