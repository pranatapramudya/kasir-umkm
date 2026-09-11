"use client";

import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import { Store, CheckCircle2, AlertCircle, Link2, Loader2, Pencil, Copy } from "lucide-react";

interface Props {
  initialSlug: string | null;
  appUrl: string;
  tenantCategory?: string | null;
}

export default function SlugForm({ initialSlug, appUrl, tenantCategory }: Props) {
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [inputValue, setInputValue] = useState(initialSlug ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const currentOrigin = origin || appUrl || "";

  const bookingLink = slug
    ? `${currentOrigin}/book/${slug}`
    : null;

  const previewLink = inputValue.trim()
    ? `${currentOrigin}/book/${inputValue.trim().toLowerCase()}`
    : null;

  const handleCopyLink = () => {
    if (bookingLink) {
      navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  function handleInput(val: string) {
    // Auto-format: lowercase, ganti spasi dengan strip
    const formatted = val
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setInputValue(formatted);
    setError(null);
    setSuccess(false);
  }

  async function handleSave() {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/tenant/slug", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: inputValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
        return;
      }

      setSlug(data.slug);
      setInputValue(data.slug);
      mutate('/api/tenant/slug');
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
    setInputValue(slug);
    setIsEditing(false);
    setError(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">Link Booking & Etalase Publik</h2>
            <p className="text-xs text-slate-500">Atur link reservasi dan booking online toko Anda</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Slug Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Slug Toko
            <span className="ml-1.5 text-xs font-normal text-slate-400">(URL unik toko Anda)</span>
          </label>

          {isEditing ? (
            <div className="space-y-2">
              {/* Input with prefix */}
              <div className="flex rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden transition-all">
                <span className="flex items-center px-3 bg-slate-50 border-r border-slate-200 text-slate-400 text-sm font-mono whitespace-nowrap overflow-x-auto max-w-[200px] sm:max-w-none">
                  {currentOrigin ? `${currentOrigin}/book/` : "/book/"}
                </span>
                <input
                  id="slug-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInput(e.target.value)}
                  placeholder="nama-toko-kamu"
                  disabled={isLoading}
                  maxLength={50}
                  className="flex-1 px-3 py-2.5 text-sm font-mono text-slate-800 bg-white outline-none disabled:opacity-60 placeholder-slate-300"
                  autoFocus
                />
                <span className="flex items-center px-3 bg-slate-50 border-l border-slate-200 text-slate-400 text-xs">
                  {inputValue.length}/50
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gunakan huruf kecil, angka, dan strip (-). Contoh: <span className="font-mono">salon-cantik</span>
              </p>

              {/* Preview link */}
              {previewLink && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                  <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-500 truncate">{previewLink}</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  id="save-slug-btn"
                  onClick={handleSave}
                  disabled={isLoading || !inputValue.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {isLoading ? "Menyimpan..." : "Simpan Slug"}
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
            /* Display mode */
            <div className="space-y-3">
              {slug ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
                    <span className="text-slate-400 text-sm font-mono whitespace-nowrap">{currentOrigin ? `${currentOrigin}/book/` : "/book/"}</span>
                    <span className="font-mono font-bold text-slate-800 text-sm whitespace-nowrap">{slug}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-sm text-amber-700">Slug belum diatur. Klik <strong>Edit</strong> untuk membuatnya.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Booking Link Display */}
        {bookingLink && !isEditing && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Link Booking Publik Toko
              </p>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-md transition-colors active:scale-95"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Tersalin!" : "Salin Link"}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link2 className="w-4 h-4 text-blue-500 shrink-0" />
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-blue-700 hover:underline break-all"
              >
                {bookingLink}
              </a>
            </div>
          </div>
        )}

        {/* Education Tips Display */}
        {!isEditing && tenantCategory && (tenantCategory.toUpperCase().includes('JASA') || tenantCategory.toUpperCase().includes('RENTAL') || tenantCategory.toUpperCase().includes('SERVIS') || tenantCategory.toUpperCase().includes('TRAVEL')) && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-start gap-3 shadow-sm">
            <div>
              <p className="text-xs text-blue-700 leading-relaxed">
                {(tenantCategory.toUpperCase().includes('JASA') || tenantCategory.toUpperCase().includes('SERVIS'))
                  ? "💡 Tips: Bagikan link ini di bio Instagram atau WhatsApp Anda. Pelanggan dapat melihat layanan Anda dan memesan slot waktu secara mandiri, sehingga Anda tidak perlu membalas chat satu per satu."
                  : "💡 Tips: Berikan link ini kepada calon penyewa. Mereka dapat melihat armada/barang mana yang sedang tersedia dan langsung melakukan *booking* sesuai tanggal, sehingga Anda terhindar dari bentrok jadwal penyewaan."}
              </p>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700">Slug berhasil disimpan!</p>
          </div>
        )}
      </div>
    </div>
  );
}
