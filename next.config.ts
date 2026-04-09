import type { NextConfig } from "next";

const PRODUCTION_URL = "https://www.jandrnwconstruction.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // In local dev, proxy /uploads/* to the production server so images
  // stored only on the VPS are still visible when running locally.
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      return [];
    }
    return [
      {
        source: "/uploads/:path*",
        destination: `${PRODUCTION_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
