"use client";

import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, PackageSearch, Settings, Store, BarChart, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { CustomUserButton } from "@/components/CustomUserButton";
import { CopyBookingLinkButton } from "@/components/CopyBookingLinkButton";

export default function AdminLayoutClient({
  children,
  sidebar,
  serverUserId,
  isExpired = false,
  tenantSlug = null,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  isExpired?: boolean;
  serverUserId?: string;
  tenantSlug?: string | null;
}) {
  const pathname = usePathname();



  const { user, isLoaded: isUserLoaded } = useUser();
  const { userId: clientUserId, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoaded && user) {
      const now = new Date();
      const accountCreated = new Date(user.createdAt as Date);
      const trialEndDate = new Date(accountCreated.getTime() + 14 * 24 * 60 * 60 * 1000);
      const isTrialActive = now < trialEndDate;

      if (user.publicMetadata?.plan !== 'pro' && !isTrialActive) {
        if (!pathname.startsWith('/admin/subscription') && !pathname.startsWith('/pricing')) {
          router.push('/');
        }
      }
    }
  }, [isUserLoaded, user, router, pathname]);

  // Strict Tenant Block: Mencegah FOUC / Stale Cache dari session sebelumnya
  if (!isUserLoaded || !isAuthLoaded || (serverUserId && clientUserId && serverUserId !== clientUserId)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium font-mono text-sm tracking-widest uppercase">Menyesuaikan Sesi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {isExpired && (
          <div className="bg-red-600 text-white p-2 text-center text-sm font-bold shadow-sm z-50 shrink-0">
            ⚠️ Masa aktif paket berlangganan Anda telah berakhir. Harap perpanjang paket untuk dapat menggunakan seluruh fitur.
          </div>
        )}
        {/* HEADER */}
        {!pathname.startsWith('/admin/pos') && (
          <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Sistem Manajemen</h2>
            </div>
            <div className="flex items-center gap-3">
              <CopyBookingLinkButton initialSlug={tenantSlug} />
              <CustomUserButton />
            </div>
          </header>
        )}

        {/* PAGE CONTENT */}
        <main className={`${pathname.startsWith('/admin/pos') ? '' : 'p-6'} flex-1 overflow-y-auto relative`}>
          {children}
        </main>
      </div>


    </div>
  );
}
