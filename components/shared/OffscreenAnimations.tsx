"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Pauses the looping CSS animations (marquees, blobs, spins, shimmers…) of every section that is off
 * screen. Each running animation costs a style recalc (and often a repaint) on every frame, even when
 * nobody can see it — with dozens of them across a page that kept the main thread busy all the time,
 * which slowed page load on phones and made scrolling stutter. A section gets `data-off` while it is
 * out of view (globals.css pauses everything inside it) and loses it a little before it scrolls in,
 * so the motion is already running by the time it is seen.
 */
const SCOPES = "main section, main > div > section, footer, [data-anim-scope]";

export default function OffscreenAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) el.removeAttribute("data-off");
          else el.setAttribute("data-off", "");
        }
      },
      { rootMargin: "200px 0px 200px 0px" },
    );

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(SCOPES).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();

    let timer: ReturnType<typeof setTimeout> | undefined;
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(scan, 200);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mo.disconnect();
      io.disconnect();
      document.querySelectorAll("[data-off]").forEach((el) => el.removeAttribute("data-off"));
    };
  }, [pathname]);

  return null;
}
