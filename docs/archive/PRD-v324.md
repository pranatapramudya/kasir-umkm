# Product Requirements Document: PJTECH KASIR UMKM
**Versi:** 0.3.24
**Fokus:** Penambahan Input Jam Penjemputan pada Form Booking Rental

## 1. Analisis Masalah
Formulir *booking* publik saat ini (khususnya untuk tenant Rental/Travel) hanya meminta input `Tanggal Mulai` dan `Tanggal Selesai` menggunakan format *Date* biasa (YYYY-MM-DD). Hal ini tidak memadai untuk operasional penyewaan armada karena admin/supir membutuhkan informasi presisi mengenai **Jam Penjemputan** atau jam pengiriman unit ke pelanggan.

## 2. Instruksi Eksekusi (Frontend Form & Payload Formatting)
**Target File:** Komponen `BookingForm.tsx` (Form publik Katalog Slug).

**Tugas Anda (KERJAKAN TANPA MENAMPILKAN CONTOH KODE KEPADA SAYA):**

**A. Tambahkan UI Input Jam Penjemputan:**
1. Buka komponen yang me-render form "Mulai Sewa" dan "Selesai Sewa".
2. Tepat di bawah baris input tanggal tersebut, tambahkan satu blok input baru.
3. Label: **"JAM PENJEMPUTAN / PENGIRIMAN *"** (Wajib diisi).
4. Gunakan elemen HTML `<input type="time">` agar muncul *Time Picker* bawaan browser.
5. Buat *state* baru, misalnya `pickupTime` (dengan nilai default kosong atau "08:00").

**B. Penggabungan Payload Date + Time (Krusial!):**
1. Saat ini, state "Mulai Sewa" (misal: `startDate`) hanya berisi tanggal.
2. Pada fungsi `handleSubmit` (sebelum mengirim payload `POST` ke API `/api/booking`), ambil *value* dari tanggal "Mulai Sewa" dan gabungkan dengan *value* dari "Jam Penjemputan".
3. Format gabungannya harus membentuk string ISO yang valid. Contoh logika JS: 
   `const finalStartDateTime = new Date(startDateSelected + 'T' + pickupTimeSelected + ':00');`
4. Kirimkan `finalStartDateTime` ini sebagai nilai untuk `startDate` ke *database*.

**C. Conditional Rendering (Khusus Rental):**
1. Pastikan input **"Jam Penjemputan / Pengiriman"** ini HANYA dirender BILA tipe bisnis (*tenant*) adalah **Rental / Travel**.
2. Jika tipe bisnis adalah Jasa (Klinik/Barbershop), sembunyikan input waktu ini karena jadwal pelayanan mereka sudah ter-cover oleh *Slot Waktu* (Time Slots) yang dipilih di awal form.

Silakan eksekusi penambahan field waktu ini! Lapor jika pelanggan Rental sudah bisa menentukan jam berapa mereka ingin dijemput!