export interface TaxExportRow {
  tanggal: string;
  nomorTransaksi: string;
  namaPelanggan: string;
  metodePembayaran: string;
  total: number;
  pajak: number;
  subtotal: number;
  items: string; // JSON string of items
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

export function generateTaxExportRows(transactions: any[], kategoriUsaha: string): TaxExportRow[] {
  return transactions.map(tx => {
    const items = tx.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
    const pajak = calculatePPN(subtotal);
    
    return {
      tanggal: tx.date,
      nomorTransaksi: tx.id,
      namaPelanggan: tx.customerName || 'Walk-in Customer',
      metodePembayaran: tx.method === 'cash' ? 'TUNAI' : 'QRIS',
      total: tx.total,
      pajak,
      subtotal: subtotal,
      items: JSON.stringify(items.map((i: any) => ({
        nama: i.name,
        qty: i.qty,
        harga: i.price,
        kategori: i.category,
      }))),
      kategoriUsaha,
    };
  });
}

export function generateTaxSummary(rows: TaxExportRow[], periode: string): TaxExportSummary {
  const byCategory: Record<string, { count: number; total: number; pajak: number }> = {};
  const byPaymentMethod: Record<string, { count: number; total: number }> = {};
  
  let totalPenjualan = 0;
  let totalPajak = 0;
  let totalTunai = 0;
  let totalQRIS = 0;
  
  rows.forEach(row => {
    totalPenjualan += row.total;
    totalPajak += row.pajak;
    
    if (row.metodePembayaran === 'TUNAI') totalTunai += row.total;
    else totalQRIS += row.total;
    
    // By category (from items)
    try {
      const items = JSON.parse(row.items);
      items.forEach((item: any) => {
        const cat = item.kategori || 'Umum';
        if (!byCategory[cat]) byCategory[cat] = { count: 0, total: 0, pajak: 0 };
        byCategory[cat].count += item.qty;
        byCategory[cat].total += item.harga * item.qty;
        byCategory[cat].pajak += calculatePPN(item.harga * item.qty);
      });
    } catch {}
    
    // By payment method
    const pm = row.metodePembayaran;
    if (!byPaymentMethod[pm]) byPaymentMethod[pm] = { count: 0, total: 0 };
    byPaymentMethod[pm].count += 1;
    byPaymentMethod[pm].total += row.total;
  });
  
  return {
    periode,
    totalTransaksi: rows.length,
    totalPenjualan,
    totalPajak,
    totalTunai,
    totalQRIS,
    byCategory,
    byPaymentMethod,
  };
}

export function exportToCSV(rows: TaxExportRow[], filename: string) {
  const headers = [
    'Tanggal',
    'Nomor Transaksi',
    'Nama Pelanggan',
    'Metode Pembayaran',
    'Subtotal',
    'Pajak (PPN 11%)',
    'Total',
    'Items (JSON)',
    'Kategori Usaha',
  ];
  
  const csvRows = [
    headers.join(','),
    ...rows.map(row => [
      `"${row.tanggal}"`,
      `"${row.nomorTransaksi}"`,
      `"${row.namaPelanggan}"`,
      `"${row.metodePembayaran}"`,
      row.subtotal,
      row.pajak,
      row.total,
      `"${row.items.replace(/"/g, '""')}"`,
      `"${row.kategoriUsaha}"`,
    ].join(',')),
  ].join('\n');
  
  const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportSummaryToCSV(summary: TaxExportSummary, filename: string) {
  const lines: string[] = [];
  
  lines.push('RINGKASAN LAPORAN PAJAK');
  lines.push(`Periode,${summary.periode}`);
  lines.push(`Total Transaksi,${summary.totalTransaksi}`);
  lines.push(`Total Penjualan,${summary.totalPenjualan}`);
  lines.push(`Total PPN (11%),${summary.totalPajak}`);
  lines.push(`Total Tunai,${summary.totalTunai}`);
  lines.push(`Total QRIS,${summary.totalQRIS}`);
  lines.push('');
  
  lines.push('PER KATEGORI');
  lines.push('Kategori,Jumlah Item,Total Penjualan,PPN');
  Object.entries(summary.byCategory).forEach(([cat, data]) => {
    lines.push(`"${cat}",${data.count},${data.total},${data.pajak}`);
  });
  lines.push('');
  
  lines.push('PER METODE PEMBAYARAN');
  lines.push('Metode,Jumlah Transaksi,Total');
  Object.entries(summary.byPaymentMethod).forEach(([method, data]) => {
    lines.push(`"${method}",${data.count},${data.total}`);
  });
  
  const csv = lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function formatJurnalCSV(rows: TaxExportRow[]): string {
  // Format untuk Jurnal.id / Mekari / Accurate
  // Kolom: Tanggal, No Bukti, Akun Debit, Akun Kredit, Jumlah, Keterangan
  const lines: string[] = [];
  lines.push('Tanggal,No Bukti,Akun Debit,Akun Kredit,Jumlah,Keterangan');
  
  rows.forEach(row => {
    const items = JSON.parse(row.items);
    items.forEach((item: any) => {
      lines.push([
        `"${row.tanggal}"`,
        `"${row.nomorTransaksi}"`,
        '"Piutang Dagang"', // Debit
        '"Penjualan"',       // Kredit
        item.harga * item.qty,
        `"Penjualan ${item.nama} x${item.qty} - ${row.namaPelanggan}"`,
      ].join(','));
    });
    
    // PPN entry
    if (row.pajak > 0) {
      lines.push([
        `"${row.tanggal}"`,
        `"${row.nomorTransaksi}-PPN"`,
        '"Piutang Dagang"',
        '"Pajak Masukan/PPN Keluaran"',
        row.pajak,
        `"PPN 11% - ${row.nomorTransaksi}"`,
      ].join(','));
    }
    
    // Kas/Bank entry
    const akunKas = row.metodePembayaran === 'TUNAI' ? '"Kas"' : '"Bank"';
    lines.push([
      `"${row.tanggal}"`,
      `"${row.nomorTransaksi}-BAYAR"`,
      akunKas,
      '"Piutang Dagang"',
      row.total,
      `"Pembayaran ${row.metodePembayaran} - ${row.nomorTransaksi}"`,
    ].join(','));
  });
  
  return lines.join('\n');
}

export function downloadJurnalCSV(transactions: any[], kategoriUsaha: string, filename: string) {
  const rows = generateTaxExportRows(transactions, kategoriUsaha);
  const csv = formatJurnalCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}