import nextDynamic from 'next/dynamic';
import { checkSubscriptionStatus } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Store, ArrowRight } from "lucide-react";
import { Suspense } from 'react';

// Code Splitting & Lazy Loading: Mencegah ~3MB payload pada halaman utama untuk user yang belum login
const POSAppClient = nextDynamic(() => import('./page-client'));
const Sidebar = nextDynamic(() => import('@/components/Sidebar').then(mod => mod.Sidebar));
const ClientCachePurger = nextDynamic(() => import('@/components/ClientCachePurger').then(mod => mod.ClientCachePurger));
const LandingShowcase = nextDynamic(() => import('@/components/LandingShowcase'), { ssr: false });

export const dynamic = 'force-dynamic';

export default async function POSApp() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  let isSuperadmin = role === 'SUPERADMIN';

  if (userId && process.env.SUPER_ADMIN_USER_IDS?.includes(userId)) {
    isSuperadmin = true;
  }

  if (isSuperadmin) {
    redirect('/superadmin');
  }

  // Jika sudah login dan bukan superadmin, muat halaman POS.
  if (userId && !isSuperadmin) {
    const { isExpired } = await checkSubscriptionStatus();
    let targetUserId = userId;
    let isEmployee = false;

    // Langkah 1: Cek apakah pengguna adalah Owner (punya tenant di database)
    let tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });

    // Langkah 2: Jika bukan Owner, cek apakah dia adalah Karyawan/Kasir
    if (!tenant) {
      const employee = await prisma.employee.findUnique({
        where: { clerkUserId: userId }
      });

      // Langkah 3: Jika Karyawan, arahkan ke POS dari toko tempat ia bekerja
      if (employee) {
        isEmployee = true;
        targetUserId = employee.tenantId;
        tenant = await prisma.tenant.findUnique({ where: { userId: targetUserId } });
      }
    }

    // Langkah 4: Jika bukan Owner dan bukan Karyawan, barulah arahkan ke onboarding
    if (!tenant && !isEmployee) {
      redirect('/onboarding');
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: { userId: targetUserId, isArchived: false },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.product.count({ where: { userId: targetUserId, isArchived: false } })
    ]);

    return (
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading POS...</div>}>
        <POSAppClient
          sidebar={<Sidebar />}
          isExpired={isExpired}
          initialData={{
            products,
            totalPages: Math.max(1, Math.ceil(totalCount / 10))
          }}
          tenantName={tenant?.name || ""}
          tenantCategory={tenant?.category || ""}
          tenantPhone={tenant?.phone || ""}
        />
      </Suspense>
    );
  }

  // Jika belum login, tampilkan Landing Page Premium
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Landing Page...</div>}>
      <ClientCachePurger />
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex overflow-hidden relative">

        {/* LEFT SIDE: SHOWCASE (Hidden on Mobile) */}
        <LandingShowcase />

        {/* RIGHT SIDE: AUTH (Glassmorphism) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-20">
          <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:rounded-[2.5rem]">

            {/* LOGO & SUPERADMIN BACKDOOR */}
            <div className="flex flex-col items-center mb-6">
              <Link href="/superadmin" className="cursor-pointer flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                  <Store className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PJTECH KASIR UMKM</span>
                </h1>
              </Link>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2 text-center">Selamat Datang</h3>
            <p className="text-slate-500 font-medium text-center mb-10">Masuk atau daftar untuk mulai mengelola bisnis Anda dengan cerdas.</p>

            <div className="w-full space-y-3">
              <SignInButton fallbackRedirectUrl="/auth-callback" forceRedirectUrl="/auth-callback">
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all border-0 flex items-center justify-center gap-2 text-lg active:scale-95">
                  Masuk (Owner) <ArrowRight className="w-5 h-5" />
                </button>
              </SignInButton>

              <div>
                <SignInButton fallbackRedirectUrl="/auth-callback" forceRedirectUrl="/auth-callback">
                  <button className="w-full py-4 bg-transparent border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg active:scale-95">
                    Login sebagai Karyawan
                  </button>
                </SignInButton>
                <p className="text-xs text-slate-500 text-center mt-2">
                  *Gunakan email & password yang diberikan oleh atasan Anda.
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
              Pemilik Bisnis Baru? <SignUpButton fallbackRedirectUrl="/onboarding" forceRedirectUrl="/onboarding"><button className="text-blue-600 font-semibold hover:underline">Daftar Toko di sini</button></SignUpButton>
            </p>
          </div>

          <p className="mt-8 text-[11px] font-medium text-slate-400 text-center max-w-xs">
            Dilindungi oleh keamanan tingkat industri. <br />
            Dengan melanjutkan, Anda menyetujui Ketentuan Layanan.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
