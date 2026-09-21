import { NextRequest, NextResponse } from 'next/server';
import { isRentalTravelCategory, isServiceBusinessCategory } from '@/lib/business-category';

// Vercel function timeout: Hobby 10s, Pro 60s - set 30s for safety
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const kategoriUsaha = req.nextUrl.searchParams.get('category') || 'Jasa';
  const subType = (req.nextUrl.searchParams.get('type') || '').toLowerCase(); // 'rental' | 'properti'
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha) && !isRental;
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';

  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kasir UMKM';
  workbook.created = new Date();

  // ==========================================
  // 1. RENTAL / TRAVEL / PROPERTI
  // ==========================================
  if (isRental) {
    if (subType === 'properti') {
      // ------------------------------------------
      // TEMPLATE KHUSUS: PROPERTI & PENGINAPAN
      // ------------------------------------------
      // Sheet 1: Unit Properti
      const wsProperti = workbook.addWorksheet('1. Unit Properti (Kamar, Villa)');
      wsProperti.columns = [
        { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
        { header: 'Nama Unit / No. Kamar', key: 'name', width: 34 },
        { header: 'Tipe Properti', key: 'tipe', width: 22 },
        { header: 'Kapasitas (Orang)', key: 'kapasitas', width: 18 },
        { header: 'Kamar Mandi', key: 'kamarMandi', width: 16 },
        { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
        { header: 'Harga Sewa/Bulan (Rp)', key: 'hargaBulanan', width: 22 },
        { header: 'HPP / Biaya Operasional per Hari (Rp)', key: 'hppHarian', width: 30 },
        { header: 'Margin %', key: 'marginPct', width: 14 },
        { header: 'Detail HPP (Listrik,Air,Internet,Kebersihan,Penyusutan)', key: 'hppDetail', width: 45 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'Fasilitas / Catatan', key: 'description', width: 50 },
      ];

      for (let row = 2; row <= 50; row++) {
        wsProperti.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Kamar Kost,Villa,Apartment,Hotel,Glamping,Studio,Homestay,Guest House"'],
          showErrorMessage: true,
          errorTitle: 'Pilihan Tipe',
          error: 'Pilih dari dropdown: Kamar Kost, Villa, Apartment, Hotel, Glamping, Studio, Homestay, Guest House',
        };
        wsProperti.getCell(`E${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Dalam,Luar,Shared"'],
        };
        wsProperti.getCell(`K${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'],
        };
        // Auto Margin % formula
        wsProperti.getCell(`I${row}`).value = { formula: `IF(F${row}>0,(F${row}-H${row})/F${row}*100,0)` };
        wsProperti.getCell(`I${row}`).numFmt = '0.0"%"';
      }

      const propertiData = [
        ['PRP001', 'Kamar Deluxe 101 - Lantai 1', 'Kamar Kost', 2, 'Dalam', 150000, 2500000, 35000, null, 'Listrik 15k + Air 5k + Wifi 5k + Kebersihan 10k', 'Tersedia', 'AC, KM Dalam, Springbed Queen, Meja Belajar, WiFi 50Mbps'],
        ['PRP002', 'Villa Puncak Indah - 3 Bedroom', 'Villa', 8, 'Dalam', 1500000, 0, 350000, null, 'Listrik 100k + Kolam 100k + Staff 100k + Kebersihan 50k', 'Tersedia', 'Private Pool, BBQ, Karaoke, Water Heater, Dapur Lengkap'],
        ['PRP003', 'Studio Apartment 12B - Green Valley', 'Apartment', 2, 'Dalam', 400000, 7500000, 70000, null, 'IPL 30k + Listrik 25k + Air 15k', 'Tersedia', 'Furnished, Kitchen Set, Smart TV, Gym & Swimming Pool Access'],
        ['PRP004', 'Glamping Suite 01 - View Lembah', 'Glamping', 4, 'Dalam', 750000, 0, 180000, null, 'Listrik 40k + Breakfast 80k + Staff 40k + Laundry 20k', 'Tersedia', 'Tenda Safari Mewah, Kasur King, Kamar Mandi Batu Alam, Api Unggun'],
        ['PRP005', 'Kamar Superior 202 - Hotel Transit', 'Hotel', 2, 'Dalam', 300000, 0, 85000, null, 'Laundry 25k + Amenities 20k + Listrik 30k + Kebersihan 10k', 'Tersedia', 'Twin Bed, TV Kabel, Safe Deposit Box, Sarapan 2 Pax'],
      ];

      propertiData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          wsProperti.getCell(i + 2, j + 1).value = val;
        });
      });

      // Sheet 2: Layanan & Add-on Properti
      const wsAddonProp = workbook.addWorksheet('2. Layanan Tambahan Properti');
      wsAddonProp.columns = [
        { header: 'Kode Layanan', key: 'kodeLayanan', width: 18 },
        { header: 'Nama Layanan', key: 'name', width: 36 },
        { header: 'Kategori', key: 'category', width: 22 },
        { header: 'Tarif (Rp)', key: 'harga', width: 18 },
        { header: 'Satuan', key: 'satuan', width: 18 },
        { header: 'Komisi Staf (Rp)', key: 'komisi', width: 20 },
        { header: 'Deskripsi', key: 'description', width: 50 },
      ];

      for (let row = 2; row <= 50; row++) {
        wsAddonProp.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Extra Bed,Sarapan/Makan,Laundry,Late Check-out,Kebersihan,Lainnya"'],
        };
      }

      const addonPropData = [
        ['EX001', 'Extra Bed (Kasur Tambahan)', 'Extra Bed', 100000, 'Per Malam', 20000, 'Sudah termasuk sprei bersih, selimut tebal & bantal'],
        ['EX002', 'Sarapan Tambahan / Breakfast Buffet', 'Sarapan/Makan', 45000, 'Per Porsi', 5000, 'Menu prasmanan nusantara + teh / kopi'],
        ['EX003', 'Laundry Cuci Kering Setrika', 'Laundry', 20000, 'Per Kg', 3000, 'Layanan cuci express pakaian tamu dalam 12 jam'],
        ['EX004', 'Late Check-out s/d Pukul 15:00', 'Late Check-out', 100000, 'Per Kamar', 15000, 'Perpanjangan jam checkout dengan persetujuan resepsionis'],
        ['EX005', 'Deep Cleaning / Pembersihan Total', 'Kebersihan', 150000, 'Per Panggilan', 50000, 'Pembersihan menyeluruh kamar / villa setelah pemakaian'],
      ];

      addonPropData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          wsAddonProp.getCell(i + 2, j + 1).value = val;
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template_import_properti_penginapan.xlsx"',
        },
      });
    }

    if (subType === 'alat' || subType === 'peralatan') {
      // ------------------------------------------
      // TEMPLATE KHUSUS: PERALATAN, ALAT & PERLENGKAPAN
      // (Kamera, Camping, Sound System, Game, Alat Berat, Event, Gaun)
      // ------------------------------------------
      // Sheet 1: Unit Alat / Barang Sewa
      const wsAlat = workbook.addWorksheet('1. Unit Alat & Perlengkapan');
      wsAlat.columns = [
        { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
        { header: 'Nama Alat / Perlengkapan', key: 'name', width: 36 },
        { header: 'Kategori Alat', key: 'category', width: 24 },
        { header: 'Merek / Brand', key: 'brand', width: 20 },
        { header: 'Kelengkapan Unit', key: 'variant', width: 32 },
        { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
        { header: 'Harga Sewa/Jam (Rp)', key: 'hargaJam', width: 20 },
        { header: 'HPP / Biaya Perawatan per Sewa (Rp)', key: 'hppHarian', width: 34 },
        { header: 'Margin %', key: 'marginPct', width: 14 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'Catatan / Spesifikasi', key: 'description', width: 50 },
      ];

      for (let row = 2; row <= 50; row++) {
        wsAlat.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Kamera & Lensa,Outdoor & Camping,Sound System & Event,Console & Game,Perkakas & Alat Berat,Pakaian & Kostum,Lainnya"'],
          showErrorMessage: true,
          errorTitle: 'Kategori Alat Tidak Valid',
          error: 'Pilih kategori dari dropdown: Kamera & Lensa, Outdoor & Camping, Sound System & Event, Console & Game, Perkakas & Alat Berat, Pakaian & Kostum, Lainnya',
        };
        wsAlat.getCell(`J${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'],
        };
        // Auto Margin % formula
        wsAlat.getCell(`I${row}`).value = { formula: `IF(F${row}>0,(F${row}-H${row})/F${row}*100,0)` };
        wsAlat.getCell(`I${row}`).numFmt = '0.0"%"';
      }

      const alatData = [
        ['ALT001', 'Sony Alpha 7 IV (Body Only)', 'Kamera & Lensa', 'Sony', 'Body, 2 Baterai, Charger, Strap, Box', 350000, 50000, 50000, null, 'Tersedia', 'Sensor 33MP Full-frame, 4K 60p, Shutter count rendah | HPP: Sensor cleaning + depresiasi'],
        ['ALT002', 'Lensa Sony FE 24-70mm F2.8 GM II', 'Kamera & Lensa', 'Sony', 'Lensa, Hood, Tutup Depan Belakang, Pouch', 250000, 35000, 30000, null, 'Tersedia', 'Optik bening bebas jamur, Autofocus senyap cepat | HPP: Kalibrasi + pembersihan lensa'],
        ['ALT003', 'Tenda Dome Arpenaz 4.1 Family', 'Outdoor & Camping', 'Quechua', 'Tenda, Frame Fiber, Pasak, Tas Tenda', 120000, 0, 25000, null, 'Tersedia', 'Kapasitas 4 orang + teras luas, waterproof | HPP: Laundry tenda + waterproofing spray'],
        ['ALT004', 'Paket Sound System 5000 Watt', 'Sound System & Event', 'Yamaha', '2 Speaker 15 Inch, Subwoofer, Mixer 12 Ch, 4 Mic', 1500000, 0, 350000, null, 'Tersedia', 'Cocok panggung pernikahan, seminar, mini konser | HPP: Transport angkut + penyusutan alat'],
        ['ALT005', 'PlayStation 5 Disc Edition + 2 Stick', 'Console & Game', 'Sony', 'PS5 Unit, 2 Stick DualSense, HDMI, Kabel Power, 5 Game', 150000, 25000, 30000, null, 'Tersedia', 'Game installed: FC 25, God of War, Spiderman 2, GTA V | HPP: Cleaning fan + pasta pendingin'],
      ];

      alatData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          wsAlat.getCell(i + 2, j + 1).value = val;
        });
      });

      // Sheet 2: Layanan & Operator Tambahan
      const wsLayananAlat = workbook.addWorksheet('2. Layanan & Operator Alat');
      wsLayananAlat.columns = [
        { header: 'Kode Layanan', key: 'kodeLayanan', width: 18 },
        { header: 'Nama Layanan', key: 'name', width: 36 },
        { header: 'Kategori', key: 'category', width: 24 },
        { header: 'Tarif (Rp)', key: 'harga', width: 18 },
        { header: 'Satuan', key: 'satuan', width: 18 },
        { header: 'Komisi Operator / Kru (Rp)', key: 'komisi', width: 24 },
        { header: 'Deskripsi', key: 'description', width: 50 },
      ];

      for (let row = 2; row <= 50; row++) {
        wsLayananAlat.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Operator/Kru,Bongkar Pasang,Antar Jemput,Aksesoris Tambahan,Teknisi/Setting,Lainnya"'],
        };
      }

      const layananAlatData = [
        ['SV001', 'Jasa Operator Soundman / Kru Audio', 'Operator/Kru', 300000, 'Per Acara', 200000, 'Standby operator audio selama acara berlangsung max 8 jam'],
        ['SV002', 'Jasa Pasang & Bongkar Tenda Camping', 'Bongkar Pasang', 50000, 'Per Unit', 35000, 'Pemasangan rapi di lokasi perkemahan sampai siap pakai'],
        ['SV003', 'Jasa Operator Videografer Event', 'Operator/Kru', 450000, 'Per Acara', 300000, 'Operator berpengalaman dengan gimbal stabilizer'],
        ['SV004', 'Tambahan Stick DualSense PS5', 'Aksesoris Tambahan', 40000, 'Per Hari', 0, 'Stick original wireless untuk multiplayer 3-4 pemain'],
        ['SV005', 'Antar Jemput Unit Alat ke Lokasi', 'Antar Jemput', 75000, 'Per Trip', 40000, 'Pengiriman dan penjemputan unit alat area dalam kota'],
      ];

      layananAlatData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          wsLayananAlat.getCell(i + 2, j + 1).value = val;
        });
      });

      const bufferAlat = await workbook.xlsx.writeBuffer();
      return new NextResponse(bufferAlat, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template_import_rental_peralatan_alat.xlsx"',
        },
      });
    }

    // ------------------------------------------
    // DEFAULT: TEMPLATE KHUSUS RENTAL & TRAVEL
    // ------------------------------------------
    // Sheet 1: Armada Kendaraan
    const wsKendaraan = workbook.addWorksheet('1. Armada (Kendaraan, Travel)');
    wsKendaraan.columns = [
      { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
      { header: 'Nama Unit Kendaraan / Plat', key: 'name', width: 34 },
      { header: 'Tipe Kendaraan', key: 'tipe', width: 20 },
      { header: 'Transmisi', key: 'transmisi', width: 16 },
      { header: 'Tahun', key: 'tahun', width: 10 },
      { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
      { header: 'Harga Sewa/Jam (Rp)', key: 'hargaJam', width: 20 },
      { header: 'HPP / Biaya Operasional per Hari (Rp)', key: 'hppHarian', width: 30 },
      { header: 'Margin %', key: 'marginPct', width: 14 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Catatan / Spesifikasi', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 50; row++) {
      wsKendaraan.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"MPV,SUV,Sedan,Minibus,Bus,Pickup,Truck,Motor,Matic,Bebek,Sport"'],
        showErrorMessage: true,
        errorTitle: 'Tipe Tidak Valid',
        error: 'Pilih dari daftar: MPV, SUV, Sedan, Minibus, Bus, Pickup, Truck, Motor, Matic, Bebek, Sport',
      };
      wsKendaraan.getCell(`D${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Manual,Otomatis"'] };
      wsKendaraan.getCell(`J${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'] };
      // Auto Margin % formula
      wsKendaraan.getCell(`I${row}`).value = { formula: `IF(F${row}>0,(F${row}-H${row})/F${row}*100,0)` };
      wsKendaraan.getCell(`I${row}`).numFmt = '0.0"%"';
    }

    const kendaraanData = [
      ['UNT001', 'Avanza Veloz 2023 - D 1234 ABC', 'MPV', 'Otomatis', 2023, 450000, 75000, 150000, null, 'Tersedia', 'Bensin irit, 7 seat, AC double blower | HPP: Solar/Bensin 80k + Supir 50k + Perawatan 20k'],
      ['UNT002', 'Innova Reborn 2022 - D 5678 DEF', 'MPV', 'Otomatis', 2022, 650000, 100000, 200000, null, 'Tersedia', 'Diesel 2.4, Captain Seat, Nyaman luar kota | HPP: Solar 100k + Supir 70k + Servis 30k'],
      ['UNT003', 'Hiace Commuter 2023 - D 9012 GHI', 'Minibus', 'Manual', 2023, 950000, 150000, 300000, null, 'Tersedia', '14 seat penumpang, armada travel antar-kota | HPP: Solar 150k + Supir 100k + Toll 50k'],
      ['UNT004', 'NMAX 155 Connected 2024 - D 3456 JKL', 'Motor', 'Matic', 2024, 90000, 18000, 25000, null, 'Tersedia', 'Matic irit, bagasi luas, rem ABS | HPP: Bensin 15k + Perawatan/Oli 10k'],
      ['UNT005', 'Elf Long Giga 2022 - D 7890 MNO', 'Minibus', 'Manual', 2022, 1200000, 200000, 400000, null, 'Tersedia', '19 seat, cocok rombongan wisata / ziarah | HPP: Solar 200k + Supir 120k + Maintenance 80k'],
    ];

    kendaraanData.forEach((rowData, i) => {
      rowData.forEach((val, j) => {
        wsKendaraan.getCell(i + 2, j + 1).value = val;
      });
    });

    // Sheet 2: Layanan & Add-on Rental
    const wsLayanan = workbook.addWorksheet('2. Layanan Tambahan Rental');
    wsLayanan.columns = [
      { header: 'Kode Layanan', key: 'kodeLayanan', width: 18 },
      { header: 'Nama Layanan', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'Tarif (Rp)', key: 'harga', width: 18 },
      { header: 'Satuan', key: 'satuan', width: 18 },
      { header: 'Komisi Driver (Rp)', key: 'komisi', width: 20 },
      { header: 'Deskripsi', key: 'description', width: 50 },
    ];

    for (let row = 2; row <= 50; row++) {
      wsLayanan.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Supir/Driver,BBM/Bensin,Asuransi,Antar Jemput,All In,Lainnya"'],
      };
    }

    const layananRentalData = [
      ['SV001', 'Jasa Supir Harian (Dalam Kota)', 'Supir/Driver', 200000, 'Per Hari', 150000, 'Sudah termasuk uang makan sopir, jam kerja max 12 jam'],
      ['SV002', 'Jasa Supir Harian (Luar Kota / Menginap)', 'Supir/Driver', 300000, 'Per Hari', 220000, 'Luar kota, belum termasuk penginapan supir jika >1 hari'],
      ['SV003', 'Isi BBM Full Tank (Pertalite/Dexlite)', 'BBM/Bensin', 450000, 'Per Unit', 0, 'Pengisian bahan bakar penuh saat serah terima unit'],
      ['SV004', 'Asuransi Perjalanan / Collision Damage Waiver', 'Asuransi', 50000, 'Per Hari', 0, 'Cover lecet ringan & kecelakaan jalan raya'],
      ['SV005', 'Antar Jemput Bandara (Drop / Pick up)', 'Antar Jemput', 250000, 'Per Trip', 50000, 'Antar jemput bandara terdekat, max 4 penumpang + koper'],
    ];

    layananRentalData.forEach((rowData, i) => {
      rowData.forEach((val, j) => {
        wsLayanan.getCell(i + 2, j + 1).value = val;
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_import_rental_kendaraan.xlsx"',
      },
    });
  }

  // ==========================================
  // 2. F&B / KULINER
  // ==========================================
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

  // ==========================================
  // 3. JASA / SERVIS
  // ==========================================
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

  // ==========================================
  // 4. RETAIL (DEFAULT)
  // ==========================================
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
