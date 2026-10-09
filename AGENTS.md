# kasir-umkm — AI Agent Context

## Apa ini?
SaaS POS (Point of Sale) multi-tenant untuk UMKM Indonesia. Stack: Next.js, Prisma, Neon PostgreSQL, Clerk Auth, Tailwind CSS. Deploy di Vercel. Harga: Rp 990.000/tahun.

## Verticals yang Sudah Selesai
| Vertikal | Fitur Unggulan |
|----------|----------------|
| Retail | Offline-first (IndexedDB), Bluetooth thermal printer auto-detect, CSV/Jurnal export |
| F&B | Table grid, Split Bill, KDS (Kitchen Display), Kitchen/Bar ticket routing |
| Jasa/Servis | Jadwal Booking, komisi staf/teknisi, slot jam fleksibel, antrean online murni |
| Rental/Travel/Properti/Alat | Kalender Sewa (anti collision), DP & Pelunasan, Surat Jalan/Invoice A4/A5, Niche Adaptive (Kendaraan/Properti/Alat) |

## Arsitektur
```
app/                  ← Next.js App Router (Next 16 Turbopack)
  (auth)/             ← Clerk login/register
  dashboard/          ← Main app (multi-tenant, filter by userId/tenantId)
  api/                ← API routes
components/           ← UI components
prisma/schema.prisma  ← DB schema (sync ke Neon via `npx prisma db push`)
lib/                  ← Utilities, prisma client
```

## Rules Krusial untuk Agent
1. **Multi-tenant** — semua query WAJIB filter `userId` atau `tenantId` dari Clerk session. Jangan pernah query tanpa filter tenant.
2. **Prisma sync** — setiap edit `prisma/schema.prisma`, langsung jalankan `npx prisma db push` sebelum test. Kolom yang tidak sync menyebabkan error P2022 di semua query global.
3. **Dev server** — jalankan via `npm run dev` (bukan `next dev` langsung), ada orchestrator.js di depannya.
4. **TypeScript gate** — sebelum deploy/commit, wajib `npx tsc --noEmit` harus pass.
5. **F&B category detection** — normalize dengan `toLowerCase().trim()`, support alias: `fnb`, `f&b`, `f&b / kuliner`, `resto`, `kuliner`.
6. **KDS** — menu item tampil di sidebar SELALU, apapun kategorinya.
7. **Light theme** — UI admin & KDS pakai professional light theme, HIGH contrast untuk form.

## Cara Jalankan
```bash
npm run dev          # Dev server (via orchestrator.js)
npx tsc --noEmit     # Type check
npx prisma db push   # Sync schema ke Neon
npx prisma studio    # GUI database
```

## Env Penting
- `DATABASE_URL` — Neon PostgreSQL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — Auth
- `NEXT_PUBLIC_APP_URL` — Base URL app
