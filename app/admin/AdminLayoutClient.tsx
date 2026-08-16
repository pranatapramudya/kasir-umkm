"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, PackageSearch, Settings, Store, BarChart, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { CustomUserButton } from "@/components/CustomUserButton";

export default function AdminLayoutClient({
  children,
  sidebar,

  isExpired = false
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;

  isExpired?: boolean;
}) {
  const pathname = usePathname();



  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
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
  }, [isLoaded, user, router, pathname]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold">Memuat Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pb-20 lg:pb-0">
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {isExpired && (
          <div className="bg-red-600 text-white p-2 text-center text-sm font-bold shadow-sm z-50 shrink-0">
            ⚠️ Masa aktif paket berlangganan Anda telah berakhir. Harap perpanjang paket untuk dapat menggunakan fitur Kasir POS.
          </div>
        )}
        {/* HEADER */}
        {!pathname.startsWith('/admin/pos') && (
          <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 print:hidden">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Sistem Manajemen</h2>
            </div>
            <div className="flex items-center gap-4">
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
