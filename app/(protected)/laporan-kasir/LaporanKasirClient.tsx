"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';
import { Store, Calendar, Wallet, CreditCard, Clock, FileText, Eye, X, Package, Loader2 } from 'lucide-react';
import { CustomUserButton } from '@/components/CustomUserButton';
import { Pagination } from '@/components/Pagination';
import { isRentalTravelCategory } from '@/lib/business-category';


export default function LaporanKasirClient({ sidebar, initialDate, initialData, tenantCategory }: any) {
    const isRental = isRentalTravelCategory(tenantCategory);
    const isJasa = tenantCategory === 'Jasa / Servis' || tenantCategory === 'JASA';
    const isFNB = tenantCategory === 'F&B / Kuliner' || tenantCategory === 'FNB' || tenantCategory === 'F&B';
    const isRetail = tenantCategory === 'Retail / Dagang' || tenantCategory === 'RETAIL';
    const itemHeaderLabel = isRental ? "Armada / Layanan" : isJasa ? "Layanan" : isFNB ? "Menu" : isRetail ? "Produk / Barang" : "Item";
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTx, setSelectedTx] = useState<any>(null);

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
    
    const { data, error, isLoading } = useSWR(queryUrl && currentTenantId ? [queryUrl, currentTenantId as string] : null, fetcher, { 
        fallbackData: isInitialParams ? initialData : undefined,
        keepPreviousData: true
    });

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

    const handleDateChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDate = formData.get('date') as string;
        if (newDate) {
            setSelectedDate(newDate);
            setCurrentPage(1); // Reset page on date change
        }
    };

    const transactions = data?.transactions || [];
    const metrics = data?.metrics || { totalGross: 0, totalCash: 0, totalQRIS: 0 };
    const totalPages = data?.totalPages || 1;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden text-slate-900">
            {sidebar}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white border-b p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-black flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            LAPORAN SHIFT
                        </h1>
                        <div className="flex items-center gap-3">
                            <CustomUserButton />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {/* Header & Date Picker */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border shadow-sm">
                        <div>
                            <h2 className="text-lg font-bold">Rekonsiliasi Pendapatan Harian</h2>
                            <p className="text-xs text-gray-500">Pantau total kas di laci dan pembayaran digital untuk mencocokkan saldo shift Anda.</p>
                        </div>
                        <form onSubmit={handleDateChange} className="flex items-center gap-2">
                            <div className="relative">
                                <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="date" 
                                    name="date"
                                    defaultValue={selectedDate}
                                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-sm border-0 transition-all duration-200 ease-in-out rounded-lg">
                                Terapkan
                            </button>
                        </form>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-[0_8px_30px_rgb(59,130,246,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                            <div className="flex items-center gap-4 relative z-10">
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
                            <div className="flex items-center gap-4 relative z-10">
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
                            <div className="flex items-center gap-4 relative z-10">
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
                    {Object.keys(data?.soldSummary || initialData?.soldSummary || {}).length > 0 && (
                        <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col">
                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-500" />
                                {isRental ? "Ringkasan Armada Disewa Hari Ini" : isJasa ? "Ringkasan Layanan Hari Ini" : "Ringkasan Produk Terjual Hari Ini"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(data?.soldSummary || initialData?.soldSummary || {}).map(([name, qty]: any) => (
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
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-sm">Riwayat Transaksi Harian</h3>
                        </div>
                        <div className="overflow-x-auto">
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
                                    {(!data && !error) ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                                Memuat data transaksi...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                                                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                                Belum ada transaksi pada tanggal ini.
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
