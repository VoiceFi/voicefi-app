import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tells Next.js to only import the specific exports used, instead of the
    // entire barrel file. Cuts the number of modules Privy loads by ~40%.
    optimizePackageImports: ["@privy-io/react-auth", "lucide-react"],
  },
  // Turbopack alias for optional Privy peer dep we don't use
  turbopack: {
    resolveAlias: {
      "@farcaster/mini-app-solana": "@/lib/empty-module",
    },
  },
  // Webpack fallback (used by `next build` and `next start`)
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@farcaster/mini-app-solana": false,
    };
    return config;
  },
};

export default nextConfig;
