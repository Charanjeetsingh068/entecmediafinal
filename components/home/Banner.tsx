"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import KButton from "@/components/shared/KButton";
import { bannerVideoSrc } from "@/lib/bannerVideo";
import team1Img from "@/public/images/team1-avatar.webp";
import team2Img from "@/public/images/team2-avatar.webp";
import team3Img from "@/public/images/team3-avatar.webp";
import team4Img from "@/public/images/team4-avatar.webp";
import RImg from "@/components/shared/RImg";

export default function Banner() {
  const [isSticky, setIsSticky] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Scroll handler for position toggling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Kudos hero parallax: copy drifts up at 10% of the scroll speed while the page slides over it
          if (contentRef.current && window.scrollY <= window.innerHeight) {
            contentRef.current.style.transform = `translate3d(0, ${-window.scrollY * 0.1}px, 0)`;
          }
          // The giant wordmark drifts up a little faster (0.24×), exactly like the Kudos hero logo
          if (logoRef.current && window.scrollY <= window.innerHeight) {
            logoRef.current.style.transform = `translate3d(0, ${-window.scrollY * 0.24}px, 0)`;
          }
          const covered = window.scrollY >= window.innerHeight;
          setIsSticky(!covered);
          // No point decoding video frames while the banner is hidden under the page
          const video = videoRef.current;
          if (video && video.currentSrc) {
            if (covered && !video.paused) video.pause();
            else if (!covered && video.paused) video.play().catch(() => {});
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load the background video only after the page has finished loading and the browser is idle,
  // so it never competes with fonts, CSS, JS or the poster image. Skipped on data-saver / 2G.
  // Phones get the small portrait cut (lib/bannerVideo.ts). Once it is really playing, it fades in
  // while the poster image fades out, so there is no jump.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g/.test(conn?.effectiveType ?? "")) return;

    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = () => {
      if (video.getAttribute("src")) return; // already started by the other trigger
      video.src = bannerVideoSrc();
      video.load();
      if (window.scrollY < window.innerHeight) video.play().catch(() => {});
    };
    const schedule = () => {
      // Idle callback when available, with a hard timeout fallback so the video always starts
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 2000 });
      timer = setTimeout(start, 2200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    const onPlaying = () => video.classList.add("is-playing");
    video.addEventListener("playing", onPlaying, { once: true });

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (video.currentSrc && window.scrollY < window.innerHeight) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("load", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("playing", onPlaying);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <section className={`banner-section ${isSticky ? "sticky-fixed" : "static-absolute"}`}>
      {/* Background video: no source and preload="none" in the HTML, so nothing downloads on load.
          The poster is a separate layer so CSS can serve phones a smaller portrait image. */}
      <video ref={videoRef} loop muted playsInline className="banner-video-bg" preload="none" aria-hidden="true" />
      <div className="banner-poster" aria-hidden="true" />
      <div className="banner-video-overlay"></div>

      <div className="container banner-content" ref={contentRef}>
        {/* Left Column */}
        <div className="banner-left">
          <h1 className="banner-title">
            We design, build <br />
            <span className="purple-text">&amp; grow brands</span>
          </h1>
          <p className="banner-desc">
            Entec Media is an IT &amp; digital marketing company — websites, mobile apps, UI/UX, graphic design, SEO, Google Ads and Meta Ads that turn your business goals into measurable growth.
          </p>
        </div>

        {/* Right Column */}
        <div className="banner-right">
          {/* Top Rating Card */}
          <div className="rating-container">
            <div className="avatar-group">
              <Image src={team1Img} alt="Team member 1" className="avatar-bubble" />
              <Image src={team2Img} alt="Team member 2" className="avatar-bubble" />
              <Image src={team3Img} alt="Team member 3" className="avatar-bubble" />
              <Image src={team4Img} alt="Team member 4" className="avatar-bubble" />
            </div>
            <div className="rating-info">
              <div className="rating-stars-row">
                <span className="rating-stars">◆◆◆◆◆</span>
                <span className="rating-val">4.9/5</span>
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
            <KButton href="/contact" label="Let's Collaborate" variant="dark" />
          </div>
        </div>
      </div>

      {/* Giant Bottom Text Logo ENTEC - Priority load for LCP optimization */}
      <div className="giant-logo-text-wrapper" ref={logoRef}>
        <RImg src="/images/ENTEC.png" alt="ENTEC" className="giant-logo-img" sizes="(max-width: 1750px) 100vw, 1750px" priority />
      </div>
    </section>
  );
}
