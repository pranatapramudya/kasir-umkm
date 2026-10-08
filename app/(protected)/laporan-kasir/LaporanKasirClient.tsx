"use client";

import React, { useState, useEffect } from 'react';
import useSWR, { preload } from 'swr';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, Calendar, Wallet, CreditCard, Clock, FileText, Eye, X, Package, Loader2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { CustomUserButton } from '@/components/CustomUserButton';
import { Pagination } from '@/components/Pagination';
import { isRentalTravelCategory, isPureServiceCategory } from '@/lib/business-category';

export default function LaporanKasirClient({ sidebar, initialDate, initialData, tenantCategory }: any) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRental = isRentalTravelCategory(tenantCategory);
    const isPureJasa = isPureServiceCategory(tenantCategory);
    const isFNB = tenantCategory === 'F&B / Kuliner' || tenantCategory === 'FNB' || tenantCategory === 'F&B';
    const isRetail = tenantCategory === 'Retail / Dagang' || tenantCategory === 'RETAIL';
    const itemHeaderLabel = isRental ? "Armada / Layanan" : isPureJasa ? "Layanan" : isFNB ? "Menu" : isRetail ? "Produk / Barang" : "Item";
    
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTx, setSelectedTx] = useState<any>(null);

    const getTodayStr = () => new Date().toLocaleString("en-CA", { timeZone: "Asia/Jakarta" }).split(",")[0];
    const isToday = selectedDate === getTodayStr();

    // Sinkronisasi jika URL query param 'date' berubah
    useEffect(() => {
        const paramDate = searchParams.get('date');
        if (paramDate && paramDate !== selectedDate) {
            setSelectedDate(paramDate);
            setCurrentPage(1);
        }
    }, [searchParams]);

    const applyDate = (newDate: string) => {
        if (!newDate) return;
        setSelectedDate(newDate);
        setCurrentPage(1);
        router.push(`/laporan-kasir?date=${newDate}`);
    };

    const changeDateByDays = (days: number) => {
        const parts = selectedDate.split('-');
        if (parts.length !== 3) return;
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        d.setDate(d.getDate() + days);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        applyDate(`${yyyy}-${mm}-${dd}`);
    };

    const formatDateIndonesian = (dateStr: string) => {
        try {
            const [y, m, d] = dateStr.split('-').map(Number);
            const dateObj = new Date(y, m - 1, d);
            return dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const fetcher = async (args: string | [string, string]) => {
        const url = Array.isArray(args) ? args[0] : args;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal mengambil data");
        return res.json();
    };

    const { user } = useUser();
    const currentTenantId = user?.publicMetadata?.role === 'CASHIER' ? user?.publicMetadata?.tenantId : user?.id;

    const queryUrl = `/api/reports/shift?date=${selectedDate}&page=${currentPage}`;
    
    // Gunakan initialData HANYA jika page === 1 dan selectedDate === initialDate
    const isInitialParams = currentPage === 1 && selectedDate === initialDate;
    
    const { data, error, isLoading } = useSWR(
        queryUrl && currentTenantId ? [queryUrl, currentTenantId as string] : queryUrl,
        fetcher,
        { 
            fallbackData: isInitialParams ? initialData : undefined,
            keepPreviousData: false,
            revalidateIfStale: true,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const activeData = data ?? (isInitialParams ? initialData : null);
    const transactions = activeData?.transactions || [];
    const metrics = activeData?.metrics || { totalGross: 0, totalCash: 0, totalQRIS: 0 };
    const totalPages = activeData?.totalPages || 1;
    // Proactive Preloading untuk pagination Laporan Shift (0ms delay)
    useEffect(() => {
        if (!currentTenantId) return;
        if (currentPage < totalPages) {
            const nextUrl = `/api/reports/shift?date=${selectedDate}&page=${currentPage + 1}`;
            preload([nextUrl, currentTenantId as string], fetcher);
        }
        if (currentPage > 1) {
            const prevUrl = `/api/reports/shift?date=${selectedDate}&page=${currentPage - 1}`;
            preload([prevUrl, currentTenantId as string], fetcher);
        }
    }, [currentPage, totalPages, selectedDate, currentTenantId]);
    const soldSummary = activeData?.soldSummary || {};
    const isFetching = isLoading && !data;

    return (
        <div className="min-h-screen lg:h-screen bg-gray-50 flex flex-col lg:flex-row text-slate-900 lg:overflow-hidden">
            {sidebar}
            <div className="flex-1 min-w-0 flex flex-col lg:overflow-hidden">
                <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] pb-3.5 sm:py-4 sticky top-0 z-30 shrink-0 shadow-xs">
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg sm:text-xl font-black flex items-center gap-2.5 text-slate-900 tracking-tight">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                <FileText className="w-4.5 h-4.5" />
                            </div>
                            <span>LAPORAN SHIFT</span>
                        </h1>
                        <div className="flex items-center gap-3">
                            <CustomUserButton />
                        </div>
                    </div>
                </header>

                <div className="flex-1 min-w-0 p-3.5 sm:p-4 md:p-6 space-y-4 pb-32 lg:pb-8 lg:overflow-y-auto touch-pan-y [-webkit-overflow-scrolling:touch]">
                    {/* Header & Date Picker */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-800">Rekonsiliasi Pendapatan Harian</h2>
                                {isToday && (
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold rounded-full">
                                        Hari Ini
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Pantau total kas di laci dan pembayaran digital untuk mencocokkan saldo shift Anda.</p>
                            <p className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDateIndonesian(selectedDate)}
                            </p>
                        </div>

                        {/* Date Navigation Controls */}
                        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-xs">
                                <button
                                    type="button"
                                    onClick={() => changeDateByDays(-1)}
                                    title="Mundur 1 Hari (Kemarin)"
                                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                
                                <div className="relative flex items-center px-1">
                                    <input 
                                        type="date" 
                                        value={selectedDate}
                                        onChange={(e) => {
                                            if (e.target.value) applyDate(e.target.value);
                                        }}
                                        className="py-1 px-2 bg-transparent text-xs sm:text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => changeDateByDays(1)}
                                    title="Maju 1 Hari (Besok)"
                                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {!isToday && (
                                <button
                                    type="button"
                                    onClick={() => applyDate(getTodayStr())}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Kembali ke Hari Ini</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-[0_8px_30px_rgb(59,130,246,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                            <div className="flex items-center gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">Total Pendapatan</p>
                                    <h3 className="text-xl font-black text-slate-800">{formatRupiah(metrics.totalGross)}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-green-100 shadow-[0_8px_30px_rgb(34,197,94,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-0"></div>
                            <div className="flex items-center gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">Tunai (Kas Laci)</p>
                                    <h3 className="text-xl font-black text-slate-800">{formatRupiah(metrics.totalCash)}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">{isRental ? "*Hanya menghitung uang Lunas dan DP masuk. Tidak termasuk sisa piutang." : "*Hanya menghitung transaksi lunas dengan metode Tunai/Cash."}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-[0_8px_30px_rgb(168,85,247,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0"></div>
                            <div className="flex items-center gap-4 relative">
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500">QRIS (Digital)</p>
                                    <h3 className="text-xl font-black text-slate-800">{formatRupiah(metrics.totalQRIS)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Item Terjual */}
                    {Object.keys(soldSummary).length > 0 && (
                        <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-500" />
                                {isRental ? "Ringkasan Armada Disewa" : isPureJasa ? "Ringkasan Layanan" : "Ringkasan Produk Terjual"} ({formatDateIndonesian(selectedDate)})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(soldSummary).map(([name, qty]: any) => (
                                    <div key={name} className="bg-slate-50 border px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
                                        <span className="text-slate-600">{name}</span>
                                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">{qty}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* History Table */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-bold text-sm">Riwayat Transaksi: <span className="text-blue-600 font-semibold">{formatDateIndonesian(selectedDate)}</span></h3>
                        </div>
                        {/* Tampilan Mobile: 1 Layar Penuh Bebas Geser Kiri-Kanan */}
                        <div className="block sm:hidden divide-y divide-slate-100">
                            {(isFetching || (!activeData && !error)) ? (
                                <div className="px-4 py-8 text-center text-slate-500">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                    Memuat data transaksi {formatDateIndonesian(selectedDate)}...
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                    Belum ada transaksi pada {formatDateIndonesian(selectedDate)}.
                                </div>
                            ) : (
                                transactions.map((tx: any) => {
                                    const time = new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
                                    const isCash = tx.method?.toLowerCase() === 'cash' || tx.method?.toLowerCase() === 'tunai';
                                    return (
                                        <div
                                            key={tx.id}
                                            onClick={() => setSelectedTx(tx)}
                                            className="p-3.5 hover:bg-slate-50 active:bg-blue-50/50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                    <span className="font-bold text-slate-800 text-sm truncate max-w-[150px]">
                                                        {tx.customerName || "Pelanggan Umum"}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                        isCash ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {tx.method}
                                                    </span>
                                                    {tx.status === 'partial' && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 shrink-0">
                                                            BELUM LUNAS
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-slate-400" />
                                                        {time} WIB
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-mono text-[11px] text-slate-500 truncate max-w-[110px]">
                                                        #{tx.id.slice(-6)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0 flex items-center gap-2">
                                                <div className="font-black text-sm text-slate-900">
                                                    {formatRupiah(tx.total)}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTx(tx);
                                                    }}
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 active:scale-95 rounded-xl transition-all shrink-0"
                                                    title="Lihat Detail Transaksi"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Tampilan Desktop & Tablet: Full Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 text-xs">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold">Waktu</th>
                                        <th className="px-4 py-3 font-semibold">ID Transaksi</th>
                                        <th className="px-4 py-3 font-semibold">Pelanggan</th>
                                        <th className="px-4 py-3 font-semibold">Metode</th>
                                        <th className="px-4 py-3 font-semibold text-right">Total</th>
                                        <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(isFetching || (!activeData && !error)) ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                                Memuat data transaksi {formatDateIndonesian(selectedDate)}...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                                                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                                Belum ada transaksi pada {formatDateIndonesian(selectedDate)}.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx: any) => {
                                            const time = new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
                                            return (
                                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3">{time} WIB</td>
                                                    <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                                                    <td className="px-4 py-3">{tx.customerName}</td>
                                                    <td className="px-4 py-3 flex gap-1 flex-wrap">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${tx.method === 'cash' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                                            {tx.method}
                                                        </span>
                                                        {tx.status === 'partial' && (
                                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                                                                BELUM LUNAS
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-right text-slate-700">{formatRupiah(tx.total)}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button 
                                                            onClick={() => setSelectedTx(tx)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Lihat Detail"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 border-t bg-slate-50">
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail Transaksi */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedTx(null)}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
                            <h3 className="font-bold text-slate-800">Detail Transaksi <span className="font-mono text-blue-600">{selectedTx.id}</span></h3>
                            <button onClick={() => setSelectedTx(null)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="flex justify-between text-sm mb-4">
                                <span className="text-slate-500">Pelanggan: <span className="font-bold text-slate-700">{selectedTx.customerName}</span></span>
                                <span className="text-slate-500">Waktu: <span className="font-bold text-slate-700">{new Date(selectedTx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })}</span></span>
                            </div>
                            <table className="w-full text-sm text-left mb-2">
                                <thead className="bg-slate-50 text-slate-500 text-xs">
                                    <tr>
                                        <th className="px-3 py-2 font-semibold rounded-l-lg">{itemHeaderLabel}</th>
                                        <th className="px-3 py-2 font-semibold text-center">{isRental ? "Durasi (Hari)" : "Qty"}</th>
                                        <th className="px-3 py-2 font-semibold text-right rounded-r-lg">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedTx.items?.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-3 py-3">
                                                <div className="font-medium text-slate-700">{item.productName || 'Produk Dihapus'}</div>
                                                {item.note && <div className="text-[10px] text-slate-400 mt-0.5">Catatan: {item.note}</div>}
                                            </td>
                                            <td className="px-3 py-3 text-center font-bold text-slate-600">{item.qty}</td>
                                            <td className="px-3 py-3 text-right font-medium text-slate-700">{formatRupiah(item.price * item.qty)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {selectedTx.discount > 0 && (
                                <div className="flex justify-between items-center py-2 text-sm text-red-500">
                                    <span className="font-medium">Diskon</span>
                                    <span className="font-bold">- {formatRupiah(selectedTx.discount)}</span>
                                </div>
                            )}

                            <div className="mt-2 pt-4 border-t flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-600">Total Pembayaran</span>
                                    <span className="text-xl font-black text-blue-600">{formatRupiah(selectedTx.total)}</span>
                                </div>
                                {selectedTx.status === 'partial' && (
                                    <button 
                                        onClick={() => {
                                            if (selectedTx.guarantee) {
                                                if (!window.confirm(`PENTING: Pastikan Anda telah mengembalikan jaminan (${selectedTx.guarantee}) kepada pelanggan. Lanjutkan pelunasan?`)) return;
                                            } else {
                                                if (!window.confirm("Lanjutkan pelunasan transaksi ini?")) return;
                                            }
                                            // TODO: Call API to update status to 'completed'
                                            alert("Simulasi pelunasan berhasil di sisi frontend.");
                                        }}
                                        className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
                                    >
                                        Ubah Status Menjadi Lunas
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
