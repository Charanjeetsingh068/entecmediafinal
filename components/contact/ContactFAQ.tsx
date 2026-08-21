"use client";

export default function ContactFAQ() {
  const faqs = [
    {
      q: "How fast will I hear back after submitting a project request?",
      a: "Our client strategy leads review every submission carefully. You will receive a direct email response within 24 business hours outlining initial thoughts and discovery call options."
    },
    {
      q: "Do you sign Non-Disclosure Agreements (NDAs) prior to initial calls?",
      a: "Yes, absolutely. We hold confidentiality in the highest regard and are glad to sign mutual NDAs before reviewing proprietary brand documents or code bases."
    },
    {
      q: "What is your typical project onboarding workflow?",
      a: "We start with a 45-minute discovery alignment call, followed by a detailed scope proposal. Once approved, we move rapidly into discovery wireframing, high-fidelity design, and Next.js development."
    }
  ];

  return (
    <section className="service-faq-section">
      <div className="container">
        <div className="why-top-layout about-section-top-mb50">
          <div className="why-col-left">
            <span className="why-section-label">+ COMMON QUESTIONS</span>
          </div>
          <div className="why-col-center">
            <h2 className="why-main-title">
              What to expect <span className="highlight-focus">when you reach out</span>
            </h2>
          </div>
          <div className="why-col-right">
            <p className="why-header-desc">
              Clear processes, fast response times, and total transparency from day one.
            </p>
          </div>
        </div>

        <div className="service-faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className="service-faq-item">
              <h3 className="faq-question">{faq.q}</h3>
              <p className="faq-answer">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
