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

export default clerkMiddleware(async (auth, req) => {
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
