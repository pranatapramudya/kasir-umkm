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
        name: "Avanza Veloz 2023 / Kamar Deluxe 101",
        category: "Kendaraan / Properti",
        hpp: 150000,
        hargaJual: 450000,
        description: "Bensin irit, transmisi otomatis / Kamar mandi dalam, AC, Smart TV"
      },
      {
        name: "Innova Reborn 2022 / Kamar Standar 102",
        category: "Kendaraan / Properti",
        hpp: 200000,
        hargaJual: 650000,
        description: "Diesel 2.4, Captain Seat / Kipas angin, kasur queen size"
      }
    ];
    filename = "template_import_rental_properti.xlsx";
  } else if (isJasa) {
    const ExcelJS = (await import('exceljs')).default || (await import('exceljs'));
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Kasir UMKM';
    workbook.created = new Date();

    // Sheet 1: Jasa / Servis
    const wsJasa = workbook.addWorksheet('Jasa');
    wsJasa.columns = [
      { header: 'Nama Layanan', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'HPP / Biaya Modal (Rp)', key: 'hpp', width: 24 },
      { header: 'Tarif Layanan (Rp)', key: 'hargaJual', width: 22 },
      { header: 'Komisi Staf (Rp)', key: 'komisi', width: 20 },
      { header: 'Deskripsi Layanan', key: 'description', width: 45 },
    ];

    wsJasa.addRow({
      name: 'Potong Rambut Pria / Servis Ringan',
      category: 'Jasa / Servis',
      hpp: 5000,
      hargaJual: 45000,
      komisi: 10000,
      description: 'Layanan standar cuci + potong rambut'
    });

    wsJasa.addRow({
      name: 'Ganti Oli & Tune Up / Cuci Mobil Komplit',
      category: 'Jasa / Servis',
      hpp: 10000,
      hargaJual: 75000,
      komisi: 15000,
      description: 'Pembersihan menyeluruh & pengecekan berkala'
    });

    // Data Validation Dropdown C2:C200 Sheet Jasa
    for (let row = 2; row <= 200; row++) {
      wsJasa.getCell(`C${row}`).dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: ['"Jasa / Servis,Produk / Barang"'],
        showErrorMessage: true,
        errorTitle: 'Pilihan Kategori',
        error: 'Silakan pilih Jasa / Servis atau Produk / Barang dari dropdown.'
      };
    }

    // Sheet 2: Produk / Barang (Sparepart)
    const wsBarang = workbook.addWorksheet('Produk');
    wsBarang.columns = [
      { header: 'Kode Barang (SKU)', key: 'kodeBarang', width: 20 },
      { header: 'Nama Produk / Barang', key: 'name', width: 36 },
      { header: 'Kategori', key: 'category', width: 22 },
      { header: 'HPP / Modal Beli (Rp)', key: 'hpp', width: 24 },
      { header: 'Harga Jual (Rp)', key: 'hargaJual', width: 20 },
      { header: 'Qty (Stok)', key: 'stock', width: 14 },
      { header: 'Batas Minimum Stok', key: 'minStockThreshold', width: 20 },
      { header: 'Komisi Staf (Rp)', key: 'komisi', width: 20 },
      { header: 'Deskripsi', key: 'description', width: 40 },
    ];

    wsBarang.addRow({
      kodeBarang: 'BRG001',
      name: 'Oli Mesin Matic 0.8L / Pomade Styling',
      category: 'Produk / Barang',
      hpp: 35000,
      hargaJual: 55000,
      stock: 24,
      minStockThreshold: 5,
      komisi: 3000,
      description: 'Oli original / Pomade oil based'
    });

    wsBarang.addRow({
      kodeBarang: 'BRG002',
      name: 'Kampas Rem Depan / Shampoo 500ml',
      category: 'Produk / Barang',
      hpp: 25000,
      hargaJual: 45000,
      stock: 15,
      minStockThreshold: 3,
      komisi: 2000,
      description: 'Kampas rem cakram / Shampoo salon'
    });

    // Data Validation Dropdown C2:C200 Sheet Produk
    for (let row = 2; row <= 200; row++) {
      wsBarang.getCell(`C${row}`).dataValidation = {
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
        name: "Nasi Goreng Spesial",
        category: "Makanan",
        hpp: 12000,
        hargaJual: 25000,
        stock: 50,
        minStockThreshold: 5
      },
      {
        name: "Es Teh Manis",
        category: "Minuman",
        hpp: 1500,
        hargaJual: 5000,
        stock: 100,
        minStockThreshold: 10
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
        minStockThreshold: 3
      },
      {
        kodeBarang: "BRG002",
        name: "Celana Chino Slimfit",
        category: "Celana",
        hpp: 75000,
        hargaJual: 125000,
        stock: 15,
        minStockThreshold: 2
      }
    ];
    filename = "template_import_retail.xlsx";
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, filename);
}
