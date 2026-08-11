// loading.tsx — PRD-v211: Skeleton untuk halaman Produk/Layanan
export default function ProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-72 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Search bar */}
      <div className="h-10 w-full max-w-md bg-slate-100 rounded-xl" />

      {/* Product cards grid */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100">
              <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-3/4 bg-slate-200 rounded-lg" />
                <div className="h-3 w-1/2 bg-slate-100 rounded-lg" />
                <div className="h-3 w-16 bg-slate-100 rounded-lg" />
                <div className="h-5 w-24 bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
