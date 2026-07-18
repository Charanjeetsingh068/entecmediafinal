"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="header-main">
      <div className="figma-container header-wrapper">
        <Link href="/" className="logo-link">
          <img src="/images/logo.svg" alt="Entec Media Logo" className="logo-img" />
        </Link>
        <button className="menu-toggle" aria-label="Open Menu">
          <img src="/images/hamburger-menu.svg" alt="Menu" className="menu-icon-img" />
        </button>
      </div>
    </header>
  );
}
