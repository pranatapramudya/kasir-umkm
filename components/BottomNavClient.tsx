"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import {
  Grid,
  X,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getNavigationMenu } from "@/lib/navigation";
import { BukuPanduanModal } from "./BukuPanduanModal";
import { usePendingBookingCount } from "@/hooks/usePendingBookingCount";

interface BottomNavClientProps {
  kategoriUsaha?: string;
}

export function BottomNavClient({ kategoriUsaha: rawKategori }: BottomNavClientProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isBukuPanduanOpen, setIsBukuPanduanOpen] = useState(false);

  const hiddenPaths = ['/sign-in', '/sign-up', '/onboarding', '/pending-approval'];
  if (hiddenPaths.includes(pathname) || pathname.startsWith('/admin/login') || pathname.startsWith('/superadmin') || pathname.startsWith('/auth-callback') || pathname.startsWith('/book') || pathname.startsWith('/toko')) {
    return null;
  }

  const role = user?.publicMetadata?.role as string | undefined;
  const kategoriUsaha = rawKategori ?? "Retail";

  // SWR Polling & Real-time Chime Alert
  const { pendingCount } = usePendingBookingCount(role);

  const isOrderMenuItem = (item: { name: string; href: string }) => {
    const name = item.name.toLowerCase();
    return (
      item.href === "/admin/orders" ||
      item.href === "/admin/rental-calendar" ||
      name === "pesanan online" ||
      name.includes("pesanan") ||
      name.includes("inbox")
    );
  };

  // Use the Single Source of Truth
  const menuGroups = getNavigationMenu(kategoriUsaha, role);
  
  // Flatten all items from all groups
  const allNavItems = menuGroups.flatMap(group => group.items);
  
  // First 4 items go to the bottom bar, the rest go to the "More" modal
  const mainNavItems = allNavItems.slice(0, 4);
  const moreItems = allNavItems.slice(4);

  const isMoreActive = moreItems.some((item) => item.href === pathname);
  const hasPendingInMore = moreItems.some(isOrderMenuItem) && pendingCount > 0;

  return (
    <>
      <nav className="fixed bottom-0 w-full bg-white border-t shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40 lg:hidden print:hidden">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto relative px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isOrderItem = isOrderMenuItem(item);
            const shouldShowBadge = isOrderItem && pendingCount > 0;

            return (
              <div key={item.name} className="flex justify-center flex-1 h-full relative">
                <Link
                  href={item.href}
                  prefetch={true}
                  onClick={() => setIsMoreOpen(false)}
                  className={`flex flex-col items-center w-full h-full group touch-manipulation active:scale-95 transition-all duration-150 ${
                    isActive ? "justify-end pb-2" : "justify-center"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center transition-all duration-200 relative ${
                      isActive
                        ? "absolute -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm border-4 border-slate-50"
                        : "w-auto h-auto bg-transparent shadow-none mb-1"
                    }`}
                  >
                    <Icon
                      className={`transition-all duration-200 ${
                        isActive
                          ? "w-6 h-6 text-white"
                          : "w-5 h-5 text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {shouldShowBadge && (
                      <span
                        className={`absolute ${
                          isActive ? "-top-1 -right-1" : "-top-1.5 -right-2.5"
                        } bg-rose-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm pointer-events-none animate-in zoom-in duration-200`}
                      >
                        {pendingCount > 99 ? "99+" : pendingCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] whitespace-nowrap text-center transition-colors ${
                      isActive
                        ? "font-bold text-blue-600"
                        : "font-medium text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </div>
            );
          })}

          {/* TOMBOL LAINNYA JIKA ADA SISA MENU */}
          {moreItems.length > 0 && (
            <div className="flex justify-center flex-1 h-full relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex flex-col items-center justify-center w-full h-full group touch-manipulation active:scale-95 transition-all duration-150 ${
                  isMoreActive && !isMoreOpen ? "pb-2" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center transition-all duration-200 relative ${
                    (isMoreActive && !isMoreOpen) || isMoreOpen
                      ? "absolute -top-5 w-14 h-14 rounded-full bg-slate-800 shadow-lg shadow-slate-700/50 border-4 border-slate-50"
                      : "w-auto h-auto bg-transparent shadow-none mb-1"
                  }`}
                >
                  <Grid
                    className={`transition-all duration-200 ${
                      (isMoreActive && !isMoreOpen) || isMoreOpen
                        ? "w-6 h-6 text-white"
                        : "w-5 h-5 text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {hasPendingInMore && (
                    <span
                      className={`absolute ${
                        (isMoreActive && !isMoreOpen) || isMoreOpen
                          ? "-top-1 -right-1"
                          : "-top-1.5 -right-2.5"
                      } bg-rose-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm pointer-events-none animate-in zoom-in duration-200`}
                    >
                      {pendingCount > 99 ? "99+" : pendingCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] transition-colors ${
                    (isMoreActive && !isMoreOpen) || isMoreOpen
                      ? "font-bold text-slate-800"
                      : "font-medium text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  Lainnya
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MORE DRAWER (BOTTOM SHEET) */}
      {moreItems.length > 0 && isMoreOpen && (
        <div className="fixed inset-0 z-30 flex items-end justify-center lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMoreOpen(false)}
          />
          <div className="w-full bg-white rounded-t-3xl shadow-2xl relative z-40 animate-in slide-in-from-bottom-full duration-300 pb-24 pt-6 px-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Menu Lainnya</h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full touch-manipulation active:scale-90 transition-all duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  setIsBukuPanduanOpen(true);
                }}
                className="flex items-center justify-between px-4 py-3 w-full rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md active:scale-[0.98] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-600 transition-colors">
                    <HelpCircle className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm text-blue-900">Pusat Bantuan</span>
                    <span className="text-[10px] font-medium text-blue-600">Panduan & SOP Bisnis Anda</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                const isOrderItem = isOrderMenuItem(item);
                const shouldShowMoreBadge = isOrderItem && pendingCount > 0;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center gap-2 group touch-manipulation active:scale-90 transition-all duration-150"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-150 relative ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-50 text-slate-600 group-hover:bg-slate-100 active:bg-blue-50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {shouldShowMoreBadge && (
                        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-white shadow-sm pointer-events-none animate-in zoom-in duration-200">
                          {pendingCount > 99 ? "99+" : pendingCount}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] text-center font-medium ${
                        isActive ? "text-blue-600 font-bold" : "text-slate-600"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BukuPanduanModal 
        isOpen={isBukuPanduanOpen} 
        onClose={() => setIsBukuPanduanOpen(false)} 
        category={kategoriUsaha} 
      />
    </>
  );
}
