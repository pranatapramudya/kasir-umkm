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

  let businessType = 'RETAIL';
  if (isRentalTravelCategory(category)) {
    businessType = 'RENTAL';
  } else if (isServiceBusinessCategory(category)) {
    businessType = 'JASA';
  } else if (category === "F&B / Kuliner") {
    businessType = 'FNB';
  }

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
            {businessType === 'FNB' && (
              <>
                <Step num="1" title="Tambah Menu & Kategori" businessType={businessType}>Buka menu <b>Produk</b>, masukkan daftar makanan/minuman beserta harganya.</Step>
                <Step num="2" title="Atur Meja (Opsional)" businessType={businessType}>Jika melayani <i>Dine-in</i>, buka <b>Manajemen Meja</b> untuk mengatur nomor dan kapasitas meja.</Step>
                <Step num="3" title="Buka Kasir Resto" businessType={businessType}>Masuk ke menu <b>Kasir Resto</b>, pilih menu pesanan pelanggan, dan tentukan nomor meja jika diperlukan.</Step>
                <Step num="4" title="Cetak Tiket Dapur" businessType={businessType}>Simpan pesanan dan cetak <b>Tiket Dapur</b> agar koki dapat menyiapkan pesanan.</Step>
                <Step num="5" title="Pembayaran & Struk" businessType={businessType} isLast>Saat pelanggan selesai, selesaikan pembayaran dan cetak Struk Thermal untuk pelanggan.</Step>
              </>
            )}

            {businessType === 'RETAIL' && (
              <>
                <Step num="1" title="Tambah Produk" businessType={businessType}>Buka menu <b>Produk</b>, masukkan data barang, harga jual, dan modal awal Anda.</Step>
                <Step num="2" title="Atur Stok Inventaris" businessType={businessType}>Buka menu <b>Produk</b> untuk mengatur jumlah stok fisik barang yang tersedia di toko.</Step>
                <Step num="3" title="Buka Kasir POS" businessType={businessType}>Masuk ke menu <b>Kasir POS</b>, ketik nama barang di kolom pencarian atau klik foto produk untuk memasukkannya ke keranjang kasir.</Step>
                <Step num="4" title="Pembayaran & Struk" businessType={businessType} isLast>Selesaikan transaksi dan cetak Struk Thermal sebagai bukti pembelian pelanggan.</Step>
              </>
            )}

            {businessType === 'JASA' && (
              <>
                <Step num="1" title="Buat Layanan (Klinik/Salon)" businessType={businessType}>Buka menu <b>Produk / Layanan</b>, buat daftar layanan yang Anda tawarkan (misal: Potong Rambut, Creambath).</Step>
                <Step num="2" title="Bagikan Link Katalog" businessType={businessType}>Buka menu <b>Informasi Toko</b>, salin Link Booking Publik Anda, dan bagikan ke WhatsApp atau bio Instagram pelanggan agar mereka bisa melakukan reservasi mandiri.</Step>
                <Step num="3" title="Terima Antrean" businessType={businessType}>Terima antrean yang masuk, atau input antrean secara manual di Kasir.</Step>
                <Step num="4" title="Proses di Kasir" businessType={businessType} isLast>Setelah selesai, selesaikan transaksi di menu Kasir POS.</Step>
              </>
            )}

            {businessType === 'RENTAL' && (
              <>
                <Step num="1" title="Tambah Armada" businessType={businessType}>Buka menu <b>Armada / Unit</b>. Masukkan data mobil, motor, atau peralatan yang bisa disewa.</Step>
                <Step num="2" title="Atur Harga Sewa" businessType={businessType}>Tentukan harga per-hari atau per-jam untuk setiap armada yang Anda sewakan.</Step>
                <Step num="3" title="Bagikan Link Katalog" businessType={businessType}>Buka menu <b>Informasi Toko</b>, salin Link Booking Publik Anda, dan bagikan ke WhatsApp atau bio Instagram pelanggan agar mereka bisa melakukan reservasi mandiri.</Step>
                <Step num="4" title="Tarik Pesanan / Input Kalender Sewa" businessType={businessType}>Pelanggan bisa memesan dari link booking, atau Anda input manual ke <b>Kalender Sewa</b>.</Step>
                <Step num="5" title="Klik Start (Mulai Perjalanan)" businessType={businessType}>Saat unit diambil, klik pesanan di kalender dan ubah status ke <b>Sedang Jalan</b>.</Step>
                <Step num="6" title="Finish & Lunas" businessType={businessType} isLast>Saat unit dikembalikan, tandai pesanan <b>Selesai</b> dan pastikan pembayaran lunas.</Step>
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

function Step({ num, title, businessType, isLast, children }: { num: string; title: string; businessType: string; isLast?: boolean; children: React.ReactNode }) {
  let badgeClass = "bg-slate-800 text-white"; // default
  if (businessType === 'RENTAL') {
    badgeClass = "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-200";
  } else if (businessType === 'JASA') {
    badgeClass = "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-200";
  } else if (businessType === 'FNB') {
    badgeClass = "bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-sm shadow-orange-200";
  } else if (businessType === 'RETAIL') {
    badgeClass = "bg-gradient-to-br from-blue-900 to-slate-800 text-white shadow-sm shadow-slate-300";
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${badgeClass}`}>
          {num}
        </div>
        {!isLast && <div className="w-px h-full bg-slate-200 mt-2"></div>}
      </div>
      <div className="pb-6">
        <h3 className="font-black text-slate-800 mb-1 text-base">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
