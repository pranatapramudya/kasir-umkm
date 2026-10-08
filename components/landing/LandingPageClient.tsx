"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  Store,
  Utensils,
  Wrench,
  Car,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Printer,
  WifiOff,
  FileSpreadsheet,
  Smartphone,
  ChevronDown,
  Receipt,
  Users,
  MessageSquare,
  Check,
  Menu,
  X,
  QrCode,
  Sun,
  Moon,
  ShieldAlert,
  UserCheck,
  Building2
} from "lucide-react";

export default function LandingPageClient() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'retail' | 'fnb' | 'jasa' | 'rental'>('retail');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [installTab, setInstallTab] = useState<'android' | 'ios'>('android');
  const [isTncOpen, setIsTncOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pjtech_landing_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pjtech_landing_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isDark = theme === 'dark';

  const verticals = {
    retail: {
      title: "Retail & Grosir",
      tagline: "Toko Kelontong, Minimarket, Fashion & Butik, Toko Bangunan & Material, ATK/Elektronik",
      description: "Kelola ribuan stok SKU dan multi-varian secara akurat. Transaksi cepat dalam hitungan detik dengan scan barcode kilat dan sistem peringatan stok minim otomatis.",
      icon: Store,
      badgeColor: isDark ? "bg-blue-950/80 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200",
      accentColor: "from-blue-600 to-indigo-600",
      features: [
        { title: "Multi-Varian SKU Rapi", desc: "Kelola varian ukuran (S/M/L/XL), warna, atau spesifikasi dalam satu master produk tanpa kasir bingung." },
        { title: "Scan Barcode Super Kilat", desc: "Dukungan scanner USB, barcode Bluetooth, hingga scan instan lewat kamera HP/tablet kasir." },
        { title: "Peringatan Stok & Auto-Restock", desc: "Notifikasi otomatis saat stok barang mencapai batas minimum agar Anda tidak pernah kehabisan barang dagangan." },
        { title: "Cetak Label Rak & Struk Thermal", desc: "Cetak label harga barcode untuk etalase dan struk belanja pelanggan via printer thermal Bluetooth 58/80mm." }
      ],
      link: "/solusi/retail",
      metrics: { label: "Kecepatan Kasir", value: "3 Detik", sub: "rata-rata per transaksi checkout" },
      screenshot: "/images/showcase/retail-pos-preview.png",
      screenshotMobile: "/images/showcase/retail-pos-mobile.png"
    },
    fnb: {
      title: "F&B & Kuliner (3 Template)",
      tagline: "Kafe & Coffee Shop, Restoran & Rumah Makan, Warung Makan & Fast Food, Bakery",
      description: "Pesanan kilat, monitor dapur rapi, dan HPP resep bahan baku terkendali. Lengkap dengan 3 template Excel siap pakai untuk alur operasional kuliner Anda.",
      icon: Utensils,
      badgeColor: isDark ? "bg-orange-950/80 text-orange-300 border-orange-800" : "bg-orange-50 text-orange-700 border-orange-200",
      accentColor: "from-orange-500 to-amber-600",
      features: [
        { title: "3 Template Excel Kuliner Siap Pakai", desc: "Pilih format Kafe (Kopi/Bar), Resto (Meja & Split Bill), atau Warung Makan (Fast Food Pay-First). Sekali upload langsung jualan." },
        { title: "Kitchen Display System (KDS) Gratis", desc: "Layar monitor dapur interaktif tanpa biaya lisensi tambahan. Dapur memasak lebih cepat dan anti salah pesanan." },
        { title: "Manajemen Meja, Open & Split Bill", desc: "Visualisasi denah meja, pesanan open bill, hingga pisah tagihan (split bill) per pelanggan dengan satu klik." },
        { title: "Resep HPP & Routing Dapur vs Bar", desc: "Stok bahan baku (susu, sirup, beras, daging) otomatis terpotong per porsi dan pesanan minuman otomatis dipisah ke Bar." }
      ],
      link: "/solusi/fnb",
      metrics: { label: "Efisiensi Saji", value: "+45%", sub: "pesanan sampai ke meja lebih cepat" }
    },
    jasa: {
      title: "Jasa & Servis",
      tagline: "Bengkel Motor & Mobil, Laundry Kiloan/Satuan, Salon & Barbershop, Servis HP & Elektronik",
      description: "Bukan sekadar kasir biasa. Pantau antrean pengerjaan servis secara real-time dan kirim notifikasi update status otomatis via WhatsApp ke pelanggan.",
      icon: Wrench,
      badgeColor: isDark ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      accentColor: "from-emerald-600 to-teal-600",
      features: [
        { title: "Live Servis & Queue Tracking", desc: "Pantau antrean dari status Menunggu, Sedang Dikerjakan teknisi/terapis, hingga Siap Diambil." },
        { title: "Notifikasi WhatsApp Otomatis", desc: "Pelanggan otomatis menerima pesan WhatsApp begitu servis atau cucian selesai tanpa perlu Anda telepon manual." },
        { title: "Invoice Gabungan Jasa + Sparepart", desc: "Satu nota rapi menggabungkan ongkos pengerjaan jasa mekanik dan harga suku cadang/part pengganti." },
        { title: "Rekap Komisi & Bagi Hasil Staf", desc: "Hitung otomatis persentase komisi bagi hasil per pekerjaan teknisi, mekanik, atau staf perorangan." }
      ],
      link: "/solusi/jasa",
      metrics: { label: "Kepuasan Pelanggan", value: "99%", sub: "dengan transparansi notifikasi WA" }
    },
    rental: {
      title: "Rental, Travel, Properti & Alat Barang",
      tagline: "Rental Mobil/Motor, Tour & Travel, Sewa Villa & Homestay, Sewa Kamera, Tenda, Alat Berat & Peralatan Bangunan",
      description: "Manajemen sewa unit berbasis waktu dengan kalender ketersediaan interaktif anti-bentrok, sistem deposit jaminan, dan denda keterlambatan otomatis. Cocok untuk rental kendaraan, properti sewaan, hingga sewa alat & barang berat konstruksi.",
      icon: Car,
      badgeColor: isDark ? "bg-purple-950/80 text-purple-300 border-purple-800" : "bg-purple-50 text-purple-700 border-purple-200",
      accentColor: "from-purple-600 to-indigo-600",
      features: [
        { title: "Kalender Ketersediaan Unit Visual", desc: "Pantau jadwal armada mobil, kamar villa, atau sewa kamera/alat & barang berat secara visual agar bebas dari bentrok jadwal (double booking)." },
        { title: "Tarif Fleksibel Jam / Hari / Mingguan", desc: "Kalkulasi tarif otomatis berdasarkan durasi sewa 12 jam, harian, mingguan, hingga sewa bulanan untuk kendaraan maupun alat barang." },
        { title: "Catat Uang Deposit & Denda Telat", desc: "Kelola uang jaminan/deposit penyewa dan sistem hitung denda otomatis jika unit/alat barang dikembalikan melewati tenggat waktu." },
        { title: "Invoice & Surat Perjanjian Sewa A4", desc: "Cetak surat perjanjian sewa formal dan invoice A4 berlogo bisnis Anda lengkap dengan data identitas penyewa & detail unit/alat." }
      ],
      link: "/solusi/rental",
      metrics: { label: "Utilisasi Unit", value: "100%", sub: "bebas jadwal bentrok & transparan" }
    }
  };

  const currentVertical = verticals[activeTab];

  const faqs = [
    {
      q: "Bagaimana cara instal aplikasi PJTECH di HP Android & iPhone (iOS)?",
      a: "Sangat mudah! PJTECH adalah aplikasi web progresif (PWA) resmi tanpa perlu download ratusan MB dari Play Store atau App Store: \n• Android: Buka link website di Google Chrome → Ketuk menu titik tiga (⋮) di pojok kanan atas → Pilih 'Install Aplikasi' atau 'Tambahkan ke Layar Utama' → Ketuk Install. Aplikasi langsung terpasang di HP dengan ikon resmi PJTECH! \n• iPhone / iPad (iOS): Buka website di browser Safari (wajib Safari) → Ketuk ikon Bagikan (Share / ikon kotak panah ke atas di bilah bawah) → Gulir ke bawah lalu pilih 'Tambah ke Layar Utama' (Add to Home Screen) → Ketuk 'Tambah' di kanan atas. Ikon PJTECH langsung siap di Home Screen dan saat dibuka akan langsung masuk ke kasir POS fullscreen!"
    },
    {
      q: "Bagaimana cara Karyawan / Kasir login ke sistem?",
      a: "Karyawan masuk melalui menu 'Masuk' lalu pilih 'Login sebagai Karyawan'. Gunakan email & password yang sudah dibuatkan oleh Pemilik Toko (Owner) di menu Manajemen Karyawan. Karyawan akan langsung diarahkan ke layar Kasir POS atau Kitchen Display sesuai hak aksesnya."
    },
    {
      q: "Apakah PJTECH bisa dipakai di HP, Tablet, atau Laptop?",
      a: "Bisa! PJTECH berbasis Cloud Web App responsif dan mendukung PWA (Progressive Web App). Anda bisa menggunakannya di HP Android, iPhone, iPad, Tablet Android, laptop Windows, hingga MacBook tanpa perlu beli perangkat khusus."
    },
    {
      q: "Printer thermal apa saja yang kompatibel?",
      a: "Semua jenis printer thermal Bluetooth standar (ukuran kertas 58mm maupun 80mm) yang mendukung protokol ESC/POS langsung didukung secara native tanpa install driver tambahan."
    },
    {
      q: "Bagaimana jika koneksi internet di toko saya tiba-tiba mati?",
      a: "PJTECH dilengkapi arsitektur Offline-First. Kasir tetap bisa melakukan transaksi penjualan saat offline. Data transaksi tersimpan aman di perangkat kasir dan akan otomatis tersinkronisasi ke server pusat saat internet tersambung kembali."
    },
    {
      q: "Apakah data produk & menu bisa diimport via Excel?",
      a: "Bisa! Kami menyediakan template Excel standar untuk masing-masing 4 vertikal: Retail (SKU & varian), F&B (3 template: Kafe, Resto, Warung Makan), Jasa (layanan & sparepart), Rental (unit & tarif). Cukup isi template, upload sekali, dan sistem langsung siap jualan tanpa input manual satu per satu."
    },
    {
      q: "Berapa biaya langganan dan apakah ada biaya tersembunyi?",
      a: "Biaya sangat transparan: Rp 990.000 per tahun (hanya setara ~Rp 2.700 per hari). Semua 4 vertikal bisnis (Retail, F&B, Jasa, Rental) langsung terbuka tanpa ada biaya tambahan untuk Kitchen Display System (KDS), multi-kasir, ataupun pembatasan transaksi."
    },
    {
      q: "Apakah ada uji coba gratis (Free Trial)?",
      a: "Ya! Anda mendapatkan Uji Coba Gratis 14 Hari dengan akses penuh ke seluruh fitur Enterprise. Tidak memerlukan kartu kredit untuk mendaftar."
    }
  ];

  return (
      <div className={`min-h-screen font-sans antialiased overflow-x-hidden ${
        isDark ? 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white' : 'bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white'
      }`}>

        {/* 1. STICKY NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 shadow-sm shadow-black/20' 
          : 'bg-white/95 border-slate-200/80 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Sisi Kiri: Logo Brand & Identitas */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform shrink-0 bg-blue-600 flex items-center justify-center">
              <Image 
                src="/logo-app.png" 
                alt="PJTECH Kasir UMKM Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg lg:text-xl font-black tracking-tight flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                PJTECH <span className="text-[10px] sm:text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-extrabold shadow-sm">KASIR UMKM</span>
              </span>
              <span className={`text-[9px] sm:text-[10px] tracking-wider font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cloud POS Multi-Vertikal
              </span>
            </div>
          </Link>

          {/* Sisi Tengah: Navigasi Utama (Bersih, Rapi, Terstruktur & Lega) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold">
            {/* Dropdown Solusi Bisnis */}
            <div className="relative group py-2">
              <span className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-600'
              }`}>
                Solusi Bisnis <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
              </span>
              <div className={`absolute top-full left-0 w-72 rounded-2xl p-2.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Link href="/solusi/retail" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-blue-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Store className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Retail & Toko</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Barcode & Multi-Varian</p>
                  </div>
                </Link>
                <Link href="/solusi/fnb" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-orange-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><Utensils className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">F&B & Kuliner</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>KDS & Meja Split Bill</p>
                  </div>
                </Link>
                <Link href="/solusi/jasa" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-emerald-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Wrench className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Jasa & Servis</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Antrean & Tracking WA</p>
                  </div>
                </Link>
                <Link href="/solusi/rental" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-purple-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Car className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Rental, Properti & Alat</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mobil, Villa & Alat Barang</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/comparison" className={`transition-colors ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-600'
            }`}>
              Perbandingan POS
            </Link>
            <Link href="/blog" className={`transition-colors ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-600'
            }`}>
              Blog & Tips
            </Link>
            <a href="#pricing" className={`transition-colors ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-600'
            }`}>
              Harga
            </a>
            <a href="#faq" className={`transition-colors ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-blue-600'
            }`}>
              FAQ
            </a>
          </nav>

          {/* Sisi Kanan: Action Buttons (Spacious & Clean Hierarchy) */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3 shrink-0">
            {/* Tombol Install App di HP */}
            <button
              type="button"
              onClick={() => setInstallModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs hover:scale-[1.02] ${
                isDark 
                  ? 'bg-blue-950/60 border-blue-800/80 text-blue-300 hover:bg-blue-900/80' 
                  : 'bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
              title="Panduan Install di Android & iOS"
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Install HP</span>
            </button>

            {/* Theme Toggle (Icon Compact) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Tema"
              className={`p-2 rounded-xl border transition-all duration-200 shadow-xs ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:border-slate-600 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title={isDark ? "Ganti ke Tema Terang" : "Ganti ke Tema Gelap"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold border transition-all duration-200 shadow-xs ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' 
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <span>Masuk</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 transition-transform duration-200" />
              </button>

              {loginDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-2 shadow-2xl border z-50 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <Link
                    href="/sign-in?redirect_url=/auth-callback"
                    className={`flex items-start gap-3 p-3 rounded-xl ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-blue-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Masuk sebagai Owner</p>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Akses dashboard, omzet & kelola toko</p>
                    </div>
                  </Link>

                  <Link
                    href="/sign-in?redirect_url=/auth-callback"
                    className={`flex items-start gap-3 p-3 rounded-xl border-t ${
                      isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-emerald-50'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Login sebagai Karyawan</p>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Akses Kasir POS, Kitchen Display & Servis</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Primary CTA (Ringkas & High-Contrast) */}
            <Link
              href="/sign-up?redirect_url=/onboarding"
              className="inline-flex items-center justify-center gap-2 px-4 lg:px-5 py-2 rounded-xl text-xs lg:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <span>Coba Gratis 14 Hari</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </div>

          {/* Mobile Actions: Theme + Hamburger (Spacious, High Contrast) */}
          <div className="flex md:hidden items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all duration-200 shadow-sm shrink-0 ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
              }`}
              aria-label="Toggle Tema"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border transition-all duration-200 shadow-sm shrink-0 ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 active:bg-slate-600' 
                  : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-slate-900/10'
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white stroke-[2.5]" />
              ) : (
                <Menu className="w-5 h-5 text-white stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer (Fixed Overlay & Background Locked) */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 top-20 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Drawer Panel */}
            <div
              className={`fixed top-20 left-0 right-0 bottom-0 z-50 md:hidden overflow-y-auto overscroll-contain px-4 pt-3 pb-24 space-y-4 shadow-2xl border-b transition-all ${
                isDark ? 'bg-slate-900/98 border-slate-800 text-white' : 'bg-white/98 border-slate-200 text-slate-900'
              }`}
              style={{ touchAction: 'pan-y' }}
            >
              {/* Quick Install Button for Mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInstallModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs"
              >
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>📱 Panduan Install Android & iPhone</span>
              </button>

              <div className="space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>Solusi Vertikal</p>
                <Link href="/solusi/retail" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-bold transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>🛒 Retail & Toko</Link>
                <Link href="/solusi/fnb" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-bold transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>🍳 F&B & Kuliner</Link>
                <Link href="/solusi/jasa" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-bold transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>🔧 Jasa & Servis</Link>
                <Link href="/solusi/rental" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg font-bold transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>🚗 Rental, Properti & Alat</Link>
              </div>
              <div className={`border-t pt-3 space-y-1.5 font-bold ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <Link href="/comparison" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>Perbandingan POS</Link>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>Blog & Panduan</Link>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>Paket Harga</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-lg transition-colors ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}>FAQ</a>
              </div>
              <div className={`border-t pt-4 flex flex-col gap-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {/* Masuk (Owner) */}
                <Link
                  href="/sign-in?redirect_url=/auth-callback"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Masuk (Owner)</span>
                </Link>

                {/* Login sebagai Karyawan - HIGH CONTRAST */}
                <Link
                  href="/sign-in?redirect_url=/auth-callback"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm ${
                    isDark
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-white border-2 border-slate-700'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 shadow-sm'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>
                    Login sebagai Karyawan
                  </span>
                </Link>

                {/* Primary CTA */}
                <Link
                  href="/sign-up?redirect_url=/onboarding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200"
                >
                  <span>Coba Gratis 14 Hari</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none blur-[140px] ${
          isDark ? 'bg-blue-600/20' : 'bg-blue-400/20'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Hero Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm mb-8 shadow-sm ${
            isDark 
              ? 'bg-slate-900/90 border-slate-700 text-slate-200' 
              : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">
              300+ UMKM mempercayai PJTECH • Setup 5 menit • Gratis 14 hari
            </span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}>
            Satu Aplikasi Kasir untuk <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Semua Jenis Bisnis UMKM.
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Kelola operasional <strong>Toko & Retail</strong>, <strong>Kafe & Restoran (F&B)</strong>, <strong>Bengkel & Laundry (Jasa)</strong>, hingga <strong>Rental Mobil, Villa & Alat Barang (Travel/Properti/Alat Berat)</strong> dalam satu platform.
            Lengkap dengan 3 Template Excel F&B, Kitchen Display (KDS), Tracking Servis WA, Stok Multi-Varian, Kalender Rental Anti-Bentrok, dan Laporan Pajak PPN otomatis.
          </p>

          {/* Dual High-Contrast CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
            <Button
              href="/sign-up?redirect_url=/onboarding"
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Coba Gratis 14 Hari
            </Button>
            
            <Button
              href="/comparison"
              variant="secondary"
              size="xl"
            >
              Lihat Perbandingan Lengkap
            </Button>
          </div>

          {/* Micro Trust Points */}
          <div className={`flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-bold ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Tanpa Kartu Kredit</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Setup 5 Menit Langsung Jualan</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Kompatibel Semua Printer Bluetooth</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Offline-First (Anti Internet Mati)</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Import Produk via Excel 1 Klik</span>
          </div>

          {/* Quick Install Guide Trigger */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setInstallModalOpen(true)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border shadow-sm group hover:scale-[1.02] ${
                isDark
                  ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-blue-700 text-blue-300 hover:border-blue-500'
                  : 'bg-white border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>📱 Panduan Install di HP (Android & iOS)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold ml-1">Gratis</span>
            </button>
          </div>

          {/* 4. HERO DASHBOARD BENTO PREVIEW */}
          <div className={`mt-12 sm:mt-14 relative max-w-5xl mx-auto rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-2.5 sm:p-4 border shadow-2xl ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800' 
              : 'bg-slate-200/80 border-slate-300 shadow-slate-300/50'
          }`}>
            <div className={`rounded-xl sm:rounded-2xl md:rounded-[2rem] p-3.5 sm:p-6 md:p-8 border grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 text-left ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              
              {/* Preview Card 1: Omzet & Profit */}
              <div className={`md:col-span-7 rounded-xl sm:rounded-2xl p-4 sm:p-6 border flex flex-col justify-between relative overflow-hidden ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-start gap-2 mb-3 sm:mb-4">
                  <div className="min-w-0">
                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Total Penjualan Hari Ini
                    </p>
                    <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black mt-0.5 sm:mt-1 tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      Rp 14.850.000
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1 shrink-0 whitespace-nowrap">
                    +18.4% vs kemarin
                  </span>
                </div>
                <div className={`grid grid-cols-3 gap-1.5 sm:gap-3 pt-3 sm:pt-4 border-t ${
                  isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                }`}>
                  <div className="min-w-0">
                    <p className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>Transaksi</p>
                    <p className="text-xs sm:text-sm md:text-base font-black truncate mt-0.5">142 Struk</p>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>Rata-rata Struk</p>
                    <p className="text-xs sm:text-sm md:text-base font-black whitespace-nowrap mt-0.5">Rp 104.500</p>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] sm:text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'} truncate`}>Laba Bersih</p>
                    <p className="text-xs sm:text-sm md:text-base font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap mt-0.5">Rp 6.120.000</p>
                  </div>
                </div>
              </div>

              {/* Preview Card 2: Multi-Vertikal Live Feeds */}
              <div className="md:col-span-5 flex flex-col gap-2.5 sm:gap-3">
                {/* F&B KDS Ticket */}
                <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border flex items-center justify-between gap-2.5 transition-all ${
                  isDark ? 'bg-slate-900 border-orange-500/30' : 'bg-orange-50/70 border-orange-200'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="p-2 sm:p-2.5 bg-orange-500 text-white rounded-xl shrink-0"><Utensils className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Meja 04 • KDS Dapur</p>
                      <p className={`text-[10px] sm:text-[11px] font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>2x Nasi Goreng, 1x Es Kopi</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-md whitespace-nowrap">Dimasak 03:20</span>
                </div>

                {/* Jasa Tracking WA */}
                <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border flex items-center justify-between gap-2.5 transition-all ${
                  isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="p-2 sm:p-2.5 bg-emerald-600 text-white rounded-xl shrink-0"><Wrench className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Servis #1089 • NMax B 1234</p>
                      <p className={`text-[10px] sm:text-[11px] font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Ganti Oli + Kampas Rem</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1 whitespace-nowrap">
                    <MessageSquare className="w-3 h-3 shrink-0" /> WA Sent
                  </span>
                </div>

                {/* Rental Booking Calendar */}
                <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border flex items-center justify-between gap-2.5 transition-all ${
                  isDark ? 'bg-slate-900 border-purple-500/30' : 'bg-purple-50/70 border-purple-200'
                }`}>
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="p-2 sm:p-2.5 bg-purple-600 text-white rounded-xl shrink-0"><Car className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs sm:text-sm font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>Avanza Veloz B 5678</p>
                      <p className={`text-[10px] sm:text-[11px] font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sewa 3 Hari (Deposit OK)</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-md whitespace-nowrap">Ready 14:00</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. HARDWARE & TRUST STRIP */}
      <section className={`py-8 border-y  ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-xs uppercase tracking-widest font-extrabold mb-6 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Terintegrasi Native dengan Hardware & Pembayaran Modern
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-center text-xs sm:text-sm font-bold">
            <div className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <QrCode className="w-5 h-5 text-blue-600" /> QRIS All Payment
            </div>
            <div className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <Printer className="w-5 h-5 text-indigo-600" /> Bluetooth 58/80mm
            </div>
            <div className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <WifiOff className="w-5 h-5 text-emerald-600" /> Offline-First Sync
            </div>
            <button
              type="button"
              onClick={() => setInstallModalOpen(true)}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all text-left hover:scale-[1.02] group ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md'
              }`}
              title="Klik untuk panduan instalasi di Android & iPhone"
            >
              <Smartphone className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span>Android / iOS / PC <span className="text-[10px] text-blue-600 font-extrabold block sm:inline sm:ml-1">(Panduan)</span></span>
            </button>
            <div className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <FileSpreadsheet className="w-5 h-5 text-amber-600" /> Ekspor Jurnal/Pajak
            </div>
            <div className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <ShieldCheck className="w-5 h-5 text-cyan-600" /> Cloud Backup 24/7
            </div>
          </div>
        </div>
      </section>

      {/* 6. 4 VERTICALS INTERACTIVE SHOWCASE */}
      <section className="py-16 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs font-extrabold tracking-wider text-blue-700 bg-blue-100/80 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3.5 py-1.5 rounded-full uppercase shadow-xs">
              Dirancang Spesifik Tiap Industri
            </span>
            <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-4 mb-3 sm:mb-4 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              4 Model Bisnis. Satu Aplikasi Kasir.
            </h2>
            <p className={`text-sm sm:text-base lg:text-lg font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Setiap jenis usaha memiliki alur operasional yang berbeda. PJTECH mengadaptasi fitur kasir sesuai vertikal bisnis Anda secara otomatis.
            </p>
          </div>

          {/* Vertical Tab Selector - Responsive 2x2 Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap items-stretch justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-8 sm:mb-12">
            {(Object.keys(verticals) as Array<keyof typeof verticals>).map((key) => {
              const item = verticals[key];
              const Icon = item.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 px-3 py-3 sm:px-5 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base border transition-all duration-200 text-center sm:text-left ${
                    isActive
                      ? `bg-gradient-to-r ${item.accentColor} text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/40 border-transparent scale-[1.02] md:scale-105 z-10`
                      : isDark
                        ? 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                        : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">
                    {key === 'fnb' ? (
                      <>
                        <span className="inline md:hidden">F&B & Kuliner</span>
                        <span className="hidden md:inline">F&B & Kuliner (3 Template)</span>
                      </>
                    ) : key === 'rental' ? (
                      <>
                        <span className="inline md:hidden">Rental & Travel</span>
                        <span className="hidden md:inline">Rental, Travel, Properti & Alat Barang</span>
                      </>
                    ) : (
                      item.title
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Vertical Details Card */}
          <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-10 border shadow-2xl ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Left Column: Descriptions & Features */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider border ${currentVertical.badgeColor}`}>
                      Spesifik Industri
                    </span>
                    <span className={`text-[11px] sm:text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {currentVertical.tagline}
                    </span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl lg:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    Fitur Lengkap untuk Operasional {currentVertical.title}
                  </h3>
                  <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {currentVertical.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
                  {currentVertical.features.map((feat, idx) => (
                    <div key={idx} className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-xs sm:text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feat.title}</h4>
                          <p className={`text-[11px] sm:text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 sm:pt-4 flex items-center">
                  <Button
                    href={currentVertical.link}
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto justify-center text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="sm:hidden">
                      Pelajari Solusi {activeTab === 'retail' ? 'Retail' : activeTab === 'fnb' ? 'F&B' : activeTab === 'jasa' ? 'Jasa' : 'Rental & Travel'}
                    </span>
                    <span className="hidden sm:inline">
                      Pelajari Solusi {currentVertical.title}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Right Column: Screenshot Showcase (Retail) or Metric Callout (Others) */}
              <div className={`lg:col-span-5 p-4 sm:p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                {activeTab === 'retail' ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Preview Antarmuka Retail
                        </span>
                        <p className={`text-[11px] sm:text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Layar Kasir & Ringkasan Checkout</p>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800 shrink-0">
                        Live System
                      </span>
                    </div>

                    {/* Foto 1: Desktop POS Screen */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-950 group">
                      <img 
                        src="/images/showcase/retail-pos-preview.png" 
                        alt="Tampilan Antarmuka Kasir POS Retail PJTECH" 
                        className="w-full h-auto max-h-56 sm:max-h-64 object-cover object-top transform group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Foto 2: Mobile / Detail Modal */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-950 group">
                      <img 
                        src="/images/showcase/retail-pos-mobile.png" 
                        alt="Tampilan Detail Transaksi & Cetak Struk Retail" 
                        className="w-full h-auto max-h-48 sm:max-h-56 object-cover object-top transform group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className={`p-4 sm:p-6 rounded-2xl border ${
                      isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Hasil Terukur & Terbukti
                      </span>
                      <h4 className={`text-3xl sm:text-4xl lg:text-5xl font-black mt-1 bg-gradient-to-r ${currentVertical.accentColor} bg-clip-text text-transparent`}>
                        {currentVertical.metrics.value}
                      </h4>
                      <p className={`text-xs sm:text-sm font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {currentVertical.metrics.label}
                      </p>
                      <p className={`text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {currentVertical.metrics.sub}
                      </p>
                    </div>

                    <div className={`p-3.5 sm:p-4 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                    }`}>
                      <p className={`text-xs font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Zap className="w-4 h-4 text-amber-500 shrink-0" /> Bebas Biaya Tambahan Add-On
                      </p>
                      <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        Tidak seperti software kasir lain yang menagih biaya per modul (KDS bayar lagi, multi-meja bayar lagi), di PJTECH semua fitur sudah all-in.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. ENTERPRISE ARCHITECTURE FOR UMKM */}
      <section className={`py-20 border-t  ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Teknologi Kelas Enterprise, Harga Ramah UMKM
            </h2>
            <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Dibangun dengan standar keamanan dan keandalan tinggi agar operasional kasir Anda berjalan mulus tanpa henti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className={`p-8 rounded-3xl border  space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Offline-First Resilience</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Koneksi internet toko sering terputus? Kasir tetap bisa melayani antrean transaksi dengan IndexedDB lokal. Data otomatis tersinkronisasi saat sinyal kembali.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-8 rounded-3xl border  space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Ekspor Laporan Pajak & Jurnal</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Tutup buku harian dan bulanan tanpa pusing. Ekspor data penjualan, rekap PPN, dan HPP dalam format CSV yang siap diimpor ke software akuntansi (Jurnal / Mekari).
              </p>
            </div>

            {/* Feature 3: Excel Template Import */}
            <div className={`p-8 rounded-3xl border  space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Import Produk & Menu via Excel</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Migrasi data dalam hitungan menit. Unduh template Excel kami (Retail, F&B 3 template, Jasa, Rental), isi data produk/menu Anda, upload sekali — sistem langsung siap jualan tanpa input manual satu per satu.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-8 rounded-3xl border  space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Multi-Outlet & Multi-Staff RBAC</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Pantau performa banyak cabang toko dari satu akun Owner. Pisahkan hak akses kasir dan staf dengan sistem Role-Based Access Control ketat untuk mencegah kecurangan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. COMPETITOR COMPARISON SUMMARY */}
      <section className="py-12 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className={`border rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 border-slate-200 shadow-sm'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <span className="inline-block text-[10px] sm:text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Kenapa Beralih ke PJTECH?
                </span>
                <h2 className={`text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Hemat hingga 70% Biaya POS per Tahun
                </h2>
                <p className={`text-xs sm:text-sm md:text-base leading-relaxed font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Aplikasi kasir lain seperti Moka POS dan Pawoon mengenakan biaya Rp 1.800.000 hingga Rp 2.400.000+ per tahun serta membebankan biaya tambahan untuk modul KDS dan multi-meja. Di PJTECH, Anda mendapatkan seluruh 4 vertikal bisnis all-in.
                </p>
                <div className="pt-2">
                  <Link
                    href="/comparison"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm border border-blue-200 dark:border-blue-800 transition-all shadow-xs group w-full sm:w-auto text-center"
                  >
                    <span>Lihat Perbandingan Lengkap vs Moka, Pawoon, iReap & Qashier</span>
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column (5 cols) - Clean Comparison Breakdown */}
              <div className="lg:col-span-5 w-full">
                <div className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border text-xs sm:text-sm space-y-2.5 sm:space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 shadow-md text-slate-800'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-[10px] sm:text-xs uppercase tracking-wider text-slate-500">
                    <span>Fitur / Layanan</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">PJTECH vs Kompetitor</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="font-semibold truncate">4 Vertikal Bisnis</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-right">All-In (Included)</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800 gap-2">
                    <span className="font-semibold truncate">Kitchen Display (KDS)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-right">Gratis (No Addon)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800 gap-2">
                    <span className="font-semibold truncate">Tracking Servis & WA</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-right">Included</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800 gap-2">
                    <span className="font-semibold truncate">Import Produk via Excel</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-right">Template Siap Pakai</span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 sm:pt-3 border-t-2 border-slate-200 dark:border-slate-700">
                    <span className="font-black text-xs sm:text-sm">Biaya Tahunan</span>
                    <div className="flex items-baseline gap-1.5 shrink-0 text-right">
                      <span className="font-black text-sm sm:text-base text-blue-600 dark:text-blue-400 whitespace-nowrap">Rp 990.000</span>
                      <span className="text-[10px] sm:text-xs text-slate-400 line-through whitespace-nowrap">Rp 2.400.000</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 9. TRANSPARENT PRICING SECTION - 4 EXACT TIERS */}
      <section id="pricing" className={`py-20 md:py-28 border-t  ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-blue-700 bg-blue-100/80 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
              Pilihan Paket Langganan
            </span>
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight mt-4 mb-3 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Transparan, Fleksibel, Tanpa Biaya Tersembunyi
            </h2>
            <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Tingkatkan ke Pro untuk melihat laporan keuntungan harian, melacak tren penjualan, dan fitur analitik premium lainnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* 1. Mulai Usaha (Free Trial) */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border  ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
              <div>
                <div className="mb-5">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mulai Usaha</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Pengguna baru yang ragu dan ingin mencoba.
                  </p>
                </div>
                
                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Rp 0</div>
                  <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Gratis 14 Hari Pertama</div>
                </div>

                <div className="space-y-3 mb-8 text-xs font-medium">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Akses Kasir Penuh (POS)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Manajemen Produk Dasar</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Dasbor Analitik (Terbatas)</span>
                  </div>
                </div>
              </div>

              <Button
                href="/sign-up?redirect_url=/onboarding"
                variant="secondary"
                size="sm"
                fullWidth
              >
                Coba Gratis 14 Hari
              </Button>
            </div>

            {/* 2. Pro 1 Bulan */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border  ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
              <div>
                <div className="mb-5">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro 1 Bulan</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Untuk mencoba fitur lengkap kasir pintar.
                  </p>
                </div>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp 129k <span className="text-xs font-normal text-slate-600">/ bulan</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">Total: Rp 129.000 / 1 bulan</div>
                  <div className="text-[11px] text-slate-600 italic mt-0.5">(Hanya Software)</div>
                  <button 
                    onClick={() => setIsTncOpen(true)} 
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1.5 block"
                  >
                    Lihat Syarat & Ketentuan
                  </button>
                </div>

                <div className="space-y-3 mb-8 text-xs font-medium">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Akses Penuh POS, Jasa & Rental</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Manajemen Stok & Komisi</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Laporan Keuangan Dasar</span>
                  </div>
                </div>
              </div>

              <Button
                href="/sign-up?redirect_url=/onboarding"
                variant="primary"
                size="sm"
                fullWidth
              >
                Pilih 1 Bulan
              </Button>
            </div>

            {/* 3. Pro 6 Bulan */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border  ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
              <div>
                <div className="mb-5">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro 6 Bulan</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    UMKM yang butuh fleksibilitas cashflow.
                  </p>
                </div>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp 99k <span className="text-xs font-normal text-slate-600">/ bulan</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">Total: Rp 594.000 / 6 bulan</div>
                  <div className="text-[11px] text-slate-600 italic mt-0.5">(Hanya Software)</div>
                  <button 
                    onClick={() => setIsTncOpen(true)} 
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1.5 block"
                  >
                    Lihat Syarat & Ketentuan
                  </button>
                </div>

                <div className="space-y-3 mb-8 text-xs font-medium">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Akses Penuh POS, Jasa & Rental</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Laporan Pendapatan & Laba Bersih</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Ekspor Data Laporan (Excel/CSV)</span>
                  </div>
                </div>
              </div>

              <Button
                href="/sign-up?redirect_url=/onboarding"
                variant="primary"
                size="sm"
                fullWidth
              >
                Pilih 6 Bulan
              </Button>
            </div>

            {/* 4. Pro 1 Tahun (HERO CARD) */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between relative border-2 ring-2 ring-orange-500 ring-offset-2  ${
              isDark 
                ? 'bg-slate-900 border-orange-500 ring-offset-slate-950 shadow-[0_8px_30px_rgb(249,115,22,0.2)]' 
                : 'bg-white border-orange-500 ring-offset-white shadow-[0_8px_30px_rgb(249,115,22,0.15)]'
            }`}>
              <div className="absolute -top-3.5 right-6 bg-orange-500 text-white text-[10px] font-black px-3.5 py-1 rounded-full shadow-md tracking-wider uppercase">
                PALING HEMAT!
              </div>

              <div>
                <div className="mb-5 mt-1">
                  <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro 1 Tahun</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Pemilik bisnis serius yang mencari nilai terbaik.
                  </p>
                </div>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp 82.5k <span className="text-xs font-bold text-slate-600">/ bulan</span>
                  </div>
                  <div className="text-xs font-black text-orange-600 dark:text-orange-400 mt-1">Total: Rp 990.000 / 12 bulan</div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 inline-block px-2 py-0.5 rounded-md mt-1.5">
                    Hemat Rp 558.000 per tahun!
                  </div>
                  <button 
                    onClick={() => setIsTncOpen(true)} 
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 block"
                  >
                    Lihat Syarat & Ketentuan
                  </button>
                </div>

                <div className="space-y-3 mb-8 text-xs font-medium">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Semua fitur tanpa batasan</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <strong>Analitik Mendalam:</strong> Lacak tren penjualan.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <strong>Database Pelanggan:</strong> Rekam preferensi pelanggan.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <strong>Akses Prioritas:</strong> Customer Service khusus.
                    </span>
                  </div>
                </div>
              </div>

              <Button
                href="/sign-up?redirect_url=/onboarding"
                variant="primary"
                size="md"
                fullWidth
                className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 text-white"
              >
                Pilih Paket Paling Hemat
              </Button>
            </div>

          </div>

        </div>
      </section>

      {/* T&C MODAL */}
      {isTncOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-8 border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex justify-between items-start border-b pb-4 mb-5">
              <h3 className={`text-lg sm:text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Syarat & Ketentuan Layanan (T&C)
              </h3>
              <button
                onClick={() => setIsTncOpen(false)}
                className="p-1.5 text-slate-600 hover:text-slate-800 bg-slate-100 dark:bg-slate-800 rounded-full  shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <p className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Lisensi Perangkat Lunak (Software)</p>
                <p className="text-slate-600 dark:text-slate-300">
                  Paket langganan ini hanya mencakup hak guna lisensi perangkat lunak PJTECH Kasir UMKM selama periode aktif yang dipilih.
                </p>
              </div>

              <div>
                <p className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Pembebasan Tanggung Jawab Perangkat Keras (Hardware)</p>
                <div className="bg-orange-50 dark:bg-orange-950/40 p-3.5 rounded-xl border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-300 space-y-2">
                  <p className="font-bold">PJTECH KASIR UMKM hanya menyediakan layanan perangkat lunak (Software).</p>
                  <p className="text-xs leading-relaxed">
                    Seluruh perangkat keras (Hardware) yang dibeli melalui tautan rekomendasi pihak ketiga (Affiliate/Rekomendasi) adalah tanggung jawab penuh dari penjual/toko/marketplace terkait. Kami tidak menerima klaim garansi, retur, atau dukungan teknis atas kerusakan perangkat keras fisik.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsTncOpen(false)}
              className="w-full mt-6 py-3 bg-slate-950 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 font-bold rounded-xl text-sm "
            >
              Saya Mengerti dan Setuju
            </button>
          </div>
        </div>
      )}

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className={`py-20 md:py-28 border-t  ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-3 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Semua hal yang perlu Anda ketahui tentang PJTECH Kasir UMKM.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl overflow-hidden  ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4  ${
                      isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className={`px-5 pb-6 sm:px-6 text-sm sm:text-base leading-relaxed border-t pt-4 font-medium ${
                      isDark ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. FINAL CALL TO ACTION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Siap Tingkatkan Omzet & Rapikan Kasir Toko Anda?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Bergabunglah dengan pelaku usaha UMKM Indonesia yang telah beralih ke PJTECH. Setup dalam 5 menit, langsung jualan hari ini.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/sign-up?redirect_url=/onboarding"
              variant="secondary"
              size="xl"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="bg-white text-slate-950 hover:bg-slate-100 shadow-2xl"
            >
              Mulai Trial Gratis 14 Hari
            </Button>
            <Button
              href="/sign-in?redirect_url=/auth-callback"
              variant="ghost"
              size="xl"
              className="bg-blue-950/50 hover:bg-blue-950/70 text-white border border-white/30"
            >
              Masuk ke Akun
            </Button>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className={`border-t py-16 text-sm  ${
        isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 bg-blue-600 shrink-0 flex items-center justify-center">
                <Image 
                  src="/logo-app.png" 
                  alt="PJTECH Logo" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">PJTECH KASIR UMKM</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-slate-300">
              Sistem POS SaaS multi-vertikal untuk UMKM Indonesia. Membantu digitalisasi operasional Retail, F&B, Jasa, dan Rental dengan arsitektur cloud cepat & hemat biaya.
            </p>
            <p className="text-xs text-slate-300">
              Dikembangkan oleh <strong>Pranajaya Tech (PJTech)</strong>.
            </p>
          </div>

          {/* Col 2: Solusi */}
          <div className="space-y-3">
            <p className="font-black text-white text-xs uppercase tracking-wider">Solusi Vertikal</p>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li><Link href="/solusi/retail" className="hover:text-white ">POS Retail & Toko</Link></li>
              <li><Link href="/solusi/fnb" className="hover:text-white ">POS Resto & Kafe (F&B)</Link></li>
              <li><Link href="/solusi/jasa" className="hover:text-white ">POS Bengkel & Jasa</Link></li>
              <li><Link href="/solusi/rental" className="hover:text-white ">POS Rental, Properti & Alat</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigasi */}
          <div className="space-y-3">
            <p className="font-black text-white text-xs uppercase tracking-wider">Akses Portal</p>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li><Link href="/sign-in?redirect_url=/auth-callback" className="hover:text-white ">Masuk (Owner)</Link></li>
              <li><Link href="/sign-in?redirect_url=/auth-callback" className="hover:text-emerald-400 ">Login Karyawan / Kasir</Link></li>
              <li><Link href="/comparison" className="hover:text-white ">Perbandingan POS</Link></li>
              <li><Link href="/blog" className="hover:text-white ">Blog & Tips Bisnis</Link></li>
            </ul>
          </div>

          {/* Col 4: Media Sosial */}
          <div className="space-y-3">
            <p className="font-black text-white text-xs uppercase tracking-wider">Media Sosial Resmi</p>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li>
                <a href="https://www.tiktok.com/@pranajayatech" target="_blank" rel="noopener noreferrer" className="hover:text-white ">
                  TikTok: @pranajayatech
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/pranajayatech" target="_blank" rel="noopener noreferrer" className="hover:text-white ">
                  Instagram: @pranajayatech
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@pranajayatech" target="_blank" rel="noopener noreferrer" className="hover:text-white ">
                  YouTube: @pranajayatech
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>© 2026 PJTech (Pranajaya Tech). Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span>SaaS POS UMKM Indonesia</span>
            <span>Cloud Native Next.js</span>
          </div>
        </div>
      </footer>

    
      {/* MODAL PANDUAN INSTALASI ANDROID & IOS */}
      {installModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setInstallModalOpen(false)}
        >
          <div 
            className={`w-full max-w-lg rounded-3xl shadow-2xl border transition-all flex flex-col max-h-[90vh] overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal - Dedicated Flex Row with Close Button */}
            <div className="flex items-start justify-between gap-3 p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-md shadow-blue-600/30 bg-blue-600 shrink-0 flex items-center justify-center">
                  <Image src="/logo-app.png" alt="PJTECH" width={48} height={48} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight text-slate-900 dark:text-white truncate">
                    Panduan Install PJTECH di HP
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Aplikasi PWA Ringan • Langsung di Layar Utama
                  </p>
                </div>
              </div>

              {/* Close Button - in its own dedicated space */}
              <button
                type="button"
                onClick={() => setInstallModalOpen(false)}
                className="p-2 -mr-1 -mt-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Platform Tab Switcher */}
              <div className="flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setInstallTab('android')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    installTab === 'android'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>🤖 HP Android (Chrome)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInstallTab('ios')}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    installTab === 'ios'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>🍎 iPhone / iPad (Safari)</span>
                </button>
              </div>

              {/* Steps Content */}
              {installTab === 'android' ? (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Buka di Google Chrome</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Buka website PJTECH di browser Google Chrome pada HP Android Anda.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Ketuk Menu Titik Tiga (⋮)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Ketuk ikon titik tiga di sudut kanan atas layar browser Chrome.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Pilih "Install Aplikasi" / "Tambahkan ke Layar Utama"</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Ketuk pilihan tersebut dan konfirmasi dengan menekan <strong>Install</strong>.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300">Selesai!</p>
                      <p className="text-emerald-800 dark:text-emerald-400 text-xs mt-0.5">Ikon resmi PJTECH akan muncul di layar depan HP Anda dan langsung siap digunakan transaksi kasir.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Buka di Safari (Wajib)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Di iPhone/iPad, pastikan membuka website menggunakan browser <strong>Safari</strong> bawaan Apple.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Ketuk Ikon Bagikan (Share)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Ketuk ikon kotak dengan tanda panah ke atas di bagian bilah menu bawah layar Safari.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Pilih "Tambah ke Layar Utama" (Add to Home Screen)</p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5">Gulir ke bawah menu lalu ketuk opsi <strong>Tambah ke Layar Utama</strong>, kemudian ketuk <strong>Tambah</strong> di pojok kanan atas.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="font-bold text-emerald-900 dark:text-emerald-300">Selesai & Fullscreen!</p>
                      <p className="text-emerald-800 dark:text-emerald-400 text-xs mt-0.5">Ikon PJTECH terpasang di Home Screen iPhone dan akan terbuka fullscreen tanpa bilah browser.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">⚡ Ukuran &lt; 5MB • Otomatis Update</span>
              <button
                type="button"
                onClick={() => setInstallModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
