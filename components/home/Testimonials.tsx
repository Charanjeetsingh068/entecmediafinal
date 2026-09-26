"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import team1Img from "@/public/images/team1-avatar.webp";
import team2Img from "@/public/images/team2-avatar.webp";
import team3Img from "@/public/images/team3-avatar.webp";
import team4Img from "@/public/images/team4-avatar.webp";
import SectionHeader from "@/components/shared/SectionHeader";
import Reveal from "@/components/shared/Reveal";

// NOTE: Replace these with genuine client reviews (with the client's permission) before going live.
interface FeaturedStory {
  quote: string;
  name: string;
  role: string;
  avatar: StaticImageData;
  stats: { num: string; label: string }[];
}

const featuredStories: FeaturedStory[] = [
  {
    quote:
      "Entec Media rebuilt our website and took over our Google and Meta Ads. The new site loads fast, looks premium, and our enquiries have grown every single month since launch.",
    name: "Rohit Arora",
    role: "Founder, Real Estate Consultancy",
    avatar: team1Img,
    stats: [
      { num: "+28%", label: "Brand Awareness" },
      { num: "+47%", label: "User Engagement" },
      { num: "+52%", label: "Qualified Leads" },
      { num: "+36%", label: "Growth Impact" },
    ],
  },
  {
    quote:
      "Their Meta Ads campaigns brought us consistent, quality leads at a much lower cost per lead than we were paying before. Reporting is clear and every rupee is accounted for.",
    name: "Amit Sharma",
    role: "Director, Immigration Consultancy",
    avatar: team2Img,
    stats: [
      { num: "-38%", label: "Cost per Lead" },
      { num: "+64%", label: "Monthly Leads" },
      { num: "3.1x", label: "Return on Ad Spend" },
      { num: "+41%", label: "Conversion Rate" },
    ],
  },
  {
    quote:
      "Within a few months of SEO work we started ranking on the first page of Google for our main services in Mohali and Chandigarh — calls from Google have never been higher.",
    name: "Dr. Neha Gupta",
    role: "Founder, Dental Clinic",
    avatar: team4Img,
    stats: [
      { num: "+180%", label: "Organic Traffic" },
      { num: "Top 3", label: "Local Rankings" },
      { num: "+72%", label: "Calls from Google" },
      { num: "+33%", label: "New Patients" },
    ],
  },
];

const tickerStories = [
  { quote: "Our new website is fast, mobile-friendly and easy to update. The team understood exactly what our customers were looking for.", name: "Simran Kaur", role: "Owner, Boutique Clothing Brand", avatar: team1Img },
  { quote: "From UI/UX design to the final Flutter app, Entec Media handled everything professionally and launched on both app stores on time.", name: "Karan Mehta", role: "Co-Founder, Food Delivery Startup", avatar: team3Img },
  { quote: "Clear communication, transparent reporting and creative ideas every month. It feels like having an in-house marketing team.", name: "Harpreet Singh", role: "Managing Partner, Hospitality Group", avatar: team1Img },
  { quote: "The logo and brand identity they designed gave our business a completely professional look across print and social media.", name: "Priya Malhotra", role: "Founder, Organic Skincare Brand", avatar: team2Img },
  { quote: "Our Google Ads account was wasting money. Entec Media restructured it and our cost per enquiry dropped significantly.", name: "Vikram Bansal", role: "Owner, Interior Design Studio", avatar: team3Img },
  { quote: "They built our WooCommerce store with smooth checkout and payment integration. Online orders have grown steadily ever since.", name: "Ankit Jindal", role: "CEO, Home Decor E-Commerce Store", avatar: team4Img },
  { quote: "The dashboard UI they designed for our SaaS product made onboarding so much simpler for our customers.", name: "Rahul Verma", role: "Product Head, B2B SaaS Company", avatar: team2Img },
  { quote: "Social media creatives, reels and ad campaigns — all handled on time and always on-brand. Highly recommended.", name: "Jasleen Kaur", role: "Marketing Manager, Education Institute", avatar: team1Img },
];

/** Kudos "Social proof": arrow-driven featured story with four result stats, then an endless testimonial ticker. */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const story = featuredStories[index];
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + featuredStories.length) % featuredStories.length);

  return (
    <section id="testimonials" className="k-section k-social" data-theme="light">
      <div className="container">
        <SectionHeader
          label="+ SOCIAL PROOF"
          title={
            <>
              <span className="k-muted">Trusted</span> by
              <br />
              great teams
            </>
          }
          desc="Startups and growing businesses trust us with their websites, apps and digital marketing."
        />

        <Reveal className="k-story">
          <div className="k-story-client">
            <span className="k-quote-mark" aria-hidden="true">&ldquo;&ldquo;</span>
            <div className="k-author" key={`a-${index}`}>
              <Image src={story.avatar} alt="" width={40} height={40} className="k-author-avatar k-story-swap" />
              <div className="k-story-swap">
                <p className="k-author-name">{story.name}</p>
                <p className="k-author-role">{story.role}</p>
              </div>
            </div>
          </div>

          <div className="k-story-main">
            <p className="k-story-quote k-story-swap" key={`q-${index}`}>
              {story.quote}
            </p>
            <div className="k-story-stats" key={`s-${index}`}>
              {story.stats.map((s, i) => (
                <div key={s.label} className="k-story-stat k-story-swap" style={{ animationDelay: `${i * 0.06}s` }}>
                  <span className="k-story-stat-num">{s.num}</span>
                  <span className="k-mono-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="k-story-nav">
            <span className="k-mono-label">
              {String(index + 1).padStart(2, "0")} / {String(featuredStories.length).padStart(2, "0")}
            </span>
            <div className="k-story-arrows">
              <button type="button" className="k-arrow" onClick={() => go(-1)} aria-label="Previous testimonial">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" className="k-arrow" onClick={() => go(1)} aria-label="Next testimonial">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </Reveal>

        <p className="k-mono-small k-ticker-label">Real stories from teams we&apos;ve partnered with:</p>
      </div>

      <div className="k-ticker" aria-label="Client testimonials">
        <div className="k-ticker-track">
          {[...tickerStories, ...tickerStories].map((item, i) => (
            <figure key={i} className="k-ticker-card" aria-hidden={i >= tickerStories.length}>
              <blockquote>{item.quote}</blockquote>
              <figcaption className="k-author">
                <Image src={item.avatar} alt="" width={40} height={40} className="k-author-avatar" />
                <div>
                  <p className="k-author-name">{item.name}</p>
                  <p className="k-author-role">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
