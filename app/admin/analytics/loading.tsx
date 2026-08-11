// loading.tsx — PRD-v211: Skeleton untuk halaman Analitik
export default function AnalyticsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse pb-12">
      {/* Header card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <div className="space-y-3">
          <div className="h-8 w-72 bg-slate-200 rounded-xl" />
          <div className="h-4 w-full max-w-lg bg-slate-100 rounded-lg" />
          <div className="h-4 w-2/3 max-w-md bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Chart cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-slate-200 rounded-lg" />
                <div className="h-3 w-56 bg-slate-100 rounded-lg" />
              </div>
            </div>
            {/* Chart placeholder */}
            <div className="h-48 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
