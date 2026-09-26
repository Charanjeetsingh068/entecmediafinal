import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms and conditions that govern your use of the Entec Media website and services.",
  alternates: { canonical: "https://entecmedia.com/terms-of-service" },
};

const sections: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using <strong>https://entecmedia.com</strong> (the
        &quot;Website&quot;) or any services provided by Entec Media (&quot;we&quot;,
        &quot;us&quot; or &quot;our&quot;), you agree to these Terms of Service. If you do not
        agree, please do not use the Website or our services.
      </p>
    ),
  },
  {
    title: "Our Services",
    content: (
      <p>
        Entec Media provides website design and development, mobile app design and
        development, UI/UX design, graphic design, digital marketing, SEO, Google Ads
        and Meta Ads services. The specific scope,
        deliverables, timelines and fees for any project are set out in a separate
        proposal, quotation or agreement, which will take precedence over these Terms
        where they conflict.
      </p>
    ),
  },
  {
    title: "Use of the Website",
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Website for any unlawful, fraudulent or harmful purpose.</li>
          <li>
            Attempt to gain unauthorised access to the Website, its servers or any
            connected systems.
          </li>
          <li>
            Copy, scrape, reproduce or distribute Website content without our written
            permission.
          </li>
          <li>Submit false, misleading or infringing information through our forms.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Client Responsibilities",
    content: (
      <p>
        Clients are responsible for providing accurate information, timely feedback and
        any content, assets or account access needed to complete a project. You confirm
        that you own or have the right to use any material you give us, and that it
        does not infringe the rights of any third party.
      </p>
    ),
  },
  {
    title: "Payments",
    content: (
      <p>
        Fees, payment schedules and applicable taxes are specified in each proposal or
        invoice. Unless otherwise agreed in writing, invoices are payable by the due
        date shown. We may pause work on a project while payments are overdue.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    content: (
      <p>
        All content on the Website, including text, graphics, logos, designs and code,
        is owned by or licensed to Entec Media and protected by intellectual property
        laws. Ownership of final project deliverables transfers to the client upon full
        payment, unless the project agreement states otherwise. We may showcase
        completed work in our portfolio unless you ask us not to in writing.
      </p>
    ),
  },
  {
    title: "Third-Party Platforms",
    content: (
      <p>
        Our services may involve third-party platforms such as Meta (Facebook and
        Instagram), Google, hosting providers and other tools. Your use of those
        platforms is subject to their own terms and policies, and we are not responsible
        for their availability, policy changes or actions.
      </p>
    ),
  },
  {
    title: "No Guarantee of Results",
    content: (
      <p>
        We work to deliver high-quality outcomes, but marketing and advertising results
        depend on many factors outside our control. We do not guarantee specific
        rankings, traffic, leads, sales or return on investment.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        The Website is provided &quot;as is&quot; without warranties of any kind. To the
        maximum extent permitted by law, Entec Media will not be liable for any
        indirect, incidental, special or consequential damages arising from your use of
        the Website or our services. Our total liability for any claim relating to a
        project will not exceed the amount paid to us for that project.
      </p>
    ),
  },
  {
    title: "Privacy",
    content: (
      <p>
        Your use of the Website is also governed by our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>, which explains how we handle
        your personal information.
      </p>
    ),
  },
  {
    title: "Governing Law",
    content: (
      <p>
        These Terms are governed by the laws of India. Any disputes will be subject to
        the exclusive jurisdiction of the courts of Punjab, India.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    content: (
      <p>
        We may update these Terms from time to time. Continued use of the Website after
        changes are posted means you accept the updated Terms.
      </p>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:info@entecmedia.com">info@entecmedia.com</a> or call{" "}
        <a href="tel:+919812388888">+91-9812388888</a>.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      label="TERMS OF SERVICE"
      title="The terms behind"
      highlight="every project"
      intro="Please read these terms carefully before using the Entec Media website or engaging our services."
      lastUpdated="September 23, 2026"
      sections={sections}
    />
  );
}
