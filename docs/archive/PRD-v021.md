# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.21
**Fokus:** Bugfix Clerk UserProfile Routing (Runtime Error)

## 1. Analisis Masalah
* **Routing Conflict pada Komponen Clerk:** Muncul *Runtime Error* dengan pesan `The <UserProfile/> component is not configured correctly` saat mengakses halaman Pengaturan.
* **Penyebab:** Komponen `<UserProfile />` bawaan Clerk memiliki sub-navigasi internal (Profil, Keamanan, Perangkat). Secara *default*, komponen ini menggunakan metode *path-based routing*. Karena file saat ini berada di rute statis tunggal (`app/admin/settings/page.tsx`) dan bukan di dalam rute *catch-all* Next.js (`[[...rest]]`), sistem mengalami bentrokan rute saat mencoba merender komponen.

## 2. Solusi Teknis & Instruksi untuk AI Agent
Implementasikan salah satu dari dua solusi di bawah ini untuk menyelesaikan masalah rute tersebut. (Disarankan menggunakan **Solusi A** agar tidak perlu merombak struktur *folder*).

### Solusi A: Penggunaan Hash-Based Routing (Direkomendasikan)
* **Target File:** `app/admin/settings/page.tsx`
* **Instruksi Eksekusi:** Modifikasi pemanggilan komponen Clerk dengan menambahkan properti `routing="hash"`. Pendekatan ini akan menggunakan *URL Hash* (misalnya `/admin/settings#security`) untuk berpindah tab tanpa memerlukan struktur *folder catch-all*.
* **Contoh Implementasi:** `<UserProfile routing="hash" />`

### Solusi B: Konversi ke Catch-All Route (Alternatif)
* **Target Struktur:** Direktori `app/admin/settings/`
* **Instruksi Eksekusi:**
  1. Ganti nama dan pindahkan rute dari `app/admin/settings/page.tsx` menjadi `app/admin/settings/[[...rest]]/page.tsx`.
  2. Modifikasi komponen menjadi `<UserProfile path="/admin/settings" routing="path" />`.