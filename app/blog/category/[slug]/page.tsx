import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedBlogs, getBlogCategories } from "@/lib/blogApi";
import BlogListingView from "@/components/blog/BlogListingView";
import PageHero from "@/components/shared/PageHero";
import AboutCTA from "@/components/about/AboutCTA";

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
  const categories = await getBlogCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: cat.meta_title || `${cat.name} Articles`,
    description: cat.meta_description || cat.description || `Explore the latest ${cat.name} articles from Entec Media.`,
    alternates: { canonical: `/blog/category/${cat.slug}` },
  };
}

export default async function CategoryArchivePage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, { blogs }] = await Promise.all([getBlogCategories(), getPublishedBlogs({ limit: 1000 })]);
  const currentCategory = categories.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  return (
    <div className="k-page blog-page-wrapper">
      <PageHero
        label="+ CATEGORY"
        title={
          <>
            <span className="k-muted">{currentCategory.name}</span>
            <br />
            articles &amp; guides
          </>
        }
        desc={currentCategory.description || `Articles and practical guides about ${currentCategory.name} from the Entec Media team.`}
      />
      <div className="k-page-body">
        <BlogListingView allBlogs={blogs} categories={categories} category={slug} search="" syncUrl={false} />
        <AboutCTA source={`blog-category-${slug}`} />
      </div>
    </div>
  );
}
