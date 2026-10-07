"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Maps embed that is only created once its box comes near the screen. The embed pulls in
 * ~400 KB of Google Maps scripts; even with loading="lazy" phones fetched it on page load (the browser's
 * lazy distance is very large), which slowed the Contact page. The box keeps its size from CSS
 * (.ct-map), so nothing shifts when the map appears.
 */
export default function LazyMap({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return show ? (
    <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
  ) : (
    <span ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
  );
}
