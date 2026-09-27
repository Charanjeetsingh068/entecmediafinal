"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { parseFx, registerFx } from "@/lib/scrollFx";

/**
 * Site-wide Kudos scroll effect: headings, labels, cards and rows rise 48px and fade in, linked to
 * scroll progress (see lib/scrollFx.ts). Any element can also opt in with its own Kudos values via
 * data-kfx="y:-120" (or "x:-240;opacity:0.6"). A MutationObserver picks up client-rendered content.
 */
const SELECTORS = [
  ".k-section-head .why-section-label",
  ".k-section-head .why-main-title",
  ".k-section-head .why-header-desc",
  ".k-why-intro > *",
  ".k-team-footer > *",
  ".blog-bottom-bar > *",
  ".k-cta-band-inner > *",
  ".k-list-group",
  ".k-job-row",
  ".k-service-row",
  ".k-faq-item",
  ".k-process-row",
  ".k-process-expect > *",
  ".k-keep-exploring > *",
  ".k-newsletter-row > *",
  ".k-detail-hero-side",
  ".k-detail-meta",
  ".k-detail-sidebar > *",
  ".k-detail-content > *",
  ".k-role-col",
  ".work-sticky-left > *",
  ".work-form-right",
  ".k-featured-side > *",
  ".k-featured-info",
  ".k-showcase-row",
  ".k-showcase-side-inner > *",
  ".blog-card",
  ".k-toolbar",
  ".k-map-frame",
  ".k-contact-info > *",
  ".mission-stat-card",
  ".legal-content > *",
].join(",");

export default function AutoReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const scan = () => {
      document.querySelectorAll<HTMLElement>(SELECTORS).forEach((el) => {
        if (el.dataset.kAppear) return;
        // Elements animated by <Reveal>, or living inside one, keep their own effect
        if (el.closest(".reveal-item, .k-hero-head, .nav-overlay") || el.hasAttribute("data-kfx")) return;
        el.dataset.kAppear = "1";
        cleanups.push(registerFx(el, { opacity: 0, y: 48 }));
      });
      document.querySelectorAll<HTMLElement>("[data-kfx]").forEach((el) => {
        if (el.dataset.kAppear) return;
        el.dataset.kAppear = "1";
        cleanups.push(registerFx(el, parseFx(el.dataset.kfx)));
      });
    };

    scan();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(scan, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mo.disconnect();
      cleanups.forEach((fn) => fn());
      document.querySelectorAll<HTMLElement>("[data-k-appear]").forEach((el) => delete el.dataset.kAppear);
    };
  }, [pathname]);

  return null;
}
