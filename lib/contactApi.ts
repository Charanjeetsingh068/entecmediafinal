/**
 * Data access for the Contact page (/contact). Local content (lib/contactContent.ts) now; when an admin
 * panel exists, set NEXT_PUBLIC_SERVICES_API_URL and serve:
 *
 *   GET {base}/public/contact-page.php  → { data: ContactPageContent }
 *
 * A missing, offline or invalid endpoint falls back to the local file.
 */

import { fromApi, isObject } from "@/lib/servicesApi";
import { contactPageContent, type ContactPageContent } from "@/lib/contactContent";

export function getContactPageContent(): Promise<ContactPageContent> {
  return fromApi("/public/contact-page.php", contactPageContent, isObject);
}
