"use client";

import React, { useState } from "react";
import { Inbox, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { startOrder, rejectOrder, finishOrder, approveOrder } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingItem {
  id: string;
  customerName: string;
  bookingDate: string;
  startDate?: string | null;
  endDate?: string | null;
  itemName: string;
  status: string;
  total: number;
}

export default function InboxClient({ initialOrders, isJasa }: { initialOrders: BookingItem[], isJasa?: boolean }) {
  const [orders, setOrders] = useState<BookingItem[]>(initialOrders);
  const router = useRouter();

  const [finishingOrder, setFinishingOrder] = useState<BookingItem | null>(null);
  const [overtimeFee, setOvertimeFee] = useState<string>("0");
  const [isFinishing, setIsFinishing] = useState(false);

  const handleApprove = async (id: string) => {
    toast.loading("Memproses persetujuan...", { id: "approve" });
    const res = await approveOrder(id);
    if (res.success) {
      toast.success("Pesanan disetujui!", { id: "approve" });
      setOrders(orders.map(o => o.id === id ? { ...o, status: "COMPLETED" } : o));
      router.refresh();
    } else {
      toast.error("Gagal menyetujui pesanan", { id: "approve" });
    }
  };

  const handleStart = async (id: string) => {
    toast.loading("Memulai perjalanan...", { id: "start" });
    const res = await startOrder(id);
    if (res.success) {
      toast.success("Perjalanan dimulai!", { id: "start" });
      setOrders(orders.map(o => o.id === id ? { ...o, status: "IN_PROGRESS" } : o));
      router.refresh();
    } else {
      toast.error("Gagal memulai perjalanan", { id: "start" });
    }
  };

  const handleReject = async (id: string) => {
    toast.loading("Menolak pesanan...", { id: "reject" });
    const res = await rejectOrder(id);
    if (res.success) {
      toast.success("Pesanan berhasil ditolak.", { id: "reject" });
      setOrders(orders.filter(o => o.id !== id));
      router.refresh();
    } else {
      toast.error("Gagal menolak pesanan", { id: "reject" });
    }
  };

  const handleFinishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishingOrder) return;
    setIsFinishing(true);
    const fee = parseInt(overtimeFee.replace(/\D/g, ""), 10) || 0;
    const res = await finishOrder(finishingOrder.id, fee);
    if (res.success) {
      toast.success("Pesanan berhasil diselesaikan dan masuk Riwayat Transaksi.");
      setOrders(orders.filter(o => o.id !== finishingOrder.id));
      setFinishingOrder(null);
      router.refresh();
    } else {
      toast.error("Gagal menyelesaikan pesanan");
    }
    setIsFinishing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 relative">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2 flex items-center gap-2">
              <Inbox className="w-8 h-8 text-indigo-600" />
              Inbox Pesanan Online
            </h1>
            <p className="text-slate-500 max-w-xl text-sm md:text-base">
              Kelola pesanan dan booking yang masuk dari Katalog Online/Slug Toko Anda di sini. Terima (Approve) atau Tolak (Reject) pesanan sebelum dimasukkan ke {isJasa ? "Jadwal Booking" : "Kalender Sewa"}.
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Inbox */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Layanan/Item</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{order.id.slice(0,8)}...</div>
                    <div className="text-xs text-slate-500">
                      {order.status === "PENDING" || order.status === "COMPLETED" ? (
                        <>Jadwal: {new Date(order.bookingDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</>
                      ) : order.status === "IN_PROGRESS" && order.startDate ? (
                        <>Mulai: {new Date(order.startDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</>
                      ) : order.status === "FINISHED" && order.endDate ? (
                        <>Selesai: {new Date(order.endDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</>
                      ) : (
                        new Date(order.bookingDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> {isJasa ? "Menunggu" : "Persiapan"}
                      </span>
                    )}
                    {order.status === "COMPLETED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {isJasa ? "Antrean Aktif" : "Siap Berangkat"}
                      </span>
                    )}
                    {order.status === "IN_PROGRESS" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Sedang Dalam Perjalanan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {order.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleApprove(order.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors tooltip" title={isJasa ? "Terima Pesanan" : "Setujui"}>
                          {isJasa ? "Terima Pesanan" : "Setujui"}
                        </button>
                        <button onClick={() => handleReject(order.id)} className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors tooltip" title="Tolak Pesanan">
                          Tolak
                        </button>
                      </div>
                    )}
                    {order.status === "COMPLETED" && !isJasa && (
                      <button onClick={() => handleStart(order.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors tooltip" title="Mulai Perjalanan/Start">
                        🚀 Mulai Perjalanan / Start
                      </button>
                    )}
                    {order.status === "IN_PROGRESS" && !isJasa && (
                      <button 
                        onClick={() => { setFinishingOrder(order); setOvertimeFee("0"); }} 
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                      >
                        ✅ Tiba di Pool / Finish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              Belum ada pesanan masuk hari ini.
            </div>
          )}
        </div>
      </div>

      {/* Modal Penyelesaian Sewa */}
      {finishingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-800">Penyelesaian Sewa</h2>
              <button onClick={() => setFinishingOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-50 rounded-full">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFinishSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Penyewa</span>
                  <span className="font-semibold text-slate-800">{finishingOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Armada/Layanan</span>
                  <span className="font-semibold text-slate-800">{finishingOrder.itemName}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-700">Total Tagihan Awal</span>
                  <span className="font-bold text-indigo-600">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(finishingOrder.total)}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Biaya Tambahan / Denda Overtime (Opsional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">Rp</span>
                  <input 
                    type="text" 
                    value={overtimeFee}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOvertimeFee(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                    }}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                    placeholder="0"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Isi jika penyewa melebihi batas waktu (overtime) atau ada biaya kerusakan. Kosongkan jika tidak ada.</p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isFinishing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isFinishing && <Loader2 className="w-5 h-5 animate-spin" />}
                  Konfirmasi Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
