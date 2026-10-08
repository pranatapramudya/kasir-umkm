"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface PricingSectionProps {
  currentPlan?: string | null;
  onSuccessRedirect?: string;
}

export default function PricingSection({ currentPlan, onSuccessRedirect }: PricingSectionProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isTncOpen, setIsTncOpen] = useState(false);

  React.useEffect(() => {
    // Presisi stay di paling atas saat katalog paket ditampilkan
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleMayarCheckout = (planCode: string) => {
    let link = '';
    if (planCode === 'PRO_MONTHLY') {
      link = 'https://pranajayatech.myr.id/pl/kasir-umkm-pro-1-bulan';
    } else if (planCode === 'PRO_SEMI_ANNUAL') {
      link = 'https://pranajayatech.myr.id/pl/kasir-umkm-pro-6-bulan';
    } else if (planCode === 'PRO_YEARLY') {
      link = 'https://pranajayatech.myr.id/pl/kasir-umkm-pro-1-tahun';
    }

    if (link) {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (email) {
        link += `?customer_email=${encodeURIComponent(email)}`;
      }
      window.open(link, '_blank');
    }
  };

  const handleExtend = async (days: number, plan: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/subscription/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, plan }),
      });

      if (res.ok) {
        setIsRedirecting(true); // UX Fix
        if (isLoaded && user) {
          await user.reload();
        }
        window.location.href = onSuccessRedirect || '/admin';
      } else {
        alert('Gagal memproses paket.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan jaringan.');
      setIsLoading(false);
    }
  };


  // FULL-SCREEN LOADING OVERLAY
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Menyiapkan Dashboard Anda...</h2>
        <p className="text-slate-500 font-medium">Harap tunggu sebentar</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm relative">
        <div className="absolute top-6 left-6 hidden sm:block">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
            by PJTECH
          </span>
        </div>
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">Pilih Paket Langganan</h2>
          </div>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-sm md:text-base">Tingkatkan ke Pro untuk melihat laporan keuntungan harian Anda, melacak tren penjualan, dan fitur analitik premium lainnya.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 0: Free Trial 14 Hari (PILIHAN UTAMA PENDAFTAR BARU) */}
          <div className="border-2 border-blue-600 rounded-3xl p-5 flex flex-col relative shadow-[0_8px_30px_rgb(37,99,235,0.12)] bg-gradient-to-b from-blue-50/50 via-white to-white ring-2 ring-blue-500/20 ring-offset-2">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1">
              <span>✨</span>
              <span>UJI COBA GRATIS</span>
            </div>

            <div className="mb-4 mt-2">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold mb-2">
                Pilihan Terbaik Pendaftar Baru
              </div>
              <h3 className="text-xl font-black text-slate-800">Free Trial 14 Hari</h3>
              <p className="text-[13px] text-slate-600 mt-1">Coba seluruh fitur kasir PJTECH tanpa komitmen &amp; tanpa biaya di awal.</p>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5">
                Rp 0
                <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md uppercase">Gratis</span>
              </div>
              <div className="text-xs font-semibold text-blue-600 mt-1.5">Masa Uji Coba Penuh 14 Hari</div>
              <div className="text-[11px] text-slate-500 italic mt-0.5">Langsung aktif tanpa kartu kredit</div>
            </div>

            <div className="space-y-2 mb-8 flex-1 border-t border-blue-100 pt-4">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 font-semibold">Akses Kasir POS Penuh (Semua Mode Usaha)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Manajemen Produk, Stok &amp; Kategori</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Catat Transaksi Kasbon &amp; QRIS</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Dasbor Laporan Penjualan &amp; Laba</span>
              </div>
            </div>

            <button
              disabled={isLoading || currentPlan === 'TRIAL' || currentPlan === 'FREE'}
              onClick={() => {
                handleExtend(14, 'TRIAL');
              }}
              className={`w-full py-3 text-sm rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] ${
                currentPlan === 'TRIAL' || currentPlan === 'FREE'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyiapkan Akun Anda...</span>
                </>
              ) : currentPlan === 'TRIAL' || currentPlan === 'FREE' ? (
                'Paket Trial Anda Saat Ini'
              ) : (
                'Mulai Free Trial 14 Hari Sekarang 🚀'
              )}
            </button>
          </div>

          {/* Card 1: Pro 1 Bulan (Decoy) */}
          <div className="border border-slate-200 rounded-3xl p-5 flex flex-col hover:border-slate-300 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Pro 1 Bulan</h3>
              <p className="text-[13px] text-slate-500 mt-1.5">Untuk mencoba fitur lengkap kasir pintar.</p>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-bold text-slate-800 flex items-end gap-1">
                Rp 129k <span className="text-sm font-normal text-slate-500 pb-0.5">/ bulan</span>
              </div>
              <div className="text-xs font-semibold text-indigo-600 mt-1 mb-1">Total: Rp 129.000 / 1 bulan</div>
              <div className="text-[11px] text-slate-500 italic mb-2">(Hanya Software)</div>
              <button onClick={() => setIsTncOpen(true)} className="text-[11px] font-bold text-blue-600 hover:underline">Lihat Syarat & Ketentuan</button>
            </div>
            <div className="space-y-2 mb-8 flex-1">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 font-bold">Akses Penuh POS, Jasa & Rental</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Manajemen Stok &amp; Komisi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Laporan Keuangan Dasar</span>
              </div>
            </div>
            <button
              disabled={isLoading || currentPlan === 'PRO_MONTHLY'}
              onClick={() => {
                handleMayarCheckout('PRO_MONTHLY');
              }}
              className={`w-full py-2 text-sm rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${currentPlan === 'PRO_MONTHLY'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentPlan === 'PRO_MONTHLY' ? 'Paket Anda Saat Ini' : 'Pilih 1 Bulan')}
            </button>
          </div>

          {/* Card 2: Pro 6 Bulan */}
          <div className="border border-slate-200 rounded-3xl p-5 flex flex-col hover:border-slate-300 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Pro 6 Bulan</h3>
              <p className="text-[13px] text-slate-500 mt-1.5">UMKM yang butuh fleksibilitas cashflow.</p>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-bold text-slate-800 flex items-end gap-1">
                Rp 99k <span className="text-sm font-normal text-slate-500 pb-0.5">/ bulan</span>
              </div>
              <div className="text-xs font-semibold text-indigo-600 mt-1 mb-1">Total: Rp 594.000 / 6 bulan</div>
              <div className="text-[11px] text-slate-500 italic mb-2">(Hanya Software)</div>
              <button onClick={() => setIsTncOpen(true)} className="text-[11px] font-bold text-blue-600 hover:underline">Lihat Syarat & Ketentuan</button>
            </div>
            <div className="space-y-2 mb-8 flex-1">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 font-bold">Akses Penuh POS, Jasa & Rental</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Laporan Pendapatan &amp; Laba Bersih</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Ekspor Data Laporan (Excel/CSV)</span>
              </div>
            </div>
            <button
              disabled={isLoading || currentPlan === 'PRO_SEMI_ANNUAL'}
              onClick={() => {
                handleMayarCheckout('PRO_SEMI_ANNUAL');
              }}
              className={`w-full py-2 text-sm rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${currentPlan === 'PRO_SEMI_ANNUAL'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentPlan === 'PRO_SEMI_ANNUAL' ? 'Paket Anda Saat Ini' : 'Pilih 6 Bulan')}
            </button>
          </div>

          {/* Card 3: Pro Tahunan (HERO) */}
          <div className="border-2 border-orange-500 rounded-3xl p-5 flex flex-col relative shadow-[0_8px_30px_rgb(249,115,22,0.15)] bg-white mt-4 lg:mt-0 ring-2 ring-orange-500 ring-offset-2">
            <div className="absolute -top-3.5 right-6 bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">
              PALING HEMAT!
            </div>
            <div className="mb-4 mt-2">
              <h3 className="text-xl font-black text-slate-800">Pro 1 Tahun</h3>
              <p className="text-[13px] text-slate-500 mt-1.5">Pemilik bisnis serius yang mencari nilai terbaik.</p>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-black text-slate-800 flex items-end gap-1">
                Rp 82.5k <span className="text-sm font-bold text-slate-500 pb-0.5">/ bulan</span>
              </div>
              <div className="text-sm font-black text-orange-600 mt-2 mb-1">Total: Rp 990.000 / 12 bulan</div>
              <div className="text-xs font-bold text-emerald-600 mt-1.5 bg-emerald-50 inline-block px-2 py-1 rounded-md">Hemat Rp 558.000 per tahun!</div>
              <div className="mt-2">
                <button onClick={() => setIsTncOpen(true)} className="text-[11px] font-bold text-blue-600 hover:underline">Lihat Syarat & Ketentuan</button>
              </div>
            </div>

            <div className="space-y-2 mb-8 flex-1 border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 font-bold">Semua fitur tanpa batasan</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Analitik Mendalam:</span> Lacak tren penjualan.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Database Pelanggan:</span> Rekam preferensi pelanggan.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Akses Prioritas:</span> Customer Service khusus.</span>
              </div>
            </div>

            <button
              disabled={isLoading || currentPlan === 'PRO_YEARLY'}
              onClick={() => {
                handleMayarCheckout('PRO_YEARLY');
              }}
              className={`w-full py-2.5 text-sm rounded-xl font-black transition-colors flex items-center justify-center gap-2 ${isLoading || currentPlan === 'PRO_YEARLY'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border-none'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/40'
                }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentPlan === 'PRO_YEARLY' ? 'Paket Anda Saat Ini' : 'Pilih Paket Paling Hemat')}
            </button>
          </div>

        </div>
      </div>

      {/* T&C MODAL */}
      {isTncOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[90vw] md:max-w-xl overflow-hidden shadow-2xl relative p-6 md:p-8">
            <div className="flex justify-between items-start border-b pb-4 mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-800">
                Syarat & Ketentuan Layanan (T&C)
              </h3>
              <button
                onClick={() => setIsTncOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors shrink-0 -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-slate-600 max-h-[60vh] overflow-y-auto space-y-4 pr-2">
              <p className="font-semibold text-slate-800">1. Lisensi Perangkat Lunak (Software)</p>
              <p>Paket langganan ini hanya mencakup hak guna lisensi perangkat lunak PJTECH Kasir UMKM selama periode aktif yang dipilih.</p>

              <p className="font-semibold text-slate-800 mt-4">2. Pembebasan Tanggung Jawab Perangkat Keras (Hardware)</p>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-orange-800">
                <p><strong>PJTECH KASIR UMKM hanya menyediakan layanan perangkat lunak (Software).</strong></p>
                <p className="mt-2">Seluruh perangkat keras (Hardware) yang dibeli melalui tautan rekomendasi pihak ketiga (Affiliate/Rekomendasi) adalah tanggung jawab penuh dari penjual/toko/marketplace terkait. Kami tidak menerima klaim garansi, retur, atau dukungan teknis atas kerusakan perangkat keras fisik.</p>
              </div>
            </div>

            <button
              onClick={() => setIsTncOpen(false)}
              className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Saya Mengerti dan Setuju
            </button>
          </div>
        </div>
      )}


    </>
  );
}
