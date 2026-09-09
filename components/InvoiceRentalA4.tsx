import React from 'react';
import { detectRentalItemType } from '@/lib/business-category';

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

export interface InvoiceRentalA4Props {
  tenantName: string;
  tenantCategory: string;
  tenantPhone?: string;
  user: any;
  transaction: any;
  paperSize?: 'A4' | 'A5';
}

export default function InvoiceRentalA4({
  tenantName,
  tenantCategory,
  tenantPhone,
  user,
  transaction,
  paperSize = 'A4',
}: InvoiceRentalA4Props) {
  if (!transaction) return null;

  const isA5 = paperSize === 'A5';
  const containerWidth = isA5 ? '148mm' : '210mm';

  // Deteksi Tipe Bisnis (Rental Properti, Rental Kendaraan, Jasa Servis)
  const isJasa =
    tenantCategory === 'JASA' ||
    tenantCategory === 'Jasa / Servis' ||
    tenantCategory === 'Jasa/Servis' ||
    Boolean(transaction.serviceDate);

  const detectedType = detectRentalItemType(
    transaction.items?.[0]?.name,
    tenantCategory
  );
  const isProperty =
    transaction.rentalMode === 'property' || (!isJasa && detectedType === 'property');
  const isVehicle = !isJasa && !isProperty;

  // Header Title
  const documentTitle = isProperty
    ? 'INVOICE SEWA PROPERTI & SURAT CHECK-IN'
    : isJasa
    ? 'INVOICE LAYANAN & SURAT PERINTAH KERJA'
    : 'INVOICE SEWA / SURAT JALAN';

  // Durasi / Qty Unit Label
  const getQtyLabel = (qty: number) => {
    if (isProperty) return `${qty} Malam`;
    if (isVehicle) return `${qty} Hari`;
    if (isJasa) return `${qty} Layanan`;
    return `${qty}x`;
  };

  return (
    <div
      className={`bg-white text-black p-6 mx-auto ${
        isA5
          ? 'w-[148mm] min-w-[148mm] max-w-[148mm] print:w-[148mm] print:min-w-[148mm] print:max-w-[148mm]'
          : 'w-[210mm] min-w-[210mm] max-w-[210mm] print:w-[210mm] print:min-w-[210mm] print:max-w-[210mm]'
      } text-xs sm:text-sm font-sans print:block print:m-0 print:p-0 print:shadow-none`}
    >
      <style>{`
        @media print { 
          @page { 
            size: ${isA5 ? 'A5 portrait' : 'A4 portrait'}; 
            margin: 10mm; 
          } 
          html, body { 
            width: ${containerWidth} !important;
            min-width: ${containerWidth} !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          } 
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-5 break-inside-avoid print:break-inside-avoid">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
            {tenantName || 'PJTECH UMKM'}
          </h1>
          {tenantCategory && (
            <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase mt-0.5">
              {tenantCategory}
            </p>
          )}
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Telp: {tenantPhone || '-'}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-lg sm:text-xl font-bold uppercase text-slate-400 tracking-wider mb-1">
            {documentTitle}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            No. TRX: <span className="text-slate-900 font-mono font-bold">{transaction.id}</span>
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Tanggal: {transaction.date} {transaction.time}
          </p>
        </div>
      </div>

      {/* Grid Informasi Penyewa & Detail Reservasi (Dipaksa 2 Kolom di Print) */}
      <div className="grid grid-cols-2 print:grid-cols-2 gap-4 mb-6 print:gap-4 print:w-full print:grid break-inside-avoid print:break-inside-avoid">
        {/* Kolom Kiri: Informasi Customer */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
            {isProperty
              ? 'Informasi Tamu / Penyewa'
              : isJasa
              ? 'Informasi Pelanggan'
              : 'Informasi Penyewa'}
          </h3>
          <table className="w-full text-xs">
            <tbody>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">Nama</td>
                <td className="py-1 font-bold text-slate-900 break-words">: {transaction.customerName || '-'}</td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Kontak / Tamu' : isJasa ? 'Kontak / Catatan' : 'Operator / Supir'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.driverName || '-'}</td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Deposit / Jaminan' : isJasa ? 'Jaminan / Ref' : 'Jaminan (KTP/SIM)'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.guarantee || '-'}</td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Catatan Khusus' : isJasa ? 'Tipe Pengerjaan' : 'Tujuan Perjalanan'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.destination || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kolom Kanan: Detail Reservasi / Layanan */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
            {isProperty
              ? 'Detail Reservasi Kamar / Unit'
              : isJasa
              ? 'Detail Layanan / Pengerjaan'
              : 'Detail Reservasi Armada'}
          </h3>
          <table className="w-full text-xs">
            <tbody>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'No. Kamar / Unit' : isJasa ? 'Kode / Objek Servis' : 'Plat / No. Seri'}
                </td>
                <td className="py-1 font-bold text-blue-700 font-mono break-words">: {transaction.licensePlate || '-'}</td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Check-in' : isJasa ? 'Jadwal Pengerjaan' : 'Mulai Sewa'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">
                  : {isJasa ? (transaction.serviceDate || transaction.date) : (transaction.startDate || '-')}
                </td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Check-out' : isJasa ? 'Status' : 'Selesai Sewa'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">
                  : {isJasa ? 'LUNAS & SELESAI' : (transaction.endDate || '-')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Item Unit / Armada / Layanan */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 break-inside-avoid print:break-inside-avoid">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="px-3.5 py-2.5">
                {isProperty ? 'Nama Kamar / Unit / Layanan' : isJasa ? 'Deskripsi Layanan / Pekerjaan' : 'Nama Unit / Armada / Barang'}
              </th>
              <th className="px-3.5 py-2.5 text-right w-28">Durasi / Qty</th>
              <th className="px-3.5 py-2.5 text-right w-28">Harga Satuan</th>
              <th className="px-3.5 py-2.5 text-right w-32">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transaction.items?.map((item: any, i: number) => (
              <tr key={i} className="break-inside-avoid print:break-inside-avoid hover:bg-slate-50">
                <td className="px-3.5 py-2.5 font-semibold text-slate-800">
                  {item.name}
                  {item.note && <p className="text-[11px] text-slate-500 mt-0.5 italic">* {item.note}</p>}
                </td>
                <td className="px-3.5 py-2.5 text-right text-slate-600 whitespace-nowrap">{getQtyLabel(item.qty)}</td>
                <td className="px-3.5 py-2.5 text-right text-slate-600 whitespace-nowrap">{formatRupiah(item.hargaJual)}</td>
                <td className="px-3.5 py-2.5 text-right font-bold text-slate-800 whitespace-nowrap">
                  {formatRupiah(item.qty * item.hargaJual)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ringkasan Biaya */}
      <div className="flex justify-end mb-6 break-inside-avoid print:break-inside-avoid">
        <div className="w-72 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-600">{isJasa ? 'Total Biaya Layanan' : 'Total Harga Sewa'}</span>
            <span className="font-semibold text-slate-900">{formatRupiah(transaction.total)}</span>
          </div>
          {transaction.downPayment > 0 && (
            <>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Uang Muka (DP)</span>
                <span className="font-semibold text-green-600">-{formatRupiah(transaction.downPayment)}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200 mt-1.5 pt-1.5">
                <span className="text-slate-800 font-bold">Sisa Tagihan</span>
                <span className="font-black text-red-600">{formatRupiah(transaction.remainingBalance || 0)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between py-1.5 border-t border-slate-200 mt-1.5 pt-1.5 items-center">
            <span className="text-slate-800 font-bold">Total Bayar</span>
            <span className="font-black text-blue-700 text-base">
              {formatRupiah(transaction.downPayment > 0 ? transaction.downPayment : transaction.total)}
            </span>
          </div>
          <div className="flex justify-between py-1 mt-0.5 items-center">
            <span className="text-slate-500 text-[11px]">Metode Pembayaran</span>
            <span className="font-bold text-[11px] uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-800">
              {transaction.method}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Tanda Tangan */}
      <div className="flex justify-between px-10 mt-8 pt-4 border-t border-slate-200 break-inside-avoid print:break-inside-avoid text-xs">
        <div className="text-center">
          <p className="text-slate-500 mb-14">
            {isProperty ? 'Tamu / Penyewa' : isJasa ? 'Pelanggan / Penerima Layanan' : 'Penyewa / Operator'}
          </p>
          <p className="font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-0.5 uppercase">
            {transaction.customerName || '............................'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-14">
            {isProperty ? 'Resepsionis / Pengelola' : isJasa ? 'Teknisi / Admin Kasir' : 'Admin / Petugas Kasir'}
          </p>
          <p className="font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-0.5 uppercase">
            {user?.fullName || user?.firstName || 'Admin Kasir'}
          </p>
        </div>
      </div>

      {/* Catatan & Ketentuan */}
      <div className="text-center mt-6 text-[10px] text-slate-400 break-inside-avoid print:break-inside-avoid">
        {isProperty ? (
          <>
            <p>Terima kasih telah menginap dan mempercayakan kenyamanan Anda bersama kami.</p>
            <p>Harap menjaga kebersihan dan fasilitas unit selama masa tinggal. Check-out tepat waktu sesuai jadwal.</p>
          </>
        ) : isJasa ? (
          <>
            <p>Terima kasih atas kepercayaan Anda menggunakan layanan jasa kami.</p>
            <p>Harap periksa hasil pengerjaan sebelum meninggalkan lokasi. Garansi berlaku sesuai ketentuan yang disepakati.</p>
          </>
        ) : (
          <>
            <p>Terima kasih telah mempercayakan perjalanan Anda kepada kami.</p>
            <p>Harap periksa kondisi kendaraan sebelum dibawa. Segala kerusakan setelah serah terima menjadi tanggung jawab penyewa.</p>
          </>
        )}
      </div>
    </div>
  );
}
