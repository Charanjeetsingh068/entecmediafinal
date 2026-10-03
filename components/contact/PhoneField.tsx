"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import ContactIcon from "@/components/contact/ContactIcon";
import { countryCodes, flagUrl, PINNED_COUNTRIES, type CountryCode } from "@/lib/countryCodes";

interface PhoneFieldProps {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  value: string;
  onChange: (number: string) => void;
  /** ISO code picked by the visitor, or "" to use the browser's country */
  country: string;
  onCountryChange: (iso: string) => void;
  required?: boolean;
}

const FALLBACK = "IN";
const noSubscribe = () => () => {};

/** Time zones that tell us the country reliably (a browser language is often just "en-US") */
const TZ_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Dubai": "AE", "Asia/Karachi": "PK", "Asia/Dhaka": "BD",
  "Asia/Kathmandu": "NP", "Asia/Colombo": "LK", "Asia/Singapore": "SG", "Asia/Riyadh": "SA", "Asia/Qatar": "QA",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Berlin": "DE", "Europe/Paris": "FR", "Europe/Amsterdam": "NL",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Perth": "AU", "Australia/Brisbane": "AU",
  "Pacific/Auckland": "NZ", "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US", "America/Phoenix": "US",
};

/** The visitor's country: from the time zone, else the browser language ("en-IN" → IN); India when unknown. */
const browserCountry = () => {
  try {
    const tz = TZ_COUNTRY[Intl.DateTimeFormat().resolvedOptions().timeZone];
    if (tz) return tz;
  } catch {
    /* not available */
  }
  const region = (navigator.languages?.[0] || navigator.language || "").split("-")[1]?.toUpperCase();
  return region && countryCodes.some((c) => c.iso === region) ? region : FALLBACK;
};

export const findCountry = (iso: string): CountryCode =>
  countryCodes.find((c) => c.iso === iso) ?? countryCodes.find((c) => c.iso === FALLBACK)!;

const IP_KEY = "entec-ip-country";

let ipLookup: Promise<string> | null = null;

/** Country of the visitor's IP address (ipwho.is), looked up once and remembered for the session */
const ipCountry = () => (ipLookup ??= lookupIpCountry());

async function lookupIpCountry(): Promise<string> {
  try {
    const cached = sessionStorage.getItem(IP_KEY);
    if (cached) return cached;
  } catch {
    /* storage blocked */
  }
  try {
    const res = await fetch("https://ipwho.is/?fields=success,country_code", { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    const iso = data?.success && typeof data.country_code === "string" ? data.country_code.toUpperCase() : "";
    if (!countryCodes.some((c) => c.iso === iso)) return "";
    try {
      sessionStorage.setItem(IP_KEY, iso);
    } catch {
      /* storage blocked */
    }
    return iso;
  } catch {
    return "";
  }
}

/**
 * Hook: the ISO code to use — the visitor's pick; else the country they are browsing from (looked up
 * from their IP address once per session); until that answers or if it fails, the time zone / browser
 * language guess.
 */
export function useCountry(picked: string) {
  const guessed = useSyncExternalStore(noSubscribe, browserCountry, () => FALLBACK);
  const [fromIp, setFromIp] = useState("");

  useEffect(() => {
    let alive = true;
    ipCountry().then((iso) => alive && iso && setFromIp(iso));
    return () => {
      alive = false;
    };
  }, []);

  return picked || fromIp || guessed;
}

/**
 * Phone input with a country-code picker: flag + dialling code button, then the number. It starts on
 * the country the visitor is browsing from (see useCountry) and they can change it. The picker
 * opens a searchable list of every country (name, ISO or code, e.g. "ind", "+44"), popular ones pinned
 * at the top. Closes on Escape, on outside click or after a pick, and returns focus to the number.
 */
export default function PhoneField({ label, placeholder, searchPlaceholder, value, onChange, country, onCountryChange, required }: PhoneFieldProps) {
  const iso = useCountry(country);
  const current = findCountry(iso);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    const match = (c: CountryCode) =>
      !q || c.name.toLowerCase().includes(q) || c.iso.toLowerCase() === q || c.dial.slice(1).startsWith(q);
    const pinned = PINNED_COUNTRIES.map((p) => countryCodes.find((c) => c.iso === p)!).filter(match);
    const rest = countryCodes.filter((c) => !PINNED_COUNTRIES.includes(c.iso) && match(c));
    return { pinned: q ? [] : pinned, rest: q ? countryCodes.filter(match) : rest };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (c: CountryCode) => {
    onCountryChange(c.iso);
    setOpen(false);
    setQuery("");
    inputRef.current?.focus();
  };

  const option = (c: CountryCode) => (
    <li key={c.iso}>
      <button type="button" role="option" aria-selected={c.iso === current.iso} className={c.iso === current.iso ? "is-on" : undefined} onClick={() => pick(c)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={flagUrl(c.iso)} alt="" width={22} height={16} loading="lazy" />
        <span className="cf-cc-name">{c.name}</span>
        <span className="cf-cc-dial">{c.dial}</span>
      </button>
    </li>
  );

  return (
    <div className={`cf-phone ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="cf-cc-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${current.name} ${current.dial}`}
        onClick={() => setOpen((o) => !o)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={flagUrl(current.iso)} alt="" width={22} height={16} />
        <span>{current.dial}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <label className="cf-field cf-phone-field">
        <span className="cf-field-icon">
          <ContactIcon name="phone" />
        </span>
        <input
          ref={inputRef}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={value}
          required={required}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value.replace(/[^\d\s()-]/g, ""))}
        />
        <span className="cf-field-label">
          {label}
          {required && <i aria-hidden="true"> *</i>}
        </span>
        <span className="cf-field-line" aria-hidden="true" />
      </label>

      {open && (
        <div className="cf-cc-pop">
          <div className="cf-cc-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input ref={searchRef} type="search" placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={searchPlaceholder} />
          </div>
          <ul role="listbox" aria-label="Countries" data-lenis-prevent>
            {list.pinned.map(option)}
            {list.pinned.length > 0 && <li className="cf-cc-sep" aria-hidden="true" />}
            {list.rest.map(option)}
            {!list.pinned.length && !list.rest.length && <li className="cf-cc-empty">No country found</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
