import { Inbox, CheckCircle, XCircle, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PesananOnlinePage() {
  // TODO: Fetch data pesanan dari database (Inbox Orders)
  const dummyOrders = [
    { id: "ORD-001", customer: "Budi Santoso", date: "2026-08-16 10:00", item: "Sewa Kamera DSLR", status: "PENDING", total: "Rp 150.000" },
    { id: "ORD-002", customer: "Siti Aminah", date: "2026-08-16 09:30", item: "Paket Wisata Bali", status: "APPROVED", total: "Rp 1.250.000" },
  ];

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
              Kelola pesanan dan booking yang masuk dari Katalog Online/Slug Toko Anda di sini. Terima (Approve) atau Tolak (Reject) pesanan sebelum dimasukkan ke Kalender Sewa.
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
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dummyOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{order.id}</div>
                    <div className="text-xs text-slate-500">{order.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === "PENDING" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Menunggu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Diterima
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {order.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors tooltip" title="Terima Pesanan">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors tooltip" title="Tolak Pesanan">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dummyOrders.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              Belum ada pesanan masuk hari ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
