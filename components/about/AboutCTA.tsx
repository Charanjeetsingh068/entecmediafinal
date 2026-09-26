"use client";

import Image from "next/image";
import EnquiryForm from "@/components/forms/EnquiryForm";
import SectionHeader from "@/components/shared/SectionHeader";

interface AboutCTAProps {
  source?: string;
  defaultService?: string;
}

/** Kudos "Work with us — Let's create with purpose" contact form section, shared by every page. */
export default function AboutCTA({ source = "work-with-us", defaultService }: AboutCTAProps) {
  return (
    <section className="about-work-section" id="contact-form" data-theme="light">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/entec-wordmark-dark.svg" alt="" aria-hidden="true" className="k-section-watermark" />
      <div className="container" data-kfx="y:-120">
        <SectionHeader
          label="+ WORK WITH US"
          title={
            <>
              <span className="k-muted">Let&apos;s</span> create
              <br />
              with purpose
            </>
          }
          desc="Share your goals, timeline and challenges — we'll respond within 24 hours with clarity and next steps."
        />

        <div className="work-form-layout">
          <div className="work-sticky-left">
            <h3 className="work-left-title">
              Ambitious ideas deserve <strong>expert execution</strong>. Start the conversation and let&apos;s
              define <strong>what success looks like.</strong>
            </h3>

            <div className="work-left-brand-row">
              <span className="work-left-brand-name">
                <span className="k-mono-small">Team</span>
                ENTEC MEDIA
              </span>
              <span className="work-left-year">2026</span>
            </div>

            <div className="work-left-trust-box">
              <div className="work-avatars-group">
                <Image src="/images/founder1.png" alt="" width={32} height={32} className="work-avatar-img" />
                <Image src="/images/team1-avatar.webp" alt="" width={32} height={32} className="work-avatar-img" />
                <Image src="/images/team2-avatar.webp" alt="" width={32} height={32} className="work-avatar-img" />
                <Image src="/images/team3-avatar.webp" alt="" width={32} height={32} className="work-avatar-img" />
              </div>
              <div className="work-rating-info">
                <span className="work-rating-stars">
                  <span className="k-stars">★★★★★</span> 4.9/5
                </span>
                <span className="work-rating-label">TRUSTED BY TOP BRANDS</span>
              </div>
            </div>
          </div>

          <div className="work-form-right">
            <EnquiryForm source={source} defaultService={defaultService} />
          </div>
        </div>
      </div>
    </section>
  );
}
