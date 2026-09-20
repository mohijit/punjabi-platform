import type { NextConfig } from "next";

/**
 * The app is a static site: all the learner's data lives in their own browser,
 * there is no backend, and every route can be rendered at build time. Exporting
 * plain HTML keeps hosting free and trivial, and it is what Cloudflare Pages
 * serves from the `out/` directory.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // No image optimizer exists on a static host; the app ships SVG and text.
    unoptimized: true,
  },
};

export default nextConfig;
