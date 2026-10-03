"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { Field } from "@/components/contact/ContactForm";
import PhoneField, { findCountry, useCountry } from "@/components/contact/PhoneField";
import ContactIcon from "@/components/contact/ContactIcon";
import CareerIcon from "@/components/careers/CareerIcon";
import CvDrop from "@/components/careers/job/CvDrop";
import { sendFormWithFiles } from "@/lib/sendForm";
import { siteConfig } from "@/lib/siteConfig";
import type { JobOpening } from "@/lib/careersData";
import type { JobPageContent } from "@/lib/careersContent";

interface JobApplyProps {
  job: JobOpening;
  content: JobPageContent["form"];
}

type Status = "idle" | "sending" | "success" | "error";

const empty = {
  name: "",
  email: "",
  phone: "",
  phone_country: "",
  city: "",
  experience: "",
  job_type: "",
  notice: "",
  salary: "",
  portfolio: "",
  linkedin: "",
  letter: "",
  company_fax: "",
};

/**
 * "Apply now" (light, id="apply"). Left: the title, tips about the CV and portfolio, and a direct email
 * link. Right: the application card (same field styles as the contact form) — name, email, phone with a
 * country-code picker, city, experience, notice period, preferred job type pills, expected salary,
 * portfolio and LinkedIn links, the CV drop zone and a "why join us" note; a progress bar fills as it is
 * completed. Sent as multipart/form-data so the CV arrives as an email attachment (lib/sendForm.ts).
 */
export default function JobApply({ job, content: f }: JobApplyProps) {
  const [data, setData] = useState(empty);
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const country = findCountry(useCountry(data.phone_country));

  const set = (key: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const steps = [data.name, data.email, data.phone, data.experience, data.city, cv ? "y" : ""];
  const progress = Math.round((steps.filter((v) => v.trim()).length / steps.length) * 100);
  const title = f.title.replace("{job}", job.general ? "a role at Entec Media" : job.title);
  const [privacyBefore, privacyAfter = ""] = f.privacyText.split("{privacy}");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cv) {
      setStatus("error");
      setError(`${f.cvLabel} is required.`);
      return;
    }
    setStatus("sending");
    setError("");
    let timezone = "";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      /* not available */
    }
    const result = await sendFormWithFiles(
      "career",
      {
        ...data,
        phone: data.phone.trim() ? `${country.dial} ${data.phone.trim()}` : "",
        phone_country: `${country.name} (${country.dial})`,
        job_title: job.title,
        source: `careers/${job.slug}`,
        page_url: window.location.href,
        referrer: document.referrer,
        timezone,
        language: navigator.language,
        screen: `${window.screen.width}×${window.screen.height}`,
      },
      { resume_file: cv },
    );
    if (result.success) {
      setStatus("success");
      setData(empty);
      setCv(null);
    } else {
      setStatus("error");
      setError(result.message || f.errorText);
    }
  };

  return (
    <section className="k-section jb-apply" id="apply" data-theme="light" aria-labelledby="apply-title">
      <div className="container jb-apply-grid">
        <div className="jb-apply-intro">
          <span className="why-section-label">
            <span className="k-accent-dot" aria-hidden="true" /> {f.label}
          </span>
          <h2 className="jb-apply-title" id="apply-title">
            {title}
          </h2>
          <p className="jb-apply-desc">{f.desc}</p>
          <ul className="jb-tips">
            {f.tips.map((t, i) => (
              <li key={t}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ul>
          <a href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`} className="jb-apply-mail">
            <ContactIcon name="mail" />
            {siteConfig.contact.email}
          </a>
        </div>

        {status === "success" ? (
          <div className="cf-card cf-done" role="status">
            <svg className="cf-done-tick" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="29" />
              <path d="M20 33l8 8 16-17" />
            </svg>
            <h3>{f.successTitle}</h3>
            <p>{f.successText}</p>
            <Link href="/careers#openings" className="cf-again">
              {f.againLabel}
            </Link>
          </div>
        ) : (
          <form className="cf-card jb-form" onSubmit={submit}>
            <input type="text" name="company_fax" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form-honeypot" value={data.company_fax} onChange={set("company_fax")} />

            <div className="cf-progress" aria-label={`${progress}% complete`}>
              <span className="cf-progress-bar">
                <span style={{ transform: `scaleX(${progress / 100})` }} />
              </span>
              <b>
                {progress}% <small>complete</small>
              </b>
            </div>

            <div className="cf-grid">
              <Field icon="user" label={f.nameLabel} placeholder="Your full name" value={data.name} onChange={set("name")} required autoComplete="name" />
              <Field icon="mail" type="email" label={f.emailLabel} placeholder="you@email.com" value={data.email} onChange={set("email")} required autoComplete="email" />
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
              <Field icon="building" label={f.cityLabel} placeholder="e.g. Mohali" value={data.city} onChange={set("city")} required autoComplete="address-level2" />
            </div>

            <div className="cf-grid">
              <label className="cf-select">
                <span className="cf-select-label">
                  {f.experienceLabel} <i className="cv-req">*</i>
                </span>
                <span className="cf-select-box">
                  <select value={data.experience} onChange={set("experience")} required>
                    <option value="">Select…</option>
                    {f.experienceOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </label>
              <label className="cf-select">
                <span className="cf-select-label">{f.noticeLabel}</span>
                <span className="cf-select-box">
                  <select value={data.notice} onChange={set("notice")}>
                    <option value="">Select…</option>
                    {f.noticeOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </label>
            </div>

            {job.types.length > 0 && (
              <fieldset className="cf-group">
                <legend>{f.typeLabel}</legend>
                <div className="cf-chips">
                  {job.types.map((t) => {
                    const on = data.job_type === t;
                    return (
                      <button key={t} type="button" className={`cf-chip ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => setData((d) => ({ ...d, job_type: on ? "" : t }))}>
                        <span className="cf-chip-tick" aria-hidden="true">
                          <ContactIcon name="check" />
                        </span>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="cf-grid">
              <Field icon="arrow" label={f.portfolioLabel} placeholder="https://" value={data.portfolio} onChange={set("portfolio")} type="url" />
              <Field icon="linkedin" label={f.linkedinLabel} placeholder="https://linkedin.com/in/…" value={data.linkedin} onChange={set("linkedin")} type="url" />
            </div>

            <Field icon="building" label={f.salaryLabel} placeholder="e.g. ₹4.5 LPA" value={data.salary} onChange={set("salary")} />

            <CvDrop
              file={cv}
              onChange={setCv}
              label={f.cvLabel}
              hint={f.cvHint}
              dropText={f.cvDrop}
              browseText={f.cvBrowse}
              replaceText={f.cvReplace}
              tooBig={f.cvTooBig}
              badType={f.cvBadType}
            />

            <label className="cf-field cf-field-area">
              <span className="cf-field-icon">
                <CareerIcon name="chat" />
              </span>
              <textarea rows={4} maxLength={3000} placeholder={f.letterPlaceholder} value={data.letter} onChange={set("letter")} />
              <span className="cf-field-label">{f.letterLabel}</span>
              <span className="cf-field-line" aria-hidden="true" />
              <span className="cf-count" aria-hidden="true">
                {data.letter.length} / 3000
              </span>
            </label>

            {status === "error" && (
              <p className="cf-error" role="alert">
                {error} You can also email your CV to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
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
        )}
      </div>
    </section>
  );
}
