"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, Loader2, X, Copy } from 'lucide-react';

interface PricingSectionProps {
  currentPlan?: string | null;
  onSuccessRedirect?: string;
}

export default function PricingSection({ currentPlan, onSuccessRedirect }: PricingSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ days: number; plan: string; title: string; price: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [tncType, setTncType] = useState<'software' | 'bundle' | null>(null);
  const [isBundle, setIsBundle] = useState(currentPlan === 'PRO_YEARLY_BUNDLE');

  const getWaText = (plan: typeof selectedPlan) => {
    if (!plan) return '';
    if (plan.plan === 'PRO_YEARLY_BUNDLE') {
      return `Halo Tim PJTECH, saya ingin mengonfirmasi pembayaran langganan aplikasi kasir + Hardware.\n\n*Nama Toko:* [Nama Toko/User]\n*Paket:* Pro Tahunan (Bundle)\n*Total:* Rp 2.988.000\n\n*Data Pengiriman Hardware:*\n- Nama Penerima: \n- No. HP Penerima: \n- Alamat Lengkap (Jalan, RT/RW, Kota/Kabupaten, Kode Pos): \n\nBerikut saya lampirkan bukti transfernya.`;
    }
    return `Halo Tim PJTECH, saya ingin mengonfirmasi pembayaran langganan aplikasi kasir.\n\n*Nama Toko:* [Nama Toko/User]\n*Paket:* ${plan.title}\n*Total:* ${plan.price}\n\nBerikut saya lampirkan bukti transfernya.`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("901331745328");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
        if (onSuccessRedirect) {
          window.location.href = onSuccessRedirect;
        } else {
          window.location.href = '/admin';
        }
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

  const handleWhatsAppCheckout = async () => {
    if (!selectedPlan) return;
    setIsLoading(true);
    
    // Buka tab baru sebelum fetch untuk mitigasi popup blocker
    const newTab = window.open('about:blank', '_blank');

    try {
      const res = await fetch('/api/subscription/pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan.plan }),
      });

      if (res.ok) {
        const waLink = `https://wa.me/6285723256427?text=${encodeURIComponent(getWaText(selectedPlan))}`;
        if (newTab) {
          newTab.location.href = waLink;
        } else {
          window.open(waLink, '_blank');
        }
        router.push('/pending-approval');
      } else {
        if (newTab) newTab.close();
        alert('Gagal memproses pendaftaran paket.');
      }
    } catch (err) {
      if (newTab) newTab.close();
      console.error(err);
      alert('Terjadi kesalahan saat memproses.');
    } finally {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1: Mulai Usaha */}
          <div className="border border-slate-200 rounded-3xl p-5 flex flex-col hover:border-slate-300 transition-all">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Mulai Usaha</h3>
              <p className="text-[13px] text-slate-500 mt-1.5">Pengguna baru yang ragu dan ingin mencoba.</p>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-bold text-slate-800">Rp 0</div>
              <div className="text-[13px] text-slate-500 mt-1">Gratis 14 Hari Pertama</div>
            </div>
            <div className="space-y-2 mb-8 flex-1">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Akses Kasir (Point of Sales) Penuh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Manajemen Produk Dasar</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Buka Kunci Dasbor Analitik (Terbatas)</span>
              </div>
            </div>
            <button
              disabled={isLoading || currentPlan === 'TRIAL' || currentPlan === 'FREE'}
              onClick={() => {
                handleExtend(14, 'TRIAL');
              }}
              className={`w-full py-2 text-sm rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                currentPlan === 'TRIAL' || currentPlan === 'FREE' 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (currentPlan === 'TRIAL' || currentPlan === 'FREE' ? 'Paket Anda Saat Ini' : 'Gunakan Akses Trial')}
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
                Rp 99rb <span className="text-sm font-normal text-slate-500 pb-0.5">/ bulan</span>
              </div>
              <div className="text-xs font-semibold text-indigo-600 mt-1 mb-1">Wajib dibayar di awal: Rp 594.000 / 6 bulan</div>
              <div className="text-[11px] text-slate-500 italic mb-2">(Hanya Software)</div>
              <button onClick={() => setTncType('software')} className="text-[11px] font-bold text-blue-600 hover:underline">Lihat Syarat & Ketentuan</button>
            </div>
            <div className="space-y-2 mb-8 flex-1">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Semua fitur Kasir &amp; Produk</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Laporan Pendapatan &amp; Laba Bersih</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Manajemen Stok Otomatis</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Ekspor Data Laporan (Excel/CSV)</span>
              </div>
            </div>
            <button
              disabled={isLoading || currentPlan === 'PRO_SEMI_ANNUAL'}
              onClick={() => {
                setSelectedPlan({ days: 180, plan: 'PRO_SEMI_ANNUAL', title: 'Pro 6 Bulan', price: 'Rp 594.000' });
                setIsCheckoutOpen(true);
              }}
              className={`w-full py-2 text-sm rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                currentPlan === 'PRO_SEMI_ANNUAL' 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentPlan === 'PRO_SEMI_ANNUAL' ? 'Paket Anda Saat Ini' : 'Pilih 6 Bulan')}
            </button>
          </div>

          {/* Card 3: Pro Tahunan */}
          <div className="border-2 border-orange-500 rounded-3xl p-5 flex flex-col relative shadow-[0_8px_30px_rgb(249,115,22,0.15)] bg-white mt-4 lg:mt-0">
            <div className="absolute -top-3.5 right-6 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wider">
              PALING POPULER
            </div>
            <div className="mb-4 mt-1">
              <h3 className="text-xl font-bold text-slate-800">Pro Tahunan</h3>
              <p className="text-[13px] text-slate-500 mt-1.5">Pemilik bisnis serius yang butuh data mendalam.</p>
            </div>
            
            {/* TOGGLE SOFTWARE / BUNDLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-xl mb-4 shadow-inner">
               <button 
                 className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!isBundle ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                 onClick={() => setIsBundle(false)}
               >Software Saja</button>
               <button 
                 className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${isBundle ? 'bg-orange-500 shadow text-white' : 'text-slate-500 hover:text-slate-700'}`}
                 onClick={() => setIsBundle(true)}
               >+ Hardware</button>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-bold text-slate-800 flex items-end gap-1">
                {isBundle ? 'Rp 2.988k' : 'Rp 990k'} <span className="text-sm font-normal text-slate-500 pb-0.5">/ tahun</span>
              </div>
              {isBundle ? (
                <div className="text-[11px] font-bold text-orange-600 mt-2">
                  <ul className="list-disc pl-3 space-y-1 mb-2">
                    <li>Termasuk Tablet Kasir & Printer Thermal</li>
                    <li>Hak milik setelah 1 tahun</li>
                  </ul>
                  <button onClick={() => setTncType('bundle')} className="text-blue-600 hover:underline">Lihat Syarat & Ketentuan</button>
                </div>
              ) : (
                <div className="text-xs font-bold text-orange-500 mt-1.5">Hemat 2 Bulan</div>
              )}
            </div>
            
            <div className="space-y-2 mb-8 flex-1 border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600">Semua fitur di paket Dasar/Pro</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Analisis Jam Sibuk:</span> Pantau waktu...</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Peringatan Stok Cerdas:</span> Notifikasi...</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Laporan Multi-Kasir:</span> Lacak performa...</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Analitik Produk (ABC):</span> Deteksi produk...</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600"><span className="font-bold text-slate-700">Database Pelanggan:</span> Kenali dan catat...</span>
              </div>
              {isBundle && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-emerald-800">Gratis Peminjaman 1 Set Kasir (Tablet & Printer Bluetooth).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-bold text-emerald-800">Perangkat menjadi HAK MILIK Anda sepenuhnya pada perpanjangan tahun berikutnya.</span>
                  </div>
                </div>
              )}
            </div>
            
            {(() => {
              // Dynamic properties based on bundle state
              const targetPlanName = isBundle ? 'PRO_YEARLY_BUNDLE' : 'PRO_YEARLY';
              const targetTitle = isBundle ? 'Pro Tahunan (Bundle)' : 'Pro Tahunan';
              const targetPrice = isBundle ? 'Rp 2.988.000' : 'Rp 990.000';
              const isDisabled = isLoading || currentPlan === targetPlanName;

              return (
                <button
                  disabled={isDisabled}
                  onClick={() => {
                    setSelectedPlan({ days: 365, plan: targetPlanName, title: targetTitle, price: targetPrice });
                    setIsCheckoutOpen(true);
                  }}
                  className={`w-full py-2 text-sm rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                    isDisabled 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border-none' 
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30'
                  }`}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentPlan === targetPlanName ? 'Paket Anda Saat Ini' : (isBundle ? 'Pilih Bundling' : 'Pilih Tahunan'))}
                </button>
              )
            })()}
          </div>

        </div>
      </div>

      {/* T&C MODAL */}
      {tncType !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative p-6 md:p-8">
            <button 
              onClick={() => setTncType(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 pr-6 border-b pb-4">
              {tncType === 'bundle' ? 'Syarat & Ketentuan Perangkat Kasir (Bundling)' : 'Syarat & Ketentuan Lisensi Software'}
            </h3>
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-8 text-sm text-slate-600 max-h-[60vh] overflow-y-auto">
              {tncType === 'bundle' ? (
                <>
                  <div className="flex-1 space-y-4">
                    <p>1. Hardware (Tablet Kasir & Printer Thermal) sepenuhnya menjadi hak milik pengguna setelah berlangganan selama <strong>1 Tahun penuh</strong>.</p>
                    <p>2. Kerusakan fisik pada perangkat keras (Hardware) di luar cacat pabrik menjadi tanggung jawab pengguna.</p>
                    <p>3. Jika pengguna membatalkan langganan sebelum genap 1 Tahun, pengguna wajib mengembalikan perangkat keras ke tim operasional PJTECH dalam kondisi berfungsi atau dikenakan biaya sisa nilai perangkat.</p>
                  </div>
                  <div className="flex-1 space-y-4">
                    <p>4. Klaim garansi perangkat yang cacat pabrik berlaku selama 30 hari sejak perangkat diterima.</p>
                    <p>5. Tim support tidak melayani kerusakan akibat force majeure seperti bencana alam, kebakaran, dan sejenisnya.</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                      <p className="font-semibold text-slate-700 text-xs mb-1">Catatan Tambahan:</p>
                      <p className="text-xs">Syarat dan ketentuan ini dapat berubah sewaktu-waktu. Pengguna akan diberitahu melalui notifikasi dashboard jika terdapat perubahan.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-4 text-center py-4">
                  <p className="text-lg font-semibold text-slate-800">Paket ini hanya mencakup Lisensi Software PJTECH Kasir.</p>
                  <p className="text-base text-slate-600">Tidak termasuk peminjaman perangkat keras (Tablet/Printer).</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setTncType(null)}
              className="w-full mt-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL UNTUK PAKET BERBAYAR */}
      {isCheckoutOpen && selectedPlan && selectedPlan.price !== 'Rp 0' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">Konfirmasi Pembayaran</h2>
              
              <div className="bg-slate-50 py-3 px-4 rounded-2xl border border-slate-100 mb-5 text-center">
                <div className="text-xs text-slate-500 mb-0.5">Paket Pilihan:</div>
                <div className="font-bold text-slate-800 text-base">{selectedPlan.title}</div>
                <div className="mt-2 text-xs text-slate-500 mb-0.5">Total Tagihan:</div>
                <div className="text-2xl font-black text-indigo-600">{selectedPlan.price}</div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold text-slate-800 mb-3 text-center">Instruksi Pembayaran Manual</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3 flex flex-col justify-center">
                    <div>
                      <div className="text-xs text-slate-500">Bank</div>
                      <div className="font-bold text-slate-700 flex items-center gap-2">
                        <Image src="/seabank.png" alt="Seabank" width={100} height={24} className="h-6 w-auto object-contain" />
                        Seabank
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">No. Rekening</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-lg font-bold tracking-wider text-slate-700">901331745328</span>
                        <button
                          onClick={handleCopy}
                          title="Salin Nomor Rekening"
                          className="p-1.5 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1 text-slate-500"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-500">Disalin!</span>
                            </>
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Atas Nama</div>
                      <div className="font-bold text-slate-700">Pranata Pramudya</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center flex flex-col items-center justify-center">
                      <div className="text-xs text-slate-500 mb-2">Atau scan via QRIS (DANA Bisnis)</div>
                      <Image 
                        src="/qris.jpeg" 
                        alt="QRIS DANA" 
                        width={220}
                        height={220}
                        className="w-full h-auto max-w-[220px] mx-auto object-contain rounded-md shadow-sm" 
                      />
                  </div>
                </div>
              </div>

                <button
                  onClick={handleWhatsAppCheckout}
                  disabled={isLoading}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : 'Kirim Bukti via WhatsApp'}
                </button>
              </div>
            </div>
          </div>
      )}
    </>
  );
}
