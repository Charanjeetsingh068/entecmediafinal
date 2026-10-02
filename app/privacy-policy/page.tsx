import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Entec Media collects, uses, shares and protects your personal information.",
  alternates: { canonical: "https://entecmedia.com/privacy-policy" },
};

const sections: LegalSection[] = [
  {
    title: "Who We Are",
    content: (
      <>
        <p>
          Entec Media (&quot;Entec Media&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) is a
          IT and digital marketing company based in Zirakpur, Punjab, India. We
          operate the website <strong>https://entecmedia.com</strong> and provide
          website design and development, mobile app design and development, UI/UX and
          graphic design, digital marketing, SEO, Google Ads and Meta Ads services.
        </p>
        <p>
          This Privacy Policy explains what information we collect when you visit our
          website, contact us, interact with our advertisements or lead forms
          (including on Facebook and Instagram), or use our services, and how we use
          and protect that information.
        </p>
      </>
    ),
  },
  {
    title: "Information We Collect",
    content: (
      <>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Information you provide:</strong> your name, email address, phone
            number, company name, project details and any message you submit through
            our contact forms, email, phone, WhatsApp or lead forms.
          </li>
          <li>
            <strong>Information from Meta platforms:</strong> when you submit a lead
            form on Facebook or Instagram, or message our Page, we receive the details
            you choose to share (such as name, email and phone number) through Meta&apos;s
            tools and APIs.
          </li>
          <li>
            <strong>Automatically collected information:</strong> IP address, browser
            type, device information, pages visited, referring URLs and time spent on
            the site, collected through cookies, the Meta Pixel and similar
            analytics technologies.
          </li>
          <li>
            <strong>Client project data:</strong> content, assets and account access
            you share with us so we can deliver our services.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <ul>
        <li>To respond to enquiries and provide quotes, proposals and services.</li>
        <li>To manage client relationships, projects, billing and support.</li>
        <li>
          To send service updates and, where you have agreed, marketing communications
          (you can opt out at any time).
        </li>
        <li>
          To measure and improve the performance of our website and advertising
          campaigns, including on Facebook and Instagram.
        </li>
        <li>To keep our website secure and prevent fraud or misuse.</li>
        <li>To comply with applicable legal obligations.</li>
      </ul>
    ),
  },
  {
    title: "Cookies & Tracking Technologies",
    content: (
      <p>
        We use cookies and similar technologies, including analytics tools and the Meta
        Pixel, to understand how visitors use our website and to show relevant
        advertising. You can control or delete cookies through your browser settings,
        and you can manage ad preferences in your Facebook and Instagram settings.
        Disabling cookies may affect how parts of the website work.
      </p>
    ),
  },
  {
    title: "How We Share Information",
    content: (
      <>
        <p>We do not sell your personal information. We may share it only with:</p>
        <ul>
          <li>
            Trusted service providers (hosting, email, CRM, analytics and advertising
            platforms such as Meta and Google) who process data on our behalf.
          </li>
          <li>
            Professional advisers, or authorities where required by law, regulation or
            legal process.
          </li>
          <li>A successor entity in the event of a merger, acquisition or sale of assets.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <p>
        We keep personal information only for as long as necessary for the purposes
        described in this policy, to fulfil our contractual obligations, or as required
        by law. When it is no longer needed, we securely delete or anonymise it.
      </p>
    ),
  },
  {
    title: "Data Security",
    content: (
      <p>
        We use reasonable technical and organisational measures, such as encrypted
        connections (HTTPS), access controls and trusted hosting providers, to protect
        your information. No method of transmission over the internet is completely
        secure, but we work to protect your data using industry-standard practices.
      </p>
    ),
  },
  {
    title: "Your Rights",
    content: (
      <>
        <p>
          Depending on where you live, you may have the right to access, correct,
          update or delete your personal information, to withdraw consent, and to
          object to or restrict certain processing.
        </p>
        <p>
          To exercise these rights, email us at{" "}
          <a href="mailto:info@entecmedia.com">info@entecmedia.com</a>. To request that
          we delete your data, including data received through Facebook or Instagram,
          please follow the steps on our{" "}
          <Link href="/data-deletion">User Data Deletion</Link> page.
        </p>
      </>
    ),
  },
  {
    title: "Third-Party Links",
    content: (
      <p>
        Our website may contain links to third-party websites and platforms. We are not
        responsible for the privacy practices of those sites and encourage you to read
        their privacy policies.
      </p>
    ),
  },
  {
    title: "Children's Privacy",
    content: (
      <p>
        Our website and services are not directed at children under 13 (or the minimum
        age in your jurisdiction), and we do not knowingly collect their personal
        information.
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. The latest version will
        always be available on this page with the &quot;Last updated&quot; date shown above.
      </p>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <p>
        Entec Media
        <br />
        #123, First Floor, Complex Street, Zirakpur, Punjab, India
        <br />
        Email: <a href="mailto:info@entecmedia.com">info@entecmedia.com</a>
        <br />
        Phone: <a href="tel:+919996550841">+91-9996550841</a>
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      label="PRIVACY POLICY"
      title="Your privacy,"
      highlight="handled with care"
      intro="This policy explains how Entec Media collects, uses and protects the personal information you share with us."
      lastUpdated="September 23, 2026"
      sections={sections}
    />
  );
}
