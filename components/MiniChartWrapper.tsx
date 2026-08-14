"use client";

import dynamic from 'next/dynamic';

const MiniChart = dynamic(() => import('./MiniChart').then(m => m.MiniChart), { 
  ssr: false,
  loading: () => <div className="h-16 w-full mt-2 animate-pulse bg-blue-50/50 rounded-b-2xl"></div>
});

export function MiniChartWrapper() {
  return <MiniChart />;
}
