-- ==============================================================================
-- KASIR UMKM - SUPABASE RLS HARDENING SCRIPT
-- ==============================================================================
-- Script ini dirancang untuk menutup celah 'Publicly Accessible Tables' di Supabase.
-- Prisma (aplikasi utama) terhubung menggunakan 'postgres' role yang mem-bypass RLS.
-- Dengan mengaktifkan RLS dan membuat kebijakan ketat, kita mencegah entitas luar
-- mengakses data langsung melalui Supabase REST/GraphQL API.
-- ==============================================================================

-- 1. Mengaktifkan Row Level Security (RLS) pada SEMUA tabel utama
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Employee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TransactionItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DiningTable" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PushSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- 2. Menciptakan kebijakan blokir total (Deny All) untuk API Publik (anon/authenticated)
-- Karena aplikasi ini menggunakan Next.js API (Prisma) dengan Clerk Autentikasi,
-- akses langsung dari Supabase Client API harus diblokir sepenuhnya untuk keamanan absolut.
-- Prisma menggunakan koneksi connection-pooler/postgres yang mengabaikan RLS ini, 
-- sehingga aplikasi Kasir Anda akan tetap berjalan normal secara internal.

CREATE POLICY "Block all access to Tenant from public API" ON "Tenant" FOR ALL USING (false);
CREATE POLICY "Block all access to Employee from public API" ON "Employee" FOR ALL USING (false);
CREATE POLICY "Block all access to product from public API" ON "product" FOR ALL USING (false);
CREATE POLICY "Block all access to Transaction from public API" ON "Transaction" FOR ALL USING (false);
CREATE POLICY "Block all access to TransactionItem from public API" ON "TransactionItem" FOR ALL USING (false);
CREATE POLICY "Block all access to DiningTable from public API" ON "DiningTable" FOR ALL USING (false);
CREATE POLICY "Block all access to Expense from public API" ON "Expense" FOR ALL USING (false);
CREATE POLICY "Block all access to Booking from public API" ON "Booking" FOR ALL USING (false);
CREATE POLICY "Block all access to PushSubscription from public API" ON "PushSubscription" FOR ALL USING (false);
CREATE POLICY "Block all access to AuditLog from public API" ON "AuditLog" FOR ALL USING (false);
