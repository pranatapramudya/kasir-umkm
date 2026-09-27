"use client";

import React, { useState } from 'react';
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
  Sparkles,
  ChevronDown,
  Layers,
  Clock,
  Receipt,
  Users,
  MessageSquare,
  Check,
  Menu,
  X,
  CreditCard,
  QrCode
} from "lucide-react";

export default function LandingPageClient() {
  const [activeTab, setActiveTab] = useState<'retail' | 'fnb' | 'jasa' | 'rental'>('retail');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const verticals = {
    retail: {
      title: "Retail & Toko",
      tagline: "Toko Kelontong, Minimarket, Fashion & Butik, Toko Bangunan",
      description: "Kelola ribuan stok produk dan multi-varian secara instan. Dukungan scan barcode super cepat dan laporan restock otomatis.",
      icon: Store,
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      accentColor: "from-blue-600 to-indigo-600",
      features: [
        { title: "Multi-Varian Produk", desc: "Kelola varian ukuran, warna, atau rasa dalam satu master SKU tanpa membingungkan kasir." },
        { title: "Barcode Scanner Cepat", desc: "Kompatibel barcode scanner USB/Bluetooth & scan langsung dari kamera HP kasir." },
        { title: "Stok Minim & Auto Restock", desc: "Peringatan otomatis saat stok barang menipis sehingga Anda tidak pernah kehabisan barang jualan." },
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
      badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
      accentColor: "from-orange-500 to-amber-600",
      features: [
        { title: "Kitchen Display System (KDS)", desc: "Layar monitor dapur interaktif tanpa biaya langganan tambahan. Dapur masak lebih cepat dan anti salah pesanan." },
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
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accentColor: "from-emerald-600 to-teal-600",
      features: [
        { title: "Tracking Progres Servis Live", desc: "Pantau antrean dari status Menunggu, Sedang Dikerjakan teknisi, hingga Siap Diambil." },
        { title: "Notifikasi WhatsApp Otomatis", desc: "Pelanggan otomatis menerima WhatsApp saat servis atau cucian mereka selesai tanpa perlu ditelepon satu per satu." },
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
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
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
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm py-2.5 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
        <span>
          <strong>Promo Spesial UMKM:</strong> Coba Gratis 14 Hari Semua Fitur Enterprise 4 Vertikal!
        </span>
        <Link 
          href="/sign-up?redirect_url=/onboarding"
          className="underline hover:text-blue-100 font-bold ml-1 hidden sm:inline"
        >
          Daftar Sekarang →
        </Link>
      </div>

      {/* 2. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                PJTECH <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">KASIR UMKM</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">Cloud POS Multi-Vertikal</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <div className="relative group py-2">
              <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
                Solusi Bisnis <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </span>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-64 bg-slate-800/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link href="/solusi/retail" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/60 text-slate-200 hover:text-white transition-colors">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Store className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Retail & Toko</p>
                    <p className="text-xs text-slate-400">Barcode & Multi-Varian</p>
                  </div>
                </Link>
                <Link href="/solusi/fnb" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/60 text-slate-200 hover:text-white transition-colors">
                  <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><Utensils className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">F&B & Resto</p>
                    <p className="text-xs text-slate-400">KDS & Meja Split Bill</p>
                  </div>
                </Link>
                <Link href="/solusi/jasa" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/60 text-slate-200 hover:text-white transition-colors">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Wrench className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Jasa & Servis</p>
                    <p className="text-xs text-slate-400">Antrean & Tracking WA</p>
                  </div>
                </Link>
                <Link href="/solusi/rental" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/60 text-slate-200 hover:text-white transition-colors">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Car className="w-4 h-4" /></div>
                  <div>
                    <p className="font-bold text-sm">Rental & Properti</p>
                    <p className="text-xs text-slate-400">Kalender & Deposit</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/comparison" className="hover:text-white transition-colors">
              Perbandingan POS
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog & Tips
            </Link>
            <a href="#pricing" className="hover:text-white transition-colors">
              Harga
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/sign-in?redirect_url=/auth-callback" 
              className="text-sm font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all"
            >
              Masuk
            </Link>
            <Link 
              href="/sign-up?redirect_url=/onboarding" 
              className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 active:scale-95 transition-all flex items-center gap-2"
            >
              Coba Gratis 14 Hari <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1">Solusi Vertikal</p>
              <Link href="/solusi/retail" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">🛒 Retail & Toko</Link>
              <Link href="/solusi/fnb" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">🍳 F&B & Kuliner</Link>
              <Link href="/solusi/jasa" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">🔧 Jasa & Servis</Link>
              <Link href="/solusi/rental" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">🚗 Rental & Properti</Link>
            </div>
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <Link href="/comparison" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Perbandingan POS</Link>
              <Link href="/blog" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Blog & Panduan</Link>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 font-medium">Harga</a>
            </div>
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
              <Link 
                href="/sign-in?redirect_url=/auth-callback" 
                className="w-full text-center py-3 bg-slate-800 text-white font-bold rounded-xl border border-slate-700"
              >
                Masuk (Owner / Karyawan)
              </Link>
              <Link 
                href="/sign-up?redirect_url=/onboarding" 
                className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg"
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              SaaS Kasir Multi-Vertikal #1 di Indonesia • <span className="text-blue-400">4 Model Bisnis dalam 1 Akun</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
            Satu Aplikasi Kasir Pintar untuk <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Semua Jenis Bisnis UMKM.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Kelola operasional <strong>Retail</strong>, <strong>Restoran & Kafe (F&B)</strong>, <strong>Bengkel & Laundry (Jasa)</strong>, hingga <strong>Rental Mobil & Properti</strong> dalam satu platform. Lengkap dengan Kitchen Display, tracking WA, stok otomatis, dan laporan pajak.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
            <Link 
              href="/sign-up?redirect_url=/onboarding" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Coba Gratis 14 Hari <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/comparison" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-bold text-lg rounded-2xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              Bandingkan vs Moka
            </Link>
          </div>

          {/* Micro Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Tanpa Kartu Kredit</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Setup 5 Menit Langsung Jualan</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Kompatibel Semua Printer Bluetooth</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-400" /> Offline-First (Anti Internet Mati)</span>
          </div>

          {/* 4. HERO DASHBOARD BENTO PREVIEW */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-[2.5rem] p-3 sm:p-4 bg-gradient-to-b from-slate-700/50 to-slate-800/20 border border-slate-700/60 shadow-2xl shadow-blue-950/60">
            <div className="bg-slate-950 rounded-[2rem] p-4 sm:p-8 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              
              {/* Preview Card 1: Omzet & Profit */}
              <div className="md:col-span-7 bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Penjualan Hari Ini</p>
                    <h3 className="text-3xl sm:text-4xl font-black text-white mt-1">Rp 14.850.000</h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                    +18.4% vs kemarin
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <p className="text-slate-500 font-medium">Transaksi</p>
                    <p className="text-base font-bold text-slate-200">142 Struk</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Rata-rata Struk</p>
                    <p className="text-base font-bold text-slate-200">Rp 104.500</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Laba Bersih</p>
                    <p className="text-base font-bold text-emerald-400">Rp 6.120.000</p>
                  </div>
                </div>
              </div>

              {/* Preview Card 2: Multi-Vertikal Live Feeds */}
              <div className="md:col-span-5 flex flex-col gap-3">
                {/* F&B KDS Ticket */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-orange-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl"><Utensils className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-white">Meja 04 • KDS Dapur</p>
                      <p className="text-[11px] text-slate-400">2x Nasi Goreng, 1x Es Kopi</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md">Dimasak 03:20</span>
                </div>

                {/* Jasa Tracking WA */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl"><Wrench className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-white">Servis #1089 • NMax B 1234</p>
                      <p className="text-[11px] text-slate-400">Ganti Oli + Kampas Rem</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> WA Sent
                  </span>
                </div>

                {/* Rental Booking Calendar */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-purple-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl"><Car className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-white">Avanza Veloz B 5678</p>
                      <p className="text-[11px] text-slate-400">Sewa 3 Hari (Deposit OK)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">Ready 14:00</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. HARDWARE & LOGO TRUST STRIP */}
      <section className="py-8 bg-slate-950 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">
            Terintegrasi Native dengan Hardware & Pembayaran Modern
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-center text-slate-400 text-xs sm:text-sm font-semibold">
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <QrCode className="w-5 h-5 text-blue-400" /> QRIS All Payment
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <Printer className="w-5 h-5 text-indigo-400" /> Bluetooth 58/80mm
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <WifiOff className="w-5 h-5 text-emerald-400" /> Offline-First Sync
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <Smartphone className="w-5 h-5 text-purple-400" /> Android / iOS / PC
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" /> Ekspor Jurnal/Pajak
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Cloud Backup 24/7
            </div>
          </div>
        </div>
      </section>

      {/* 6. 4 VERTICALS INTERACTIVE SHOWCASE */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full">
              Dirancang Spesifik Tiap Industri
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-4 mb-4">
              4 Model Bisnis. Satu Aplikasi Kasir.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Setiap jenis usaha memiliki alur operasional yang berbeda. PJTECH mengadaptasi fitur kasir sesuai vertikal bisnis Anda secara otomatis.
            </p>
          </div>

          {/* Vertical Tab Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12">
            {(Object.keys(verticals) as Array<keyof typeof verticals>).map((key) => {
              const item = verticals[key];
              const Icon = item.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${item.accentColor} text-white shadow-lg scale-105`
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Vertical Details Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Descriptions & Features */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    {currentVertical.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    Fitur Lengkap untuk Operasional {currentVertical.title}
                  </h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {currentVertical.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {currentVertical.features.map((feat, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">{feat.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href={currentVertical.link}
                    className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all"
                  >
                    Pelajari Solusi {currentVertical.title} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/sign-up?redirect_url=/onboarding"
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center text-sm border border-slate-700 transition-all"
                  >
                    Coba Gratis 14 Hari
                  </Link>
                </div>
              </div>

              {/* Right Column: Metric Callout & Illustration */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Terbukti</span>
                  <h4 className="text-4xl sm:text-5xl font-black text-white mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                    {currentVertical.metrics.value}
                  </h4>
                  <p className="text-sm font-semibold text-slate-300 mt-1">{currentVertical.metrics.label}</p>
                  <p className="text-xs text-slate-500">{currentVertical.metrics.sub}</p>
                </div>

                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Bebas Biaya Tambahan Add-On
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tidak seperti software kasir lain yang menagih biaya per modul (KDS bayar lagi, multi-meja bayar lagi), di PJTECH semua fitur sudah all-in.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. ENTERPRISE ARCHITECTURE FOR UMKM */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
              Teknologi Kelas Enterprise, Harga Ramah UMKM
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Dibangun dengan standar keamanan dan keandalan tinggi agar operasional kasir Anda berjalan mulus tanpa henti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Offline-First Resilience</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Koneksi internet toko sering terputus? Kasir tetap bisa melayani antrean transaksi dengan IndexedDB browser lokal. Data otomatis tersinkronisasi saat sinyal kembali.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Ekspor Laporan Pajak & Jurnal</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tutup buku harian dan bulanan tanpa pusing. Ekspor data penjualan, rekap PPN, dan HPP dalam format CSV yang siap diimpor ke software akuntansi (Jurnal / Mekari).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Multi-Outlet & Multi-Staff RBAC</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pantau performa banyak cabang toko dari satu akun Owner. Pisahkan hak akses kasir dan staf dengan sistem Role-Based Access Control ketat untuk mencegah kecurangan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. COMPETITOR COMPARISON SUMMARY */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/20 px-3 py-1 rounded-full">
                  Kenapa Pindah ke PJTECH?
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Hemat hingga 70% Biaya POS per Tahun
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Kompetitor seperti Moka POS dan Pawoon mengenakan biaya Rp 1.800.000 - Rp 2.400.000+ per tahun dan membatasi jenis usaha hanya pada F&B atau Retail saja. Di PJTECH, Anda mendapatkan 4 vertikal all-in hanya <strong>Rp 990.000 / tahun</strong>.
                </p>
                <div className="pt-2">
                  <Link 
                    href="/comparison" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Lihat tabel perbandingan lengkap vs Moka, Pawoon, iReap & Qashier →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700/80 text-center space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase">Harga PJTECH All-In</p>
                <h3 className="text-4xl font-black text-white">Rp 990.000<span className="text-sm font-medium text-slate-400"> / thn</span></h3>
                <p className="text-xs text-emerald-400 font-semibold">Hanya Rp 2.700 per hari</p>
                <Link
                  href="/sign-up?redirect_url=/onboarding"
                  className="w-full block py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Mulai Coba 14 Hari
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 9. TRANSPARENT PRICING SECTION */}
      <section id="pricing" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Harga Transparan</span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-4">
              Satu Harga untuk Semua Fitur
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Tanpa biaya per transaksi, tanpa biaya instalasi, tanpa biaya add-on tersembunyi.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-slate-900 border-2 border-blue-500 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              Paket Juara UMKM (Paling Hemat)
            </div>

            <div className="text-center pb-6 border-b border-slate-800">
              <h3 className="text-2xl font-black text-white">Langganan 1 Tahun</h3>
              <p className="text-slate-400 text-xs mt-1">Akses penuh ke semua modul bisnis</p>
              <div className="mt-4">
                <span className="text-4xl sm:text-5xl font-black text-white">Rp 990.000</span>
                <span className="text-slate-400 text-sm font-medium"> / tahun</span>
              </div>
              <p className="text-xs text-emerald-400 font-bold mt-1">Setara Rp 82.500 / bulan (~Rp 2.700 / hari)</p>
            </div>

            <div className="py-6 space-y-3.5 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>4 Vertikal Aktif</strong> (Retail, F&B, Jasa, Rental)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Unlimited Transaksi & Produk</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Kitchen Display System (KDS)</strong> Dapur & Bar</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Tracking Servis Jasa & Notifikasi WA</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Kalender Booking Rental & Invoice A4</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Multi-Kasir & Multi-Perangkat</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Laporan Pajak PPN & Ekspor Akuntansi CSV</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Update Fitur Gratis Selamanya</strong></span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/sign-up?redirect_url=/onboarding"
                className="w-full block text-center py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
              >
                Mulai Trial Gratis 14 Hari
              </Link>
              <p className="text-[11px] text-center text-slate-500 mt-3 font-medium">
                Coba dulu gratis 14 hari tanpa kartu kredit. Aktifkan lisensi kapan saja.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 10. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Semua hal yang perlu Anda ketahui tentang PJTECH Kasir UMKM.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-bold text-base sm:text-lg text-white">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. FINAL HIGH CONVERTING CTA BANNER */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Siap Tingkatkan Omzet & Rapikan Kasir Toko Anda?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            Bergabunglah dengan pelaku usaha UMKM Indonesia yang telah beralih ke PJTECH. Setup dalam 5 menit, langsung jualan hari ini.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up?redirect_url=/onboarding"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-black text-lg rounded-2xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Mulai Trial Gratis 14 Hari <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/sign-in?redirect_url=/auth-callback"
              className="w-full sm:w-auto px-8 py-4 bg-blue-900/40 hover:bg-blue-900/60 text-white font-bold text-lg rounded-2xl border border-white/20 transition-all"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* 12. STARTUP FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-16 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">PJTECH KASIR UMKM</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Sistem POS SaaS multi-vertikal untuk UMKM Indonesia. Membantu digitalisasi operasional Retail, F&B, Jasa, dan Rental dengan arsitektur cloud cepat & hemat biaya.
            </p>
            <p className="text-xs text-slate-500">
              Dikembangkan oleh <strong>Pranajaya Tech (PJTech)</strong>.
            </p>
          </div>

          {/* Col 2: Solusi */}
          <div className="space-y-3">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Solusi Vertikal</p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/solusi/retail" className="hover:text-white transition-colors">POS Retail & Toko</Link></li>
              <li><Link href="/solusi/fnb" className="hover:text-white transition-colors">POS Resto & Kafe (F&B)</Link></li>
              <li><Link href="/solusi/jasa" className="hover:text-white transition-colors">POS Bengkel & Jasa</Link></li>
              <li><Link href="/solusi/rental" className="hover:text-white transition-colors">POS Rental & Properti</Link></li>
            </ul>
          </div>

          {/* Col 3: Navigasi */}
          <div className="space-y-3">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Produk & Edukasi</p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/comparison" className="hover:text-white transition-colors">Perbandingan POS</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Tips Bisnis</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Paket Harga</a></li>
              <li><Link href="/sign-in?redirect_url=/auth-callback" className="hover:text-white transition-colors">Portal Kasir / Owner</Link></li>
              <li><Link href="/superadmin" className="hover:text-white transition-colors">Superadmin</Link></li>
            </ul>
          </div>

          {/* Col 4: Media Sosial */}
          <div className="space-y-3">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Media Sosial Resmi</p>
            <ul className="space-y-2 text-xs sm:text-sm">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
