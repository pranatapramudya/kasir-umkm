"use client";

import React from 'react';
import { X, FileDown, Loader2, Upload } from 'lucide-react';
import { isServiceBusinessCategory, isRentalTravelCategory } from '@/lib/business-category';
import { downloadExcelTemplate } from '@/lib/excel-template';

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
      await downloadExcelTemplate(kategoriUsaha);
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
