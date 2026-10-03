/**
 * Editable content for the Careers pages (/careers and /careers/{slug}). Plain JSON in the shape an
 * admin panel / CMS API should return (see lib/careersApi.ts). The job openings themselves live in
 * lib/careersData.ts. Headings are split into a soft (muted) lead-in and a strong part.
 * Tokens in the job-page copy: "{job}" → the job title.
 */

import type { Heading, LinkItem, SeoMeta, StatItem } from "@/lib/servicesContent";

export type CareerIconName = "rocket" | "book" | "clock" | "users" | "heart" | "trend" | "laptop" | "gift" | "spark" | "doc" | "chat" | "check" | "pin";

export interface CareersPageContent {
  name: string;
  seo: SeoMeta;
  hero: {
    label: string;
    title: Heading;
    desc: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    /** Stats; "{count}" in a value is replaced with the number of open roles */
    stats: StatItem[];
    /** Hero art: the main team photo */
    photo: string;
    photoAlt: string;
    /** Avatars + note on the photo */
    avatars: string[];
    teamNote: string;
    /** "Your growth path" card: levels lit one after another */
    growthTitle: string;
    growth: { title: string; note: string }[];
    /** Text circling the round badge ("{count}" open roles sits in the middle) */
    badgeText: string;
    rolesLabel: string;
  };
  perks: {
    label: string;
    title: Heading;
    desc: string;
    items: { icon: CareerIconName; title: string; text: string }[];
  };
  process: {
    label: string;
    title: Heading;
    desc: string;
    steps: { title: string; text: string; time: string }[];
  };
  openings: {
    label: string;
    title: Heading;
    desc: string;
    allLabel: string;
    searchPlaceholder: string;
    typeLabel: string;
    countLabel: string;
    viewLabel: string;
    emptyTitle: string;
    emptyText: string;
    clearLabel: string;
    general: { title: string; text: string; cta: LinkItem };
  };
}

export interface JobPageContent {
  hero: {
    applyCta: LinkItem;
    backCta: LinkItem;
    locationLabel: string;
    experienceLabel: string;
    salaryLabel: string;
    typeLabel: string;
    /** Stamp on the job ticket art */
    stamp: string;
    ticketLabel: string;
  };
  details: {
    aboutTitle: string;
    responsibilitiesTitle: string;
    requirementsTitle: string;
    niceTitle: string;
    offerTitle: string;
    offer: string[];
    processTitle: string;
    summaryTitle: string;
    applyLabel: string;
    shareLabel: string;
    postedLabel: string;
  };
  form: {
    label: string;
    title: string;
    desc: string;
    tips: string[];
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    phonePlaceholder: string;
    countrySearchPlaceholder: string;
    cityLabel: string;
    experienceLabel: string;
    experienceOptions: string[];
    typeLabel: string;
    noticeLabel: string;
    noticeOptions: string[];
    salaryLabel: string;
    portfolioLabel: string;
    linkedinLabel: string;
    cvLabel: string;
    cvHint: string;
    cvDrop: string;
    cvBrowse: string;
    cvReplace: string;
    cvTooBig: string;
    cvBadType: string;
    letterLabel: string;
    letterPlaceholder: string;
    privacyText: string;
    submitLabel: string;
    sendingLabel: string;
    successTitle: string;
    successText: string;
    againLabel: string;
    errorText: string;
  };
  others: { label: string; title: Heading; cta: LinkItem };
}

export const careersPageContent: CareersPageContent = {
  name: "Careers",
  seo: {
    title: "Careers — Jobs in Design, Development & Digital Marketing",
    description:
      "Join Entec Media in Zirakpur, Punjab. Open roles for UI/UX and graphic designers, React and Flutter developers, SEO and performance marketers, plus internships.",
  },
  hero: {
    label: "CAREERS",
    title: { soft: "Do your best work", strong: "with good people" },
    desc: "We design, build and grow brands for clients across India and abroad. Join a small, friendly team where your ideas ship, your skills grow and your work is seen.",
    primaryCta: { label: "View open roles", href: "#openings" },
    secondaryCta: { label: "How we hire", href: "#process" },
    stats: [
      { value: "{count}", label: "Open roles" },
      { value: "250+", label: "Projects shipped" },
      { value: "5 days", label: "Avg. hiring time" },
    ],
    photo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=75",
    photoAlt: "The Entec Media team working together on client projects",
    avatars: ["/images/team1-avatar.webp", "/images/team2-avatar.webp", "/images/team3-avatar.webp", "/images/team4-avatar.webp"],
    teamNote: "Join a team of creators",
    growthTitle: "Your growth path",
    growth: [
      { title: "Intern", note: "Learn by doing" },
      { title: "Executive", note: "Own your projects" },
      { title: "Senior", note: "Lead the craft" },
      { title: "Team Lead", note: "Grow the team" },
    ],
    badgeText: "JOIN THE TEAM • JOIN THE TEAM • ",
    rolesLabel: "open roles",
  },
  perks: {
    label: "+ LIFE AT ENTEC",
    title: { soft: "More than a job —", strong: "a place to grow" },
    desc: "Small team, real responsibility and people who have your back. Here's what working with us looks like.",
    items: [
      { icon: "rocket", title: "Real projects from day one", text: "Work on live websites, apps and campaigns for real clients — your work goes out into the world." },
      { icon: "book", title: "Learning budget", text: "Courses, certifications and books paid for, plus weekly knowledge-sharing sessions." },
      { icon: "clock", title: "Flexible & hybrid", text: "Hybrid options for many roles and sensible hours — we care about results, not hours at a desk." },
      { icon: "users", title: "Mentors who care", text: "Senior designers, developers and marketers who review your work and help you level up." },
      { icon: "trend", title: "Clear growth path", text: "Regular reviews, honest feedback and a clear route to senior roles and better pay." },
      { icon: "heart", title: "A friendly culture", text: "Team lunches, festivals and celebrations — and colleagues who are genuinely good to work with." },
    ],
  },
  process: {
    label: "+ HOW WE HIRE",
    title: { soft: "A simple, respectful", strong: "hiring process" },
    desc: "No endless rounds. You'll know where you stand at every step — usually within a week.",
    steps: [
      { title: "Apply online", text: "Send your details and CV through the form on the job page — it takes about 3 minutes.", time: "Day 1" },
      { title: "Quick call", text: "A friendly 15-minute call to get to know you and answer your questions.", time: "Day 2–3" },
      { title: "Skill round", text: "A short, practical task or portfolio walkthrough — no trick questions.", time: "Day 3–5" },
      { title: "Offer & onboarding", text: "Meet the team, get your offer and a clear plan for your first month.", time: "Day 5–7" },
    ],
  },
  openings: {
    label: "+ OPEN POSITIONS",
    title: { soft: "Find your", strong: "next role" },
    desc: "Filter by team or job type. Open any role to see the details and apply in a few minutes.",
    allLabel: "All teams",
    searchPlaceholder: "Search roles",
    typeLabel: "Job type",
    countLabel: "open roles",
    viewLabel: "View & apply",
    emptyTitle: "No roles match your filters",
    emptyText: "Try another team or job type — or send us your CV for future openings.",
    clearLabel: "Clear filters",
    general: {
      title: "Don't see your role?",
      text: "We're always happy to meet talented people. Send your CV and we'll get in touch when something fits.",
      cta: { label: "Send your CV", href: "/careers/general-application" },
    },
  },
};

