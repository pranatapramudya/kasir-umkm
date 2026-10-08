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
  const [guideTab, setGuideTab] = useState<'sop' | 'install' | 'support'>('sop');
  const [mobileInstallTab, setMobileInstallTab] = useState<'android' | 'ios'>('android');
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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal - Dedicated Flex Row with Close Button */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950/80 rounded-2xl shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-slate-800 dark:text-white text-base sm:text-lg truncate leading-tight">
                Buku Panduan Penggunaan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                SOP Bisnis • Panduan Install HP (Android &amp; iOS)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1 -mt-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 touch-manipulation"
            aria-label="Tutup Buku Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Nav Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setGuideTab('sop')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              guideTab === 'sop'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <span>📖 SOP Bisnis</span>
          </button>
          <button
            type="button"
            onClick={() => setGuideTab('install')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              guideTab === 'install'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <span>📱 Install HP / iOS</span>
          </button>
          <button
            type="button"
            onClick={() => setGuideTab('support')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all hidden sm:flex items-center justify-center gap-1.5 ${
              guideTab === 'support'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <span>💬 Bantuan WA</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* TAB 1: SOP BISNIS */}
          {guideTab === 'sop' && (
            <>
              <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Alur operasional standar (SOP) untuk bisnis <span className="font-bold text-blue-600 dark:text-blue-400">{category}</span>.
                </div>
                <button
                  type="button"
                  onClick={() => setGuideTab('install')}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-200 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  📱 Panduan HP
                </button>
              </div>

              <div className="space-y-4">
                {businessType === 'FNB' && (
                  <>
                    <Step num="1" title="Tambah Menu & Kategori" businessType={businessType}>Buka menu <b>Produk</b>, masukkan daftar makanan/minuman beserta harganya.</Step>
                    <Step num="2" title="Atur Meja (Opsional)" businessType={businessType}>Jika melayani <i>Dine-in</i> (makan di tempat), buka <b>Manajemen Meja</b> untuk mengatur nomor dan kapasitas meja.</Step>
                    <Step num="3" title="Buka Kasir Resto & Opsi Takeaway" businessType={businessType}>
                      Masuk ke menu <b>Kasir Resto</b>, pilih menu pesanan pelanggan, lalu tentukan opsi meja/antrean:
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <li><b>Dine-in:</b> Pilih nomor meja, simpan pesanan atau langsung bayar.</li>
                        <li><b>Takeaway / Bungkus:</b> Masukkan nama/nomor antrean untuk pesanan dibawa pulang.</li>
                        <li><b>Cetak Struk Dapur:</b> Kirim instruksi masak langsung ke printer dapur/bar.</li>
                      </ul>
                    </Step>
                    <Step num="4" title="Tampilan Layar Kitchen (KDS)" businessType={businessType}>
                      Buka menu <b>Kitchen Display</b> di tablet/layar dapur agar koki dapat memantau pesanan masuk secara real-time dan menandai pesanan selesai dimasak.
                    </Step>
                    <Step num="5" title="Pembayaran & Laporan Harian" businessType={businessType} isLast>
                      Terima pembayaran (Tunai, QRIS, Transfer, Debit). Di akhir shift kasir, buka menu <b>Laporan Shift Kasir</b> untuk tutup kasir harian.
                    </Step>
                  </>
                )}

                {businessType === 'RETAIL' && (
                  <>
                    <Step num="1" title="Master Data Barang & Stok Awal" businessType={businessType}>Buka menu <b>Produk</b>, masukkan data barang, harga beli, harga jual, dan jumlah stok awal.</Step>
                    <Step num="2" title="Transaksi Kasir POS & Scan Barcode" businessType={businessType}>
                      Masuk ke <b>Kasir POS</b>, scan barcode atau cari produk. Pilih metode pembayaran dan cetak nota belanja pelanggan.
                    </Step>
                    <Step num="3" title="Kelola Hutang Piutang (Jika Ada)" businessType={businessType}>
                      Jika ada pelanggan yang kasbon/tempo, catat di sistem transaksi untuk memantau jatuh tempo dan pelunasan piutang.
                    </Step>
                    <Step num="4" title="Catat Pengeluaran Operasional" businessType={businessType}>
                      Buka menu <b>Pengeluaran</b> untuk mencatat biaya listrik, gaji, operasional toko, dan belanja perlengkapan.
                    </Step>
                    <Step num="5" title="Analisis Profit & Tutup Kasir" businessType={businessType} isLast>
                      Pantau laba bersih harian dan rekap pergeseran shift kasir di menu <b>Laporan & Tutup Kasir</b>.
                    </Step>
                  </>
                )}

                {businessType === 'JASA' && (
                  <>
                    <Step num="1" title="Daftar Layanan & Tarif Jasa" businessType={businessType}>Buka menu <b>Produk / Layanan</b>, masukkan nama jasa, paket layanan, dan tarif harga.</Step>
                    <Step num="2" title="Booking & Reservasi Jadwal" businessType={businessType}>
                      Pelanggan dapat melakukan booking via link online atau dicatat langsung oleh resepsionis di menu <b>Kalender Reservasi</b>.
                    </Step>
                    <Step num="3" title="Pencatatan Teknisi / Terapis / Staf" businessType={businessType}>
                      Tentukan staf atau teknisi yang menangani pesanan layanan untuk pembagian komisi dan performa kerja.
                    </Step>
                    <Step num="4" title="Pelaksanaan Jasa & Pembayaran" businessType={businessType}>
                      Setelah layanan selesai, lakukan checkout pembayaran di kasir dan cetak kwitansi bukti pengerjaan.
                    </Step>
                    <Step num="5" title="Rekap Komisi Staf & Laporan Keuangan" businessType={businessType} isLast>
                      Sistem menghitung otomatis komisi staf dan rekap pendapatan bersih jasa di menu <b>Laporan Bisnis</b>.
                    </Step>
                  </>
                )}

                {businessType === 'RENTAL' && (
                  <>
                    <Step num="1" title="Input Master Armada, Properti & Alat Sewa" businessType={businessType}>
                      Buka menu <b>Produk</b>, masukkan unit sewa (Mobil/Motor, Villa/Kamar/Homestay, Alat Camping/Kamera/Peralatan). Masukkan tarif per 24 jam/hari/minggu.
                    </Step>
                    <Step num="2" title="Pengaturan Jadwal Booking Online & Syarat Sewa" businessType={businessType}>
                      Buka menu <b>Pengaturan Toko</b> untuk mengaktifkan link reservasi mandiri pelanggan. Anda dapat mengatur nominal minimal DP booking dan ketentuan jaminan sewa (KTP/SIM/Deposit).
                    </Step>
                    <Step num="3" title="Pelanggan Booking Online (Link Mandiri)" businessType={businessType}>
                      Pelanggan membuka link web rental Anda, memilih unit dan durasi tanggal sewa, mengunggah kartu identitas & bukti transfer DP secara mandiri tanpa repot chat manual.
                    </Step>
                    <Step num="4" title="Konfirmasi Reservasi Online (ACC Jadwal)" businessType={businessType}>
                      Buka menu <b>Kalender Rental & Reservasi</b> untuk melihat pesanan masuk dari link online. Periksa bukti transfer DP pelanggan, lalu klik tombol <b>"Terima & ACC"</b> untuk mengunci jadwal unit agar anti-bentrok.
                    </Step>
                    <Step num="5" title="Transaksi Kasir POS & Cetak Dokumen / Surat Jalan A4" businessType={businessType}>
                      Saat pelanggan datang langsung atau jadwal sewa dimulai, buka <b>Kasir POS</b>:
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <li><b>Identitas Unit:</b> Isi Plat Nomor (kendaraan), No. Kamar (properti), atau Serial Number (alat sewa).</li>
                        <li><b>Jaminan & Uang Deposit:</b> Catat jaminan KTP/SIM atau nominal uang deposit pelanggan.</li>
                        <li><b>Cetak Bukti Resmi:</b> Selesaikan transaksi pembayaran dan cetak <b>Surat Jalan & Perjanjian Sewa / Invoice</b> dalam format Thermal (58/80mm) atau <b>Format Kertas A4</b> resmi.</li>
                      </ul>
                    </Step>
                    <Step num="6" title="Monitoring Kalender & Penyelesaian Sewa (Hitung Denda / Deposit)" businessType={businessType} isLast>
                      Pantau pergerakan unit di <b>Kalender Rental</b>. Saat masa sewa selesai dan unit/kunci/alat dikembalikan pelanggan:
                      <ul className="list-disc pl-4 mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <li>Klik tombol <b>"Penyelesaian Sewa"</b> (Terima Armada / Check-out & Selesai / Terima Alat).</li>
                        <li>Sistem otomatis menyediakan kalkulasi <b>Denda Keterlambatan (Overtime)</b> jika ada telat pengembalian, serta pencatatan pengembalian <b>Uang Deposit Jaminan</b> pelanggan sebelum menutup pesanan menjadi <b>Selesai</b>.</li>
                      </ul>
                    </Step>
                  </>
                )}
              </div>
            </>
          )}

          {/* TAB 2: PANDUAN INSTALL HP (ANDROID & IOS) */}
          {guideTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Smartphone className="w-5 h-5 text-blue-200" />
                  <h3 className="font-black text-sm text-white">Panduan Install Aplikasi di HP (PWA)</h3>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  PJTECH Kasir menggunakan teknologi Progressive Web App (PWA). Aplikasi terpasang langsung di layar utama HP kasir tanpa perlu download ratusan MB dari Play Store atau App Store.
                </p>
              </div>

              {/* Platform Selector Switcher */}
              <div className="flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setMobileInstallTab('android')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    mobileInstallTab === 'android'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>🤖 HP Android (Google Chrome)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileInstallTab('ios')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    mobileInstallTab === 'ios'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>🍎 iPhone / iPad (Safari)</span>
                </button>
              </div>

              {mobileInstallTab === 'android' ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Buka di Browser Google Chrome</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Buka link web aplikasi kasir menggunakan browser Google Chrome di HP Android kasir.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Ketuk Menu Titik Tiga (⋮)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Ketuk ikon titik tiga di sudut kanan atas layar browser Chrome.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Pilih "Install Aplikasi" / "Tambahkan ke Layar Utama"</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Ketuk pilihan tersebut dan konfirmasi dengan menekan tombol <strong>Install</strong>.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300">Siap Digunakan!</p>
                      <p className="text-emerald-800 dark:text-emerald-400 text-xs mt-0.5">Ikon resmi aplikasi kasir muncul di layar utama HP dan dapat dibuka secara instan & fullscreen.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Buka di Browser Safari (Wajib)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Di iPhone / iPad, pastikan membuka link aplikasi kasir menggunakan browser <strong>Safari</strong> bawaan Apple.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Ketuk Ikon Bagikan (Share)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Ketuk ikon kotak dengan tanda panah ke atas di bagian bilah menu bawah layar Safari.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Pilih "Tambah ke Layar Utama" (Add to Home Screen)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Gulir menu ke bawah lalu ketuk opsi <strong>Tambah ke Layar Utama</strong>, kemudian ketuk <strong>Tambah</strong> di pojok kanan atas.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300">Selesai & Fullscreen!</p>
                      <p className="text-emerald-800 dark:text-emerald-400 text-xs mt-0.5">Ikon terpasang di Home Screen iPhone dan akan terbuka fullscreen tanpa bilah browser Safari.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUPPORT WHATSAPP */}
          {(guideTab === 'support' || guideTab === 'sop') && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-200 dark:shadow-none">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                    Ada Pertanyaan atau Kendala Sistem?
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    Tim Support siap mendampingi Anda via WhatsApp resmi dengan format laporan otomatis.
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-2 shrink-0 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Hubungi Support WA
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          )}

          {/* Bottom Security / Cloud Note */}
          <div className="p-3.5 bg-blue-50 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700 flex gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              Sistem kasir PJTECH berjalan otomatis di cloud dengan enkripsi aman. Data transaksi Anda tersimpan real-time dan dapat diakses dari HP kasir manapun.
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-3.5 sm:px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">⚡ PWA Ringan • Otomatis Update</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Step({ num, title, businessType, isLast, children }: { num: string; title: string; businessType: string; isLast?: boolean; children: React.ReactNode }) {
  let badgeClass = "bg-slate-800 text-white";
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
        {!isLast && <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-2"></div>}
      </div>
      <div className="pb-6">
        <h3 className="font-black text-slate-800 dark:text-white mb-1 text-base">{title}</h3>
        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
