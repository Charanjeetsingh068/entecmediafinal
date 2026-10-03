/**
 * Editable content for the legal pages (/privacy-policy and /terms-of-service). Plain JSON in the shape an
 * admin panel / CMS API should return (see lib/legalApi.ts). Section bodies are simple HTML strings so a
 * rich-text editor can produce them; every section also has a one-line plain-language summary.
 * Contact details in the text should match lib/siteConfig.ts.
 */

import type { Heading, LinkItem, SeoMeta } from "@/lib/servicesContent";

export type LegalIconName = "shield" | "lock" | "trash" | "eye" | "doc" | "pen" | "scale" | "globe" | "check" | "card" | "chat";

export interface LegalSection {
  /** Anchor id (#delete-your-data) */
  id: string;
  title: string;
  /** "In short" — one plain-language sentence */
  summary: string;
  html: string;
}

export interface LegalDoc {
  /** Name shown in the breadcrumb */
  name: string;
  path: string;
  seo: SeoMeta;
  /** ISO date of the last update */
  updated: string;
  hero: {
    label: string;
    title: Heading;
    desc: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    /** Key promises floating on the hero art */
    highlights: { icon: LegalIconName; text: string }[];
    /** Title on the document card of the hero art */
    docTitle: string;
  };
  updatedLabel: string;
  readLabel: string;
  sectionsLabel: string;
  contentsLabel: string;
  summaryLabel: string;
  sections: LegalSection[];
  contact: {
    label: string;
    title: string;
    text: string;
    other: LinkItem;
  };
}

const CONTACT_HTML = `<p><strong>Entec Media</strong><br>#123, First Floor, Complex Street, Zirakpur, Punjab, India</p>
<p>Email: <a href="mailto:info@entecmedia.com">info@entecmedia.com</a><br>Phone / WhatsApp: <a href="tel:+919996550841">+91-9996550841</a><br>Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST</p>`;

