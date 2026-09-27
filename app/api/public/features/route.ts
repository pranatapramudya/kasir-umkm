import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const data = {
    name: 'PJTech Kasir UMKM',
    tagline: 'Sistem Kasir SaaS Multi-Vertikal #1 untuk UMKM Indonesia',
    price: {
      amount: 990000,
      currency: 'IDR',
      period: 'yearly',
      trialDays: 14
    },
    verticals: [
      {
        id: 'retail',
        name: 'Retail',
        subtypes: ['Toko Kelontong', 'Minimarket', 'Fashion/Butik', 'Aksesoris', 'Elektronik', 'Apotek'],
        keyFeatures: [
          'Multi-varian (ukuran, warna, material)',
          'Barcode/SKU generator & scanner HP',
          'Stok otomatis real-time + alert minimum',
          'Diskon item/struk/happy hour/member',
          'PPN include/exclude + ekspor Jurnal/CSV',
          'Cetak struk & label harga bluetooth 58/80mm',
          'Multi-cabang stok terpusat/per cabang'
        ],
        url: 'https://www.pjtechumkm.com/solusi/retail'
      },
      {
        id: 'fnb',
        name: 'F&B (Makanan & Minuman)',
        subtypes: ['Restoran', 'Kafe/Kopi', 'Warung Makan', 'Bakso/Mie Ayam', 'Ayam Geprek', 'Food Court'],
        keyFeatures: [
          'Manajemen meja visual drag-drop + QR Order',
          'Kitchen Display System (KDS) included - HP/Tablet',
          'Modifier unlimited (pedas, topping, nasi) + resep bahan baku',
          'Split bill fleksibel (item/rata/nominal) + open bill',
          'Integrasi GoFood & GrabFood: Roadmap Q1 2027 (manual input)',
          'Multi-printer: struk kasir, tiket dapur per station, label takeaway',
          'Laporan per kategori: makanan/minuman/ojol'
        ],
        url: 'https://www.pjtechumkm.com/solusi/fnb'
      },
      {
        id: 'jasa',
        name: 'Jasa/Servis',
        subtypes: ['Bengkel Motor/Mobil', 'Laundry Kiloan/Satuan', 'Salon/Barbershop', 'Service AC/Kulkas', 'Service HP/Laptop'],
        keyFeatures: [
          'Booking online via Web/WhatsApp + antrian real-time',
          'Progress tracking: menunggu → dikerjakan → selesai → diambil',
          'Notifikasi WA otomatis (5 trigger: booking, update, panggil, invoice, rating)',
          'Histori servis per pelanggan + foto before/after',
          'Komisi teknisi otomatis (persen/flat per jasa & sparepart)',
          'Sparepart inventaris terpisah: stok, HPP, supplier, pembelian',
          'Slip gaji teknisi otomatis bulanan'
        ],
        url: 'https://www.pjtechumkm.com/solusi/jasa'
      },
      {
        id: 'rental',
        name: 'Rental/Travel/Properti',
        subtypes: ['Rental Mobil/Motor', 'Villa/Apartemen/Kos', 'Travel (Mobil+Supir)', 'Rental Alat (Kamera/Sound/Tenda/Camping)'],
        keyFeatures: [
          'Kalender ketersediaan visual drag-drop (bulan/minggu/hari)',
          'Booking berbasis waktu: per jam/harian/mingguan/bulanan',
          'Deposit & denda keterlambatan otomatis (per jam/hari)',
          'Multi-unit multi-tipe: Sedan/SUV, Kamar/Villa, Alat',
          'Invoice prorata otomatis (booking tengah bulan)',
          'Kontrak digital PDF + e-sign via WA/Email',
          'Checklist kondisi + foto 360° check-in/out'
        ],
        url: 'https://www.pjtechumkm.com/solusi/rental'
      }
    ],
    commonFeatures: [
      'Multi-tenant SaaS: isolasi data total per toko',
      'Role-based access: SUPERADMIN / OWNER / CASHIER / TEKNISI',
      'Laporan: harian/bulanan, stok minim, HPP & laba, pajak PPN',
      'Ekspor CSV untuk Jurnal.id, Accurate, Mekari, Xero',
      'WhatsApp Cloud API (Official) untuk notifikasi',
      'PWA: install di HP, offline-first (IndexedDB sync)',
      'Printer bluetooth 58mm/80mm auto-detect',
      'Backup otomatis harian ke cloud'
    ],
    integrations: [
      'Midtrans / Xendit (Payment Gateway)',
      'WhatsApp Cloud API (Meta Official)',
      'Google Maps (Lokasi toko/booking)',
      'Jurnal.id / Accurate / Mekari / Xero (Accounting)'
    ],
    trustSignals: {
      rating: 4.9,
      reviewCount: 358,
      users: '1000+',
      uptime: '99.9%',
      supportHours: 'Senin-Jumat 09:00-18:00 WIB'
    },
    company: {
      name: 'PJTECH',
      founded: 2024,
      location: 'Indonesia',
      website: 'https://www.pjtechumkm.com',
      contact: {
        email: 'support@pjtechumkm.com',
        whatsapp: '+62-800-000-000'
      }
    },
    lastUpdated: new Date().toISOString()
  };

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}