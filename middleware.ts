import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Lindungi rute admin
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)'
]);

const isAdminChildRoute = createRouteMatcher([
  '/admin/(.*)'
]);

const isSuperAdminRoute = createRouteMatcher(['/superadmin(.*)']);

// ==========================================
// IN-MEMORY RATE LIMITING
// Melindungi rute /api dari serangan Brute Force & DDoS ringan
// ==========================================
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = 60; // Maksimal 60 request
  const windowMs = 60 * 1000; // per 1 menit (60 detik)

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true; 
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true; 
  }

  if (record.count >= limit) {
    return false; 
  }

  record.count += 1;
  return true; 
}

export default clerkMiddleware(async (auth, req) => {
  // === RATE LIMITING CHECK ===
  if (req.nextUrl.pathname.startsWith('/api')) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip';
    const isAllowed = rateLimit(ip);

    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Too Many Requests' }, { status: 429 });
    }
  }

  const authObject = await auth();
  const { userId, sessionClaims } = authObject;
  
  // Dapatkan role dari sessionClaims (bisa dari root role atau metadata)
  const role = sessionClaims?.role || (sessionClaims?.metadata as { role?: string })?.role;

  // Intercept SUPERADMIN
  if (role === 'SUPERADMIN') {
    if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/superadmin', req.url));
    }
  }

  // Penanganan rute /superadmin
  if (isSuperAdminRoute(req)) {
    // Gunakan auth.protect() agar Clerk dapat melakukan handshake dengan benar
    await auth.protect();
    
    // ATURAN MUTLAK 2 (Unauthorized)
    if (role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Penanganan rute /admin (dipertahankan dari kode sebelumnya)
  if (isProtectedRoute(req)) {
    await auth.protect();
    
    // Jika pengguna adalah CASHIER dan mencoba mengakses child-routes admin yang tidak diizinkan
    // Tolak dan kembalikan ke dashboard /admin
    if (role === 'CASHIER' && isAdminChildRoute(req)) {
      const allowedForCashier = ['/admin/booking', '/admin/manajemen-meja'];
      if (!allowedForCashier.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internal files dan semua file statis
    // Tambahan: sw.js, workbox-*, manifest, dan ikon PNG wajib di-skip agar PWA tidak terblokir Clerk
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|sw\.js|workbox-.*|manifest\..*).*)',
    // Tetap eksekusi middleware di rute API
    '/(api|trpc)(.*)',
  ],
};
