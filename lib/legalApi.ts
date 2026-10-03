/**
 * Data access for the legal pages. Local content (lib/legalContent.ts) now; when an admin panel exists,
 * set NEXT_PUBLIC_SERVICES_API_URL and serve:
 *
 *   GET {base}/public/legal-privacy.php  → { data: LegalDoc }
 *   GET {base}/public/legal-terms.php    → { data: LegalDoc }
 *
 * A missing, offline or invalid endpoint falls back to the local file.
 */

import { fromApi, isObject } from "@/lib/servicesApi";
import { privacyPolicy, termsOfService, type LegalDoc } from "@/lib/legalContent";

export function getPrivacyPolicy(): Promise<LegalDoc> {
  return fromApi("/public/legal-privacy.php", privacyPolicy, isObject);
}

export function getTermsOfService(): Promise<LegalDoc> {
  return fromApi("/public/legal-terms.php", termsOfService, isObject);
}

/** Reading time of a legal document at ≈220 words a minute */
export function legalReadingMinutes(doc: LegalDoc): number {
  const words = doc.sections
    .map((s) => s.html.replace(/<[^>]+>/g, " "))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
