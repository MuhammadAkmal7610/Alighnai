import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Exclude studio from static export due to React version compatibility
  excludeDefaultMomentLocales: false,
  async redirects() {
    return [
      { source: "/content", destination: "/admin/content", permanent: true },
      { source: "/pages", destination: "/admin/pages", permanent: true },
      { source: "/pages/:id/edit", destination: "/admin/pages/:id/edit", permanent: true },
      { source: "/settings", destination: "/admin/settings", permanent: true },
      { source: "/categories", destination: "/admin/categories", permanent: true },
      { source: "/users", destination: "/admin/users", permanent: true },
      { source: "/info", destination: "/admin/info", permanent: true },
      { source: "/chat", destination: "/admin/chat", permanent: true },
      { source: "/preview/:path*", destination: "/admin/preview/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
