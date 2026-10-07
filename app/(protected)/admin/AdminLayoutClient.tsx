"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Lock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
  
  const router = useRouter();

  const [trialState, setTrialState] = useState({
    isTrialActive: true,
    daysLeft: 14,
    isLockedOut: false,
  });

  useEffect(() => {
    if (isUserLoaded && user) {
      const now = new Date();
      const accountCreated = new Date(user.createdAt as Date);
      const trialEndDate = new Date(accountCreated.getTime() + 14 * 24 * 60 * 60 * 1000);
      const isTrialActive = now < trialEndDate;
      const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      const isPro = user.publicMetadata?.plan === 'pro';
      
      // Kami percaya pada 'isExpired' dari server (karena sudah nge-cek trialEndsAt dari DB)
      // Namun fallback juga ke logic client
      const isLockedOut = isExpired || (!isPro && !isTrialActive);

      setTrialState({
        isTrialActive,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        isLockedOut
      });

      // 1. Paywall Redirect / Guard (Sesuai SOP)
      const isSubscriptionRoute = pathname.startsWith('/admin/subscription') || pathname.startsWith('/pricing');
      if (isLockedOut && !isSubscriptionRoute) {
        router.replace('/admin/subscription?expired=true');
      }
    }
  }, [isUserLoaded, user, isExpired, pathname, router]);

  // Strict Tenant Block: Mencegah FOUC / Stale Cache dari session sebelumnya
  if (!isUserLoaded || !isAuthLoaded || (serverUserId && clientUserId && serverUserId !== clientUserId)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium font-mono text-sm tracking-widest uppercase">Menyesuaikan Sesi...</p>
      </div>
    );
  }

  const isSubscriptionRoute = pathname.startsWith('/admin/subscription') || pathname.startsWith('/pricing');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {/* Jika ter-lock out dan bukan di rute subscription, render overlay blur penuh */}
      {trialState.isLockedOut && !isSubscriptionRoute && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center mx-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Masa Uji Coba Berakhir</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Masa uji coba 14 hari Anda telah berakhir. Jangan khawatir, <b>semua data Anda aman</b>. Silakan berlangganan untuk kembali menggunakan seluruh fitur sistem.
            </p>
            <Link 
              href="/admin/subscription"
              className="flex items-center justify-center w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-200"
            >
              Langganan Sekarang
            </Link>
          </div>
        </div>
      )}

      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:overflow-hidden print:h-auto print:overflow-visible">
        {/* Banner Sisa Trial / Expired */}
        {trialState.isLockedOut ? (
          <div className="bg-red-600 text-white p-2.5 text-center text-sm font-bold shadow-sm z-50 shrink-0 print:hidden flex items-center justify-center gap-2">
            ⚠️ Akses dikunci. Harap perpanjang paket untuk melanjutkan.
          </div>
        ) : (trialState.isTrialActive && trialState.daysLeft <= 3 && user?.publicMetadata?.plan !== 'pro') ? (
          <div className="bg-amber-500 text-white p-2.5 text-center text-sm font-bold shadow-sm z-50 shrink-0 print:hidden flex items-center justify-center gap-2">
            ⏳ Masa uji coba Anda tersisa {trialState.daysLeft} hari lagi. <Link href="/admin/subscription" className="underline hover:text-amber-100">Upgrade sekarang</Link>
          </div>
        ) : null}

        {/* HEADER */}
        {!pathname.startsWith('/admin/pos') && (
          <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Sistem Manajemen</h2>
            </div>
            <div className="flex items-center gap-3">
              {isBookingEnabled && <CopyBookingLinkButton initialSlug={tenantSlug} />}
              <CustomUserButton />
            </div>
          </header>
        )}

        {/* PAGE CONTENT */}
        <main className={`${pathname.startsWith('/admin/pos') ? 'flex flex-col h-[calc(100dvh-5rem)] lg:h-full min-h-0 overflow-hidden' : 'p-4 sm:p-6 flex-1 min-w-0 lg:overflow-y-auto'} relative print:h-auto print:overflow-visible`}>
          {children}
        </main>
      </div>


    </div>
  );
}
