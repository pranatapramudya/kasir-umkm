"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PackageSearch,
  BarChart,
  Settings,
  ShoppingCart,
  Wallet,
  Users,
  FileText,
  Grid,
  X,
  CreditCard,
  CalendarCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";

interface BottomNavClientProps {
  kategoriUsaha?: string;
}

export function BottomNavClient({ kategoriUsaha: rawKategori }: BottomNavClientProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const role = user?.publicMetadata?.role;
  const kategoriUsaha = rawKategori ?? "Retail";
  const isJasa = isServiceBusinessCategory(kategoriUsaha);
  const isRentalTravel = isRentalTravelCategory(kategoriUsaha);
  const isFnB = kategoriUsaha === "F&B / Kuliner";
  const kasirLabel = isFnB ? "Kasir Resto" : isRentalTravel ? "Kasir Rental" : isJasa ? "Kasir Jasa" : "Kasir POS";
  const productMenuLabel = isRentalTravel ? "Data Armada" : isJasa ? "Layanan" : "Produk";
  const bookingMenuLabel = isRentalTravel ? "Kalender Sewa" : "Jadwal Booking";

  // CASHIER ONLY
  const cashierNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: kasirLabel, href: "/", icon: ShoppingCart },
    { name: "Laporan Shift", href: "/laporan-kasir", icon: Wallet },
  ];

  // OWNER Main Nav Items (4 items) — category-aware
  const ownerMainNavItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: kasirLabel, href: "/", icon: ShoppingCart },
    {
      name: productMenuLabel,
      href: "/admin/products",
      icon: PackageSearch,
    },
    { name: "Analitik", href: "/admin/analytics", icon: BarChart },
  ];

  // OWNER More Drawer Items — category-aware
  const ownerMoreItems = [
    { name: "Laporan Shift", href: "/laporan-kasir", icon: Wallet },
    ...(isJasa
      ? [{ name: bookingMenuLabel, href: "/admin/booking", icon: CalendarCheck }]
      : []),
    { name: "Karyawan", href: "/admin/karyawan", icon: Users },
    { name: "Pengeluaran", href: "/admin/pengeluaran", icon: Wallet },
    { name: "Langganan", href: "/admin/subscription", icon: CreditCard },
    { name: isRentalTravel ? "Informasi Toko" : "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  const mainNavItems = role === "CASHIER" ? cashierNavItems : ownerMainNavItems;
  const isMoreActive = ownerMoreItems.some((item) => item.href === pathname);

  return (
    <>
      <nav className="fixed bottom-0 w-full bg-white border-t shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40 lg:hidden">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto relative px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
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
                    className={`flex items-center justify-center transition-all duration-200 ${
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
                  </div>
                  <span
                    className={`text-[10px] transition-colors ${
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

          {/* TOMBOL LAINNYA UNTUK OWNER */}
          {role !== "CASHIER" && (
            <div className="flex justify-center flex-1 h-full relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`flex flex-col items-center justify-center w-full h-full group touch-manipulation active:scale-95 transition-all duration-150 ${
                  isMoreActive && !isMoreOpen ? "pb-2" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center transition-all duration-200 ${
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
      {role !== "CASHIER" && isMoreOpen && (
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

            <div className="grid grid-cols-4 gap-4">
              {ownerMoreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex flex-col items-center gap-2 group touch-manipulation active:scale-90 transition-all duration-150"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-150 ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-50 text-slate-600 group-hover:bg-slate-100 active:bg-blue-50"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
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
    </>
  );
}
