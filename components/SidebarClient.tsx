"use client";

import Link from "next/link";
import { LayoutDashboard, PackageSearch, Store, BarChart, Settings, Wallet, Users, CreditCard, CalendarCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";

interface SidebarClientProps {
  role: string | undefined;
  plan: string;
  endsAt: string | undefined;
  kategoriUsaha: string;
}

export function SidebarClient({ role, plan, endsAt, kategoriUsaha: rawKategoriUsaha }: SidebarClientProps) {
  const kategoriUsaha = rawKategoriUsaha || 'Retail';
  const isServiceBusiness = isServiceBusinessCategory(kategoriUsaha);
  const isRentalTravel = isRentalTravelCategory(kategoriUsaha);
  const kasirLabel = kategoriUsaha === "F&B / Kuliner" ? "Kasir Resto" : isRentalTravel ? "Kasir Rental" : isServiceBusiness ? "Kasir Jasa" : "Kasir POS";
  const productMenuLabel = isRentalTravel ? "Data Armada" : isServiceBusiness ? "Layanan" : "Produk";
  const bookingMenuLabel = isRentalTravel ? "Kalender Sewa" : "Jadwal Booking";
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('toggleSidebar', handleToggle);
    window.addEventListener('closeSidebar', handleClose);
    
    // Auto close on route change (mobile)
    setIsOpen(false);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggle);
      window.removeEventListener('closeSidebar', handleClose);
    };
  }, [pathname]);

  const isCashier = role === 'CASHIER';

  const menuGroups = [
    {
      group: "MENU UTAMA",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: kasirLabel, href: "/", icon: Store },
        { name: "Laporan Shift", href: "/laporan-kasir", icon: Wallet }, // Digunakan Wallet atau FileText
        ...(isServiceBusiness ? [{ name: bookingMenuLabel, href: "/admin/booking", icon: CalendarCheck }] : [])
      ]
    },
    {
      group: "MANAJEMEN BISNIS",
      items: [
        { name: productMenuLabel, href: "/admin/products", icon: PackageSearch },
        ...(kategoriUsaha === "F&B / Kuliner" ? [{ name: "Manajemen Meja", href: "/admin/manajemen-meja", icon: LayoutDashboard }] : []),
        ...(isServiceBusiness ? [{ name: bookingMenuLabel, href: "/admin/booking", icon: CalendarCheck }] : []),
        { name: "Karyawan", href: "/admin/karyawan", icon: Users },
        { name: "Pengeluaran", href: "/admin/pengeluaran", icon: Wallet }
      ]
    },
    {
      group: "SISTEM & LAPORAN",
      items: [
        { name: "Analitik", href: "/admin/analytics", icon: BarChart },
        ...(isServiceBusiness ? [{ name: "Rekap Komisi", href: "/admin/rekap-komisi", icon: Wallet }] : []),
        { name: "Cek Langganan", href: "/admin/subscription", icon: CreditCard },
        { name: "Informasi Toko", href: "/admin/settings", icon: Settings }
      ]
    }
  ];

  const filteredMenuGroups = menuGroups.map(group => {
    // Karyawan HANYA boleh melihat grup "MENU UTAMA"
    if (isCashier && group.group !== "MENU UTAMA") {
      return { ...group, items: [] };
    }
    // Jika ada filter spesifik lain untuk item, bisa ditaruh di sini
    return group;
  }).filter(group => group.items.length > 0);

  return (
    <>
      {/* Overlay Backdrop untuk Mobile/Tablet Portrait */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] z-50 flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col">
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-800 tracking-tight">
            <Store className="w-6 h-6 text-blue-600" />
            KASIR POS
          </h2>
          <span className="text-[10px] text-blue-600 font-bold ml-8 uppercase tracking-wider relative top-[-4px]">by PJTECH</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 flex flex-col justify-between">
        <nav className="space-y-6">
          {filteredMenuGroups.map((group) => (
            <div key={group.group}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">
                {group.group}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={true}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 font-semibold text-sm touch-manipulation active:scale-[0.97] ${isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent active:bg-slate-100"
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
    </>
  );
}
