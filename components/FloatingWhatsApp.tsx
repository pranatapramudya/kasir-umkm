"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Jangan tampilkan di halaman dashboard operasional kasir / admin / superadmin
  const isExcluded =
    pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin");

  useEffect(() => {
    // Tampilkan tooltip sapaan secara otomatis setelah 2.5 detik jika belum pernah di-dismiss
    const timer = setTimeout(() => {
      if (!hasDismissed) {
        setIsOpen(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasDismissed]);

  if (isExcluded) return null;

  const phoneNumber = "6285723256427";
  const defaultMessage =
    "Halo PJTech, saya ingin konsultasi / tanya tentang aplikasi kasir UMKM...";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside
      aria-label="Bantuan WhatsApp PJTech"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 font-sans select-none print:hidden"
    >
      {/* Pop-up Tooltip Sapaan Otomatis */}
      {isOpen && (
        <div className="relative max-w-xs sm:max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 shadow-2xl shadow-emerald-500/10 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => {
              setIsOpen(false);
              setHasDismissed(true);
            }}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup pesan bantuan"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-2.5 pr-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
              PJ
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Tim Konsultasi PJTech
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                Halo! Butuh rekomendasi paket atau mau coba{" "}
                <strong>demo kasir gratis</strong>? Chat kami langsung ya! 👋
              </p>
            </div>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Mulai Chat WhatsApp</span>
          </a>
        </div>
      )}

      {/* Tombol Utama Floating WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 px-3.5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
        aria-label="Hubungi Customer Support PJTech via WhatsApp di 085723256427"
      >
        {/* Radar Pulse Effect */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-400 opacity-40 group-hover:opacity-60 blur-sm animate-pulse pointer-events-none" />

        {/* WhatsApp SVG Icon */}
        <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-white stroke-white"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>

        {/* Text on Desktop / Tablet */}
        <span className="relative hidden sm:inline-block font-bold text-xs pr-1 tracking-wide">
          Chat WhatsApp
        </span>

        {/* Online Dot */}
        <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping absolute opacity-75" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        </span>
      </a>
    </aside>
  );
}
