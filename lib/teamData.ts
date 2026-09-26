// TODO: replace with real team member names and photos.
export interface TeamMember {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Design Team",
    role: "UI/UX, Web & Graphic Design",
    quote: "Good design feels invisible — great design feels inevitable.",
    image: "/images/team1.webp",
  },
  {
    name: "Development Team",
    role: "Websites, Web Apps & Mobile Apps",
    quote: "Code is craft. Every line should respect the experience.",
    image: "/images/team2.webp",
  },
  {
    name: "Marketing Team",
    role: "SEO, Google Ads & Meta Ads",
    quote: "Real growth is measured in leads, not likes.",
    image: "/images/team3.webp",
  },
  {
    name: "Strategy Team",
    role: "Planning, Content & Client Success",
    quote: "Clear thinking before clean design — every time.",
    image: "/images/team4.webp",
  },
];
