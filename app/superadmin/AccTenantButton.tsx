"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccTenantButton({ tenantId, plan }: { tenantId: string, plan: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAcc = async () => {
    if (!confirm(`Konfirmasi pembayaran untuk paket ${plan}?`)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/superadmin/acc-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, plan }),
      });

      if (res.ok) {
        alert('Berhasil di-ACC!');
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Gagal: ${data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAcc}
      disabled={isLoading}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-md text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
      ACC
    </button>
  );
}
