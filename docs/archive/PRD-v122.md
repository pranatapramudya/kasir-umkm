# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.1.22
**Fokus:** Micro-interaction (Copy to Clipboard) untuk Nomor Rekening

## 1. Analisis Bug UX & Kebutuhan Fitur
*   **Friction dalam Pembayaran:** Saat ini nomor rekening "901331745328" hanya berupa teks statis. Pengguna (terutama di perangkat *mobile*) akan kesulitan jika harus mengetik ulang nomor tersebut ke aplikasi perbankan mereka.
*   **Solusi UX:** Tambahkan tombol salin (*copy*) yang interaktif di sebelah nomor rekening, lengkap dengan *feedback* visual sementara (seperti ikon berubah menjadi centang hijau) agar pengguna tahu teks telah berhasil disalin.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan perombakan langsung pada komponen `CheckoutModal`. DILARANG memberikan *output* kode mentah.

### A. Implementasi State & Fungsi Salin
*   **Target File:** Komponen `CheckoutModal` (di dalam `SubscriptionClient.tsx`).
*   **Instruksi React Logic:**
    1. Tambahkan *state* lokal untuk melacak status salin: `const [isCopied, setIsCopied] = useState(false);`
    2. Buat fungsi `handleCopy` yang memanfaatkan Clipboard API:
       `navigator.clipboard.writeText("901331745328")`
    3. Setelah berhasil menyalin, set `setIsCopied(true)`. Gunakan `setTimeout` selama 2000ms (2 detik) untuk mengembalikan status `setIsCopied(false)`.

### B. Pembaruan UI Nomor Rekening
*   **Instruksi Tailwind & Ikon:**
    1. Bungkus teks nomor rekening `901331745328` dan ikon *copy* ke dalam sebuah *flex container*: 
       `<div className="flex items-center gap-2 mt-1">`
    2. Ubah teks nomor rekening menjadi lebih tebal (`text-lg font-bold tracking-wider`).
    3. Tambahkan tombol interaktif di sebelahnya (Gunakan ikon `Copy` dari `lucide-react`).
    4. **Micro-interaction:** Render kondisional pada ikon. 
       - Jika `isCopied === false`, tampilkan ikon `Copy` warna abu-abu.
       - Jika `isCopied === true`, tampilkan ikon `Check` warna hijau (`text-green-500`) dan tambahkan teks kecil `"Disalin!"` di sebelahnya agar *user* mendapat kepastian.

Silakan eksekusi fitur mikro-interaksi ini sekarang agar *flow* pembayaran manual menjadi 100% *frictionless* (tanpa hambatan) bagi calon pelanggan!