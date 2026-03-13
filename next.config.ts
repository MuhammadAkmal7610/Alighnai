import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Exclude studio from static export due to React version compatibility
  excludeDefaultMomentLocales: false,
};

export default nextConfig;