export const jobPageContent: JobPageContent = {
  hero: {
    applyCta: { label: "Apply now", href: "#apply" },
    backCta: { label: "All open roles", href: "/careers#openings" },
    locationLabel: "Location",
    experienceLabel: "Experience",
    salaryLabel: "Salary",
    typeLabel: "Job type",
    stamp: "NOW HIRING • NOW HIRING • ",
    ticketLabel: "Open role",
  },
  details: {
    aboutTitle: "About the role",
    responsibilitiesTitle: "What you'll do",
    requirementsTitle: "What we're looking for",
    niceTitle: "Nice to have",
    offerTitle: "What you'll get",
    offer: [
      "Real client projects and ownership of your work",
      "Learning budget for courses and certifications",
      "Mentorship from senior team members",
      "Regular reviews and a clear growth path",
      "Friendly team, celebrations and team lunches",
    ],
    processTitle: "What happens after you apply",
    summaryTitle: "Role summary",
    applyLabel: "Apply for this role",
    shareLabel: "Share this job",
    postedLabel: "Department",
  },
  form: {
    label: "APPLY NOW",
    title: "Apply for {job}",
    desc: "Fill in your details and attach your CV — we reply to every application within 5 working days.",
    tips: [
      "Your CV can be PDF, Word (DOC/DOCX), RTF, ODT, Pages, TXT or an image — up to 8 MB.",
      "Add your portfolio or GitHub link if you have one — it helps a lot.",
      "A few lines about why you'd like to join go a long way.",
    ],
    nameLabel: "Full name",
    emailLabel: "Email address",
    phoneLabel: "Phone number",
    phonePlaceholder: "98765 43210",
    countrySearchPlaceholder: "Search country or code",
    cityLabel: "Current city",
    experienceLabel: "Total experience",
    experienceOptions: ["Fresher", "Less than 1 year", "1–2 years", "2–4 years", "4–6 years", "6+ years"],
    typeLabel: "Preferred job type",
    noticeLabel: "Notice period",
    noticeOptions: ["Immediately", "15 days", "30 days", "60 days", "90 days"],
    salaryLabel: "Expected salary (optional)",
    portfolioLabel: "Portfolio / GitHub / website",
    linkedinLabel: "LinkedIn profile",
    cvLabel: "Your CV / resume",
    cvHint: "PDF, DOC, DOCX, RTF, ODT, Pages, TXT, JPG or PNG · max 8 MB",
    cvDrop: "Drag & drop your CV here, or",
    cvBrowse: "browse files",
    cvReplace: "Replace",
    cvTooBig: "That file is larger than 8 MB — please upload a smaller one.",
    cvBadType: "Please upload a PDF, Word, RTF, ODT, Pages, TXT or image file.",
    letterLabel: "Why would you like to join us?",
    letterPlaceholder: "Tell us a little about yourself, your best work and what you're looking for…",
    privacyText: "By applying, you agree to our {privacy}. We keep applications for up to 12 months.",
    submitLabel: "Submit application",
    sendingLabel: "Uploading…",
    successTitle: "Application sent!",
    successText: "Thank you for applying — our team will review your application and get back to you within 5 working days.",
    againLabel: "Apply for another role",
    errorText: "We couldn't send your application right now.",
  },
  others: {
    label: "+ MORE OPENINGS",
    title: { soft: "Explore other", strong: "open roles" },
    cta: { label: "View all roles", href: "/careers#openings" },
  },
};
