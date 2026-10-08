export interface TaxExportRow {
  tanggal: string;
  nomorTransaksi: string;
  namaPelanggan: string;
  metodePembayaran: string;
  total: number;
  pajak: number;
  subtotal: number;
  items: string;
  kategoriUsaha: string;
}

export interface TaxExportSummary {
  periode: string;
  totalTransaksi: number;
  totalPenjualan: number;
  totalPajak: number;
  totalTunai: number;
  totalQRIS: number;
  byCategory: Record<string, { count: number; total: number; pajak: number }>;
  byPaymentMethod: Record<string, { count: number; total: number }>;
}

export function calculatePPN(subtotal: number, rate = 0.11): number {
  return Math.round(subtotal * rate);
}

/**
 * Memformat daftar item transaksi menjadi teks ringkas yang rapi untuk Excel
 */
export function formatItemsSummary(itemsRaw: any): string {
  if (!itemsRaw) return '-';
  try {
    const items = typeof itemsRaw === 'string' ? JSON.parse(itemsRaw) : itemsRaw;
    if (Array.isArray(items) && items.length > 0) {
      return items.map((i: any) => {
        const name = i.name || i.nama || 'Item';
        const qty = i.qty || 1;
        const price = Number(i.price || i.harga || 0).toLocaleString('id-ID');
        return name + ' (' + qty + 'x Rp' + price + ')';
      }).join('; ');
    }
  } catch {
    // fallback jika parsing gagal
  }
  return typeof itemsRaw === 'string' ? itemsRaw : '-';
}

export function generateTaxExportRows(transactions: any[], kategoriUsaha: string): TaxExportRow[] {
  return transactions.map(tx => {
    const items = tx.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + ((item.price || 0) * (item.qty || 1)), 0);
    const pajak = calculatePPN(subtotal);
    
    return {
      tanggal: tx.date,
      nomorTransaksi: tx.id,
      namaPelanggan: tx.customerName || 'Pelanggan Umum',
      metodePembayaran: tx.method === 'cash' ? 'TUNAI' : 'QRIS',
      total: tx.total || (subtotal + pajak),
      pajak,
      subtotal: subtotal,
      items: JSON.stringify(items.map((i: any) => ({
        nama: i.name || i.nama || 'Item',
        qty: i.qty || 1,
        harga: i.price || i.harga || 0,
        kategori: i.category || 'Umum',
      }))),
      kategoriUsaha: kategoriUsaha || 'UMUM',
    };
  });
}

export function generateTaxSummary(rows: TaxExportRow[], periode: string): TaxExportSummary {
  const byCategory: Record<string, { count: number; total: number; pajak: number }> = {};
  const paymentMethods: Record<string, { count: number; total: number }> = {};
  
  let totalPenjualan = 0;
  let totalPajak = 0;
  let totalTunai = 0;
  let totalQRIS = 0;

  rows.forEach(row => {
    totalPenjualan += row.total;
    totalPajak += row.pajak;
    
    if (row.metodePembayaran === 'TUNAI') totalTunai += row.total;
    else totalQRIS += row.total;
    
    try {
      const items = JSON.parse(row.items);
      items.forEach((item: any) => {
        const cat = item.kategori || 'Umum';
        if (!byCategory[cat]) byCategory[cat] = { count: 0, total: 0, pajak: 0 };
        byCategory[cat].count += item.qty || 1;
        byCategory[cat].total += (item.harga || 0) * (item.qty || 1);
        byCategory[cat].pajak += calculatePPN((item.harga || 0) * (item.qty || 1));
      });
    } catch {}
    
    const pm = row.metodePembayaran;
    if (!paymentMethods[pm]) paymentMethods[pm] = { count: 0, total: 0 };
    paymentMethods[pm].count += 1;
    paymentMethods[pm].total += row.total;
  });
  
  return {
    periode,
    totalTransaksi: rows.length,
    totalPenjualan,
    totalPajak,
    totalTunai,
    totalQRIS,
    byCategory,
    byPaymentMethod: paymentMethods,
  };
}

