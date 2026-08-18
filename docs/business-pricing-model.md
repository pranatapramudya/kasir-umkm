# Business Pricing Model & Strategy 🚀

Perombakan strategi monetisasi dan pembuatan *Hardware Affiliate Hub* telah berhasil diterapkan secara menyeluruh (*End-to-End*). Berikut rincian pembaruannya:

## 1. Perombakan Harga & Strategi Decoy (Pricing Section)
Komponen kartu harga (`components/PricingSection.tsx`) telah diubah total untuk memaksimalkan strategi *Decoy Pricing*.
- **[Card 1] Pro 1 Bulan (Decoy):** Rp 129.000 / bulan. Dirancang sebagai *anchor* harga.
- **[Card 2] Pro 6 Bulan:** Rp 594.000 / 6 bulan. Opsi fleksibel menengah.
- **[Card 3] Pro 1 Tahun (Hero):** Rp 990.000 / 12 bulan (hanya Rp 82.500/bulan). 
  - Visual kartu ini telah dipertegas dengan bingkai warna oranye mencolok (`ring-2 ring-orange-500`), desain *shadow* khusus, serta penambahan *badge* **PALING HEMAT!** di bagian atas untuk menarik fokus pandangan pengguna seketika.
- *Bundling hardware* fisik pada form langganan telah **dihapus sepenuhnya** sesuai strategi bisnis terbaru, mengamankan Anda dari liabilitas garansi fisik.

## 2. Pembaruan Syarat & Ketentuan (T&C Legal Protection)
- Modal Syarat & Ketentuan saat pengguna akan berlangganan kini telah ditambahkan klausul tegas yang membebaskan *developer* dari klaim kerusakan perangkat keras fisik.
- Teks penafian (*disclaimer*) dengan *highlight* oranye berbunyi: *"PJTECH KASIR UMKM hanya menyediakan layanan perangkat lunak (Software). Seluruh perangkat keras (Hardware) yang dibeli melalui tautan rekomendasi pihak ketiga (Affiliate) adalah tanggung jawab penuh dari penjual/toko/marketplace terkait."*

## 3. Halaman "Rekomendasi Hardware" (Affiliate Hub)
- **Menu Baru:** Telah ditambahkan menu **"Rekomendasi Hardware"** dengan ikon *Printer* di dalam navigasi *Sidebar* (`lib/navigation.ts`), di bawah menu "Langganan".
- **Halaman Khusus (`/admin/hardware`):** Halaman *grid/card* yang bersih telah dibuat. Berisi 3 rekomendasi perangkat utama:
  1. Tablet Kasir Android 10 Inch
  2. Printer Thermal Bluetooth 58mm
  3. Stand Holder & Cash Drawer (Laci Uang)
- **Tombol Affiliate CTA:** Masing-masing perangkat memiliki 1 tombol (Beli di Shopee) yang siap diisi dengan tautan *Affiliate Link* milik Anda (sementara Tokopedia belum tersedia).
- Catatan kaki (*Disclaimer*) legal juga disematkan dengan ikon perisai (*ShieldAlert*) di bagian bawah halaman ini.

## Status Sistem
- Pembaruan UI komponen harga tersinkronisasi otomatis dengan halaman Onboarding (karena menggunakan *shared component* `PricingSection`).
- Seluruh aplikasi kini telah beralih sepenuhnya ke model 100% *Software-as-a-Service* (SaaS) tanpa risiko logistik.
