import { isRentalTravelCategory, isServiceBusinessCategory } from './business-category';

export async function downloadExcelTemplate(kategoriUsaha: string = 'Jasa') {
  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha) && !isRental;
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';

  const XLSX = await import('xlsx');
  let data: any[] = [];
  let filename = "template_import.xlsx";

  if (isRental) {
    data = [
      {
        kodeBarang: "UNT001",
        name: "Avanza Veloz 2023 / Kamar Deluxe 101",
        category: "Kendaraan / Properti",
        hpp: 150000,
        hargaJual: 450000,
        description: "Bensin irit, transmisi otomatis / Kamar mandi dalam, AC, Smart TV"
      },
      {
        kodeBarang: "UNT002",
        name: "Innova Reborn 2022 / Kamar Standar 102",
        category: "Kendaraan / Properti",
        hpp: 200000,
        hargaJual: 650000,
        description: "Diesel 2.4, Captain Seat / Kipas angin, kasur queen size"
      }
    ];
    filename = "template_import_rental_properti.xlsx";
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, filename);
    return;
  } else if (isJasa) {
    const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Kasir UMKM';
    workbook.created = new Date();

    // Template 1 Sheet Terpadu: Layanan Jasa & Produk Barang (Sparepart)
    // Kolom C adalah Kategori (Dropdown tepat di Kolom C)
    // Kolom F adalah Qty (Stok), Kolom G adalah Batas Minimum Stok
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

    // Data Validation Dropdown TEPAT pada kolom Kategori (Kolom C, baris 2 sampai 200)
    for (let row = 2; row <= 200; row++) {
      ws.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: ['"Jasa / Servis,Produk / Barang"'],
        showErrorMessage: true,
        errorTitle: 'Pilihan Kategori',
        error: 'Silakan pilih Jasa / Servis atau Produk / Barang dari dropdown.'
      };
    }

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
    data = [
      {
        kodeBarang: "MNU001",
        name: "Nasi Goreng Spesial",
        category: "Makanan",
        hpp: 12000,
        hargaJual: 25000,
        stock: 50,
        minStockThreshold: 5,
        description: "Menu makanan utama"
      },
      {
        kodeBarang: "MNU002",
        name: "Es Teh Manis",
        category: "Minuman",
        hpp: 1500,
        hargaJual: 5000,
        stock: 100,
        minStockThreshold: 10,
        description: "Minuman segar"
      }
    ];
    filename = "template_import_fnb.xlsx";
  } else {
    data = [
      {
        kodeBarang: "BRG001",
        name: "Kemeja Polos Putih",
        category: "Pakaian",
        hpp: 50000,
        hargaJual: 85000,
        stock: 20,
        minStockThreshold: 3,
        description: "Bahan katun premium"
      },
      {
        kodeBarang: "BRG002",
        name: "Celana Chino Slimfit",
        category: "Celana",
        hpp: 75000,
        hargaJual: 125000,
        stock: 15,
        minStockThreshold: 2,
        description: "Warna krem, stretch"
      }
    ];
    filename = "template_import_retail.xlsx";
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, filename);
}
