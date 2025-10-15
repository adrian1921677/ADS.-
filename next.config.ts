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
  // Hilft Turbopack bei ESM/TS-Paketen
  transpilePackages: ['@react-email/render', '@react-email/components', 'react-email'],
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
