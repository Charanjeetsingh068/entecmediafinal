"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import team1Img from "@/public/images/team1.png";
import team2Img from "@/public/images/team2.png";
import team3Img from "@/public/images/team3.png";
import team4Img from "@/public/images/team4.png";

const heroTestimonial = {
  quote: "KUDOS transformed our ideas into a beautiful and functional design. The process was smooth, and the final product is both elegant and engaging!",
  name: "Sophia Martinez",
  role: "CEO +XZERO®",
  avatar: team1Img,
  stats: [
    { num: "+28%", label: "Brand Awareness" },
    { num: "+47%", label: "User Engagement" },
    { num: "+52%", label: "Qualified Demand" },
    { num: "+36%", label: "Growth Impact" }
  ]
};

const row1Testimonials = [
  {
    id: 1,
    quote: "Their induction heaters are exceptionally robust and safe. They've streamlined our sugarcane crusher roller mounting workflow and eliminated shaft damage.",
    name: "Ananya Deshmukh",
    role: "Project Manager, Balrampur Chini Mills",
    avatar: team1Img
  },
  {
    id: 2,
    quote: "Switching to MBH spherical roller bearings solved our rolling neck heating issues at the hot strip mill. The run-time between scheduled roll changes has increased by 40%.",
    name: "Rajan Sharma",
    role: "Maintenance Director, Jindal Steel & Power",
    avatar: team2Img
  },
  {
    id: 3,
    quote: "Implementing MBH high-precision deep groove ball bearings was a game-changer for our EV drivetrains. The noise level in our electric motors dropped by 15 dB.",
    name: "Amit Patel",
    role: "Senior OEM Designer, Tata Motors",
    avatar: team3Img
  },
  {
    id: 4,
    quote: "The technical support team guided us through custom clearances, ensuring our cement plant conveyor bearings withstand constant dusty vibration.",
    name: "Dr. Sunita Rao",
    role: "Operations Head, UltraTech Cement",
    avatar: team4Img
  },
  {
    id: 5,
    quote: "MBH's double row angular contact bearings have enhanced our high-speed turbine gearbox rigidity. Highly recommended for heavy thrust applications.",
    name: "Sanjay Mehta",
    role: "Chief Engineer, NTPC Limited",
    avatar: team1Img
  }
];

const row2Testimonials = [
  {
    id: 6,
    quote: "Using MBH bearings, our high-speed ventilator spindles run cooler and with zero vibration, boosting overall motor performance.",
    name: "Karan Malhotra",
    role: "HVAC Maintenance Director, Blue Star India",
    avatar: team2Img
  },
  {
    id: 7,
    quote: "Their induction heaters are exceptionally robust and safe. They've streamlined our sugarcane crusher roller mounting workflow and eliminated shaft damage.",
    name: "Ananya Deshmukh",
    role: "Project Manager, Balrampur Chini Mills",
    avatar: team1Img
  },
  {
    id: 8,
    quote: "The dimensional tolerances on their tapered thrust bearings exceeded expectations. We've seen zero slip and excellent axial stability.",
    name: "Vikramaditya Singh",
    role: "Chief Metallurgist, BHEL",
    avatar: team3Img
  },
  {
    id: 9,
    quote: "Outstanding service. The logistics team ensured rapid dispatch, keeping our paper mill operational during a critical breakdown.",
    name: "Ramesh Krishnan",
    role: "Procurement Director, Century Pulp & Paper",
    avatar: team4Img
  },
  {
    id: 10,
    quote: "They delivered custom clearance bearings for our sugar mill crushers, understanding our high-shock needs perfectly.",
    name: "Priyanka Nair",
    role: "Plant Manager, Hindalco",
    avatar: team2Img
  }
];

