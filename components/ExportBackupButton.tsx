"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportBackupButtonProps {
  category?: string;
  filter?: string;
  customDate?: string;
}

export default function ExportBackupButton({ category, filter, customDate }: ExportBackupButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set("type", category);
      if (filter) params.set("filter", filter);
      if (customDate) params.set("customDate", customDate);

      const qs = params.toString();
      const urlStr = `/api/admin/export-backup${qs ? `?${qs}` : ""}`;
      const res = await fetch(urlStr);
      
      if (!res.ok) {
        let errMessage = "Gagal mengekspor data";
        try {
          const errData = await res.json();
          if (errData?.error) errMessage = errData.error;
        } catch {
          // not a json response
        }
        throw new Error(errMessage);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename = `Laporan_Transaksi_${new Date().toISOString().split('T')[0]}.xlsx`;
      const disposition = res.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Berhasil mengunduh laporan transaksi.");
    } catch (error: any) {
      console.error("Export Error:", error);
      toast.error(error?.message || "Terjadi kesalahan saat mengekspor laporan.");
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
          <span>Menyiapkan Laporan...</span>
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
