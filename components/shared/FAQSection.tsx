"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";
import type { FaqGroup } from "@/lib/faqData";

interface FAQSectionProps {
  groups: FaqGroup[];
  label?: string;
  title?: React.ReactNode;
  desc?: string;
}

/** Kudos FAQ: group names on the left, numbered accordion rows on the right (first item open). */
export default function FAQSection({
  groups,
  label = "+ FAQ",
  title = (
    <>
      <span className="k-muted">Good questions,</span>
      <br />
      honest answers
    </>
  ),
  desc = "Thoughtful answers to common questions about working with us and getting started on your project.",
}: FAQSectionProps) {
  const [open, setOpen] = useState<string | null>("0-0");
  // Running question number across all groups (01, 02, …)
  const offsets = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0));

  return (
    <section className="k-section k-faq-section" data-theme="light">
      <div className="container" data-kfx="y:-120">
        <SectionHeader label={label} title={title} desc={desc} />

        <div className="k-faq-groups">
          {groups.map((group, gi) => (
            <div key={group.group} className="k-faq-group">
              <h3 className="k-faq-group-title">{group.group}</h3>
              <div className="k-faq-list">
                {group.items.map((item, ii) => {
                  const id = `${gi}-${ii}`;
                  const isOpen = open === id;
                  return (
                    <div key={id} className={`k-faq-item ${isOpen ? "is-open" : ""}`}>
                      <button
                        type="button"
                        className="k-faq-question"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : id)}
                      >
                        <span className="k-faq-num">{String(offsets[gi] + ii + 1).padStart(2, "0")}</span>
                        <span className="k-faq-q-text">{item.question}</span>
                        <span className="k-faq-toggle" aria-hidden="true" />
                      </button>
                      <div className="k-faq-answer">
                        <div className="k-faq-answer-inner">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
