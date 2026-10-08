"use client";

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Calendar, 
  FileSpreadsheet, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  BookOpen, 
  ChevronDown, 
  FileDown, 
  Info 
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TaxExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: any[];
  tenantCategory: string | undefined;
  tenantName: string;
}

export default function TaxExportModal({ isOpen, onClose, transactions, tenantCategory, tenantName }: TaxExportModalProps) {
  const [startDate, setStartDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [exportType, setExportType] = useState<'detail' | 'summary' | 'jurnal'>('detail');
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    try {
      const txDate = tx.date;
      if (!txDate) return false;
      let txDateObj: Date;
      if (typeof txDate === 'string' && txDate.includes('/')) {
        const [day, month, year] = txDate.split('/').map(Number);
        txDateObj = new Date(year, month - 1, day);
      } else {
        txDateObj = new Date(txDate);
      }
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return txDateObj >= start && txDateObj <= end;
    } catch {
      return false;
    }
  });

  const handleExport = async () => {
    if (filteredTransactions.length === 0) {
      setMessage({ type: 'error', text: 'Tidak ada transaksi di rentang tanggal ini. Anda dapat mengunduh Contoh Template di bawah.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { 
        generateTaxExportRows, 
        generateTaxSummary, 
        exportToCSV, 
        exportSummaryToCSV, 
        downloadJurnalCSV 
      } = await import('@/lib/tax-export');

      const rows = generateTaxExportRows(filteredTransactions, tenantCategory || 'UMUM');
      const periode = `${format(new Date(startDate), 'dd MMM yyyy', { locale: id })} - ${format(new Date(endDate), 'dd MMM yyyy', { locale: id })}`;
      const summary = generateTaxSummary(rows, periode);
      const baseName = `Laporan_Pajak_${(tenantName || 'Toko').replace(/\s+/g, '_')}_${format(new Date(startDate), 'yyyyMMdd')}_${format(new Date(endDate), 'yyyyMMdd')}`;

      if (exportType === 'detail') {
        exportToCSV(rows, `${baseName}_Detail.csv`);
        setMessage({ type: 'success', text: `Detail transaksi (${rows.length} baris) berhasil diunduh!` });
      } else if (exportType === 'summary') {
        exportSummaryToCSV(summary, `${baseName}_Ringkasan.csv`, tenantName || 'Usaha');
        setMessage({ type: 'success', text: 'Ringkasan laporan pajak berhasil diunduh!' });
      } else if (exportType === 'jurnal') {
        downloadJurnalCSV(filteredTransactions, tenantCategory || 'UMUM', `${baseName}_Jurnal.csv`);
        setMessage({ type: 'success', text: 'Format Jurnal Akuntansi berhasil diunduh!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Export gagal' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { downloadTaxTemplate } = await import('@/lib/tax-export');
      downloadTaxTemplate(exportType, tenantName || 'Usaha Anda', tenantCategory || 'UMUM');
      const label = exportType === 'detail' ? 'Detail' : exportType === 'summary' ? 'Ringkasan' : 'Jurnal';
      setMessage({ type: 'success', text: `Template contoh format ${label} berhasil diunduh dan siap digunakan!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Gagal mengunduh template' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 animate-fade-in backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shrink-0">
          <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Laporan Pajak
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/15 rounded-lg transition-colors" aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-4.5 overflow-y-auto">
          {/* Tenant Info Card */}
          <div className="p-3.5 sm:p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">{tenantName || 'Toko UMKM'}</p>
              <p className="text-xs sm:text-sm text-emerald-700 mt-0.5 truncate">
                {tenantCategory || 'UMUM'} • <span className="font-medium">{filteredTransactions.length} transaksi</span> pada periode terpilih
              </p>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-2.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Export Type Selection - Grid Cards with Mobile Wrap-Safety */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Format Laporan</label>
              <span className="text-[11px] text-gray-500 font-normal">Pilih salah satu format</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { 
                  value: 'detail' as const, 
                  label: 'Detail', 
                  desc: 'Per baris & PPN', 
                  badge: 'Nota/Faktur',
                  icon: FileSpreadsheet 
                },
                { 
                  value: 'summary' as const, 
                  label: 'Ringkasan', 
                  desc: 'Rekap omzet & pajak', 
                  badge: 'SPT UMKM',
                  icon: FileSpreadsheet 
                },
                { 
                  value: 'jurnal' as const, 
                  label: 'Jurnal', 
                  desc: 'Mekari & Accurate', 
                  badge: 'Akuntansi',
                  icon: FileSpreadsheet 
                },
              ].map(opt => {
                const isSelected = exportType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setExportType(opt.value)}
                    className={`relative p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all min-h-[96px] flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          <opt.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                      <p className={`font-semibold text-xs sm:text-sm leading-tight ${isSelected ? 'text-emerald-800' : 'text-gray-900'}`}>
                        {opt.label}
                      </p>
                    </div>
                    <p className={`text-[10px] sm:text-xs leading-snug break-words mt-1 ${isSelected ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Contextual description for currently selected export type */}
            <div className="mt-2.5 p-2.5 sm:p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed animate-fade-in">
              {exportType === 'detail' && (
                <p>
                  <strong className="text-emerald-950">📄 Format Detail (Arsip Transaksi):</strong> Rincian per nomor transaksi lengkap dengan nama pelanggan, rincian barang/jasa, DPP (Dasar Pengenaan Pajak), PPN 11%, dan total pembayaran. Cocok untuk arsip nota & audit pembukuan.
                </p>
              )}
              {exportType === 'summary' && (
                <p>
                  <strong className="text-emerald-950">📊 Format Ringkasan (Rekapitulasi SPT):</strong> Rekapitulasi omzet penjualan kotor, estimasi setoran PPN 11%, rincian omzet per kategori produk, serta perbandingan transaksi Tunai vs QRIS untuk pelaporan SPT Masa/Tahunan UMKM.
                </p>
              )}
              {exportType === 'jurnal' && (
                <p>
                  <strong className="text-emerald-950">📚 Format Jurnal (Akuntansi Double-Entry):</strong> Pasangan akun Debit/Kredit standar yang siap diimpor ke <strong>Mekari Jurnal.id</strong>, <strong>Accurate Online</strong>, atau <strong>Zahir</strong> (Piutang Usaha, Penjualan DPP, Utang PPN Keluaran, dan Kas/Bank).
                </p>
              )}
            </div>
          </div>

          {/* Panduan Cara Pakai Collapsible Box */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100/70 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Cara Pakai Laporan Pajak
              </span>
              <div className="flex items-center gap-1 text-xs text-emerald-700 font-normal">
                <span>{showGuide ? 'Tutup Panduan' : 'Lihat Cara Pakai'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showGuide ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {showGuide && (
              <div className="px-3.5 pb-3 pt-1 text-xs text-gray-600 space-y-2.5 border-t border-gray-200/70 bg-white animate-fade-in">
                <div className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <p><strong className="text-gray-900">Pilih Periode:</strong> Atur tanggal mulai dan tanggal akhir transaksi yang ingin Anda laporkan.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <p><strong className="text-gray-900">Pilih Format Sesuai Kebutuhan:</strong> Gunakan <em>Detail</em> untuk audit kasir/faktur, <em>Ringkasan</em> untuk laporan SPT pajak UMKM, atau <em>Jurnal</em> untuk upload software akuntansi.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <p><strong className="text-gray-900">Unduh & Buka di Excel:</strong> File `.csv` otomatis menggunakan standar UTF-8 BOM, sehingga langsung rapi dan kolom terbaca sempurna saat dibuka di Microsoft Excel atau Google Sheets.</p>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200/70 rounded-lg text-amber-900 text-[11px] flex gap-1.5 items-start">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Tips:</strong> Belum ada transaksi di rentang tanggal? Anda tetap dapat mengunduh <strong>Contoh Template</strong> di bawah untuk memeriksa format dan kolomnya.</span>
                </div>
              </div>
            )}
          </div>

          {/* Toast Message */}
          {message && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm animate-slide-down ${
              message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Action Buttons: Download Real Data & Ready-to-download Templates */}
          <div className="space-y-2 pt-1">
            {filteredTransactions.length > 0 ? (
              <button
                type="button"
                onClick={handleExport}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengekspor Laporan...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Unduh Data {exportType === 'detail' ? 'Detail' : exportType === 'summary' ? 'Ringkasan' : 'Jurnal'} ({filteredTransactions.length} transaksi)
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyiapkan Template...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Unduh Template Contoh {exportType === 'detail' ? 'Detail' : exportType === 'summary' ? 'Ringkasan' : 'Jurnal'} (0 Transaksi)
                  </>
                )}
              </button>
            )}

            {/* Always-accessible Sample Template Download Button */}
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={loading}
              className="w-full py-2.5 px-3 border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              Unduh Contoh Template CSV ({exportType === 'detail' ? 'Detail' : exportType === 'summary' ? 'Ringkasan' : 'Jurnal'})
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 text-center leading-relaxed">
            PPN dihitung otomatis 11% dari Dasar Pengenaan Pajak (DPP). Format tanggal DD/MM/YYYY.
          </p>
        </div>
      </div>
    </div>
  );
}
