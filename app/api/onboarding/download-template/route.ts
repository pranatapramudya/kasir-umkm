import { NextRequest, NextResponse } from 'next/server';
import { isRentalTravelCategory, isServiceBusinessCategory } from '@/lib/business-category';

// Vercel function timeout: Hobby 10s, Pro 60s - set 30s for safety
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const kategoriUsaha = req.nextUrl.searchParams.get('category') || 'Jasa';
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha);
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';

  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kasir UMKM';
  workbook.created = new Date();

  if (isRental) {
    // Sheet 1: Armada - max 31 chars
    const wsKendaraan = workbook.addWorksheet('1. Armada (Kendaraan, Travel)');
    wsKendaraan.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit / Plat', key: 'name', width: 32 },
      { header: 'Tipe Kendaraan', key: 'tipe', width: 20 },
      { header: 'Transmisi', key: 'transmisi', width: 16 },
      { header: 'Tahun', key: 'tahun', width: 10 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Jam (Rp)', key: 'hargaJam', width: 20 },
      { header: 'Biaya Operasional/Hari (Rp)', key: 'biayaHarian', width: 24 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Catatan / Spesifikasi', key: 'description', width: 50 },
    ];

    // Data validation dropdowns (limit rows to 50 for performance)
    for (let row = 2; row <= 50; row++) {
      wsKendaraan.getCell(`C${row}`).dataValidation = {
        type: 'list', allowBlank: true,
        formulae: ['"MPV,SUV,Sedan,Minibus,Bus,Pickup,Truck,Motor,Matic,Bebek,Sport"'],
        showErrorMessage: true, errorTitle: 'Tipe Tidak Valid',
        error: 'Pilih dari daftar: MPV, SUV, Sedan, Minibus, Bus, Pickup, Truck, Motor, Matic, Bebek, Sport',
      };
      wsKendaraan.getCell(`D${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Manual,Otomatis"'] };
      wsKendaraan.getCell(`I${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'] };
    }

    // SAMPLE DATA - use array syntax for reliability
    wsKendaraan.addRow(['UNT001', 'Avanza Veloz 2023 - B 1234 ABC', 'MPV', 'Otomatis', 2023, 450000, 75000, 100000, 'Tersedia', 'Mobil keluarga, AC double blower, audio touchscreen']);
    wsKendaraan.addRow(['UNT002', 'Innova Reborn 2022 - B 5678 DEF', 'MPV', 'Otomatis', 2022, 650000, 100000, 150000, 'Tersedia', 'Premium MPV, captain seat, sunroof']);
    wsKendaraan.addRow(['UNT003', 'Hiace Commuter 2023 - B 9012 GHI', 'Minibus', 'Manual', 2023, 950000, 150000, 200000, 'Tersedia', 'Travel 12-14 penumpang, AC pendingin kuat']);
    wsKendaraan.addRow(['UNT004', 'NMAX 155 2024 - B 3456 JKL', 'Motor', 'Matic', 2024, 80000, 15000, 20000, 'Tersedia', 'Matic sport, ABS, cocok sewa harian']);
    wsKendaraan.addRow(['UNT005', 'Elf Long 2022 - B 7890 MNO', 'Minibus', 'Manual', 2022, 1200000, 200000, 250000, 'Tersedia', 'Travel 16-18 penumpang, box panjang']);

    // Sheet 2: Properti - max 31 chars
    const wsProperti = workbook.addWorksheet('2. Properti (Kamar, Villa)');
    wsProperti.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit / Plat', key: 'name', width: 32 },
      { header: 'Tipe Properti', key: 'tipe', width: 20 },
      { header: 'Kapasitas', key: 'kapasitas', width: 14 },
      { header: 'Kamar Mandi', key: 'kamarMandi', width: 16 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Bulan (Rp)', key: 'hargaBulanan', width: 22 },
      { header: 'Biaya Operasional/Hari (Rp)', key: 'biayaHarian', width: 24 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Catatan / Fasilitas', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 50; row++) {
      wsProperti.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Kamar Kost,Villa,Apartment,Hotel,Glamping,Studio,Guest House"'] };
      wsProperti.getCell(`E${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Dalam,Luar,Shared"'] };
      wsProperti.getCell(`I${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'] };
    }

    wsProperti.addRow(['PRP001', 'Kamar Deluxe 101 - Lantai 1', 'Kamar Kost', 2, 'Dalam', 150000, 2500000, 20000, 'Tersedia', 'AC, kamar mandi dalam, kasur springbed, wifi']);
    wsProperti.addRow(['PRP002', 'Villa Puncak 2 - Gunung Geulis', 'Villa', 6, 'Dalam', 1500000, 0, 300000, 'Tersedia', '3 kamar tidur, kolam renang private, dapur lengkap']);
    wsProperti.addRow(['PRP003', 'Studio Apartment 3A - Sudirman', 'Apartment', 2, 'Dalam', 450000, 8000000, 50000, 'Tersedia', 'Fully furnished, gym, pool, strategic location']);
    wsProperti.addRow(['PRP004', 'Glamping Tenda Luxury - Taman Safari', 'Glamping', 4, 'Dalam', 800000, 0, 150000, 'Tersedia', 'Tenda glamping 4 orang, AC, toilet dalam, view gunung']);
    wsProperti.addRow(['PRP005', 'Hotel Bisnis Deluxe - Bandung', 'Hotel', 2, 'Dalam', 650000, 0, 100000, 'Tersedia', 'Sarapan gratis, meeting room, laundry service']);

    // Sheet 3: Layanan Tambahan - max 31 chars
    const wsLayanan = workbook.addWorksheet('3. Layanan (Supir, Asuransi)');
    wsLayanan.columns = [
      { header: 'Kode Layanan', key: 'kodeLayanan', width: 18 },
      { header: 'Nama Layanan', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'Harga (Rp)', key: 'harga', width: 18 },
      { header: 'Satuan', key: 'satuan', width: 16 },
      { header: 'Deskripsi', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 50; row++) {
      wsLayanan.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Supir/Bunker,Bensin/Isi Ulang,Asuransi,Antar Jemput,Kebersihan,Lainnya"'] };
    }

    wsLayanan.addRow(['SV001', 'Supir Harian (Dalam Kota)', 'Supir/Bunker', 200000, 'Per Hari', 'Termasuk makan & parkir, max 12 jam']);
    wsLayanan.addRow(['SV002', 'Isi Ulang Bensin Full Tank', 'Bensin/Isi Ulang', 500000, 'Per Unit', 'Pertalite/Pertamax, harga ikut pompa']);
    wsLayanan.addRow(['SV003', 'Asuransi Perjalanan Per Hari', 'Asuransi', 50000, 'Per Hari', 'Cover kerusakan ringan & kecelakaan']);
    wsLayanan.addRow(['SV004', 'Antar Jemput Bandara (Shuttle)', 'Antar Jemput', 350000, 'Per Trip', 'Maks 4 orang + bagasi, area Jabodetabek']);
    wsLayanan.addRow(['SV005', 'Kebersihan Extra / Deep Clean', 'Kebersihan', 150000, 'Per Unit', 'Detailing interior, vacuum, fogging, wc deep clean']);
    wsLayanan.addRow(['SV006', 'WiFi Portable / Pocket WiFi', 'Lainnya', 50000, 'Per Hari', 'Unlimited data 4G/5G, bisa 10 device, powerbank 10000mAh']);

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_rental_travel_properti.xlsx"',
      },
    });
  }

  // --- F&B ---
  if (isFNB) {
    const wsMenu = workbook.addWorksheet('Menu Makanan & Minuman');
    wsMenu.columns = [
      { header: 'Kode Menu (SKU)', key: 'kodeMenu', width: 20 },
      { header: 'Nama Menu', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'HPP / Biaya Bahan (Rp)', key: 'hpp', width: 24 },
      { header: 'Harga Jual (Rp)', key: 'hargaJual', width: 20 },
      { header: 'Tipe', key: 'tipe', width: 14 },
      { header: 'Waktu Persiapan (menit)', key: 'prepTime', width: 22 },
      { header: 'Printer Dapur', key: 'kitchenPrinter', width: 18 },
      { header: 'Modifiers (opsional)', key: 'modifiers', width: 30 },
      { header: 'Resep / Bahan Baku', key: 'recipe', width: 50 },
      { header: 'Deskripsi', key: 'description', width: 40 },
    ];

    for (let row = 2; row <= 50; row++) {
      wsMenu.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: false, formulae: ['"Makanan,Minuman,Appetizer,Dessert,Paket,Nasi,Beras,Sayur,Lauk,Snack"'], showErrorMessage: true, errorTitle: 'Kategori Tidak Valid', error: 'Pilih kategori dari dropdown.' };
      wsMenu.getCell(`F${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Makanan,Minuman"'] };
      wsMenu.getCell(`H${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Dapur,Bar,Khusus,Tidak Cetak"'] };
    }

    wsMenu.addRow(['MKN001', 'Nasi Goreng Spesial', 'Makanan', 15000, 25000, 'Makanan', 10, 'Dapur', 'Level pedas: Tidak pedas, Sedang, Pedas, Extra pedas; Telur: Tanpa, Dadar, Ceplok', 'Beras: 200g; Bawang merah: 3 siung; Bawang putih: 2 siung; Cabai: 5 buah; Kecap manis: 2 sdm; Telur: 1 butir; Minyak goreng: 2 sdm', 'Nasi goreng komplit dengan telur dan kerupuk']);
    wsMenu.addRow(['MKN002', 'Ayam Geprek Sambal Matah', 'Makanan', 18000, 30000, 'Makanan', 15, 'Dapur', 'Level pedas: Tidak pedas, Sedang, Pedas, Extra pedas; Nasi: Putih, Merah', 'Ayam fillet: 150g; Tepung crispy: 50g; Bawang merah: 5 siung; Cabai rawit: 10 buah; Sereh: 1 batang; Jeruk limau: 1 buah; Minyak panas: 3 sdm', 'Ayam crispy digeprek dengan sambal matah khas Bali']);
    wsMenu.addRow(['MNM001', 'Es Teh Manis', 'Minuman', 2000, 5000, 'Minuman', 2, 'Bar', 'Gula: Normal, Kurang, Tambah; Es: Normal, Sedikit, Banyak', 'Teh celup: 1 sachet; Gula pasir: 2 sdm; Air panas: 200ml; Es batu: secukupnya', 'Teh manis segar dengan es batu']);
    wsMenu.addRow(['MNM002', 'Es Jeruk Peras', 'Minuman', 5000, 10000, 'Minuman', 3, 'Bar', 'Gula: Normal, Kurang, Tambah; Es: Normal, Sedikit, Banyak', 'Jeruk nipis: 2 buah; Gula pasir: 2 sdm; Air putih: 200ml; Es batu: secukupnya', 'Jeruk peras segar tanpa pengawet']);
    wsMenu.addRow(['MKN003', 'Mie Ayam Bakso', 'Makanan', 12000, 22000, 'Makanan', 8, 'Dapur', 'Bakso: Tambah, Kurang; Pangsit: Goreng, Rebus; Level pedas: Tidak, Sedang, Pedas', 'Mie telur: 150g; Ayam suwir: 50g; Bakso sapi: 3 butir; Pangsit: 3 buah; Sawi: 50g; Kuah kaldu: 300ml; Bawang goreng: 1 sdm', 'Mie ayam komplit dengan bakso dan pangsit']);

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_fnb.xlsx"',
      },
    });
  }

  // --- Jasa/Servis ---
  if (isJasa) {
    const ws = workbook.addWorksheet('Katalog Jasa & Barang');
    ws.columns = [
      { header: 'Kode Barang (SKU)', key: 'kodeBarang', width: 20 },
      { header: 'Nama Layanan / Produk', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'HPP / Biaya Modal (Rp)', key: 'hpp', width: 24 },
      { header: 'Harga Jual / Tarif (Rp)', key: 'hargaJual', width: 24 },
      { header: 'Qty (Stok)', key: 'stock', width: 16 },
      { header: 'Batas Minimum Stok', key: 'minStockThreshold', width: 22 },
      { header: 'Komisi Staf (Rp)', key: 'komisi', width: 20 },
      { header: 'Deskripsi / Catatan', key: 'description', width: 45 },
    ];

    for (let row = 2; row <= 50; row++) {
      ws.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: false, formulae: ['"Jasa / Servis,Produk / Barang"'], showErrorMessage: true, errorTitle: 'Pilihan Kategori', error: 'Silakan pilih Jasa / Servis atau Produk / Barang dari dropdown.' };
    }

    ws.addRow(['', 'Potong Rambut Pria / Servis Ringan', 'Jasa / Servis', 5000, 45000, '', '', 10000, 'Layanan pangkas + styling (stok otomatis tak terbatas)']);
    ws.addRow(['BRG001', 'Oli Mesin Matic 0.8L / Pomade Styling', 'Produk / Barang', 35000, 55000, 24, 5, 3000, 'Barang fisik dengan kontrol stok']);
    ws.addRow(['BRG002', 'Kampas Rem Depan / Shampoo 500ml', 'Produk / Barang', 25000, 45000, 15, 3, 2000, 'Sparepart / produk konsumable']);

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_jasa.xlsx"',
      },
    });
  }

  // --- Retail fallback ---
  const wsRetail = workbook.addWorksheet('Katalog Produk Retail');
  wsRetail.columns = [
    { header: 'Kode Barang (SKU)', key: 'kodeBarang', width: 20 },
    { header: 'Nama Produk', key: 'name', width: 36 },
    { header: 'Kategori', key: 'category', width: 22 },
    { header: 'HPP / Modal (Rp)', key: 'hpp', width: 20 },
    { header: 'Harga Jual (Rp)', key: 'hargaJual', width: 20 },
    { header: 'Stok Awal', key: 'stock', width: 14 },
    { header: 'Min Stok', key: 'minStockThreshold', width: 14 },
    { header: 'Satuan', key: 'satuan', width: 14 },
    { header: 'Barcode', key: 'barcode', width: 20 },
    { header: 'Diskon %', key: 'discount', width: 12 },
    { header: 'PPN %', key: 'ppn', width: 10 },
    { header: 'Deskripsi', key: 'description', width: 40 },
  ];
  wsRetail.addRow(['BRG001', 'Indomie Goreng', 'Makanan', 2500, 3500, 100, 10, 'Pcs', '8992757123456', 0, 11, 'Mie instan rasa ayam bawang']);
  wsRetail.addRow(['BRG002', 'Aqua 600ml', 'Minuman', 2000, 3000, 200, 20, 'Botol', '8992757123457', 0, 11, 'Air mineral ukuran 600ml']);

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template_import_retail.xlsx"',
    },
  });
}