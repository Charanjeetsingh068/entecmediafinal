import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListingPage from "@/components/blog/BlogListingPage";
import { getBlogCategories } from "@/lib/blogApi";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getBlogCategories()).find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };

  const title = cat.meta_title || `${cat.name} Articles & Guides`;
  const description = cat.meta_description || cat.description || `Practical ${cat.name} articles and guides from the Entec Media team.`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/category/${cat.slug}` },
    openGraph: { title: `${title} | Entec Media`, description, url: `/blog/category/${cat.slug}`, type: "website" },
  };
}

/** A blog category: the Blog page layout with the grid opened on this category. */
export default async function CategoryArchivePage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = (await getBlogCategories()).find((c) => c.slug === slug);
  if (!category) notFound();
  return <BlogListingPage category={category} />;
}