export const privacyPolicy: LegalDoc = {
  name: "Privacy Policy",
  path: "/privacy-policy",
  seo: {
    title: "Privacy Policy — How Entec Media Handles Your Data",
    description:
      "What personal information Entec Media collects through its website, forms and ads, how it is used and protected, the services involved, and how to access or delete your data.",
  },
  updated: "2026-10-03",
  hero: {
    label: "PRIVACY POLICY",
    title: { soft: "Your privacy,", strong: "handled with care" },
    desc: "Plain-language answers to what we collect when you visit our website or contact us, why we collect it, who helps us process it and how you can see or delete it at any time.",
    primaryCta: { label: "Read the policy", href: "#legal-content" },
    secondaryCta: { label: "Delete my data", href: "#delete-your-data" },
    highlights: [
      { icon: "shield", text: "We never sell your data" },
      { icon: "lock", text: "HTTPS on every page" },
      { icon: "trash", text: "Delete anytime on request" },
    ],
    docTitle: "Privacy Policy",
  },
  updatedLabel: "Last updated",
  readLabel: "Reading time",
  sectionsLabel: "Sections",
  contentsLabel: "Contents",
  summaryLabel: "In short",
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      summary: "Entec Media runs this website and is responsible for the data you share here.",
      html: `<p>Entec Media ("Entec Media", "we", "us" or "our") is an IT and digital marketing company based in Zirakpur, Punjab, India. We operate <strong>https://entecmedia.com</strong> and provide website design and development, mobile app design and development, UI/UX and graphic design, SEO, Google Ads, Meta Ads and digital marketing services.</p>
<p>This policy explains what information we collect when you visit our website, fill in one of our forms, contact us, respond to our ads or lead forms (including on Facebook and Instagram) or work with us — and what we do with it. For the purposes of India's Digital Personal Data Protection Act, 2023, Entec Media is the "data fiduciary" for this information.</p>`,
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      summary: "What you type into our forms, a few technical details sent with them, and anonymous usage data from analytics.",
      html: `<h3>Information you give us</h3>
<ul>
<li><strong>Contact form:</strong> your name, email address, phone number with its country code, company or brand, the services you are interested in, how you heard about us and your message.</li>
<li><strong>Job applications:</strong> your name, email, phone, the role, job type and experience, portfolio and LinkedIn links, resume link and cover letter.</li>
<li><strong>Newsletter:</strong> your email address.</li>
<li><strong>Direct contact:</strong> anything you share with us by email, phone, WhatsApp or social media messages.</li>
<li><strong>Meta lead forms and messages:</strong> the details you choose to submit through Facebook or Instagram lead forms or messages to our Pages.</li>
</ul>
<h3>Information sent automatically with a form</h3>
<p>When you submit a form, we receive a few technical details along with it so we can respond properly and spot spam:</p>
<ul>
<li>your IP address and its <strong>approximate location</strong> (city, region, country, internet provider and time zone), looked up from the IP address by an IP-location service;</li>
<li>the page you sent the form from and the page that brought you there;</li>
<li>your browser's time zone and language, screen size, and device / browser type;</li>
<li>the date and time of the submission.</li>
</ul>
<p>On the contact page, your country is also detected from your IP address to pre-select your phone country code. This is remembered only for your current browser session.</p>
<h3>Information collected while you browse</h3>
<p>Google Analytics, Google Tag Manager and the Meta Pixel collect information such as pages viewed, time on page, clicks, approximate location, device and browser, and the site that referred you. See <a href="#cookies">Cookies &amp; tracking</a>.</p>
<h3>Client project information</h3>
<p>When we work together, you may share content, files, brand assets and access to accounts (hosting, domains, ad accounts, analytics). We use these only to deliver the agreed work.</p>`,
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      summary: "To reply to you, deliver our services, improve the website and our ads, and keep things secure.",
      html: `<ul>
<li>To reply to enquiries, prepare quotes and proposals, and arrange calls.</li>
<li>To deliver, manage and support client projects, including billing.</li>
<li>To review job applications.</li>
<li>To send our newsletter or updates — only if you asked for them; you can unsubscribe at any time.</li>
<li>To understand how visitors use the website and improve its content and performance.</li>
<li>To measure and improve our advertising on Google, Facebook and Instagram.</li>
<li>To protect the website and our forms from spam, fraud and misuse (for example, limiting repeated submissions from one IP address).</li>
<li>To meet legal, tax and accounting obligations.</li>
</ul>
<p>We process your information because you have given consent (for example, by submitting a form), because it is needed to take steps towards or perform a contract with you, or because we have a legitimate interest in running and securing our business — and where required by law.</p>`,
    },
    {
      id: "cookies",
      title: "Cookies & tracking technologies",
      summary: "We use Google Analytics, Google Tag Manager and the Meta Pixel; you can block or delete their cookies at any time.",
      html: `<p>Cookies are small files stored in your browser. Our website uses the following:</p>
<ul>
<li><strong>Google Analytics 4 and Google Tag Manager</strong> — to measure visits and how pages are used, in aggregate.</li>
<li><strong>Meta Pixel</strong> — to measure the results of our Facebook and Instagram ads and to show relevant ads to people who visited our website.</li>
<li><strong>Embedded Google Map</strong> on the contact page — Google may set its own cookies when the map loads or you interact with it.</li>
<li><strong>Session storage</strong> — the contact page remembers your detected country for the current browser session only.</li>
</ul>
<p>You can block or delete cookies in your browser settings, use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a>, and manage ad preferences in your Google, Facebook and Instagram account settings. Blocking cookies won't stop the website from working.</p>`,
    },
    {
      id: "third-parties",
      title: "Services that help us run the website",
      summary: "A few trusted providers host the site, deliver email, measure traffic and show maps, images and flags.",
      html: `<p>These providers may receive limited information (such as your IP address) when you use the website:</p>
<ul>
<li><strong>Hostinger</strong> — website hosting and email delivery.</li>
<li><strong>Google</strong> — Analytics, Tag Manager and the embedded map.</li>
<li><strong>Meta Platforms</strong> — the Meta Pixel and Facebook / Instagram lead forms.</li>
<li><strong>ipwho.is and ip-api.com</strong> — approximate location of the IP address that sends a form, and the country used to pre-select your phone code.</li>
<li><strong>flagcdn.com</strong> — country flag images in the phone field.</li>
<li><strong>Unsplash</strong> — some of the photos shown on the website.</li>
</ul>
<p>Each provider handles data under its own privacy policy. We choose reputable providers and share only what is needed.</p>`,
    },
    {
      id: "sharing",
      title: "How we share information",
      summary: "We never sell your data; we share it only with the providers above, advisers, or authorities when the law requires.",
      html: `<p>We do <strong>not</strong> sell or rent your personal information. We share it only:</p>
<ul>
<li>with the service providers listed above, who process it on our behalf;</li>
<li>with professional advisers (such as accountants or lawyers) where needed;</li>
<li>with authorities when required by law, regulation or legal process;</li>
<li>with a successor business if Entec Media is merged, acquired or sells its assets — with this policy continuing to apply.</li>
</ul>`,
    },
    {
      id: "international",
      title: "International transfers",
      summary: "Some providers store data outside India, with appropriate safeguards.",
      html: `<p>Some of the providers above are based in, or store data in, countries outside India (for example, the United States or the European Union). When your information is transferred, it is protected by the provider's contractual and security safeguards and handled as described in this policy.</p>`,
    },
    {
      id: "retention",
      title: "How long we keep it",
      summary: "Only as long as needed — enquiries while we're in touch, applications for a year, records the law requires for longer.",
      html: `<ul>
<li><strong>Enquiries:</strong> while we are in conversation and for up to 3 years after our last contact, so we can refer back to it if you return.</li>
<li><strong>Client project records:</strong> for the duration of the project and afterwards as needed for support, warranties and legal, tax and accounting requirements.</li>
<li><strong>Job applications:</strong> up to 12 months, unless you ask us to delete yours sooner.</li>
<li><strong>Newsletter:</strong> until you unsubscribe.</li>
<li><strong>Analytics data:</strong> according to the retention settings of Google Analytics and Meta.</li>
</ul>
<p>When information is no longer needed, we delete it or make it anonymous.</p>`,
    },
    {
      id: "security",
      title: "How we protect it",
      summary: "Encrypted connections, restricted access and spam protection — though no system is 100% secure.",
      html: `<p>We use encrypted HTTPS connections on every page, restrict access to personal information to the people who need it, use trusted hosting, protect our forms against spam and abuse, and keep our software up to date. No method of transmission or storage is completely secure, but we work to protect your information using industry-standard practices and will act promptly if a breach occurs.</p>`,
    },
    {
      id: "your-rights",
      title: "Your rights",
      summary: "You can ask to see, correct or delete your information, or withdraw consent, at any time.",
      html: `<p>Depending on where you live — including under India's Digital Personal Data Protection Act, 2023 — you can:</p>
<ul>
<li>ask what personal information we hold about you and get a copy;</li>
<li>ask us to correct or update it;</li>
<li>ask us to delete it (see the next section);</li>
<li>withdraw your consent, for example to marketing emails;</li>
<li>raise a complaint with us, and with the relevant data protection authority if you are not satisfied.</li>
</ul>
<p>Email <a href="mailto:info@entecmedia.com">info@entecmedia.com</a> to use any of these rights. We may ask you to confirm your identity first.</p>`,
    },
    {
      id: "delete-your-data",
      title: "How to delete your data",
      summary: "Email us with the subject \"Data Deletion Request\" — we delete your data within 30 days and confirm by email.",
      html: `<p>You can ask us to permanently delete the personal information we hold about you at any time — including information from our website forms, email, phone, WhatsApp, and Facebook or Instagram lead forms and messages.</p>
<h3>1. Send us a request</h3>
<p>Email <a href="mailto:info@entecmedia.com?subject=Data%20Deletion%20Request">info@entecmedia.com</a> with the subject <strong>"Data Deletion Request"</strong> and include:</p>
<ul>
<li>your full name;</li>
<li>the email address and/or phone number you used with us;</li>
<li>where you shared your data (for example: website contact form, Facebook lead form, Instagram, WhatsApp).</li>
</ul>
<h3>2. If you connected through Facebook</h3>
<ol>
<li>Go to Facebook <strong>Settings &amp; Privacy → Settings</strong>.</li>
<li>Open <strong>Apps and Websites</strong>.</li>
<li>Select <strong>Entec Media</strong> and click <strong>Remove</strong>.</li>
<li>Then send us the email above so we also delete anything already stored on our systems.</li>
</ol>
<h3>3. What happens next</h3>
<ul>
<li>We acknowledge your request within 3 business days.</li>
<li>We may ask you to verify your identity to protect your information.</li>
<li>Your data is deleted from our systems, inbox, CRM and marketing lists within 30 days of verification.</li>
<li>We confirm by email once it's done.</li>
</ul>
<p>We may need to keep a few records — such as invoices — where the law requires it for tax, accounting or dispute purposes. These are kept securely and only for as long as required.</p>`,
    },
    {
      id: "children",
      title: "Children's privacy",
      summary: "Our website and services are meant for businesses and adults, not children.",
      html: `<p>Our website and services are not directed at children under 18, and we do not knowingly collect their personal information. If you believe a child has shared information with us, contact us and we will delete it.</p>`,
    },
    {
      id: "links",
      title: "Links to other websites",
      summary: "Other websites have their own privacy policies.",
      html: `<p>Our website links to other sites and platforms, such as social networks and the websites we have built for clients. We are not responsible for their privacy practices and encourage you to read their policies.</p>`,
    },
    {
      id: "changes",
      title: "Changes to this policy",
      summary: "If we update this policy, the new version and date will appear on this page.",
      html: `<p>We may update this policy when our website, services or the law change. The latest version will always be on this page with its "last updated" date. For significant changes, we will make this clear on the website.</p>`,
    },
    {
      id: "contact",
      title: "Contact us",
      summary: "Questions or requests about your data? Write or call us.",
      html: CONTACT_HTML,
    },
  ],
  contact: {
    label: "QUESTIONS?",
    title: "Talk to us about your data",
    text: "Have a question about this policy or want to see, change or delete your information? A real person from our team will help.",
    other: { label: "Read our Terms of Service", href: "/terms-of-service" },
  },
};

