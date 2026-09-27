"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
      title: "Retail & Toko",
      tagline: "Toko Kelontong, Minimarket, Fashion & Butik, Toko Bangunan",
      description: "Kelola ribuan stok produk dan multi-varian secara instan. Dukungan scan barcode super cepat dan laporan restock otomatis.",
      icon: Store,
      badgeColor: isDark ? "bg-blue-950/80 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200",
      accentColor: "from-blue-600 to-indigo-600",
      features: [
        { title: "Multi-Varian Produk", desc: "Kelola varian ukuran, warna, atau rasa dalam satu master SKU tanpa membingungkan kasir." },
        { title: "Barcode Scanner Cepat", desc: "Kompatibel barcode scanner USB/Bluetooth & scan langsung dari kamera HP kasir." },
        { title: "Stok Minim & Auto Restock", desc: "Peringatan otomatis saat stok barang menipis agar tidak pernah kehabisan barang jualan." },
        { title: "Cetak Label Harga & Struk", desc: "Langsung cetak label barcode rak dan struk belanja pelanggan via printer thermal Bluetooth." }
      ],
      link: "/solusi/retail",
      metrics: { label: "Kecepatan Checkout", value: "3 Detik", sub: "per transaksi kasir" }
    },
    fnb: {
      title: "F&B & Kuliner",
      tagline: "Restoran, Kafe, Coffee Shop, Bakery, Warung Makan",
      description: "Pesanan masuk langsung ke dapur via Kitchen Display System (KDS). Dilengkapi split bill, open bill meja, dan modifier rasa.",
      icon: Utensils,
      badgeColor: isDark ? "bg-orange-950/80 text-orange-300 border-orange-800" : "bg-orange-50 text-orange-700 border-orange-200",
      accentColor: "from-orange-500 to-amber-600",
      features: [
        { title: "Kitchen Display System (KDS)", desc: "Layar monitor dapur interaktif tanpa biaya tambahan. Dapur masak lebih cepat dan anti salah pesanan." },
        { title: "Split Bill & Open Bill", desc: "Pelanggan mau bayar pisah meja atau open bill dulu sebelum pulang? Semua ditangani sekali klik." },
        { title: "Modifier & Catatan Menu", desc: "Level pedas, less sugar, extra shot espresso, atau tanpa bawang tercatat rapi di struk dapur." },
        { title: "Routing Cetak Dapur vs Bar", desc: "Pesanan minuman otomatis tercetak di printer Bar, pesanan makanan otomatis tercetak di printer Dapur." }
      ],
      link: "/solusi/fnb",
      metrics: { label: "Efisiensi Dapur", value: "+45%", sub: "waktu saji lebih cepat" }
    },
    jasa: {
      title: "Jasa & Servis",
      tagline: "Bengkel Motor/Mobil, Laundry, Salon & Barbershop, Servis Elektronik",
      description: "Bukan sekadar transaksi kasir. Lacak status pengerjaan servis secara real-time dan kirim notifikasi WhatsApp otomatis ke pelanggan.",
      icon: Wrench,
      badgeColor: isDark ? "bg-emerald-950/80 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-200",
      accentColor: "from-emerald-600 to-teal-600",
      features: [
        { title: "Tracking Progres Servis Live", desc: "Pantau antrean dari status Menunggu, Sedang Dikerjakan teknisi, hingga Siap Diambil." },
        { title: "Notifikasi WhatsApp Otomatis", desc: "Pelanggan otomatis menerima WhatsApp saat servis atau cucian mereka selesai tanpa perlu ditelepon." },
        { title: "Invoice Gabungan Jasa + Part", desc: "Satu invoice rapi menggabungkan ongkos jasa mekanik dan harga suku cadang / sparepart." },
        { title: "Rekap Komisi Teknisi / Pegawai", desc: "Hitung otomatis persentase bagi hasil atau komisi per pengerjaan jasa mekanik/terapis." }
      ],
      link: "/solusi/jasa",
      metrics: { label: "Kepuasan Pelanggan", value: "99%", sub: "dengan update WA otomatis" }
    },
    rental: {
      title: "Rental & Properti",
      tagline: "Rental Mobil/Motor, Sewa Villa/Homestay, Sewa Kamera & Alat Berat",
      description: "Manajemen sewa berbasis waktu dengan kalender ketersediaan interaktif, perhitungan deposit, dan denda keterlambatan otomatis.",
      icon: Car,
      badgeColor: isDark ? "bg-purple-950/80 text-purple-300 border-purple-800" : "bg-purple-50 text-purple-700 border-purple-200",
      accentColor: "from-purple-600 to-indigo-600",
      features: [
        { title: "Kalender Ketersediaan Unit", desc: "Lihat ketersediaan mobil, kamar, atau unit alat secara visual agar tidak pernah terjadi double booking." },
        { title: "Kalkulasi Durasi Jam / Hari", desc: "Pilih durasi sewa harian, mingguan, atau 12 jam dengan perhitungan tarif fleksibel." },
        { title: "Sistem Deposit & Denda Telat", desc: "Catat uang jaminan/deposit dan kalkulasi denda otomatis jika unit dikembalikan melewati batas waktu." },
        { title: "Invoice & Surat Perjanjian A4", desc: "Cetak invoice formal A4 lengkap dengan identitas penyewa, nomor plat, dan syarat perjanjian sewa." }
      ],
      link: "/solusi/rental",
      metrics: { label: "Optimalisasi Armada", value: "100%", sub: "bebas bentrok jadwal" }
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
      q: "Berapa biaya langganan dan apakah ada biaya tersembunyi?",
      a: "Biaya sangat transparan: Rp 990.000 per tahun (hanya setara ~Rp 2.700 per hari). Semua 4 vertikal bisnis (Retail, F&B, Jasa, Rental) langsung terbuka tanpa ada biaya tambahan untuk Kitchen Display System (KDS), multi-kasir, ataupun pembatasan transaksi."
    },
    {
      q: "Apakah ada uji coba gratis (Free Trial)?",
      a: "Ya! Anda mendapatkan Uji Coba Gratis 14 Hari dengan akses penuh ke seluruh fitur Enterprise. Tidak memerlukan kartu kredit untuk mendaftar."
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans antialiased overflow-x-hidden ${
      isDark ? 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white' : 'bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white'
    }`}>
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className={`text-xs sm:text-sm py-2.5 px-4 text-center font-semibold flex items-center justify-center gap-2 border-b ${
        isDark 
          ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white border-slate-800' 
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-blue-700'
      }`}>
        <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider">
          PROMO
        </span>
        <span>
          <strong>Promo Spesial UMKM:</strong> Coba Gratis 14 Hari Semua Fitur Enterprise 4 Vertikal!
        </span>
        <Link 
          href="/sign-up?redirect_url=/onboarding"
          className="underline hover:text-blue-100 font-black ml-1 hidden sm:inline"
        >
          Daftar Sekarang →
        </Link>
      </div>

      {/* 2. STICKY NAVBAR */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
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
              <span className={`text-[10px] tracking-wider font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cloud POS Multi-Vertikal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold">
            {/* Dropdown Solusi Bisnis */}
            <div className="relative group py-2">
              <span className={`flex items-center gap-1 cursor-pointer transition-colors ${
                isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
              }`}>
                Solusi Bisnis <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
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
                    <p className="font-bold text-sm">Rental & Properti</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kalender & Deposit</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/comparison" className={`transition-colors ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              Perbandingan POS
            </Link>
            <Link href="/blog" className={`transition-colors ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              Blog & Tips
            </Link>
            <a href="#pricing" className={`transition-colors ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              Harga
            </a>
            <a href="#faq" className={`transition-colors ${
              isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-blue-600'
            }`}>
              FAQ
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? "Ganti ke Mode Putih (Default)" : "Ganti ke Mode Gelap"}
              aria-label="Toggle Tema"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login Dropdown (Owner vs Karyawan) */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                onBlur={() => setTimeout(() => setLoginDropdownOpen(false), 250)}
                className={`text-sm font-bold px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' 
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <span>Masuk</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {loginDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl p-2 shadow-2xl border z-50 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <Link
                    href="/sign-in?redirect_url=/auth-callback"
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-blue-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Masuk sebagai Owner</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Akses dashboard, omzet & kelola toko</p>
                    </div>
                  </Link>

                  <Link
                    href="/sign-in?redirect_url=/auth-callback"
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors border-t ${
                      isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-emerald-50'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Login sebagai Karyawan</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Akses Kasir POS, Kitchen Display & Servis</p>
                    </div>
                  </Link>

                  <Link
                    href="/superadmin"
                    className={`flex items-start gap-3 p-3 rounded-xl transition-colors border-t ${
                      isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-purple-50'
                    }`}
                  >
                    <ShieldAlert className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Portal Superadmin</p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kelola lisensi & tenant global</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Primary CTA */}
            <Link 
              href="/sign-up?redirect_url=/onboarding" 
              className="text-sm font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2"
            >
              Coba Gratis 14 Hari <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Actions: Theme + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              aria-label="Toggle Tema"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'
              }`}
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-1">
              <p className={`text-xs font-bold uppercase tracking-wider px-3 py-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>Solusi Vertikal</p>
              <Link href="/solusi/retail" className="block px-3 py-2 rounded-lg font-bold">🛒 Retail & Toko</Link>
              <Link href="/solusi/fnb" className="block px-3 py-2 rounded-lg font-bold">🍳 F&B & Kuliner</Link>
              <Link href="/solusi/jasa" className="block px-3 py-2 rounded-lg font-bold">🔧 Jasa & Servis</Link>
              <Link href="/solusi/rental" className="block px-3 py-2 rounded-lg font-bold">🚗 Rental & Properti</Link>
            </div>
            <div className={`border-t pt-3 space-y-2 font-bold ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <Link href="/comparison" className="block px-3 py-2 rounded-lg">Perbandingan POS</Link>
              <Link href="/blog" className="block px-3 py-2 rounded-lg">Blog & Panduan</Link>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg">Paket Harga</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg">FAQ</a>
            </div>
            <div className={`border-t pt-4 flex flex-col gap-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <Link 
                href="/sign-in?redirect_url=/auth-callback" 
                className={`w-full text-center py-3 font-bold rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                Masuk (Owner)
              </Link>
              <Link 
                href="/sign-in?redirect_url=/auth-callback" 
                className={`w-full text-center py-3 font-bold rounded-xl border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                Login sebagai Karyawan
              </Link>
              <Link 
                href="/sign-up?redirect_url=/onboarding" 
                className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl shadow-lg"
              >
                Daftar Trial Gratis 14 Hari
              </Link>
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
              : 'bg-white border-blue-200 text-slate-800'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold">
              SaaS Kasir Multi-Vertikal #1 Indonesia • <strong className="text-blue-600 dark:text-blue-400">4 Model Bisnis dalam 1 Akun</strong>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}>
            Satu Aplikasi Kasir Pintar untuk <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Semua Jenis Bisnis UMKM.
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Kelola operasional <strong>Retail</strong>, <strong>Restoran & Kafe (F&B)</strong>, <strong>Bengkel & Laundry (Jasa)</strong>, hingga <strong>Rental Mobil & Properti</strong> dalam satu platform. Lengkap dengan Kitchen Display, tracking WA, stok otomatis, dan laporan pajak.
          </p>

          {/* Dual High-Contrast CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
            <Link 
              href="/sign-up?redirect_url=/onboarding" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Coba Gratis 14 Hari <ArrowRight className="w-5 h-5" />
            </Link>
            
            {/* High-Contrast "Bandingkan vs Moka" Button */}
            <Link 
              href="/comparison" 
              className={`w-full sm:w-auto px-8 py-4 font-black text-lg rounded-2xl border-2 transition-all flex items-center justify-center gap-2 shadow-md ${
                isDark 
                  ? 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700 hover:border-slate-500' 
                  : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              Bandingkan vs Moka
            </Link>
          </div>

          {/* Micro Trust Points */}
          <div className={`flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-bold ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Tanpa Kartu Kredit</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Setup 5 Menit Langsung Jualan</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Kompatibel Semua Printer Bluetooth</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> Offline-First (Anti Internet Mati)</span>
          </div>

          {/* 4. HERO DASHBOARD BENTO PREVIEW */}
          <div className={`mt-14 relative max-w-5xl mx-auto rounded-[2.5rem] p-3 sm:p-4 border shadow-2xl transition-colors ${
            isDark 
              ? 'bg-slate-900/60 border-slate-800' 
              : 'bg-slate-200/80 border-slate-300 shadow-slate-300/50'
          }`}>
            <div className={`rounded-[2rem] p-4 sm:p-8 border grid grid-cols-1 md:grid-cols-12 gap-4 text-left transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              
              {/* Preview Card 1: Omzet & Profit */}
              <div className={`md:col-span-7 rounded-2xl p-6 border flex flex-col justify-between relative overflow-hidden transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-xs font-extrabold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                    <p className="font-semibold text-slate-500">Transaksi</p>
                    <p className="text-base font-black">142 Struk</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Rata-rata Struk</p>
                    <p className="text-base font-black">Rp 104.500</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Laba Bersih</p>
                    <p className="text-base font-black text-emerald-600 dark:text-emerald-400">Rp 6.120.000</p>
                  </div>
                </div>
              </div>

              {/* Preview Card 2: Multi-Vertikal Live Feeds */}
              <div className="md:col-span-5 flex flex-col gap-3">
                {/* F&B KDS Ticket */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between transition-colors ${
                  isDark ? 'bg-slate-900 border-orange-500/30' : 'bg-orange-50/70 border-orange-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 text-white rounded-xl"><Utensils className="w-4 h-4" /></div>
                    <div>
                      <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Meja 04 • KDS Dapur</p>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>2x Nasi Goreng, 1x Es Kopi</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-md">Dimasak 03:20</span>
                </div>

                {/* Jasa Tracking WA */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between transition-colors ${
                  isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl"><Wrench className="w-4 h-4" /></div>
                    <div>
                      <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Servis #1089 • NMax B 1234</p>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ganti Oli + Kampas Rem</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> WA Sent
                  </span>
                </div>

                {/* Rental Booking Calendar */}
                <div className={`rounded-2xl p-4 border flex items-center justify-between transition-colors ${
                  isDark ? 'bg-slate-900 border-purple-500/30' : 'bg-purple-50/70 border-purple-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-600 text-white rounded-xl"><Car className="w-4 h-4" /></div>
                    <div>
                      <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Avanza Veloz B 5678</p>
                      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sewa 3 Hari (Deposit OK)</p>
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
      <section className={`py-8 border-y transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-xs uppercase tracking-widest font-extrabold mb-6 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
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
            <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full uppercase">
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
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base transition-all border ${
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
          <div className={`rounded-3xl p-6 sm:p-10 border shadow-2xl transition-colors ${
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
                    <div key={idx} className={`p-4 rounded-2xl border transition-colors ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feat.title}</h4>
                          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href={currentVertical.link}
                    className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all"
                  >
                    Pelajari Solusi {currentVertical.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/sign-up?redirect_url=/onboarding"
                    className={`w-full sm:w-auto px-6 py-3.5 font-bold rounded-xl flex items-center justify-center text-sm border transition-all ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    Coba Gratis 14 Hari
                  </Link>
                </div>
              </div>

              {/* Right Column: Metric Callout & Illustration */}
              <div className={`lg:col-span-5 p-6 sm:p-8 rounded-2xl border flex flex-col justify-between space-y-6 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <div>
                  <span className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Hasil Terbukti
                  </span>
                  <h4 className="text-4xl sm:text-5xl font-black text-blue-600 mt-2">
                    {currentVertical.metrics.value}
                  </h4>
                  <p className={`text-sm font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{currentVertical.metrics.label}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentVertical.metrics.sub}</p>
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
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. ENTERPRISE ARCHITECTURE FOR UMKM */}
      <section className={`py-20 border-t transition-colors ${
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className={`p-8 rounded-3xl border transition-all space-y-4 ${
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
            <div className={`p-8 rounded-3xl border transition-all space-y-4 ${
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

            {/* Feature 3 */}
            <div className={`p-8 rounded-3xl border transition-all space-y-4 ${
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
          
          <div className={`border rounded-3xl p-8 sm:p-12 transition-colors ${
            isDark 
              ? 'bg-slate-900 border-blue-500/30' 
              : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Kenapa Pindah ke PJTECH?
                </span>
                <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  Hemat hingga 70% Biaya POS per Tahun
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Kompetitor seperti Moka POS dan Pawoon mengenakan biaya Rp 1.800.000 - Rp 2.400.000+ per tahun dan membatasi jenis usaha hanya pada F&B atau Retail saja. Di PJTECH, Anda mendapatkan 4 vertikal all-in hanya <strong>Rp 990.000 / tahun</strong>.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/comparison" 
                    className="inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 underline"
                  >
                    Lihat tabel perbandingan lengkap vs Moka, Pawoon, iReap & Qashier →
                  </Link>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300 shadow-md'
              }`}>
                <p className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Harga PJTECH All-In</p>
                <h3 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>Rp 990.000<span className="text-sm font-medium text-slate-500"> / thn</span></h3>
                <p className="text-xs text-emerald-600 font-extrabold">Hanya Rp 2.700 per hari</p>
                <Link
                  href="/sign-up?redirect_url=/onboarding"
                  className="w-full block py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Mulai Coba 14 Hari
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 9. TRANSPARENT PRICING SECTION - 4 EXACT TIERS */}
      <section id="pricing" className={`py-20 md:py-28 border-t transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
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
            <div className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
              <div>
                <div className="mb-5">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mulai Usaha</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pengguna baru yang ragu dan ingin mencoba.
                  </p>
                </div>
                
                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Rp 0</div>
                  <div className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gratis 14 Hari Pertama</div>
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

              <Link
                href="/sign-up?redirect_url=/onboarding"
                className={`w-full py-3 text-xs sm:text-sm rounded-xl font-bold text-center transition-all ${
                  isDark 
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Coba Gratis 14 Hari
              </Link>
            </div>

            {/* 2. Pro 1 Bulan */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
              <div>
                <div className="mb-5">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro 1 Bulan</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Untuk mencoba fitur lengkap kasir pintar.
                  </p>
                </div>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp 129k <span className="text-xs font-normal text-slate-500">/ bulan</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">Total: Rp 129.000 / 1 bulan</div>
                  <div className="text-[11px] text-slate-400 italic mt-0.5">(Hanya Software)</div>
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

              <a
                href="https://pranajayatech.myr.id/pl/kasir-umkm-pro-1-bulan"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 text-xs sm:text-sm rounded-xl font-bold text-center transition-all ${
                  isDark 
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Pilih 1 Bulan
              </a>
            </div>

            {/* 3. Pro 6 Bulan */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}>
              <div>
                <div className="mb-5">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Pro 6 Bulan</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    UMKM yang butuh fleksibilitas cashflow.
                  </p>
                </div>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp 99k <span className="text-xs font-normal text-slate-500">/ bulan</span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">Total: Rp 594.000 / 6 bulan</div>
                  <div className="text-[11px] text-slate-400 italic mt-0.5">(Hanya Software)</div>
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

              <a
                href="https://pranajayatech.myr.id/pl/kasir-umkm-pro-6-bulan"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 text-xs sm:text-sm rounded-xl font-bold text-center transition-all ${
                  isDark 
                    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Pilih 6 Bulan
              </a>
            </div>

            {/* 4. Pro 1 Tahun (HERO CARD) */}
            <div className={`rounded-3xl p-6 flex flex-col justify-between relative border-2 ring-2 ring-orange-500 ring-offset-2 transition-all ${
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
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pemilik bisnis serius yang mencari nilai terbaik.
                  </p>
                </div>

                <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className={`text-3xl font-black flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Rp 82.5k <span className="text-xs font-bold text-slate-500">/ bulan</span>
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

              <a
                href="https://pranajayatech.myr.id/pl/kasir-umkm-pro-1-tahun"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 text-xs sm:text-sm rounded-xl font-black text-center text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30 transition-all block"
              >
                Pilih Paket Paling Hemat
              </a>
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
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs sm:text-sm space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <p className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Lisensi Perangkat Lunak (Software)</p>
                <p className="text-slate-500 dark:text-slate-400">
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
              className="w-full mt-6 py-3 bg-slate-950 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 font-bold rounded-xl text-sm transition-colors"
            >
              Saya Mengerti dan Setuju
            </button>
          </div>
        </div>
      )}

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className={`py-20 md:py-28 border-t transition-colors ${
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
                  className={`border rounded-2xl overflow-hidden transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 transition-colors ${
                      isDark ? 'hover:bg-slate-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
            <Link
              href="/sign-up?redirect_url=/onboarding"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 hover:bg-slate-100 font-black text-lg rounded-2xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Mulai Trial Gratis 14 Hari <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in?redirect_url=/auth-callback"
              className="w-full sm:w-auto px-8 py-4 bg-blue-950/50 hover:bg-blue-950/70 text-white font-black text-lg rounded-2xl border border-white/30 transition-all"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className={`border-t py-16 text-sm transition-colors ${
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
            <p className="text-xs text-slate-400">
              Dikembangkan oleh <strong>Pranajaya Tech (PJTech)</strong>.
            </p>
          </div>

          {/* Col 2: Solusi */}
          <div className="space-y-3">
            <p className="font-black text-white text-xs uppercase tracking-wider">Solusi Vertikal</p>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li><Link href="/solusi/retail" className="hover:text-white transition-colors">POS Retail & Toko</Link></li>
              <li><Link href="/solusi/fnb" className="hover:text-white transition-colors">POS Resto & Kafe (F&B)</Link></li>
              <li><Link href="/solusi/jasa" className="hover:text-white transition-colors">POS Bengkel & Jasa</Link></li>
              <li><Link href="/solusi/rental" className="hover:text-white transition-colors">POS Rental & Properti</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigasi */}
          <div className="space-y-3">
            <p className="font-black text-white text-xs uppercase tracking-wider">Akses Portal</p>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li><Link href="/sign-in?redirect_url=/auth-callback" className="hover:text-white transition-colors">Masuk (Owner)</Link></li>
              <li><Link href="/sign-in?redirect_url=/auth-callback" className="hover:text-emerald-400 transition-colors">Login Karyawan / Kasir</Link></li>
              <li><Link href="/comparison" className="hover:text-white transition-colors">Perbandingan POS</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Tips Bisnis</Link></li>
              <li><Link href="/superadmin" className="hover:text-purple-400 transition-colors">Superadmin</Link></li>
            </ul>
          </div>

          {/* Col 4: Media Sosial */}
          <div className="space-y-3">
            <p className="font-black text-white text-xs uppercase tracking-wider">Media Sosial Resmi</p>
            <ul className="space-y-2 text-xs sm:text-sm font-semibold">
              <li>
                <a href="https://www.tiktok.com/@pranajayatech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  TikTok: @pranajayatech
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/pranajayatech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram: @pranajayatech
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@pranajayatech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  YouTube: @pranajayatech
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
