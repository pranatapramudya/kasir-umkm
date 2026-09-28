import { isRentalTravelCategory, isServiceBusinessCategory, isPureServiceCategory, detectRentalItemType, getFnbSubType } from './business-category';
import { type FnbSubType } from './navigation';

export async function downloadExcelTemplate(kategoriUsaha: string = 'Jasa') {
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha);
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner' || kategoriUsaha === 'resto' || kategoriUsaha === 'kuliner';
  const fnbSubType: FnbSubType = isFNB ? getFnbSubType(kategoriUsaha) : 'generic';

  const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kasir UMKM';
  workbook.created = new Date();

  if (isRental) {
    // Sheet 1: Unit Kendaraan (Travel/Sewa Mobil)
    const wsKendaraan = workbook.addWorksheet('1. Armada (Kendaraan, Travel)');
    wsKendaraan.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit / Plat', key: 'name', width: 32 },
      { header: 'Tipe Kendaraan', key: 'tipe', width: 20 },
      { header: 'Transmisi', key: 'transmisi', width: 16 },
      { header: 'Tahun', key: 'tahun', width: 10 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Jam (Rp)', key: 'hargaJam', width: 20 },
      { header: 'HPP / Biaya Operasional per Hari (Rp)', key: 'hppHarian', width: 28 },
      { header: 'Margin %', key: 'marginPct', width: 12 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Catatan / Spesifikasi', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 200; row++) {
      wsKendaraan.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"MPV,SUV,Sedan,Minibus,Bus,Pickup,Truck,Motor,Matic,Bebek,Sport"'],
        showErrorMessage: true,
        errorTitle: 'Tipe Tidak Valid',
        error: 'Pilih dari daftar: MPV, SUV, Sedan, Minibus, Bus, Pickup, Truck, Motor, Matic, Bebek, Sport',
      };
      wsKendaraan.getCell(`D${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Manual,Otomatis"'],
      };
      wsKendaraan.getCell(`J${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'],
      };
      // Margin % formula: ((Harga Harian - HPP) / Harga Harian) * 100
      wsKendaraan.getCell(`I${row}`).value = { formula: `IF(F${row}>0,(F${row}-H${row})/F${row}*100,0)` };
      wsKendaraan.getCell(`I${row}`).numFmt = '0.0"%"';
    }

    wsKendaraan.addRow({
      kodeUnit: 'UNT001',
      name: 'Avanza Veloz 2023 - B 1234 ABC',
      tipe: 'MPV',
      transmisi: 'Otomatis',
      tahun: 2023,
      hargaHarian: 450000,
      hargaJam: 75000,
      hppHarian: 150000,
      marginPct: null, // formula
      status: 'Tersedia',
      description: 'Bensin irit, 7 seat, AC double blower, transmisi CVT | HPP: Bensin 80k + Supir 50k + Perawatan 20k',
    });
    wsKendaraan.addRow({
      kodeUnit: 'UNT002',
      name: 'Innova Reborn 2022 - B 5678 DEF',
      tipe: 'MPV',
      transmisi: 'Otomatis',
      tahun: 2022,
      hargaHarian: 650000,
      hargaJam: 100000,
      hppHarian: 200000,
      marginPct: null,
      status: 'Tersedia',
      description: 'Diesel 2.4, Captain Seat, 7 seat, cocok travel jauh | HPP: Solar 100k + Supir 70k + Perawatan 30k',
    });
    wsKendaraan.addRow({
      kodeUnit: 'UNT003',
      name: 'Hiace Commuter 2023 - B 9012 GHI',
      tipe: 'Minibus',
      transmisi: 'Manual',
      tahun: 2023,
      hargaHarian: 950000,
      hargaJam: 150000,
      hppHarian: 300000,
      marginPct: null,
      status: 'Tersedia',
      description: '14 seat, diesel, cocok travel antar kota, armada travel | HPP: Solar 150k + Supir 100k + Toll/Perawatan 50k',
    });
    wsKendaraan.addRow({
      kodeUnit: 'UNT004',
      name: 'NMAX 155 2024 - B 3456 JKL',
      tipe: 'Motor',
      transmisi: 'Matic',
      tahun: 2024,
      hargaHarian: 80000,
      hargaJam: 15000,
      hppHarian: 20000,
      marginPct: null,
      status: 'Tersedia',
      description: 'Scooter matic, irit, cocok rental harian motor | HPP: Bensin 15k + Perawatan 5k',
    });
    wsKendaraan.addRow({
      kodeUnit: 'UNT005',
      name: 'Elf Long 2022 - B 7890 MNO',
      tipe: 'Minibus',
      transmisi: 'Manual',
      tahun: 2022,
      hargaHarian: 1200000,
      hargaJam: 200000,
      hppHarian: 400000,
      marginPct: null,
      status: 'Perbaikan',
      description: '19 seat, diesel, armada shuttle bandara | HPP: Solar 200k + Supir 120k + Toll/Perawatan 80k',
    });

    // Sheet 2: Unit Properti (Kos/Kamar/Homestay/Villa)
    const wsProperti = workbook.addWorksheet('2. Properti (Kamar, Villa, Kost, Hotel)');
    wsProperti.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit / No. Kamar', key: 'name', width: 32 },
      { header: 'Tipe Properti', key: 'tipe', width: 20 },
      { header: 'Kapasitas Orang', key: 'kapasitas', width: 18 },
      { header: 'Kamar Mandi', key: 'kamarMandi', width: 16 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Bulan (Rp)', key: 'hargaBulanan', width: 22 },
      { header: 'HPP / Biaya Operasional per Hari (Rp)', key: 'hppHarian', width: 28 },
      { header: 'Margin %', key: 'marginPct', width: 12 },
      { header: 'Detail HPP (Listrik,Air,Internet,Kebersihan,Penyusutan)', key: 'hppDetail', width: 45 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Fasilitas / Catatan', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 200; row++) {
      wsProperti.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Kamar Kost,Studio,Apartment,Villa,Home Stay,Hotel,Glamping,Rumah,Meeting Room,Coworking Space"'],
        showErrorMessage: true,
        errorTitle: 'Tipe Tidak Valid',
        error: 'Pilih dari daftar tipe properti',
      };
      wsProperti.getCell(`K${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'],
      };
      // Margin % formula: ((Harga Harian - HPP) / Harga Harian) * 100
      wsProperti.getCell(`I${row}`).value = { formula: `IF(F${row}>0,(F${row}-H${row})/F${row}*100,0)` };
      wsProperti.getCell(`I${row}`).numFmt = '0.0"%"';
    }

    wsProperti.addRow({
      kodeUnit: 'PRP001',
      name: 'Kamar Deluxe 101 - Lantai 1',
      tipe: 'Kamar Kost',
      kapasitas: 2,
      kamarMandi: 'Dalam',
      hargaHarian: 150000,
      hargaBulanan: 2500000,
      hppHarian: 50000,
      marginPct: null,
      hppDetail: 'Listrik 20k + Air 10k + Internet 5k + Kebersihan 10k + Penyusutan 5k',
      status: 'Tersedia',
      description: 'AC, Kamar mandi dalam, Kasur queen, WiFi, Lemari',
    });
    wsProperti.addRow({
      kodeUnit: 'PRP002',
      name: 'Villa Puncak 2 - Blok B No.5',
      tipe: 'Villa',
      kapasitas: 6,
      kamarMandi: 'Dalam (2)',
      hargaHarian: 1500000,
      hargaBulanan: 0,
      hppHarian: 300000,
      marginPct: null,
      hppDetail: 'Listrik 100k + Air 30k + Internet 20k + Kebersihan 100k + Penyusutan 50k',
      status: 'Tersedia',
      description: 'Private pool, 3 kamar tidur, Dapur lengkap, Gazebo',
    });
    wsProperti.addRow({
      kodeUnit: 'PRP003',
      name: 'Studio Apartment 3A - Sudirman',
      tipe: 'Apartment',
      kapasitas: 2,
      kamarMandi: 'Dalam',
      hargaHarian: 450000,
      hargaBulanan: 8000000,
      hppHarian: 150000,
      marginPct: null,
      hppDetail: 'Listrik 50k + Air 20k + Internet 20k + Kebersihan 40k + Penyusutan 20k',
      status: 'Tersedia',
      description: 'Fully furnished, gym, pool, 24h security, strategic location',
    });
    wsProperti.addRow({
      kodeUnit: 'PRP004',
      name: 'Glamping Tenda Luxury - Lembah Pinus',
      tipe: 'Glamping',
      kapasitas: 4,
      kamarMandi: 'Luar (Shared)',
      hargaHarian: 800000,
      hargaBulanan: 0,
      hppHarian: 150000,
      marginPct: null,
      hppDetail: 'Listrik 30k + Air 10k + Internet 10k + Kebersihan 50k + Penyusutan 50k',
      status: 'Disewa',
      description: 'Tenda bell 5m, kasur king, heater, view gunung, BBQ area',
    });
    wsProperti.addRow({
      kodeUnit: 'PRP005',
      name: 'Hotel Bisnis Deluxe - Bandung',
      tipe: 'Hotel',
      kapasitas: 2,
      kamarMandi: 'Dalam',
      hargaHarian: 650000,
      hargaBulanan: 0,
      hppHarian: 180000,
      marginPct: null,
      hppDetail: 'Listrik 40k + Air 20k + Internet 15k + Kebersihan 60k + Penyusutan 45k + Sarapan 45k',
      status: 'Tersedia',
      description: 'Sarapan included, meeting room, laundry, dekat stasiun',
    });

    // Sheet 3: Layanan Tambahan (Opsional - untuk jasa tambahan rental)
    const wsLayanan = workbook.addWorksheet('3. Layanan Tambahan (Supir, Asuransi, Bensin)');
    wsLayanan.columns = [
      { header: 'Kode Layanan', key: 'kodeLayanan', width: 18 },
      { header: 'Nama Layanan', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'Harga (Rp)', key: 'harga', width: 20 },
      { header: 'Satuan', key: 'satuan', width: 16 },
      { header: 'Deskripsi', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 100; row++) {
      wsLayanan.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Supir/Bunker,Asuransi Perjalanan,Antar Jemput,Bensin/Isi Ulang,Kebersihan Extra,Lainnya"'],
      };
      wsLayanan.getCell(`E${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Per Hari,Per Jam,Per Trip,Per Bulan,Per Unit"'],
      };
    }

    wsLayanan.addRow({
      kodeLayanan: 'SV001',
      name: 'Supir Harian (Dalam Kota)',
      category: 'Supir/Bunker',
      harga: 200000,
      satuan: 'Per Hari',
      description: 'Termasuk makan & parkir, max 12 jam/hari',
    });
    wsLayanan.addRow({
      kodeLayanan: 'SV002',
      name: 'Isi Ulang Bensin Full',
      category: 'Bensin/Isi Ulang',
      harga: 500000,
      satuan: 'Per Unit',
      description: 'Harga mengikuti pasar, tagih ke customer',
    });
    wsLayanan.addRow({
      kodeLayanan: 'SV003',
      name: 'Asuransi Perjalanan Personal',
      category: 'Asuransi Perjalanan',
      harga: 50000,
      satuan: 'Per Hari',
      description: 'Coverage kecelakaan, kehilangan barang, bantuan hukum',
    });
    wsLayanan.addRow({
      kodeLayanan: 'SV004',
      name: 'Antar Jemput Bandara (Shuttle)',
      category: 'Antar Jemput',
      harga: 350000,
      satuan: 'Per Trip',
      description: 'Maks 4 orang + bagasi, area Jabodetabek',
    });
    wsLayanan.addRow({
      kodeLayanan: 'SV005',
      name: 'Kebersihan Extra / Deep Clean',
      category: 'Kebersihan Extra',
      harga: 150000,
      satuan: 'Per Unit',
      description: 'Detailing interior, vacuum, fogging, wc deep clean',
    });
    wsLayanan.addRow({
      kodeLayanan: 'SV006',
      name: 'WiFi Portable / Pocket WiFi',
      category: 'Lainnya',
      harga: 50000,
      satuan: 'Per Hari',
      description: 'Unlimited data 4G/5G, bisa 10 device, powerbank 10000mAh',
    });

    // Browser-compatible download (writeFile only works in Node.js)
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_rental_travel_properti.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  } else if (isJasa) {
    // Template 1 Sheet Terpadu: Layanan Jasa & Produk Barang (Sparepart)
    const ws = workbook.addWorksheet('Katalog Jasa & Barang');
    ws.columns = [
      { header: 'Kode Barang (SKU)', key: 'kodeBarang', width: 20 }, // A
      { header: 'Nama Layanan / Produk', key: 'name', width: 36 }, // B
      { header: 'Kategori', key: 'category', width: 22 }, // C
      { header: 'HPP / Biaya Modal (Rp)', key: 'hpp', width: 24 }, // D
      { header: 'Harga Jual / Tarif (Rp)', key: 'hargaJual', width: 24 }, // E
      { header: 'Qty (Stok)', key: 'stock', width: 16 }, // F
      { header: 'Batas Minimum Stok', key: 'minStockThreshold', width: 22 }, // G
      { header: 'Komisi Staf (Rp)', key: 'komisi', width: 20 }, // H
      { header: 'Deskripsi / Catatan', key: 'description', width: 45 }, // I
    ];

    // Data Validation Dropdown TEPAT pada kolom Kategori (Kolom C, baris 2 sampai 200)
    for (let row = 2; row <= 200; row++) {
      ws.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: ['"Jasa / Servis,Produk / Barang"'],
        showErrorMessage: true,
        errorTitle: 'Pilihan Kategori',
        error: 'Silakan pilih Jasa / Servis atau Produk / Barang dari dropdown.',
      };
    }

    // Baris Contoh 1: Layanan Jasa (Stok dikosongkan karena otomatis tidak terbatas)
    ws.addRow({
      kodeBarang: '',
      name: 'Potong Rambut Pria / Servis Ringan',
      category: 'Jasa / Servis',
      hpp: 5000,
      hargaJual: 45000,
      stock: '',
      minStockThreshold: '',
      komisi: 10000,
      description: 'Layanan pangkas + styling (stok otomatis tak terbatas)'
    });

    // Baris Contoh 2: Produk / Sparepart Fisik (Wajib isi Stok)
    ws.addRow({
      kodeBarang: 'BRG001',
      name: 'Oli Mesin Matic 0.8L / Pomade Styling',
      category: 'Produk / Barang',
      hpp: 35000,
      hargaJual: 55000,
      stock: 24,
      minStockThreshold: 5,
      komisi: 3000,
      description: 'Barang fisik dengan kontrol stok'
    });

    // Baris Contoh 3: Produk / Sparepart Fisik lainnya
    ws.addRow({
      kodeBarang: 'BRG002',
      name: 'Kampas Rem Depan / Shampoo 500ml',
      category: 'Produk / Barang',
      hpp: 25000,
      hargaJual: 45000,
      stock: 15,
      minStockThreshold: 3,
      komisi: 2000,
      description: 'Barang fisik dengan kontrol stok'
    });

    // Browser-compatible download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_jasa_servis.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  } else if (isFNB) {
    // Cafe vs Resto different category templates
    const cafeCategories = ['Kopi', 'Non-Kopi', 'Makanan Ringan', 'Dessert', 'Paket Sarapan'];
    const restoCategories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Paket Hemat'];
    const genericCategories = ['Makanan', 'Minuman', 'Snack', 'Dessert', 'Paket Hemat'];
    
    const categories = fnbSubType === 'cafe' ? cafeCategories : fnbSubType === 'resto' ? restoCategories : genericCategories;
    const sheetName = fnbSubType === 'cafe' ? 'Menu Cafe' : fnbSubType === 'resto' ? 'Menu Resto' : 'Menu Makanan & Minuman';
    const fileName = fnbSubType === 'cafe' ? 'template_import_fnb_cafe.xlsx' : fnbSubType === 'resto' ? 'template_import_fnb_resto.xlsx' : 'template_import_fnb.xlsx';
    
    const sampleRows = fnbSubType === 'cafe' ? [
      { kodeBarang: 'MNU001', name: 'Espresso', category: 'Kopi', hpp: 5000, hargaJual: 18000, stock: 100, minStockThreshold: 10, description: 'Kopi hitam klasik' },
      { kodeBarang: 'MNU002', name: 'Cappuccino', category: 'Kopi', hpp: 7000, hargaJual: 22000, stock: 80, minStockThreshold: 10, description: 'Espresso + susu foam' },
      { kodeBarang: 'MNU003', name: 'Matcha Latte', category: 'Non-Kopi', hpp: 8000, hargaJual: 25000, stock: 60, minStockThreshold: 10, description: 'Matcha premium + susu' },
      { kodeBarang: 'MNU004', name: 'Croissant', category: 'Makanan Ringan', hpp: 15000, hargaJual: 35000, stock: 30, minStockThreshold: 5, description: 'Croissant mentega fresh' },
      { kodeBarang: 'MNU005', name: 'Tiramisu', category: 'Dessert', hpp: 20000, hargaJual: 45000, stock: 20, minStockThreshold: 3, description: 'Dessert khas Italia' },
      { kodeBarang: 'MNU006', name: 'Paket Sarapan Hemat', category: 'Paket Sarapan', hpp: 25000, hargaJual: 55000, stock: 50, minStockThreshold: 5, description: 'Roti + telur + kopi' },
    ] : fnbSubType === 'resto' ? [
      { kodeBarang: 'MNU001', name: 'Salad Caesar', category: 'Appetizer', hpp: 15000, hargaJual: 35000, stock: 50, minStockThreshold: 5, description: 'Salad segar dengan dressing caesar' },
      { kodeBarang: 'MNU002', name: 'Nasi Goreng Spesial', category: 'Main Course', hpp: 12000, hargaJual: 25000, stock: 100, minStockThreshold: 10, description: 'Menu makanan utama' },
      { kodeBarang: 'MNU003', name: 'Ayam Goreng Crispy', category: 'Main Course', hpp: 18000, hargaJual: 40000, stock: 80, minStockThreshold: 10, description: 'Ayam goreng renyah bumbu khusus' },
      { kodeBarang: 'MNU004', name: 'Es Teh Manis', category: 'Beverage', hpp: 1500, hargaJual: 5000, stock: 200, minStockThreshold: 20, description: 'Minuman segar' },
      { kodeBarang: 'MNU005', name: 'Pudding Coklat', category: 'Dessert', hpp: 8000, hargaJual: 20000, stock: 40, minStockThreshold: 5, description: 'Dessert manis lembut' },
      { kodeBarang: 'MNU006', name: 'Paket Hemat Nasi + Ayam + Teh', category: 'Paket Hemat', hpp: 25000, hargaJual: 55000, stock: 60, minStockThreshold: 5, description: 'Paket hemat siang hari' },
    ] : [
      { kodeBarang: 'MNU001', name: 'Nasi Goreng Spesial', category: 'Makanan', hpp: 12000, hargaJual: 25000, stock: 50, minStockThreshold: 5, description: 'Menu makanan utama' },
      { kodeBarang: 'MNU002', name: 'Es Teh Manis', category: 'Minuman', hpp: 1500, hargaJual: 5000, stock: 100, minStockThreshold: 10, description: 'Minuman segar' },
      { kodeBarang: 'MNU003', name: 'Kentang Goreng', category: 'Snack', hpp: 5000, hargaJual: 15000, stock: 80, minStockThreshold: 10, description: 'Snack goreng renyah' },
      { kodeBarang: 'MNU004', name: 'Es Krim Vanilla', category: 'Dessert', hpp: 8000, hargaJual: 20000, stock: 40, minStockThreshold: 5, description: 'Dessert manis segar' },
      { kodeBarang: 'MNU005', name: 'Mie Goreng Tek-tek', category: 'Makanan', hpp: 10000, hargaJual: 22000, stock: 60, minStockThreshold: 5, description: 'Menu mie khas pinggir jalan' },
      { kodeBarang: 'MNU006', name: 'Paket Hemat Nasi + Ayam + Teh', category: 'Paket Hemat', hpp: 25000, hargaJual: 55000, stock: 50, minStockThreshold: 5, description: 'Paket hemat siang hari' },
    ];

    const ws = workbook.addWorksheet(sheetName);
    ws.columns = [
      { header: 'Kode Menu (SKU)', key: 'kodeBarang', width: 18 },
      { header: 'Nama Menu', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'HPP (Rp)', key: 'hpp', width: 18 },
      { header: 'Harga Jual (Rp)', key: 'hargaJual', width: 18 },
      { header: 'Stok', key: 'stock', width: 14 },
      { header: 'Batas Minimum Stok', key: 'minStockThreshold', width: 20 },
      { header: 'Deskripsi / Catatan', key: 'description', width: 40 },
    ];

    // Add sample rows FIRST (will be rows 2-7)
    sampleRows.forEach(row => ws.addRow(row));

    // Then apply data validation to empty rows after samples (row 8 onwards)
    const startRow = sampleRows.length + 2; // row 8
    for (let row = startRow; row <= 200; row++) {
      ws.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${categories.join(',')}"`],
      };
    }

    // Browser-compatible download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  } else {
    // Default Retail (Universal: Toko Kelontong, Fashion, Kosmetik, Elektronik, dll)
    const ws = workbook.addWorksheet('Katalog Produk Retail');
    ws.columns = [
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

    ws.addRow({
      kodeBarang: 'BRG001',
      name: 'Indomie Goreng Original',
      category: 'Makanan',
      hpp: 2500,
      hargaJual: 3500,
      stock: 100,
      minStockThreshold: 10,
      satuan: 'Pcs',
      barcode: '8992757123456',
      discount: 0,
      ppn: 0,
      description: 'Mie instan goreng rasa ayam bawang'
    });
    ws.addRow({
      kodeBarang: 'BRG002',
      name: 'Aqua Botol 600ml',
      category: 'Minuman',
      hpp: 2000,
      hargaJual: 3500,
      stock: 120,
      minStockThreshold: 24,
      satuan: 'Botol',
      barcode: '8992757123457',
      discount: 0,
      ppn: 0,
      description: 'Air mineral kemasan botol'
    });
    ws.addRow({
      kodeBarang: 'BRG003',
      name: 'Kemeja Polos Putih Katun',
      category: 'Pakaian',
      hpp: 50000,
      hargaJual: 85000,
      stock: 20,
      minStockThreshold: 3,
      satuan: 'Pcs',
      barcode: '',
      discount: 0,
      ppn: 0,
      description: 'Bahan katun premium stretch'
    });
    ws.addRow({
      kodeBarang: 'BRG004',
      name: 'Sabun Cair Mandi 450ml',
      category: 'Kebutuhan Harian',
      hpp: 18000,
      hargaJual: 24000,
      stock: 30,
      minStockThreshold: 5,
      satuan: 'Pouch',
      barcode: '',
      discount: 0,
      ppn: 0,
      description: 'Sabun mandi antibakteri refill'
    });

    // Browser-compatible download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_retail.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return;
  }
}