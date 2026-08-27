import { prisma } from '@/lib/prisma';
import { AlertCircle } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export default async function AdminTransactionsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return <div>Unauthorized</div>;
  }

  let transactions: any[] = [];
  let hasError = false;

  // 1. Error Handling & Optimalisasi Kueri Database
  try {
    if (prisma.transaction) {
      transactions = await prisma.transaction.findMany({
        where: { userId },
        take: 50, // Batasi 50 transaksi terbaru untuk efisiensi memori
        orderBy: { createdAt: 'desc' }, // Transaksi terbaru muncul di atas
      });
    } else {
      hasError = true;
    }
  } catch (error) {
    console.error("[DB_TRANSACTION_ERROR]:", error);
    hasError = true;
  }

  // Format Rupiah
  const formatRupiah = (num: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Format Tanggal (Indonesia)
  const formatTanggal = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Riwayat Transaksi</h1>
        <p className="text-gray-500 text-sm mt-1">Pantau seluruh aktivitas dan riwayat transaksi bisnis Anda.</p>
      </div>

      {/* Table Area dengan UI Minimalis */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs border-b">
              <tr>
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4 text-center">Metode</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-b">
              {/* Fallback UI: Jika terjadi Error Database */}
              {hasError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-red-500">
                      <AlertCircle className="w-10 h-10 mb-3" />
                      <p className="font-bold text-lg mb-1">Gagal memuat data riwayat transaksi.</p>
                      <p className="text-sm text-gray-500">Koneksi ke database terputus atau skema belum terkonfigurasi dengan benar.</p>
                    </div>
                  </td>
                </tr>
              ) : 
              /* Empty State: Jika array kosong */
              transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">🧾</div>
                      <p className="font-semibold text-lg text-gray-600 mb-1">Belum ada transaksi yang tercatat.</p>
                      <p className="text-sm text-gray-500">Riwayat pesanan akan muncul secara otomatis di sini.</p>
                    </div>
                  </td>
                </tr>
              ) : 
              /* Data View: Merender tabel */
              (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-800">{tx.id}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                        {formatTanggal(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{tx.customerName || "Anonim"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider ${tx.method === 'cash' || tx.method === 'Tunai' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        {tx.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-blue-600">{formatRupiah(tx.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
