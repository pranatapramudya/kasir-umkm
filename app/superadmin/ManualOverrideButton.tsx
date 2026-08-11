"use client";

import { useState } from "react";
import { Edit, X, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface ManualOverrideProps {
  tenantId: string;
  currentPlan: string;
  currentStatus: string;
}

export default function ManualOverrideButton({ tenantId, currentPlan, currentStatus }: ManualOverrideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [plan, setPlan] = useState(currentPlan);
  const [status, setStatus] = useState(currentStatus);

  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/superadmin/update-tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, plan, status }),
      });

      if (res.ok) {
        setIsOpen(false);
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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
        title="Edit Langganan Manual"
      >
        <Edit className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Manual Override</h3>
              <button
                type="button"
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Paket Langganan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="FREE">Free</option>
                  <option value="PRO_SEMI_ANNUAL">Pro 6 Bulan</option>
                  <option value="PRO_YEARLY">Pro 1 Tahun</option>
                  <option value="PRO_YEARLY_BUNDLE">Pro 1 Tahun + Bundle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TRIAL">TRIAL</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mt-2">
                <p className="text-xs text-yellow-800">
                  <strong>Peringatan:</strong> Menyimpan perubahan ke paket PRO dengan status ACTIVE akan memicu reset tanggal kedaluwarsa secara otomatis.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
