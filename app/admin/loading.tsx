// loading.tsx — PRD-v211: Native Next.js Skeleton UI (no spinner!)
// Muncul HANYA jika server butuh waktu ekstra (cold start / koneksi lambat).
// Jika navigasi cepat, file ini hampir tidak akan terlihat.

export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-slate-200 rounded-xl mb-3" />
        <div className="h-4 w-96 bg-slate-100 rounded-lg" />
      </div>

      {/* Stats cards skeleton — mirip layout Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-4 w-24 bg-slate-200 rounded-lg" />
              <div className="h-10 w-10 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-7 w-32 bg-slate-200 rounded-lg" />
            <div className="h-3 w-20 bg-slate-100 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main content area skeleton — mirip layout tabel/kartu produk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom utama lebar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div className="h-5 w-32 bg-slate-200 rounded-lg" />
            <div className="h-9 w-28 bg-slate-100 rounded-xl" />
          </div>
          {/* Table rows */}
          <div className="divide-y divide-slate-50">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 bg-slate-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-lg" style={{ width: `${55 + (i % 3) * 15}%` }} />
                  <div className="h-3 w-24 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Kolom samping kanan */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="h-5 w-32 bg-slate-200 rounded-lg" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-slate-100 rounded-lg" style={{ width: `${40 + i * 10}%` }} />
                <div className="h-5 w-16 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="h-5 w-40 bg-slate-200 rounded-lg mb-4" />
            <div className="h-32 w-full bg-slate-100 rounded-xl" />
            <div className="h-4 w-full bg-slate-100 rounded-lg" />
            <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
