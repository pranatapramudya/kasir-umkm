import { LayoutDashboard, PackageSearch, BarChart, Settings, ShoppingCart, Wallet, Users, CreditCard, CalendarCheck, ShieldCheck, Printer, Inbox, ChefHat } from "lucide-react";
import { isRentalTravelCategory, isServiceBusinessCategory, isPureServiceCategory, getFnbSubType } from "@/lib/business-category";

export type FnbSubType = "cafe" | "resto" | "generic";

export function isFnBCategory(category: string): boolean {
  const normalized = category?.toLowerCase().trim();
  return normalized === "fnb" || normalized === "f&b" || normalized === "f&b / kuliner" || normalized === "resto" || normalized === "kuliner";
}

// Re-export from business-category as single source of truth
export { getFnbSubType } from "@/lib/business-category";

export function getNavigationMenu(kategoriUsaha: string, role: string | undefined) {
  const isServiceBusiness = isServiceBusinessCategory(kategoriUsaha);
  const isRentalTravel = isRentalTravelCategory(kategoriUsaha);
  const isFnB = isFnBCategory(kategoriUsaha);
  const isJasa = isPureServiceCategory(kategoriUsaha);
  const isCashier = role === 'CASHIER';

  const kasirLabel = isFnB ? "Kasir Resto" : isRentalTravel ? "Transaksi Sewa" : isServiceBusiness ? "Kasir Jasa" : "Kasir POS";
  const productMenuLabel = isRentalTravel ? "Unit / Properti / Armada" : isFnB ? "Daftar Menu" : isServiceBusiness ? "Layanan" : "Produk";

  const menuGroups = [
      {
        group: "MENU UTAMA",
        items: [
          { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
          { name: kasirLabel, href: "/admin/pos", icon: ShoppingCart },
          ...(isFnB ? [
            { name: "Manajemen Meja", href: "/admin/manajemen-meja", icon: LayoutDashboard }
          ] : []),
          ...(isRentalTravel ? [{ name: "Kalender Sewa", href: "/admin/rental-calendar", icon: CalendarCheck }] : []),
          ...(isJasa ? [{ name: "Jadwal Booking", href: "/admin/booking", icon: CalendarCheck }] : []),
          { name: "Laporan Shift", href: "/laporan-kasir", icon: Wallet },
        ]
      },
    {
      group: "MANAJEMEN BISNIS",
      items: [
        { name: productMenuLabel, href: "/admin/products", icon: PackageSearch },
        { name: "Karyawan", href: "/admin/karyawan", icon: Users },
        { name: "Pengeluaran", href: "/admin/pengeluaran", icon: Wallet }
      ]
    },
    {
      group: "SISTEM & LAPORAN",
      items: [
        { name: "Analitik", href: "/admin/analytics", icon: BarChart },
        ...(isServiceBusiness ? [{ name: "Rekap Komisi", href: "/admin/rekap-komisi", icon: Wallet }] : []),
        { name: "Langganan", href: "/admin/subscription", icon: CreditCard },
        { name: "Rekomendasi Hardware", href: "/admin/hardware", icon: Printer },
        { name: "Keamanan", href: "/admin/settings/security", icon: ShieldCheck },
        { name: "Informasi Toko", href: "/admin/settings", icon: Settings }
      ]
    }
  ];

  return menuGroups.map(group => {
    if (isCashier && group.group !== "MENU UTAMA") {
      return { ...group, items: [] };
    }
    return group;
  }).filter(group => group.items.length > 0);
}
