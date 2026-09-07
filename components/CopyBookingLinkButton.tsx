"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Link2, Check } from "lucide-react";

interface Props {
  initialSlug?: string | null;
  className?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil data slug");
  return res.json();
};

export function CopyBookingLinkButton({ initialSlug, className = "" }: Props) {
  const { data } = useSWR('/api/tenant/slug', fetcher, {
    fallbackData: initialSlug ? { slug: initialSlug } : undefined,
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  const [copied, setCopied] = useState(false);
  const currentSlug = data?.slug ?? initialSlug;

  const handleCopy = async () => {
    if (!currentSlug) {
      toast.error("Slug toko belum diatur. Silakan atur di menu Pengaturan Toko.");
      return;
    }

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/book/${currentSlug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link booking toko berhasil disalin! Siap dibagikan ke WhatsApp / Media Sosial.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin link toko.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Salin Link Booking / Etalase Toko"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 shadow-xs cursor-pointer ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in" />
          <span className="text-emerald-700 font-bold hidden sm:inline">Tersalin!</span>
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Salin Link Toko</span>
        </>
      )}
    </button>
  );
}
