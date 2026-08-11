# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.1.72
**Fokus:** Bugfix Logic Secret Backdoor Superadmin di Landing Page

## 1. Analisis Bug
*   **Gejala:** Tampilan UI sudah sempurna, namun fungsionalitas pintu rahasia pada logo "PJTECH KASIR" di sebelah kanan tidak bekerja. Klik pada logo tidak memicu navigasi ke rute `/superadmin` meskipun pengguna telah memiliki *metadata* `role: "SUPERADMIN"`.
*   **Akar Masalah:** Kemungkinan agen sebelumnya gagal mengimplementasikan *conditional rendering* yang tepat antara Next.js `<Link>` dan pengecekan *role* Clerk, atau terjadi *hydration mismatch* jika menggunakan Client Component.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Perbaiki logika kondisional pada logo. DILARANG memberikan *output* kode mentah panjang, fokus pada blok kode logo saja.

### A. Perbaikan Conditional Wrapping (Clerk Auth)
*   **Target File:** `app/page.tsx`
*   **Instruksi:**
    1. Pastikan Anda membaca status pengguna dengan benar. 
       - Jika file ini adalah **Client Component** (`"use client"`), gunakan: 
         `const { user } = useUser();`
         `const isSuperadmin = user?.publicMetadata?.role === 'SUPERADMIN';`
       - Jika file ini adalah **Server Component**, gunakan:
         `const { sessionClaims } = auth();`
         `const isSuperadmin = sessionClaims?.metadata?.role === 'SUPERADMIN';`
    2. Ubah blok kode render logo menjadi *Ternary Operator* yang eksplisit:
       ```jsx
       {isSuperadmin ? (
         <Link className="cursor-pointer" href="/superadmin">
           {/* Elemen Logo Anda (Image/Teks) di sini */}
         </Link>
       ) : (
         <div className="cursor-default">
           {/* Elemen Logo Anda (Image/Teks) di sini */}
         </div>
       )}
       ```
    3. **Penting:** Pastikan komponen `<Link>` diimpor dari `next/link`. Jangan mengubah sedikit pun desain visual atau kelas Tailwind dari logo tersebut, hanya ubah *wrapper*-nya saja.

Silakan eksekusi perbaikan logika ini sekarang agar pintu rahasia (*backdoor*) berfungsi 100%!