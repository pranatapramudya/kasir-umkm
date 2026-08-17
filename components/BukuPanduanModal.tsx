"use client";

import { X, BookOpen, CheckCircle } from "lucide-react";
import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function BukuPanduanModal({ isOpen, onClose, category }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const isRental = isRentalTravelCategory(category);
  const isJasa = isServiceBusinessCategory(category);
  const isFnbRetail = !isRental && !isJasa;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Buku Panduan Penggunaan</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          <p className="text-sm text-slate-600 leading-relaxed">
            Berikut adalah alur kerja operasional standar (SOP) untuk bisnis <span className="font-semibold text-slate-800">{category}</span> Anda.
          </p>
          
          <div className="space-y-4">
            {isFnbRetail && (
              <>
                <Step num="1" title="Kelola Produk / Menu">Buka menu <b>Produk</b>, tambahkan foto, harga modal (HPP), dan harga jual untuk menu atau barang jualan Anda.</Step>
                <Step num="2" title="Proses Kasir (POS)">Buka menu <b>Kasir POS</b>. Klik item yang dibeli, sesuaikan jumlah (Qty), lalu klik <b>Bayar</b>.</Step>
                <Step num="3" title="Terima Pembayaran">Pilih metode pembayaran (Tunai/QRIS), dan cetak struk untuk diberikan ke pelanggan.</Step>
                <Step num="4" title="Tutup Shift (Laporan Kasir)">Di akhir hari, buka <b>Laporan Kasir</b> untuk mencocokkan uang di laci dengan sistem.</Step>
              </>
            )}

            {isJasa && (
              <>
                <Step num="1" title="Buat Layanan">Buka menu <b>Produk / Layanan</b>, buat daftar layanan yang Anda tawarkan (misal: Potong Rambut, Creambath).</Step>
                <Step num="2" title="Bagikan Link Booking">Buka menu <b>Jadwal Booking</b>. Bagikan link reservasi ke pelanggan untuk antrean online, atau input antrean secara manual di Kasir.</Step>
                <Step num="3" title="Kerjakan Layanan">Pilih Terapis / Kapster yang bertugas pada menu kasir untuk perhitungan komisi otomatis.</Step>
                <Step num="4" title="Bayar di Kasir">Setelah selesai, selesaikan transaksi di menu Kasir POS.</Step>
              </>
            )}

            {isRental && (
              <>
                <Step num="1" title="Tambah Armada">Buka menu <b>Armada / Unit</b>. Masukkan data mobil, motor, atau peralatan yang bisa disewa beserta harga per-harinya.</Step>
                <Step num="2" title="Terima Pesanan Masuk">Pelanggan bisa memesan dari link booking, atau Anda bisa menambahkannya dari Kasir. Pesanan akan muncul di <b>Kalender Sewa</b>.</Step>
                <Step num="3" title="Serah Terima (Mulai Sewa)">Saat unit diambil, klik pesanan di kalender dan ubah status ke <b>Sedang Jalan</b>.</Step>
                <Step num="4" title="Pengembalian (Selesai)">Saat unit dikembalikan, periksa kondisi, tambahkan denda jika telat, lalu tandai <b>Selesai</b>.</Step>
              </>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              Sistem ini akan beradaptasi secara otomatis mengikuti operasional Anda. Jika Anda mengalami kesulitan, silakan hubungi tim Support.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Step({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {num}
        </div>
        <div className="w-px h-full bg-slate-200 mt-2"></div>
      </div>
      <div className="pb-6">
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