function triggerCSVDownload(csvContent: string, filename: string) {
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportToCSV(rows: TaxExportRow[], filename: string) {
  const headers = [
    'Tanggal',
    'Nomor Transaksi',
    'Nama Pelanggan',
    'Kategori Usaha',
    'Rincian Item',
    'Subtotal DPP (Rp)',
    'Tarif PPN',
    'Nilai PPN 11% (Rp)',
    'Total Transaksi (Rp)',
    'Metode Pembayaran',
  ];
  
  const csvRows = [
    headers.join(','),
    ...rows.map(row => {
      const cleanItems = formatItemsSummary(row.items);
      const safeCustomer = (row.namaPelanggan || 'Pelanggan').replace(/"/g, '""');
      const safeItems = cleanItems.replace(/"/g, '""');
      return [
        '"' + row.tanggal + '"',
        '"' + row.nomorTransaksi + '"',
        '"' + safeCustomer + '"',
        '"' + row.kategoriUsaha + '"',
        '"' + safeItems + '"',
        row.subtotal,
        '"11%"',
        row.pajak,
        row.total,
        '"' + row.metodePembayaran + '"',
      ].join(',');
    }),
  ].join(String.fromCharCode(10));
  
  triggerCSVDownload(csvRows, filename);
}

export function exportSummaryToCSV(summary: TaxExportSummary, filename: string, tenantName = 'Usaha') {
  const lines: string[] = [];
  
  lines.push('REKAPITULASI LAPORAN PAJAK UMKM');
  lines.push('Nama Usaha,"' + tenantName + '"');
  lines.push('Periode,"' + summary.periode + '"');
  lines.push('');
  lines.push('RINGKASAN EKSEKUTIF');
  lines.push('Indikator,Nilai');
  lines.push('Total Transaksi,' + summary.totalTransaksi);
  lines.push('Total Penjualan Kotor (Rp),' + summary.totalPenjualan);
  lines.push('Dasar Pengenaan Pajak / DPP (Rp),' + summary.totalPenjualan);
  lines.push('Total Estimasi PPN 11% (Rp),' + summary.totalPajak);
  lines.push('Total Pembayaran Tunai (Rp),' + summary.totalTunai);
  lines.push('Total Pembayaran QRIS / Non-Tunai (Rp),' + summary.totalQRIS);
  lines.push('');
  
  lines.push('RINCIAN PENJUALAN PER KATEGORI');
  lines.push('Kategori Produk,Jumlah Item Terjual,Total Omzet (Rp),PPN 11% (Rp)');
  Object.entries(summary.byCategory).forEach(([cat, data]) => {
    lines.push('"' + cat + '",' + data.count + ',' + data.total + ',' + data.pajak);
  });
  lines.push('');
  
  lines.push('RINCIAN METODE PEMBAYARAN');
  lines.push('Metode Pembayaran,Jumlah Transaksi,Total Nilai (Rp)');
  Object.entries(summary.byPaymentMethod).forEach(([method, data]) => {
    lines.push('"' + method + '",' + data.count + ',' + data.total);
  });
  lines.push('');
  lines.push('Catatan: PPN dihitung otomatis 11% dari nilai Dasar Pengenaan Pajak (DPP). Format tanggal DD/MM/YYYY.');
  
  const csv = lines.join(String.fromCharCode(10));
  triggerCSVDownload(csv, filename);
}

export function formatJurnalCSV(rows: TaxExportRow[]): string {
  const lines: string[] = [];
  lines.push('Tanggal,No Bukti,Akun Debit,Akun Kredit,Jumlah,Keterangan,Kontak');
  
  rows.forEach(row => {
    let items: any[] = [];
    try {
      items = JSON.parse(row.items);
    } catch {
      items = [{ nama: 'Produk/Layanan', qty: 1, harga: row.subtotal }];
    }

    const safeCustomer = (row.namaPelanggan || 'Pelanggan').replace(/"/g, '""');

    // 1. Akun Penjualan (DPP)
    items.forEach((item: any) => {
      const lineSubtotal = (item.harga || 0) * (item.qty || 1);
      const safeItemName = (item.nama || item.name || 'Produk').replace(/"/g, '""');
      lines.push([
        '"' + row.tanggal + '"',
        '"' + row.nomorTransaksi + '"',
        '"Piutang Usaha"',
        '"Penjualan"',
        lineSubtotal,
        '"Penjualan ' + safeItemName + ' x' + (item.qty || 1) + ' - ' + safeCustomer + '"',
        '"' + safeCustomer + '"',
      ].join(','));
    });
    
    // 2. Akun PPN Keluaran
    if (row.pajak > 0) {
      lines.push([
        '"' + row.tanggal + '"',
        '"' + row.nomorTransaksi + '-PPN"',
        '"Piutang Usaha"',
        '"Utang PPN Keluaran"',
        row.pajak,
        '"PPN 11% - ' + row.nomorTransaksi + '"',
        '"' + safeCustomer + '"',
      ].join(','));
    }
    
    // 3. Akun Pelunasan Kas / Bank
    const akunKas = row.metodePembayaran === 'TUNAI' ? '"Kas Toko"' : '"Bank QRIS"';
    lines.push([
      '"' + row.tanggal + '"',
      '"' + row.nomorTransaksi + '-BAYAR"',
      akunKas,
      '"Piutang Usaha"',
      row.total,
      '"Pelunasan ' + row.metodePembayaran + ' - ' + row.nomorTransaksi + '"',
      '"' + safeCustomer + '"',
    ].join(','));
  });
  
  return lines.join(String.fromCharCode(10));
}

export function downloadJurnalCSV(transactions: any[], kategoriUsaha: string, filename: string) {
  const rows = generateTaxExportRows(transactions, kategoriUsaha);
  const csv = formatJurnalCSV(rows);
  triggerCSVDownload(csv, filename);
}

export function downloadTaxTemplate(formatType: 'detail' | 'summary' | 'jurnal', tenantName = 'Usaha Anda', kategoriUsaha = 'RETAIL') {
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dStr = pad(today.getDate()) + '/' + pad(today.getMonth() + 1) + '/' + today.getFullYear();
  
  if (formatType === 'detail') {
    const sampleRows: TaxExportRow[] = [
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-001',
        namaPelanggan: 'Budi Santoso',
        metodePembayaran: 'QRIS',
        subtotal: 500000,
        pajak: 55000,
        total: 555000,
        items: JSON.stringify([{ nama: 'Paket Sewa Armada / Produk Utama', qty: 1, harga: 500000, kategori: 'Armada' }]),
        kategoriUsaha: kategoriUsaha,
      },
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-002',
        namaPelanggan: 'Siti Rahmawati',
        metodePembayaran: 'TUNAI',
        subtotal: 180000,
        pajak: 19800,
        total: 199800,
        items: JSON.stringify([
          { nama: 'Layanan Ekstra / Add-on A', qty: 2, harga: 50000, kategori: 'Layanan' },
          { nama: 'Konsumsi / Merchandise B', qty: 1, harga: 80000, kategori: 'F&B' }
        ]),
        kategoriUsaha: kategoriUsaha,
      },
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-003',
        namaPelanggan: 'PT Solusi Pratama',
        metodePembayaran: 'QRIS',
        subtotal: 1200000,
        pajak: 132000,
        total: 1332000,
        items: JSON.stringify([{ nama: 'Sewa Harian Premium', qty: 2, harga: 600000, kategori: 'Armada' }]),
        kategoriUsaha: kategoriUsaha,
      },
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-004',
        namaPelanggan: 'Ahmad Faisal',
        metodePembayaran: 'TUNAI',
        subtotal: 250000,
        pajak: 27500,
        total: 277500,
        items: JSON.stringify([{ nama: 'Jasa Servis & Perawatan', qty: 1, harga: 250000, kategori: 'Jasa' }]),
        kategoriUsaha: kategoriUsaha,
      },
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-005',
        namaPelanggan: 'Dewi Lestari',
        metodePembayaran: 'QRIS',
        subtotal: 350000,
        pajak: 38500,
        total: 388500,
        items: JSON.stringify([{ nama: 'Paket Tiket / Voucher Wisata', qty: 1, harga: 350000, kategori: 'Wisata' }]),
        kategoriUsaha: kategoriUsaha,
      },
    ];
    exportToCSV(sampleRows, 'Template_Laporan_Pajak_Detail_' + kategoriUsaha + '.csv');
  } else if (formatType === 'summary') {
    const sampleSummary: TaxExportSummary = {
      periode: '01/' + pad(today.getMonth() + 1) + '/' + today.getFullYear() + ' - ' + dStr,
      totalTransaksi: 5,
      totalPenjualan: 2750000,
      totalPajak: 302500,
      totalTunai: 477300,
      totalQRIS: 2272700,
      byCategory: {
        'Armada / Unit Utama': { count: 3, total: 1700000, pajak: 187000 },
        'Layanan & Jasa': { count: 3, total: 350000, pajak: 38500 },
        'Konsumsi & Lainnya': { count: 2, total: 430000, pajak: 47300 },
        'Paket Wisata': { count: 1, total: 350000, pajak: 38500 },
      },
      byPaymentMethod: {
        'TUNAI': { count: 2, total: 477300 },
        'QRIS': { count: 3, total: 2272700 },
      },
    };
    exportSummaryToCSV(sampleSummary, 'Template_Laporan_Pajak_Ringkasan_' + kategoriUsaha + '.csv', tenantName);
  } else if (formatType === 'jurnal') {
    const sampleRows: TaxExportRow[] = [
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-001',
        namaPelanggan: 'Budi Santoso',
        metodePembayaran: 'QRIS',
        subtotal: 500000,
        pajak: 55000,
        total: 555000,
        items: JSON.stringify([{ nama: 'Paket Sewa Armada', qty: 1, harga: 500000, kategori: 'Armada' }]),
        kategoriUsaha: kategoriUsaha,
      },
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-002',
        namaPelanggan: 'Siti Rahmawati',
        metodePembayaran: 'TUNAI',
        subtotal: 180000,
        pajak: 19800,
        total: 199800,
        items: JSON.stringify([{ nama: 'Layanan Ekstra', qty: 1, harga: 180000, kategori: 'Layanan' }]),
        kategoriUsaha: kategoriUsaha,
      },
      {
        tanggal: dStr,
        nomorTransaksi: 'TRX-SAMPLE-003',
        namaPelanggan: 'PT Solusi Pratama',
        metodePembayaran: 'QRIS',
        subtotal: 1200000,
        pajak: 132000,
        total: 1332000,
        items: JSON.stringify([{ nama: 'Sewa Unit Eksekutif', qty: 2, harga: 600000, kategori: 'Armada' }]),
        kategoriUsaha: kategoriUsaha,
      },
    ];
    const csv = formatJurnalCSV(sampleRows);
    triggerCSVDownload(csv, 'Template_Jurnal_Akuntansi_' + kategoriUsaha + '.csv');
  }
}
