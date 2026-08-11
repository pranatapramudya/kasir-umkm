# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.67
**Fokus:** RBAC Frontend - Conditional Rendering & UX Siluman untuk Kasir

## 1. Analisis Kebutuhan UI/UX (Frontend Security)
*   **Status Saat Ini:** Middleware sudah berhasil memblokir akses rute `/admin` untuk role `CASHIER`. Namun, UI Navigasi (Sidebar & Bottom Nav) masih menampilkan semua menu admin secara statis.
*   **Kelemahan UX:** Jika kasir melihat dan mengklik menu "Dashboard", mereka akan di-*redirect* paksa. Ini adalah *bad practice*. Elemen yang tidak bisa diakses HARUS disembunyikan (*hidden*) sejak awal.
*   **Tujuan:** Menggunakan status *role* dari Clerk di sisi klien (*Client-Side*) untuk memfilter daftar menu navigasi dan menyembunyikan komponen sensitif (seperti tagihan/Paywall) dari layar kasir.

## 2. Instruksi Eksekusi Logika Frontend untuk AI Agent
Sebagai agen pengembang, fokuslah pada pemanfaatan *hook* Clerk dan manipulasi *Array* sebelum *rendering* JSX dilakukan. DILARANG MERUBAH CSS UTAMA LAYOUT.

### A. Ekstraksi Role di Komponen Navigasi
*   **Target File:** Komponen `Sidebar` (Desktop) dan `BottomNav` (Mobile).
*   **Instruksi Logika Hook:**
    1.  Jika komponen ini adalah *Client Component* (`"use client"`), *import* dan gunakan *hook* `useUser()` dari `@clerk/nextjs`.
    2.  Ekstrak nilai *role* pengguna saat ini dengan membaca: `user?.publicMetadata?.role`.
    3.  *(Alternatif jika Server Component):* Gunakan `auth().sessionClaims?.metadata?.role`.

### B. Filter Dinamis Array Navigasi
*   **Target Logika:** *Array* yang berisi daftar menu (misal: `const navItems = [...]`).
*   **Instruksi Filtering:**
    1.  Sebelum Anda melakukan `.map()` pada *array* `navItems` ke dalam JSX, Anda WAJIB memfilternya terlebih dahulu berdasarkan *role*.
    2.  **Logika Mutlak:** JIKA *role* pengguna adalah `'CASHIER'`, maka saring *array* tersebut sehingga HANYA menyisakan item yang memiliki *path/href* ke `/` (Kasir POS).
    3.  JIKA *role* BUKAN `'CASHIER'` (yaitu `OWNER` atau kosong/default), biarkan *array* utuh (tampilkan semua menu).
    4.  Lakukan *rendering* JSX menggunakan *array* yang sudah difilter tersebut. Hasilnya, kasir hanya akan melihat satu ikon/menu di *Sidebar* dan *Bottom Nav*.

### C. UX Cleanup: Sembunyikan Komponen Paywall/Billing
*   **Target File:** Area bawah dari `Sidebar` Desktop (tempat komponen "Akses Pro" / tombol Upgrade berada).
*   **Instruksi Logika:**
    1.  Bungkus komponen kartu "Akses Pro" tersebut dengan evaluasi *Conditional Rendering*.
    2.  **Logika Mutlak:** JIKA `role === 'CASHIER'`, JANGAN render (kembalikan `null`) komponen kartu tagihan ini. 
    3.  Kasir tidak memiliki wewenang atau kepentingan untuk melihat opsi *upgrade* SaaS toko tersebut.