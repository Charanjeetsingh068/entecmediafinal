"use client";

import { useState } from "react";
import Link from "next/link";
import { servicesList } from "@/lib/servicesData";
import { siteConfig } from "@/lib/siteConfig";
import { sendForm } from "@/lib/sendForm";

const budgetOptions = [
  "Under ₹25,000",
  "₹25,000 – ₹75,000",
  "₹75,000 – ₹2,00,000",
  "₹2,00,000 – ₹5,00,000",
  "₹5,00,000+",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  services: [] as string[],
  budget: "",
  details: "",
  company_fax: "",
};

type Status = "idle" | "sending" | "success" | "error";

interface EnquiryFormProps {
  /** Identifies which page the enquiry came from */
  source: string;
  /** Pre-selects a service, e.g. on a service detail page */
  defaultService?: string;
}

export default function EnquiryForm({ source, defaultService }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    ...emptyForm,
    services: defaultService ? [defaultService] : [],
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const result = await sendForm("enquiry", { ...formData, source });
    setStatus(result.success ? "success" : "error");
    setMessage(result.message);
    if (result.success) {
      setFormData({ ...emptyForm, services: defaultService ? [defaultService] : [] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="work-contact-form">
      {/* Honeypot field for spam bots */}
      <input
        type="text"
        name="company_fax"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="form-honeypot"
        value={formData.company_fax}
        onChange={(e) => setFormData({ ...formData, company_fax: e.target.value })}
      />

      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor={`${source}-name`}>Name</label>
        <input
          id={`${source}-name`}
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-input"
        />
      </div>

      {/* Email & Phone */}
      <div className="form-row-2col">
        <div className="form-group">
          <label className="form-label" htmlFor={`${source}-email`}>Email</label>
          <input
            id={`${source}-email`}
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${source}-phone`}>Phone</label>
          <input
            id={`${source}-phone`}
            type="tel"
            required
            autoComplete="tel"
            placeholder="+91 98XXX XXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      {/* Company & Website */}
      <div className="form-row-2col">
        <div className="form-group">
          <label className="form-label" htmlFor={`${source}-company`}>Company (Optional)</label>
          <input
            id={`${source}-company`}
            type="text"
            autoComplete="organization"
            placeholder="Company name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${source}-website`}>Website (Optional)</label>
          <input
            id={`${source}-website`}
            type="text"
            inputMode="url"
            placeholder="www.yourwebsite.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      {/* Services */}
      <div className="form-group">
        <span className="form-label">Services interested in:</span>
        <div className="services-checkbox-grid">
          {servicesList.map(({ title }) => {
            const isSelected = formData.services.includes(title);
            return (
              <button
                type="button"
                key={title}
                onClick={() => toggleService(title)}
                aria-pressed={isSelected}
                className={`service-checkbox-btn ${isSelected ? "selected" : ""}`}
              >
                <span className="checkbox-box" aria-hidden="true" />
                <span className="checkbox-text">{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget */}
      <div className="form-group">
        <label className="form-label" htmlFor={`${source}-budget`}>Estimated budget</label>
        <select
          id={`${source}-budget`}
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="form-select"
        >
          <option value="">Select...</option>
          {budgetOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Project details */}
      <div className="form-group">
        <label className="form-label" htmlFor={`${source}-details`}>Project details</label>
        <textarea
          id={`${source}-details`}
          rows={5}
          placeholder="Tell us about your business, goals, timeline and any specific requirements..."
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          className="form-textarea"
        />
      </div>

      {message && (
        <p className={`form-status form-status-${status}`} role="status">
          {message}
          {status === "error" && (
            <>
              {" "}Please email us at{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or call{" "}
              <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>.
            </>
          )}
        </p>
      )}

      {/* Form bottom row */}
      <div className="form-bottom-row">
        <p className="form-disclaimer">
          By submitting, I confirm I&apos;ve read and agree with the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/terms-of-service">Terms of Service</Link>.
        </p>
        <button type="submit" className="k-btn k-btn-dark form-submit-btn" disabled={status === "sending"}>
          <span className="k-btn-label">
            {status === "sending" ? "Sending..." : status === "success" ? "Message sent!" : "Send request"}
          </span>
          <span className="k-btn-icon" aria-hidden="true">
            <span className="k-btn-dot" />
            <span className="k-btn-dot" />
            <span className="k-btn-dot" />
          </span>
        </button>
      </div>
    </form>
  );
}
