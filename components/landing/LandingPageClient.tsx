"use client";

import React, { useState, useEffect } from 'react';
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
  const [isTncOpen, setIsTncOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pjtech_landing_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pjtech_landing_theme', newTheme);
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
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b  ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800' 
          : 'bg-white/95 border-slate-200/80 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                PJTECH <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-extrabold shadow-sm">KASIR UMKM</span>
              </span>
              <span className={`text-[10px] tracking-wider font-bold uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Cloud POS Multi-Vertikal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold">
            {/* Dropdown Solusi Bisnis */}
            <div className="relative group py-2">
              <span className={`flex items-center gap-1 cursor-pointer  ${
                isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
              }`}>
                Solusi Bisnis <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </span>
              <div className={`absolute top-full left-0 w-72 rounded-2xl p-2.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible  duration-200 border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <Link href="/solusi/retail" className={`flex items-center gap-3 p-3 rounded-xl  ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-blue-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Store className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Retail & Toko</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Barcode & Multi-Varian</p>
                  </div>
                </Link>
                <Link href="/solusi/fnb" className={`flex items-center gap-3 p-3 rounded-xl  ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-orange-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><Utensils className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">F&B & Kuliner</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>KDS & Meja Split Bill</p>
                  </div>
                </Link>
                <Link href="/solusi/jasa" className={`flex items-center gap-3 p-3 rounded-xl  ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-emerald-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Wrench className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Jasa & Servis</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Antrean & Tracking WA</p>
                  </div>
                </Link>
                <Link href="/solusi/rental" className={`flex items-center gap-3 p-3 rounded-xl  ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-purple-50 text-slate-800'
                }`}>
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Car className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Rental, Properti & Alat</p>
                    <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Mobil, Villa & Alat Barang</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/comparison" className={` ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              Perbandingan POS
            </Link>
            <Link href="/blog" className={` ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              Blog & Tips
            </Link>
            <a href="#pricing" className={` ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              Harga
            </a>
            <a href="#faq" className={` ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              FAQ
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle Button (Modern Segmented / Pill Switcher) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Tema"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 shadow-sm ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:border-slate-600 hover:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Terang</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>Gelap</span>
                </>
              )}
            </button>

            {/* Login Dropdown (Owner vs Karyawan) */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 shadow-sm ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' 
                    : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400'
                }`}
              >
                <span>Masuk</span>
                <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200" />
              </button>

              {loginDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-2 shadow-2xl border z-50 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <Link
                    href="/sign-in?redirect_url=/auth-callback"
                    className={`flex items-start gap-3 p-3 rounded-xl  ${
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
                    className={`flex items-start gap-3 p-3 rounded-xl  border-t ${
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

            {/* Primary CTA */}
            <Button
              href="/sign-up?redirect_url=/onboarding"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Coba Gratis 14 Hari
            </Button>
          </div>

          {/* Mobile Actions: Theme + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-200 shadow-sm ${
                isDark ? 'bg-slate-900 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-700'
              }`}
              aria-label="Toggle Tema"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu"
              className={`transition-all duration-200 ${
                isDark ? 'text-white hover:bg-slate-800/50' : 'text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-1">
              <p className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>Solusi Vertikal</p>
              <Link href="/solusi/retail" className="block px-3 py-2 rounded-lg font-bold">🛒 Retail & Toko</Link>
              <Link href="/solusi/fnb" className="block px-3 py-2 rounded-lg font-bold">🍳 F&B & Kuliner</Link>
              <Link href="/solusi/jasa" className="block px-3 py-2 rounded-lg font-bold">🔧 Jasa & Servis</Link>
              <Link href="/solusi/rental" className="block px-3 py-2 rounded-lg font-bold">🚗 Rental, Properti & Alat</Link>
            </div>
            <div className={`border-t pt-3 space-y-2 font-bold ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <Link href="/comparison" className="block px-3 py-2 rounded-lg">Perbandingan POS</Link>
              <Link href="/blog" className="block px-3 py-2 rounded-lg">Blog & Panduan</Link>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg">Paket Harga</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg">FAQ</a>
            </div>
            <div className={`border-t pt-4 flex flex-col gap-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <Button
                            variant="secondary"
                            size="md"
                            href="/sign-in?redirect_url=/auth-callback"
                            className="w-full"
                          >
                            Masuk (Owner)
                          </Button>
                          <Button
                            variant="outline"
                            size="md"
                            href="/sign-in?redirect_url=/auth-callback"
                            className="w-full"
                          >
                            Login sebagai Karyawan
                          </Button>
                          <Button
                            variant="primary"
                            size="md"
                            href="/sign-up?redirect_url=/onboarding"
                            className="w-full"
                          >
                            Daftar Trial Gratis 14 Hari
                          </Button>
                        </div>
          </div>
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

          {/* 4. HERO DASHBOARD BENTO PREVIEW */}
          <div className={`mt-14 relative max-w-5xl mx-auto rounded-[2.5rem] p-3 sm:p-4 border shadow-2xl  ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800' 
              : 'bg-slate-200/80 border-slate-300 shadow-slate-300/50'
          }`}>
            <div className={`rounded-[2rem] p-4 sm:p-8 border grid grid-cols-1 md:grid-cols-12 gap-4 text-left  ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              
              {/* Preview Card 1: Omzet & Profit */}
              <div className={`md:col-span-7 rounded-2xl p-6 border flex flex-col justify-between relative overflow-hidden  ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Total Penjualan Hari Ini
                    </p>
                    <h3 className={`text-3xl sm:text-4xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                      Rp 14.850.000
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 rounded-full text-xs font-black flex items-center gap-1">
                    +18.4% vs kemarin
                  </span>
                </div>
                <div className={`grid grid-cols-3 gap-2 pt-4 border-t text-xs ${
                  isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                }`}>
                  <div>
                    <p className="font-semibold text-slate-700">Transaksi</p>
                    <p className="text-base font-black">142 Struk</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Rata-rata Struk</p>
                    <p className="text-base font-black">Rp 104.500</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Laba Bersih</p>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">Rp 6.120.000</p>
                  </div>
                </div>
              </div>

              {/* Preview Card 2: Multi-Vertikal Live Feeds */}
              <div className="md:col-span-5 flex flex-col gap-3">
                {/* F&B KDS Ticket */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between  ${
                  isDark ? 'bg-slate-900 border-orange-500/30' : 'bg-orange-50/70 border-orange-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 text-white rounded-xl"><Utensils className="w-4 h-4" /></div>
                    <div>
                      <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Meja 04 • KDS Dapur</p>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>2x Nasi Goreng, 1x Es Kopi</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-md">Dimasak 03:20</span>
                </div>

                {/* Jasa Tracking WA */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between  ${
                  isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl"><Wrench className="w-4 h-4" /></div>
                    <div>
                      <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Servis #1089 • NMax B 1234</p>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Ganti Oli + Kampas Rem</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> WA Sent
                  </span>
                </div>

                {/* Rental Booking Calendar */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between  ${
                  isDark ? 'bg-slate-900 border-purple-500/30' : 'bg-purple-50/70 border-purple-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-600 text-white rounded-xl"><Car className="w-4 h-4" /></div>
                    <div>
                      <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Avanza Veloz B 5678</p>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Sewa 3 Hari (Deposit OK)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-md">Ready 14:00</span>
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
            <div className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}>
              <Smartphone className="w-5 h-5 text-purple-600" /> Android / iOS / PC
            </div>
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
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold tracking-wider text-blue-700 bg-blue-100/80 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 px-3.5 py-1.5 rounded-full uppercase shadow-xs">
              Dirancang Spesifik Tiap Industri
            </span>
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight mt-4 mb-4 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              4 Model Bisnis. Satu Aplikasi Kasir.
            </h2>
            <p className={`text-base sm:text-lg font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Setiap jenis usaha memiliki alur operasional yang berbeda. PJTECH mengadaptasi fitur kasir sesuai vertikal bisnis Anda secara otomatis.
            </p>
          </div>

          {/* Vertical Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {(Object.keys(verticals) as Array<keyof typeof verticals>).map((key) => {
              const item = verticals[key];
              const Icon = item.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base  border ${
                    isActive
                      ? `bg-gradient-to-r ${item.accentColor} text-white shadow-lg shadow-blue-500/20 scale-105 border-transparent`
                      : isDark
                        ? 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                        : 'bg-white text-slate-700 hover:text-slate-950 border-slate-200 shadow-sm'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Vertical Details Card */}
          <div className={`rounded-3xl p-6 sm:p-10 border shadow-2xl  ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-slate-200'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Descriptions & Features */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className={`text-xs font-black uppercase tracking-wider ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {currentVertical.tagline}
                  </span>
                  <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    Fitur Lengkap untuk Operasional {currentVertical.title}
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {currentVertical.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {currentVertical.features.map((feat, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border  ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feat.title}</h4>
                          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center">
                  <Button
                    href={currentVertical.link}
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Pelajari Solusi {currentVertical.title}
                  </Button>
                </div>
              </div>

              {/* Right Column: Screenshot Showcase (Retail) or Metric Callout (Others) */}
              <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                {activeTab === 'retail' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Preview Antarmuka Retail
                        </span>
                        <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Layar Kasir & Ringkasan Checkout</p>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-800">
                        Live System
                      </span>
                    </div>

                    {/* Foto 1: Desktop POS Screen */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-950 group">
                      <img 
                        src="/images/showcase/retail-pos-preview.png" 
                        alt="Tampilan Antarmuka Kasir POS Retail PJTECH" 
                        className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Foto 2: Mobile / Detail Modal */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-950 group">
                      <img 
                        src="/images/showcase/retail-pos-mobile.png" 
                        alt="Tampilan Detail Transaksi & Cetak Struk Retail" 
                        className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Hasil Terbukti
                      </span>
                      <h4 className="text-4xl sm:text-5xl font-black text-blue-600 mt-2">
                        {currentVertical.metrics.value}
                      </h4>
                      <p className={`text-sm font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{currentVertical.metrics.label}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{currentVertical.metrics.sub}</p>
                    </div>

                    <div className={`p-4 rounded-xl border space-y-2 ${
                      isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                    }`}>
                      <p className={`text-xs font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Zap className="w-4 h-4 text-amber-500" /> Bebas Biaya Tambahan Add-On
                      </p>
                      <p className="text-xs leading-relaxed">
                        Tidak seperti software kasir lain yang menagih biaya per modul (KDS bayar lagi, multi-meja bayar lagi), di PJTECH semua fitur sudah all-in.
                      </p>
                    </div>
                  </>
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
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className={`border rounded-3xl p-6 sm:p-10 lg:p-12  ${
            isDark 
              ? 'bg-slate-900/90 border-slate-800' 
              : 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 border-slate-200 shadow-sm'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                  Kenapa Beralih ke PJTECH?
                </span>
                <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Hemat hingga 70% Biaya POS per Tahun
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Aplikasi kasir lain seperti Moka POS dan Pawoon mengenakan biaya Rp 1.800.000 hingga Rp 2.400.000+ per tahun serta membebankan biaya tambahan untuk modul KDS dan multi-meja. Di PJTECH, Anda mendapatkan seluruh 4 vertikal bisnis all-in.
                </p>
                <div className="pt-2">
                  <Link
                    href="/comparison"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  >
                    <ArrowRight className="w-4 h-4 shrink-0" />
                    <span>Lihat Perbandingan Lengkap vs Moka, Pawoon, iReap & Qashier</span>
                  </Link>
                </div>
              </div>

              {/* Right Column (5 cols) - Clean Comparison Breakdown */}
              <div className="lg:col-span-5 w-full">
                <div className={`rounded-2xl p-5 border text-xs sm:text-sm space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 shadow-md text-slate-800'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-600">
                    <span>Fitur / Layanan</span>
                    <span className="text-blue-600 dark:text-blue-400">PJTECH vs Kompetitor</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold">4 Vertikal Bisnis</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">All-In (Included)</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold">Kitchen Display (KDS)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Gratis (No Addon)</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold">Tracking Servis & WA</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Included</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold">Import Produk via Excel</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Template Siap Pakai</span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t-2 border-slate-200 dark:border-slate-700">
                    <span className="font-black text-sm">Biaya Tahunan</span>
                    <div className="text-right">
                      <span className="font-black text-base text-blue-600 dark:text-blue-400">Rp 990.000</span>
                      <span className="text-[11px] text-slate-400 line-through ml-1.5">Rp 2.400.000</span>
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
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
                <Store className="w-5 h-5" />
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

    </div>
  );
}
