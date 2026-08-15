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
  const [isTncOpen, setIsTncOpen] = useState(false);

  const getWaText = (plan: typeof selectedPlan) => {
    if (!plan) return '';
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
          router.push(onSuccessRedirect);
        } else {
          router.push('/admin');
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
                setSelectedPlan({ days: 30, plan: 'PRO_MONTHLY', title: 'Pro 1 Bulan', price: 'Rp 129.000' });
                setIsCheckoutOpen(true);
              }}
              className={`w-full py-2 text-sm rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                currentPlan === 'PRO_MONTHLY' 
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
                setSelectedPlan({ days: 365, plan: 'PRO_YEARLY', title: 'Pro 1 Tahun', price: 'Rp 990.000' });
                setIsCheckoutOpen(true);
              }}
              className={`w-full py-2.5 text-sm rounded-xl font-black transition-colors flex items-center justify-center gap-2 ${
                isLoading || currentPlan === 'PRO_YEARLY' 
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
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative p-6 md:p-8">
            <button 
              onClick={() => setIsTncOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-6 border-b pb-4">
              Syarat & Ketentuan Layanan (T&C)
            </h3>
            
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

      {/* CHECKOUT MODAL UNTUK PAKET BERBAYAR */}
      {isCheckoutOpen && selectedPlan && selectedPlan.price !== 'Rp 0' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl relative">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8 pb-24 md:pb-24">
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
                        className="w-full h-auto max-h-80 max-w-[220px] mx-auto object-contain rounded-md shadow-sm" 
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
