import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || "https://entecmedia.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/blog-cms/", "/admin/", "/api/admin/", "/blog-api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
