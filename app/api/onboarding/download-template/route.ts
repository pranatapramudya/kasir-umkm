import { NextRequest, NextResponse } from 'next/server';
import { isRentalTravelCategory, isServiceBusinessCategory, getFnbSubType } from '@/lib/business-category';
import { isFnBCategory } from '@/lib/navigation';

// Vercel function timeout: Hobby 10s, Pro 60s - set 30s for safety
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const kategoriUsaha = req.nextUrl.searchParams.get('category') || 'Jasa';
  const subType = (req.nextUrl.searchParams.get('type') || '').toLowerCase(); // 'rental' | 'properti' | 'cafe' | 'resto' | 'generic'
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha) && !isRental;
  const isFNB = isFnBCategory(kategoriUsaha);
  const fnbSubType = isFNB ? (subType || getFnbSubType(kategoriUsaha)) : 'generic';

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
      // (15 sample rows agar pagination > 10 langsung aktif)
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

      for (let row = 2; row <= 100; row++) {
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
        ['PRP006', 'Kamar Standard 102 - Lantai 1', 'Kamar Kost', 1, 'Dalam', 120000, 1900000, 30000, null, 'Listrik 10k + Air 5k + Wifi 5k + Kebersihan 10k', 'Tersedia', 'AC, KM Dalam, Single Bed, Meja Kerja, Lemari'],
        ['PRP007', 'Villa Mountain View - 2 Bedroom', 'Villa', 6, 'Dalam', 1100000, 0, 250000, null, 'Listrik 80k + Staff 80k + Kolam 50k + Kebersihan 40k', 'Tersedia', 'Private Gazebo, Dapur, Water Heater, Smart TV'],
        ['PRP008', 'Apartment 2BR Tower Beverly 15A', 'Apartment', 4, 'Dalam', 650000, 12000000, 110000, null, 'IPL 50k + Listrik 35k + Air 25k', 'Tersedia', '2 Kamar Tidur, Balkon Kota, Kitchen Set, Kolam Renang'],
        ['PRP009', 'Glamping Dome 02 - Sunrise View', 'Glamping', 3, 'Dalam', 650000, 0, 150000, null, 'Listrik 35k + Breakfast 60k + Staff 35k + Kayu 20k', 'Tersedia', 'Kubah Geodesik Transparan, Kasur Queen, Heater, Balkon'],
        ['PRP010', 'Family Homestay 3 Kamar - Heritage', 'Homestay', 8, 'Dalam', 850000, 0, 200000, null, 'Listrik 60k + Laundry 50k + Staff 50k + Kebersihan 40k', 'Tersedia', 'Rumah Joglo Asri, 3 Kamar Tidur, Garasi 2 Mobil, Dapur'],
        ['PRP011', 'Studio Room 05 - Guest House', 'Guest House', 2, 'Dalam', 250000, 3500000, 60000, null, 'Listrik 20k + Laundry 20k + Wifi 10k + Air 10k', 'Tersedia', 'Double Bed, Smart TV Netflix, Meja Kerja, Balkon'],
        ['PRP012', 'Presidential Suite Villa - Private Jacuzzi', 'Villa', 10, 'Dalam', 2800000, 0, 600000, null, 'Jacuzzi 150k + Staff 200k + Listrik 150k + Amenities 100k', 'Tersedia', '4 Kamar Mewah, Jacuzzi Air Hangat, Biliar, BBQ Pit'],
      ];

      propertiData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          if (val !== null) {
            wsProperti.getCell(i + 2, j + 1).value = val;
          }
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
      // (15 sample rows agar pagination > 10 langsung aktif)
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

      for (let row = 2; row <= 100; row++) {
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
        ['ALT006', 'Lensa Sony FE 85mm F1.4 GM', 'Kamera & Lensa', 'Sony', 'Lensa, Hood, Pouch, Filter UV', 180000, 25000, 25000, null, 'Tersedia', 'Lensa potret bokeh tajam | HPP: Pembersihan optik'],
        ['ALT007', 'Gimbal Stabilizer DJI Ronin RS 3', 'Kamera & Lensa', 'DJI', 'Gimbal, BG21 Grip, Quick Release, Hard Case', 150000, 25000, 20000, null, 'Tersedia', 'Beban max 3kg, stabilisasi 3-axis | HPP: Pengecekan motor'],
        ['ALT008', 'Tenda Dome Borneo 4 Orang', 'Outdoor & Camping', 'Consina', 'Tenda, Pasak, Frame Aloi, Flysheet', 80000, 0, 15000, null, 'Tersedia', 'Double layer waterproof tahan badai | HPP: Cuci tenda'],
        ['ALT009', 'Nesting & Kompor Gas Portable Camping', 'Outdoor & Camping', 'Kovea', 'Nesting 3 Panci, Kompor Ultralight, Windshield', 40000, 0, 8000, null, 'Tersedia', 'Peralatan masak outdoor lengkap | HPP: Pembersihan'],
        ['ALT010', 'Mixer Audio Yamaha MG16XU 16 Channel', 'Sound System & Event', 'Yamaha', 'Mixer 16 Ch, Hard Flight Case, Kabel Power', 300000, 0, 50000, null, 'Tersedia', '16 input channel USB audio | HPP: Kalibrasi knob & fader'],
        ['ALT011', 'Microphone Wireless Shure BLX288 2 Mic', 'Sound System & Event', 'Shure', 'Receiver Dual, 2 Mic Genggam, Adaptor, Koper', 175000, 0, 30000, null, 'Tersedia', 'Jangkauan 100m suara jernih anti interferensi | HPP: Baterai & uji sinyal'],
        ['ALT012', 'Nintendo Switch OLED Neon + 4 Joycon', 'Console & Game', 'Nintendo', 'Switch OLED Dock, 4 Joycon, Grip, Mario Kart 8, Smash Bros', 120000, 20000, 25000, null, 'Tersedia', 'Cocok party game keluarga & kantor | HPP: Pembersihan stik'],
        ['ALT013', 'Drone DJI Mini 4 Pro Fly More Combo', 'Kamera & Lensa', 'DJI', 'Drone, RC 2, 3 Baterai, Hub Charger, Shoulder Bag', 250000, 40000, 45000, null, 'Tersedia', 'Video 4K 60fps HDR, sensor rintangan omnidirectional | HPP: Propeller replacement & maintenance'],
        ['ALT014', 'Genset Silent 5000 Watt Bensin', 'Sound System & Event', 'Yamaha', 'Genset Silent, Roda Dorong, Kabel Colokan 20m', 350000, 0, 80000, null, 'Tersedia', 'Daya cadangan event outdoor & shooting film | HPP: Oli & servis berkala'],
        ['ALT015', 'Set Kursi & Meja Lipat Camping 4 Orang', 'Outdoor & Camping', 'Naturehike', '1 Meja Roll Alumunium, 4 Kursi Lipat Kermit, Tas', 60000, 0, 12000, null, 'Tersedia', 'Alat santai camping portable dan kokoh | HPP: Pembersihan & tas'],
      ];

      alatData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          if (val !== null) {
            wsAlat.getCell(i + 2, j + 1).value = val;
          }
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
    
    if (subType === 'bus' || subType === 'minibus') {
      // ------------------------------------------
      // TEMPLATE KHUSUS: MINIBUS & BUS PARIWISATA / ZIARAH
      // (15 sample rows agar pagination > 10 langsung aktif)
      // ------------------------------------------
      const wsBus = workbook.addWorksheet('1. Armada Minibus & Bus');
      wsBus.columns = [
        { header: 'Kode Unit', key: 'kodeUnit', width: 18 },
        { header: 'Nama Unit Kendaraan / Plat', key: 'name', width: 44 },
        { header: 'Tipe Kendaraan', key: 'tipe', width: 20 },
        { header: 'Transmisi', key: 'transmisi', width: 16 },
        { header: 'Tahun', key: 'tahun', width: 10 },
        { header: 'Harga Sewa/Hari (Rp)', key: 'hargaHarian', width: 22 },
        { header: 'Harga Sewa/Jam (Rp)', key: 'hargaJam', width: 20 },
        { header: 'HPP / Biaya Operasional / Setoran (Rp)', key: 'hppHarian', width: 34 },
        { header: 'Margin %', key: 'marginPct', width: 14 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'Catatan / Spesifikasi', key: 'description', width: 55 },
      ];

      for (let row = 2; row <= 150; row++) {
        wsBus.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Minibus,Bus,Elf,Hiace,Medium Bus,Big Bus"'],
          showErrorMessage: true,
          errorTitle: 'Pilihan Tipe Armada',
          error: 'Pilih: Minibus, Bus, Elf, Hiace, Medium Bus, atau Big Bus',
        };
        wsBus.getCell(`D${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Manual,Otomatis"'] };
        wsBus.getCell(`J${row}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Tersedia,Disewa,Perbaikan,Perawatan,Tidak Aktif"'] };
        // Auto Margin % formula
        wsBus.getCell(`I${row}`).value = { formula: `IF(F${row}>0,(F${row}-H${row})/F${row}*100,0)` };
        wsBus.getCell(`I${row}`).numFmt = '0.0"%"';
      }

      const busData = [
        ['BUS001', 'Hiace Commuter 14 Seat "Arimbi" - B 7123 PQA (Garasi Sendiri)', 'Hiace', 'Manual', 2023, 1100000, 150000, 350000, null, 'Tersedia', '14 seat penumpang, AC ducting dingin, armada sendiri | HPP: Solar 200k + Driver 100k + Kas 50k'],
        ['BUS002', 'Hiace Premio Luxury 10 Seat "Sultan" - B 7890 KLR (Mitra - Bpk Joko)', 'Hiace', 'Manual', 2024, 1500000, 200000, 1050000, null, 'Tersedia', '10 Captain seat, TV Android, karaoke | HPP: Setoran Mitra 70% (1.050k) | Garasi profit 450k/hari'],
        ['BUS003', 'Elf Long Giga 19 Seat "Barokah" - B 7456 ZX (Garasi Sendiri)', 'Elf', 'Manual', 2022, 1300000, 180000, 450000, null, 'Tersedia', '19 seat rombongan ziarah/wisata, bagasi luas | HPP: Solar 250k + Driver 150k + Kas 50k'],
        ['BUS004', 'Elf Long Coaster 19 Seat "Madinah" - B 7661 YU (Mitra - H. Rohman)', 'Elf', 'Manual', 2023, 1300000, 180000, 900000, null, 'Tersedia', '19 seat rombongan majlis taklim/ziarah | HPP: Setoran wajib pemilik mitra 900k | Garasi fee 400k'],
        ['BUS005', 'Medium Bus 35 Seat "Sahabat" - B 7999 TR (Garasi Sendiri)', 'Medium Bus', 'Manual', 2021, 2300000, 300000, 800000, null, 'Tersedia', '35 seat 2-2, Audio Subwoofer, Mic Karaoke, Coolbox | HPP: Solar 450k + Driver 250k + Kenek 100k'],
        ['BUS006', 'Big Bus SHD 50 Seat "Al-Madinah" - B 7001 AA (Garasi Sendiri)', 'Big Bus', 'Manual', 2022, 3600000, 450000, 1400000, null, 'Tersedia', '50 seat 2-2, Toilet, Smoking Area, Dispenser, Full AC | HPP: Solar 800k + Driver 400k + Kenek 200k'],
        ['BUS007', 'Big Bus HDD 59 Seat "Ziarah Barokah" - B 7333 WZ (Mitra - PO Barokah)', 'Big Bus', 'Manual', 2020, 3500000, 400000, 2800000, null, 'Tersedia', '59 seat konfigurasi 2-3 rombongan ziarah akbar | HPP: Bagi hasil mitra 80% (2.8jt) | Garasi fee 700k'],
        ['BUS008', 'Medium Bus 31 Seat "Pariwisata Jaya" - B 7412 PLM (Mitra Pak Dedi)', 'Medium Bus', 'Manual', 2022, 2100000, 280000, 1600000, null, 'Tersedia', '31 seat pariwisata eksekutif | HPP: Setoran pemilik 1.6jt | Profit garasi 500k'],
        ['BUS009', 'Hiace Premio 12 Seat "Executive" - B 7555 KLO (Garasi Sendiri)', 'Hiace', 'Manual', 2023, 1400000, 190000, 420000, null, 'Tersedia', '12 seat reclining, port charger tiap seat | HPP: Solar 220k + Driver 130k + Kas 70k'],
        ['BUS010', 'Elf Short 15 Seat "Kencana" - B 7222 TUV (Garasi Sendiri)', 'Elf', 'Manual', 2021, 1050000, 150000, 350000, null, 'Tersedia', '15 seat city tour & antar jemput bandara | HPP: Solar 180k + Driver 120k + Kas 50k'],
        ['BUS011', 'Big Bus Double Decker 60 Seat "Sultan Wisata" - B 7000 VVIP (Garasi Sendiri)', 'Big Bus', 'Manual', 2023, 5000000, 650000, 1900000, null, 'Tersedia', 'Bus tingkat mewah, sleeper seat lantai bawah | HPP: Solar 1jt + Driver 500k + Kru 400k'],
        ['BUS012', 'Medium Bus Long 39 Seat "Ziarah Barokah 2" - B 7888 DOA (Mitra KH Ahmad)', 'Medium Bus', 'Manual', 2021, 2400000, 310000, 1850000, null, 'Tersedia', '39 seat konfigurasi ziarah rombongan | HPP: Setoran mitra 1.85jt | Profit garasi 550k'],
        ['BUS013', 'Big Bus Super Executive 28 Seat "Sultan Solo" - AD 7788 VVIP (Garasi Sendiri)', 'Big Bus', 'Manual', 2024, 4500000, 600000, 1800000, null, 'Tersedia', '28 Seat 2-1 Legrest, Toilet, Coffee Maker | HPP: Solar 900k + Driver 500k + Kru 400k'],
        ['BUS014', 'Medium Bus Long 39 Seat "Ziarah Barokah 3" - B 7999 DOA (Mitra PO Hidayah)', 'Medium Bus', 'Manual', 2022, 2400000, 310000, 1850000, null, 'Tersedia', '39 Seat ziarah majlis taklim luar kota | HPP: Setoran mitra 1.85jt | Profit 550k'],
        ['BUS015', 'Hiace Premio 14 Seat "Arimbi Wisata" - B 7222 QWE (Garasi Sendiri)', 'Hiace', 'Manual', 2023, 1450000, 195000, 450000, null, 'Tersedia', '14 Reclining seat, Full AC, TV Karaoke | HPP: Solar 240k + Driver 140k + Kas 70k'],
      ];

      busData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          if (val !== null) {
            wsBus.getCell(i + 2, j + 1).value = val;
          }
        });
      });

      // Sheet 2: Layanan & Add-on Khusus Bus & Ziarah
      const wsLayananBus = workbook.addWorksheet('2. Layanan Tambahan Bus');
      wsLayananBus.columns = [
        { header: 'Kode Layanan', key: 'kodeLayanan', width: 18 },
        { header: 'Nama Layanan', key: 'name', width: 38 },
        { header: 'Kategori', key: 'category', width: 22 },
        { header: 'Tarif (Rp)', key: 'harga', width: 18 },
        { header: 'Satuan', key: 'satuan', width: 18 },
        { header: 'Komisi Driver / Kru (Rp)', key: 'komisi', width: 24 },
        { header: 'Deskripsi', key: 'description', width: 50 },
      ];

      for (let row = 2; row <= 50; row++) {
        wsLayananBus.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Supir/Driver,Kenek/Kru,BBM/Solar,Tol & Parkir,Spanduk/Banner,Lainnya"'],
        };
      }

      const layananBusData = [
        ['SV001', 'Jasa Driver Utama Pariwisata (Luar Kota)', 'Supir/Driver', 300000, 'Per Hari', 250000, 'Driver profesional berpengalaman rute wisata nusantara'],
        ['SV002', 'Jasa Co-Driver / Kenek Bus', 'Kenek/Kru', 150000, 'Per Hari', 120000, 'Kru pendamping bantu parkir, bagasi & kebersihan unit'],
        ['SV003', 'Paket Solar Full Tank / Uang Jalan Standar', 'BBM/Solar', 600000, 'Per Trip', 0, 'Pengisian solar subsidi/dexlite siap jalan'],
        ['SV004', 'Paket Tol & Retribusi Parkir Ziarah', 'Tol & Parkir', 350000, 'Per Trip', 0, 'Estimasi biaya tol Trans Jawa & tiket parkir kawasan ziarah'],
        ['SV005', 'Cetak Banner / Spanduk Rombongan Bus', 'Spanduk/Banner', 100000, 'Per Pcs', 30000, 'Spanduk nama rombongan ukuran 3x1 meter ditempel depan bus'],
      ];

      layananBusData.forEach((rowData, i) => {
        rowData.forEach((val, j) => {
          wsLayananBus.getCell(i + 2, j + 1).value = val;
        });
      });

      const bufferBus = await workbook.xlsx.writeBuffer();
      return new NextResponse(bufferBus, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template_import_minibus_bus_pariwisata.xlsx"',
        },
      });
    }

    // DEFAULT: TEMPLATE KHUSUS RENTAL & TRAVEL
    // ------------------------------------------
    // Sheet 1: Armada Kendaraan (15 sample rows agar pagination > 10 langsung aktif)
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

    for (let row = 2; row <= 100; row++) {
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
      ['UNT006', 'Fortuner 2.8 VRZ 2023 - D 2345 QWE', 'SUV', 'Otomatis', 2023, 1200000, 180000, 350000, null, 'Tersedia', 'SUV mewah tangguh 7 seat | HPP: Solar 150k + Driver 120k + Perawatan 80k'],
      ['UNT007', 'Honda Brio RS 2023 - D 6789 RTY', 'Sedan', 'Otomatis', 2023, 350000, 50000, 100000, null, 'Tersedia', 'City car lincah irit bensin | HPP: Bensin 60k + Perawatan 40k'],
      ['UNT008', 'Mitsubishi Pajero Sport 2022 - D 3456 UIO', 'SUV', 'Otomatis', 2022, 1150000, 175000, 320000, null, 'Tersedia', 'SUV premium diesel sunroof | HPP: Solar 140k + Driver 110k + Perawatan 70k'],
      ['UNT009', 'Daihatsu Xenia 2023 - D 7890 PAS', 'MPV', 'Manual', 2023, 400000, 65000, 130000, null, 'Tersedia', 'Mobil keluarga ekonomis 7 seat | HPP: Bensin 70k + Servis 60k'],
      ['UNT010', 'Honda PCX 160 2024 - D 1122 DFH', 'Motor', 'Matic', 2024, 95000, 20000, 25000, null, 'Tersedia', 'Motor matic nyaman bagasi luas | HPP: Bensin 15k + Oli/servis 10k'],
      ['UNT011', 'Toyota Alphard 2.5 G 2022 - D 8888 VIP', 'MPV', 'Otomatis', 2022, 2500000, 350000, 750000, null, 'Tersedia', 'VIP Premium Captain Seat & Pilot Seat | HPP: Bensin 300k + Driver VIP 250k + Kas 200k'],
      ['UNT012', 'Suzuki Carry Pick Up 2023 - D 9900 BOX', 'Pickup', 'Manual', 2023, 300000, 50000, 90000, null, 'Tersedia', 'Mobil bak angkut barang pindahan | HPP: Bensin 50k + Perawatan 40k'],
      ['UNT013', 'Toyota Kijang Innova Zenix 2024 - D 1414 HYB', 'MPV', 'Otomatis', 2024, 850000, 120000, 250000, null, 'Tersedia', 'Hybrid irit bensin, 7 seat, panoramic roof | HPP: Bensin 120k + Driver 80k + Perawatan 50k'],
      ['UNT014', 'Honda HR-V SE 2023 - D 5566 JKL', 'SUV', 'Otomatis', 2023, 600000, 90000, 180000, null, 'Tersedia', 'Compact SUV stylish bensin | HPP: Bensin 90k + Driver 50k + Kas 40k'],
      ['UNT015', 'Yamaha XMAX 250 Connected 2024 - D 7788 MAX', 'Motor', 'Matic', 2024, 250000, 40000, 60000, null, 'Tersedia', 'Maxi scooter bertenaga touring luar kota | HPP: Bensin 35k + Perawatan 25k'],
    ];

    kendaraanData.forEach((rowData, i) => {
      rowData.forEach((val, j) => {
        if (val !== null) {
          wsKendaraan.getCell(i + 2, j + 1).value = val;
        }
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
  // 2. F&B / KULINER - Dynamic by sub-type (cafe/resto/generic)
  // ==========================================
  if (isFNB) {
    if (fnbSubType === 'cafe') {
      // ------------------------------------------
      // TEMPLATE KHUSUS: CAFE & COFFEE SHOP
      // (15 sample rows agar pagination > 10 langsung aktif)
      // ------------------------------------------
      const ws = workbook.addWorksheet('Menu Cafe');
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

      // Add 15 sample rows
      const cafeSamples = [
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
      ];
      cafeSamples.forEach(row => ws.addRow(row));

      // Then apply data validation to empty rows after samples
      const startRow = cafeSamples.length + 2; // row 14
      for (let row = startRow; row <= 200; row++) {
        ws.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Kopi,Non-Kopi,Makanan Ringan,Dessert,Paket Sarapan"'],
        };
      }

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template_import_cafe.xlsx"',
        },
      });
    }

    if (fnbSubType === 'resto') {
      // ------------------------------------------
      // TEMPLATE KHUSUS: RESTORAN & RUMAH MAKAN
      // (15 sample rows agar pagination > 10 langsung aktif)
      // ------------------------------------------
      const ws = workbook.addWorksheet('Menu Resto');
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

      // Add 15 sample rows
      const restoSamples = [
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
      ];
      restoSamples.forEach(row => ws.addRow(row));

      // Then apply data validation to empty rows after samples
      const startRow = restoSamples.length + 2; // row 14
      for (let row = startRow; row <= 200; row++) {
        ws.getCell(`C${row}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"Appetizer,Main Course,Dessert,Beverage,Paket Hemat"'],
        };
      }

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template_import_fnb_resto.xlsx"',
        },
      });
    }

    // ------------------------------------------
    // TEMPLATE GENERIC (fallback F&B)
    // (15 sample rows agar pagination > 10 langsung aktif)
    // ------------------------------------------
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

    // Add 15 sample rows
    const genericSamples = [
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
    genericSamples.forEach(row => ws.addRow(row));

    // Then apply data validation to empty rows after samples
    const startRow = genericSamples.length + 2; // row 14
    for (let row = startRow; row <= 200; row++) {
      ws.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Makanan,Minuman,Snack,Dessert,Paket Hemat"'],
      };
    }

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
  // (15 sample rows: 6 Jasa + 6 Barang, agar pagination > 10 langsung aktif)
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

    // Add 15 sample rows
    const jasaSamples = [
      ['', 'Potong Rambut Pria / Servis Ringan', 'Jasa / Servis', 5000, 45000, '', '', 10000, 'Layanan pangkas + styling (stok otomatis tak terbatas)'],
      ['', 'Cuci & Creambath Rambut', 'Jasa / Servis', 8000, 50000, '', '', 12000, 'Perawatan rambut bersih relaksasi'],
      ['', 'Servis Tune Up Motor / Alat', 'Jasa / Servis', 10000, 65000, '', '', 15000, 'Pembersihan karbu/injeksi & cek kelistrikan'],
      ['', 'Ganti Oli & Cek Pengereman', 'Jasa / Servis', 5000, 25000, '', '', 5000, 'Jasa ganti oli mesin/transmisi'],
      ['', 'Jasa Bongkar Pasang Part', 'Jasa / Servis', 15000, 75000, '', '', 20000, 'Pemasangan sparepart dengan jaminan presisi'],
      ['', 'Pijat Refleksi Kepala & Pundak', 'Jasa / Servis', 5000, 40000, '', '', 10000, 'Relaksasi tambahan setelah potong/servis'],
      ['BRG001', 'Oli Mesin Matic 0.8L / Pomade Styling', 'Produk / Barang', 35000, 55000, 24, 5, 3000, 'Barang fisik dengan kontrol stok'],
      ['BRG002', 'Kampas Rem Depan / Shampoo 500ml', 'Produk / Barang', 25000, 45000, 15, 3, 2000, 'Sparepart / produk konsumable'],
      ['BRG003', 'Filter Udara / Hair Tonic Ginseng', 'Produk / Barang', 28000, 45000, 20, 4, 2500, 'Part pengganti original / tonic perawatan'],
      ['BRG004', 'Busi Standar / Wax Rambut Matte', 'Produk / Barang', 15000, 25000, 30, 5, 1500, 'Busi pengapian atau wax styling natural'],
      ['BRG005', 'Minyak Rem DOT 4 / Vitamin Rambut', 'Produk / Barang', 18000, 30000, 25, 5, 2000, 'Cairan rem hidrolik atau kapsul vitamin'],
      ['BRG006', 'Bohlam Lampu / Parfum Badan 100ml', 'Produk / Barang', 20000, 35000, 18, 4, 2000, 'Lampu cadangan atau wewangian premium'],
      ['', 'Lulur Scrub / Servis Berkala Kelistrikan', 'Jasa / Servis', 10000, 55000, '', '', 15000, 'Perawatan tubuh relaksasi atau kalibrasi kelistrikan sistem'],
      ['BRG007', 'Minyak Pelumas / Masker Rambut Keratin', 'Produk / Barang', 22000, 38000, 20, 5, 2500, 'Pelumas part atau masker nutrisi rambut'],
      ['BRG008', 'Kain Lap Microfiber / Sisir Carbon Styling', 'Produk / Barang', 12000, 22000, 35, 5, 1500, 'Perlengkapan pembersih atau sisir anti statis'],
    ];
    jasaSamples.forEach(row => ws.addRow(row));

    // Then apply data validation to empty rows after samples
    const startRow = jasaSamples.length + 2; // row 14
    for (let row = startRow; row <= 100; row++) {
      ws.getCell(`C${row}`).dataValidation = { type: 'list', allowBlank: false, formulae: ['"Jasa / Servis,Produk / Barang"'], showErrorMessage: true, errorTitle: 'Pilihan Kategori', error: 'Silakan pilih Jasa / Servis atau Produk / Barang dari dropdown.' };
    }

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
  // (15 sample rows agar pagination > 10 langsung aktif)
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
  wsRetail.addRow(['BRG001', 'Indomie Goreng Original', 'Makanan', 2500, 3500, 100, 10, 'Pcs', '8992757123456', 0, 0, 'Mie instan goreng rasa ayam bawang']);
  wsRetail.addRow(['BRG002', 'Aqua Botol 600ml', 'Minuman', 2000, 3500, 120, 24, 'Botol', '8992757123457', 0, 0, 'Air mineral kemasan botol']);
  wsRetail.addRow(['BRG003', 'Kemeja Polos Putih Katun', 'Pakaian', 50000, 85000, 20, 3, 'Pcs', '', 0, 0, 'Bahan katun premium stretch']);
  wsRetail.addRow(['BRG004', 'Sabun Cair Mandi 450ml', 'Kebutuhan Harian', 18000, 24000, 30, 5, 'Pouch', '', 0, 0, 'Sabun mandi antibakteri refill']);
  wsRetail.addRow(['BRG005', 'Minyak Goreng 2 Liter', 'Sembako', 28000, 34000, 50, 10, 'Pouch', '8992757123460', 0, 0, 'Minyak goreng kelapa sawit jernih']);
  wsRetail.addRow(['BRG006', 'Beras Premium 5 Kg', 'Sembako', 65000, 75000, 40, 5, 'Sak', '8992757123461', 0, 0, 'Beras pulen harum bebas pemutih']);
  wsRetail.addRow(['BRG007', 'Telur Ayam Negeri 1 Kg', 'Sembako', 24000, 29000, 60, 10, 'Kg', '', 0, 0, 'Telur segar pilihan peternakan lokal']);
  wsRetail.addRow(['BRG008', 'Gula Pasir Putih 1 Kg', 'Sembako', 14000, 17500, 50, 10, 'Pcs', '8992757123463', 0, 0, 'Gula tebu murni kristal putih']);
  wsRetail.addRow(['BRG009', 'Kopi Bubuk Kapal Api 165g', 'Minuman', 11000, 14000, 45, 10, 'Bungkus', '8992757123464', 0, 0, 'Kopi hitam bubuk mantap']);
  wsRetail.addRow(['BRG010', 'Susu UHT Cokelat 1 Liter', 'Minuman', 16000, 20000, 35, 8, 'Kotak', '8992757123465', 0, 0, 'Susu sapi segar kaya kalsium']);
  wsRetail.addRow(['BRG011', 'Shampo Anti Dandruff 170ml', 'Perawatan Diri', 19000, 25000, 25, 5, 'Botol', '8992757123466', 0, 0, 'Formula dingin bebas ketombe']);
  wsRetail.addRow(['BRG012', 'Pasta Gigi Herbal 190g', 'Perawatan Diri', 12000, 16500, 40, 8, 'Tube', '8992757123467', 0, 0, 'Perlindungan gigi dan gusi sehat']);
  wsRetail.addRow(['BRG013', 'Kecap Manis Botol 550ml', 'Sembako', 15000, 21000, 40, 8, 'Botol', '8992757123468', 0, 0, 'Kecap kedelai hitam gurih manis']);
  wsRetail.addRow(['BRG014', 'Sikat Gigi Ultra Soft Isi 3', 'Perawatan Diri', 14000, 22000, 30, 5, 'Pak', '8992757123469', 0, 0, 'Bulu sikat lembut tidak melukai gusi']);
  wsRetail.addRow(['BRG015', 'Kopi Instan 3 in 1 Bag Isi 30', 'Minuman', 25000, 34000, 50, 10, 'Bag', '8992757123470', 0, 0, 'Kopi sachet praktis manis krimer']);

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="template_import_retail.xlsx"',
    },
  });
}
