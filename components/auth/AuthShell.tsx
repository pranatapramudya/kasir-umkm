import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Car,
  Building2,
  Package,
  Utensils,
  Store,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Receipt,
  Smartphone,
  Server
} from "lucide-react";

interface AuthShellProps {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}

export function AuthShell({ mode, children }: AuthShellProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-blue-500 selection:text-white text-slate-800">
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (lg:grid split-screen) — Professional Light SaaS Theme    */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid lg:grid-cols-12 min-h-screen w-full">
        {/* Left Column: Brand & Ecosystem Showcase */}
        <div className="lg:col-span-6 xl:col-span-7 bg-white/90 border-r border-slate-200/90 relative flex flex-col justify-between p-8 xl:p-14 overflow-hidden select-none">
          {/* Subtle Luminous Ambient Background Glows */}
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-sky-50/80 rounded-full blur-3xl pointer-events-none" />

          {/* Desktop Top Header (Distraction-Free Enterprise Standard) */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-700 p-0.5 shadow-[0_8px_16px_-4px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden shadow-inner">
                  <Image
                    src="/logo-app.png"
                    alt="PJTECH UMKM Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-slate-900">
                    PJTECH UMKM
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs">
                    v2.5 Enterprise
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Ekosistem Kasir & Operasional Bisnis Terpadu
                </p>
              </div>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-[11px] font-extrabold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Operasional Aktif</span>
            </div>
          </div>

          {/* Desktop Showcase Content */}
          <div className="relative z-10 my-auto py-6 xl:py-10 space-y-5 max-w-xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Ekosistem Kasir & Operasional Bisnis Terlengkap</span>
            </div>

            <div className="space-y-2.5">
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Tingkatkan Skala Bisnis Anda dengan{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  Sistem Kasir & Booking Terintegrasi
                </span>
              </h1>
              <p className="text-sm xl:text-base text-slate-600 leading-relaxed">
                Mulai dari kasir kilat, kalender sewa armada, kamar & alat, hingga invoice A4 resmi dan pembukuan akuntansi laba-rugi multi-tenant yang aman.
              </p>
            </div>

            {/* 5 Sektor Bisnis Matrix Cards */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* 1. Rental & Travel */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Rental & Travel</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Kalender armada, rute BBM & invoice A4 DP/lunas resmi.
                </p>
              </div>

              {/* 2. Properti & Kamar */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Properti & Kamar</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Sewa harian/jam, sinkronisasi okupansi kos & villa.
                </p>
              </div>

              {/* 3. Alat & Barang */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Alat & Barang</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Sewa sound, tenda, kamera, delivery fee & deposit.
                </p>
              </div>

              {/* 4. F&B, Kafe & Resto */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-2xs">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">F&B, Kafe & Resto</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Manajemen meja, monitor dapur KDS, & split bill.
                </p>
              </div>

              {/* 5. Retail & Jasa Servis */}
              <div className="col-span-2 p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Retail, Toko & Servis Jasa</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Scan barcode kilat, thermal Bluetooth 58/80mm, stok multi-satuan, & booking antrean servis.
                </p>
              </div>
            </div>

            {/* Social Proof & Guarantees */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>100% Data Multi-Tenant Terisolasi Aman</span>
                </div>
                <span className="text-blue-600/80 text-[11px] font-semibold">Cloud Native</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 pt-1 border-t border-blue-200/60">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" /> Siap di HP & Komputer
                </span>
                <span className="flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-slate-500" /> Struk Thermal & A4
                </span>
                <span className="flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-slate-500" /> Bebas Biaya Server
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
            <span>&copy; 2026 PJTECH UMKM (pjtechumkm.com)</span>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-800 cursor-pointer">Privasi & Keamanan</span>
              <span>•</span>
              <span className="hover:text-slate-800 cursor-pointer">Bantuan</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form Panel */}
        <div className="lg:col-span-6 xl:col-span-5 bg-slate-50 flex flex-col justify-between p-8 xl:p-12 min-h-screen relative overflow-y-auto">
          {/* Subtle Radial Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-slate-50 to-slate-100/60 pointer-events-none" />

          {/* Desktop Mode Switcher */}
          <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-end pb-6">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-500">
                {isSignIn ? "Belum punya akun?" : "Sudah punya akun?"}
              </span>
              <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
              >
                {isSignIn ? "Daftar Gratis" : "Masuk di sini"}
              </Link>
            </div>
          </div>

          {/* Clerk Component */}
          <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center">
            <div className="w-full flex justify-center">
              {children}
            </div>
          </div>

          {/* Security & Trust Badges */}
          <div className="relative z-10 w-full max-w-md mx-auto pt-6 text-center">
            <div className="inline-flex items-center justify-center gap-4 text-[11px] text-slate-600 font-medium py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>SSL 256-Bit</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Multi-Tenant Aman</span>
              </span>
              <span className="text-slate-300">•</span>
              <span>Uptime 99.9%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Dilindungi sistem autentikasi enterprise berstandar industri.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (lg:hidden) — 3D Lightweight Header ALL-IN-ONE (Tanpa Geser)*/}
      {/* ========================================================================= */}
      <div className="lg:hidden min-h-screen w-full bg-slate-50 flex flex-col justify-between p-3.5 sm:p-5 relative overflow-x-hidden font-sans">
        {/* Soft Ambient Background Glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-100/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* 1. KARTU HEADER 3D MODERN & RINGAN — DISTRACTION-FREE ENTERPRISE */}
        <header className="relative z-10 w-full max-w-md mx-auto">
          <div className="relative bg-gradient-to-b from-white via-white to-slate-50/95 border border-slate-200/90 rounded-3xl p-3 sm:p-3.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_4px_10px_-2px_rgba(37,99,235,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden">
            {/* Subtle 3D Top Bevel Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />

            {/* Top Bar: 3D Logo + Identity & Verified Portal Badge */}
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2.5 min-w-0">
                {/* 3D App Emblem with Bevel & Drop Shadow */}
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-700 p-0.5 shadow-[0_6px_14px_-2px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.5)] shrink-0 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center overflow-hidden shadow-inner">
                    <Image
                      src="/logo-app.png"
                      alt="PJTECH UMKM"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm sm:text-base text-slate-900 tracking-tight truncate">
                      PJTECH UMKM
                    </span>
                    <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border border-blue-200/80 shadow-2xs shrink-0">
                      v2.5
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold truncate">
                    Ekosistem Kasir & Operasional
                  </p>
                </div>
              </Link>

              {/* Status Badge: Enterprise Security Verification */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-extrabold text-emerald-700 shadow-2xs shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Portal Resmi</span>
              </div>
            </div>

            {/* 5 SEKTOR USAHA ALL-IN-ONE GRID — KELIHATAN SEMUA TANPA GESER */}
            <div className="mt-2.5 pt-2 border-t border-slate-100/90 grid grid-cols-5 gap-1 sm:gap-1.5">
              {/* 1. Rental */}
              <div className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl bg-white border border-amber-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-amber-300 transition-colors">
                <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Car className="w-3 h-3" />
                </div>
                <span className="text-[9.5px] font-black text-slate-800 mt-0.5 tracking-tight truncate w-full text-center">Rental</span>
              </div>

              {/* 2. Properti */}
              <div className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl bg-white border border-teal-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-teal-300 transition-colors">
                <div className="w-5 h-5 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Building2 className="w-3 h-3" />
                </div>
                <span className="text-[9.5px] font-black text-slate-800 mt-0.5 tracking-tight truncate w-full text-center">Properti</span>
              </div>

              {/* 3. Alat & Barang */}
              <div className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl bg-white border border-indigo-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-indigo-300 transition-colors">
                <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Package className="w-3 h-3" />
                </div>
                <span className="text-[9.5px] font-black text-slate-800 mt-0.5 tracking-tight truncate w-full text-center">Alat</span>
              </div>

              {/* 4. F&B */}
              <div className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl bg-white border border-rose-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-rose-300 transition-colors">
                <div className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Utensils className="w-3 h-3" />
                </div>
                <span className="text-[9.5px] font-black text-slate-800 mt-0.5 tracking-tight truncate w-full text-center">F&B</span>
              </div>

              {/* 5. Retail & Jasa */}
              <div className="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl bg-white border border-blue-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-blue-300 transition-colors">
                <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Store className="w-3 h-3" />
                </div>
                <span className="text-[9.5px] font-black text-slate-800 mt-0.5 tracking-tight truncate w-full text-center">Retail</span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. FORMULIR CLERK — PRESISI DI TENGAH-TENGAH */}
        <main className="relative z-10 w-full max-w-md mx-auto my-auto py-3 flex flex-col items-center justify-center space-y-3">
          {/* Clerk Form Injection */}
          <div className="w-full flex justify-center">
            {children}
          </div>

          {/* Switch Mode Prompt for Mobile */}
          <div className="text-center text-xs font-semibold text-slate-600 pt-0.5">
            {isSignIn ? (
              <p>
                Belum memiliki akun?{" "}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-bold underline ml-1">
                  Daftar Sekarang
                </Link>
              </p>
            ) : (
              <p>
                Sudah memiliki akun?{" "}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-bold underline ml-1">
                  Masuk di Sini
                </Link>
              </p>
            )}
          </div>
        </main>

        {/* 3. FOOTER TRUST BADGES */}
        <footer className="relative z-10 w-full max-w-md mx-auto pt-1 pb-1 text-center space-y-1.5">
          <div className="inline-flex items-center justify-center gap-3 text-[10px] text-slate-600 font-semibold py-1.5 px-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>SSL 256-Bit</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Multi-Tenant Aman</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>Uptime 99.9%</span>
          </div>
          <p className="text-[10px] text-slate-400">
            &copy; 2026 PJTECH UMKM (pjtechumkm.com). Hak Cipta Dilindungi.
          </p>
        </footer>
      </div>
    </div>
  );
}