export const termsOfService: LegalDoc = {
  name: "Terms of Service",
  path: "/terms-of-service",
  seo: {
    title: "Terms of Service — Using Entec Media's Website & Services",
    description:
      "The terms for using the Entec Media website and working with us on websites, apps, design, SEO and advertising projects: proposals, payments, ownership, support and more.",
  },
  updated: "2026-10-03",
  hero: {
    label: "TERMS OF SERVICE",
    title: { soft: "Clear terms for", strong: "every project" },
    desc: "How our website may be used and how we work with clients — from proposals and payments to ownership, revisions and support — written to be read, not skimmed past.",
    primaryCta: { label: "Read the terms", href: "#legal-content" },
    secondaryCta: { label: "Ask a question", href: "/contact" },
    highlights: [
      { icon: "doc", text: "Scope agreed in writing" },
      { icon: "card", text: "Clear, fixed quotes" },
      { icon: "check", text: "You own the final work" },
    ],
    docTitle: "Terms of Service",
  },
  updatedLabel: "Last updated",
  readLabel: "Reading time",
  sectionsLabel: "Sections",
  contentsLabel: "Contents",
  summaryLabel: "In short",
  sections: [
    {
      id: "acceptance",
      title: "Accepting these terms",
      summary: "Using our website or services means you agree to these terms.",
      html: `<p>These Terms of Service ("Terms") apply to your use of <strong>https://entecmedia.com</strong> (the "Website") and to services provided by Entec Media ("we", "us", "our"). By using the Website or engaging our services, you agree to these Terms. If you don't agree, please don't use the Website or our services.</p>`,
    },
    {
      id: "services",
      title: "Our services",
      summary: "What we do — the details of each project are set out in its own proposal.",
      html: `<p>We provide website design and development, mobile app design and development, UI/UX and graphic design, logo and branding, SEO, Google Ads, Meta Ads and digital marketing services.</p>
<p>The scope, deliverables, timeline and fees of each project are set out in a written proposal, quotation or agreement ("Proposal"). If a Proposal and these Terms conflict, the Proposal applies.</p>`,
    },
    {
      id: "website-use",
      title: "Using our website",
      summary: "Use the website lawfully and don't misuse its content or forms.",
      html: `<p>When using the Website, you agree not to:</p>
<ul>
<li>use it for any unlawful, fraudulent or harmful purpose;</li>
<li>try to gain unauthorised access to it, its servers or connected systems, or disrupt it;</li>
<li>copy, scrape or republish its content, designs or code without our written permission;</li>
<li>submit false, misleading, offensive or infringing information, or spam, through our forms.</li>
</ul>
<p>Information on the Website (including prices or timelines mentioned in articles) is general guidance, not a binding offer. Only a Proposal confirms a project's details.</p>`,
    },
    {
      id: "proposals",
      title: "Proposals, quotes & starting a project",
      summary: "Quotes are valid for 30 days; a project starts once the proposal is accepted and the advance is paid.",
      html: `<ul>
<li>Quotes are valid for 30 days unless the Proposal says otherwise.</li>
<li>A project starts once you accept the Proposal (in writing or by email) and pay any advance stated in it.</li>
<li>Timelines begin when we have received the advance and the content, assets and access we need from you.</li>
<li>Work outside the agreed scope is a change request: we will quote it separately before starting.</li>
</ul>`,
    },
    {
      id: "client-responsibilities",
      title: "Your responsibilities",
      summary: "Give us accurate information, timely feedback and only material you have the right to use.",
      html: `<ul>
<li>Provide accurate information, content, brand assets and account access when needed.</li>
<li>Review work and give feedback within the agreed time — delays on your side can move the timeline.</li>
<li>Make sure you own or have permission to use everything you give us (text, images, logos, data), and that it doesn't infringe anyone's rights.</li>
<li>Keep your own accounts (hosting, domain, ad accounts) in good standing and pay any third-party fees for them.</li>
</ul>`,
    },
    {
      id: "payments",
      title: "Fees & payments",
      summary: "Fees, schedule and taxes are in your proposal; work may pause if payments are overdue.",
      html: `<ul>
<li>Fees, payment milestones and applicable taxes (such as GST) are set out in the Proposal or invoice.</li>
<li>Invoices are payable by the due date shown on them.</li>
<li>We may pause work, or delay launch or handover, while payments are overdue.</li>
<li>Advertising budgets for Google Ads, Meta Ads and similar platforms are paid by you directly to the platform, separately from our management fees, unless agreed otherwise.</li>
<li>Third-party costs — domains, hosting, premium plugins, stock assets, app store accounts — are billed to you or paid by you directly.</li>
</ul>`,
    },
    {
      id: "revisions",
      title: "Revisions, approval & launch",
      summary: "Each phase includes the revisions in your proposal; approval moves the project to the next step.",
      html: `<p>Each design and development phase includes the number of revision rounds stated in the Proposal. Extra rounds or changes after approval may be charged separately. Once you approve a phase — or don't respond for 15 days after we deliver it — we treat it as approved and move to the next step. We launch websites and apps after your final approval.</p>`,
    },
    {
      id: "ownership",
      title: "Ownership & intellectual property",
      summary: "You own the final deliverables once paid in full; we may show the work in our portfolio.",
      html: `<ul>
<li>Content on the Website — text, graphics, logos, designs and code — belongs to or is licensed to Entec Media and is protected by intellectual property laws.</li>
<li>Ownership of the final project deliverables passes to you once the project is <strong>paid in full</strong>, unless the Proposal says otherwise.</li>
<li>Third-party items (fonts, plugins, stock images, open-source code) stay under their own licences.</li>
<li>We keep ownership of our general know-how, tools and reusable code, and grant you a licence to use them as part of your project.</li>
<li>We may show completed work in our portfolio and marketing unless you ask us not to in writing — confidential projects can be covered by an NDA.</li>
</ul>`,
    },
    {
      id: "support",
      title: "Support & maintenance",
      summary: "We fix launch bugs for 30 days; ongoing maintenance is available as a separate plan.",
      html: `<p>For 30 days after launch, we fix bugs in the work we delivered at no extra cost. This doesn't cover new features, content changes, or problems caused by third-party updates, hosting issues or changes made by others. Ongoing maintenance, updates and backups are available under a separate maintenance plan.</p>`,
    },
    {
      id: "marketing-results",
      title: "Marketing & advertising results",
      summary: "We work hard for results, but no one can guarantee rankings, leads or sales.",
      html: `<p>SEO, advertising and marketing results depend on many factors outside our control, such as search engine and platform algorithms, competition, budgets and market conditions. We don't guarantee specific rankings, traffic, leads, sales or return on investment. We follow the policies of Google, Meta and other platforms, which may approve, limit or reject ads and accounts at their discretion.</p>`,
    },
    {
      id: "third-party-platforms",
      title: "Third-party platforms",
      summary: "Platforms like Google, Meta and app stores have their own terms.",
      html: `<p>Our work often uses third-party platforms — Google, Meta (Facebook and Instagram), app stores, hosting providers, payment gateways and others. Your use of them is subject to their own terms and policies, and we are not responsible for their availability, fees, policy changes or decisions.</p>`,
    },
    {
      id: "confidentiality",
      title: "Confidentiality",
      summary: "We keep your business information private and are happy to sign an NDA.",
      html: `<p>We keep confidential any non-public business information you share with us and use it only to deliver your project. We are happy to sign a mutual non-disclosure agreement (NDA) on request.</p>`,
    },
    {
      id: "cancellation",
      title: "Pausing or ending a project",
      summary: "Either side can end a project in writing; completed work up to that point is paid for.",
      html: `<p>Either party may end a project by written notice. You will pay for work completed up to that date, and any advance covers work already done (advances are non-refundable unless the Proposal says otherwise). If a project is on hold for more than 60 days because we're waiting on you, we may close it and restart it later under a new timeline.</p>`,
    },
    {
      id: "liability",
      title: "Limitation of liability",
      summary: "Our liability is limited to what you paid us for the project in question.",
      html: `<p>The Website is provided "as is", without warranties of any kind. To the extent permitted by law, Entec Media is not liable for indirect, incidental, special or consequential losses — such as lost profits, revenue, data or business opportunities — arising from use of the Website or our services. Our total liability for any claim relating to a project will not exceed the fees you paid us for that project.</p>`,
    },
    {
      id: "privacy",
      title: "Privacy",
      summary: "How we handle personal data is explained in our Privacy Policy.",
      html: `<p>Your use of the Website and our services is also governed by our <a href="/privacy-policy">Privacy Policy</a>, which explains what information we collect, how we use it and how you can ask us to delete it.</p>`,
    },
    {
      id: "law",
      title: "Governing law",
      summary: "Indian law applies; disputes go to the courts of Punjab.",
      html: `<p>These Terms are governed by the laws of India. We will always try to resolve any disagreement by talking first. If that isn't possible, disputes are subject to the exclusive jurisdiction of the courts of Punjab, India.</p>`,
    },
    {
      id: "changes",
      title: "Changes to these terms",
      summary: "If we update these terms, the new version and date will appear here.",
      html: `<p>We may update these Terms from time to time. The latest version is always on this page with its "last updated" date. Projects already under way follow the terms agreed in their Proposal.</p>`,
    },
    {
      id: "contact",
      title: "Contact us",
      summary: "Questions about these terms? We're happy to explain.",
      html: CONTACT_HTML,
    },
  ],
  contact: {
    label: "QUESTIONS?",
    title: "Not sure what something means?",
    text: "We're happy to walk you through these terms or any part of a proposal before you decide — no obligation.",
    other: { label: "Read our Privacy Policy", href: "/privacy-policy" },
  },
};
