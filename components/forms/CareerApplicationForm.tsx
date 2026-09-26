"use client";

import { useState } from "react";
import Link from "next/link";
import { sendForm } from "@/lib/sendForm";
import { siteConfig } from "@/lib/siteConfig";

interface CareerApplicationFormProps {
  jobTitle: string;
  jobTypes: string[];
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  job_type: "",
  experience: "",
  portfolio: "",
  linkedin: "",
  resume: "",
  letter: "",
  company_fax: "",
};

type Status = "idle" | "sending" | "success" | "error";

/** Job application form on /careers/[slug] — emails the application to the Entec inbox. */
export default function CareerApplicationForm({ jobTitle, jobTypes }: CareerApplicationFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const update = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const result = await sendForm("career", { ...form, job_title: jobTitle, source: `careers/${jobTitle}` });
    setStatus(result.success ? "success" : "error");
    setMessage(result.message);
    if (result.success) setForm(emptyForm);
  };

  return (
    <form className="work-contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="form-honeypot"
        value={form.company_fax}
        onChange={update("company_fax")}
      />

      <div className="form-group">
        <label className="form-label" htmlFor="apply-name">Name</label>
        <input id="apply-name" className="form-input" required autoComplete="name" placeholder="Your full name" value={form.name} onChange={update("name")} />
      </div>

      <div className="form-row-2col">
        <div className="form-group">
          <label className="form-label" htmlFor="apply-email">Email</label>
          <input id="apply-email" type="email" className="form-input" required autoComplete="email" placeholder="you@email.com" value={form.email} onChange={update("email")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="apply-phone">Phone</label>
          <input id="apply-phone" type="tel" className="form-input" required autoComplete="tel" placeholder="+91 98XXX XXXXX" value={form.phone} onChange={update("phone")} />
        </div>
      </div>

      <div className="form-row-2col">
        <div className="form-group">
          <label className="form-label" htmlFor="apply-type">Choose one job type: {jobTypes.join(", ")}</label>
          <select id="apply-type" className="form-select" required value={form.job_type} onChange={update("job_type")}>
            <option value="">Select...</option>
            {jobTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="apply-exp">Total experience</label>
          <select id="apply-exp" className="form-select" required value={form.experience} onChange={update("experience")}>
            <option value="">Select...</option>
            {["Fresher", "Less than 1 year", "1–2 years", "2–4 years", "4–6 years", "6+ years"].map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="apply-portfolio">Portfolio / personal website (Optional)</label>
        <input id="apply-portfolio" className="form-input" inputMode="url" placeholder="https://www.yourwebsite.com" value={form.portfolio} onChange={update("portfolio")} />
      </div>

      <div className="form-row-2col">
        <div className="form-group">
          <label className="form-label" htmlFor="apply-linkedin">LinkedIn profile (Optional)</label>
          <input id="apply-linkedin" className="form-input" inputMode="url" placeholder="Your LinkedIn profile URL" value={form.linkedin} onChange={update("linkedin")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="apply-resume">Resume link (Google Drive / Dropbox)</label>
          <input id="apply-resume" className="form-input" inputMode="url" required placeholder="Shareable link to your CV" value={form.resume} onChange={update("resume")} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="apply-letter">Intention letter</label>
        <textarea
          id="apply-letter"
          className="form-textarea"
          rows={6}
          required
          placeholder="Tell us why you'd be a great fit for this role..."
          value={form.letter}
          onChange={update("letter")}
        />
      </div>

      {message && (
        <p className={`form-status form-status-${status}`} role="status">
          {message}
          {status === "error" && (
            <>
              {" "}You can also email your CV to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </>
          )}
        </p>
      )}

      <div className="form-bottom-row">
        <p className="form-disclaimer">
          By submitting, I confirm I&apos;ve read and agree with the <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/terms-of-service">Terms of Service</Link>.
        </p>
        <button type="submit" className="k-btn k-btn-dark form-submit-btn" disabled={status === "sending"}>
          <span className="k-btn-label">
            {status === "sending" ? "Sending..." : status === "success" ? "Application sent!" : "Send application"}
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
