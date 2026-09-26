"use client";

import { useState } from "react";
import { sendForm } from "@/lib/sendForm";

type Status = "idle" | "sending" | "success" | "error";

/** Footer newsletter sign-up — mails the subscriber's address to the Entec inbox. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const result = await sendForm("newsletter", { email, company_fax: honeypot, source: "newsletter" });
    setStatus(result.success ? "success" : "error");
    setMessage(result.message);
    if (result.success) setEmail("");
  };

  return (
    <form className="k-newsletter-form" onSubmit={handleSubmit}>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="form-honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "sending") setStatus("idle");
        }}
        className="k-newsletter-input"
      />
      <button type="submit" className="k-btn k-btn-light k-newsletter-btn" disabled={status === "sending"}>
        <span className="k-btn-label">
          {status === "sending" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
        </span>
        <span className="k-btn-icon" aria-hidden="true">
          <span className="k-btn-dot" />
          <span className="k-btn-dot" />
          <span className="k-btn-dot" />
        </span>
      </button>
      {message && status !== "idle" && status !== "sending" && (
        <p className={`k-newsletter-status form-status-${status}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}
