"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Kudos-style inertial smooth scrolling (Lenis). Native scroll events still fire, so every
 * scroll-linked effect on the site keeps working unchanged.
 * Pauses while the full-screen menu is open (body.menu-open-scroll-lock).
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Same settings as Kudos' Framer "Smooth Scroll" component (intensity 10 → duration 1s, expo-out easing)
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
      // In-page links (href="#quote", "#projects"…) glide to their section; native jumps don't move Lenis
      anchors: true,
    });
    window.__lenis = lenis;

    const lockObserver = new MutationObserver(() => {
      if (document.body.classList.contains("menu-open-scroll-lock")) lenis.stop();
      else lenis.start();
    });
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      lockObserver.disconnect();
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // New page → start at the top without easing.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
