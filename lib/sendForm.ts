import { MAIL_ENDPOINT } from "@/lib/siteConfig";

export type FormType = "enquiry" | "career" | "newsletter";

export interface SendFormResult {
  success: boolean;
  message: string;
}

/**
 * Posts a website form to the PHP mail handler (public/api/send-mail.php).
 * Always resolves — network and server errors come back as `success: false`.
 */
export async function sendForm(formType: FormType, data: Record<string, unknown>): Promise<SendFormResult> {
  try {
    const res = await fetch(MAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, form_type: formType }),
      signal: AbortSignal.timeout(20000),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.success) {
      return { success: true, message: json.message || "Thank you! We will be in touch soon." };
    }
    return { success: false, message: json?.message || "We couldn't send your message right now." };
  } catch {
    return { success: false, message: "We couldn't send your message right now." };
  }
}
