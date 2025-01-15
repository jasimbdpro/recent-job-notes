import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = withPWA( {
    dest: "public", // This is where the service worker and other assets will be generated
    register: true, // Automatically registers the service worker
    skipWaiting: true, // Skip waiting on the new service worker
  });

export default nextConfig;
