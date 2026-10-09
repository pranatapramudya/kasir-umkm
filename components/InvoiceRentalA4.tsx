import React from 'react';
import { detectRentalItemType } from '@/lib/business-category';

const formatRupiah = (num: any) => {
  const val = Number(num);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(isNaN(val) ? 0 : val);
};

const formatDisplayDate = (val?: string | null, fallbackTime?: string | null) => {
  if (!val) return '-';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dateStr = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    if (val.includes('T') || val.includes(':')) {
      const hours = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      return `${dateStr}, ${hours}:${mins} WIB`;
    }
    if (fallbackTime) {
      return `${dateStr}, ${fallbackTime} WIB`;
    }
    return dateStr;
  } catch {
    return val;
  }
};

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

  // Deteksi Tipe Bisnis (Rental Properti, Rental Kendaraan, Rental Alat/Barang, Jasa Servis)
  const isJasa =
    tenantCategory === 'JASA' ||
    tenantCategory === 'Jasa / Servis' ||
    tenantCategory === 'Jasa/Servis' ||
    Boolean(transaction.serviceDate);

  const detectedType = detectRentalItemType(
    transaction.items?.[0]?.name,
    transaction.items?.[0]?.description,
    tenantCategory
  );
  const isProperty =
    transaction.rentalMode === 'property' || (!isJasa && detectedType === 'property');
  const isEquipment =
    transaction.rentalMode === 'equipment' || (!isJasa && detectedType === 'equipment');
  const isVehicle = !isJasa && !isProperty && !isEquipment;

  // Deteksi Status Lunas vs Belum Lunas (DP)
  const isPaidOff = !transaction.remainingBalance || transaction.remainingBalance <= 0;

  // Header Title Dinamis: INVOICE RESMI (Lunas) vs TANDA TERIMA DP & SURAT JALAN (Belum Lunas)
  const documentTitle = isPaidOff
    ? (isProperty
        ? 'INVOICE RESMI SEWA PROPERTI & CHECK-IN'
        : isEquipment
          ? 'INVOICE RESMI SEWA ALAT'
          : isJasa
            ? 'INVOICE RESMI LAYANAN JASA'
            : 'INVOICE RESMI SEWA KENDARAAN')
    : (isProperty
        ? 'TANDA TERIMA DP & SURAT CHECK-IN'
        : isEquipment
          ? 'TANDA TERIMA DP & BUKTI PINJAM ALAT'
          : isJasa
            ? 'SURAT PERINTAH KERJA & TANDA TERIMA DP'
            : 'SURAT JALAN & TANDA TERIMA DP');

  // Durasi / Qty Unit Label
  const getQtyLabel = (qty: number) => {
    if (isProperty) return `${qty} Malam`;
    if (isEquipment) return `${qty} Hari`;
    if (isVehicle) return `${qty} Hari`;
    if (isJasa) return `${qty} Layanan`;
    return `${qty}x`;
  };

  return (
    <div
      id="invoice-a4-print-target"
      className={`bg-white text-black p-6 mx-auto ${isA5
          ? 'w-[148mm] min-w-[148mm] max-w-[148mm] print:w-[148mm] print:min-w-[148mm] print:max-w-[148mm]'
          : 'w-[210mm] min-w-[210mm] max-w-[210mm] print:w-[210mm] print:min-w-[210mm] print:max-w-[210mm]'
        } text-xs font-sans print:block print:m-0 print:p-0 print:shadow-none box-border print:box-border`}
    >
      <style>{`
        @media print { 
          @page { 
            size: ${isA5 ? 'A5 portrait' : 'A4 portrait'}; 
            margin: ${isA5 ? '6mm' : '8mm'}; 
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
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3 mb-4 break-inside-avoid print:break-inside-avoid">
        <div>
          <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
            {tenantName || 'PJTECH UMKM'}
          </h1>
          {tenantCategory && (
            <p className="text-xs font-bold text-slate-600 uppercase mt-0.5">
              {tenantCategory}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Telp: {tenantPhone || '-'}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-800 tracking-wider mb-1">
            {documentTitle}
          </h2>
          <div className="mb-1.5">
            {isPaidOff ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-100 text-emerald-800 border-2 border-emerald-500 uppercase tracking-wider">
                ✓ LUNAS (PAID)
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-rose-100 text-rose-800 border-2 border-rose-500 uppercase tracking-wider animate-pulse">
                ⚠️ BELUM LUNAS (DP)
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-700">
            No. TRX: <span className="text-slate-900 font-mono font-bold">{transaction.id}</span>
          </p>
          <p className="text-xs text-slate-500">
            Tanggal: {transaction.date || formatDisplayDate(transaction.startDate)} {transaction.time || ''}
          </p>
        </div>
      </div>

      {/* Grid Informasi Penyewa & Detail Reservasi (Dipaksa 2 Kolom di Print) */}
      <div className="grid grid-cols-2 print:grid-cols-2 gap-4 mb-3.5 print:gap-4 print:w-full print:grid break-inside-avoid print:break-inside-avoid">
        {/* Kolom Kiri: Informasi Customer */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
            {isProperty
              ? 'Informasi Tamu / Penyewa'
              : isEquipment
                ? 'Informasi Penyewa Alat'
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
                  {isProperty
                    ? 'No. WhatsApp / HP'
                    : isEquipment
                      ? 'No. WhatsApp / HP'
                      : isJasa
                        ? 'Kontak / Catatan'
                        : 'Operator / Supir'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.driverName || '-'}</td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Deposit / Jaminan' : isEquipment ? 'Deposit / Jaminan' : isJasa ? 'Jaminan / Ref' : 'Jaminan (KTP/SIM)'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.guarantee || '-'}</td>
              </tr>
              {transaction.pickupLocation && (
                <tr className="break-inside-avoid print:break-inside-avoid">
                  <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">Titik Jemput</td>
                  <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.pickupLocation}</td>
                </tr>
              )}
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Catatan Khusus' : isEquipment ? 'Kondisi / Catatan' : isJasa ? 'Tipe Pengerjaan' : 'Tujuan Perjalanan'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">: {transaction.dropoffLocation || transaction.destination || (transaction.pickupLocation ? '-' : '-')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kolom Kanan: Detail Reservasi / Layanan */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1.5">
            {isProperty
              ? 'Detail Reservasi Kamar / Unit'
              : isEquipment
                ? 'Detail Peminjaman Alat'
                : isJasa
                  ? 'Detail Layanan / Pengerjaan'
                  : 'Detail Reservasi Armada'}
          </h3>
          <table className="w-full text-xs">
            <tbody>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'No. Kamar / Unit' : isEquipment ? 'Kode / Nama Alat' : isJasa ? 'Kode / Objek Servis' : 'Plat / No. Seri'}
                </td>
                <td className="py-1 font-bold text-blue-700 font-mono break-words">: {transaction.licensePlate || '-'}</td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Check-in' : isEquipment ? 'Tgl Ambil' : isJasa ? 'Jadwal Pengerjaan' : 'Mulai Sewa'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">
                  : {isJasa ? formatDisplayDate(transaction.serviceDate || transaction.date) : formatDisplayDate(transaction.startDate)}
                </td>
              </tr>
              <tr className="break-inside-avoid print:break-inside-avoid">
                <td className="py-1 text-slate-500 w-28 whitespace-nowrap font-medium">
                  {isProperty ? 'Check-out' : isEquipment ? 'Tgl Kembali' : isJasa ? 'Status' : 'Selesai Sewa'}
                </td>
                <td className="py-1 font-semibold text-slate-800 break-words">
                  : {isJasa ? 'LUNAS & SELESAI' : formatDisplayDate(transaction.endDate, transaction.returnTime || '20:00')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Item Unit / Armada / Layanan */}
      <div className="mb-3.5 overflow-hidden rounded-xl border border-slate-200 break-inside-avoid print:break-inside-avoid">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="px-3.5 py-2">
                {isProperty ? 'Nama Kamar / Unit / Layanan' : isEquipment ? 'Nama Alat / Barang / Unit' : isJasa ? 'Deskripsi Layanan / Pekerjaan' : 'Nama Unit / Armada / Barang'}
              </th>
              <th className="px-3.5 py-2 text-right w-28">Durasi / Qty</th>
              <th className="px-3.5 py-2 text-right w-28">Harga Satuan</th>
              <th className="px-3.5 py-2 text-right w-32">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transaction.items?.map((item: any, i: number) => {
              const qty = Number(item.qty || 1);
              const itemPrice = Number(
                item.price ?? 
                item.hargaJual ?? 
                (transaction.total && (!transaction.items || transaction.items.length === 1) ? Math.round(Number(transaction.total) / qty) : 0)
              );
              return (
                <tr key={i} className="break-inside-avoid print:break-inside-avoid hover:bg-slate-50">
                  <td className="px-3.5 py-2 font-semibold text-slate-800">
                    {item.name}
                    {item.note && <p className="text-[11px] text-slate-500 mt-0.5 italic">* {item.note}</p>}
                  </td>
                  <td className="px-3.5 py-2 text-right text-slate-600 whitespace-nowrap">{getQtyLabel(qty)}</td>
                  <td className="px-3.5 py-2 text-right text-slate-600 whitespace-nowrap">{formatRupiah(itemPrice)}</td>
                  <td className="px-3.5 py-2 text-right font-bold text-slate-800 whitespace-nowrap">
                    {formatRupiah(qty * itemPrice)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ringkasan Biaya */}
      <div className="flex justify-end mb-3.5 break-inside-avoid print:break-inside-avoid">
        <div className="w-72 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="flex justify-between py-0.5">
            <span className="text-slate-600">{isJasa ? 'Total Biaya Layanan' : 'Total Harga Sewa'}</span>
            <span className="font-semibold text-slate-900">{formatRupiah(transaction.total)}</span>
          </div>
          {transaction.downPayment > 0 && (
            <>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Uang Muka (DP Diterima)</span>
                <span className="font-semibold text-emerald-600">-{formatRupiah(transaction.downPayment)}</span>
              </div>
              {transaction.remainingBalance > 0 ? (
                <div className="flex justify-between py-1 border-t-2 border-rose-300 mt-1.5 pt-1.5 bg-rose-50/80 px-2 rounded-lg items-center">
                  <span className="text-rose-900 font-extrabold text-[11px] uppercase">SISA BELUM LUNAS:</span>
                  <span className="font-black text-rose-600 text-sm">{formatRupiah(transaction.remainingBalance || 0)}</span>
                </div>
              ) : (
                <div className="flex justify-between py-1 border-t border-emerald-300 mt-1.5 pt-1.5 bg-emerald-50/80 px-2 rounded-lg items-center">
                  <span className="text-emerald-900 font-extrabold text-[11px] uppercase">PELUNASAN SISA:</span>
                  <span className="font-bold text-emerald-700 text-xs">LUNAS ({formatRupiah(Math.max(0, (transaction.total || 0) - (transaction.downPayment || 0)))})</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between py-1 border-t border-slate-200 mt-1 pt-1 items-center">
            <span className="text-slate-800 font-bold">{isPaidOff ? "Total Pembayaran (Lunas)" : "Total Bayar Saat Ini (DP)"}</span>
            <span className="font-black text-blue-700 text-base">
              {formatRupiah(isPaidOff ? (transaction.total || 0) : ((transaction.downPayment && transaction.downPayment > 0) ? transaction.downPayment : (transaction.total || 0)))}
            </span>
          </div>
          <div className="flex justify-between py-0.5 mt-0.5 items-center">
            <span className="text-slate-500 text-[11px]">Metode Pembayaran</span>
            <span className="font-bold text-[11px] uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-800">
              {transaction.method}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Tanda Tangan */}
      <div className="flex justify-between px-10 mt-4 pt-2.5 border-t border-slate-200 break-inside-avoid print:break-inside-avoid text-xs">
        <div className="text-center">
          <p className="text-slate-500 mb-9">
            {isProperty
              ? 'Tamu / Penyewa'
              : isEquipment
                ? 'Penyewa Alat'
                : isJasa
                  ? 'Pelanggan / Penerima Layanan'
                  : 'Penyewa / Pengemudi'}
          </p>
          <p className="font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-0.5 uppercase">
            {transaction.customerName || '............................'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-9">
            {isProperty
              ? 'Resepsionis / Pengelola'
              : isEquipment
                ? 'Petugas / Admin Kasir'
                : isJasa
                  ? 'Teknisi / Admin Kasir'
                  : 'Admin / Petugas Kasir'}
          </p>
          <p className="font-bold text-slate-800 border-b border-slate-800 inline-block px-4 pb-0.5 uppercase">
            {user?.fullName || user?.firstName || 'Admin Kasir'}
          </p>
        </div>
      </div>

      {/* Catatan & Ketentuan */}
      <div className="text-center mt-3.5 text-[9px] text-slate-400 break-inside-avoid print:break-inside-avoid leading-relaxed">
        {isProperty ? (
          <>
            <p>Terima kasih telah menginap dan mempercayakan kenyamanan Anda bersama kami.</p>
            <p>Harap menjaga kebersihan dan fasilitas unit selama masa tinggal. Check-out tepat waktu sesuai jadwal.</p>
          </>
        ) : isEquipment ? (
          <>
            <p>Terima kasih telah mempercayakan kebutuhan sewa peralatan kepada kami.</p>
            <p>Harap menjaga kondisi alat dan mengembalikan tepat waktu beserta seluruh kelengkapannya dalam kondisi baik.</p>
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
