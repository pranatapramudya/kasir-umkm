"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Lock, AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

import { CustomUserButton } from "@/components/CustomUserButton";
import { CopyBookingLinkButton } from "@/components/CopyBookingLinkButton";

export default function AdminLayoutClient({
  children,
  sidebar,
  serverUserId,
  isExpired = false,
  tenantSlug = null,
  isBookingEnabled = false,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  isExpired?: boolean;
  serverUserId?: string;
  tenantSlug?: string | null;
  isBookingEnabled?: boolean;
}) {
  const pathname = usePathname();

  const { user, isLoaded: isUserLoaded } = useUser();
  const { userId: clientUserId, isLoaded: isAuthLoaded } = useAuth();

  // Strict Tenant Block: Mencegah FOUC / Stale Cache dari session sebelumnya
  if (
    !isUserLoaded ||
    !isAuthLoaded ||
    (serverUserId && clientUserId && serverUserId !== clientUserId)
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium font-mono text-sm tracking-widest uppercase">
          Menyesuaikan Sesi...
        </p>
      </div>
    );
  }

  // Hitung status trial langsung tanpa effect untuk menghindari re-render cascade
  let isTrialActive = true;
  let daysLeft = 14;

  if (user) {
    const now = new Date();
    const accountCreated = new Date(user.createdAt as Date);
    const trialEndDate = new Date(
      accountCreated.getTime() + 14 * 24 * 60 * 60 * 1000,
    );
    isTrialActive = now < trialEndDate;
    const diffDays = Math.ceil(
      (trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    daysLeft = diffDays > 0 ? diffDays : 0;
  }

  const isPro = user?.publicMetadata?.plan === "pro";
  const isLockedOut = Boolean(isExpired || (!isPro && !isTrialActive));
  const isSubscriptionRoute =
    pathname.startsWith("/admin/subscription") ||
    pathname.startsWith("/pricing");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* Jika ter-lock out dan bukan di rute subscription, render overlay blur penuh yang tetap bertahan */}
      {isLockedOut && !isSubscriptionRoute && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 text-center mx-auto border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              Masa Uji Coba Berakhir
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed text-sm md:text-base">
              Masa uji coba 14 hari Anda telah berakhir. Jangan khawatir,{" "}
              <b className="text-slate-800">semua data Anda tetap aman</b>.
              Silakan berlangganan untuk kembali menggunakan seluruh fitur
              sistem.
            </p>
            <Link
              href="/admin/subscription"
              className="flex items-center justify-center w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold rounded-xl transition shadow-md shadow-blue-500/25"
            >
              Langganan Sekarang
            </Link>
          </div>
        </div>
      )}

      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden print:h-auto print:overflow-visible">
        {/* Banner Sisa Trial / Expired */}
        {isLockedOut ? (
          <div className="bg-red-600 text-white p-2.5 text-center text-sm font-bold shadow-sm z-50 shrink-0 print:hidden flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Akses dikunci. Harap perpanjang paket untuk melanjutkan.
            </span>
          </div>
        ) : isTrialActive && daysLeft <= 3 && !isPro ? (
          <div className="bg-amber-500 text-white p-2.5 text-center text-sm font-bold shadow-sm z-50 shrink-0 print:hidden flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Masa uji coba Anda tersisa {daysLeft} hari lagi.</span>{" "}
            <Link
              href="/admin/subscription"
              className="underline hover:text-amber-100 font-semibold"
            >
              Upgrade sekarang
            </Link>
          </div>
        ) : null}

        {/* HEADER */}
        {!pathname.startsWith("/admin/pos") && (
          <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                Sistem Manajemen
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {isBookingEnabled && (
                <CopyBookingLinkButton initialSlug={tenantSlug} />
              )}
              <CustomUserButton />
            </div>
          </header>
        )}

        {/* PAGE CONTENT */}
        <main
          className={`${pathname.startsWith("/admin/pos") ? "flex flex-col h-[calc(100dvh-5rem)] lg:h-full min-h-0 overflow-hidden" : "p-4 sm:p-6 flex-1 min-w-0 lg:overflow-y-auto"} relative print:h-auto print:overflow-visible`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
