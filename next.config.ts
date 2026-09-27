import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// @serwist/next menggunakan webpack config.
// SW hanya di-generate saat `next build` (production).
// Saat `next dev`, Turbopack berjalan normal karena SW di-disable.
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Nonaktifkan di development — gunakan Turbopack (next dev) tanpa hambatan
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  // turbopack: {} → beri tahu Next.js 16 bahwa kita tidak punya turbopack config khusus.
  // Ini men-silence error "webpack config but no turbopack config" saat `next dev`.
  // Production build menggunakan webpack (via --webpack flag di script "build").
  turbopack: {},
  metadataBase: new URL('https://www.pjtechumkm.com'),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns']
  }
};

export default withAnalyzer(withSerwist(nextConfig));
