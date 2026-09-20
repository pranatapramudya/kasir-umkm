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
    // Sheet 1: Armada (Kendaraan/Travel) - max 31 chars
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

    // SAMPLE DATA - 5 units cover Travel + Rental Motor + Rental Mobil
    wsKendaraan.addRow({ kodeUnit: 'UNT001', name: 'Avanza Veloz 2023 - B 1234 ABC', tipe: 'MPV', transmisi: 'Otomatis', tahun: 2023, hargaHarian: 450000, hargaJam: 75000, biayaHarian: 100000, status: 'Tersedia', description: 'Mobil keluarga, AC double blower, audio touchscreen' });
    wsKendaraan.addRow({ kodeUnit: 'UNT002', name: 'Innova Reborn 2022 - B 5678 DEF', tipe: 'MPV', transmisi: 'Otomatis', tahun: 2022, hargaHarian: 650000, hargaJam: 100000, biayaHarian: 150000, status: 'Tersedia', description: 'Premium MPV, captain seat, sunroof' });
    wsKendaraan.addRow({ kodeUnit: 'UNT003', name: 'Hiace Commuter 2023 - B 9012 GHI', tipe: 'Minibus', transmisi: 'Manual', tahun: 2023, hargaHarian: 950000, hargaJam: 150000, biayaHarian: 200000, status: 'Tersedia', description: 'Travel 12-14 penumpang, AC pendingin kuat' });
    wsKendaraan.addRow({ kodeUnit: 'UNT004', name: 'NMAX 155 2024 - B 3456 JKL', tipe: 'Motor', transmisi: 'Matic', tahun: 2024, hargaHarian: 80000, hargaJam: 15000, biayaHarian: 20000, status: 'Tersedia', description: 'Matic sport, ABS, cocok sewa harian' });
    wsKendaraan.addRow({ kodeUnit: 'UNT005', name: 'Elf Long 2022 - B 7890 MNO', tipe: 'Minibus', transmisi: 'Manual', tahun: 2022, hargaHarian: 1200000, hargaJam: 200000, biayaHarian: 250000, status: 'Tersedia', description: 'Travel 16-18 penumpang, box panjang' });

    // Sheet 2: Properti - max 31 chars
    const wsProperti = workbook.addWorksheet('2. Properti (Kamar, Villa, Hotel)');
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

    wsProperti.addRow({ kodeUnit: 'PRP001', name: 'Kamar Deluxe 101 - Lantai 1', tipe: 'Kamar Kost', kapasitas: 2, kamarMandi: 'Dalam', hargaHarian: 150000, hargaBulanan: 2500000, biayaHarian: 20000, status: 'Tersedia', description: 'AC, kamar mandi dalam, kasur springbed, wifi' });
    wsProperti.addRow({ kodeUnit: 'PRP002', name: 'Villa Puncak 2 - Gunung Geulis', tipe: 'Villa', kapasitas: 6, kamarMandi: 'Dalam', hargaHarian: 1500000, hargaBulanan: 0, biayaHarian: 300000, status: 'Tersedia', description: '3 kamar tidur, kolam renang private, dapur lengkap' });
    wsProperti.addRow({ kodeUnit: 'PRP003', name: 'Studio Apartment 3A - Sudirman', tipe: 'Apartment', kapasitas: 2, kamarMandi: 'Dalam', hargaHarian: 450000, hargaBulanan: 8000000, biayaHarian: 50000, status: 'Tersedia', description: 'Fully furnished, gym, pool, strategic location' });
    wsProperti.addRow({ kodeUnit: 'PRP004', name: 'Glamping Tenda Luxury - Taman Safari', tipe: 'Glamping', kapasitas: 4, kamarMandi: 'Dalam', hargaHarian: 800000, hargaBulanan: 0, biayaHarian: 150000, status: 'Tersedia', description: 'Tenda glamping 4 orang, AC, toilet dalam, view gunung' });
    wsProperti.addRow({ kodeUnit: 'PRP005', name: 'Hotel Bisnis Deluxe - Bandung', tipe: 'Hotel', kapasitas: 2, kamarMandi: 'Dalam', hargaHarian: 650000, hargaBulanan: 0, biayaHarian: 100000, status: 'Tersedia', description: 'Sarapan gratis, meeting room, laundry service' });

    // Sheet 3: Layanan Tambahan - max 31 chars
    const wsLayanan = workbook.addWorksheet('3. Layanan (Supir, Asuransi, Bsn)');
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

    wsLayanan.addRow({ kodeLayanan: 'SV001', name: 'Supir Harian (Dalam Kota)', category: 'Supir/Bunker', harga: 200000, satuan: 'Per Hari', description: 'Termasuk makan & parkir, max 12 jam' });
    wsLayanan.addRow({ kodeLayanan: 'SV002', name: 'Isi Ulang Bensin Full Tank', category: 'Bensin/Isi Ulang', harga: 500000, satuan: 'Per Unit', description: 'Pertalite/Pertamax, harga ikut pompa' });
    wsLayanan.addRow({ kodeLayanan: 'SV003', name: 'Asuransi Perjalanan Per Hari', category: 'Asuransi', harga: 50000, satuan: 'Per Hari', description: 'Cover kerusakan ringan & kecelakaan' });
    wsLayanan.addRow({ kodeLayanan: 'SV004', name: 'Antar Jemput Bandara (Shuttle)', category: 'Antar Jemput', harga: 350000, satuan: 'Per Trip', description: 'Maks 4 orang + bagasi, area Jabodetabek' });
    wsLayanan.addRow({ kodeLayanan: 'SV005', name: 'Kebersihan Extra / Deep Clean', category: 'Kebersihan', harga: 150000, satuan: 'Per Unit', description: 'Detailing interior, vacuum, fogging, wc deep clean' });
    wsLayanan.addRow({ kodeLayanan: 'SV006', name: 'WiFi Portable / Pocket WiFi', category: 'Lainnya', harga: 50000, satuan: 'Per Hari', description: 'Unlimited data 4G/5G, bisa 10 device, powerbank 10000mAh' });

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

    for (let row = 2; row <= 200; row++) {
      wsMenu.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: false, formulae: ['"Makanan,Minuman,Appetizer,Dessert,Paket,Nasi,Beras,Sayur,Lauk,Snack"'], showErrorMessage: true, errorTitle: 'Kategori Tidak Valid', error: 'Pilih kategori dari dropdown.' };
      wsMenu.getCell(`F${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Makanan,Minuman"'] };
      wsMenu.getCell(`H${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Dapur,Bar,Khusus,Tidak Cetak"'] };
    }

    wsMenu.addRow({ kodeMenu: 'MKN001', name: 'Nasi Goreng Spesial', category: 'Makanan', hpp: 15000, hargaJual: 25000, tipe: 'Makanan', prepTime: 10, kitchenPrinter: 'Dapur', modifiers: 'Level pedas: Tidak pedas, Sedang, Pedas, Extra pedas; Telur: Tanpa, Dadar, Ceplok', recipe: 'Beras: 200g; Bawang merah: 3 siung; Bawang putih: 2 siung; Cabai: 5 buah; Kecap manis: 2 sdm; Telur: 1 butir; Minyak goreng: 2 sdm', description: 'Nasi goreng komplit dengan telur dan kerupuk' });
    wsMenu.addRow({ kodeMenu: 'MKN002', name: 'Ayam Geprek Sambal Matah', category: 'Makanan', hpp: 18000, hargaJual: 30000, tipe: 'Makanan', prepTime: 15, kitchenPrinter: 'Dapur', modifiers: 'Level pedas: Tidak pedas, Sedang, Pedas, Extra pedas; Nasi: Putih, Merah', recipe: 'Ayam fillet: 150g; Tepung crispy: 50g; Bawang merah: 5 siung; Cabai rawit: 10 buah; Sereh: 1 batang; Jeruk limau: 1 buah; Minyak panas: 3 sdm', description: 'Ayam crispy digeprek dengan sambal matah khas Bali' });
    wsMenu.addRow({ kodeMenu: 'MNM001', name: 'Es Teh Manis', category: 'Minuman', hpp: 2000, hargaJual: 5000, tipe: 'Minuman', prepTime: 2, kitchenPrinter: 'Bar', modifiers: 'Gula: Normal, Kurang, Tambah; Es: Normal, Sedikit, Banyak', recipe: 'Teh celup: 1 sachet; Gula pasir: 2 sdm; Air panas: 200ml; Es batu: secukupnya', description: 'Teh manis segar dengan es batu' });
    wsMenu.addRow({ kodeMenu: 'MNM002', name: 'Es Jeruk Peras', category: 'Minuman', hpp: 5000, hargaJual: 10000, tipe: 'Minuman', prepTime: 3, kitchenPrinter: 'Bar', modifiers: 'Gula: Normal, Kurang, Tambah; Es: Normal, Sedikit, Banyak', recipe: 'Jeruk nipis: 2 buah; Gula pasir: 2 sdm; Air putih: 200ml; Es batu: secukupnya', description: 'Jeruk peras segar tanpa pengawet' });
    wsMenu.addRow({ kodeMenu: 'MKN003', name: 'Mie Ayam Bakso', category: 'Makanan', hpp: 12000, hargaJual: 22000, tipe: 'Makanan', prepTime: 8, kitchenPrinter: 'Dapur', modifiers: 'Bakso: Tambah, Kurang; Pangsit: Goreng, Rebus; Level pedas: Tidak, Sedang, Pedas', recipe: 'Mie telur: 150g; Ayam suwir: 50g; Bakso sapi: 3 butir; Pangsit: 3 buah; Sawi: 50g; Kuah kaldu: 300ml; Bawang goreng: 1 sdm', description: 'Mie ayam komplit dengan bakso dan pangsit' });

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

    for (let row = 2; row <= 200; row++) {
      ws.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: false, formulae: ['"Jasa / Servis,Produk / Barang"'], showErrorMessage: true, errorTitle: 'Pilihan Kategori', error: 'Silakan pilih Jasa / Servis atau Produk / Barang dari dropdown.' };
    }

    ws.addRow({ kodeBarang: '', name: 'Potong Rambut Pria / Servis Ringan', category: 'Jasa / Servis', hpp: 5000, hargaJual: 45000, stock: '', minStockThreshold: '', komisi: 10000, description: 'Layanan pangkas + styling (stok otomatis tak terbatas)' });
    ws.addRow({ kodeBarang: 'BRG001', name: 'Oli Mesin Matic 0.8L / Pomade Styling', category: 'Produk / Barang', hpp: 35000, hargaJual: 55000, stock: 24, minStockThreshold: 5, komisi: 3000, description: 'Barang fisik dengan kontrol stok' });
    ws.addRow({ kodeBarang: 'BRG002', name: 'Kampas Rem Depan / Shampoo 500ml', category: 'Produk / Barang', hpp: 25000, hargaJual: 45000, stock: 15, minStockThreshold: 3, komisi: 2000, description: 'Sparepart / produk konsumable' });

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
  wsRetail.addRow({ kodeBarang: 'BRG001', name: 'Indomie Goreng', category: 'Makanan', hpp: 2500, hargaJual: 3500, stock: 100, minStockThreshold: 10, satuan: 'Pcs', barcode: '8992757123456', discount: 0, ppn: 11, description: 'Mie instan rasa ayam bawang' });
  wsRetail.addRow({ kodeBarang: 'BRG002', name: 'Aqua 600ml', category: 'Minuman', hpp: 2000, hargaJual: 3000, stock: 200, minStockThreshold: 20, satuan: 'Botol', barcode: '8992757123457', discount: 0, ppn: 11, description: 'Air mineral ukuran 600ml' });

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template_import_retail.xlsx"',
    },
  });
}