import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: 'export', // Deaktiviert für Vercel (Serverless)
  trailingSlash: false, // Geändert für bessere Vercel-Kompatibilität
  assetPrefix: '',
  basePath: '',
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
