"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { PageSection } from "@/lib/useDynamicPage";
import KButton from "@/components/shared/KButton";

interface DynamicSectionsRendererProps {
  sections: PageSection[];
}

export default function DynamicSectionsRenderer({ sections }: DynamicSectionsRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="dynamic-custom-sections-wrap">
      {sections.map((section, idx) => {
        if (section.visible === false) return null;

        return (
          <section
            key={section.id || `custom-sec-${idx}`}
            id={section.id}
            className={`dyn-section dyn-type-${section.type || "custom"}`}
            style={{
              padding: "80px 24px",
              background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
              borderTop: "1px solid #e2e8f0"
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {/* Tagline / Badge */}
              {section.badge && (
                <div style={{ marginBottom: "12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      background: "rgba(67, 67, 141, 0.08)",
                      color: "#43438D",
                      fontWeight: 600,
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}
                  >
                    {section.badge}
                  </span>
                </div>
              )}

              {/* Title & Subtitle */}
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 42px)",
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.2,
                  marginBottom: "16px",
                  maxWidth: "800px"
                }}
              >
                {section.title}
              </h2>

              {section.subtitle && (
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.6,
                    color: "#475569",
                    maxWidth: "750px",
                    marginBottom: "32px"
                  }}
                >
                  {section.subtitle}
                </p>
              )}

              {/* Custom Structured Items (Cards / Grid) */}
              {Array.isArray(section.items) && section.items.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "24px",
                    marginBottom: "36px"
                  }}
                >
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "24px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)"
                      }}
                    >
                      {item.number && (
                        <div style={{ fontSize: "32px", fontWeight: 700, color: "#0677BB", marginBottom: "8px" }}>
                          {item.number}
                        </div>
                      )}
                      {item.title && (
                        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" }}>
                          {item.title}
                        </h3>
                      )}
                      {item.name && (
                        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                          {item.name}
                        </h3>
                      )}
                      {item.role && (
                        <p style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, marginBottom: "8px" }}>
                          {item.role}
                        </p>
                      )}
                      {item.quote && (
                        <blockquote style={{ fontSize: "15px", color: "#334155", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
                          &ldquo;{item.quote}&rdquo;
                        </blockquote>
                      )}
                      {item.desc && (
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                          {item.desc}
                        </p>
                      )}
                      {item.bio && (
                        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                          {item.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {(section.button_text || section.secondary_button_text) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                  {section.button_text && section.button_link && (
                    <KButton href={section.button_link} label={section.button_text} variant="dark" />
                  )}
                  {section.secondary_button_text && section.secondary_button_link && (
                    <Link
                      href={section.secondary_button_link}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "999px",
                        border: "1px solid #cbd5e1",
                        color: "#0f172a",
                        fontWeight: 600,
                        fontSize: "15px",
                        textDecoration: "none"
                      }}
                    >
                      {section.secondary_button_text}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
