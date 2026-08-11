# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.56
**Fokus:** HOTFIX - Parsing ECMAScript Failed (Unterminated Regexp Literal)

## 1. Analisis Bug Sintaksis (P0 Blocker)
*   **Gejala:** Build Next.js gagal dengan *error* `Parsing ecmascript source code failed` pada file `components/PaywallModal.tsx` di baris 177.
*   **Akar Masalah (Root Cause):** Terdapat kesalahan pemformatan sintaks (Syntax Error) saat menggunakan fungsi `createPortal`. Argumen pertama dari `createPortal` berupa bongkahan JSX yang sangat panjang dan diakhiri dengan `</div>,`. *Compiler* Turbopack salah mengartikan garis miring `/` pada tag penutup div tersebut sebagai pembuka *Regular Expression* karena argumen JSX tersebut dibiarkan telanjang tanpa dibungkus tanda kurung pengaman.

## 2. Instruksi Eksekusi Super Ketat untuk AI Agent
Sebagai agen pengembang, tugas Anda HANYA memperbaiki *Syntax Error* ini. DILARANG MEROMBAK LOGIKA ATAU MENAMBAHKAN ELEMEN BARU.

### A. Isolasi Argumen JSX (Parenthesis Wrapping)
*   **Target File:** `components/PaywallModal.tsx` (Fokus di sekitar baris 177 tempat fungsi `createPortal` dipanggil).
*   **Instruksi Perbaikan Sintaks:**
    1. Periksa pemanggilan fungsi `createPortal` yang Anda buat sebelumnya.
    2. Fungsi ini menerima dua argumen: Elemen JSX dan Target Node (yaitu `document.body`).
    3. Anda **DIWAJIBKAN** membungkus seluruh argumen pertama (mulai dari tag pembuka `<div...>` paling atas hingga tag penutup `</div>` sebelum koma) menggunakan tanda kurung biasa `( )`.
    4. *Visualisasi Logika (Bukan Kode Absolut):* 
       Ubah struktur yang awalnya: `return createPortal( <div...>...</div>, document.body );`
       Menjadi struktur yang terisolasi: `return createPortal( ( <div...>...</div> ), document.body );`

### B. Validasi Terminal Turbopack
*   Simpan file yang sudah dikoreksi tanda kurungnya.
*   Perhatikan log terminal. *Error* `Unterminated regexp literal` HARUS hilang seketika, dan terminal wajib menunjukkan status *Compiled in xxx ms*.
*   Halaman aplikasi tidak boleh lagi menampakkan layar hitam *Build Error*.