"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/images/logo.svg";
import hamburgerMenuImg from "@/public/images/hamburger-menu.svg";

export default function Header() {
  return (
    <header className="header-main">
      <div className="figma-container header-wrapper">
        <Link href="/" className="logo-link">
          <Image src={logoImg} alt="Entec Media Logo" className="logo-img" priority />
        </Link>
        <button className="menu-toggle" aria-label="Open Menu">
          <Image src={hamburgerMenuImg} alt="Menu" className="menu-icon-img" />
        </button>
      </div>
    </header>
  );
}

