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
        // Jasa murni (tanpa stok)
        const dataJasa = [
          { name: "Potong Rambut Pria", category: "Jasa", hargaJual: 45000, employeeCommission: 15000, biayaModal: 5000, description: "Pangkas rambut + styling" },
          { name: "Creambath Spa 45 Menit", category: "Jasa", hargaJual: 65000, employeeCommission: 20000, biayaModal: 8000, description: "Perawatan rambut + pijat kepala" },
        ];
        // Sparepart (punya stok & HPP)
        const dataSparepart = [
          { name: "Shampoo Profesional 500ml", category: "Sparepart", hpp: 35000, hargaJual: 65000, stock: 20, minStockThreshold: 5, employeeCommission: 5000, description: "Untuk retail di tempat" },
          { name: "Pomade Styling 100gr", category: "Sparepart", hpp: 25000, hargaJual: 45000, stock: 15, minStockThreshold: 3, employeeCommission: 3000, description: "Produk styling" },
        ];
        
        // Gabung 2 sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataJasa), "Jasa");
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataSparepart), "Sparepart");
        XLSX.writeFile(workbook, "template_import_jasa_servis.xlsx");
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
            <h2 className="text-xl font-bold text-gray-900">Import Data ({categoryTitle})</h2>
            <p className="text-xs text-gray-500 mt-0.5">Unggah data produk atau layanan secara massal</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">Panduan Import Data ({categoryTitle}):</p>
            <ol className="list-decimal pl-4 space-y-1 text-xs sm:text-sm">
              <li>Unduh template <b>Excel (.xlsx)</b> khusus kategori Anda melalui tombol di bawah.</li>
              <li>Buka file menggunakan <b>Microsoft Excel</b> atau <b>Google Sheets</b>.</li>
              <li>Isi data {isRental ? "unit/properti" : isJasa ? "layanan" : isFNB ? "menu" : "produk"} Anda (Jangan ubah nama kolom di baris pertama).</li>
              {isRental && (
                <li className="text-blue-900">
                  Kolom <b>hpp</b> diisi dengan Biaya Operasional (B.Ops/Maintenance) per sewa. Kolom <b>description</b> untuk fasilitas/catatan unit.
                </li>
              )}
              {isJasa && (
                <li className="text-blue-900">
                  Kolom <b>employeeCommission</b> untuk nominal komisi staf per pengerjaan. Kolom <b>description</b> untuk deskripsi layanan. Tidak memerlukan kolom stok.
                </li>
              )}
              <li>Simpan file Anda (format <b>.xlsx</b> atau <b>.csv</b> didukung).</li>
              <li>Unggah kembali file tersebut pada bagian di bawah ini.</li>
            </ol>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="mt-3.5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <FileDown className="w-4 h-4" /> Download Template Excel (.xlsx)
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
