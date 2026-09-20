import { isRentalTravelCategory, isServiceBusinessCategory, isPureServiceCategory, detectRentalItemType } from './business-category';

export async function downloadExcelTemplate(kategoriUsaha: string = 'Jasa') {
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha);
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';

  const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kasir UMKM';
  workbook.created = new Date();

  if (isRental) {
    // Sheet 1: Unit Kendaraan (Travel/Sewa Mobil)
    const wsKendaraan = workbook.addWorksheet('Armada Kendaraan');
    wsKendaraan.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit / Plat', key: 'name', width: 32 },
      { header: 'Tipe', key: 'tipe', width: 18 },
      { header: 'Transmisi', key: 'transmisi', width: 16 },
      { header: 'Tahun', key: 'tahun', width: 10 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Jam (Rp)', key: 'hargaJam', width: 20 },
      { header: 'Biaya Operasional/Hari (Rp)', key: 'biayaHarian', width: 24 },
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
      wsKendaraan.getCell(`I${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'],
      };
    }

    wsKendaraan.addRow({
      kodeUnit: 'UNT001',
      name: 'Avanza Veloz 2023 - B 1234 ABC',
      tipe: 'MPV',
      transmisi: 'Otomatis',
      tahun: 2023,
      hargaHarian: 450000,
      hargaJam: 75000,
      biayaHarian: 150000,
      status: 'Tersedia',
      description: 'Bensin irit, 7 seat, AC double blower, transmisi CVT',
    });
    wsKendaraan.addRow({
      kodeUnit: 'UNT002',
      name: 'Innova Reborn 2022 - B 5678 DEF',
      tipe: 'MPV',
      transmisi: 'Otomatis',
      tahun: 2022,
      hargaHarian: 650000,
      hargaJam: 100000,
      biayaHarian: 200000,
      status: 'Tersedia',
      description: 'Diesel 2.4, Captain Seat, 7 seat, cocok travel jauh',
    });

    // Sheet 2: Unit Properti (Kos/Kamar/Homestay/Villa)
    const wsProperti = workbook.addWorksheet('Unit Properti');
    wsProperti.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit / No. Kamar', key: 'name', width: 32 },
      { header: 'Tipe Properti', key: 'tipe', width: 20 },
      { header: 'Kapasitas Orang', key: 'kapasitas', width: 18 },
      { header: 'Kamar Mandi', key: 'kamarMandi', width: 16 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Bulan (Rp)', key: 'hargaBulanan', width: 22 },
      { header: 'Biaya Listrik/Token (Rp)', key: 'biayaListrik', width: 24 },
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
      wsProperti.getCell(`I${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'],
      };
    }

    wsProperti.addRow({
      kodeUnit: 'PRP001',
      name: 'Kamar Deluxe 101 - Lantai 1',
      tipe: 'Kamar Kost',
      kapasitas: 2,
      kamarMandi: 'Dalam',
      hargaHarian: 150000,
      hargaBulanan: 2500000,
      biayaListrik: 50000,
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
      biayaListrik: 200000,
      status: 'Tersedia',
      description: 'Private pool, 3 kamar tidur, Dapur lengkap, Gazebo',
    });

    // Sheet 3: Layanan Tambahan (Opsional - untuk jasa tambahan rental)
    const wsLayanan = workbook.addWorksheet('Layanan Tambahan');
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

    const filename = 'template_import_rental_travel_properti.xlsx';
    await workbook.xlsx.writeFile(filename);
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

    const filename = 'template_import_jasa_servis.xlsx';
    await workbook.xlsx.writeFile(filename);
    return;
  } else if (isFNB) {
    const ws = workbook.addWorksheet('Menu Makanan & Minuman');
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

    for (let row = 2; row <= 200; row++) {
      ws.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Makanan,Minuman,Snack,Dessert,Paket Hemat"'],
      };
    }

    ws.addRow({
      kodeBarang: 'MNU001',
      name: 'Nasi Goreng Spesial',
      category: 'Makanan',
      hpp: 12000,
      hargaJual: 25000,
      stock: 50,
      minStockThreshold: 5,
      description: 'Menu makanan utama'
    });
    ws.addRow({
      kodeBarang: 'MNU002',
      name: 'Es Teh Manis',
      category: 'Minuman',
      hpp: 1500,
      hargaJual: 5000,
      stock: 100,
      minStockThreshold: 10,
      description: 'Minuman segar'
    });

    const filename = 'template_import_fnb.xlsx';
    await workbook.xlsx.writeFile(filename);
    return;
  } else {
    // Default Retail
    const ws = workbook.addWorksheet('Katalog Produk');
    ws.columns = [
      { header: 'Kode Barang (SKU)', key: 'kodeBarang', width: 18 },
      { header: 'Nama Produk', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 20 },
      { header: 'HPP (Rp)', key: 'hpp', width: 18 },
      { header: 'Harga Jual (Rp)', key: 'hargaJual', width: 18 },
      { header: 'Stok', key: 'stock', width: 14 },
      { header: 'Batas Minimum Stok', key: 'minStockThreshold', width: 20 },
      { header: 'Deskripsi / Catatan', key: 'description', width: 40 },
    ];

    ws.addRow({
      kodeBarang: 'BRG001',
      name: 'Kemeja Polos Putih',
      category: 'Pakaian',
      hpp: 50000,
      hargaJual: 85000,
      stock: 20,
      minStockThreshold: 3,
      description: 'Bahan katun premium'
    });
    ws.addRow({
      kodeBarang: 'BRG002',
      name: 'Celana Chino Slimfit',
      category: 'Celana',
      hpp: 75000,
      hargaJual: 125000,
      stock: 15,
      minStockThreshold: 2,
      description: 'Warna krem, stretch'
    });

    const filename = 'template_import_retail.xlsx';
    await workbook.xlsx.writeFile(filename);
    return;
  }
}