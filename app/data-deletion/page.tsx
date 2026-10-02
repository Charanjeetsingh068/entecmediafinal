import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "User Data Deletion",
  description:
    "How to request deletion of your personal data held by Entec Media, including data received through Facebook and Instagram.",
  alternates: { canonical: "https://entecmedia.com/data-deletion" },
};

const sections: LegalSection[] = [
  {
    title: "Your Right to Delete Your Data",
    content: (
      <p>
        You can ask Entec Media to delete the personal information we hold about you at
        any time. This includes information you submitted through our website, email,
        phone or WhatsApp, and information we received through Facebook or Instagram
        (for example, lead forms, Page messages or Facebook Login).
      </p>
    ),
  },
  {
    title: "How to Request Deletion",
    content: (
      <>
        <p>
          Send an email to{" "}
          <a href="mailto:info@entecmedia.com?subject=Data%20Deletion%20Request">
            info@entecmedia.com
          </a>{" "}
          with the subject line <strong>&quot;Data Deletion Request&quot;</strong> and
          include:
        </p>
        <ul>
          <li>Your full name.</li>
          <li>
            The email address and/or phone number you used when contacting us or
            submitting a form.
          </li>
          <li>
            Where you shared your data (for example: website contact form, Facebook
            lead form, Instagram, WhatsApp).
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Removing Access via Facebook",
    content: (
      <>
        <p>
          If you connected with us using Facebook, you can also remove our app&apos;s
          access directly from your Facebook account:
        </p>
        <ol>
          <li>
            Go to your Facebook account&apos;s <strong>Settings &amp; Privacy</strong>{" "}
            → <strong>Settings</strong>.
          </li>
          <li>
            Open <strong>Apps and Websites</strong>.
          </li>
          <li>Find Entec Media in the list and select it.</li>
          <li>
            Click <strong>Remove</strong>, then send us a deletion request as described
            above so we also delete any data already stored on our systems.
          </li>
        </ol>
      </>
    ),
  },
  {
    title: "What Happens Next",
    content: (
      <ul>
        <li>We will acknowledge your request within 3 business days.</li>
        <li>
          We may ask you to verify your identity before deleting data, to protect your
          information.
        </li>
        <li>
          Your personal data will be permanently deleted from our systems, CRM and
          marketing lists within 30 days of verification.
        </li>
        <li>We will confirm by email once the deletion is complete.</li>
      </ul>
    ),
  },
  {
    title: "Data We May Need to Keep",
    content: (
      <p>
        In limited cases we may need to retain certain records, such as invoices and
        transaction records, where required by law, for tax or accounting purposes, or
        to resolve disputes. Any retained data will be kept securely and only for as long
        as legally required.
      </p>
    ),
  },
  {
    title: "Questions",
    content: (
      <p>
        For more details about how we handle your information, please read our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> or contact us at{" "}
        <a href="mailto:info@entecmedia.com">info@entecmedia.com</a> /{" "}
        <a href="tel:+919996550841">+91-9996550841</a>.
      </p>
    ),
  },
];

export default function DataDeletionPage() {
  return (
    <LegalPage
      label="USER DATA DELETION"
      title="Request deletion of"
      highlight="your personal data"
      intro="Follow the steps below to have Entec Media permanently delete the personal information we hold about you."
      lastUpdated="September 23, 2026"
      sections={sections}
    />
  );
}
