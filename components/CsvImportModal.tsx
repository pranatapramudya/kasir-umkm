"use client";

import React from 'react';
import { X, FileDown, Loader2, Upload } from 'lucide-react';

type CsvImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  isImporting: boolean;
  handleImportSubmit: (e: React.FormEvent) => void;
};

export default function CsvImportModal({
  isOpen,
  onClose,
  importFile,
  setImportFile,
  isImporting,
  handleImportSubmit
}: CsvImportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">Import Data (CSV)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-bold mb-1">Panduan Import Data:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Unduh template CSV yang kami sediakan.</li>
              <li>Isi data produk/layanan Anda ke dalam file tersebut (Jangan ubah baris pertama/header).</li>
              <li>Simpan sebagai file <b>.csv</b>.</li>
              <li>Unggah kembali file tersebut di bawah ini.</li>
            </ol>
            <a href={`data:text/csv;charset=utf-8,kodeBarang,name,category,hpp,hargaJual,stock,minStockThreshold\nSKU001,Produk Contoh,Umum,10000,15000,50,5`} download="template_produk.csv" className="mt-3 inline-flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-700">
              <FileDown className="w-4 h-4" /> Download Template CSV
            </a>
          </div>

          <form onSubmit={handleImportSubmit}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Unggah File CSV</label>
            <input 
              type="file" 
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
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
