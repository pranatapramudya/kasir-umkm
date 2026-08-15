import POSAppClient from './page-client';
import { Sidebar } from '@/components/Sidebar';
import { checkSubscriptionStatus } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Store, BarChart3, Receipt, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Suspense } from 'react';
import { MiniChartWrapper } from '@/components/MiniChartWrapper';

export const dynamic = 'force-dynamic';

export default async function POSApp() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  const isSuperadmin = role === 'SUPERADMIN';

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
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex overflow-hidden relative">

        {/* LEFT SIDE: SHOWCASE (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-24 relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
          </div>

          <div className="relative z-10 max-w-2xl mt-16 lg:mt-0">
            <h2 className="text-5xl xl:text-6xl font-black tracking-tighter text-slate-900 leading-[1.1] mb-6">
              Sistem Point of Sale <br />
              Era Modern.
            </h2>
            <p className="text-lg text-slate-600 mb-6 max-w-xl leading-relaxed">
              Kelola bisnis F&B, Retail, Jasa, hingga Rental & Travel Anda dengan satu platform yang dirancang untuk kecepatan, keamanan, dan skalabilitas di kelas <em className="text-blue-100 font-serif italic font-medium tracking-wide">Enterprise</em>.
            </p>

            {/* Isometric / Bento Grid Mockup */}
            <div
              className="relative w-full aspect-[4/3] rounded-[2rem] transition-all duration-700 ease-out group"
              style={{ perspective: '1200px' }}
            >
              <div
                className="absolute inset-0 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-5 grid grid-cols-3 gap-3 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] transition-all duration-700 ease-out group-hover:rotate-0 group-hover:scale-100"
                style={{ transform: 'rotateY(12deg) rotateX(8deg) scale(0.85)', transformStyle: 'preserve-3d' }}
              >
                {/* Dummy Dashboard UI */}
                <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-100/60 p-5 flex flex-col justify-between shadow-sm transition-transform duration-300 hover:-translate-y-1 overflow-hidden relative">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <span className="text-sm font-bold text-slate-700">Total Pendapatan</span>
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black tracking-tighter text-blue-950 mb-1">Rp 14.500.000</h3>
                    <div className="inline-flex items-center gap-1 bg-green-100/80 px-2 py-1 rounded-md text-xs font-bold text-green-700">
                      +12.5% vs bulan lalu
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full overflow-hidden rounded-b-2xl">
                    <MiniChartWrapper />
                  </div>
                </div>

                <div className="col-span-1 row-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-center items-center text-center transition-transform duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Transaksi</p>
                  <p className="text-xl font-black text-slate-800">142</p>
                </div>

                <div className="col-span-1 row-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-center items-center text-center transition-transform duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">STAFF AKTIF</p>
                  <p className="text-xl font-black text-slate-800">12</p>
                </div>

                {/* Recent Transactions list mock */}
                <div className="col-span-3 bg-white/90 rounded-2xl border border-slate-100 p-4 flex items-center justify-between shadow-sm mt-2 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-green-200">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 mb-0.5">Pesanan Selesai #1042</p>
                      <p className="text-xs font-medium text-slate-500">Baru saja - Kasir Utama</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Rp 250.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              <SignInButton fallbackRedirectUrl="/admin" forceRedirectUrl="/admin">
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all border-0 flex items-center justify-center gap-2 text-lg active:scale-95">
                  Masuk (Owner) <ArrowRight className="w-5 h-5" />
                </button>
              </SignInButton>
              
              <div>
                <SignInButton fallbackRedirectUrl="/admin" forceRedirectUrl="/admin">
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
