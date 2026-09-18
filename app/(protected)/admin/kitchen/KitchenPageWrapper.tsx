"use client";

import dynamic from 'next/dynamic';

const KitchenPageClient = dynamic(() => import('./KitchenPageClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function KitchenPageWrapper() {
  return <KitchenPageClient />;
}