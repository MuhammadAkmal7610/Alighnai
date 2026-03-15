import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Exclude studio from static export due to React version compatibility
  excludeDefaultMomentLocales: false,
};

export default nextConfig;
