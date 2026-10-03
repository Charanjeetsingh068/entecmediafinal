"use client";

import { useState, useSyncExternalStore, type MouseEvent } from "react";

interface ShareLinksProps {
  title: string;
  /** Absolute URL of the page to share (e.g. https://entecmedia.com/blog/my-post/) */
  url: string;
  /** Short summary sent with the link where the network supports it */
  text?: string;
  label?: string;
}

const noSubscribe = () => () => {};

/**
 * "Share" icon row on the article page. Every button shares the post's own URL directly:
 * the phone share sheet (where the browser supports it), Facebook, X, LinkedIn and WhatsApp
 * (each opens its share dialog in a small window), and Copy link.
 * The URL comes from the page props, so the links are complete in the static HTML too.
 */
export default function ShareLinks({ title, url, text, label = "Share on:" }: ShareLinksProps) {
  const canShare = useSyncExternalStore(noSubscribe, () => typeof navigator.share === "function", () => false);
  const [copied, setCopied] = useState(false);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const networks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.2v1.8H8v3.2h2.5V21h3.4v-9.3h2.6l.4-3.2H14z" fill="currentColor" />,
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      icon: <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2zm-1.2 18h1.7L6.4 3.9H4.6L17.7 20z" fill="currentColor" />,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: (
        <path
          d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
          fill="currentColor"
        />
      ),
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      icon: (
        <path
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3z"
          fill="currentColor"
        />
      ),
    },
  ];

  // Open the network's share dialog in a centred popup; the plain link (new tab) stays as the fallback
  const popup = (e: MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    if (name === "WhatsApp" || window.matchMedia("(max-width: 809px)").matches) return;
    const w = 620, h = 560;
    const win = window.open(href, `share-${name}`, `width=${w},height=${h},left=${(screen.width - w) / 2},top=${(screen.height - h) / 2}`);
    if (!win) return;
    win.opener = null;
    e.preventDefault();
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: text || title, url });
    } catch {
      /* dismissed */
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="k-side-block">
      <span className="k-mono-label">{label}</span>
      <div className="k-share-row">
        {canShare && (
          <button type="button" className="k-share-btn" onClick={nativeShare} aria-label="Share this article">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </button>
        )}
        {networks.map((n) => (
          <a
            key={n.name}
            className="k-share-btn"
            href={n.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${n.name}`}
            title={`Share on ${n.name}`}
            onClick={(e) => popup(e, n.href, n.name)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              {n.icon}
            </svg>
          </a>
        ))}
        <button type="button" className="k-share-btn" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"} title={copied ? "Link copied" : "Copy link"}>
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12l5 5L20 7" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
