"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const HEADER_GAP = 110;
const BOTTOM_GAP = 24;

/**
 * The article sidebar as one sticky column. When it fits in the window it sticks just under the header;
 * when it's taller, it scrolls with the article until its last card is in view and then sticks there,
 * so every card can still be reached. The offset is recalculated whenever the sidebar or window resizes.
 */
export default function StickySide({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const place = () => {
      const top = Math.min(HEADER_GAP, window.innerHeight - el.offsetHeight - BOTTOM_GAP);
      el.style.setProperty("--side-top", `${Math.round(top)}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <aside ref={ref} className={className} style={{ "--side-top": `${HEADER_GAP}px` } as CSSProperties}>
      {children}
    </aside>
  );
}
