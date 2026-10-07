"use client";

import { X, BookOpen, CheckCircle, MessageSquare, ExternalLink, ShieldAlert, Smartphone } from "lucide-react";
import { isRentalTravelCategory, isServiceBusinessCategory } from "@/lib/business-category";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  tenantName?: string;
}

export function BukuPanduanModal({ isOpen, onClose, category, tenantName }: Props) {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  let businessType = 'RETAIL';
  if (isRentalTravelCategory(category)) {
    businessType = 'RENTAL';
  } else if (isServiceBusinessCategory(category)) {
    businessType = 'JASA';
  } else if (category === "F&B / Kuliner" || category === "FNB" || category === "F&B") {
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
                <Step num="2" title="Atur Meja (Opsional)" businessType={businessType}>Jika melayani <i>Dine-in</i> (makan di tempat), buka <b>Manajemen Meja</b> untuk mengatur nomor dan kapasitas meja.</Step>
                <Step num="3" title="Buka Kasir Resto & Opsi Takeaway" businessType={businessType}>
                  Masuk ke menu <b>Kasir Resto</b>, pilih menu pesanan pelanggan, lalu tentukan opsi meja/antrean:
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600">
                    <li><b>Makan di Tempat (Dine-in):</b> Pilih nomor meja fisik pelanggan (misal: Meja 01).</li>
                    <li><b>Pesanan Dibawa Pulang / Foodtruck:</b> Pilih opsi bawaan <b>[Takeaway / Bungkus / Konter]</b> di paling atas agar transaksi dapat dilanjutkan tanpa nomor meja.</li>
                  </ul>
                </Step>
                <Step num="4" title="Cetak Tiket Dapur" businessType={businessType}>Simpan pesanan dan cetak <b>Tiket Dapur</b> agar koki/barista dapat menyiapkan pesanan.</Step>
                <Step num="5" title="Pembayaran & Struk" businessType={businessType} isLast>Saat transaksi selesai, tuntaskan pembayaran dan cetak Struk Thermal untuk pelanggan.</Step>
              </>
            )}

            {businessType === 'RETAIL' && (
              <>
                <Step num="1" title="Tambah Produk & SKU" businessType={businessType}>Buka menu <b>Produk</b>, masukkan data barang, harga jual, <b>Harga Modal (HPP)</b>, serta <b>SKU / Barcode</b> jika ada.</Step>
                <Step num="2" title="Atur Stok Akhir & Inventaris" businessType={businessType}>Atur jumlah <b>Stok Akhir</b> barang dan tentukan batas minimum stok agar Anda mendapat peringatan saat barang menipis.</Step>
                <Step num="3" title="Buka Kasir POS" businessType={businessType}>Masuk ke menu <b>Kasir POS</b>, scan barcode atau ketik nama barang di kolom pencarian untuk memasukkannya ke keranjang kasir.</Step>
                <Step num="4" title="Pembayaran & Struk" businessType={businessType} isLast>Selesaikan transaksi pembayaran dan cetak Struk Thermal sebagai bukti pembelian resmi pelanggan.</Step>
              </>
            )}

            {businessType === 'JASA' && (
              <>
                <Step num="1" title="Buat Layanan & Atur Komisi" businessType={businessType}>
                  Buka menu <b>Produk / Layanan</b>, buat daftar layanan yang Anda tawarkan (misal: Potong Rambut, Servis Garansi, Spa).
                  Anda dapat mengisi <b>Komisi Staf / Layanan</b> untuk perhitungan bagi hasil karyawan secara otomatis.
                </Step>
                <Step num="2" title="Bagikan Link Booking Publik" businessType={businessType}>Buka menu <b>Informasi Toko</b>, salin Link Booking Publik Anda, dan bagikan ke WhatsApp atau bio Instagram agar pelanggan bisa melakukan reservasi mandiri.</Step>
                <Step num="3" title="Pilih Staf / Teknisi / Kapster di Kasir" businessType={businessType}>
                  Masuk ke menu <b>Kasir POS</b>, pilih layanan pelanggan, lalu tentukan pelaksana pada opsi <b>Pilih Staf / Teknisi / Kapster</b>:
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600">
                    <li><b>Bengkel / Servis:</b> Pilih nama Mekanik / Teknisi pelaksana.</li>
                    <li><b>Barbershop / Salon:</b> Pilih nama Kapster / Barber / Stylist.</li>
                    <li><b>Klinik / Massage / Laundry:</b> Pilih nama Terapis / Petugas pelaksana.</li>
                  </ul>
                </Step>
                <Step num="4" title="Proses Bayar & Rekap Komisi" businessType={businessType} isLast>Selesaikan transaksi di kasir. Sistem secara otomatis mencatat rekap komisi staf di menu <b>Rekap Komisi Staf / Karyawan</b>.</Step>
              </>
            )}

            {businessType === 'RENTAL' && (
              <>
                <Step num="1" title="Input Data Unit / Armada / Properti / Alat" businessType={businessType}>
                  Buka menu <b>Armada / Unit</b>. Masukkan unit fisik yang Anda sewakan (Mobil, Motor, Kamar Villa/Kost, Kamera, Tenda, Sound System).
                  Setiap unit fisik otomatis memiliki stok 1. Jika ada supir, extra bed, atau operator, masukkan sebagai <b>Layanan Tambahan (Add-on)</b>.
                </Step>
                <Step num="2" title="Atur Tarif Sewa & Rekening DP" businessType={businessType}>
                  Tentukan tarif sewa (per hari, per jam, atau per malam). Buka menu <b>Informasi Toko</b> untuk mengisi data rekening Bank / QRIS agar pelanggan dapat mentransfer DP 50% saat reservasi online.
                </Step>
                <Step num="3" title="Bagikan Link Booking Online Mandiri" businessType={businessType}>
                  Salin Link Booking Publik Anda di menu <b>Informasi Toko</b>, lalu bagikan ke WhatsApp atau bio media sosial agar pelanggan bisa reservasi mandiri dan melihat ketersediaan unit secara live.
                </Step>
                <Step num="4" title="Konfirmasi Reservasi Online (ACC Jadwal)" businessType={businessType}>
                  Buka menu <b>Kalender Rental & Reservasi</b> untuk melihat pesanan masuk dari link online. Periksa bukti transfer DP pelanggan, lalu klik tombol <b>"Terima & ACC"</b> untuk mengunci jadwal unit agar anti-bentrok.
                </Step>
                <Step num="5" title="Transaksi Kasir POS & Cetak Dokumen / Surat Jalan A4" businessType={businessType}>
                  Saat pelanggan datang langsung atau jadwal sewa dimulai, buka <b>Kasir POS</b>:
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600">
                    <li><b>Identitas Unit:</b> Isi Plat Nomor (kendaraan), No. Kamar (properti), atau Serial Number (alat sewa).</li>
                    <li><b>Jaminan & Uang Deposit:</b> Catat jaminan KTP/SIM atau nominal uang deposit pelanggan.</li>
                    <li><b>Cetak Bukti Resmi:</b> Selesaikan transaksi pembayaran dan cetak <b>Surat Jalan & Perjanjian Sewa / Invoice</b> dalam format Thermal (58/80mm) atau <b>Format Kertas A4</b> resmi.</li>
                  </ul>
                </Step>
                <Step num="6" title="Monitoring Kalender & Penyelesaian Sewa (Hitung Denda / Deposit)" businessType={businessType} isLast>
                  Pantau pergerakan unit di <b>Kalender Rental</b>. Saat masa sewa selesai dan unit/kunci/alat dikembalikan pelanggan:
                  <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600">
                    <li>Klik tombol <b>"Penyelesaian Sewa"</b> (Terima Armada / Check-out & Selesai / Terima Alat).</li>
                    <li>Sistem otomatis menyediakan kalkulasi <b>Denda Keterlambatan (Overtime)</b> jika ada telat pengembalian, serta pencatatan pengembalian <b>Uang Deposit Jaminan</b> pelanggan sebelum menutup pesanan menjadi <b>Selesai</b>.</li>
                  </ul>
                </Step>
              </>
            )}
          </div>

          {/* BANNER BANTUAN WHATSAPP OTOMATIS */}
          {(() => {
            const clientName = tenantName || user?.fullName || "Mitra PJTech";
            const userEmail = user?.primaryEmailAddress?.emailAddress || "Tidak ada email";
            const whatsappNumber = "6285723256427";

            const messageText = `Halo Tim Support PJTech, saya butuh bantuan / melaporkan kendala pada aplikasi kasir.

*Data Usaha:*
- Nama Usaha: ${clientName}
- Kategori Usaha: ${category}
- Email Akun: ${userEmail}

*Detail Kendala yang Dialami:*
[Silakan ketik kendala / pertanyaan Anda di sini...]`;

            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

            return (
              <div className="mt-8 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      Ada Pertanyaan atau Kendala Sistem?
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Tim Support siap mendampingi Anda. Klik tombol untuk langsung terhubung ke WhatsApp dengan format laporan otomatis.
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-200 flex items-center justify-center gap-2 shrink-0 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Hubungi Support WhatsApp
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            );
          })()}

          {/* Panduan Instalasi Mobile (PWA Android & iOS) */}
          <div className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl border border-blue-800/40 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-sm text-white">Panduan Install di HP / Tablet Kasir (Android & iOS)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Aplikasi ini adalah PWA (Progressive Web App). Pasang langsung ke layar utama HP kasir/karyawan tanpa perlu ke Play Store:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <p className="font-bold text-blue-300 mb-1">🤖 Android (Google Chrome)</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Buka di Chrome → Klik titik tiga (⋮) pojok kanan atas → Pilih <b>"Install Aplikasi"</b> / <b>"Tambahkan ke Layar Utama"</b>.
                </p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <p className="font-bold text-amber-300 mb-1">🍎 iPhone / iPad (Safari)</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Buka di <b>Safari</b> → Klik tombol <b>Bagikan (Share)</b> [kotak panah atas] → Pilih <b>"Tambah ke Layar Utama"</b>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">
              Sistem ini akan beradaptasi secara otomatis mengikuti operasional Anda. Data dan laporan Anda tersimpan aman di cloud.
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
        <div className="text-slate-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
