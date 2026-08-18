"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ExportBackupButton({ category }: { category?: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const urlStr = category ? `/api/admin/export-backup?type=${encodeURIComponent(category)}` : "/api/admin/export-backup";
      const res = await fetch(urlStr);
      
      if (!res.ok) {
        throw new Error("Gagal mengekspor data");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Transaksi_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Berhasil mengunduh laporan transaksi.");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Terjadi kesalahan saat mengekspor laporan.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-bold bg-green-600 border border-transparent rounded-lg shadow-sm text-white hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Menyiapkan...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Unduh Laporan (Excel)</span>
        </>
      )}
    </button>
  );
}
