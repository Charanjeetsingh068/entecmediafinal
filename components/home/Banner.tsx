"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import team1Img from "@/public/images/team1.png";
import team2Img from "@/public/images/team2.png";
import team3Img from "@/public/images/team3.png";
import team4Img from "@/public/images/team4.png";
import entecLogoImg from "@/public/images/ENTEC.png";

export default function Banner() {
  const [isSticky, setIsSticky] = useState(true);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Scroll handler for position toggling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Performance Optimization: Defer the loading of the 352MB background video
  // This allows the critical page assets (CSS, JS, Fonts) and LCP images to load instantly
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoSrc("/images/homebanner.mp4");
    }, 1500); // 1.5 seconds delay after mount

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`banner-section ${isSticky ? "sticky-fixed" : "static-absolute"}`}>
      {/* Background Video - Preload set to none & dynamic source to prevent initial blocking */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/bannerbac.png"
        className="banner-video-bg"
        preload="none"
      >
        {videoSrc && <source src={videoSrc} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>
      <div className="banner-video-overlay"></div>

      <div className="container banner-content">
        {/* Left Column */}
        <div className="banner-left">
          <h1 className="banner-title">
            We design brands <br />
            <span className="purple-text">people remember</span>
          </h1>
          <p className="banner-desc">
            Built for designers, agencies, and creatives who want to showcase their best work, make a strong first impression, and create real impact without bloated workflows.
          </p>
        </div>

        {/* Right Column */}
        <div className="banner-right">
          {/* Top Rating Card */}
          <div className="rating-container">
            <div className="avatar-group">
              <Image src={team1Img} alt="Team member 1" className="avatar-bubble" priority />
              <Image src={team2Img} alt="Team member 2" className="avatar-bubble" priority />
              <Image src={team3Img} alt="Team member 3" className="avatar-bubble" priority />
              <Image src={team4Img} alt="Team member 4" className="avatar-bubble" priority />
            </div>
            <div className="rating-info">
              <div className="rating-stars-row">
                <span className="rating-stars">◆◆◆◆◆</span>
                <span className="rating-val">4.4/5</span>
              </div>
              <p className="rating-label">
                Trusted by <br />
                Top Brands
              </p>
            </div>
          </div>

          {/* Bottom Collaboration Box */}
          <div className="collab-wrapper">
            <p className="collab-label">Ready to start something great?</p>
            <div className="collab-box">
              <span className="collab-text">Let&apos;s Collaborate</span>
              <div className="collab-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Giant Bottom Text Logo ENTEC - Priority load for LCP optimization */}
      <div className="giant-logo-text-wrapper">
        <Image src={entecLogoImg} alt="ENTEC" className="giant-logo-img" priority />
      </div>
    </section>
  );
}
