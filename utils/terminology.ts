import { isRentalTravelCategory, isServiceBusinessCategory, getTenantRentalType } from "@/lib/business-category";

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
  stockCardTitle: string;
  stockCardDesc: string;
  stockWarningLabel: string;
  paywalDesc: string;
};

export function getTerms(category?: string | null): BusinessTerms {
  const cat = category ?? "";
  const rentalType = getTenantRentalType(cat);

  // 1. Khusus RENTAL PROPERTI / KOS / VILLA / HOTEL
  if (rentalType === "property" || cat.toLowerCase().includes("properti") || cat.toLowerCase().includes("kos") || cat.toLowerCase().includes("hotel") || cat.toLowerCase().includes("villa") || cat.toLowerCase().includes("homestay")) {
    return {
      item: "Unit/Kamar",
      itemPlural: "Kamar/Unit",
      transaction: "Reservasi/Sewa",
      pos: "Kasir Reservasi",
      cost: "Biaya Operasional & Kebersihan",
      chartTitle: "Tren Reservasi & Sewa Unit",
      emptyChart: "Belum ada data reservasi pada periode ini.",
      dashboardSubtitle: "Pantau okupansi unit/kamar dan kesehatan bisnis properti Anda.",
      profitSubtitle: "Pendapatan dikurangi Biaya Operasional & Pengeluaran",
      invoiceLabel: "Reservasi pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Check-in",
      busyHoursDesc: "Analisis jam tersibuk kedatangan / check-in tamu untuk optimasi staf resepsionis.",
      analyticsItemTitle: "Analitik Okupansi Unit / Kamar",
      analyticsItemDesc: "Identifikasi tipe kamar/unit paling sering dipesan dan diminati tamu.",
      stockCardTitle: "Status Ketersediaan Kamar / Unit",
      stockCardDesc: "Pantau ketersediaan unit kamar yang tersisa atau sedang penuh.",
      stockWarningLabel: "Semua kamar & unit siap huni!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat unit terlaris, laporan okupansi detail, dan tren reservasi.",
    };
  }

  // 2. Khusus RENTAL ALAT / PERALATAN / BARANG
  if (rentalType === "equipment" || cat.toLowerCase().includes("alat") || cat.toLowerCase().includes("peralatan") || cat.toLowerCase().includes("kamera") || cat.toLowerCase().includes("outdoor") || cat.toLowerCase().includes("camping") || cat.toLowerCase().includes("sound")) {
    return {
      item: "Alat/Barang",
      itemPlural: "Peralatan",
      transaction: "Penyewaan Alat",
      pos: "Kasir Sewa Alat",
      cost: "Biaya Perawatan & Maintenance",
      chartTitle: "Tren Penyewaan Alat",
      emptyChart: "Belum ada data sewa alat pada periode ini.",
      dashboardSubtitle: "Pantau performa sewa alat dan utilisasi inventaris Anda.",
      profitSubtitle: "Pendapatan dikurangi Biaya Perawatan & Pengeluaran",
      invoiceLabel: "Penyewaan pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Ambil / Balik Alat",
      busyHoursDesc: "Analisis jam tersibuk pengambilan dan pengembalian alat untuk optimasi kru toko.",
      analyticsItemTitle: "Analitik Peralatan Paling Laris",
      analyticsItemDesc: "Identifikasi alat/barang yang paling sering disewa pelanggan.",
      stockCardTitle: "Sisa Unit Alat di Toko",
      stockCardDesc: "Peringatan inventaris alat yang stoknya tersisa sedikit.",
      stockWarningLabel: "Semua unit peralatan tersedia!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat alat terlaris, laporan laba rugi detail, dan tren penyewaan.",
    };
  }

  // 3. Khusus RENTAL KENDARAAN / TRAVEL / ARMADA
  if (rentalType === "vehicle" || isRentalTravelCategory(cat)) {
    return {
      item: "Armada/Unit",
      itemPlural: "Armada",
      transaction: "Penyewaan Armada",
      pos: "Transaksi Sewa Armada",
      cost: "Biaya Operasional & Bensin",
      chartTitle: "Tren Penyewaan Armada",
      emptyChart: "Belum ada data penyewaan pada periode ini.",
      dashboardSubtitle: "Pantau utilisasi armada dan kesehatan bisnis rental Anda.",
      profitSubtitle: "Pendapatan dikurangi Biaya Operasional & Pengeluaran",
      invoiceLabel: "Penyewaan pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Keberangkatan",
      busyHoursDesc: "Analisis jam tersibuk pool armada untuk optimasi jadwal supir dan kendaraan.",
      analyticsItemTitle: "Analitik Armada Paling Laris",
      analyticsItemDesc: "Identifikasi armada yang paling sering disewa dan menghasilkan omset.",
      stockCardTitle: "Ketersediaan Armada",
      stockCardDesc: "Peringatan armada yang stok unitnya tersisa sedikit di pool.",
      stockWarningLabel: "Semua armada siap jalan!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat armada terlaris, laporan laba rugi detail, dan tren penyewaan.",
    };
  }

  // 4. JASA & SERVIS
  if (isServiceBusinessCategory(cat)) {
    return {
      item: "Layanan",
      itemPlural: "Layanan",
      transaction: "Order Jasa",
      pos: "Kasir Jasa",
      cost: "Biaya Alat/Bahan",
      chartTitle: "Tren Order Layanan",
      emptyChart: "Belum ada data layanan pada periode ini.",
      dashboardSubtitle: "Pantau performa layanan dan kesehatan bisnis jasa Anda.",
      profitSubtitle: "Pendapatan dikurangi Biaya Alat/Bahan & Pengeluaran",
      invoiceLabel: "Order jasa pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Layanan",
      busyHoursDesc: "Analisis jam tersibuk outlet Anda untuk optimasi jadwal kerja teknisi/staf.",
      analyticsItemTitle: "Analitik Layanan Terlaris",
      analyticsItemDesc: "Identifikasi paket layanan jasa paling diminati pelanggan.",
      stockCardTitle: "Peringatan Stok Bahan",
      stockCardDesc: "Peringatan stok bahan servis/sparepart yang menipis.",
      stockWarningLabel: "Semua stok bahan jasa aman!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat layanan terlaris, laporan komisi staf, dan tren order.",
    };
  }

  // 5. F&B / KULINER
  if (cat === "F&B" || cat === "FNB" || cat === "F&B / Kuliner" || cat.toLowerCase().includes("kuliner") || cat.toLowerCase().includes("resto") || cat.toLowerCase().includes("kafe")) {
    return {
      item: "Menu",
      itemPlural: "Menu",
      transaction: "Pesanan",
      pos: "Kasir Resto",
      cost: "HPP/Bahan Baku",
      chartTitle: "Tren Pesanan Menu",
      emptyChart: "Belum ada data pesanan pada periode ini.",
      dashboardSubtitle: "Pantau performa pesanan meja dan kesehatan bisnis resto Anda.",
      profitSubtitle: "Pendapatan dikurangi HPP/Bahan Baku & Pengeluaran",
      invoiceLabel: "Pesanan pada periode ini",
      busyHoursTitle: "Grafik Jam Sibuk Restoran",
      busyHoursDesc: "Analisis jam tersibuk dine-in/takeaway untuk optimasi operasional dapur & waiter.",
      analyticsItemTitle: "Analitik Menu Terlaris",
      analyticsItemDesc: "Identifikasi makanan dan minuman paling laris dipesan pelanggan.",
      stockCardTitle: "Peringatan Bahan Baku Menipis",
      stockCardDesc: "Sistem memprediksi bahan makanan/minuman yang segera habis.",
      stockWarningLabel: "Semua stok bahan baku aman!",
      paywalDesc: "Upgrade ke Paket Pro untuk melihat menu terlaris, laporan HPP detail, dan tren pesanan.",
    };
  }

  // 6. Default: RETAIL / TOKO
  return {
    item: "Produk",
    itemPlural: "Produk",
    transaction: "Penjualan",
    pos: "Kasir Toko",
    cost: "HPP Produk",
    chartTitle: "Tren Penjualan Produk",
    emptyChart: "Belum ada data penjualan pada periode ini.",
    dashboardSubtitle: "Pantau performa penjualan produk dan kesehatan bisnis toko Anda.",
    profitSubtitle: "Pendapatan dikurangi HPP & Pengeluaran",
    invoiceLabel: "Faktur pada periode ini",
    busyHoursTitle: "Grafik Jam Sibuk Toko",
    busyHoursDesc: "Analisis jam transaksi tersibuk untuk optimasi jadwal kasir dan pramuniaga.",
    analyticsItemTitle: "Analitik Produk Terlaris",
    analyticsItemDesc: "Identifikasi produk yang paling cepat habis dan menghasilkan profit.",
    stockCardTitle: "Peringatan Stok Cerdas",
    stockCardDesc: "Sistem otomatis memprediksi kapan stok produk akan habis.",
    stockWarningLabel: "Semua stok produk aman!",
    paywalDesc: "Upgrade ke Paket Pro untuk melihat produk terlaris, laporan stok otomatis, dan tren penjualan.",
  };
}
