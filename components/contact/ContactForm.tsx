"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import ContactIcon, { type ContactIconName } from "@/components/contact/ContactIcon";
import PhoneField, { findCountry, useCountry } from "@/components/contact/PhoneField";
import { sendForm } from "@/lib/sendForm";
import { siteConfig } from "@/lib/siteConfig";
import type { ContactPageContent } from "@/lib/contactContent";

interface ContactFormProps {
  content: ContactPageContent["form"];
  /** Service names offered as chips */
  services: string[];
}

type Status = "idle" | "sending" | "success" | "error";

const empty = {
  name: "",
  email: "",
  phone: "",
  phone_country: "",
  company: "",
  services: [] as string[],
  heard_from: "",
  details: "",
  company_fax: "",
};

/**
 * Contact form card. Floating-label fields with icons, a phone field with a searchable country-code
 * picker (every country, flags) (the label rises and a blue line draws under the
 * field on focus), a progress bar that fills as the visitor completes the form, service chips
 * (multi-select, a tick pops in), a "how did you hear about us" select and a message box with a
 * character counter. Sending shows a spinner in the
 * button; on success the form is replaced by an animated tick and a thank-you note.
 * Posts to the PHP mail handler as an "enquiry" (lib/sendForm.ts). No budget field by design.
 */
export default function ContactForm({ content: f, services }: ContactFormProps) {
  const [data, setData] = useState(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = (key: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));
  const toggleService = (s: string) =>
    setData((d) => ({ ...d, services: d.services.includes(s) ? d.services.filter((x) => x !== s) : [...d.services, s] }));

  const steps = [data.name, data.email, data.phone, data.services.length ? "y" : "", data.details];
  const progress = Math.round((steps.filter((v) => v.trim()).length / steps.length) * 100);

  const country = findCountry(useCountry(data.phone_country));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    // Everything filled in, the phone with its country code, plus where and how the form was sent
    // (the server adds the IP address and its location)
    let timezone = "";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      /* not available */
    }
    const result = await sendForm("enquiry", {
      ...data,
      phone: data.phone.trim() ? `${country.dial} ${data.phone.trim()}` : "",
      phone_country: `${country.name} (${country.dial})`,
      source: "contact-page",
      page_url: window.location.href,
      referrer: document.referrer,
      timezone,
      language: navigator.language,
      screen: `${window.screen.width}×${window.screen.height}`,
    });
    if (result.success) {
      setStatus("success");
      setData(empty);
    } else {
      setStatus("error");
      setError(result.message || f.errorText);
    }
  };

  const [privacyBefore, privacyAfter = ""] = f.privacyText.split("{privacy}");

  if (status === "success") {
    return (
      <div className="cf-card cf-done" role="status">
          <svg className="cf-done-tick" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" />
          <path d="M20 33l8 8 16-17" />
        </svg>
        <h3>{f.successTitle}</h3>
        <p>{f.successText}</p>
        <button type="button" className="cf-again" onClick={() => setStatus("idle")}>
          {f.againLabel}
        </button>
      </div>
    );
  }

  return (
    <form className="cf-card" onSubmit={submit} id="contact-form-card">
      {/* Honeypot for spam bots */}
      <input
        type="text"
        name="company_fax"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="form-honeypot"
        value={data.company_fax}
        onChange={set("company_fax")}
      />

      <div className="cf-head">
        <span className="cf-label-top">
          <span className="k-accent-dot" aria-hidden="true" /> {f.label}
        </span>
        <h3 className="cf-title">{f.title}</h3>
        <p className="cf-desc">{f.desc}</p>
        <div className="cf-progress" aria-label={`${progress}% ${f.progressLabel}`}>
          <span className="cf-progress-bar">
            <span style={{ transform: `scaleX(${progress / 100})` }} />
          </span>
          <b>
            {progress}% <small>{f.progressLabel}</small>
          </b>
        </div>
      </div>

      <div className="cf-grid">
        <Field icon="user" label={f.nameLabel} placeholder={f.namePlaceholder} value={data.name} onChange={set("name")} required autoComplete="name" />
        <Field icon="mail" type="email" label={f.emailLabel} placeholder={f.emailPlaceholder} value={data.email} onChange={set("email")} required autoComplete="email" />
        <PhoneField
          label={f.phoneLabel}
          placeholder={f.phonePlaceholder}
          searchPlaceholder={f.countrySearchPlaceholder}
          value={data.phone}
          onChange={(phone) => setData((d) => ({ ...d, phone }))}
          country={data.phone_country}
          onCountryChange={(iso) => setData((d) => ({ ...d, phone_country: iso }))}
          required
        />
        <Field icon="building" label={f.companyLabel} placeholder={f.companyPlaceholder} value={data.company} onChange={set("company")} autoComplete="organization" />
      </div>

      <fieldset className="cf-group">
        <legend>{f.servicesLabel}</legend>
        <div className="cf-chips">
          {services.map((s) => {
            const on = data.services.includes(s);
            return (
              <button key={s} type="button" className={`cf-chip ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => toggleService(s)}>
                <span className="cf-chip-tick" aria-hidden="true">
                  <ContactIcon name="check" />
                </span>
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="cf-select">
        <span className="cf-select-label">{f.sourceLabel}</span>
        <span className="cf-select-box">
          <select value={data.heard_from} onChange={set("heard_from")}>
            <option value="">{f.sourcePlaceholder}</option>
            {f.sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </label>

      <label className="cf-field cf-field-area">
        <span className="cf-field-icon">
          <ContactIcon name="chat" />
        </span>
        <textarea
          rows={5}
          required
          maxLength={f.messageMax}
          placeholder={f.messagePlaceholder}
          value={data.details}
          onChange={set("details")}
        />
        <span className="cf-field-label">{f.messageLabel}</span>
        <span className="cf-field-line" aria-hidden="true" />
        <span className="cf-count" aria-hidden="true">
          {data.details.length} / {f.messageMax}
        </span>
      </label>

      {status === "error" && (
        <p className="cf-error" role="alert">
          {error} Please email <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or call{" "}
          <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a>.
        </p>
      )}

      <div className="cf-foot">
        <p className="cf-privacy">
          {privacyBefore}
          <Link href="/privacy-policy">Privacy Policy</Link>
          {privacyAfter}
        </p>
        <button type="submit" className={`cf-submit ${status === "sending" ? "is-sending" : ""}`} disabled={status === "sending"}>
          <span>{status === "sending" ? f.sendingLabel : f.submitLabel}</span>
          <span className="cf-submit-icon" aria-hidden="true">
            {status === "sending" ? <span className="cf-spinner" /> : <ContactIcon name="send" />}
          </span>
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  icon: ContactIconName;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

/** Input with an icon and a label that floats up on focus / when filled */
export function Field({ icon, label, placeholder, value, onChange, type = "text", required, autoComplete }: FieldProps) {
  return (
    <label className="cf-field">
      <span className="cf-field-icon">
        <ContactIcon name={icon} />
      </span>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} autoComplete={autoComplete} />
      <span className="cf-field-label">
        {label}
        {required && <i aria-hidden="true"> *</i>}
      </span>
      <span className="cf-field-line" aria-hidden="true" />
    </label>
  );
}

