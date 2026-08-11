# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.31
**Fokus:** Hotfix Runtime Error (ReferenceError) & Strict Feature Toggling (Isolasi Menu Sidebar)

## 1. Analisis Bug Kritis (P0)
*   **Bug 1 (UI Crash):** Terdapat `ReferenceError: tenantName is not defined` pada file `app/page-client.tsx`. Aplikasi mencoba merender variabel yang tidak di-deklarasi di dalam *scope* komponen tersebut.
*   **Bug 2 (Cross-Category Leak):** Pengguna dengan `kategoriUsaha` = "Retail" melihat menu "Kasir Resto" dan "Manajemen Meja" di Sidebar. Logika *Conditional Rendering* di Sidebar gagal membaca kategori akun yang sedang aktif.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perbaikan langsung pada *codebase*. DILARANG memberikan *output* kode mentah.

### A. Fix ReferenceError `tenantName`
*   **Target File:** `app/page-client.tsx` (dan *Server Component* parent-nya jika ada, misalnya `app/page.tsx`).
*   **Instruksi:** 
    1. Pastikan komponen *Client* `POSApp` (atau nama komponen di file tersebut) menerima `tenantName` sebagai *Props*, atau mendefinisikannya melalui *State* / API Fetching. 
    2. Contoh perbaikan via Props: `interface Props { tenantName: string; ... }`. Pastikan *Server Component* membantunya mengambil data nama toko dari database dan mengopernya ke komponen klien ini.
    3. Jika data sedang *loading*, berikan *fallback* string kosong atau *skeleton* agar aplikasi tidak *crash*.

### B. Strict Feature Toggling di Sidebar
*   **Target File:** `components/SidebarClient.tsx` (serta `layout.tsx` yang memanggilnya).
*   **Instruksi Server Side:**
    1. Pastikan komponen Server yang membungkus Sidebar secara eksplisit mengambil `kategoriUsaha` dari tabel `Tenant` milik *current user* (menggunakan Prisma).
    2. Oper `kategoriUsaha` tersebut ke `SidebarClient` sebagai *Props* (contoh: `<SidebarClient kategoriUsaha={tenant.kategoriUsaha} />`).
*   **Instruksi Client Side (`SidebarClient.tsx`):**
    1. Buat logika *rendering* yang SANGAT KETAT (*Strict Mapping*) berdasarkan *Props* `kategoriUsaha`:
       - **Jika `Retail`:** Menu Kasir bernama "Kasir POS". SEMBUNYIKAN menu "Manajemen Meja".
       - **Jika `F&B / Kuliner`:** Menu Kasir bernama "Kasir Resto". TAMPILKAN menu "Manajemen Meja".
       - **Jika `Jasa / Servis`:** Menu Kasir bernama "Kasir POS" (atau Layanan). SEMBUNYIKAN menu "Manajemen Meja". Ganti nama menu "Produk" menjadi "Layanan".
    2. Jangan ada menu yang di-render secara *default* jika tidak sesuai dengan kategorinya.

Silakan eksekusi kedua Hotfix ini SEKARANG JUGA. Pastikan layar tidak lagi merah dan isolasi menu per kategori bisnis bekerja 100% sempurna tanpa kebocoran UI!