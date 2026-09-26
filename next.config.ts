import type { NextConfig } from "next";

// Static export for shared hosting (Hostinger). `npm run build` writes the site to `out/`.
// Redirects are not supported by static export — they live in public/.htaccess instead.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
