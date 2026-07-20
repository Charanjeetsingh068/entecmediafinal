export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
  imgHeight: string;
  slug: string;
  content: string;
}

export const blogsData: BlogPost[] = [
  {
    id: 1,
    title: "The Power of Minimalism: Why Less is More in Design",
    category: "Design Philosophy",
    date: "Mar 1, 2026",
    description: "Minimalism is more than just an aesthetic choice—it's a philosophy that emphasizes clarity, functionality, and purpose. In design, minimalism strips away unnecessary elements to highlight what truly matters, creating experiences that feel focused and intentional.",
    image: "/images/blogs/minimalism.png",
    imgHeight: "350px",
    slug: "power-of-minimalism",
    content: "Full content for the Power of Minimalism blog post..."
  },
  {
    id: 2,
    title: "Why Investing in Good Design Pays Off for Your Business",
    category: "Business Strategy",
    date: "Feb 3, 2026",
    description: "Design is more than just aesthetics—it's a strategic tool that influences brand perception, customer trust, and business growth. Companies that invest in high-quality design gain a competitive edge and build lasting customer loyalty.",
    image: "/images/blogs/design-value.png",
    imgHeight: "220px",
    slug: "why-design-pays-off",
    content: "Full content for the Investing in Good Design blog post..."
  },
  {
    id: 3,
    title: "The Future of Web Design: Trends You Can't Ignore",
    category: "Tech & Trends",
    date: "Jan 21, 2026",
    description: "Web design is constantly evolving, driven by technological advancements, user expectations, and new creative possibilities. Staying ahead of trends like spatial UI and micro-interactions is essential to deliver engaging digital experiences.",
    image: "/images/blogs/future-trends.png",
    imgHeight: "430px",
    slug: "future-of-web-design",
    content: "Full content for the Future of Web Design blog post..."
  },
  {
    id: 4,
    title: "My Web Design Process: From Concept to Completion",
    category: "Process",
    date: "Dec 10, 2025",
    description: "Designing a website is more than just creating a visually appealing layout—it's about creating an intuitive, functional, and engaging digital experience. A well-structured web design process ensures clarity, collaboration, and high-performance results.",
    image: "/images/blogs/design-process.png",
    imgHeight: "200px",
    slug: "my-web-design-process",
    content: "Full content for the My Web Design Process blog post..."
  }
];
