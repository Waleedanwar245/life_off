import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false, // Remove the X-Powered-By header for security
  images: {
    domains: ['liveoffcoupon.com'], // Add your image domains here
  },
  // Optional: Add trailing slashes for better SEO
  // trailingSlash: true,
};

export default nextConfig;