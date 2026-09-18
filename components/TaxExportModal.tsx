"use client";

import React, { useState } from 'react';
import { X, Download, Calendar, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    const txDate = tx.date;
    const [day, month, year] = txDate.split('/').map(Number);
    const txDateObj = new Date(year, month - 1, day);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return txDateObj >= start && txDateObj <= end;
  });

  const handleExport = async () => {
    if (filteredTransactions.length === 0) {
      setMessage({ type: 'error', text: 'Tidak ada transaksi di periode ini' });
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
      const baseName = `Laporan_Pajak_${tenantName.replace(/\s+/g, '_')}_${format(new Date(startDate), 'yyyyMMdd')}_${format(new Date(endDate), 'yyyyMMdd')}`;

      if (exportType === 'detail') {
        exportToCSV(rows, `${baseName}_Detail.csv`);
        setMessage({ type: 'success', text: `Detail transaksi (${rows.length} baris) berhasil diunduh!` });
      } else if (exportType === 'summary') {
        exportSummaryToCSV(summary, `${baseName}_Ringkasan.csv`);
        setMessage({ type: 'success', text: 'Ringkasan laporan pajak berhasil diunduh!' });
      } else if (exportType === 'jurnal') {
        downloadJurnalCSV(filteredTransactions, tenantCategory || 'UMUM', `${baseName}_Jurnal.csv`);
        setMessage({ type: 'success', text: 'Format Jurnal (Jurnal.id/Mekari/Accurate) berhasil diunduh!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Export gagal' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Export Laporan Pajak
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/15 rounded-lg transition-colors" aria-label="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Tenant Info Card */}
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{tenantName}</p>
              <p className="text-sm text-emerald-700 mt-0.5">{tenantCategory || 'UMUM'} · {filteredTransactions.length} transaksi</p>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Mulai</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Akhir</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Export Type - Radio Card Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format Export</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'detail' as const, label: 'Detail', desc: 'Per baris + PPN 11%', icon: FileSpreadsheet },
                { value: 'summary' as const, label: 'Ringkasan', desc: 'Total per kategori', icon: FileSpreadsheet },
                { value: 'jurnal' as const, label: 'Jurnal', desc: 'Jurnal.id/Mekari/Accurate', icon: FileSpreadsheet },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setExportType(opt.value)}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all min-h-[84px] ${
                    exportType === opt.value
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100'
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {exportType === opt.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${exportType === opt.value ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                      <opt.icon className={`w-5 h-5 ${exportType === opt.value ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <p className={`font-semibold text-sm ${exportType === opt.value ? 'text-emerald-700' : 'text-gray-900'}`}>{opt.label}</p>
                  <p className={`text-xs mt-1 ${exportType === opt.value ? 'text-emerald-600' : 'text-gray-500'}`}>{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Toast */}
          {message && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-sm animate-slide-down ${
              message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={loading || filteredTransactions.length === 0}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengekspor...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Unduh {exportType === 'detail' ? 'Detail' : exportType === 'summary' ? 'Ringkasan' : 'Jurnal'} ({filteredTransactions.length} transaksi)
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            PPN dihitung otomatis 11% dari subtotal per item. Format tanggal: DD/MM/YYYY.
          </p>
        </div>
      </div>
    </div>
  );
}