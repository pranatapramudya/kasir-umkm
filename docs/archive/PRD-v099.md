# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.99
**Fokus:** Perombakan Arsitektur Pengambilan Data Timer (Bypass Clerk Stale Session, Direct Prisma Query)

## 1. Analisis Akar Masalah (Stale JWT Claims)
*   **Insiden (P0):** Setelah memilih paket "Trial", Sidebar pengguna tetap menampilkan "Belum ada paket aktif".
*   **Diagnosa Kritis:** Anda (AI Agent) mengambil data `endsAt` menggunakan `auth().sessionClaims?.metadata`. Ini adalah pendekatan yang BURUK untuk aplikasi SaaS *real-time*. Token sesi JWT Clerk (sessionClaims) di *browser* klien menjadi "stale" (kedaluwarsa) dan tidak langsung tersinkronisasi ketika *Server Action* memperbarui metadata di *backend*. Pengguna harus *logout* dan *login* agar UI terbarui.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Berhenti bergantung pada Clerk Metadata untuk urusan *billing/subscription realtime*. Alihkan sumber data (Source of Truth) langsung ke database utama (Prisma). DILARANG memberikan output kode mentah.

### A. Refaktor Pengambilan Data di Sidebar (Direct Database Query)
*   **Target File:** `components/Sidebar.tsx`
*   **Instruksi Arsitektur:**
    1. Pastikan file ini adalah Server Component (asinkron: `export default async function Sidebar()`).
    2. Ambil `userId` dari sesi saat ini: `const { userId } = auth();`
    3. **HAPUS** pengambilan data dari `sessionClaims`.
    4. Lakukan kueri langsung ke Prisma menggunakan `userId` tersebut. Contoh:
       `const tenant = await prisma.tenant.findUnique({ where: { ownerId: userId } });` (Sesuaikan dengan nama tabel dan kolom relasi pengguna di skema Anda).
    5. Ambil data nama paket dan tanggal kedaluwarsa langsung dari hasil kueri *database* tersebut:
       `const plan = tenant?.subscriptionPlan;`
       `const endsAt = tenant?.subscriptionEndsAt;`
    6. Oper nilai dari *database* ini ke komponen klien: `<CountdownTimer plan={plan} endsAt={endsAt} />`

### B. Konversi Tanggal yang Aman
*   **Target File:** `components/Sidebar.tsx`
*   **Instruksi Tambahan:** 
    Jika kueri Prisma mengembalikan objek `Date` JavaScript, Anda TIDAK BISA langsung mengopernya sebagai *props* ke Client Component di Next.js (akan memicu *error* serialisasi). Anda WAJIB mengubahnya menjadi ISO String terlebih dahulu saat mengopernya:
    `endsAt={endsAt ? endsAt.toISOString() : null}`

### C. Pembersihan Cache Next.js (Revalidation)
*   **Target File:** `app/onboarding/actions.ts` (Atau *Server Action* pemilihan paket).
*   **Instruksi:**
    Setelah eksekusi `prisma.tenant.update(...)` untuk menyimpan paket selesai, WAJIB panggil `revalidatePath('/admin', 'layout')` agar Next.js membersihkan *cache* rute dan memaksa Sidebar melakukan kueri ulang ke *database* untuk mendapatkan tanggal terbaru tanpa perlu memuat ulang (*refresh*) halaman secara manual.