"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Store, Phone, Tag, CheckCircle2, AlertCircle, Loader2, Pencil, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Props {
  initialName: string;
  initialPhone: string;
  category: string;
}

export default function StoreProfileForm({
  initialName,
  initialPhone,
  category,
}: Props) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [inputName, setInputName] = useState(initialName);
  const [inputPhone, setInputPhone] = useState(initialPhone);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalisasi label kategori untuk tampilan
  const getCategoryLabel = (cat: string) => {
    const upper = (cat || "").toUpperCase();
    if (upper.includes("FNB") || upper.includes("KULINER")) return "F&B / Kuliner";
    if (upper.includes("RETAIL") || upper.includes("RITEL")) return "Retail / Toko";
    if (upper.includes("RENTAL") || upper.includes("TRAVEL")) return "Rental & Travel";
    if (upper.includes("JASA") || upper.includes("SERVIS")) return "Jasa / Servis";
    return cat || "Umum";
  };

  const categoryColorClass = () => {
    const upper = (category || "").toUpperCase();
    if (upper.includes("FNB") || upper.includes("KULINER")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (upper.includes("RETAIL") || upper.includes("RITEL")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (upper.includes("RENTAL") || upper.includes("TRAVEL")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (upper.includes("JASA") || upper.includes("SERVIS")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  async function handleSave() {
    if (!inputName.trim()) {
      setError("Nama toko / usaha tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/tenant/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputName.trim(),
          phone: inputPhone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan saat menyimpan profil toko.");
        return;
      }

      setName(data.name);
      setPhone(data.phone ?? "");
      setInputName(data.name);
      setInputPhone(data.phone ?? "");
      setIsEditing(false);
      setSuccess(true);
      toast.success("Profil toko berhasil diperbarui!");
      mutate("/api/tenant/slug");
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setInputName(name);
    setInputPhone(phone);
    setIsEditing(false);
    setError(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-sky-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">Profil & Identitas Toko</h2>
            <p className="text-xs text-slate-500">Informasi toko yang digunakan pada sistem dan struk kasir POS</p>
          </div>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profil
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profil toko berhasil disimpan.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isEditing ? (
          /* FORM EDITING */
          <div className="space-y-4">
            <div>
              <label htmlFor="store-name-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nama Toko / Usaha <span className="text-red-500">*</span>
              </label>
              <input
                id="store-name-input"
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                placeholder="Cth: Toko Berkah Jaya"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">Nama ini akan tercetak pada bagian atas struk kasir.</p>
            </div>

            <div>
              <label htmlFor="store-phone-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nomor Telepon / WhatsApp Bisnis
              </label>
              <input
                id="store-phone-input"
                type="tel"
                value={inputPhone}
                onChange={(e) => {
                  setInputPhone(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                placeholder="Cth: 08123456789"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-slate-400 mt-1">Nomor kontak untuk layanan pelanggan dan struk kasir.</p>
            </div>

            {/* Kategori Usaha (Read-only saat edit) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori Usaha</span>
                  <span className="text-sm font-bold text-slate-800">{getCategoryLabel(category)}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${categoryColorClass()}`}>
                  {getCategoryLabel(category)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Kategori usaha ditentukan saat registrasi toko untuk menyesuaikan alur POS.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          /* DISPLAY VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                Nama Toko
              </span>
              <p className="text-base font-bold text-slate-800 break-words">{name || "Belum diatur"}</p>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                No. Telepon / WA
              </span>
              <p className="text-base font-bold text-slate-800 break-words">{phone || "-"}</p>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Kategori Usaha
              </span>
              <div className="mt-0.5">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${categoryColorClass()}`}>
                  {getCategoryLabel(category)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
