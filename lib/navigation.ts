import { LayoutDashboard, PackageSearch, BarChart, Settings, ShoppingCart, Wallet, Users, CreditCard, CalendarCheck, ShieldCheck } from "lucide-react";
import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";

export function getNavigationMenu(kategoriUsaha: string, role: string | undefined) {
  const isServiceBusiness = isServiceBusinessCategory(kategoriUsaha);
  const isRentalTravel = isRentalTravelCategory(kategoriUsaha);
  const isFnB = kategoriUsaha === "F&B / Kuliner";
  const isCashier = role === 'CASHIER';

  const kasirLabel = isFnB ? "Kasir Resto" : isRentalTravel ? "Kasir Rental" : isServiceBusiness ? "Kasir Jasa" : "Kasir POS";
  const productMenuLabel = isRentalTravel ? "Data Armada" : isServiceBusiness ? "Layanan" : "Produk";
  const bookingMenuLabel = isRentalTravel ? "Kalender Sewa" : "Jadwal Booking";

  const menuGroups = [
    {
      group: "MENU UTAMA",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: kasirLabel, href: "/", icon: ShoppingCart },
        { name: "Laporan Shift", href: "/laporan-kasir", icon: Wallet },
        ...(isFnB ? [{ name: "Manajemen Meja", href: "/admin/manajemen-meja", icon: LayoutDashboard }] : []),
        ...(isServiceBusiness ? [{ name: bookingMenuLabel, href: "/admin/booking", icon: CalendarCheck }] : [])
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
        { name: "Keamanan", href: "/admin/settings/security", icon: ShieldCheck },
        ...(isServiceBusiness ? [{ name: "Informasi Toko", href: "/admin/settings", icon: Settings }] : [])
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
