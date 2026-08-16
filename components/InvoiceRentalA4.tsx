import React from 'react';

const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export interface InvoiceRentalA4Props {
  tenantName: string;
  tenantCategory: string;
  tenantPhone: string;
  user: any;
  transaction: any;
}

export default function InvoiceRentalA4({
  tenantName,
  tenantCategory,
  tenantPhone,
  user,
  transaction,
}: InvoiceRentalA4Props) {
  if (!transaction) return null;

  return (
    <div className="bg-white text-black p-8 mx-auto w-full max-w-[210mm] text-sm font-sans print:w-[210mm] print:h-[297mm] print:m-0 print:p-8">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight">{tenantName || "PJTECH RENTAL"}</h1>
          {tenantCategory && <p className="text-sm font-bold text-slate-600 uppercase mt-1">{tenantCategory}</p>}
          <p className="text-sm text-slate-500 mt-2">Telp: {tenantPhone || "-"}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-slate-300 tracking-widest mb-2">INVOICE SEWA / SURAT JALAN</h2>
          <p className="text-sm font-semibold text-slate-700">No. TRX: <span className="text-slate-900">{transaction.id}</span></p>
          <p className="text-sm text-slate-500">Tanggal Cetak: {transaction.date} {transaction.time}</p>
        </div>
      </div>

      {/* Informasi Rental & Customer */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3 uppercase text-xs tracking-wider border-b pb-2">Informasi Penyewa</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1 text-slate-500 w-32">Nama Pelanggan</td><td className="py-1 font-semibold">: {transaction.customerName}</td></tr>
              <tr><td className="py-1 text-slate-500">Nama Supir</td><td className="py-1 font-semibold">: {transaction.driverName || "-"}</td></tr>
              <tr><td className="py-1 text-slate-500">Jaminan</td><td className="py-1 font-semibold">: {transaction.guarantee || "-"}</td></tr>
              <tr><td className="py-1 text-slate-500">Tujuan</td><td className="py-1 font-semibold">: {transaction.destination || "-"}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3 uppercase text-xs tracking-wider border-b pb-2">Detail Sewa Kendaraan</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr><td className="py-1 text-slate-500 w-32">Plat Nomor</td><td className="py-1 font-bold text-blue-700">: {transaction.licensePlate || "-"}</td></tr>
              <tr><td className="py-1 text-slate-500">Mulai Sewa</td><td className="py-1 font-semibold">: {transaction.startDate || "-"}</td></tr>
              <tr><td className="py-1 text-slate-500">Selesai Sewa</td><td className="py-1 font-semibold">: {transaction.endDate || "-"}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Item Armada */}
      <div className="mb-8 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-bold">
            <tr>
              <th className="px-4 py-3">Nama Armada / Layanan</th>
              <th className="px-4 py-3 text-right">Durasi (Qty)</th>
              <th className="px-4 py-3 text-right">Harga Satuan</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transaction.items?.map((item: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {item.name}
                  {item.note && <p className="text-xs text-slate-500 mt-1 italic">{item.note}</p>}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">{item.qty} Hari</td>
                <td className="px-4 py-3 text-right text-slate-600">{formatRupiah(item.hargaJual)}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800">{formatRupiah(item.qty * item.hargaJual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ringkasan Biaya */}
      <div className="flex justify-end mb-12">
        <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-slate-600">Total Harga Sewa</span>
            <span className="font-semibold">{formatRupiah(transaction.total)}</span>
          </div>
          {transaction.downPayment > 0 && (
            <>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-slate-600">Uang Muka (DP)</span>
                <span className="font-semibold text-green-600">-{formatRupiah(transaction.downPayment)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm border-t border-slate-200 mt-2 pt-2">
                <span className="text-slate-800 font-bold">Sisa Tagihan</span>
                <span className="font-black text-red-600">{formatRupiah(transaction.remainingBalance || 0)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between py-1 text-sm border-t border-slate-200 mt-2 pt-2">
            <span className="text-slate-800 font-bold">Total Bayar</span>
            <span className="font-black text-blue-700 text-lg">
              {formatRupiah(transaction.downPayment > 0 ? transaction.downPayment : transaction.total)}
            </span>
          </div>
          <div className="flex justify-between py-1 text-sm mt-1">
            <span className="text-slate-500 text-xs">Metode Pembayaran</span>
            <span className="font-bold text-xs uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-700">{transaction.method}</span>
          </div>
        </div>
      </div>

      {/* Footer Tanda Tangan */}
      <div className="flex justify-between px-12 mt-16 pt-8 border-t-2 border-slate-100">
        <div className="text-center">
          <p className="text-slate-500 mb-20 text-sm">Penyewa / Customer</p>
          <p className="font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-1 uppercase">{transaction.customerName || "............................"}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-20 text-sm">Petugas / Admin</p>
          <p className="font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-1 uppercase">{user?.fullName || user?.firstName || 'Admin Kasir'}</p>
        </div>
      </div>
      
      <div className="text-center mt-12 text-xs text-slate-400">
        <p>Terima kasih telah mempercayakan perjalanan Anda kepada kami.</p>
        <p>Harap periksa kondisi kendaraan sebelum dibawa. Segala kerusakan setelah serah terima menjadi tanggung jawab penyewa.</p>
      </div>
    </div>
  );
}
