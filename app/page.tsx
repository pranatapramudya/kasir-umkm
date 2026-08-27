import Link from 'next/link';
import { Store, ArrowRight } from "lucide-react";
import { Suspense } from 'react';
import { ClientCachePurger } from '@/components/ClientCachePurger';
import { ClientShowcaseWrapper } from '@/components/ClientShowcaseWrapper';


export default function LandingPage() {
  // Jika sudah login, middleware otomatis akan mengarahkan user ke /admin atau /superadmin
  // Jadi halaman ini hanya akan diakses oleh pengguna yang belum login.
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Landing Page...</div>}>
      <ClientCachePurger />
      <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex overflow-hidden relative">

        {/* LEFT SIDE: SHOWCASE (Hidden on Mobile) */}
        <ClientShowcaseWrapper />

        {/* RIGHT SIDE: AUTH (Glassmorphism) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-20">
          <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:rounded-[2.5rem]">

            <div className="flex flex-col items-center mb-6">
              <Link href="/superadmin" prefetch={false} className="cursor-pointer flex flex-col items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Portal Superadmin">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center" aria-hidden="true">
                  <Store className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PJTECH KASIR UMKM</span>
                </h1>
              </Link>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2 text-center">Selamat Datang</h3>
            <p className="text-slate-600 font-medium text-center mb-10">Masuk atau daftar untuk mulai mengelola bisnis Anda dengan cerdas.</p>

            <div className="w-full space-y-3">
              <Link href="/sign-in?redirect_url=/auth-callback" prefetch={false} className="w-full block py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all border-0 flex items-center justify-center gap-2 text-lg active:scale-95" aria-label="Masuk sebagai Owner">
                Masuk (Owner) <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>

              <div>
                <Link href="/sign-in?redirect_url=/auth-callback" prefetch={false} className="w-full block py-4 bg-white/50 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg active:scale-95" aria-label="Masuk sebagai Karyawan">
                  Login sebagai Karyawan
                </Link>
                <p className="text-xs text-slate-600 text-center mt-2">
                  *Gunakan email & password yang diberikan oleh atasan Anda.
                </p>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
              Pemilik Bisnis Baru? <Link href="/sign-up?redirect_url=/onboarding" prefetch={false} className="text-blue-600 font-semibold hover:underline" aria-label="Daftar Toko Baru">Daftar Toko di sini</Link>
            </p>
          </div>

          <p className="mt-8 text-[11px] font-medium text-slate-500 text-center max-w-xs">
            Dilindungi oleh keamanan tingkat industri. <br />
            Dengan melanjutkan, Anda menyetujui Ketentuan Layanan.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
