import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Next.js config for Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Ensure proper output for Vercel
  experimental: {
    // Enable optimizations
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
};

export default nextConfig;
