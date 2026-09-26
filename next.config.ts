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

// ==========================================
// SECURITY HEADERS & CORS (Applied globally via Next.js headers())
// ==========================================
const SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.yourdomain.com https://*.clerk.accounts.dev",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.clerk.accounts.dev https://api.clerk.com wss://*.pusher.com https://*.sentry.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ') }
];

const CORS_HEADERS = [
  { key: 'Access-Control-Allow-Origin', value: 'https://pjtechumkm.com' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
  { key: 'Access-Control-Max-Age', value: '86400' },
];

const nextConfig: NextConfig = {
  // turbopack: {} → beri tahu Next.js 16 bahwa kita tidak punya turbopack config khusus.
  // Ini men-silence error "webpack config but no turbopack config" saat `next dev`.
  // Production build menggunakan webpack (via --webpack flag di script "build").
  turbopack: {},
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
  },
  // Security headers & CORS for all routes
  async headers() {
    return [
      {
        // Apply security headers to ALL routes
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
      {
        // Apply CORS to API routes only
        source: '/api/:path*',
        headers: CORS_HEADERS,
      },
      {
        // Handle OPTIONS preflight for API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://pjtechumkm.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  // Body size limit for API routes (DoS protection)
  // Note: This applies to all API routes via middleware body parser config
  // For Next.js 15+, we can use experimental.serverActions.bodySizeLimit
  // But for API routes, we need to handle in middleware or individual routes
};

export default withAnalyzer(withSerwist(nextConfig));
