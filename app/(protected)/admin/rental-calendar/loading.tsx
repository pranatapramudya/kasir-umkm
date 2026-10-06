export default function AdminLoading() {
  return (
    <div className="w-full h-full p-4 sm:p-6 space-y-6 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-28 bg-slate-200 rounded-xl hidden sm:block"></div>
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-6 w-32 bg-slate-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-5 w-36 bg-slate-200 rounded"></div>
          <div className="h-9 w-44 bg-slate-100 rounded-xl"></div>
        </div>

        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-200 rounded-lg shrink-0"></div>
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-slate-200 rounded"></div>
                  <div className="h-3 w-24 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="h-5 w-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
