import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { redis, isRedisConfigured } from "@/lib/redis-cache";

// ==========================================
// SECURITY HEADERS (Applied to ALL responses)
// ==========================================
const SECURITY_HEADERS = [
  ['X-Frame-Options', 'DENY'],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ['Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.yourdomain.com https://*.clerk.accounts.dev",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.clerk.accounts.dev https://api.clerk.com wss://*.pusher.com https://*.sentry.io",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')]
] as const;

// CORS for API routes (restrict to your domains)
const CORS_HEADERS = [
  ['Access-Control-Allow-Origin', 'https://pjtechumkm.com'],
  ['Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'],
  ['Access-Control-Allow-Headers', 'Content-Type, Authorization'],
  ['Access-Control-Max-Age', '86400'],
] as const;

function applySecurityHeaders(response: NextResponse) {
  SECURITY_HEADERS.forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

function applyCorsHeaders(response: NextResponse) {
  CORS_HEADERS.forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

// Lindungi rute admin
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)'
]);

const isAdminChildRoute = createRouteMatcher([
  '/admin/(.*)'
]);

const isSuperAdminRoute = createRouteMatcher(['/superadmin(.*)']);

// ==========================================
// REDIS-BASED RATE LIMITING (persistent, survives deploy)
// Fallback to in-memory if Redis unavailable
// ==========================================
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 60; // 60 req/menit per IP

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  
  try {
    if (isRedisConfigured) {
      // Redis sliding window using sorted set (timestamp as score)
      const now = Date.now();
      const windowStart = now - RATE_LIMIT_WINDOW_MS;
      
      // Remove expired entries
      await redis.zremrangebyscore(key, 0, windowStart);
      
      // Count current requests in window
      const count = await redis.zcard(key);
      
      if (count >= RATE_LIMIT_MAX) {
        return false;
      }
      
      // Add current request - @upstash/redis zadd syntax: zadd(key, { score: number, member: string }[])
      await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });
      await redis.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) + 1);
      return true;
    }
  } catch (err) {
    console.warn('[RateLimit] Redis error, fallback to in-memory:', err);
  }
  
  // Fallback: in-memory rate limit
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true; 
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true; 
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; 
  }

  record.count += 1;
  return true; 
}

// ==========================================
// LOG SANITIZATION - Remove PII from logs
// ==========================================
const PII_PATTERNS = [
  /(customerPhone|phone|whatsapp|noHp|noTelp)["\s:=]+["']?([^"',\s]+)["']?/gi,
  /(cardNumber|creditCard|ccNum)["\s:=]+["']?([^"',\s]+)["']?/gi,
  /(webhookSecret|secret|apiKey|token|password)["\s:=]+["']?([^"',\s]+)["']?/gi,
  /(email)["\s:=]+["']?([^"',\s]+@[^"',\s]+)["']?/gi,
];

function sanitizeLogInput(input: any): string {
  const str = typeof input === 'string' ? input : JSON.stringify(input);
  let sanitized = str;
  for (const pattern of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match, key, value) => {
      const masked = value.length > 4 ? value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2) : '****';
      return `${key}: "${masked}"`;
    });
  }
  return sanitized;
}

// Safe console.error wrapper
const originalError = console.error;
console.error = (...args: any[]) => {
  const sanitizedArgs = args.map(arg => sanitizeLogInput(arg));
  originalError.apply(console, sanitizedArgs);
};

export default clerkMiddleware(async (auth, req) => {
  // === RATE LIMITING CHECK ===
  if (req.nextUrl.pathname.startsWith('/api')) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
    const isAllowed = await checkRateLimit(ip);

    if (!isAllowed) {
      const resp = NextResponse.json({ success: false, message: 'Too Many Requests' }, { status: 429 });
      return applySecurityHeaders(applyCorsHeaders(resp));
    }
  }

  const authObject = await auth();
  const { userId, sessionClaims } = authObject;
  
  // Dapatkan role dari sessionClaims (bisa dari root role atau metadata)
  const role = sessionClaims?.role || (sessionClaims?.metadata as { role?: string })?.role;

  // Intercept SUPERADMIN
  if (role === 'SUPERADMIN') {
    if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/admin')) {
      const resp = NextResponse.redirect(new URL('/superadmin', req.url));
      return applySecurityHeaders(resp);
    }
  }

  // Intercept root URL for authenticated users (CASHIER, ADMIN, dll)
  if (userId && req.nextUrl.pathname === '/' && role !== 'SUPERADMIN') {
    const resp = NextResponse.redirect(new URL('/admin', req.url));
    return applySecurityHeaders(resp);
  }

  // Penanganan rute /superadmin
  if (isSuperAdminRoute(req)) {
    // Gunakan auth.protect() agar Clerk dapat melakukan handshake dengan benar
    await auth.protect();
    
    // ATURAN MUTLAK 2 (Unauthorized)
    if (role !== 'SUPERADMIN') {
      const resp = NextResponse.redirect(new URL('/', req.url));
      return applySecurityHeaders(resp);
    }
  }

  // Penanganan rute /admin (dipertahankan dari kode sebelumnya)
  if (isProtectedRoute(req)) {
    await auth.protect();
    
    // Jika pengguna adalah CASHIER dan mencoba mengakses child-routes admin yang tidak diizinkan
    // Tolak dan kembalikan ke dashboard /admin
    if (role === 'CASHIER' && isAdminChildRoute(req)) {
      const allowedForCashier = ['/admin/booking', '/admin/manajemen-meja', '/admin/kitchen', '/admin/pos'];
      if (!allowedForCashier.some(route => req.nextUrl.pathname.startsWith(route))) {
        const resp = NextResponse.redirect(new URL('/admin', req.url));
        return applySecurityHeaders(resp);
      }
    }
  }

  // For API routes, apply CORS + security headers to the response
  // We need to wrap the response - but clerkMiddleware doesn't give us response directly
  // The headers will be applied by Next.js automatically via next.config.ts headers()
  // But for redirects and 429 responses above, we apply manually
});

export const config = {
  matcher: [
    // Skip Next.js internal files dan semua file statis
    // Tambahan: sw.js, workbox-*, manifest, dan ikon PNG wajib di-skip agar PWA tidak terblokir Clerk
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|sw\.js|workbox-.*|manifest\..*).*)',
    // Tetap eksekusi middleware di rute API
    '/((?!api/webhooks/whatsapp).*)'
  ],
};
