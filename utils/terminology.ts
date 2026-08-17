import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";

export type BusinessTerms = {
  item: string;
  itemPlural: string;
  transaction: string;
  pos: string;
  cost: string;
  chartTitle: string;
  emptyChart: string;
  dashboardSubtitle: string;
  profitSubtitle: string;
  invoiceLabel: string;
  busyHoursTitle: string;
  busyHoursDesc: string;
  analyticsItemTitle: string;
  analyticsItemDesc: string;
  stockWarningLabel: string;
  paywalDesc: string;
};

export function getTerms(category?: string | null): BusinessTerms {
  const cat = category ?? "";

  if (isRentalTravelCategory(cat)) {
    return {
      item: "Armada/Unit",
      itemPlural: "Armada",
      transaction: "Penyewaan",
      pos: "Transaksi Sewa",
      cost: "Biaya Operasional",
      chartTitle: "Tren Penyewaan",
      emptyChart: "Belum ada data penyewaan pada periode ini.",
      dashboardSubtitle: "Pantau performa penyewaan dan kesehatan bisnis Anda.",
      profitSubtitle: "Pendapatan dikurangi Biaya Operasional & Pengeluaran",
      invoiceLabel: "Transaksi pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Penyewaan",
      busyHoursDesc: "Analisis jam tersibuk pool Anda untuk optimasi jadwal armada.",
      analyticsItemTitle: "Analitik Armada",
      analyticsItemDesc: "Identifikasi armada paling diminati.",
      stockWarningLabel: "Semua armada tersedia!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat armada terlaris, laporan laba rugi detail, dan tren penyewaan.",
    };
  }

  if (isServiceBusinessCategory(cat) && !isRentalTravelCategory(cat)) {
    return {
      item: "Layanan",
      itemPlural: "Layanan",
      transaction: "Order Jasa",
      pos: "Kasir Jasa",
      cost: "Biaya Alat/Bahan",
      chartTitle: "Tren Layanan",
      emptyChart: "Belum ada data layanan pada periode ini.",
      dashboardSubtitle: "Pantau performa layanan dan kesehatan bisnis Anda.",
      profitSubtitle: "Pendapatan dikurangi Biaya Alat/Bahan & Pengeluaran",
      invoiceLabel: "Transaksi pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Layanan",
      busyHoursDesc: "Analisis jam tersibuk outlet Anda untuk optimasi jam kerja pegawai.",
      analyticsItemTitle: "Analitik Layanan",
      analyticsItemDesc: "Identifikasi layanan paling diminati.",
      stockWarningLabel: "Semua stok bahan aman!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat layanan terlaris, laporan laba rugi detail, dan tren layanan.",
    };
  }

  if (cat === "F&B" || cat === "F&B / Kuliner") {
    return {
      item: "Menu",
      itemPlural: "Menu",
      transaction: "Pesanan",
      pos: "Kasir Resto",
      cost: "HPP/Bahan Baku",
      chartTitle: "Tren Pesanan",
      emptyChart: "Belum ada data pesanan pada periode ini.",
      dashboardSubtitle: "Pantau performa pesanan dan kesehatan bisnis Anda.",
      profitSubtitle: "Pendapatan dikurangi HPP/Bahan Baku & Pengeluaran",
      invoiceLabel: "Transaksi pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Pesanan",
      busyHoursDesc: "Analisis jam tersibuk resto Anda untuk optimasi jam kerja pegawai.",
      analyticsItemTitle: "Analitik Menu",
      analyticsItemDesc: "Identifikasi menu paling diminati.",
      stockWarningLabel: "Semua stok bahan baku aman!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat menu terlaris, laporan laba rugi detail, dan tren pesanan.",
    };
  }

  // Default: Retail
  return {
    item: "Produk",
    itemPlural: "Produk",
    transaction: "Penjualan",
    pos: "Kasir",
    cost: "HPP",
    chartTitle: "Tren Penjualan",
    emptyChart: "Belum ada data penjualan pada periode ini.",
    dashboardSubtitle: "Pantau performa penjualan dan kesehatan bisnis Anda.",
    profitSubtitle: "Pendapatan dikurangi HPP & Pengeluaran",
    invoiceLabel: "Faktur pada periode ini",
    busyHoursTitle: "Grafik Jam Sibuk Penjualan",
    busyHoursDesc: "Analisis jam tersibuk toko Anda untuk optimasi jam kerja pegawai.",
    analyticsItemTitle: "Analitik Produk",
    analyticsItemDesc: "Identifikasi performa produk.",
    stockWarningLabel: "Semua stok produk aman!",
    paywalDesc: "Upgrade ke Paket Pro untuk melihat produk terlaris, laporan laba rugi detail, dan tren penjualan.",
  };
}
