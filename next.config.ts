import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repo = "ai-delegation-checklist";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves the project site under /<repo>/
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
