export default function RootLoading() {
  return (
    <div className="flex h-screen w-full bg-slate-50 animate-pulse overflow-hidden">
      
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col w-64 h-full bg-white border-r border-slate-100 p-6 shrink-0">
        <div className="h-8 w-3/4 bg-slate-200 rounded-xl mb-12" />
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-3 w-1/2 bg-slate-100 rounded-md mb-2" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-slate-100 rounded-xl" />
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="h-3 w-1/2 bg-slate-100 rounded-md mb-2" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navigation Skeleton */}
        <div className="h-16 w-full bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="h-10 w-64 bg-slate-100 rounded-xl" />
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-slate-100 rounded-full" />
            <div className="h-10 w-10 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Workspace Skeleton */}
        <div className="flex-1 p-6 lg:p-8 flex gap-6">
          
          {/* Main Area (Products/Dashboard) */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-slate-200 rounded-xl" />
              <div className="h-10 w-32 bg-slate-100 rounded-xl" />
            </div>
            
            <div className="flex gap-3 mb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-slate-200 rounded-full" />
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm aspect-square flex flex-col">
                  <div className="flex-1 bg-slate-100 rounded-xl mb-3" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded-md mb-2" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (Cart/Details) Skeleton */}
          <div className="hidden xl:flex flex-col w-80 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 shrink-0 h-full">
            <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
              <div className="h-6 w-32 bg-slate-200 rounded-lg" />
              <div className="h-6 w-16 bg-slate-100 rounded-lg" />
            </div>
            
            <div className="flex-1 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-12 w-12 bg-slate-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-full bg-slate-200 rounded-md" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-slate-100 rounded-md" />
                <div className="h-4 w-24 bg-slate-200 rounded-md" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-slate-200 rounded-md" />
                <div className="h-6 w-32 bg-slate-300 rounded-md" />
              </div>
              <div className="h-14 w-full bg-blue-200 rounded-xl mt-4" />
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
