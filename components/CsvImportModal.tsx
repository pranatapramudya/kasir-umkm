"use client";

import React from 'react';
import { X, FileDown, Loader2, Upload, Car, Building2, Package } from 'lucide-react';
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

  const handleDownloadTemplate = (type?: string) => {
    try {
      const cat = kategoriUsaha || 'Jasa';
      const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
      window.open(`/api/onboarding/download-template?category=${encodeURIComponent(cat)}${typeParam}`, '_blank');
    } catch (err) {
      console.error("Gagal mendownload template Excel:", err);
    }
  };

  const categoryTitle = isRental ? "Rental & Properti" : isJasa ? "Jasa & Layanan" : isFNB ? "F&B / Kuliner" : "Retail & Produk";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Import Data ({categoryTitle})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Input massal: Masukkan banyak {isRental ? "unit sewa / kamar" : isJasa ? "layanan jasa / produk" : isFNB ? "menu kuliner" : "produk"} sekaligus dari Excel
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body Modal */}
        <div className="p-6 space-y-5 overflow-y-auto text-slate-800">
          
          {/* Info Box: Perbedaan Import vs Export */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex gap-2.5 items-start">
            <span className="text-base shrink-0">💡</span>
            <div>
              <p className="font-bold text-amber-900">Perbedaan Import vs Export:</p>
              <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                <b>Import Data (Halaman Ini):</b> Untuk memasukkan data baru secara massal dari Excel ke dalam sistem kasir.<br />
                <b>Export Data (Tombol Luar):</b> Untuk mencadangkan (backup) atau mengunduh data yang sudah tersimpan di kasir.
              </p>
            </div>
          </div>

          {/* Panduan Langkah */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-sm text-blue-950 space-y-3">
            <p className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
              <span>📋</span> Panduan Pengisian Template ({categoryTitle}):
            </p>

            <ol className="list-decimal pl-4 space-y-2 text-sm text-slate-700 leading-relaxed">
              <li>
                Unduh file format Excel resmi melalui tombol di bawah.
              </li>
              <li>
                Buka file di <b>Microsoft Excel</b> atau <b>Google Sheets</b>, lalu isi data usaha Anda tanpa mengubah baris judul tabel.
              </li>

              {/* KHUSUS RENTAL & PROPERTI */}
              {isRental && (
                <li className="bg-white/80 border border-blue-200 p-3 rounded-xl space-y-2 text-slate-800">
                  <p className="font-bold text-blue-900 text-sm">
                    🚗 / 🏨 Aturan Pengisian (2 Sheet per File):
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                    <li>
                      <b>Sheet 1 (Unit Kendaraan / Properti):</b> Setiap baris mewakili 1 unit fisik (Mobil, Motor, Kamar Kost, Villa). <b>Stok otomatis diatur 1 per unit</b>. Kolom <b>HPP</b> diisi biaya operasional per hari (bensin/solar, supir, listrik, air, perawatan) untuk kalkulasi untung bersih.
                    </li>
                    <li>
                      <b>Sheet 2 (Layanan Tambahan):</b> Layanan pendukung seperti Jasa Supir, BBM All-in, Extra Bed, Sarapan, Laundry. <b>Stok otomatis tak terbatas (unlimited)</b> dan kolom HPP = 0.
                    </li>
                  </ul>
                  <p className="text-[11px] text-blue-800 font-semibold italic">
                    *Tips: Sistem otomatis mengenali kategori berdasarkan nama Sheet dan jenis unit yang Anda masukkan.
                  </p>
                </li>
              )}

              {/* KHUSUS JASA / SERVIS */}
              {isJasa && (
                <li className="bg-white/80 border border-blue-200 p-3 rounded-xl space-y-1 text-xs text-slate-800">
                  <p className="font-bold text-blue-900">🛠️ Khusus Jasa & Bengkel:</p>
                  <p>
                    Gunakan <b>Sheet 1</b> untuk Jasa/Layanan (stok unlimited) dan Produk/Sparepart (dengan stok fisik). Kolom <b>HPP</b> diisi modal bahan/beli.
                  </p>
                </li>
              )}

              <li>Simpan file di komputer Anda (.xlsx), kemudian unggah pada form di bawah.</li>
            </ol>

            {/* TOMBOL DOWNLOAD TEMPLATE */}
            {isRental ? (
              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Pilih Format Template Sesuai Niche Usaha Anda:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('rental')}
                    className="flex flex-col items-start p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Car className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
                      Rental Kendaraan
                    </div>
                    <span className="text-[11px] text-blue-100 mt-1 leading-tight line-clamp-2">
                      Mobil, Motor, Bus, Minibus, Travel & Supir
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('properti')}
                    className="flex flex-col items-start p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Building2 className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform shrink-0" />
                      Properti & Kamar
                    </div>
                    <span className="text-[11px] text-indigo-100 mt-1 leading-tight line-clamp-2">
                      Kamar Kost, Villa, Apartemen, Hotel & Glamping
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('alat')}
                    className="flex flex-col items-start p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Package className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />
                      Peralatan & Alat
                    </div>
                    <span className="text-[11px] text-emerald-100 mt-1 leading-tight line-clamp-2">
                      Kamera, Camping, Sound System, PS5, Alat Berat
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleDownloadTemplate()}
                className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <FileDown className="w-4 h-4" /> Download Format Template Excel (.xlsx)
              </button>
            )}
          </div>

          {/* Form Upload */}
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                Unggah File yang Sudah Diisi (Excel .xlsx / .csv)
              </label>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-1 bg-slate-50/50 hover:border-blue-400 transition-colors"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={!importFile || isImporting} 
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm active:scale-95"
              >
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
