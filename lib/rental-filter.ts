import { detectRentalItemType, getTenantRentalType } from "@/lib/business-category";

export type RentalNiche = "property" | "vehicle" | "equipment";

export interface RentalNicheConfig {
  label: string;
  icon: string;
  unitLabel: string;
  addonLabel: string;
  idFieldLabel: string;
  documentTitle: string;
  searchPlaceholder: string;
  emptyCartMessage: string;
  terms: {
    item: string;
    itemPlural: string;
    transaction: string;
    pos: string;
    idField: string;
    document: string;
    checkIn: string;
    checkOut: string;
  };
  tabs: {
    value: string;
    label: string;
    filter?: (p: any) => boolean;
  }[];
}

export const RENTAL_NICHE_CONFIG: Record<RentalNiche, RentalNicheConfig> = {
  property: {
    label: "Properti & Kamar",
    icon: "🏨",
    unitLabel: "Kamar & Unit",
    addonLabel: "Layanan & Tambahan",
    idFieldLabel: "No. Kamar / Unit",
    documentTitle: "Form Reservasi & Check-in",
    searchPlaceholder: "Cari kamar / villa / layanan...",
    emptyCartMessage: "Belum ada kamar/layanan dipilih. Silakan pilih unit atau tarik pesanan online.",
    terms: {
      item: "Kamar/Unit",
      itemPlural: "Kamar/Unit",
      transaction: "Reservasi",
      pos: "Kasir Reservasi",
      idField: "No. Kamar",
      document: "Invoice Reservasi",
      checkIn: "Check-in",
      checkOut: "Check-out",
    },
    tabs: [
      { value: "ALL", label: "Semua" },
      { value: "UNIT", label: "Unit Fisik (Kamar)", filter: (p: any) => !p.isService },
      { value: "ADDON", label: "Layanan & Tambahan (Addon)", filter: (p: any) => p.isService },
    ],
  },
  vehicle: {
    label: "Rental & Travel",
    icon: "🚗",
    unitLabel: "Kendaraan & Armada",
    addonLabel: "Layanan & Supir",
    idFieldLabel: "Plat / No. Polisi",
    documentTitle: "Form Surat Jalan & Armada",
    searchPlaceholder: "Cari armada / plat / supir...",
    emptyCartMessage: "Belum ada armada dipilih. Silakan pilih armada atau tarik pesanan online.",
    terms: {
      item: "Kendaraan",
      itemPlural: "Armada",
      transaction: "Penyewaan",
      pos: "Kasir Sewa Kendaraan",
      idField: "Plat Kendaraan",
      document: "Surat Jalan & Invoice",
      checkIn: "Ambil Kendaraan",
      checkOut: "Kembalikan",
    },
    tabs: [
      { value: "ALL", label: "Semua" },
      { value: "UNIT", label: "Unit Fisik (Kendaraan)", filter: (p: any) => !p.isService },
      { value: "ADDON", label: "Layanan & Supir", filter: (p: any) => p.isService },
    ],
  },
  equipment: {
    label: "Rental Alat & Barang",
    icon: "📦",
    unitLabel: "Alat & Barang",
    addonLabel: "Layanan & Operator",
    idFieldLabel: "Kode Unit / Serial",
    documentTitle: "Form Sewa & Peminjaman",
    searchPlaceholder: "Cari alat / barang / kode...",
    emptyCartMessage: "Belum ada alat dipilih. Silakan pilih alat atau tarik pesanan online.",
    terms: {
      item: "Alat/Barang",
      itemPlural: "Peralatan",
      transaction: "Penyewaan Alat",
      pos: "Kasir Sewa Alat",
      idField: "Kode Unit",
      document: "Bukti Sewa & Peminjaman",
      checkIn: "Ambil Alat",
      checkOut: "Kembalikan Alat",
    },
    tabs: [
      { value: "ALL", label: "Semua" },
      { value: "UNIT", label: "Unit Fisik (Alat)", filter: (p: any) => !p.isService },
      { value: "ADDON", label: "Layanan & Operator", filter: (p: any) => p.isService },
    ],
  },
};

export function resolveRentalNiche(category?: string | null, tenantName?: string | null, products?: any[]): RentalNiche {
  return getTenantRentalType(category, tenantName, products) || "property";
}
