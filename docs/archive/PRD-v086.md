# Product Requirements Document: PJTECH KASIR POS
**Versi:** 0.0.86
**Fokus:** Bug Form Kategori & Arsitektur Varian Produk Retail (SaaS Flexibility)

## 1. Analisis Bug & Kebutuhan Fitur Bisnis
*   **Bug UI (Form Default State):** Saat membuka modal "Tambah Produk Baru", input Kategori otomatis terisi "Makanan". Ini tidak sesuai untuk aplikasi SaaS multi-industri. Input harus kosong secara *default*.
*   **Kebutuhan Retail (Sepatu/Pakaian):** Skema produk saat ini terlalu dasar. Target UMKM (Toko Sepatu) membutuhkan pencatatan Merek (*Brand*) dan Ukuran (*Size*). 
*   **Tujuan:** Menambahkan kolom `brand` dan `variant` pada *database* agar sistem lebih fleksibel. Serta mengatur nilai *default* stok menjadi 100 untuk mempercepat proses *data entry* UMKM.

## 2. Instruksi Eksekusi Mutlak untuk AI Agent
Lakukan pembaruan skema *database*, lalu sesuaikan antarmuka Modal Tambah Produk.

### A. Pembaruan Skema Database (Prisma)
*   **Target File:** `prisma/schema.prisma`
*   **Instruksi Tambahan Model:**
    1. Pada model `Product`, tambahkan dua kolom baru yang bersifat opsional (*nullable*):
       - `brand String?` (Untuk menyimpan Merek, misal: Nike, Pro Att)
       - `variant String?` (Untuk menyimpan Varian/Ukuran, misal: Size 40, Anak-anak, XL)
    2. *(Ingatkan pengguna untuk menjalankan `npx prisma db push` dan `npx prisma generate` setelah skema diperbarui).*

### B. Perbaikan Bug Default State pada Form Modal
*   **Target File:** Komponen form Modal "Tambah Produk Baru" (misal: `app/admin/produk/ProductForm.tsx` atau sejenisnya).
*   **Instruksi React State:**
    1. Cari deklarasi state untuk Kategori (misal: `const [category, setCategory] = useState("Makanan")`).
    2. Ubah inisialisasi awalnya menjadi *string* kosong: `useState("")`. Tambahkan *placeholder* "Misal: Sepatu Pria" pada elemen `<input>` nya.
    3. Cari deklarasi state untuk Stok (misal: `const [stock, setStock] = useState(0)`).
    4. Ubah inisialisasi awalnya menjadi `100`: `useState(100)`.

### C. Penambahan Input Merek & Varian pada UI Form
*   **Target File:** Komponen form Modal "Tambah Produk Baru".
*   **Instruksi UI (Tailwind):**
    1. Buat dua *React State* baru untuk `brand` dan `variant`.
    2. Tambahkan dua kolom input baru ke dalam form:
       - **Input 1:** Label "Merek (Opsional)" dengan *placeholder* "Mis. Nike, Adidas".
       - **Input 2:** Label "Varian / Ukuran (Opsional)" dengan *placeholder* "Mis. Size 40, Warna Hitam".
    3. Pastikan kedua input baru ini disejajarkan dengan rapi (bisa menggunakan *grid cols-2*) agar modal tidak terlalu panjang ke bawah.
    4. Saat form di-*submit*, pastikan data `brand` dan `variant` ikut dikirim ke *Server Action* atau API yang bertugas melakukan `prisma.product.create()`.