export default function Testimonials() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const isRow1Hovered = useRef(false);
  const isRow2Hovered = useRef(false);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const marqueeFrameId = useRef<number | null>(null);

  // Intersection Observer for section entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Text scroll highlight calculation
  useEffect(() => {
    const handleScroll = () => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const start = windowHeight * 0.85;
        const end = windowHeight * 0.30;

        const total = start - end;
        const current = start - rect.top;

        const rawProgress = current / total;
        targetProgress.current = Math.max(0, Math.min(1, rawProgress));
      }
    };

    const updateAnimation = () => {
      const diffText = targetProgress.current - currentProgress.current;
      if (Math.abs(diffText) > 0.0005) {
        currentProgress.current += diffText * 0.08;
        setScrollProgress(currentProgress.current);
      }
      animationFrameId.current = requestAnimationFrame(updateAnimation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animationFrameId.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Continuous marquee animation loop
  useEffect(() => {
    const speed = 0.8; // pixels per frame

    const scrollMarquee = () => {
      // Row 1: left scroll
      if (row1Ref.current && !isRow1Hovered.current) {
        const r1 = row1Ref.current;
        r1.scrollLeft += speed;
        if (r1.scrollLeft >= r1.scrollWidth / 2) {
          r1.scrollLeft = 0;
        }
      }

      // Row 2: right scroll
      if (row2Ref.current && !isRow2Hovered.current) {
        const r2 = row2Ref.current;
        r2.scrollLeft -= speed;
        if (r2.scrollLeft <= 0) {
          r2.scrollLeft = r2.scrollWidth / 2;
        }
      }

      marqueeFrameId.current = requestAnimationFrame(scrollMarquee);
    };

    // Initialize row 2 to start in the middle of loop
    if (row2Ref.current) {
      row2Ref.current.scrollLeft = row2Ref.current.scrollWidth / 2;
    }

    marqueeFrameId.current = requestAnimationFrame(scrollMarquee);

    return () => {
      if (marqueeFrameId.current) {
        cancelAnimationFrame(marqueeFrameId.current);
      }
    };
  }, []);

  // Manual navigation buttons scroll rows in opposing directions
  const handlePrev = () => {
    const step = 380; // card width + gap
    if (row1Ref.current) {
      row1Ref.current.scrollBy({ left: -step, behavior: "smooth" });
    }
    if (row2Ref.current) {
      row2Ref.current.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    const step = 380;
    if (row1Ref.current) {
      row1Ref.current.scrollBy({ left: step, behavior: "smooth" });
    }
    if (row2Ref.current) {
      row2Ref.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const words = heroTestimonial.quote.split(" ");

  return (
    <section id="testimonials" ref={sectionRef} className="testimonials-section">
      <div className="container">
        
        {/* Top 3-Column Layout */}
        <div className={`why-top-layout reveal-item ${isRevealed ? "revealed" : ""}`}>
          
          {/* Left Column: Label + Hero Author Info */}
          <div className="why-col-left">
            <span className="why-section-label">+ SOCIAL PROOF</span>

            <div className="why-rating-card">
              <div className="why-avatar-group">
                <Image src={team1Img} alt="Team member 1" className="why-avatar-bubble" />
                <Image src={team2Img} alt="Team member 2" className="why-avatar-bubble" />
                <Image src={team3Img} alt="Team member 3" className="why-avatar-bubble" />
                <Image src={team4Img} alt="Team member 4" className="why-avatar-bubble" />
              </div>
              <div className="why-rating-info">
                <div className="why-rating-stars-row">
                  <span className="why-rating-stars">★★★★★</span>
                  <span className="why-rating-val">4.9/5</span>
                </div>
                <p className="why-rating-label">TRUSTED BY TOP BRANDS</p>
              </div>
            </div>
          </div>

          {/* Center Column: Title + Scroll Highlight Quote */}
          <div className="why-col-center">
            <h2 className="why-main-title">
              Trusted <span className="by-text">by</span><br />
              great teams
            </h2>
            
            <p ref={textRef} className="why-middle-text">
              {words.map((word, idx) => {
                const threshold = idx / words.length;
                const isActive = scrollProgress > threshold;
                return (
                  <span key={idx} className="why-word-wrapper">
                    <span className={`why-word ${isActive ? "active" : ""}`}>
                      {word}
                    </span>
                    {" "}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Right Column: Sidebar Description */}
          <div className="why-col-right">
            <p className="why-header-desc">
              We partner with ambitious teams and deliver work that performs in the real world.
            </p>
          </div>

        </div>



        {/* Bottom Double Marquee Slider Container */}
        <div className={`testimonials-slider-section reveal-item ${isRevealed ? "revealed" : ""}`} style={{ transitionDelay: "0.2s" }}>
          <h3 className="testimonials-slider-heading">Real stories from teams we&apos;ve partnered with</h3>
          
          <div className="testimonials-double-marquee">
            
            {/* Row 1: Leftward Marquee */}
            <div 
              ref={row1Ref}
              className="testimonials-scroll-row"
              onMouseEnter={() => { isRow1Hovered.current = true; }}
              onMouseLeave={() => { isRow1Hovered.current = false; }}
            >
              <div className="testimonials-row-track">
                {[...row1Testimonials, ...row1Testimonials].map((item, idx) => (
                  <div key={`r1-${idx}`} className="testimonial-card">
                    <p className="testimonial-card-text">&ldquo;{item.quote}&rdquo;</p>
                    <div className="testimonial-card-footer">
                      <Image src={item.avatar} alt={item.name} className="testimonial-card-avatar" />
                      <div className="testimonial-card-author-info">
                        <h4 className="testimonial-card-author-name">{item.name}</h4>
                        <p className="testimonial-card-author-role">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Rightward Marquee */}
            <div 
              ref={row2Ref}
              className="testimonials-scroll-row"
              onMouseEnter={() => { isRow2Hovered.current = true; }}
              onMouseLeave={() => { isRow2Hovered.current = false; }}
            >
              <div className="testimonials-row-track">
                {[...row2Testimonials, ...row2Testimonials].map((item, idx) => (
                  <div key={`r2-${idx}`} className="testimonial-card">
                    <p className="testimonial-card-text">&ldquo;{item.quote}&rdquo;</p>
                    <div className="testimonial-card-footer">
                      <Image src={item.avatar} alt={item.name} className="testimonial-card-avatar" />
                      <div className="testimonial-card-author-info">
                        <h4 className="testimonial-card-author-name">{item.name}</h4>
                        <p className="testimonial-card-author-role">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
