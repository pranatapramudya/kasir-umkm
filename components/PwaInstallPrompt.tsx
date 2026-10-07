"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Smartphone, CheckCircle, ArrowRight } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activePlatform, setActivePlatform] = useState<"android" | "ios">("android");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cek apakah aplikasi sudah berjalan dalam mode PWA / Standalone
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Cek apakah prompt pernah di-dismiss
    if (window.localStorage.getItem("pwa_prompt_dismissed") === "true") {
      return;
    }

    // Deteksi perangkat iOS (iPhone, iPad, iPod)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIos) {
      setActivePlatform("ios");
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Handler untuk Chromium / Android (beforeinstallprompt)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setActivePlatform("android");
      
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1500);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (activePlatform === "ios") {
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      setActivePlatform("android");
    }
  };

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pwa_prompt_dismissed", "true");
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-6 md:left-auto md:right-6 md:w-[420px] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-3xl p-5 flex flex-col gap-4 text-slate-900 dark:text-white">
        
        {/* Header Prompt */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-blue-600/30 bg-blue-600 shrink-0 flex items-center justify-center">
              <Image
                src="/logo-app.png"
                alt="PJTECH Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Install PJTECH KASIR
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Akses aplikasi lebih cepat tanpa browser.
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Tutup notifikasi install"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Selector Switcher (Android & iOS) */}
        <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActivePlatform("android")}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "android"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            <span>🤖 Android</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePlatform("ios")}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activePlatform === "ios"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            <span>🍎 iPhone / iPad (iOS)</span>
          </button>
        </div>

        {/* Content based on Active Platform */}
        {activePlatform === "android" ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Pasang ke HP Android untuk membuka kasir secara instan, tanpa download ratusan MB dari Play Store.
            </p>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-1.5"
              >
                <span>Install Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 space-y-2">
              <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                Cara Pasang di iPhone / iPad (Safari):
              </p>
              <ol className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
                  <span>Buka di browser <strong>Safari</strong> (wajib).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
                  <span>Ketuk ikon <strong>Bagikan (Share)</strong> [kotak panah atas di bilah menu bawah].</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400">3.</span>
                  <span>Pilih <strong>"Tambah ke Layar Utama"</strong> (Add to Home Screen), lalu ketuk <strong>Tambah</strong>.</span>
                </li>
              </ol>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/30 flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Siap, Mengerti!</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
