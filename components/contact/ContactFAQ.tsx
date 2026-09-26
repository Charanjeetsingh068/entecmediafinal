import FAQSection from "@/components/shared/FAQSection";
import { generalFaqs } from "@/lib/faqData";

const contactFaqs = [
  {
    group: "Getting in touch",
    items: [
      {
        question: "How fast will I hear back after submitting a project request?",
        answer:
          "Our team reviews every submission carefully. You will receive a reply within 24 business hours with initial thoughts and options for a discovery call.",
      },
      {
        question: "Do you sign NDAs before initial calls?",
        answer:
          "Yes. We hold confidentiality in the highest regard and are happy to sign a mutual NDA before reviewing your documents, ideas or code.",
      },
      {
        question: "What is your onboarding workflow?",
        answer:
          "A 30–45 minute discovery call, followed by a detailed proposal. Once approved we move into planning, design, development and launch with regular updates.",
      },
    ],
  },
  ...generalFaqs.slice(1),
];

/** Contact page FAQ. */
export default function ContactFAQ() {
  return <FAQSection groups={contactFaqs} />;
}
