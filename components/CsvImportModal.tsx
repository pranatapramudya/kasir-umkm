"use client";

import React from 'react';
import { X, FileDown, Loader2, Upload } from 'lucide-react';
import { isServiceBusinessCategory, isRentalTravelCategory } from '@/lib/business-category';

type CsvImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  isImporting: boolean;
  handleImportSubmit: (e: React.FormEvent) => void;
  kategoriUsaha?: string;
};

export default function CsvImportModal({
  isOpen,
  onClose,
  importFile,
  setImportFile,
  isImporting,
  handleImportSubmit,
  kategoriUsaha
}: CsvImportModalProps) {
  if (!isOpen) return null;

  const isRental = isRentalTravelCategory(kategoriUsaha);
  const isJasa = isServiceBusinessCategory(kategoriUsaha) && !isRental;
  const isFNB = kategoriUsaha === 'FNB' || kategoriUsaha === 'F&B' || kategoriUsaha === 'F&B / Kuliner';

  const handleDownloadTemplate = async () => {
    try {
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
          komisi: 15000,
          description: 'Pangkas rambut + styling / ganti oli + cek rem'
        });

        wsJasa.addRow({
          name: 'Creambath Spa / Cuci Motor Kilat',
          category: 'Jasa / Servis',
          hpp: 8000,
          hargaJual: 65000,
          komisi: 20000,
          description: 'Perawatan rambut + pijat kepala / cuci salju + semir ban'
        });

        // Set Data Validation Dropdown pada kolom Kategori (B2:B200) di Sheet Jasa
        for (let row = 2; row <= 200; row++) {
          wsJasa.getCell(`B${row}`).dataValidation = {
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

        // Set Data Validation Dropdown pada kolom Kategori (C2:C200) di Sheet Produk
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
        a.click();
        window.URL.revokeObjectURL(url);
        return;
      } else {
        // Retail / F&B
        data = [
          {
            kodeBarang: "SKU001",
            name: isFNB ? "Kopi Susu Gula Aren" : "Baju Kaos Polos Hitam M",
            category: isFNB ? "Minuman" : "Pakaian",
            hpp: 8000,
            hargaJual: 18000,
            stock: 50,
            minStockThreshold: 5
          },
          {
            kodeBarang: "SKU002",
            name: isFNB ? "Roti Bakar Coklat Keju" : "Celana Chino Slim Fit 32",
            category: isFNB ? "Makanan" : "Pakaian",
            hpp: 12000,
            hargaJual: 22000,
            stock: 30,
            minStockThreshold: 5
          }
        ];
        filename = isFNB ? "template_import_fnb.xlsx" : "template_import_retail.xlsx";
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(key.length + 2, 18)
      }));
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
      XLSX.writeFile(workbook, filename);
    } catch (err) {
      console.error("Gagal mendownload template Excel:", err);
    }
  };

  const categoryTitle = isRental ? "Rental & Properti" : isJasa ? "Jasa & Layanan" : isFNB ? "F&B / Kuliner" : "Retail & Produk";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Import Data ({categoryTitle})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Input massal: Masukkan banyak {isRental ? "unit" : isJasa ? "layanan / barang" : isFNB ? "menu" : "produk"} sekaligus dari Excel</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Penjelasan perbedaan Import vs Export bagi orang awam */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex gap-2.5 items-start">
            <span className="text-base shrink-0">💡</span>
            <div>
              <p className="font-bold">Perbedaan Import vs Export:</p>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                <b>Import Data (Halaman Ini):</b> Untuk memasukkan data baru secara banyak dari komputer ke kasir.<br />
                <b>Export Data (Tombol Luar):</b> Untuk mengunduh / membackup daftar produk yang saat ini sudah tersimpan di kasir.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-bold mb-1.5 flex items-center gap-1.5 text-blue-900">
              <span>📋</span> Langkah Mudah Import ({categoryTitle}):
            </p>
            <ol className="list-decimal pl-4 space-y-1.5 text-xs text-blue-900 leading-relaxed">
              <li>Klik tombol <b>Download Format Excel</b> di bawah untuk mendapatkan file contoh.</li>
              <li>Buka file tersebut di <b>Microsoft Excel</b> atau <b>Google Sheets</b>.</li>
              <li>Isi daftar {isRental ? "unit sewa / kamar" : isJasa ? "layanan jasa & produk barang" : isFNB ? "menu makanan/minuman" : "produk toko"} Anda (jangan ubah baris judul paling atas).</li>
              {isJasa && (
                <li className="bg-blue-100/60 p-2 rounded-lg font-medium text-blue-950">
                  🛠️ <b>Khusus Jasa:</b> File memiliki 2 sheet (<b>Jasa</b> & <b>Produk</b>). Kategori bisa langsung dipilih lewat <b>dropdown Excel</b>. Kolom <b>HPP</b> diisi modal bahan/beli untuk hitung untung bersih.
                </li>
              )}
              {isRental && (
                <li className="bg-blue-100/60 p-2 rounded-lg font-medium text-blue-950">
                  🚗 <b>Khusus Rental:</b> Kolom <b>HPP</b> diisi Biaya Operasional (B.Ops/Maintenance). Kolom <b>description</b> untuk fasilitas unit.
                </li>
              )}
              <li>Simpan file di komputer Anda, lalu upload pada kotak di bawah ini.</li>
            </ol>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="mt-3 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <FileDown className="w-4 h-4" /> Download Format Template Excel (.xlsx)
            </button>
          </div>

          <form onSubmit={handleImportSubmit}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Unggah File (Excel .xlsx / .csv)</label>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6 cursor-pointer border border-gray-200 rounded-xl p-1"
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Batal</button>
              <button type="submit" disabled={!importFile || isImporting} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isImporting ? 'Mengimpor...' : 'Import Sekarang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
