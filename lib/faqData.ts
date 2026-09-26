export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  group: string;
  items: FaqItem[];
}

/** Shared FAQ content (home, services and contact pages). */
export const generalFaqs: FaqGroup[] = [
  {
    group: "Working with Entec",
    items: [
      {
        question: "How do you typically start a project?",
        answer:
          "Every project begins with a free discovery call — we understand your business, goals, audience and budget, then share a clear proposal with scope, timeline and cost before any work starts.",
      },
      {
        question: "Who will I be working with?",
        answer:
          "You get a dedicated project manager plus the designers, developers and marketers your project needs. One point of contact, one team — no hand-offs between agencies.",
      },
      {
        question: "Do you work with clients outside Punjab and India?",
        answer:
          "Yes. We work with businesses across India and internationally. Calls, updates and reviews happen online, so location is never a barrier.",
      },
    ],
  },
  {
    group: "Pricing & Scope",
    items: [
      {
        question: "How much does a website or app cost?",
        answer:
          "It depends on pages, features and integrations. After the discovery call you receive a fixed-price quote — no hidden charges. Business websites typically start from ₹25,000.",
      },
      {
        question: "Do you offer monthly marketing packages?",
        answer:
          "Yes. SEO, social media, Google Ads and Meta Ads are available as monthly retainers with transparent reporting, so you always know what your budget is delivering.",
      },
      {
        question: "Can I get a custom package?",
        answer:
          "Absolutely. Many clients combine website development with SEO or ads management. We tailor a package around your goals and budget.",
      },
    ],
  },
  {
    group: "Process & Delivery",
    items: [
      {
        question: "How long does a project take?",
        answer:
          "A business website usually takes 2–4 weeks, e-commerce stores 4–6 weeks and mobile apps 8–12 weeks, depending on scope and feedback time.",
      },
      {
        question: "Will I be able to update my website myself?",
        answer:
          "Yes. We build on easy-to-use CMS platforms and give you a walkthrough, so you can update text, images and blog posts without any coding.",
      },
      {
        question: "Do you provide support after launch?",
        answer:
          "Every project includes free post-launch support. After that we offer affordable maintenance plans covering updates, backups, security and small changes.",
      },
    ],
  },
];
