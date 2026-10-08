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
    // Sheet 1: Unit Kendaraan (Travel/Sewa Mobil) - 15 sample rows agar pagination > 10 langsung aktif
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

    const armadaRows = [
      {
        kodeUnit: 'UNT001',
        name: 'Avanza Veloz 2023 - B 1234 ABC',
        tipe: 'MPV',
        transmisi: 'Otomatis',
        tahun: 2023,
        hargaHarian: 450000,
        hargaJam: 75000,
        hppHarian: 150000,
        marginPct: null,
        status: 'Tersedia',
        description: 'Bensin irit, 7 seat, AC double blower, transmisi CVT | HPP: Bensin 80k + Supir 50k + Perawatan 20k',
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        kodeUnit: 'UNT005',
        name: 'Elf Long 19 Seat - B 7890 MNO (Unit Garasi)',
        tipe: 'Minibus',
        transmisi: 'Manual',
        tahun: 2022,
        hargaHarian: 1200000,
        hargaJam: 200000,
        hppHarian: 400000,
        marginPct: null,
        status: 'Tersedia',
        description: '19 seat, diesel, shuttle & ziarah rombongan kecil | HPP: Solar 200k + Supir 120k + Perawatan 80k',
      },
      {
        kodeUnit: 'BUS001',
        name: 'Big Bus SHD 50 Seat - Bima Sena - B 7123 BUS (Unit Garasi)',
        tipe: 'Bus',
        transmisi: 'Manual',
        tahun: 2023,
        hargaHarian: 3500000,
        hargaJam: 300000,
        hppHarian: 1500000,
        marginPct: null,
        status: 'Tersedia',
        description: '50 Seat (2-2), Toilet, AC, TV Karaoke, Coolbox, Bagasi Luas | HPP: Solar 800k + Driver & Co-Driver 500k + Tol/Perawatan 200k',
      },
      {
        kodeUnit: 'BUS002',
        name: 'Big Bus 59 Seat - Al-Barokah Ziarah - D 7890 ZIA (Mitra H. Slamet)',
        tipe: 'Bus',
        transmisi: 'Manual',
        tahun: 2022,
        hargaHarian: 3200000,
        hargaJam: 250000,
        hppHarian: 1400000,
        marginPct: null,
        status: 'Tersedia',
        description: '59 Seat (3-2), Khusus Ziarah Walisongo / Tour Jawa-Bali, AC, Karaoke, Bantal Selimut | Unit Titipan Mitra H. Slamet (Bagi Hasil 70:30)',
      },
      {
        kodeUnit: 'BUS003',
        name: 'Medium Bus 35 Seat - Satria Muda - B 9456 MED (Mitra Pak Budi)',
        tipe: 'Bus',
        transmisi: 'Manual',
        tahun: 2023,
        hargaHarian: 2200000,
        hargaJam: 200000,
        hppHarian: 900000,
        marginPct: null,
        status: 'Tersedia',
        description: '35 Seat (2-2), Rute ziarah & wisata dalam/luar kota, suspensi empuk | Unit Titipan Mitra Pak Budi',
      },
      {
        kodeUnit: 'UNT006',
        name: 'Fortuner 2.8 VRZ 2023 - B 2345 QWE',
        tipe: 'SUV',
        transmisi: 'Otomatis',
        tahun: 2023,
        hargaHarian: 1200000,
        hargaJam: 180000,
        hppHarian: 350000,
        marginPct: null,
        status: 'Tersedia',
        description: 'SUV mewah tangguh 7 seat diesel turbo | HPP: Solar 150k + Driver 120k + Perawatan 80k',
      },
      {
        kodeUnit: 'UNT007',
        name: 'Honda Brio RS 2023 - B 6789 RTY',
        tipe: 'Sedan',
        transmisi: 'Otomatis',
        tahun: 2023,
        hargaHarian: 350000,
        hargaJam: 50000,
        hppHarian: 100000,
        marginPct: null,
        status: 'Tersedia',
        description: 'City car lincah irit bensin | HPP: Bensin 60k + Perawatan 40k',
      },
      {
        kodeUnit: 'UNT008',
        name: 'Toyota Alphard 2.5 G 2022 - B 8888 VIP',
        tipe: 'MPV',
        transmisi: 'Otomatis',
        tahun: 2022,
        hargaHarian: 2500000,
        hargaJam: 350000,
        hppHarian: 750000,
        marginPct: null,
        status: 'Tersedia',
        description: 'VIP Premium Captain Seat & Pilot Seat | HPP: Bensin 300k + Driver VIP 250k + Kas 200k',
      },
      {
        kodeUnit: 'UNT009',
        name: 'Suzuki Carry Pick Up 2023 - B 9900 BOX',
        tipe: 'Pickup',
        transmisi: 'Manual',
        tahun: 2023,
        hargaHarian: 300000,
        hargaJam: 50000,
        hppHarian: 90000,
        marginPct: null,
        status: 'Tersedia',
        description: 'Mobil bak angkut barang pindahan | HPP: Bensin 50k + Perawatan 40k',
      },
      {
        kodeUnit: 'UNT010',
        name: 'Toyota Kijang Innova Zenix 2024 - B 1414 HYB',
        tipe: 'MPV',
        transmisi: 'Otomatis',
        tahun: 2024,
        hargaHarian: 850000,
        hargaJam: 120000,
        hppHarian: 250000,
        marginPct: null,
        status: 'Tersedia',
        description: 'Hybrid irit bensin, 7 seat, panoramic roof | HPP: Bensin 120k + Driver 80k + Perawatan 50k',
      },
      {
        kodeUnit: 'UNT011',
        name: 'Honda PCX 160 2024 - B 3344 MTR',
        tipe: 'Motor',
        transmisi: 'Matic',
        tahun: 2024,
        hargaHarian: 95000,
        hargaJam: 20000,
        hppHarian: 25000,
        marginPct: null,
        status: 'Tersedia',
        description: 'Motor matic nyaman bagasi luas | HPP: Bensin 15k + Oli/servis 10k',
      },
      {
        kodeUnit: 'BUS004',
        name: 'Big Bus Super Executive 28 Seat - Sultan Solo - B 7788 VVIP (Garasi Sendiri)',
        tipe: 'Bus',
        transmisi: 'Manual',
        tahun: 2024,
        hargaHarian: 4500000,
        hargaJam: 600000,
        hppHarian: 1800000,
        marginPct: null,
        status: 'Tersedia',
        description: '28 Seat 2-1 Legrest, Toilet, Coffee Maker | HPP: Solar 900k + Driver 500k + Kru 400k',
      },
    ];
    armadaRows.forEach(row => wsKendaraan.addRow(row));

    // Sheet 2: Unit Properti (Kos/Kamar/Homestay/Villa) - 15 sample rows agar pagination > 10 langsung aktif
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

    const propertiRows = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        kodeUnit: 'PRP006',
        name: 'Kamar Standard 102 - Lantai 1',
        tipe: 'Kamar Kost',
        kapasitas: 1,
        kamarMandi: 'Dalam',
        hargaHarian: 120000,
        hargaBulanan: 1900000,
        hppHarian: 30000,
        marginPct: null,
        hppDetail: 'Listrik 10k + Air 5k + Wifi 5k + Kebersihan 10k',
        status: 'Tersedia',
        description: 'AC, KM Dalam, Single Bed, Meja Kerja, Lemari',
      },
      {
        kodeUnit: 'PRP007',
        name: 'Villa Mountain View - 2 Bedroom',
        tipe: 'Villa',
        kapasitas: 6,
        kamarMandi: 'Dalam',
        hargaHarian: 1100000,
        hargaBulanan: 0,
        hppHarian: 250000,
        marginPct: null,
        hppDetail: 'Listrik 80k + Staff 80k + Kolam 50k + Kebersihan 40k',
        status: 'Tersedia',
        description: 'Private Gazebo, Dapur, Water Heater, Smart TV',
      },
      {
        kodeUnit: 'PRP008',
        name: 'Apartment 2BR Tower Beverly 15A',
        tipe: 'Apartment',
        kapasitas: 4,
        kamarMandi: 'Dalam',
        hargaHarian: 650000,
        hargaBulanan: 12000000,
        hppHarian: 110000,
        marginPct: null,
        hppDetail: 'IPL 50k + Listrik 35k + Air 25k',
        status: 'Tersedia',
        description: '2 Kamar Tidur, Balkon Kota, Kitchen Set, Kolam Renang',
      },
      {
        kodeUnit: 'PRP009',
        name: 'Glamping Dome 02 - Sunrise View',
        tipe: 'Glamping',
        kapasitas: 3,
        kamarMandi: 'Luar (Shared)',
        hargaHarian: 650000,
        hargaBulanan: 0,
        hppHarian: 150000,
        marginPct: null,
        hppDetail: 'Listrik 35k + Breakfast 60k + Staff 35k + Kayu 20k',
        status: 'Tersedia',
        description: 'Kubah Geodesik Transparan, Kasur Queen, Heater, Balkon',
      },
      {
        kodeUnit: 'PRP010',
        name: 'Family Homestay 3 Kamar - Heritage',
        tipe: 'Home Stay',
        kapasitas: 8,
        kamarMandi: 'Dalam',
        hargaHarian: 850000,
        hargaBulanan: 0,
        hppHarian: 200000,
        marginPct: null,
        hppDetail: 'Listrik 60k + Laundry 50k + Staff 50k + Kebersihan 40k',
        status: 'Tersedia',
        description: 'Rumah Joglo Asri, 3 Kamar Tidur, Garasi 2 Mobil, Dapur',
      },
      {
        kodeUnit: 'PRP011',
        name: 'Studio Room 05 - Guest House',
        tipe: 'Studio',
        kapasitas: 2,
        kamarMandi: 'Dalam',
        hargaHarian: 250000,
        hargaBulanan: 3500000,
        hppHarian: 60000,
        marginPct: null,
        hppDetail: 'Listrik 20k + Laundry 20k + Wifi 10k + Air 10k',
        status: 'Tersedia',
        description: 'Double Bed, Smart TV Netflix, Meja Kerja, Balkon',
      },
      {
        kodeUnit: 'PRP012',
        name: 'Presidential Suite Villa - Private Jacuzzi',
        tipe: 'Villa',
        kapasitas: 10,
        kamarMandi: 'Dalam',
        hargaHarian: 2800000,
        hargaBulanan: 0,
        hppHarian: 600000,
        marginPct: null,
        hppDetail: 'Jacuzzi 150k + Staff 200k + Listrik 150k + Amenities 100k',
        status: 'Tersedia',
        description: '4 Kamar Mewah, Jacuzzi Air Hangat, Biliar, BBQ Pit',
      },
      {
        kodeUnit: 'PRP013',
        name: 'Kamar Eksekutif Suite 201 - Lantai 2',
        tipe: 'Kamar Kost',
        kapasitas: 2,
        kamarMandi: 'Dalam',
        hargaHarian: 200000,
        hargaBulanan: 3200000,
        hppHarian: 60000,
        marginPct: null,
        hppDetail: 'Listrik 25k + Laundry 20k + Air 15k',
        status: 'Tersedia',
        description: 'Kamar luas furnished lengkap AC & WiFi cepat, Smart TV, Balkon Pribadi',
      },
      {
        kodeUnit: 'PRP014',
        name: 'Villa Joglo Nuansa Alam 3 Kamar',
        tipe: 'Villa',
        kapasitas: 8,
        kamarMandi: 'Dalam',
        hargaHarian: 1800000,
        hargaBulanan: 0,
        hppHarian: 350000,
        marginPct: null,
        hppDetail: 'Listrik 120k + Staff 120k + Kolam 60k + Kebersihan 50k',
        status: 'Tersedia',
        description: 'Kolam renang pribadi, halaman rumput luas, BBQ, view pegunungan',
      },
      {
        kodeUnit: 'PRP015',
        name: 'Apartment 1BR Signature Tower 8C',
        tipe: 'Apartment',
        kapasitas: 2,
        kamarMandi: 'Dalam',
        hargaHarian: 500000,
        hargaBulanan: 8500000,
        hppHarian: 140000,
        marginPct: null,
        hppDetail: 'IPL 60k + Listrik 45k + Air 35k',
        status: 'Tersedia',
        description: 'Lokasi premium pusat kota, kitchen set mewah, gym & pool access',
      },
    ];
    propertiRows.forEach(row => wsProperti.addRow(row));

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

    // Browser-compatible download
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
    // Template 1 Sheet Terpadu: Layanan Jasa & Produk Barang (15 sample rows agar pagination > 10 langsung aktif)
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

    const jasaRows = [
      {
        kodeBarang: '',
        name: 'Potong Rambut Pria / Servis Ringan',
        category: 'Jasa / Servis',
        hpp: 5000,
        hargaJual: 45000,
        stock: '',
        minStockThreshold: '',
        komisi: 10000,
        description: 'Layanan pangkas + styling (stok otomatis tak terbatas)'
      },
      {
        kodeBarang: '',
        name: 'Cuci & Creambath Rambut',
        category: 'Jasa / Servis',
        hpp: 8000,
        hargaJual: 50000,
        stock: '',
        minStockThreshold: '',
        komisi: 12000,
        description: 'Perawatan rambut bersih relaksasi'
      },
      {
        kodeBarang: '',
        name: 'Servis Tune Up Motor / Alat',
        category: 'Jasa / Servis',
        hpp: 10000,
        hargaJual: 65000,
        stock: '',
        minStockThreshold: '',
        komisi: 15000,
        description: 'Pembersihan karbu/injeksi & cek kelistrikan'
      },
      {
        kodeBarang: '',
        name: 'Ganti Oli & Cek Pengereman',
        category: 'Jasa / Servis',
        hpp: 5000,
        hargaJual: 25000,
        stock: '',
        minStockThreshold: '',
        komisi: 5000,
        description: 'Jasa ganti oli mesin/transmisi'
      },
      {
        kodeBarang: '',
        name: 'Jasa Bongkar Pasang Part',
        category: 'Jasa / Servis',
        hpp: 15000,
        hargaJual: 75000,
        stock: '',
        minStockThreshold: '',
        komisi: 20000,
        description: 'Pemasangan sparepart dengan jaminan presisi'
      },
      {
        kodeBarang: '',
        name: 'Pijat Refleksi Kepala & Pundak',
        category: 'Jasa / Servis',
        hpp: 5000,
        hargaJual: 40000,
        stock: '',
        minStockThreshold: '',
        komisi: 10000,
        description: 'Relaksasi tambahan setelah potong/servis'
      },
      {
        kodeBarang: 'BRG001',
        name: 'Oli Mesin Matic 0.8L / Pomade Styling',
        category: 'Produk / Barang',
        hpp: 35000,
        hargaJual: 55000,
        stock: 24,
        minStockThreshold: 5,
        komisi: 3000,
        description: 'Barang fisik dengan kontrol stok'
      },
      {
        kodeBarang: 'BRG002',
        name: 'Kampas Rem Depan / Shampoo 500ml',
        category: 'Produk / Barang',
        hpp: 25000,
        hargaJual: 45000,
        stock: 15,
        minStockThreshold: 3,
        komisi: 2000,
        description: 'Sparepart / produk konsumable fisik'
      },
      {
        kodeBarang: 'BRG003',
        name: 'Filter Udara / Hair Tonic Ginseng',
        category: 'Produk / Barang',
        hpp: 28000,
        hargaJual: 45000,
        stock: 20,
        minStockThreshold: 4,
        komisi: 2500,
        description: 'Part pengganti original / tonic perawatan'
      },
      {
        kodeBarang: 'BRG004',
        name: 'Busi Standar / Wax Rambut Matte',
        category: 'Produk / Barang',
        hpp: 15000,
        hargaJual: 25000,
        stock: 30,
        minStockThreshold: 5,
        komisi: 1500,
        description: 'Busi pengapian atau wax styling natural'
      },
      {
        kodeBarang: 'BRG005',
        name: 'Minyak Rem DOT 4 / Vitamin Rambut',
        category: 'Produk / Barang',
        hpp: 18000,
        hargaJual: 30000,
        stock: 25,
        minStockThreshold: 5,
        komisi: 2000,
        description: 'Cairan rem hidrolik atau kapsul vitamin'
      },
      {
        kodeBarang: 'BRG006',
        name: 'Bohlam Lampu / Parfum Badan 100ml',
        category: 'Produk / Barang',
        hpp: 20000,
        hargaJual: 35000,
        stock: 18,
        minStockThreshold: 4,
        komisi: 2000,
        description: 'Lampu cadangan atau wewangian premium'
      },
      {
        kodeBarang: '',
        name: 'Lulur Scrub / Servis Berkala Kelistrikan',
        category: 'Jasa / Servis',
        hpp: 10000,
        hargaJual: 55000,
        stock: '',
        minStockThreshold: '',
        komisi: 15000,
        description: 'Perawatan tubuh relaksasi atau kalibrasi kelistrikan sistem'
      },
      {
        kodeBarang: 'BRG007',
        name: 'Minyak Pelumas / Masker Rambut Keratin',
        category: 'Produk / Barang',
        hpp: 22000,
        hargaJual: 38000,
        stock: 20,
        minStockThreshold: 5,
        komisi: 2500,
        description: 'Pelumas part atau masker nutrisi rambut'
      },
      {
        kodeBarang: 'BRG008',
        name: 'Kain Lap Microfiber / Sisir Carbon Styling',
        category: 'Produk / Barang',
        hpp: 12000,
        hargaJual: 22000,
        stock: 35,
        minStockThreshold: 5,
        komisi: 1500,
        description: 'Perlengkapan pembersih atau sisir anti statis'
      },
    ];
    jasaRows.forEach(row => ws.addRow(row));

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
    // Cafe vs Resto different category templates (15 sample rows agar pagination > 10 langsung aktif)
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
      { kodeBarang: 'MNU007', name: 'Americano Iced', category: 'Kopi', hpp: 4000, hargaJual: 20000, stock: 90, minStockThreshold: 10, description: 'Espresso + air dingin dan es batu' },
      { kodeBarang: 'MNU008', name: 'Caramel Macchiato', category: 'Kopi', hpp: 9000, hargaJual: 28000, stock: 75, minStockThreshold: 10, description: 'Espresso + susu vanilla + drizzle karamel' },
      { kodeBarang: 'MNU009', name: 'Chocolate Signature', category: 'Non-Kopi', hpp: 7500, hargaJual: 24000, stock: 70, minStockThreshold: 10, description: 'Cokelat Belgia leleh + susu segar' },
      { kodeBarang: 'MNU010', name: 'French Fries Truffle', category: 'Makanan Ringan', hpp: 10000, hargaJual: 26000, stock: 50, minStockThreshold: 5, description: 'Kentang goreng renyah saus truffle' },
      { kodeBarang: 'MNU011', name: 'Cheese Cake Slice', category: 'Dessert', hpp: 16000, hargaJual: 38000, stock: 25, minStockThreshold: 3, description: 'Kue keju panggang New York style' },
      { kodeBarang: 'MNU012', name: 'Paket Ngopi Sore', category: 'Paket Sarapan', hpp: 18000, hargaJual: 45000, stock: 40, minStockThreshold: 5, description: 'Cappuccino hangat + 1 butter croissant' },
      { kodeBarang: 'MNU013', name: 'Cafe Latte Vanilla', category: 'Kopi', hpp: 7500, hargaJual: 26000, stock: 85, minStockThreshold: 10, description: 'Espresso + steamed milk lembut + syrup vanilla' },
      { kodeBarang: 'MNU014', name: 'Croffle Brown Sugar Boba', category: 'Dessert', hpp: 12000, hargaJual: 28000, stock: 40, minStockThreshold: 5, description: 'Croffle renyah mentega + saus brown sugar boba' },
      { kodeBarang: 'MNU015', name: 'Paket Nongkrong 2 Orang', category: 'Paket Sarapan', hpp: 28000, hargaJual: 65000, stock: 35, minStockThreshold: 5, description: '2 Kopi susu gula aren + 1 French Fries Truffle' },
    ] : fnbSubType === 'resto' ? [
      { kodeBarang: 'MNU001', name: 'Salad Caesar', category: 'Appetizer', hpp: 15000, hargaJual: 35000, stock: 50, minStockThreshold: 5, description: 'Salad segar dengan dressing caesar' },
      { kodeBarang: 'MNU002', name: 'Nasi Goreng Spesial', category: 'Main Course', hpp: 12000, hargaJual: 25000, stock: 100, minStockThreshold: 10, description: 'Menu makanan utama' },
      { kodeBarang: 'MNU003', name: 'Ayam Goreng Crispy', category: 'Main Course', hpp: 18000, hargaJual: 40000, stock: 80, minStockThreshold: 10, description: 'Ayam goreng renyah bumbu khusus' },
      { kodeBarang: 'MNU004', name: 'Es Teh Manis', category: 'Beverage', hpp: 1500, hargaJual: 5000, stock: 200, minStockThreshold: 20, description: 'Minuman segar' },
      { kodeBarang: 'MNU005', name: 'Pudding Coklat', category: 'Dessert', hpp: 8000, hargaJual: 20000, stock: 40, minStockThreshold: 5, description: 'Dessert manis lembut' },
      { kodeBarang: 'MNU006', name: 'Paket Hemat Nasi + Ayam + Teh', category: 'Paket Hemat', hpp: 25000, hargaJual: 55000, stock: 60, minStockThreshold: 5, description: 'Paket hemat siang hari' },
      { kodeBarang: 'MNU007', name: 'Sup Tom Yum Seafood', category: 'Appetizer', hpp: 18000, hargaJual: 38000, stock: 40, minStockThreshold: 5, description: 'Sup asam pedas segar aneka hidangan laut' },
      { kodeBarang: 'MNU008', name: 'Beef Steak Tenderloin', category: 'Main Course', hpp: 45000, hargaJual: 95000, stock: 35, minStockThreshold: 5, description: 'Daging sapi empuk saus lada hitam + kentang' },
      { kodeBarang: 'MNU009', name: 'Mie Goreng Seafood', category: 'Main Course', hpp: 16000, hargaJual: 36000, stock: 60, minStockThreshold: 10, description: 'Mie telur kenyal dimasak udang & cumi' },
      { kodeBarang: 'MNU010', name: 'Jus Alpukat Kerok', category: 'Beverage', hpp: 6000, hargaJual: 18000, stock: 80, minStockThreshold: 15, description: 'Alpukat mentega asli + kental manis cokelat' },
      { kodeBarang: 'MNU011', name: 'Banana Split Ice Cream', category: 'Dessert', hpp: 9000, hargaJual: 25000, stock: 30, minStockThreshold: 5, description: 'Pisang bakar 3 rasa es krim + ceri' },
      { kodeBarang: 'MNU012', name: 'Paket Keluarga 4 Pax', category: 'Paket Hemat', hpp: 90000, hargaJual: 195000, stock: 25, minStockThreshold: 3, description: '4 Nasi + 4 Ayam + Tumis Kangkung + 4 Es Teh' },
      { kodeBarang: 'MNU013', name: 'Gurame Terbang Saus Asam Manis', category: 'Main Course', hpp: 28000, hargaJual: 65000, stock: 35, minStockThreshold: 5, description: 'Ikan gurame segar goreng renyah saus nanas gurih' },
      { kodeBarang: 'MNU014', name: 'Es Campur Durian Spesial', category: 'Beverage', hpp: 9000, hargaJual: 26000, stock: 50, minStockThreshold: 10, description: 'Aneka buah, agar, kelapa muda dan daging durian' },
      { kodeBarang: 'MNU015', name: 'Paket Spesial Rombongan 6 Pax', category: 'Paket Hemat', hpp: 140000, hargaJual: 285000, stock: 20, minStockThreshold: 3, description: '6 Nasi + Gurame + Ayam + Kangkung + 6 Minuman' },
    ] : [
      { kodeBarang: 'MNU001', name: 'Nasi Goreng Spesial', category: 'Makanan', hpp: 12000, hargaJual: 25000, stock: 50, minStockThreshold: 5, description: 'Menu makanan utama' },
      { kodeBarang: 'MNU002', name: 'Es Teh Manis', category: 'Minuman', hpp: 1500, hargaJual: 5000, stock: 100, minStockThreshold: 10, description: 'Minuman segar' },
      { kodeBarang: 'MNU003', name: 'Kentang Goreng', category: 'Snack', hpp: 5000, hargaJual: 15000, stock: 80, minStockThreshold: 10, description: 'Snack goreng renyah' },
      { kodeBarang: 'MNU004', name: 'Es Krim Vanilla', category: 'Dessert', hpp: 8000, hargaJual: 20000, stock: 40, minStockThreshold: 5, description: 'Dessert manis segar' },
      { kodeBarang: 'MNU005', name: 'Mie Goreng Tek-tek', category: 'Makanan', hpp: 10000, hargaJual: 22000, stock: 60, minStockThreshold: 5, description: 'Menu mie khas pinggir jalan' },
      { kodeBarang: 'MNU006', name: 'Paket Hemat Nasi + Ayam + Teh', category: 'Paket Hemat', hpp: 25000, hargaJual: 55000, stock: 50, minStockThreshold: 5, description: 'Paket hemat siang hari' },
      { kodeBarang: 'MNU007', name: 'Ayam Bakar Madu', category: 'Makanan', hpp: 14000, hargaJual: 28000, stock: 50, minStockThreshold: 5, description: 'Ayam potong bumbu kecap madu gurih' },
      { kodeBarang: 'MNU008', name: 'Kopi Susu Gula Aren', category: 'Minuman', hpp: 4500, hargaJual: 15000, stock: 90, minStockThreshold: 10, description: 'Espresso + susu segar + gula aren asli' },
      { kodeBarang: 'MNU009', name: 'Tempe Mendoan Gurih', category: 'Snack', hpp: 4000, hargaJual: 12000, stock: 70, minStockThreshold: 10, description: 'Tempe mendoan hangat sambal kecap pedas' },
      { kodeBarang: 'MNU010', name: 'Pisang Goreng Keju', category: 'Dessert', hpp: 5000, hargaJual: 16000, stock: 45, minStockThreshold: 5, description: 'Pisang kepok manis tabur keju parut cokelat' },
      { kodeBarang: 'MNU011', name: 'Soto Ayam Lamongan', category: 'Makanan', hpp: 11000, hargaJual: 24000, stock: 55, minStockThreshold: 5, description: 'Kuah kuning koya gurih telur rebus' },
      { kodeBarang: 'MNU012', name: 'Paket Makan Siang Komplit', category: 'Paket Hemat', hpp: 22000, hargaJual: 45000, stock: 40, minStockThreshold: 5, description: 'Nasi + ayam bakar + mendoan + es teh manis' },
      { kodeBarang: 'MNU013', name: 'Bebek Goreng Sambal Korek', category: 'Makanan', hpp: 16000, hargaJual: 32000, stock: 45, minStockThreshold: 5, description: 'Bebek empuk goreng garing bumbu rempah' },
      { kodeBarang: 'MNU014', name: 'Es Kelapa Muda Jeruk', category: 'Minuman', hpp: 5000, hargaJual: 14000, stock: 80, minStockThreshold: 10, description: 'Air kelapa muda murni + perasan jeruk peras' },
      { kodeBarang: 'MNU015', name: 'Paket Bento Ayam Teriyaki', category: 'Paket Hemat', hpp: 17000, hargaJual: 35000, stock: 40, minStockThreshold: 5, description: 'Nasi bento + ayam teriyaki + salad + teh' },
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

    // Add sample rows FIRST
    sampleRows.forEach(row => ws.addRow(row));

    // Then apply data validation to empty rows after samples (row 14 onwards)
    const startRow = sampleRows.length + 2; // row 14
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
    // Default Retail (Universal: 15 sample rows agar pagination > 10 langsung aktif)
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

    const retailRows = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
        kodeBarang: 'BRG005',
        name: 'Minyak Goreng 2 Liter',
        category: 'Sembako',
        hpp: 28000,
        hargaJual: 34000,
        stock: 50,
        minStockThreshold: 10,
        satuan: 'Pouch',
        barcode: '8992757123460',
        discount: 0,
        ppn: 0,
        description: 'Minyak goreng kelapa sawit jernih'
      },
      {
        kodeBarang: 'BRG006',
        name: 'Beras Premium 5 Kg',
        category: 'Sembako',
        hpp: 65000,
        hargaJual: 75000,
        stock: 40,
        minStockThreshold: 5,
        satuan: 'Sak',
        barcode: '8992757123461',
        discount: 0,
        ppn: 0,
        description: 'Beras pulen harum bebas pemutih'
      },
      {
        kodeBarang: 'BRG007',
        name: 'Telur Ayam Negeri 1 Kg',
        category: 'Sembako',
        hpp: 24000,
        hargaJual: 29000,
        stock: 60,
        minStockThreshold: 10,
        satuan: 'Kg',
        barcode: '',
        discount: 0,
        ppn: 0,
        description: 'Telur segar pilihan peternakan lokal'
      },
      {
        kodeBarang: 'BRG008',
        name: 'Gula Pasir Putih 1 Kg',
        category: 'Sembako',
        hpp: 14000,
        hargaJual: 17500,
        stock: 50,
        minStockThreshold: 10,
        satuan: 'Pcs',
        barcode: '8992757123463',
        discount: 0,
        ppn: 0,
        description: 'Gula tebu murni kristal putih'
      },
      {
        kodeBarang: 'BRG009',
        name: 'Kopi Bubuk Kapal Api 165g',
        category: 'Minuman',
        hpp: 11000,
        hargaJual: 14000,
        stock: 45,
        minStockThreshold: 10,
        satuan: 'Bungkus',
        barcode: '8992757123464',
        discount: 0,
        ppn: 0,
        description: 'Kopi hitam bubuk mantap'
      },
      {
        kodeBarang: 'BRG010',
        name: 'Susu UHT Cokelat 1 Liter',
        category: 'Minuman',
        hpp: 16000,
        hargaJual: 20000,
        stock: 35,
        minStockThreshold: 8,
        satuan: 'Kotak',
        barcode: '8992757123465',
        discount: 0,
        ppn: 0,
        description: 'Susu sapi segar kaya kalsium'
      },
      {
        kodeBarang: 'BRG011',
        name: 'Shampo Anti Dandruff 170ml',
        category: 'Perawatan Diri',
        hpp: 19000,
        hargaJual: 25000,
        stock: 25,
        minStockThreshold: 5,
        satuan: 'Botol',
        barcode: '8992757123466',
        discount: 0,
        ppn: 0,
        description: 'Formula dingin bebas ketombe'
      },
      {
        kodeBarang: 'BRG012',
        name: 'Pasta Gigi Herbal 190g',
        category: 'Perawatan Diri',
        hpp: 12000,
        hargaJual: 16500,
        stock: 40,
        minStockThreshold: 8,
        satuan: 'Tube',
        barcode: '8992757123467',
        discount: 0,
        ppn: 0,
        description: 'Perlindungan gigi dan gusi sehat'
      },
      {
        kodeBarang: 'BRG013',
        name: 'Kecap Manis Botol 550ml',
        category: 'Sembako',
        hpp: 15000,
        hargaJual: 21000,
        stock: 40,
        minStockThreshold: 8,
        satuan: 'Botol',
        barcode: '8992757123468',
        discount: 0,
        ppn: 0,
        description: 'Kecap kedelai hitam gurih manis'
      },
      {
        kodeBarang: 'BRG014',
        name: 'Sikat Gigi Ultra Soft Isi 3',
        category: 'Perawatan Diri',
        hpp: 14000,
        hargaJual: 22000,
        stock: 30,
        minStockThreshold: 5,
        satuan: 'Pak',
        barcode: '8992757123469',
        discount: 0,
        ppn: 0,
        description: 'Bulu sikat lembut tidak melukai gusi'
      },
      {
        kodeBarang: 'BRG015',
        name: 'Kopi Instan 3 in 1 Bag Isi 30',
        category: 'Minuman',
        hpp: 25000,
        hargaJual: 34000,
        stock: 50,
        minStockThreshold: 10,
        satuan: 'Bag',
        barcode: '8992757123470',
        discount: 0,
        ppn: 0,
        description: 'Kopi sachet praktis manis krimer'
      },
    ];
    retailRows.forEach(row => ws.addRow(row));

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
