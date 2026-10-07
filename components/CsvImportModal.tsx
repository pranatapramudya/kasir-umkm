"use client";

import React from 'react';
import { X, FileDown, Loader2, Upload, Car, Bus, Building2, Package, Coffee, Utensils } from 'lucide-react';
import { isServiceBusinessCategory, isRentalTravelCategory, getFnbSubType } from '@/lib/business-category';
import { isFnBCategory } from '@/lib/navigation';

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

  const isRental = isRentalTravelCategory(kategoriUsaha || '');
  const isJasa = isServiceBusinessCategory(kategoriUsaha || '') && !isRental;
  const isFNB = isFnBCategory(kategoriUsaha || '');
  const fnbSubType = isFNB ? getFnbSubType(kategoriUsaha || '') : 'generic';

  const [downloadingType, setDownloadingType] = React.useState<string | null>(null);

  const handleDownloadTemplate = async (type?: string) => {
    const key = type || 'default';
    try {
      setDownloadingType(key);
      const cat = kategoriUsaha || 'Jasa';
      const typeParam = type ? `&type=${encodeURIComponent(type)}` : '';
      const res = await fetch(`/api/onboarding/download-template?category=${encodeURIComponent(cat)}${typeParam}`);
      if (!res.ok) throw new Error('Gagal mengunduh');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      let filename = 'template_import.xlsx';
      if (type === 'bus' || type === 'minibus') {
        filename = 'template_import_minibus_bus_pariwisata.xlsx';
      } else if (type === 'rental') {
        filename = 'template_import_rental_kendaraan.xlsx';
      } else if (type === 'properti') {
        filename = 'template_import_properti_penginapan.xlsx';
      } else if (type === 'alat') {
        filename = 'template_import_rental_peralatan_alat.xlsx';
      } else if (type === 'cafe') {
        filename = 'template_import_cafe.xlsx';
      } else if (type === 'resto') {
        filename = 'template_import_resto.xlsx';
      } else if (isRental) {
        filename = 'template_import_rental_kendaraan.xlsx';
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Gagal mendownload template Excel:", err);
      // Fallback
      window.location.href = `/api/onboarding/download-template?category=${encodeURIComponent(kategoriUsaha || 'Jasa')}${type ? `&type=${encodeURIComponent(type)}` : ''}`;
    } finally {
      setDownloadingType(null);
    }
  };

  const categoryTitle = isRental ? "Rental Kendaraan, Properti & Alat" : isJasa ? "Jasa & Layanan" : isFNB ? "F&B / Kuliner" : "Retail & Produk";

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
              Input massal: Masukkan banyak {isRental ? "armada kendaraan, unit kamar/properti, atau alat sewa" : isJasa ? "layanan jasa / produk" : isFNB ? "menu kuliner" : "produk"} sekaligus dari Excel
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

                            {/* KHUSUS RENTAL, PROPERTI & ALAT */}
              {isRental && (
                <li className="bg-white/80 border border-blue-200 p-3 rounded-xl space-y-2 text-slate-800">
                  <p className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                    <span>🚗 / 🏢 / 📦</span>
                    <span>Aturan Pengisian (2 Sheet per File):</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
                    <li>
                      <b>Sheet 1 (Unit Armada / Kamar / Alat Sewa):</b> Setiap baris mewakili 1 unit fisik (Mobil, Bus, Motor, Kamar Kost, Villa, Kamera, Tenda, Sound System). <b>Stok otomatis diatur 1 per unit fisik</b>. Kolom <b>HPP</b> diisi biaya operasional per hari (bensin/solar, supir, listrik, air, perawatan) untuk kalkulasi laba bersih.
                    </li>
                    <li>
                      <b>Sheet 2 (Layanan Tambahan & Add-on):</b> Layanan pendukung seperti Jasa Supir, BBM All-in, Extra Bed, Sarapan, Operator Alat, Baterai Cadangan. <b>Stok otomatis tak terbatas (unlimited)</b> dan kolom HPP = 0.
                    </li>
                  </ul>
                  <p className="text-[11px] text-blue-800 font-semibold italic">
                    *Tips: Sistem otomatis mengenali jenis unit berdasarkan template (Rental Kendaraan, Properti, atau Alat) yang Anda unduh di bawah.
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

              {/* TOMBOL DOWNLOAD TEMPLATE */}
                        {(() => {
                          if (isRental) {
                            return (
                              <div className="pt-2 space-y-2.5">
                                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                  Pilih Format Template Sesuai Niche Usaha Anda:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                  <button
                                    type="button"
                                    disabled={!!downloadingType}
                                    onClick={() => handleDownloadTemplate('rental')}
                                    className="flex flex-col items-start p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group disabled:opacity-75"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      {downloadingType === 'rental' ? <Loader2 className="w-4 h-4 animate-spin text-blue-200 shrink-0" /> : <Car className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform shrink-0" />}
                                      Mobil & Motor Pribadi
                                    </div>
                                    <span className="text-[11px] text-blue-100 mt-1 leading-tight line-clamp-2">
                                      Avanza, Innova, Brio, NMAX, Lepas Kunci / Driver
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={!!downloadingType}
                                    onClick={() => handleDownloadTemplate('bus')}
                                    className="flex flex-col items-start p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group disabled:opacity-75"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      {downloadingType === 'bus' ? <Loader2 className="w-4 h-4 animate-spin text-amber-200 shrink-0" /> : <Bus className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform shrink-0" />}
                                      Minibus & Bus Pariwisata
                                    </div>
                                    <span className="text-[11px] text-amber-100 mt-1 leading-tight line-clamp-2">
                                      Hiace, Elf, Medium/Big Bus (Garasi & Mitra/Investor)
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={!!downloadingType}
                                    onClick={() => handleDownloadTemplate('properti')}
                                    className="flex flex-col items-start p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group disabled:opacity-75"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      {downloadingType === 'properti' ? <Loader2 className="w-4 h-4 animate-spin text-indigo-200 shrink-0" /> : <Building2 className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform shrink-0" />}
                                      Properti & Kamar
                                    </div>
                                    <span className="text-[11px] text-indigo-100 mt-1 leading-tight line-clamp-2">
                                      Kamar Kost, Villa, Apartemen, Hotel & Glamping
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={!!downloadingType}
                                    onClick={() => handleDownloadTemplate('alat')}
                                    className="flex flex-col items-start p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group disabled:opacity-75"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      {downloadingType === 'alat' ? <Loader2 className="w-4 h-4 animate-spin text-emerald-200 shrink-0" /> : <Package className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform shrink-0" />}
                                      Peralatan & Alat
                                    </div>
                                    <span className="text-[11px] text-emerald-100 mt-1 leading-tight line-clamp-2">
                                      Kamera, Camping, Sound System, PS5, Alat Berat
                                    </span>
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          if (isFNB) {
                            return (
                              <div className="pt-2 space-y-2.5">
                                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                                  Pilih Format Template Sesuai Jenis F&B Usaha Anda:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadTemplate('cafe')}
                                    className="flex flex-col items-start p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      <Coffee className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform shrink-0" />
                                      Cafe & Coffee Shop
                                    </div>
                                    <span className="text-[11px] text-amber-100 mt-1 leading-tight line-clamp-2">
                                      Kopi, Non-Kopi, Makanan Ringan, Dessert, Paket Sarapan
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDownloadTemplate('resto')}
                                    className="flex flex-col items-start p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      <Utensils className="w-4 h-4 text-orange-200 group-hover:scale-110 transition-transform shrink-0" />
                                      Restoran & Warung Makan
                                    </div>
                                    <span className="text-[11px] text-orange-100 mt-1 leading-tight line-clamp-2">
                                      Appetizer, Main Course, Dessert, Beverage, Paket Hemat
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDownloadTemplate('generic')}
                                    className="flex flex-col items-start p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm active:scale-[0.98] text-left group"
                                  >
                                    <div className="flex items-center gap-1.5 font-bold text-xs">
                                      <FileDown className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
                                      F&B Umum (Generic)
                                    </div>
                                    <span className="text-[11px] text-blue-100 mt-1 leading-tight line-clamp-2">
                                      Makanan, Minuman, Snack, Dessert, Paket Hemat
                                    </span>
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <button
                              type="button"
                              onClick={() => handleDownloadTemplate()}
                              className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                            >
                              <FileDown className="w-4 h-4" /> Download Format Template Excel (.xlsx)
                            </button>
                          );
                        })()}
            </ol>
          </div>
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
