import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      // Handle subdomain routes
      {
        source: '/store/:subdomain*',
        destination: '/store/:subdomain*',
      },
    ];
  },
};

export default nextConfig;
