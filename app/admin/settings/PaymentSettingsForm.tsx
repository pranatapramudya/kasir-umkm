"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, AlertCircle, Loader2, Pencil } from "lucide-react";

interface Props {
  initialWhatsApp: string | null;
  initialBankName: string | null;
  initialBankAccount: string | null;
  initialBankAccountName: string | null;
}

export default function PaymentSettingsForm({
  initialWhatsApp,
  initialBankName,
  initialBankAccount,
  initialBankAccountName,
}: Props) {
  const [whatsApp, setWhatsApp] = useState(initialWhatsApp ?? "");
  const [bankName, setBankName] = useState(initialBankName ?? "");
  const [bankAccount, setBankAccount] = useState(initialBankAccount ?? "");
  const [bankAccountName, setBankAccountName] = useState(initialBankAccountName ?? "");
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/tenant/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adminWhatsApp: whatsApp,
          bankName,
          bankAccount,
          bankAccountName
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }

      setWhatsApp(data.adminWhatsApp ?? "");
      setBankName(data.bankName ?? "");
      setBankAccount(data.bankAccount ?? "");
      setBankAccountName(data.bankAccountName ?? "");
      
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setWhatsApp(initialWhatsApp ?? "");
    setBankName(initialBankName ?? "");
    setBankAccount(initialBankAccount ?? "");
    setBankAccountName(initialBankAccountName ?? "");
    setIsEditing(false);
    setError(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">Informasi Pembayaran</h2>
            <p className="text-xs text-slate-500">Data rekening untuk pembayaran & konfirmasi via WA</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      <div className="px-6 py-5 space-y-5">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Admin
              </label>
              <input
                type="text"
                value={whatsApp}
                onChange={(e) => setWhatsApp(e.target.value)}
                placeholder="081234567890"
                disabled={isLoading}
                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60"
              />
              <p className="text-xs text-slate-400 mt-1">Gunakan format angka (contoh: 0812... atau 62812...)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Bank
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="BCA, Mandiri, dll."
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="1234567890"
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Atas Nama (Pemilik Rekening)
              </label>
              <input
                type="text"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="Budi Santoso"
                disabled={isLoading}
                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all disabled:opacity-60"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isLoading ? "Menyimpan..." : "Simpan Info"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold mb-1">Nomor WhatsApp Admin</p>
                <p className="text-sm font-bold text-slate-800">{whatsApp || <span className="text-slate-400 italic">Belum diatur</span>}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold mb-1">Bank</p>
                <p className="text-sm font-bold text-slate-800">{bankName || <span className="text-slate-400 italic">Belum diatur</span>}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold mb-1">Nomor Rekening</p>
                <p className="text-sm font-bold text-slate-800">{bankAccount || <span className="text-slate-400 italic">Belum diatur</span>}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 font-semibold mb-1">Atas Nama</p>
                <p className="text-sm font-bold text-slate-800">{bankAccountName || <span className="text-slate-400 italic">Belum diatur</span>}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700">Informasi pembayaran berhasil disimpan!</p>
          </div>
        )}
      </div>
    </div>
  );
}
